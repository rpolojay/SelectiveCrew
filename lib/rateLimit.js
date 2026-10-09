import { createHash } from 'node:crypto';
import { getAdminDb } from './firebaseAdmin';

function clientAddress(request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') || 'unknown';
}

export async function takeRateLimit(request, { scope, subject = '', limit, windowMs }) {
  const address = clientAddress(request);
  const key = createHash('sha256')
    .update(`${scope}:${address}:${subject}:${process.env.FB_ADMIN_PRIVATE_KEY || 'local'}`)
    .digest('hex');
  const db = getAdminDb();
  const ref = db.collection('apiRateLimits').doc(key);
  const now = Date.now();

  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    const current = snapshot.exists ? snapshot.data() : {};
    const activeWindow = Number(current.windowEndsAt || 0) > now;
    const count = activeWindow ? Number(current.count || 0) : 0;
    if (count >= limit) return false;
    transaction.set(ref, {
      count: count + 1,
      windowEndsAt: activeWindow ? current.windowEndsAt : now + windowMs,
    });
    return true;
  });
}

export function keyedDigest(value) {
  return createHash('sha256')
    .update(`${process.env.FB_ADMIN_PRIVATE_KEY || 'local'}:${value}`)
    .digest('hex');
}
