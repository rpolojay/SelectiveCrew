import { createHmac } from 'node:crypto';
import { getAdminDb } from './firebaseAdmin';

// Rate limiting for public API endpoints.
//
// Secret: buckets are keyed with HMAC-SHA-256 under RATE_LIMIT_SECRET, a
// dedicated stable server-side secret (Secret Manager; declared in
// firebase.json frameworksBackend.secrets and apphosting.yaml). It must be
// stable across instances and deploys (rotation resets all buckets) and must
// NEVER be the Firebase private key or any credential used elsewhere.
//   - Production without a usable secret fails closed: every takeRateLimit
//     call denies (callers return their existing 429 response) and the outage
//     is loud in server logs. There is no predictable production fallback.
//   - Outside production only (emulators, tests), a documented insecure
//     constant is used so the suite runs without secrets.
//
// Trusted-proxy model: the app is served behind Firebase Hosting, which sets
// X-Forwarded-For with the original client IP as the first entry. Only
// syntactically valid IP literals from that entry (or X-Real-IP) are
// trusted; anything else maps to the shared 'unknown' bucket (fail-closed
// direction: strangers share one tight bucket). A caller reaching the
// backend directly (bypassing Hosting) can spoof these headers; mitigate by
// restricting backend ingress to Hosting/LB traffic (operator action, not
// verifiable from this repo).
//
// Retention: each counter carries expireAt (window end) for a Firestore TTL
// policy on apiRateLimits. The policy must be created separately (console or
// gcloud); nothing here verifies it exists.

const NON_PRODUCTION_SECRET = 'test-only-insecure-rate-limit-secret';

function rateLimitSecret() {
  const configured = process.env.RATE_LIMIT_SECRET;
  // Minimum length keeps trivially guessable values out of production.
  if (configured && configured.length >= 16) return configured;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('RATE_LIMIT_SECRET is not configured');
  }
  return NON_PRODUCTION_SECRET;
}

function isIpLiteral(value) {
  if (typeof value !== 'string' || !value) return false;
  if (/^(?:\d{1,3}\.){3}\d{1,3}$/.test(value)) return true; // IPv4 (bucket label; octets unchecked)
  return value.includes(':') && /^[0-9a-fA-F:]+$/.test(value); // IPv6 literal (no brackets, no names)
}

function clientAddress(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const first = forwarded ? String(forwarded).split(',')[0].trim() : '';
  const candidate = first || String(request.headers.get('x-real-ip') || '').trim();
  return isIpLiteral(candidate) ? candidate : 'unknown';
}

export async function takeRateLimit(request, { scope, subject = '', limit, windowMs }) {
  try {
    const address = clientAddress(request);
    // A present subject scopes the bucket globally (per email), independent
    // of client IP, so the limit cannot be bypassed by rotating addresses.
    // Without a subject the bucket stays per client IP. Callers combine an
    // IP-scoped check with a subject-scoped check for defense in depth.
    const key = createHmac('sha256', rateLimitSecret())
      .update(subject ? `${scope}:${subject}` : `${scope}:${address}`)
      .digest('hex');
    const db = getAdminDb();
    const ref = db.collection('apiRateLimits').doc(key);
    const now = Date.now();

    return await db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(ref);
      const current = snapshot.exists ? snapshot.data() : {};
      const activeWindow = Number(current.windowEndsAt || 0) > now;
      const count = activeWindow ? Number(current.count || 0) : 0;
      if (count >= limit) return false;
      const windowEndsAt = activeWindow ? current.windowEndsAt : now + windowMs;
      transaction.set(ref, {
        count: count + 1,
        windowEndsAt,
        expireAt: new Date(windowEndsAt),
      });
      return true;
    });
  } catch (error) {
    // Fail closed without exposing internals: callers map `false` to their
    // existing public 429 response. The full error stays server-side.
    console.error('Rate limit unavailable; denying request:', error);
    return false;
  }
}

export function keyedDigest(value) {
  // HMAC under the dedicated secret (see above). Changing the secret -- or
  // deploying this change -- invalidates outstanding document-access codes,
  // which must simply be re-requested (they expire after 10 minutes anyway).
  return createHmac('sha256', rateLimitSecret()).update(String(value)).digest('hex');
}
