import { randomInt, timingSafeEqual } from 'node:crypto';
import { randomBytes } from 'node:crypto';
import { NextResponse } from 'next/server';
import { getAdminAuth, getAdminDb } from '../../../lib/firebaseAdmin';
import { keyedDigest, takeRateLimit } from '../../../lib/rateLimit';

const ACTIONS = {
  video: { field: 'videoWatched', at: 'videoWatchedAt' },
  omnia: { field: 'omniaCompleted', at: 'omniaCompletedAt' },
  starboard: { field: 'sbInterested', at: 'sbInterestedAt' },
};

const GENERIC_ACCESS_RESPONSE = { success: true, message: 'If an application matches, a verification code will be sent to that email.' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Anonymous training leads may only reference a CV uploaded to this project's
// public cvs/ folder (download URL issued by Firebase Storage).
const PUBLIC_CV_URL_RE = /^https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/studio-6715036493-baccc\.firebasestorage\.app\/o\/cvs%2F[A-Za-z0-9-]+\.cv\?alt=media&token=[A-Za-z0-9-]+$/;

async function sendAccessCode(email, code) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Selective Crew <careers@selectivecrew.com>',
      to: [email],
      subject: 'Your Selective Crew document access code',
      text: `Your verification code is ${code}. It expires in 10 minutes. If you did not request access, you can ignore this email.`,
    }),
  });
  if (!response.ok) throw new Error('Unable to deliver document access code');
}

async function requestDocumentAccess(request, db, email) {
  const emailKey = keyedDigest(email);
  const [ipAllowed, emailAllowed] = await Promise.all([
    takeRateLimit(request, { scope: 'document-code-ip', limit: 8, windowMs: 60 * 60 * 1000 }),
    takeRateLimit(request, { scope: 'document-code-email', subject: emailKey, limit: 3, windowMs: 60 * 60 * 1000 }),
  ]);
  if (!ipAllowed || !emailAllowed) return NextResponse.json(GENERIC_ACCESS_RESPONSE);

  const matches = await db.collection('applications').where('email', '==', email).limit(1).get();
  if (!matches.empty) {
    const challenge = db.collection('candidateAccessChallenges').doc(emailKey);
    const previous = await challenge.get();
    if (!previous.exists || Number(previous.data().resendAfter || 0) <= Date.now()) {
      const code = String(randomInt(0, 1000000)).padStart(6, '0');
      await challenge.set({
        applicationId: matches.docs[0].id,
        codeDigest: keyedDigest(`${email}:${code}`),
        expiresAt: Date.now() + 10 * 60 * 1000,
        resendAfter: Date.now() + 60 * 1000,
        attempts: 0,
        used: false,
      });
      try {
        await sendAccessCode(email, code);
      } catch (error) {
        await challenge.delete();
        console.error('Document access email delivery failed.');
      }
    }
  }
  return NextResponse.json(GENERIC_ACCESS_RESPONSE);
}

async function verifyDocumentAccess(db, email, code) {
  if (!/^\d{6}$/.test(code)) return NextResponse.json({ error: 'Invalid or expired code.' }, { status: 400 });
  const emailKey = keyedDigest(email);
  const challengeRef = db.collection('candidateAccessChallenges').doc(emailKey);
  const consumed = await db.runTransaction(async (transaction) => {
    const current = await transaction.get(challengeRef);
    if (!current.exists) return { error: 'invalid' };
    const data = current.data();
    if (data.used || Number(data.expiresAt) < Date.now() || Number(data.attempts || 0) >= 5) return { error: 'invalid' };
    const supplied = Buffer.from(keyedDigest(`${email}:${code}`));
    const expected = Buffer.from(String(data.codeDigest || ''));
    const valid = supplied.length === expected.length && timingSafeEqual(supplied, expected);
    if (!valid) {
      transaction.update(challengeRef, { attempts: Number(data.attempts || 0) + 1 });
      return { error: 'invalid' };
    }
    transaction.update(challengeRef, { used: true });
    return { applicationId: data.applicationId };
  });
  if (consumed.error) return NextResponse.json({ error: 'Invalid or expired code.' }, { status: 400 });

  const candidate = await db.collection('applications').doc(consumed.applicationId).get();
  if (!candidate.exists || String(candidate.data().email || '').trim().toLowerCase() !== email) {
    return NextResponse.json({ error: 'Application not found.' }, { status: 404 });
  }
  const customToken = await getAdminAuth().createCustomToken(`candidate-doc-${emailKey}`, {
    candidateDocumentId: consumed.applicationId,
    candidateEmail: email,
  });
  const profile = candidate.data();
  return NextResponse.json({
    success: true,
    customToken,
    candidate: { id: consumed.applicationId, fullName: profile.fullName || '', country: profile.country || '', role: profile.role || profile.position || '' },
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const action = body?.action;
    if (action === 'save-quiz-result') {
      const bearer = (request.headers.get('authorization') || '').match(/^Bearer (.+)$/);
      if (!bearer) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
      const decoded = await getAdminAuth().verifyIdToken(bearer[1]);
      if (decoded.uid !== body?.userId) return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
      const correctAnswers = [1, 2, 1, 1, 1, 2, 2, 1];
      const answers = body?.answers;
      if (!answers || Array.isArray(answers) || Object.keys(answers).length !== correctAnswers.length ||
          correctAnswers.some((answer, index) => !Number.isInteger(answers[index]) || answers[index] < 0 || answers[index] > 3)) {
        return NextResponse.json({ error: 'Invalid quiz submission.' }, { status: 400 });
      }
      const score = correctAnswers.reduce((sum, answer, index) => sum + (answers[index] === answer ? 1 : 0), 0);
      const db = getAdminDb();
      const sessionRef = db.collection('training_sessions').doc(decoded.uid);
      await db.runTransaction(async (transaction) => {
        const session = await transaction.get(sessionRef);
        if (!session.exists || session.data().certified) throw new Error('Training session unavailable.');
        transaction.update(sessionRef, {
          quizScore: score, quizTotal: correctAnswers.length,
          quizAttempts: Number(session.data().quizAttempts || 0) + 1,
          lastActiveAt: new Date(),
        });
      });
      return NextResponse.json({ success: true, score, total: correctAnswers.length, passed: score / correctAnswers.length >= 0.8 });
    }
    if (action === 'save-training-lead') {
      const email = String(body?.email || '').trim().toLowerCase();
      const name = String(body?.name || '').trim().slice(0, 120);
      if (!EMAIL_RE.test(email) || email.length > 254 || !name) {
        return NextResponse.json({ error: 'Name and a valid email are required.' }, { status: 400 });
      }
      const bearer = (request.headers.get('authorization') || '').match(/^Bearer (.+)$/);
      let verifiedUser = null;
      if (bearer) {
        verifiedUser = await getAdminAuth().verifyIdToken(bearer[1]);
        if (String(verifiedUser.email || '').trim().toLowerCase() !== email) {
          return NextResponse.json({ error: 'The signed-in account does not match this email.' }, { status: 403 });
        }
      }
      const emailKey = keyedDigest(email);
      const [ipAllowed, emailAllowed] = await Promise.all([
        takeRateLimit(request, { scope: 'training-lead-ip', limit: 10, windowMs: 60 * 60 * 1000 }),
        takeRateLimit(request, { scope: 'training-lead-email', subject: emailKey, limit: 5, windowMs: 24 * 60 * 60 * 1000 }),
      ]);
      if (!ipAllowed || !emailAllowed) return NextResponse.json({ error: 'Please try again later.' }, { status: 429 });
      const db = getAdminDb();
      const existing = await db.collection('trainingLeads').where('email', '==', email).limit(1).get();
      if (!verifiedUser && !existing.empty) return NextResponse.json({ success: true, duplicate: true });
      const lead = {
        name,
        email,
        source: String(body?.source || 'training-landing').slice(0, 80),
        updatedAt: new Date(),
      };
      if (verifiedUser) {
        for (const field of ['whatsapp', 'country', 'experience', 'cvUrl']) {
          if (typeof body?.[field] === 'string') lead[field] = body[field].slice(0, field === 'cvUrl' ? 2000 : 500);
        }
      } else {
        if (typeof body?.retail === 'string') lead.retail = body.retail.slice(0, 300);
        if (typeof body?.cvUrl === 'string' && body.cvUrl.length <= 2000 && PUBLIC_CV_URL_RE.test(body.cvUrl)) lead.cvUrl = body.cvUrl;
      }
      if (existing.empty) {
        lead.createdAt = new Date();
        await db.collection('trainingLeads').add(lead);
      } else {
        await existing.docs[0].ref.set(lead, { merge: true });
      }
      return NextResponse.json({ success: true, duplicate: false });
    }

    if (action === 'issue-certificate') {
      const bearer = (request.headers.get('authorization') || '').match(/^Bearer (.+)$/);
      if (!bearer) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
      const decoded = await getAdminAuth().verifyIdToken(bearer[1]);
      if (decoded.uid !== body?.userId || !decoded.email) return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
      const score = Number(body?.score);
      const total = Number(body?.total);
      const candidateName = String(body?.candidateName || '').trim().slice(0, 120);
      if (!Number.isInteger(score) || !Number.isInteger(total) || total < 1 || score < 0 || score > total || !candidateName) {
        return NextResponse.json({ error: 'Invalid training result.' }, { status: 400 });
      }
      const db = getAdminDb();
      const sessionRef = db.collection('training_sessions').doc(decoded.uid);
      const session = await sessionRef.get();
      if (!session.exists || String(session.data().email || '').trim().toLowerCase() !== String(decoded.email).toLowerCase()) {
        return NextResponse.json({ error: 'Training session not found.' }, { status: 404 });
      }
      if (session.data().certified || Number(session.data().quizScore) !== score || Number(session.data().quizTotal) !== total || score / total < 0.8) {
        return NextResponse.json({ error: 'The saved quiz result does not qualify for a certificate.' }, { status: 403 });
      }
      const percentage = Math.round((score / total) * 100);
      const certId = `SC-DF-${Date.now()}-${randomBytes(4).toString('hex').toUpperCase()}`;
      const certificateRef = db.collection('certificates').doc(certId);
      await db.runTransaction(async (transaction) => {
        const current = await transaction.get(sessionRef);
        if (!current.exists || current.data().certified || Number(current.data().quizScore) !== score ||
            Number(current.data().quizTotal) !== total || score / total < 0.8) {
          throw new Error('The saved quiz result does not qualify for a certificate.');
        }
        transaction.set(certificateRef, {
          certId, userId: decoded.uid, candidateName, score, total, percentage,
          issuedAt: new Date(), expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          course: 'Duty-Free Sales Excellence', issuer: 'SelectiveCrew Training Institute', valid: true,
        });
        transaction.update(sessionRef, { certified: true, certId, certifiedAt: new Date() });
      });
      const email = String(decoded.email).trim().toLowerCase();
      const apps = await db.collection('applications').where('email', '==', email).limit(1).get();
      if (apps.empty) {
        await db.collection('applications').add({
          fullName: candidateName, email, whatsapp: '', country: '',
          position: 'Cruise Ship Retail (Course Graduate)', status: 'reviewing',
          source: 'training_course', courseCompleted: true, certId,
          notes: `Course completed: Duty-Free Sales Excellence (${percentage}%)`, createdAt: new Date(),
        });
      } else {
        const candidate = apps.docs[0].data();
        await apps.docs[0].ref.update({
          status: 'reviewing', courseCompleted: true, certId,
          notes: `${candidate.notes || ''}\n\nCourse completed: Duty-Free Sales Excellence (${percentage}%) - ${new Date().toLocaleDateString()}`,
        });
      }
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'Selective Crew <careers@selectivecrew.com>', to: ['careers@selectivecrew.com'],
            subject: `Course Completed: ${candidateName}`,
            text: `${candidateName} completed Duty-Free Sales Excellence.\n\nScore: ${percentage}%\nEmail: ${email}\nCertificate ID: ${certId}`,
          }),
        });
      } catch (error) { console.error('Training completion notification failed:', error); }
      return NextResponse.json({ success: true, certId, percentage });
    }
    if (action === 'documents-submitted') {
      const match = (request.headers.get('authorization') || '').match(/^Bearer (.+)$/);
      if (!match) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      const decoded = await getAdminAuth().verifyIdToken(match[1]);
      const applicationId = String(body?.applicationId || '');
      if (!decoded.candidateDocumentId || decoded.candidateDocumentId !== applicationId || !decoded.candidateEmail) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      if (!(await takeRateLimit(request, { scope: 'documents-submitted', subject: applicationId, limit: 3, windowMs: 24 * 60 * 60 * 1000 }))) {
        return NextResponse.json({ error: 'Please try again later' }, { status: 429 });
      }
      const docs = await getAdminDb().collection('candidateDocuments').where('applicationId', '==', applicationId).limit(1).get();
      if (docs.empty) return NextResponse.json({ error: 'No submitted documents found' }, { status: 404 });
      const record = docs.docs[0].data();
      if (String(record.email || '').trim().toLowerCase() !== String(decoded.candidateEmail).trim().toLowerCase()) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Selective Crew <careers@selectivecrew.com>',
          to: ['careers@selectivecrew.com'],
          subject: `Documents Submitted - ${record.fullName || 'Candidate'}`,
          text: `${record.fullName || 'A candidate'} submitted documents.\n\nEmail: ${record.email}\nCountry: ${record.country || ''}\nApplication ID: ${applicationId}\n\nReview the documents in the admin panel.`,
        }),
      });
      if (!response.ok) return NextResponse.json({ error: 'Notification delivery failed' }, { status: 502 });
      return NextResponse.json({ success: true });
    }
    if (action === 'request-document-access' || action === 'verify-document-access') {
      const email = String(body?.email || '').trim().toLowerCase();
      if (!EMAIL_RE.test(email) || email.length > 254) {
        return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
      }
      const db = getAdminDb();
      if (action === 'request-document-access') return await requestDocumentAccess(request, db, email);
      return await verifyDocumentAccess(db, email, String(body?.code || '').trim());
    }

    const { applicationId } = body;
    const update = ACTIONS[action];
    if (!update || typeof applicationId !== 'string' || !/^[A-Za-z0-9_-]{10,150}$/.test(applicationId)) {
      return NextResponse.json({ error: 'Invalid action link' }, { status: 400 });
    }
    if (!(await takeRateLimit(request, { scope: 'candidate-action', subject: applicationId, limit: 20, windowMs: 60 * 60 * 1000 }))) {
      return NextResponse.json({ error: 'Please try again later' }, { status: 429 });
    }

    const ref = getAdminDb().collection('applications').doc(applicationId);
    const snapshot = await ref.get();
    if (!snapshot.exists) return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    await ref.update({ [update.field]: true, [update.at]: new Date().toISOString() });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Candidate action failed:', error);
    return NextResponse.json({ error: 'Unable to update application' }, { status: 500 });
  }
}
