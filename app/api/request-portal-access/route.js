import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getAdminAuth, getAdminDb } from '../../../lib/firebaseAdmin';
import { elegantEmail } from '../../../lib/emailTemplates';
import { ADMIN_EMAILS } from '../../../lib/adminAccess';
import { takeRateLimit } from '../../../lib/rateLimit';

// Public site origin is hardcoded (not derived from request.url) so links
// embedded in emails always point at selectivecrew.com rather than the
// Cloud Run/Hosting-internal hostname that Next.js sees behind the proxy.
const SITE_ORIGIN = 'https://selectivecrew.com';
const NOTIFY_EMAIL = 'careers@selectivecrew.com';

const CRUISE_LINES = {
  starboard: 'Starboard Retail Group',
  ncl: 'Norwegian Cruise Line',
  grandcircle: 'Grand Circle Cruise Line',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Approval links live 48 hours from filing. A claim lease this old is
// considered abandoned (crashed approver, lost response) and may be taken
// over by a fresh approval POST; recovery is always safe because
// provisioning steps are idempotent and the grant marker distinguishes our
// own interrupted users from foreign accounts (see below).
const APPROVAL_LINK_TTL_MS = 48 * 60 * 60 * 1000;
const PROCESSING_LEASE_MS = 15 * 60 * 1000;
const APPROVAL_EXPIRED_TEXT = 'This approval link expired after 48 hours. No account was created. Please ask the requester to submit a new request.';

// Every value interpolated into HTML (pages and emails) goes through this,
// including stored request data. '$' is encoded too because elegantEmail()
// inserts content with String.replace, which treats '$&', '$$', etc. in the
// replacement as special patterns (generated passwords can contain '$').
function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"'$]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '$': '&#36;',
  })[char]);
}

function msOfTimestamp(value) {
  if (!value) return 0;
  if (typeof value === 'number') return value;
  if (value instanceof Date) return value.getTime();
  if (typeof value.toMillis === 'function') return value.toMillis();
  if (typeof value.seconds === 'number') return value.seconds * 1000;
  return 0;
}

// Requests filed before expiry existed carry no expiresAt: they expire 48h
// after createdAt. A request with neither timestamp is treated as expired
// (fail closed).
function approvalExpiryMs(data) {
  const explicit = msOfTimestamp(data.expiresAt);
  if (explicit > 0) return explicit;
  const created = msOfTimestamp(data.createdAt);
  if (created > 0) return created + APPROVAL_LINK_TTL_MS;
  return 0;
}

function isExpiredData(data, now = Date.now()) {
  const expiry = approvalExpiryMs(data);
  return expiry <= 0 || now >= expiry;
}

function processingLeaseValid(data, now = Date.now()) {
  return msOfTimestamp(data.processingLeaseExpiresAt) > now;
}

// This form is public and unauthenticated, so account creation is never
// triggered directly by the visitor's submission. Submitting only files a
// pending request and emails a one-click approval link to NOTIFY_EMAIL;
// only clicking that link (and then confirming on the page it opens)
// actually creates the Firebase Auth account and grants portal access.
// The GET handler below intentionally has NO side effects - it just renders
// a confirmation page - so that email security scanners prefetching the
// link can't trigger provisioning on their own. Only the POST triggered by
// clicking the confirmation button does that.

function generatePassword() {
  const lower = 'abcdefghijkmnpqrstuvwxyz';
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const digits = '23456789';
  const symbols = '!@#$%&*?';
  const all = lower + upper + digits + symbols;
  const pick = (set) => set[crypto.randomInt(set.length)];

  const required = [pick(lower), pick(upper), pick(digits), pick(symbols)];
  const rest = Array.from({ length: 8 }, () => pick(all));
  const combined = required.concat(rest);
  for (let i = combined.length - 1; i > 0; i--) {
    const j = crypto.randomInt(i + 1);
    const tmp = combined[i]; combined[i] = combined[j]; combined[j] = tmp;
  }
  return combined.join('');
}

async function sendEmail(payload) {
  if (!process.env.RESEND_API_KEY) throw new Error('Email service is not configured');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to send email');
  }
}

function htmlPage(bodyHtml, status) {
  const html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Selective Crew</title></head>' +
    '<body style="font-family:system-ui,sans-serif;background:#f0f4f8;margin:0;padding:60px 20px">' +
    '<div style="max-width:480px;margin:0 auto;background:#fff;border-radius:16px;padding:40px;box-shadow:0 8px 40px rgba(0,0,0,0.08);text-align:center">' +
    '<div style="font-size:11px;font-weight:700;color:#c9a84c;letter-spacing:2px;text-transform:uppercase;margin-bottom:16px">Selective Crew</div>' +
    bodyHtml +
    '</div></body></html>';
  return new NextResponse(html, { status: status || 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

function notifyEmailBody(fields) {
  const name = escapeHtml(fields.name);
  const company = escapeHtml(fields.company);
  const email = escapeHtml(fields.email);
  const cruiseLineLabel = escapeHtml(fields.cruiseLineLabel);
  const portalUrl = escapeHtml(fields.portalUrl);
  const confirmUrl = escapeHtml(fields.confirmUrl);
  return (
    '<p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 20px">A new portal access request was submitted on selectivecrew.com/for-employers.</p>' +
    '<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px">' +
      '<tr><td style="padding:6px 0;color:#888;font-size:13px">Name</td><td style="padding:6px 0;font-weight:700;color:#0a1628;font-size:13px;text-align:right">' + name + '</td></tr>' +
      '<tr><td style="padding:6px 0;color:#888;font-size:13px">Company</td><td style="padding:6px 0;font-weight:700;color:#0a1628;font-size:13px;text-align:right">' + company + '</td></tr>' +
      '<tr><td style="padding:6px 0;color:#888;font-size:13px">Email</td><td style="padding:6px 0;font-weight:700;color:#0a1628;font-size:13px;text-align:right">' + email + '</td></tr>' +
      '<tr><td style="padding:6px 0;color:#888;font-size:13px">Cruise Line</td><td style="padding:6px 0;font-weight:700;color:#0a1628;font-size:13px;text-align:right">' + cruiseLineLabel + '</td></tr>' +
      '<tr><td style="padding:6px 0;color:#888;font-size:13px">Portal URL</td><td style="padding:6px 0;font-weight:700;color:#0a1628;font-size:13px;text-align:right">' + portalUrl + '</td></tr>' +
    '</table>' +
    '<div style="text-align:center">' +
      '<a href="' + confirmUrl + '" style="display:inline-block;background:linear-gradient(135deg,#0a1628,#0e4d8a);color:#fff;font-size:15px;font-weight:700;padding:14px 32px;border-radius:8px;text-decoration:none">Review Request &#8594;</a>' +
    '</div>' +
    '<p style="font-size:12px;color:#aaa;margin-top:20px">Nothing is created until you confirm on that page. The link expires 48 hours after the request was filed.</p>'
  );
}

function welcomeEmailBody(fields) {
  const name = escapeHtml(fields.name || 'there');
  const cruiseLineLabel = escapeHtml(fields.cruiseLineLabel);
  const portalUrl = escapeHtml(fields.portalUrl);
  const email = escapeHtml(fields.email);
  const password = escapeHtml(fields.password);
  return (
    '<p style="font-size:15px;color:#374151;line-height:1.8;margin:0 0 20px">Dear ' + name + ',</p>' +
    '<p style="font-size:15px;color:#374151;line-height:1.8;margin:0 0 24px">Your Selective Crew pipeline portal for <strong>' + cruiseLineLabel + '</strong> has been created. You can now log in to see real-time candidate pipeline status.</p>' +
    '<div style="background:#f0f7ff;border-radius:10px;padding:24px;margin:0 0 20px">' +
      '<table width="100%" cellpadding="0" cellspacing="0">' +
        '<tr><td style="padding:8px 0;border-bottom:1px solid #dbeafe;font-size:14px;color:#374151">Portal URL</td><td style="padding:8px 0;border-bottom:1px solid #dbeafe;font-size:14px;font-weight:700;color:#0e4d8a;text-align:right"><a href="' + portalUrl + '" style="color:#0e4d8a">' + portalUrl + '</a></td></tr>' +
        '<tr><td style="padding:8px 0;border-bottom:1px solid #dbeafe;font-size:14px;color:#374151">Login Email</td><td style="padding:8px 0;border-bottom:1px solid #dbeafe;font-size:14px;font-weight:700;color:#0e4d8a;text-align:right">' + email + '</td></tr>' +
        '<tr><td style="padding:8px 0;font-size:14px;color:#374151">Temporary Password</td><td style="padding:8px 0;font-size:14px;font-weight:700;color:#0e4d8a;text-align:right">' + password + '</td></tr>' +
      '</table>' +
    '</div>' +
    '<div style="background:#fffbeb;border-radius:8px;padding:12px 16px;margin:0 0 24px;border:1px solid #fde68a">' +
      '<p style="font-size:13px;color:#92400e;margin:0"><strong>Important:</strong> Please change your password after your first login.</p>' +
    '</div>' +
    '<div style="text-align:center">' +
      '<a href="' + portalUrl + '" style="display:inline-block;background:linear-gradient(135deg,#0a1628,#0e4d8a);color:#fff;font-size:15px;font-weight:700;padding:14px 36px;border-radius:8px;text-decoration:none">Log In to Your Portal &#8594;</a>' +
    '</div>'
  );
}

// Step 1 (public, unauthenticated): file a pending request and notify the
// team. Creates no Auth account and no Firestore client/portalUsers docs.
export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const confirmId = searchParams.get('id');
    const confirmToken = searchParams.get('token');

    const adminDb = getAdminDb();

    // Step 2 (still requires the token from the email): the confirmation
    // page's button posts back here with the same id/token to actually
    // provision access. This is the only path that touches Auth/Firestore.
    if (confirmId && confirmToken) {
      const docRef = adminDb.collection('portalAccessRequests').doc(confirmId);
      // Single-use claim: exactly one approval POST may provision this
      // request. The transaction serializes concurrent duplicates, which
      // then observe 'processing' (or a terminal state) and provision
      // nothing -- no duplicate users, no duplicate emails.
      const claim = await adminDb.runTransaction(async (transaction) => {
        const snap = await transaction.get(docRef);
        if (!snap.exists) return { outcome: 'gone' };
        const current = snap.data();
        if (current.approveToken !== confirmToken) return { outcome: 'invalid' };
        if (current.status === 'processing' && processingLeaseValid(current)) {
          return { outcome: 'busy' };
        }
        if (current.status !== 'pending' && current.status !== 'processing') {
          return { outcome: 'done' };
        }
        if (isExpiredData(current)) {
          transaction.update(docRef, { status: 'expired', processedAt: new Date() });
          return { outcome: 'expired' };
        }
        // grantId is minted once and never changes, so any later claim of
        // the same request can prove which Auth user it created.
        const grantId = current.grantId || crypto.randomBytes(12).toString('hex');
        transaction.update(docRef, {
          status: 'processing',
          grantId,
          processingLeaseExpiresAt: new Date(Date.now() + PROCESSING_LEASE_MS),
          processingAttempts: Number(current.processingAttempts || 0) + 1,
        });
        return { outcome: 'claimed', grantId, data: current };
      });

      if (claim.outcome === 'gone') return htmlPage('<p style="font-size:15px;color:#0a1628">This request no longer exists.</p>', 404);
      if (claim.outcome === 'invalid') return htmlPage('<p style="font-size:15px;color:#0a1628">Invalid approval link.</p>', 403);
      if (claim.outcome === 'done') return htmlPage('<p style="font-size:15px;color:#0a1628">This request has already been processed.</p>', 200);
      if (claim.outcome === 'busy') return htmlPage('<p style="font-size:15px;color:#0a1628">This request is already being processed. Please wait a moment and try again.</p>', 200);
      if (claim.outcome === 'expired') return htmlPage('<p style="font-size:15px;color:#0a1628">' + APPROVAL_EXPIRED_TEXT + '</p>', 200);

      // This process owns the only valid claim: provision below.
      const { name, company, cruiseLine } = claim.data;
      const email = String(claim.data.email || '').trim().toLowerCase();
      // Requests filed before the public-form checks existed are re-checked
      // here: never provision an administrator address or an unknown client.
      if (ADMIN_EMAILS.includes(email) || !EMAIL_RE.test(email) || !CRUISE_LINES[cruiseLine]) {
        await docRef.update({ status: 'error', error: 'Request not eligible for portal access', processedAt: new Date() });
        return htmlPage('<p style="font-size:15px;color:#0a1628">This request cannot be approved. No account was created.</p>', 409);
      }
      // Approvals never grant access to a deactivated client. A missing
      // `active` flag means active (pre-deactivation records); unknown
      // clients are still auto-created below.
      const preClientSnap = await adminDb.collection('clients').doc(cruiseLine).get();
      if (preClientSnap.exists && preClientSnap.data().active === false) {
        await docRef.update({ status: 'error', error: 'Client is deactivated', processedAt: new Date() });
        return htmlPage('<p style="font-size:15px;color:#0a1628">This client is deactivated. No account was created &mdash; reactivate the client or invite the user directly.</p>', 409);
      }
      const cruiseLineLabel = CRUISE_LINES[cruiseLine];
      const adminAuth = getAdminAuth();
      const portalUrl = SITE_ORIGIN + '/portal/' + encodeURIComponent(cruiseLine);

      // Resolve the account. A pre-existing account is finished only when it
      // is provably ours (an interrupted attempt of THIS grant, via the grant
      // marker or the recorded uid); anything else is foreign and needs a
      // human, exactly as before -- its password and access stay untouched.
      let userRecord;
      let password = null;
      let sendCredentials = true;
      const alreadyDelivered = claim.data.welcomeEmailSent === true;
      let preExisting = null;
      try { preExisting = await adminAuth.getUserByEmail(email); } catch (e) { /* not found is expected */ }
      if (!preExisting) {
        password = generatePassword();
        try {
          userRecord = await adminAuth.createUser({ email, password, emailVerified: false });
        } catch (e) {
          // The claim transaction excludes our own duplicates, so a
          // collision here is always external: never adopt it.
          if (e.code === 'auth/email-already-exists') {
            await docRef.update({ status: 'error', error: 'Email already has an account', processedAt: new Date() });
            return htmlPage('<p style="font-size:15px;color:#0a1628">An account for <strong>' + escapeHtml(email) + '</strong> already exists. No new account was created &mdash; please handle this one manually.</p>', 409);
          }
          throw e;
        }
        // Link the account to this grant BEFORE any other step, so every
        // later interruption state is provably recoverable. Unrelated claims
        // are preserved; this endpoint only controls clientSlug (mirrors
        // POST /api/portal-users).
        await adminAuth.setCustomUserClaims(userRecord.uid, {
          ...(userRecord.customClaims || {}),
          clientSlug: cruiseLine,
          portalGrantId: claim.grantId,
        });
        await docRef.update({ uid: userRecord.uid });
      } else {
        const fresh = (await docRef.get()).data() || {};
        const ours =
          (preExisting.customClaims && preExisting.customClaims.portalGrantId === claim.grantId) ||
          (fresh.uid && fresh.uid === preExisting.uid);
        if (!ours) {
          await docRef.update({ status: 'error', error: 'Email already has an account', processedAt: new Date() });
          return htmlPage('<p style="font-size:15px;color:#0a1628">An account for <strong>' + escapeHtml(email) + '</strong> already exists. No new account was created &mdash; please handle this one manually.</p>', 409);
        }
        // Recovery of our own interrupted attempt.
        userRecord = preExisting;
        if (alreadyDelivered || fresh.welcomeEmailSent === true) {
          // Credentials were already delivered: keep them valid, send nothing.
          sendCredentials = false;
        } else {
          // The interrupted attempt's password was never persisted and is
          // unrecoverable by design: issue a fresh one.
          password = generatePassword();
          await adminAuth.updateUser(userRecord.uid, { password });
        }
        await adminAuth.setCustomUserClaims(userRecord.uid, {
          ...(userRecord.customClaims || {}),
          clientSlug: cruiseLine,
          portalGrantId: claim.grantId,
        });
        if (!fresh.uid) await docRef.update({ uid: userRecord.uid });
      }

      // Idempotent completion steps: safe to re-run on recovery.
      const clientDoc = adminDb.collection('clients').doc(cruiseLine);
      const clientSnap = await clientDoc.get();
      if (!clientSnap.exists) {
        await clientDoc.set({ name: cruiseLineLabel, slug: cruiseLine, active: true, createdAt: new Date() });
      }

      await adminDb.collection('portalUsers').doc(userRecord.uid).set({
        email, clientSlug: cruiseLine, createdAt: new Date(), company,
      });

      // Welcome email: sent at most once per valid credential set. A prior
      // attempt that already delivered keeps the delivered password valid and
      // sends nothing here; every send pairs with the password set above, so
      // at most one delivered credential set is ever valid.
      let welcomeEmailSent = !sendCredentials;
      if (sendCredentials) try {
        await sendEmail({
          to: email,
          subject: 'Your Selective Crew Pipeline Portal Access',
          html: elegantEmail('🔑', 'Selective Crew', 'Pipeline Portal Access', welcomeEmailBody({ name, cruiseLineLabel, portalUrl, email, password })),
        });
        welcomeEmailSent = true;
        await docRef.update({ welcomeEmailSent: true });
      } catch (e) {
        welcomeEmailSent = false;
        console.error('Failed to send welcome email:', e);
        // Boolean delivery status only: no provider error text is persisted,
        // and the temporary password is never written to Firestore, logs, or
        // the response page below.
        await docRef.update({ welcomeEmailSent: false });
      }

      // The grant marker served its purpose (crash recovery above); strip it
      // so production claims stay minimal, then mark the request completed.
      const liveClaims = { ...((await adminAuth.getUser(userRecord.uid)).customClaims || {}) };
      delete liveClaims.portalGrantId;
      liveClaims.clientSlug = cruiseLine;
      await adminAuth.setCustomUserClaims(userRecord.uid, liveClaims);
      await docRef.update({ status: 'completed', processedAt: new Date(), uid: userRecord.uid });

      // Provisioning above succeeded; only email delivery may have failed.
      // Never claim the email was sent in that case. The approver can
      // re-issue credentials via Admin > Client Management > Send Invite once
      // email delivery is working, so no password needs to appear on this page.
      if (!welcomeEmailSent) {
        return htmlPage(
          '<div style="font-size:40px;margin-bottom:12px">⚠️</div>' +
          '<p style="font-size:15px;color:#92400e;font-weight:700;margin:0 0 8px">Portal access created, but the welcome email failed to send</p>' +
          '<p style="font-size:14px;color:#374151;line-height:1.7">The account for ' + escapeHtml(email) + ' was created, but the login instructions could not be delivered by email. No credentials were sent.</p>' +
          '<p style="font-size:14px;color:#374151;line-height:1.7">To deliver access, open Admin, then Client Management, and use Send Invite for ' + escapeHtml(cruiseLineLabel) + ' once email delivery is working.</p>',
          200
        );
      }

      return htmlPage(
        '<div style="font-size:40px;margin-bottom:12px">✅</div>' +
        '<p style="font-size:15px;color:#15803d;font-weight:700;margin:0 0 8px">Portal access created</p>' +
        '<p style="font-size:14px;color:#374151;line-height:1.7">A welcome email with login instructions was sent to ' + escapeHtml(email) + '.</p>',
        200
      );
    }

    // Original path: new request submitted from the public form.
    const body = await request.json();
    const name = String(body?.name || '').trim();
    const company = String(body?.company || '').trim();
    const email = String(body?.email || '').trim().toLowerCase();
    const cruiseLine = String(body?.cruiseLine || '').trim();
    const positions = String(body?.positions || '').trim();
    const message = String(body?.message || '').trim();

    if (!name || !company || !email || !cruiseLine) {
      return NextResponse.json({ error: 'name, company, email, and cruiseLine are required' }, { status: 400 });
    }
    if (!EMAIL_RE.test(email) || email.length > 254) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }
    if (!CRUISE_LINES[cruiseLine]) {
      return NextResponse.json({ error: 'Invalid cruiseLine' }, { status: 400 });
    }
    if (ADMIN_EMAILS.includes(email)) {
      return NextResponse.json({ error: 'Portal access cannot be requested for this email address' }, { status: 409 });
    }

    // Applied before any request doc is written or email is sent.
    const [ipAllowed, emailAllowed] = await Promise.all([
      takeRateLimit(request, { scope: 'portal-access-request-ip', limit: 5, windowMs: 60 * 60 * 1000 }),
      takeRateLimit(request, { scope: 'portal-access-request-email', subject: email, limit: 2, windowMs: 24 * 60 * 60 * 1000 }),
    ]);
    if (!ipAllowed || !emailAllowed) return NextResponse.json({ error: 'Please try again later' }, { status: 429 });

    const approveToken = crypto.randomBytes(24).toString('hex');
    const docRef = adminDb.collection('portalAccessRequests').doc();
    await docRef.set({
      name, company, email, cruiseLine,
      cruiseLineLabel: CRUISE_LINES[cruiseLine],
      positions, message,
      status: 'pending',
      approveToken,
      expiresAt: new Date(Date.now() + APPROVAL_LINK_TTL_MS),
      createdAt: new Date(),
    });

    const portalUrl = SITE_ORIGIN + '/portal/' + encodeURIComponent(cruiseLine);
    const confirmUrl = SITE_ORIGIN + '/api/request-portal-access?id=' + encodeURIComponent(docRef.id) + '&token=' + encodeURIComponent(approveToken);

    await sendEmail({
      to: NOTIFY_EMAIL,
      subject: 'Portal Access Request - ' + company,
      html: elegantEmail('🔑', 'Portal Access Request', escapeHtml(company), notifyEmailBody({
        name, company, email, cruiseLineLabel: CRUISE_LINES[cruiseLine], portalUrl, confirmUrl,
      })),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('request-portal-access POST error:', err);
    // Public endpoint: never expose internal error details.
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

// GET has no side effects on purpose - it only renders a confirmation page
// with a button that POSTs back to this same route. This keeps the link
// itself safe to prefetch (email security scanners routinely GET links
// automatically) without triggering account creation.
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const token = searchParams.get('token');
    if (!id || !token) return htmlPage('<p style="font-size:15px;color:#0a1628">Missing id or token.</p>', 400);

    const adminDb = getAdminDb();
    const snap = await adminDb.collection('portalAccessRequests').doc(id).get();
    if (!snap.exists) return htmlPage('<p style="font-size:15px;color:#0a1628">This request no longer exists.</p>', 404);

    const data = snap.data();
    if (data.approveToken !== token) return htmlPage('<p style="font-size:15px;color:#0a1628">Invalid approval link.</p>', 403);
    if (data.status !== 'pending') {
      return htmlPage('<p style="font-size:15px;color:#0a1628">This request has already been processed (status: ' + escapeHtml(data.status) + ').</p>', 200);
    }
    // Read-only expiry enforcement: expired links render an explanatory page
    // and are never approved. No writes here (scanner-safe by design).
    if (isExpiredData(data)) {
      return htmlPage('<p style="font-size:15px;color:#0a1628">' + APPROVAL_EXPIRED_TEXT + '</p>', 200);
    }

    const name = escapeHtml(data.name);
    const company = escapeHtml(data.company);
    const email = escapeHtml(data.email);
    const cruiseLineLabel = escapeHtml(CRUISE_LINES[data.cruiseLine] || data.cruiseLineLabel || data.cruiseLine);
    const actionUrl = escapeHtml(SITE_ORIGIN + '/api/request-portal-access?id=' + encodeURIComponent(id) + '&token=' + encodeURIComponent(token));

    const bodyHtml =
      '<p style="font-size:16px;font-weight:700;color:#0a1628;margin:0 0 20px">Confirm Portal Access Request</p>' +
      '<table width="100%" cellpadding="0" cellspacing="0" style="text-align:left;margin-bottom:24px">' +
        '<tr><td style="padding:6px 0;color:#888;font-size:13px">Name</td><td style="padding:6px 0;font-weight:700;color:#0a1628;font-size:13px;text-align:right">' + name + '</td></tr>' +
        '<tr><td style="padding:6px 0;color:#888;font-size:13px">Company</td><td style="padding:6px 0;font-weight:700;color:#0a1628;font-size:13px;text-align:right">' + company + '</td></tr>' +
        '<tr><td style="padding:6px 0;color:#888;font-size:13px">Email</td><td style="padding:6px 0;font-weight:700;color:#0a1628;font-size:13px;text-align:right">' + email + '</td></tr>' +
        '<tr><td style="padding:6px 0;color:#888;font-size:13px">Cruise Line</td><td style="padding:6px 0;font-weight:700;color:#0a1628;font-size:13px;text-align:right">' + cruiseLineLabel + '</td></tr>' +
      '</table>' +
      '<form method="POST" action="' + actionUrl + '">' +
        '<button type="submit" style="width:100%;background:linear-gradient(135deg,#0a1628,#0e4d8a);color:#fff;border:none;border-radius:10px;padding:15px;font-size:15px;font-weight:700;cursor:pointer">Create Portal Access &#8594;</button>' +
      '</form>' +
      '<p style="font-size:12px;color:#aaa;margin-top:16px">This creates a Firebase Auth account for ' + email + ' and emails them their login credentials.</p>';

    return htmlPage(bodyHtml, 200);
  } catch (err) {
    console.error('request-portal-access GET error:', err);
    // Public endpoint: never expose internal error details.
    return htmlPage('<p style="font-size:15px;color:#0a1628">Something went wrong. Please try again later.</p>', 500);
  }
}
