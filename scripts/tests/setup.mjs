// Test-only setup for the isolated portal reliability suite.
//
// Loaded two ways at once:
//   1. As a Node module loader (--experimental-loader), so plain Node can load
//      the app's route modules UNMODIFIED (see resolve() below).
//   2. Imported first by the test file, so the fail-closed isolation guard and
//      the fetch stub are in place before any route module is evaluated.
//
// The guard refuses to run (exit 3) unless the demo project id and both
// emulator hosts are explicitly configured. It never reads .firebaserc, .env
// files, or production secrets; ambient production credentials are overwritten
// with dummy test-only values so they can never be used.
//
// Route dependency graph (verified by inspection): next/server, node:crypto,
// lib/firebaseAdmin.js (deferred init, no import-time side effects),
// lib/adminAccess.js, lib/emailTemplates.js, lib/rateLimit.js. The client SDK
// (lib/firebase.js, hardcoded to production) is NOT imported by either route.

import { generateKeyPairSync } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

export const TEST_PROJECT_ID = 'demo-portal-test';
export const AUTH_EMULATOR_PORT = 9099;
export const FIRESTORE_EMULATOR_PORT = 8080;
// Numeric loopback only: hostnames such as localhost are rejected so a
// name-resolution trick can never redirect the guard. Matches the fetch
// stub's loopback-only passthrough and the 127.0.0.1 firebase.json config
// (which has no bracketed form, so none is accepted here either).
const LOOPBACK_HOSTS = new Set(['127.0.0.1', '::1']);

// ---------------------------------------------------------------------------
// 1. Module resolution for unmodified route files.
// ---------------------------------------------------------------------------
const HERE = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(HERE, '..', '..');

export async function resolve(specifier, context, next) {
  // The installed Next.js package has no "./server" export entry (only
  // bundlers resolve it), so alias the bare specifier to the package's own
  // server entry file. This tests the real NextResponse/NextRequest classes.
  if (specifier === 'next/server') {
    return {
      url: pathToFileURL(path.join(PROJECT_ROOT, 'node_modules', 'next', 'server.js')).href,
      shortCircuit: true,
    };
  }
  // Next.js convention allows extensionless relative imports; plain Node ESM
  // does not. Retry with '.js' only when the literal specifier fails.
  if (specifier.startsWith('.') || specifier.startsWith('file:')) {
    try {
      return await next(specifier, context);
    } catch (err) {
      const bare = specifier.split('?')[0];
      if (
        (err?.code === 'ERR_MODULE_NOT_FOUND' || err?.code === 'ERR_UNSUPPORTED_DIR_IMPORT') &&
        !/\.[A-Za-z0-9]+$/.test(bare)
      ) {
        return await next(specifier + '.js', context);
      }
      throw err;
    }
  }
  return next(specifier, context);
}

// ---------------------------------------------------------------------------
// 2. Fail-closed isolation guard (runs on import, before route evaluation).
// ---------------------------------------------------------------------------
function abort(message) {
  console.error(`portal-test setup: REFUSING TO RUN: ${message}`);
  process.exit(3);
}

function checkEmulatorHost(varName, expectedPort) {
  const raw = process.env[varName];
  if (!raw) {
    abort(
      `${varName} is not set. Launch the emulators with ` +
        `'firebase emulators:exec --only auth,firestore --project demo-portal-test "npm run test:portal'" ` +
        `so firebase-tools sets it, or export it explicitly for a manually started emulator.`
    );
  }
  const match = String(raw).trim().match(/^(.*?):(\d+)$/);
  if (!match || !LOOPBACK_HOSTS.has(match[1].toLowerCase()) || Number(match[2]) !== expectedPort) {
    abort(`${varName} must be a loopback host with port ${expectedPort}; got '${raw}'.`);
  }
}

// firebase-tools' `emulators:exec --project <id>` exports GCLOUD_PROJECT. Only
// that toolchain-provided value is trusted; .firebaserc is never consulted.
const configuredProject = process.env.GCLOUD_PROJECT || '';
if (configuredProject !== TEST_PROJECT_ID) {
  abort(
    `project must be exactly '${TEST_PROJECT_ID}' via GCLOUD_PROJECT ` +
      `(set by 'emulators:exec --project ${TEST_PROJECT_ID}'). ` +
      `Got '${configuredProject || '(unset)'}'.`
  );
}
checkEmulatorHost('FIRESTORE_EMULATOR_HOST', FIRESTORE_EMULATOR_PORT);
checkEmulatorHost('FIREBASE_AUTH_EMULATOR_HOST', AUTH_EMULATOR_PORT);

// Propagate the verified project id to the variable the Admin SDK reads, and
// install dummy test-only credentials, overwriting any ambient production
// values so they can never be used by this process.
process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = TEST_PROJECT_ID;
process.env.FB_ADMIN_CLIENT_EMAIL = `portal-test-runner@${TEST_PROJECT_ID}.iam.gserviceaccount.com`;
const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
process.env.FB_ADMIN_PRIVATE_KEY = privateKey.export({ type: 'pkcs8', format: 'pem' });
process.env.RESEND_API_KEY = 'test-only-dummy-key-never-sent';
delete process.env.GOOGLE_APPLICATION_CREDENTIALS;

// ---------------------------------------------------------------------------
// 3. Email transport stub. Intercepts ONLY api.resend.com calls: records the
// payload (so tests can assert on content and simulate success/failure) and
// returns a scripted response. Every other request passes through untouched,
// which the Auth emulator REST calls below rely on. No real email is sent.
// ---------------------------------------------------------------------------
const realFetch = globalThis.fetch.bind(globalThis);
export const resendCalls = [];
let resendMode = 'ok'; // 'ok' | 'fail'

export function setResendMode(mode) {
  if (mode !== 'ok' && mode !== 'fail') throw new Error(`unknown resend stub mode: ${mode}`);
  resendMode = mode;
}

export function clearResendCalls() {
  resendCalls.length = 0;
}

globalThis.fetch = async function testFetch(input, init) {
  const url = typeof input === 'string' ? input : input?.url || String(input);
  if (url.includes('api.resend.com')) {
    let body = null;
    try {
      body = JSON.parse(init?.body || '{}');
    } catch {
      body = { _unparsed: true };
    }
    resendCalls.push({ url, body });
    if (resendMode === 'ok') {
      return new Response(JSON.stringify({ id: 'stubbed-resend-id' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ message: 'stubbed resend failure' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  // Loopback-only passthrough: emulator REST traffic uses numeric loopback
  // hosts. Hostnames such as localhost, external hosts, and unparseable
  // destinations are blocked. This runs after the Resend branch, so stubbed
  // email behavior is unchanged.
  let destHost = '';
  try {
    destHost = new URL(url).hostname.toLowerCase();
  } catch {
    destHost = '';
  }
  // new URL() strips brackets from IPv6 literals, so '[::1]' arrives as '::1'.
  if (destHost !== '127.0.0.1' && destHost !== '::1') {
    throw new Error(`portal-test: blocked non-loopback request to host '${destHost || '(unparseable)'}'`);
  }
  return realFetch(input, init);
};

// ---------------------------------------------------------------------------
// 4. Shared helpers (all emulator-backed; safe to use after the guard).
// ---------------------------------------------------------------------------
let adminHandles = null;
export async function admin() {
  if (!adminHandles) {
    const m = await import('../../lib/firebaseAdmin.js');
    adminHandles = { auth: m.getAdminAuth(), db: m.getAdminDb() };
  }
  return adminHandles;
}

export function authEmulatorRest(apiPath) {
  return `http://${process.env.FIREBASE_AUTH_EMULATOR_HOST}/identitytoolkit.googleapis.com/v1${apiPath}?key=test-api-key`;
}

// Sign in through the Auth emulator REST API. Returns { ok, status, idToken }.
// Passwords stay in memory; failures never echo them.
export async function restSignIn(email, password) {
  const res = await fetch(authEmulatorRest('/accounts:signInWithPassword'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, idToken: data.idToken || null };
}

// Emulator-local admin identity. The address must be allowlisted by
// requireAdmin; it exists only inside the emulator and is created here.
export const TEST_ADMIN_EMAIL = 'careers@selectivecrew.com';
const TEST_ADMIN_PASSWORD = 'Admin-Test-Pass-9aZ!';
let cachedAdminToken = null;

export async function adminAuthHeader() {
  if (cachedAdminToken) return { Authorization: `Bearer ${cachedAdminToken}` };
  const { auth } = await admin();
  let user;
  try {
    user = await auth.getUserByEmail(TEST_ADMIN_EMAIL);
  } catch (e) {
    if (e.code !== 'auth/user-not-found') throw e;
    user = await auth.createUser({
      email: TEST_ADMIN_EMAIL,
      password: TEST_ADMIN_PASSWORD,
      emailVerified: true,
    });
    trackUser(user.uid);
  }
  await auth.updateUser(user.uid, { emailVerified: true });
  await auth.setCustomUserClaims(user.uid, {});
  const signIn = await restSignIn(TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD);
  if (!signIn.ok || !signIn.idToken) {
    throw new Error(`test admin sign-in failed (status ${signIn.status})`);
  }
  cachedAdminToken = signIn.idToken;
  return { Authorization: `Bearer ${cachedAdminToken}` };
}

// Test-only Firebase client session (separate from lib/firebase.js, which is
// hardcoded to production and is never imported here). Used ONLY to exercise
// Firestore security rules as a signed-in user. Modules load lazily so the
// loader thread stays lean; the guard above always runs first regardless.
let testClientModules = null;
let testClientApp = null;
// Per-step completion for shutdownTestClient below. Only a fully completed
// shutdown releases references; anything less stays retryable.
const testClientShutdownSteps = { signedOut: false, terminated: false, deleted: false };
function testClientShutdownComplete() {
  return testClientShutdownSteps.signedOut && testClientShutdownSteps.terminated && testClientShutdownSteps.deleted;
}
export async function userClientSession(email, password) {
  if (!testClientModules) {
    const [appMod, authMod, fsMod] = await Promise.all([
      import('firebase/app'),
      import('firebase/auth'),
      import('firebase/firestore'),
    ]);
    testClientModules = { appMod, authMod, fsMod };
    testClientApp = appMod.initializeApp(
      { apiKey: 'test-api-key', authDomain: 'test.invalid', projectId: TEST_PROJECT_ID },
      'portal-rules-test'
    );
    // Fresh app: reset shutdown tracking so this instance gets a full
    // teardown even if a previous app was already shut down.
    testClientShutdownSteps.signedOut = false;
    testClientShutdownSteps.terminated = false;
    testClientShutdownSteps.deleted = false;
    const auth = authMod.getAuth(testClientApp);
    authMod.connectAuthEmulator(auth, `http://${process.env.FIREBASE_AUTH_EMULATOR_HOST}`, { disableWarnings: true });
    const [fsHost, fsPort] = String(process.env.FIRESTORE_EMULATOR_HOST).split(':');
    fsMod.connectFirestoreEmulator(fsMod.getFirestore(testClientApp), fsHost, Number(fsPort));
  }
  const { authMod, fsMod } = testClientModules;
  const auth = authMod.getAuth(testClientApp);
  const cred = await authMod.signInWithEmailAndPassword(auth, email, password);
  return { auth, db: fsMod.getFirestore(testClientApp), uid: cred.user.uid };
}

export async function adminClientSession() {
  return userClientSession(TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD);
}

// Idempotent shutdown for the lazily initialized test-only client app above.
// Without this, the Auth emulator listener, Firestore gRPC channels, and
// token-refresh timers keep the Node test process alive after the suite
// finishes (the summary prints but the process never exits without Ctrl+C).
// Safe to call more than once, and safe when the app was never initialized.
// Step completion is tracked explicitly: a failed shutdown never marks
// itself complete, so a later call retries exactly the unfinished steps
// without repeating destructive operations that already succeeded.
export async function shutdownTestClient() {
  // Fully shut down before: repeat calls are a no-op.
  if (testClientShutdownComplete()) return;
  // App reference without SDK modules is unreachable by construction (both
  // are assigned and released together); fail loudly rather than leak.
  if (testClientApp && !testClientModules) {
    throw new Error('test client shutdown: app reference without SDK modules; cannot release safely');
  }
  if (!testClientApp) {
    // Never initialized (or initialization never completed): nothing holds
    // resources. Deliberately NOT marked complete, so a later initialization
    // is still shut down properly.
    testClientModules = null;
    return;
  }
  const { appMod, authMod, fsMod } = testClientModules;
  const app = testClientApp;
  const failures = [];
  // Each step runs at most once per app; completed steps are skipped, so a
  // retry never repeats a destructive operation that already succeeded.
  // Steps are attempted independently: one failure does not block the rest.
  if (!testClientShutdownSteps.signedOut) {
    try {
      // Sign out: stops token-refresh timers and the Auth state listener.
      await authMod.signOut(authMod.getAuth(app));
      testClientShutdownSteps.signedOut = true;
    } catch (e) {
      failures.push(e);
    }
  }
  if (!testClientShutdownSteps.terminated) {
    try {
      // Terminate Firestore: closes gRPC channels and persistence layers.
      await fsMod.terminate(fsMod.getFirestore(app));
      testClientShutdownSteps.terminated = true;
    } catch (e) {
      failures.push(e);
    }
  }
  if (!testClientShutdownSteps.deleted) {
    try {
      // Delete the app: releases the container and any remaining handles.
      await appMod.deleteApp(app);
      testClientShutdownSteps.deleted = true;
    } catch (e) {
      failures.push(e);
    }
  }
  if (failures.length > 0) {
    // Never hide cleanup failures, and never mark an incomplete shutdown
    // complete: references stay intact so a later call retries exactly the
    // unfinished steps. The caller reports these alongside any data-cleanup
    // error, so a broken teardown cannot masquerade as a green run.
    const combined = new Error(
      `test client shutdown failed (${failures.length} step(s)): ` +
      failures.map((e) => (e && e.message) || String(e)).join('; ')
    );
    combined.cause = failures;
    throw combined;
  }
  // All steps complete: release references (repeat calls no-op via the
  // completion check above).
  testClientModules = null;
  testClientApp = null;
}

// Creates (or heals) a synthetic test client. Tracked for cleanup.
export async function ensureTestClient(slug, active = true) {
  const { db } = await admin();
  await db.collection('clients').doc(slug).set(
    { name: `Test ${slug}`, slug, active, createdAt: new Date() },
    { merge: true }
  );
  trackDoc('clients', slug);
}

// Cleanup tracking: only uids and documents the tests registered here are
// ever deleted, so cleanup cannot touch anything it did not create. The
// supported workflow is `firebase emulators:exec`, which provides fresh
// emulator state per run; this cleanup is belt-and-braces for that flow.
const trackedUids = new Set();
const trackedDocs = [];
export function trackUser(uid) {
  if (uid) trackedUids.add(uid);
}
export function trackDoc(collection, id) {
  if (id) trackedDocs.push({ collection, id });
}
export async function cleanupTestData() {
  const { auth, db } = await admin();
  for (const { collection, id } of trackedDocs.splice(0)) {
    try {
      await db.collection(collection).doc(id).delete();
    } catch {
      // Already gone: fine.
    }
  }
  for (const uid of [...trackedUids]) {
    trackedUids.delete(uid);
    try {
      await auth.deleteUser(uid);
    } catch {
      // Already gone: fine.
    }
  }
}

// TEST-NET-3 addresses (RFC 5737): documentation-only, never routed. A fresh
// address per filing keeps the IP rate-limit buckets independent between tests.
let ipCounter = 10;
export function nextTestIp() {
  ipCounter += 1;
  return `203.0.113.${ipCounter}`;
}

export function jsonRequest(url, { method = 'POST', body, headers = {} } = {}) {
  return new Request(url, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}
