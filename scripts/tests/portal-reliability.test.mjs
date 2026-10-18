// Isolated portal reliability suite (Node.js built-in test runner).
//
// Covers the four portal reliability fixes against the Firebase Auth and
// Firestore emulators under the demo project 'demo-portal-test':
//   1. welcome-email failure reporting (account created, delivery failed,
//      no credential exposure, no false "sent" claim);
//   2. same-client re-invitation (intended behavior preserved);
//   3. cross-client invitation conflict (HTTP 409, existing account untouched);
//   4. temporary-password format (expected shape, authenticates);
//   5. custom-claims preservation (employer approval and re-invitation).
//
// Run ONLY via 'npm run test:portal' inside an emulator session that exports
// GCLOUD_PROJECT=demo-portal-test plus both emulator hosts (see setup.mjs).
// The setup import below enforces that fail-closed guard before any route
// module is evaluated. All identities use '@portal-test.invalid' (RFC 2606,
// never routable) plus one emulator-local allowlisted admin; every created
// user and document is tracked and deleted in after(). Test secrets and
// generated passwords stay in memory and are never printed.

import './setup.mjs';
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import {
  admin,
  adminAuthHeader,
  restSignIn,
  jsonRequest,
  nextTestIp,
  resendCalls,
  setResendMode,
  clearResendCalls,
  trackUser,
  trackDoc,
  cleanupTestData,
  ensureTestClient,
  userClientSession,
  adminClientSession,
} from './setup.mjs';
import { POST as portalUsersPOST, DELETE as portalUsersDELETE } from '../../app/api/portal-users/route.js';
import { POST as accessPOST, GET as accessGET } from '../../app/api/request-portal-access/route.js';
import { POST as clientsPOST, DELETE as clientsDELETE } from '../../app/api/clients/route.js';
import {
  collection, doc, getDoc, getDocs, query, where, addDoc, updateDoc,
} from 'firebase/firestore';

const PORTAL_USERS_URL = 'http://test.local/api/portal-users';
const ACCESS_URL = 'http://test.local/api/request-portal-access';

// Charset from generateTempPassword(): 12 picks from this set plus '!'.
const TEMP_PASSWORD_CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';

// Extracts the most recent stubbed invite password emailed to `email` by the
// admin invitation endpoint (its text body carries a 'Temporary password:'
// line). The value is returned for assertions and sign-in only.
function lastInvitePassword(email) {
  const calls = resendCalls.filter((c) => Array.isArray(c.body?.to) && c.body.to.includes(email));
  assert.ok(calls.length > 0, `expected a stubbed invite email to ${email}`);
  const match = String(calls[calls.length - 1].body.text || '').match(/Temporary password: (\S+)/);
  assert.ok(match, 'invite email text must contain the temporary password line');
  return match[1];
}

async function filedRequest(email, cruiseLine) {
  const res = await accessPOST(
    jsonRequest(ACCESS_URL, {
      body: {
        name: 'Portal Test',
        company: 'Portal Test Co',
        email,
        cruiseLine,
        positions: 'Seller',
        message: '',
      },
      headers: { 'x-forwarded-for': nextTestIp() },
    })
  );
  assert.equal(res.status, 200);
  const { db } = await admin();
  const snap = await db.collection('portalAccessRequests').where('email', '==', email).limit(1).get();
  assert.equal(snap.size, 1);
  const doc = snap.docs[0];
  trackDoc('portalAccessRequests', doc.id);
  return { id: doc.id, approveToken: doc.data().approveToken };
}

before(async () => {
  setResendMode('ok');
  await adminAuthHeader();
  // Invitations require existing, active clients.
  await ensureTestClient('testclient-a');
  await ensureTestClient('testclient-b');
});

after(async () => {
  await cleanupTestData();
});

describe('welcome-email failure reporting', () => {
  it('provisions the account but reports delivery failure without leaking credentials', async () => {
    // File with delivery working: the request notification itself must send.
    setResendMode('ok');
    const email = 'fail-case@portal-test.invalid';
    const { id, approveToken } = await filedRequest(email, 'starboard');
    // Fail only the approval's welcome email.
    clearResendCalls();
    setResendMode('fail');
    try {
      const confirmUrl = `${ACCESS_URL}?id=${encodeURIComponent(id)}&token=${encodeURIComponent(approveToken)}`;
      const res = await accessPOST(new Request(confirmUrl, { method: 'POST' }));
      const html = await res.text();
      assert.equal(res.status, 200);
      assert.match(html, /failed to send/);
      assert.doesNotMatch(html, /was sent/);
      assert.doesNotMatch(html, /temporary password/i);

      // Provisioning happened despite the delivery failure.
      const { auth, db } = await admin();
      const user = await auth.getUserByEmail(email);
      trackUser(user.uid);
      const portalUser = await db.collection('portalUsers').doc(user.uid).get();
      assert.ok(portalUser.exists);
      trackDoc('portalUsers', user.uid);
      assert.equal(portalUser.data().clientSlug, 'starboard');
      trackDoc('clients', 'starboard');

      // Delivery recorded as failed with no credential material persisted.
      const updated = await db.collection('portalAccessRequests').doc(id).get();
      assert.equal(updated.data().welcomeEmailSent, false);
      assert.ok(
        !Object.keys(updated.data()).some((key) => /password|credential|secret/i.test(key)),
        'request doc must not persist credential fields'
      );

      // The failed attempt reached the (stubbed) transport exactly once.
      assert.equal(resendCalls.length, 1);
    } finally {
      setResendMode('ok');
    }
  });
});

describe('same-client re-invitation', () => {
  it('re-issues credentials while keeping the client assignment', async () => {
    const headers = await adminAuthHeader();
    const email = 'reinvite-case@portal-test.invalid';
    const invite = () =>
      portalUsersPOST(
        jsonRequest(PORTAL_USERS_URL, {
          body: { email, clientSlug: 'testclient-a', clientName: 'Test Client A', sendInvite: true },
          headers,
        })
      );

    const first = await invite();
    assert.equal(first.status, 200);
    const firstData = await first.json();
    assert.equal(firstData.success, true);
    assert.equal(firstData.emailSent, true);
    trackUser(firstData.uid);
    trackDoc('portalUsers', firstData.uid);
    const firstPassword = lastInvitePassword(email);
    assert.equal((await restSignIn(email, firstPassword)).ok, true);

    clearResendCalls();
    const second = await invite();
    assert.equal(second.status, 200);
    const secondData = await second.json();
    assert.equal(secondData.success, true);
    assert.equal(secondData.emailSent, true);
    assert.equal(secondData.uid, firstData.uid);
    const secondPassword = lastInvitePassword(email);
    assert.ok(secondPassword !== firstPassword, 're-invitation must issue a fresh temporary password');
    assert.equal((await restSignIn(email, secondPassword)).ok, true);
    assert.equal((await restSignIn(email, firstPassword)).ok, false);

    const { auth, db } = await admin();
    assert.deepEqual((await auth.getUser(firstData.uid)).customClaims, { clientSlug: 'testclient-a' });
    assert.equal(
      (await db.collection('portalUsers').doc(firstData.uid).get()).data().clientSlug,
      'testclient-a'
    );
  });
});

describe('cross-client invitation conflict', () => {
  it('returns 409 and leaves password, claims, and association unchanged', async () => {
    const headers = await adminAuthHeader();
    const email = 'crossclient-case@portal-test.invalid';
    const inviteTo = (clientSlug, clientName) =>
      portalUsersPOST(
        jsonRequest(PORTAL_USERS_URL, {
          body: { email, clientSlug, clientName, sendInvite: true },
          headers,
        })
      );

    const first = await inviteTo('testclient-a', 'Test Client A');
    assert.equal(first.status, 200);
    const firstData = await first.json();
    trackUser(firstData.uid);
    trackDoc('portalUsers', firstData.uid);
    const originalPassword = lastInvitePassword(email);
    assert.equal((await restSignIn(email, originalPassword)).ok, true);

    clearResendCalls();
    const conflict = await inviteTo('testclient-b', 'Test Client B');
    assert.equal(conflict.status, 409);
    const conflictData = await conflict.json();
    assert.match(conflictData.error, /different client portal/);
    assert.doesNotMatch(JSON.stringify(conflictData), /testclient-a/);
    assert.equal(resendCalls.length, 0);

    const { auth, db } = await admin();
    assert.equal((await restSignIn(email, originalPassword)).ok, true);
    assert.deepEqual((await auth.getUser(firstData.uid)).customClaims, { clientSlug: 'testclient-a' });
    assert.equal(
      (await db.collection('portalUsers').doc(firstData.uid).get()).data().clientSlug,
      'testclient-a'
    );
  });
});

describe('temporary-password generation', () => {
  it('emits the expected format and each credential authenticates', async () => {
    const headers = await adminAuthHeader();
    const cases = [];
    for (let i = 0; i < 3; i += 1) {
      const email = `temppw-${i}@portal-test.invalid`;
      const res = await portalUsersPOST(
        jsonRequest(PORTAL_USERS_URL, {
          body: { email, clientSlug: 'testclient-a', clientName: 'Test Client A', sendInvite: true },
          headers,
        })
      );
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.emailSent, true);
      trackUser(data.uid);
      trackDoc('portalUsers', data.uid);
      cases.push({ email, password: lastInvitePassword(email) });
    }

    for (const { password } of cases) {
      assert.equal(typeof password, 'string');
      assert.equal(password.length, 13);
      assert.ok(password.endsWith('!'), 'password must end with the expected suffix');
      for (const ch of password.slice(0, 12)) {
        assert.ok(TEMP_PASSWORD_CHARSET.includes(ch), 'password body must use the expected charset');
      }
    }
    // Distinct samples only; this asserts nothing about statistical randomness.
    assert.equal(new Set(cases.map((c) => c.password)).size, cases.length);

    for (const { email, password } of cases) {
      assert.equal((await restSignIn(email, password)).ok, true);
    }
  });
});

describe('custom-claims preservation', () => {
  it('sets exactly clientSlug for newly approved users', async () => {
    const email = 'approval-claims@portal-test.invalid';
    const { id, approveToken } = await filedRequest(email, 'starboard');
    clearResendCalls();
    const confirmUrl = `${ACCESS_URL}?id=${encodeURIComponent(id)}&token=${encodeURIComponent(approveToken)}`;
    const res = await accessPOST(new Request(confirmUrl, { method: 'POST' }));
    const html = await res.text();
    assert.equal(res.status, 200);
    // Positive control: the preserved success path still claims delivery.
    assert.match(html, /was sent/);
    assert.equal(resendCalls.length, 1);

    const { auth, db } = await admin();
    const user = await auth.getUserByEmail(email);
    trackUser(user.uid);
    trackDoc('portalUsers', user.uid);
    trackDoc('clients', 'starboard');
    assert.deepEqual(user.customClaims, { clientSlug: 'starboard' });

    const updated = await db.collection('portalAccessRequests').doc(id).get();
    assert.equal(updated.data().status, 'completed');
    assert.equal(updated.data().uid, user.uid);
    assert.equal(updated.data().welcomeEmailSent, true);
  });

  it('refuses pre-claimed existing users without touching their claims', async () => {
    const { auth, db } = await admin();
    const email = 'preclaimed-case@portal-test.invalid';
    const preUser = await auth.createUser({
      email,
      password: 'Preclaimed-1aZ!',
      emailVerified: false,
    });
    trackUser(preUser.uid);
    await auth.setCustomUserClaims(preUser.uid, { clientSlug: 'ncl', keepMe: 'yes' });

    const { id, approveToken } = await filedRequest(email, 'starboard');
    const confirmUrl = `${ACCESS_URL}?id=${encodeURIComponent(id)}&token=${encodeURIComponent(approveToken)}`;

    const page = await accessGET(new Request(confirmUrl, { method: 'GET' }));
    assert.equal(page.status, 200);
    assert.match(await page.text(), /Confirm Portal Access Request/);

    const res = await accessPOST(new Request(confirmUrl, { method: 'POST' }));
    assert.equal(res.status, 409);
    assert.match(await res.text(), /already exists/);

    assert.deepEqual((await auth.getUserByEmail(email)).customClaims, {
      clientSlug: 'ncl',
      keepMe: 'yes',
    });
    assert.equal((await db.collection('portalUsers').doc(preUser.uid).get()).exists, false);
  });

  it('preserves unrelated claims on same-client re-invitation', async () => {
    const headers = await adminAuthHeader();
    const { auth } = await admin();
    const email = 'preserve-claims@portal-test.invalid';
    const invite = () =>
      portalUsersPOST(
        jsonRequest(PORTAL_USERS_URL, {
          body: { email, clientSlug: 'testclient-a', clientName: 'Test Client A', sendInvite: true },
          headers,
        })
      );

    const first = await invite();
    assert.equal(first.status, 200);
    const { uid } = await first.json();
    trackUser(uid);
    trackDoc('portalUsers', uid);
    await auth.setCustomUserClaims(uid, { clientSlug: 'testclient-a', keepMe: 'yes' });

    const second = await invite();
    assert.equal(second.status, 200);
    assert.deepEqual((await auth.getUser(uid)).customClaims, {
      clientSlug: 'testclient-a',
      keepMe: 'yes',
    });
  });
});

// Credentials that must cross `it` boundaries stay in memory, never printed.
const sharedCreds = {};

// Asserts a client-SDK promise fails with a rules denial.
async function expectDenied(promise) {
  try {
    await promise;
  } catch (e) {
    assert.equal(e?.code, 'permission-denied');
    return;
  }
  assert.fail('expected permission-denied');
}

function unescapeTestHtml(value) {
  return String(value)
    .replace(/&#39;/g, "'")
    .replace(/&#36;/g, '$')
    .replace(/&quot;/g, '"')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&');
}

// Extracts the approval-flow temporary password from a stubbed welcome email
// (HTML body only). Returned for sign-in proof, never printed.
function lastWelcomePassword(email) {
  const calls = resendCalls.filter(
    (c) => c.body?.to === email || (Array.isArray(c.body?.to) && c.body.to.includes(email))
  );
  assert.ok(calls.length > 0, `expected a stubbed welcome email to ${email}`);
  const html = String(calls[calls.length - 1].body.html || '');
  const match = html.match(/Temporary Password<\/td><td[^>]*>([^<]+)<\/td>/);
  assert.ok(match, 'welcome email must contain the temporary password row');
  return unescapeTestHtml(match[1]);
}

async function expectNoAuthUser(auth, email) {
  let missing = false;
  try {
    await auth.getUserByEmail(email);
  } catch (e) {
    missing = e.code === 'auth/user-not-found';
    if (!missing) throw e;
  }
  assert.equal(missing, true);
}

describe('approval-link expiry and single use', () => {
  it('refuses expired links without provisioning', async () => {
    const { auth, db } = await admin();
    const email = 'expired-case@portal-test.invalid';
    const reqRef = db.collection('portalAccessRequests').doc();
    await reqRef.set({
      name: 'Expired Case', company: 'Expired Co', email, cruiseLine: 'starboard',
      cruiseLineLabel: 'Starboard Retail Group', positions: '', message: '',
      status: 'pending', approveToken: 'tok-expired-case-1',
      createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    });
    trackDoc('portalAccessRequests', reqRef.id);
    const url = `${ACCESS_URL}?id=${reqRef.id}&token=tok-expired-case-1`;

    const page = await accessGET(new Request(url, { method: 'GET' }));
    assert.equal(page.status, 200);
    assert.match(await page.text(), /expired after 48 hours/);

    clearResendCalls();
    const res = await accessPOST(new Request(url, { method: 'POST' }));
    assert.equal(res.status, 200);
    assert.match(await res.text(), /expired after 48 hours/);
    assert.equal(resendCalls.length, 0);

    await expectNoAuthUser(auth, email);
    assert.equal((await reqRef.get()).data().status, 'expired');
  });

  it('treats legacy requests without expiresAt as expired after 48h', async () => {
    const { auth, db } = await admin();
    const email = 'legacy-exp-case@portal-test.invalid';
    const reqRef = db.collection('portalAccessRequests').doc();
    await reqRef.set({
      name: 'Legacy', company: 'Legacy Co', email, cruiseLine: 'starboard',
      cruiseLineLabel: 'Starboard Retail Group', positions: '', message: '',
      status: 'pending', approveToken: 'tok-legacy-exp-1',
      createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
    });
    trackDoc('portalAccessRequests', reqRef.id);
    const res = await accessPOST(
      new Request(`${ACCESS_URL}?id=${reqRef.id}&token=tok-legacy-exp-1`, { method: 'POST' })
    );
    assert.equal(res.status, 200);
    assert.match(await res.text(), /expired after 48 hours/);
    await expectNoAuthUser(auth, email);
    assert.equal((await reqRef.get()).data().status, 'expired');
  });

  it('approves exactly once across sequential duplicates', async () => {
    const email = 'double-approve@portal-test.invalid';
    const { id, approveToken } = await filedRequest(email, 'starboard');
    clearResendCalls();
    const url = `${ACCESS_URL}?id=${encodeURIComponent(id)}&token=${encodeURIComponent(approveToken)}`;
    const first = await accessPOST(new Request(url, { method: 'POST' }));
    assert.equal(first.status, 200);
    assert.match(await first.text(), /was sent/);
    const second = await accessPOST(new Request(url, { method: 'POST' }));
    assert.equal(second.status, 200);
    assert.match(await second.text(), /already been processed/);

    const { auth } = await admin();
    const user = await auth.getUserByEmail(email);
    trackUser(user.uid);
    trackDoc('portalUsers', user.uid);
    trackDoc('clients', 'starboard');
    assert.equal(resendCalls.filter((c) => c.body?.to === email).length, 1);
  });

  it('serializes concurrent approvals to a single provisioning', async () => {
    const email = 'race-approve@portal-test.invalid';
    const { id, approveToken } = await filedRequest(email, 'starboard');
    clearResendCalls();
    const url = `${ACCESS_URL}?id=${encodeURIComponent(id)}&token=${encodeURIComponent(approveToken)}`;
    const pages = await Promise.all([
      accessPOST(new Request(url, { method: 'POST' })).then((r) => r.text()),
      accessPOST(new Request(url, { method: 'POST' })).then((r) => r.text()),
    ]);
    assert.equal(pages.filter((h) => /was sent/.test(h)).length, 1);
    assert.equal(pages.filter((h) => /being processed|already been processed/.test(h)).length, 1);

    const { auth } = await admin();
    const user = await auth.getUserByEmail(email);
    trackUser(user.uid);
    trackDoc('portalUsers', user.uid);
    trackDoc('clients', 'starboard');
    assert.equal(resendCalls.filter((c) => c.body?.to === email).length, 1);
  });

  it('reclaims an abandoned processing lease', async () => {
    const { auth, db } = await admin();
    const email = 'reclaim-case@portal-test.invalid';
    const reqRef = db.collection('portalAccessRequests').doc();
    await reqRef.set({
      name: 'Reclaim', company: 'Reclaim Co', email, cruiseLine: 'starboard',
      cruiseLineLabel: 'Starboard Retail Group', positions: '', message: '',
      status: 'processing', approveToken: 'tok-reclaim-1', grantId: 'grant-reclaim-1',
      processingLeaseExpiresAt: new Date(Date.now() - 60 * 1000),
      createdAt: new Date(), expiresAt: new Date(Date.now() + 47 * 3600 * 1000),
    });
    trackDoc('portalAccessRequests', reqRef.id);
    clearResendCalls();
    const res = await accessPOST(
      new Request(`${ACCESS_URL}?id=${reqRef.id}&token=tok-reclaim-1`, { method: 'POST' })
    );
    assert.equal(res.status, 200);
    assert.match(await res.text(), /was sent/);

    const user = await auth.getUserByEmail(email);
    trackUser(user.uid);
    trackDoc('portalUsers', user.uid);
    trackDoc('clients', 'starboard');
    assert.deepEqual(user.customClaims, { clientSlug: 'starboard' });
    assert.equal(resendCalls.filter((c) => c.body?.to === email).length, 1);
  });

  it('recovers an interrupted grant with a fresh credential', async () => {
    const { auth, db } = await admin();
    const email = 'grant-rec-case@portal-test.invalid';
    const original = await auth.createUser({ email, password: 'Init-Rec-1aZ!', emailVerified: false });
    trackUser(original.uid);
    await auth.setCustomUserClaims(original.uid, { clientSlug: 'starboard', portalGrantId: 'grant-rec-2' });
    const reqRef = db.collection('portalAccessRequests').doc();
    await reqRef.set({
      name: 'Grant Rec', company: 'Grant Rec Co', email, cruiseLine: 'starboard',
      cruiseLineLabel: 'Starboard Retail Group', positions: '', message: '',
      status: 'processing', approveToken: 'tok-grant-rec-2', grantId: 'grant-rec-2',
      processingLeaseExpiresAt: new Date(Date.now() - 60 * 1000),
      createdAt: new Date(), expiresAt: new Date(Date.now() + 47 * 3600 * 1000),
    });
    trackDoc('portalAccessRequests', reqRef.id);
    clearResendCalls();
    const res = await accessPOST(
      new Request(`${ACCESS_URL}?id=${reqRef.id}&token=tok-grant-rec-2`, { method: 'POST' })
    );
    assert.equal(res.status, 200);
    assert.match(await res.text(), /was sent/);

    const freshPassword = lastWelcomePassword(email);
    assert.equal((await restSignIn(email, freshPassword)).ok, true);
    assert.equal((await restSignIn(email, 'Init-Rec-1aZ!')).ok, false);
    assert.deepEqual((await auth.getUser(original.uid)).customClaims, { clientSlug: 'starboard' });
    trackDoc('portalUsers', original.uid);
    trackDoc('clients', 'starboard');
    assert.equal((await reqRef.get()).data().status, 'completed');
  });

  it('refuses foreign accounts on a stale lease without touching them', async () => {
    const { auth, db } = await admin();
    const email = 'foreign-lease@portal-test.invalid';
    const foreign = await auth.createUser({ email, password: 'Foreign-1aZ!', emailVerified: false });
    trackUser(foreign.uid);
    await auth.setCustomUserClaims(foreign.uid, { clientSlug: 'ncl' });
    const reqRef = db.collection('portalAccessRequests').doc();
    await reqRef.set({
      name: 'Foreign', company: 'Foreign Co', email, cruiseLine: 'starboard',
      cruiseLineLabel: 'Starboard Retail Group', positions: '', message: '',
      status: 'processing', approveToken: 'tok-foreign-9', grantId: 'grant-foreign-9',
      processingLeaseExpiresAt: new Date(Date.now() - 60 * 1000),
      createdAt: new Date(), expiresAt: new Date(Date.now() + 47 * 3600 * 1000),
    });
    trackDoc('portalAccessRequests', reqRef.id);
    const res = await accessPOST(
      new Request(`${ACCESS_URL}?id=${reqRef.id}&token=tok-foreign-9`, { method: 'POST' })
    );
    assert.equal(res.status, 409);
    assert.match(await res.text(), /already exists/);
    assert.equal((await restSignIn(email, 'Foreign-1aZ!')).ok, true);
    assert.deepEqual((await auth.getUser(foreign.uid)).customClaims, { clientSlug: 'ncl' });
    assert.equal((await reqRef.get()).data().status, 'error');
  });

  it('refuses approval when the client is deactivated', async () => {
    const { auth, db } = await admin();
    const email = 'inactive-approve@portal-test.invalid';
    await db.collection('clients').doc('ncl').set({ name: 'Norwegian Cruise Line', slug: 'ncl', active: false, createdAt: new Date() });
    trackDoc('clients', 'ncl');
    const { id, approveToken } = await filedRequest(email, 'ncl');
    const res = await accessPOST(
      new Request(`${ACCESS_URL}?id=${encodeURIComponent(id)}&token=${encodeURIComponent(approveToken)}`, { method: 'POST' })
    );
    assert.equal(res.status, 409);
    assert.match(await res.text(), /deactivated/);
    await expectNoAuthUser(auth, email);
    const snap = await db.collection('portalAccessRequests').where('email', '==', email).limit(1).get();
    assert.equal(snap.docs[0].data().status, 'error');
  });
});

describe('invitation input validation and client state', () => {
  it('rejects malformed input and unknown or inactive clients', async () => {
    const headers = await adminAuthHeader();
    const invite = (body) => portalUsersPOST(jsonRequest(PORTAL_USERS_URL, { body, headers }));
    assert.equal((await invite({ email: 'not-an-email', clientSlug: 'testclient-a', sendInvite: true })).status, 400);
    assert.equal((await invite({ email: 'ok-a@portal-test.invalid', clientSlug: 'Bad Slug!', sendInvite: true })).status, 400);
    assert.equal((await invite({ email: 'ok-b@portal-test.invalid', clientSlug: 'no-such-client-xyz', sendInvite: true })).status, 404);
    await ensureTestClient('inactive-t2x', false);
    assert.equal((await invite({ email: 'ok-c@portal-test.invalid', clientSlug: 'inactive-t2x', sendInvite: true })).status, 404);
  });

  it('treats clients without an active flag as active', async () => {
    const headers = await adminAuthHeader();
    const { db } = await admin();
    await db.collection('clients').doc('legacy-t2y').set({ name: 'Legacy', slug: 'legacy-t2y', createdAt: new Date() });
    trackDoc('clients', 'legacy-t2y');
    const res = await portalUsersPOST(jsonRequest(PORTAL_USERS_URL, {
      body: { email: 'legacy-ok@portal-test.invalid', clientSlug: 'legacy-t2y', sendInvite: true }, headers,
    }));
    assert.equal(res.status, 200);
    const data = await res.json();
    trackUser(data.uid);
    trackDoc('portalUsers', data.uid);
  });

  it('escapes untrusted text in invitation emails', async () => {
    const headers = await adminAuthHeader();
    const email = 'escape-case@portal-test.invalid';
    clearResendCalls();
    const res = await portalUsersPOST(jsonRequest(PORTAL_USERS_URL, {
      body: { email, clientSlug: 'testclient-a', clientName: '<b>Bold</b>', sendInvite: true }, headers,
    }));
    assert.equal(res.status, 200);
    const data = await res.json();
    trackUser(data.uid);
    trackDoc('portalUsers', data.uid);
    const sent = resendCalls.filter((c) => Array.isArray(c.body?.to) && c.body.to.includes(email));
    assert.equal(sent.length, 1);
    assert.doesNotMatch(String(sent[0].body.html), /<b>Bold<\/b>/);
    assert.match(String(sent[0].body.html), /&lt;b&gt;Bold&lt;\/b&gt;/);
  });

  it('deletes portal users idempotently with safe ordering', async () => {
    const headers = await adminAuthHeader();
    const { auth, db } = await admin();
    const email = 'delete-case@portal-test.invalid';
    const created = await portalUsersPOST(jsonRequest(PORTAL_USERS_URL, {
      body: { email, clientSlug: 'testclient-a', sendInvite: false, password: 'Delete-Me-1aZ!' }, headers,
    }));
    assert.equal(created.status, 200);
    const { uid } = await created.json();
    trackUser(uid);
    trackDoc('portalUsers', uid);

    const first = await portalUsersDELETE(new Request(`${PORTAL_USERS_URL}?uid=${uid}`, { method: 'DELETE', headers }));
    assert.equal(first.status, 200);
    assert.equal((await db.collection('portalUsers').doc(uid).get()).exists, false);
    let gone = false;
    try {
      await auth.getUser(uid);
    } catch (e) {
      gone = e.code === 'auth/user-not-found';
      if (!gone) throw e;
    }
    assert.equal(gone, true);

    const second = await portalUsersDELETE(new Request(`${PORTAL_USERS_URL}?uid=${uid}`, { method: 'DELETE', headers }));
    assert.equal(second.status, 200);
  });
});

describe('rate limiting behavior', () => {
  it('enforces the per-email request limit', async () => {
    const email = 'ratelimit-case@portal-test.invalid';
    const file = () => accessPOST(jsonRequest(ACCESS_URL, {
      body: { name: 'RL', company: 'RL Co', email, cruiseLine: 'starboard', positions: '', message: '' },
      headers: { 'x-forwarded-for': nextTestIp() },
    }));
    assert.equal((await file()).status, 200);
    assert.equal((await file()).status, 200);
    assert.equal((await file()).status, 429);
    const { db } = await admin();
    const snap = await db.collection('portalAccessRequests').where('email', '==', email).get();
    snap.docs.forEach((d) => trackDoc('portalAccessRequests', d.id));
  });

  it('writes TTL-ready expiry on counters and tolerates malformed IPs', async () => {
    const { db } = await admin();
    const snap = await db.collection('apiRateLimits').limit(5).get();
    assert.ok(snap.size > 0, 'expected rate-limit counter docs');
    for (const d of snap.docs) {
      const expireAt = d.data().expireAt;
      assert.ok(expireAt && typeof expireAt.toMillis === 'function', 'counter must carry expireAt timestamp');
    }
    const res = await accessPOST(jsonRequest(ACCESS_URL, {
      body: { name: 'Bad IP', company: 'Bad IP Co', email: 'badip-case@portal-test.invalid', cruiseLine: 'starboard', positions: '', message: '' },
      headers: { 'x-forwarded-for': 'not-an-ip!!!' },
    }));
    assert.equal(res.status, 200);
    const created = await db.collection('portalAccessRequests').where('email', '==', 'badip-case@portal-test.invalid').limit(1).get();
    assert.equal(created.size, 1);
    trackDoc('portalAccessRequests', created.docs[0].id);
  });

  it('enforces the per-IP limit across distinct emails', async () => {
    const ip = nextTestIp();
    const file = (n) => accessPOST(jsonRequest(ACCESS_URL, {
      body: { name: `IP ${n}`, company: 'IP Co', email: `ipscope-${n}@portal-test.invalid`, cruiseLine: 'starboard', positions: '', message: '' },
      headers: { 'x-forwarded-for': ip },
    }));
    for (let n = 0; n < 5; n += 1) {
      assert.equal((await file(n)).status, 200);
    }
    assert.equal((await file(5)).status, 429);
    const { db } = await admin();
    const snap = await db.collection('portalAccessRequests').where('company', '==', 'IP Co').get();
    snap.docs.forEach((d) => trackDoc('portalAccessRequests', d.id));
  });

  it('keeps email buckets independent of each other', async () => {
    const ip = nextTestIp();
    const file = (email) => accessPOST(jsonRequest(ACCESS_URL, {
      body: { name: 'IX', company: 'IX Co', email, cruiseLine: 'starboard', positions: '', message: '' },
      headers: { 'x-forwarded-for': ip },
    }));
    assert.equal((await file('indep-a@portal-test.invalid')).status, 200);
    assert.equal((await file('indep-a@portal-test.invalid')).status, 200);
    assert.equal((await file('indep-a@portal-test.invalid')).status, 429);
    // A different email still has its own full budget on the same IP.
    assert.equal((await file('indep-b@portal-test.invalid')).status, 200);
    const { db } = await admin();
    const snap = await db.collection('portalAccessRequests').where('company', '==', 'IX Co').get();
    snap.docs.forEach((d) => trackDoc('portalAccessRequests', d.id));
  });
});

describe('authorization claim consistency', () => {
  it('rejects empty-string and portal-plus-admin claims', async () => {
    const { auth } = await admin();
    const emptyUser = await auth.createUser({ email: 'emptyclaim-case@portal-test.invalid', password: 'Empty-1aZ!', emailVerified: true });
    trackUser(emptyUser.uid);
    await auth.setCustomUserClaims(emptyUser.uid, { clientSlug: '' });
    const emptySignIn = await restSignIn('emptyclaim-case@portal-test.invalid', 'Empty-1aZ!');
    assert.equal(emptySignIn.ok, true);
    const denied = await portalUsersPOST(jsonRequest(PORTAL_USERS_URL, {
      body: { email: 'x@portal-test.invalid', clientSlug: 'testclient-a', sendInvite: false, password: 'irrelevant-1' },
      headers: { Authorization: `Bearer ${emptySignIn.idToken}` },
    }));
    assert.equal(denied.status, 403);

    const mixedUser = await auth.createUser({ email: 'mixedclaim-case@portal-test.invalid', password: 'Mixed-1aZ!', emailVerified: true });
    trackUser(mixedUser.uid);
    await auth.setCustomUserClaims(mixedUser.uid, { clientSlug: 'testclient-a', admin: true });
    const mixedSignIn = await restSignIn('mixedclaim-case@portal-test.invalid', 'Mixed-1aZ!');
    assert.equal(mixedSignIn.ok, true);
    const deniedMixed = await portalUsersPOST(jsonRequest(PORTAL_USERS_URL, {
      body: { email: 'y@portal-test.invalid', clientSlug: 'testclient-a', sendInvite: false, password: 'irrelevant-2' },
      headers: { Authorization: `Bearer ${mixedSignIn.idToken}` },
    }));
    assert.equal(deniedMixed.status, 403);
  });

  it('treats an empty-string assignment as a cross-client conflict', async () => {
    const headers = await adminAuthHeader();
    const { auth } = await admin();
    const email = 'emptyassign-case@portal-test.invalid';
    const user = await auth.createUser({ email, password: 'EmptyAssign-1aZ!' });
    trackUser(user.uid);
    await auth.setCustomUserClaims(user.uid, { clientSlug: '' });
    const res = await portalUsersPOST(jsonRequest(PORTAL_USERS_URL, {
      body: { email, clientSlug: 'testclient-a', sendInvite: false, password: 'irrelevant-3' }, headers,
    }));
    assert.equal(res.status, 409);
    assert.match((await res.json()).error, /different client portal/);
  });
});

describe('client deactivation lifecycle', () => {
  it('serves multi-document portal lists at realistic scale', async () => {
    const headers = await adminAuthHeader();
    const { db } = await admin();
    for (let i = 0; i < 25; i += 1) {
      const ref = await db.collection('applications').add({
        fullName: `Load Test ${i}`, email: `load-${i}@portal-test.invalid`,
        portalClientSlug: 'testclient-a', status: 'new', createdAt: new Date(),
      });
      trackDoc('applications', ref.id);
    }
    const email = 'scale-reader@portal-test.invalid';
    const invited = await portalUsersPOST(jsonRequest(PORTAL_USERS_URL, {
      body: { email, clientSlug: 'testclient-a', sendInvite: true }, headers,
    }));
    assert.equal(invited.status, 200);
    const { uid } = await invited.json();
    trackUser(uid);
    trackDoc('portalUsers', uid);
    const session = await userClientSession(email, lastInvitePassword(email));
    const snap = await getDocs(query(collection(session.db, 'applications'), where('portalClientSlug', '==', 'testclient-a')));
    assert.equal(snap.size, 25);

    const adminSession = await adminClientSession();
    const all = await getDocs(collection(adminSession.db, 'applications'));
    assert.ok(all.size >= 25, 'admin full list must stay intact');
  });

  it('cuts access on deactivation, even for already-issued tokens', async () => {
    const headers = await adminAuthHeader();
    const { auth } = await admin();
    const email = 'oldtoken-case@portal-test.invalid';
    const invited = await portalUsersPOST(jsonRequest(PORTAL_USERS_URL, {
      body: { email, clientSlug: 'testclient-a', sendInvite: true }, headers,
    }));
    assert.equal(invited.status, 200);
    const { uid } = await invited.json();
    trackUser(uid);
    trackDoc('portalUsers', uid);
    // Claim-only user: the Auth account carries the claim but deliberately
    // has no portalUsers document (exercises the listUsers revocation path).
    const claimOnly = await auth.createUser({ email: 'claimonly-case@portal-test.invalid', password: 'ClaimOnly-1aZ!' });
    trackUser(claimOnly.uid);
    await auth.setCustomUserClaims(claimOnly.uid, { clientSlug: 'testclient-a' });
    sharedCreds.oldTokenPassword = lastInvitePassword(email);
    const session = await userClientSession(email, sharedCreds.oldTokenPassword);
    const before = await getDocs(query(collection(session.db, 'applications'), where('portalClientSlug', '==', 'testclient-a')));
    assert.ok(before.size > 0, 'portal user sees assignments before deactivation');

    const res = await clientsPOST(jsonRequest('http://test.local/api/clients', {
      body: { action: 'deactivate', slug: 'testclient-a' }, headers,
    }));
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(data.usersRevoked >= 1);
    assert.ok(data.applicationsDetached >= 25);

    // Same session (cached, already-issued token): assignments are gone.
    const after = await getDocs(query(collection(session.db, 'applications'), where('portalClientSlug', '==', 'testclient-a')));
    assert.equal(after.size, 0);
    // Association record is gone too (denied or missing both prove lockout).
    let denied = false;
    let missing = false;
    try {
      const self = await getDoc(doc(session.db, 'portalUsers', uid));
      missing = !self.exists();
    } catch (e) {
      denied = e?.code === 'permission-denied';
      if (!denied) throw e;
    }
    assert.ok(denied || missing, 'portalUsers self-read must fail after deactivation');

    // The claim-only user was revoked too: no claim, no record, no access.
    const stripped = await auth.getUser(claimOnly.uid);
    assert.ok(!('clientSlug' in (stripped.customClaims || {})), 'claim-only user must lose the client claim');
  });

  it('restores assignments on reactivation but not user access', async () => {
    const headers = await adminAuthHeader();
    const { db } = await admin();
    const res = await clientsPOST(jsonRequest('http://test.local/api/clients', {
      body: { action: 'reactivate', slug: 'testclient-a' }, headers,
    }));
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(data.applicationsRestored >= 25);
    const sample = await db.collection('applications').where('portalClientSlug', '==', 'testclient-a').limit(1).get();
    assert.equal(sample.size, 1);
    assert.ok(!('portalAssignmentRevoked' in sample.docs[0].data()));

    // Revoked users stay revoked until re-invited (no silent restore).
    const session = await userClientSession('oldtoken-case@portal-test.invalid', sharedCreds.oldTokenPassword);
    await expectDenied(getDocs(query(collection(session.db, 'applications'), where('portalClientSlug', '==', 'testclient-a'))));

    // Controlled recovery: re-invitation restores access.
    const re = await portalUsersPOST(jsonRequest(PORTAL_USERS_URL, {
      body: { email: 'oldtoken-case@portal-test.invalid', clientSlug: 'testclient-a', sendInvite: true }, headers,
    }));
    assert.equal(re.status, 200);
    const restored = await userClientSession('oldtoken-case@portal-test.invalid', lastInvitePassword('oldtoken-case@portal-test.invalid'));
    const snap = await getDocs(query(collection(restored.db, 'applications'), where('portalClientSlug', '==', 'testclient-a')));
    assert.ok(snap.size >= 25);
  });

  it('blocks assignments to inactive clients in rules', async () => {
    const { db } = await admin();
    await ensureTestClient('rules-inact-x', false);
    await db.collection('clients').doc('rules-leg-x').set({ name: 'Rules Legacy', slug: 'rules-leg-x', createdAt: new Date() });
    trackDoc('clients', 'rules-leg-x');
    const adminSession = await adminClientSession();
    const apps = collection(adminSession.db, 'applications');
    await expectDenied(addDoc(apps, { fullName: 'Denied', portalClientSlug: 'rules-inact-x', status: 'new' }));
    const okRef = await addDoc(apps, { fullName: 'Legacy OK', portalClientSlug: 'rules-leg-x', status: 'new' });
    trackDoc('applications', okRef.id);
    const seeded = await db.collection('applications').add({ fullName: 'Seeded', portalClientSlug: 'rules-inact-x', status: 'new' });
    trackDoc('applications', seeded.id);
    await updateDoc(doc(adminSession.db, 'applications', seeded.id), { notes: 'admin hygiene edit' });
    const clean = await addDoc(apps, { fullName: 'Clean', status: 'new' });
    trackDoc('applications', clean.id);
    await expectDenied(updateDoc(doc(adminSession.db, 'applications', clean.id), { portalClientSlug: 'rules-inact-x' }));
  });

  it('denies portal self-reads for inactive clients with intact records', async () => {
    const headers = await adminAuthHeader();
    await ensureTestClient('rules-self-x', true);
    const email = 'selfread-case@portal-test.invalid';
    const invited = await portalUsersPOST(jsonRequest(PORTAL_USERS_URL, {
      body: { email, clientSlug: 'rules-self-x', sendInvite: true }, headers,
    }));
    assert.equal(invited.status, 200);
    const { uid } = await invited.json();
    trackUser(uid);
    trackDoc('portalUsers', uid);
    const password = lastInvitePassword(email);
    // Deactivate WITHOUT touching the association (direct write, unlike the
    // API which also revokes): isolates the rules-level active check.
    const { db } = await admin();
    await db.collection('clients').doc('rules-self-x').update({ active: false });
    const session = await userClientSession(email, password);
    await expectDenied(getDoc(doc(session.db, 'portalUsers', uid)));
  });

  it('refuses deletion while referenced and allows it once clean', async () => {
    const headers = await adminAuthHeader();
    const { db } = await admin();
    await ensureTestClient('delclient-x', true);
    const seeded = await db.collection('applications').add({ fullName: 'Ref', portalClientSlug: 'delclient-x', status: 'new' });
    trackDoc('applications', seeded.id);
    const invited = await portalUsersPOST(jsonRequest(PORTAL_USERS_URL, {
      body: { email: 'delref-case@portal-test.invalid', clientSlug: 'delclient-x', sendInvite: false, password: 'Delref-1aZ!' }, headers,
    }));
    assert.equal(invited.status, 200);
    const { uid } = await invited.json();
    trackUser(uid);
    trackDoc('portalUsers', uid);

    const refused = await clientsDELETE(new Request('http://test.local/api/clients?slug=delclient-x', { method: 'DELETE', headers }));
    assert.equal(refused.status, 409);
    const deact = await clientsPOST(jsonRequest('http://test.local/api/clients', {
      body: { action: 'deactivate', slug: 'delclient-x' }, headers,
    }));
    assert.equal(deact.status, 200);
    const deleted = await clientsDELETE(new Request('http://test.local/api/clients?slug=delclient-x', { method: 'DELETE', headers }));
    assert.equal(deleted.status, 200);
    assert.equal((await db.collection('clients').doc('delclient-x').get()).exists, false);
    const missing = await clientsDELETE(new Request('http://test.local/api/clients?slug=delclient-x', { method: 'DELETE', headers }));
    assert.equal(missing.status, 404);
  });
});
