import { NextResponse } from 'next/server';
import { getAdminAuth, getAdminDb, requireAdmin } from '../../../lib/firebaseAdmin';
import { ADMIN_EMAILS } from '../../../lib/adminAccess';

function generateTempPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let out = '';
  for (let i = 0; i < 12; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out + '!';
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
  const html = `<div style="font-family:Arial,sans-serif;color:#0a1628;line-height:1.6">
    <p>Hi,</p>
    <p>You've been given access to the <strong>${clientName}</strong> client portal on Selective Crew.</p>
    <p>
      <strong>Portal URL:</strong> <a href="${portalUrl}">${portalUrl}</a><br/>
      <strong>Email:</strong> ${email}<br/>
      <strong>Temporary password:</strong> ${password}
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
    if (sendInvite && !password) password = generateTempPassword();
    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // Admin accounts are never turned into portal accounts: a clientSlug
    // claim makes requireAdmin/isAdmin() reject them, and the invite path
    // below would also reset their password.
    const adminAccountError = () => NextResponse.json({ error: 'This account is an administrator and cannot be assigned to a client portal.' }, { status: 409 });
    if (ADMIN_EMAILS.includes(email)) return adminAccountError();

    let userRecord;
    try {
      userRecord = await adminAuth.createUser({ email, password });
    } catch (err) {
      if (err.code === 'auth/email-already-exists') {
        userRecord = await adminAuth.getUserByEmail(email);
        if (userRecord.customClaims?.admin === true) return adminAccountError();
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
        const portalUrl = `https://selectivecrew.com/portal/${clientSlug}`;
        const { text, html } = inviteEmailBody({ clientName, portalUrl, email, password });
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'Selective Crew <careers@selectivecrew.com>',
            to: [email],
            subject: `Your ${clientName} Portal Access - Selective Crew`,
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

    await adminDb.collection('portalUsers').doc(uid).delete();
    try { await adminAuth.deleteUser(uid); } catch (e) { /* auth user may already be gone */ }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('portal-users DELETE error:', err);
    return NextResponse.json({ error: err.message || 'Failed to delete portal user' }, { status: 500 });
  }
}
