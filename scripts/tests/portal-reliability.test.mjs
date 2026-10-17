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
} from './setup.mjs';
import { POST as portalUsersPOST } from '../../app/api/portal-users/route.js';
import { POST as accessPOST, GET as accessGET } from '../../app/api/request-portal-access/route.js';

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
    assert.ok(!('welcomeEmailSent' in updated.data()), 'success path writes no delivery flag');
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
