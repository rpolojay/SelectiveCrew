import { NextResponse } from 'next/server';
import { randomInt } from 'node:crypto';
import { getAdminAuth, getAdminDb, requireAdmin } from '../../../lib/firebaseAdmin';
import { ADMIN_EMAILS } from '../../../lib/adminAccess';
import { escapeHtml, isValidClientSlug, isValidEmail } from '../../../lib/portalValidation';

function generateTempPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let out = '';
  for (let i = 0; i < 12; i++) out += chars[randomInt(chars.length)];
  return out + '!';
}

function portalUrlFor(clientSlug) {
  // Belt-and-braces: the slug was validated at the gate below; re-check
  // before it lands in an HTML attribute.
  if (!isValidClientSlug(clientSlug)) throw new Error('Invalid client slug');
  return `https://selectivecrew.com/portal/${clientSlug}`;
}

function inviteEmailBody({ clientName, portalUrl, email, password }) {
  const text = `Hi,

You've been given access to the ${clientName} client portal on Selective Crew.

Portal URL: ${portalUrl}
Email: ${email}
Temporary password: ${password}

Please log in using the link above and let us know if you'd like your password changed.

Best regards,
Selective Crew`;
  // All untrusted values are escaped for HTML; the fixed template shape and
  // the plaintext body above are unchanged.
  const safeName = escapeHtml(clientName);
  const safeEmail = escapeHtml(email);
  const safePassword = escapeHtml(password);
  const safeUrl = escapeHtml(portalUrl);
  const html = `<div style="font-family:Arial,sans-serif;color:#0a1628;line-height:1.6">
    <p>Hi,</p>
    <p>You've been given access to the <strong>${safeName}</strong> client portal on Selective Crew.</p>
    <p>
      <strong>Portal URL:</strong> <a href="${safeUrl}">${safeUrl}</a><br/>
      <strong>Email:</strong> ${safeEmail}<br/>
      <strong>Temporary password:</strong> ${safePassword}
    </p>
    <p>Please log in using the link above and let us know if you'd like your password changed.</p>
    <p>Best regards,<br/>Selective Crew</p>
  </div>`;
  return { text, html };
}

export async function POST(request) {
  try {
    const auth = await requireAdmin(request);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const adminAuth = getAdminAuth();
    const adminDb = getAdminDb();
    const body = await request.json();
    const email = (body?.email || '').trim().toLowerCase();
    const clientSlug = (body?.clientSlug || '').trim();
    const sendInvite = !!body?.sendInvite;
    const clientName = body?.clientName || clientSlug;
    let password = body?.password || '';

    if (!email || !clientSlug) {
      return NextResponse.json({ error: 'email and clientSlug are required' }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }
    // Strict slug format (see lib/portalValidation.js); assignment writes to
    // inactive or unknown clients are also rejected by the Firestore rules.
    if (!isValidClientSlug(clientSlug)) {
      return NextResponse.json({ error: 'Invalid client slug format' }, { status: 400 });
    }
    if (typeof clientName !== 'string' || clientName.length > 120) {
      return NextResponse.json({ error: 'Invalid client name' }, { status: 400 });
    }
    if (sendInvite && !password) password = generateTempPassword();
    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // Admin accounts are never turned into portal accounts: a clientSlug
    // claim makes requireAdmin/isAdmin() reject them, and the invite path
    // below would also reset their password.
    const adminAccountError = () => NextResponse.json({ error: 'This account is an administrator and cannot be assigned to a client portal.' }, { status: 409 });
    if (ADMIN_EMAILS.includes(email)) return adminAccountError();

    // The target client must exist and be active. A missing `active` flag
    // means active (pre-deactivation records).
    const clientSnap = await adminDb.collection('clients').doc(clientSlug).get();
    if (!clientSnap.exists || clientSnap.data().active === false) {
      return NextResponse.json({ error: 'Client not found or is deactivated.' }, { status: 404 });
    }
    const effectiveClientName = body?.clientName || clientSnap.data().name || clientSlug;

    let userRecord;
    try {
      userRecord = await adminAuth.createUser({ email, password });
    } catch (err) {
      if (err.code === 'auth/email-already-exists') {
        userRecord = await adminAuth.getUserByEmail(email);
        if (userRecord.customClaims?.admin === true) return adminAccountError();
        // Never silently move an account between clients: if this email is
        // already assigned to a different client portal (via the Auth custom
        // claim or the portalUsers doc), refuse instead of resetting their
        // password or re-pointing their access. Same-client re-invites and
        // accounts with no client assignment proceed below. The response
        // names no other client, so nothing leaks to non-admin callers.
        const puDoc = await adminDb.collection('portalUsers').doc(userRecord.uid).get();
        const docSlug = puDoc.exists ? puDoc.data().clientSlug : null;
        // Presence-based, matching requireAdmin and firestore.rules: even an
        // empty-string claim counts as an assignment (and therefore conflicts
        // with any valid target slug).
        const rawClaimSlug = userRecord.customClaims ? userRecord.customClaims.clientSlug : undefined;
        const claimSlug = rawClaimSlug === undefined || rawClaimSlug === null ? null : rawClaimSlug;
        if ((docSlug && docSlug !== clientSlug) || (claimSlug !== null && claimSlug !== clientSlug)) {
          return NextResponse.json({ error: 'This email is already assigned to a different client portal. Remove that access in Client Management first, or invite a different email address.' }, { status: 409 });
        }
        // Sending an invite always re-issues a fresh password so the
        // credential in the email is guaranteed to actually work, even for
        // a pre-existing account. Plain create/link calls (sendInvite
        // false) never touch an existing account's password.
        if (sendInvite) await adminAuth.updateUser(userRecord.uid, { password });
      } else {
        throw err;
      }
    }

    // The clientSlug lives on the ID token as a custom claim so Firestore
    // rules can scope this user's reads without a get()/exists() lookup
    // (see firestore.rules for why that lookup pattern is unsafe for list
    // queries). The portalUsers doc is kept too, for the admin UI listing.
    // Existing claims are preserved; this endpoint only controls clientSlug.
    await adminAuth.setCustomUserClaims(userRecord.uid, { ...(userRecord.customClaims || {}), clientSlug });

    await adminDb.collection('portalUsers').doc(userRecord.uid).set({
      email,
      clientSlug,
      createdAt: new Date(),
    }, { merge: true });

    let emailSent = false;
    let emailError = null;
    if (sendInvite) {
      try {
        const portalUrl = portalUrlFor(clientSlug);
        const { text, html } = inviteEmailBody({ clientName: effectiveClientName, portalUrl, email, password });
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'Selective Crew <careers@selectivecrew.com>',
            to: [email],
            subject: `Your ${effectiveClientName} Portal Access - Selective Crew`,
            text,
            html,
          }),
        });
        if (resendRes.ok) {
          emailSent = true;
        } else {
          const errData = await resendRes.json().catch(() => ({}));
          emailError = errData.message || 'Failed to send invite email';
          console.error('Resend invite email failed:', errData);
        }
      } catch (e) {
        emailError = e.message;
        console.error('Invite email error:', e);
      }
    }

    return NextResponse.json({ success: true, uid: userRecord.uid, emailSent, emailError });
  } catch (err) {
    console.error('portal-users POST error:', err);
    return NextResponse.json({ error: err.message || 'Failed to create portal user' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const auth = await requireAdmin(request);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const adminAuth = getAdminAuth();
    const adminDb = getAdminDb();
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');
    if (!uid) return NextResponse.json({ error: 'uid is required' }, { status: 400 });

    // Safe ordering: remove the Auth account first. The portalUsers record is
    // the recovery handle, so it is deleted only after Auth deletion is
    // known-good (or known-absent). Any unexpected Auth failure aborts with
    // the record preserved for retry.
    try {
      await adminAuth.deleteUser(uid);
    } catch (e) {
      if (e.code !== 'auth/user-not-found') {
        console.error('portal-users DELETE: Auth deletion failed; portalUsers record preserved:', e);
        return NextResponse.json({ error: 'Failed to delete the authentication account; the portal access record was preserved. Retry or remove the account manually.' }, { status: 500 });
      }
      // Already gone: fall through to remove the record (idempotent delete).
    }
    try {
      await adminDb.collection('portalUsers').doc(uid).delete();
    } catch (e) {
      console.error('portal-users DELETE: portalUsers removal failed:', e);
      return NextResponse.json({ error: 'Authentication account removed, but the portal access record could not be removed. Retry to finish cleanup.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('portal-users DELETE error:', err);
    return NextResponse.json({ error: err.message || 'Failed to delete portal user' }, { status: 500 });
  }
}
