import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { ADMIN_EMAILS } from './adminAccess';

// Initialization is deferred to first use (inside a request handler's own
// try/catch) rather than run at module load. A throw at import time happens
// before any route's try/catch exists, so Next.js serves its own plain-text
// "Internal Server Error" page instead of JSON — this keeps failures (e.g.
// missing/malformed credentials) catchable and reportable as JSON.
let adminApp;

function getAdminApp() {
  if (adminApp) return adminApp;
  if (getApps().length) {
    adminApp = getApps()[0];
    return adminApp;
  }

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  // Named FB_ADMIN_* rather than FIREBASE_* because Firebase's deploy
  // tooling reserves the FIREBASE_ env var prefix for its own internal use
  // and rejects ("Key ... is reserved for internal use") any .env entry or
  // `functions:secrets:set` name that starts with it.
  const clientEmail = process.env.FB_ADMIN_CLIENT_EMAIL;
  const privateKey = (process.env.FB_ADMIN_PRIVATE_KEY || '').replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    const missing = [
      !projectId && 'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      !clientEmail && 'FB_ADMIN_CLIENT_EMAIL',
      !privateKey && 'FB_ADMIN_PRIVATE_KEY',
    ].filter(Boolean).join(', ');
    throw new Error(`Firebase Admin SDK is not configured: missing ${missing}`);
  }

  adminApp = initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
  return adminApp;
}

export function getAdminAuth() {
  return getAuth(getAdminApp());
}

export function getAdminDb() {
  return getFirestore(getAdminApp());
}

// Admin SDK routes require an explicitly allowlisted, verified admin email
// or a trusted admin custom claim. Portal accounts are never admins, even if
// other claims are present. The Admin SDK bypasses Firebase security rules.
export async function requireAdmin(request) {
  const authHeader = request.headers.get('authorization') || '';
  const match = authHeader.match(/^Bearer (.+)$/);
  if (!match) {
    return { error: 'Missing Authorization header', status: 401 };
  }
  try {
    const decoded = await getAdminAuth().verifyIdToken(match[1]);
    const email = String(decoded.email || '').trim().toLowerCase();
    const isAllowlistedAdmin = ADMIN_EMAILS.includes(email);
    const hasAdminClaim = decoded.admin === true;
    // Presence-based, matching firestore.rules ('clientSlug' in
    // request.auth.token): even an empty-string claim marks a portal user.
    // Portal users can never satisfy this gate, even with an admin claim.
    const hasClientClaim = decoded.clientSlug !== undefined;

    if (hasClientClaim || decoded.email_verified !== true || (!isAllowlistedAdmin && !hasAdminClaim)) {
      return { error: 'Forbidden', status: 403 };
    }
    return { decoded };
  } catch (e) {
    return { error: 'Invalid or expired token', status: 401 };
  }
}
