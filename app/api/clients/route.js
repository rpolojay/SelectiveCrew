import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminAuth, getAdminDb, requireAdmin } from '../../../lib/firebaseAdmin';
import { isValidClientSlug } from '../../../lib/portalValidation';

// Server-managed client lifecycle (admin only).
//
// Deactivation is the safe first step and cuts access immediately, even for
// already-issued ID tokens:
//   1. Every portal user of the client loses the clientSlug claim (other
//      claims preserved), has refresh tokens revoked, and loses the
//      portalUsers record (deleted LAST, so a failure always leaves a retry
//      handle and the client stays active until revocation completes).
//   2. Live application assignments (portalClientSlug/cruiseLine) are moved
//      into a `portalAssignmentRevoked` stash, so claim-scoped queries match
//      nothing. The stash restores them on reactivation.
//   3. The clients/{slug} flag flips to active:false only after 1+2 succeed.
//
// Reactivation restores assignments; portal users are NOT restored and must
// be re-invited (their claims were stripped, not suspended).
//
// Deletion is refused while portal users or live assignments still reference
// the client. Compatibility: a missing `active` flag means active
// (pre-deactivation records need no migration); stash-only applications do
// not block deletion (their live assignment is already detached).

async function uidsForClient(adminAuth, adminDb, slug) {
  const uids = new Set();
  const docs = await adminDb.collection('portalUsers').where('clientSlug', '==', slug).get();
  for (const d of docs.docs) uids.add(d.id);
  // Belt-and-braces: also catch claim-only users whose record is missing.
  let pageToken;
  do {
    const page = await adminAuth.listUsers(1000, pageToken);
    for (const u of page.users) {
      if (u.customClaims && u.customClaims.clientSlug === slug) uids.add(u.uid);
    }
    pageToken = page.pageToken;
  } while (pageToken);
  return [...uids];
}

async function liveAssignments(adminDb, slug) {
  const byPortal = await adminDb.collection('applications').where('portalClientSlug', '==', slug).get();
  const byCruise = await adminDb.collection('applications').where('cruiseLine', '==', slug).get();
  const docs = new Map();
  for (const d of byPortal.docs.concat(byCruise.docs)) docs.set(d.id, d);
  return [...docs.values()];
}

async function batchCommit(adminDb, docs, buildUpdate) {
  for (let i = 0; i < docs.length; i += 400) {
    const batch = adminDb.batch();
    for (const d of docs.slice(i, i + 400)) batch.update(d.ref, buildUpdate(d));
    await batch.commit();
  }
}

async function deactivateClient(adminAuth, adminDb, slug) {
  const clientRef = adminDb.collection('clients').doc(slug);
  const snap = await clientRef.get();
  if (!snap.exists) return NextResponse.json({ error: 'Client not found.' }, { status: 404 });
  if (snap.data().active === false) {
    return NextResponse.json({ success: true, alreadyDeactivated: true });
  }

  const uids = await uidsForClient(adminAuth, adminDb, slug);
  const failed = [];
  let revoked = 0;
  for (const uid of uids) {
    try {
      let claims = null;
      try {
        claims = (await adminAuth.getUser(uid)).customClaims || {};
      } catch (e) {
        if (e.code !== 'auth/user-not-found') throw e;
        // Auth account already gone: just drop the record below.
      }
      if (claims) {
        const next = { ...claims };
        delete next.clientSlug;
        await adminAuth.setCustomUserClaims(uid, next);
        await adminAuth.revokeRefreshTokens(uid);
      }
      await adminDb.collection('portalUsers').doc(uid).delete();
      revoked += 1;
    } catch (e) {
      console.error(`clients deactivate: failed to revoke portal user ${uid}:`, e);
      failed.push(uid);
    }
  }
  if (failed.length > 0) {
    return NextResponse.json(
      { error: 'Some portal users could not be revoked; client left active. Retry to finish.', failed, revoked },
      { status: 500 }
    );
  }

  const assigned = await liveAssignments(adminDb, slug);
  const revokedAt = new Date();
  await batchCommit(adminDb, assigned, (d) => {
    const data = d.data();
    const stash = { slug, revokedAt };
    if (data.portalClientSlug !== undefined) stash.portalClientSlug = data.portalClientSlug;
    if (data.cruiseLine !== undefined) stash.cruiseLine = data.cruiseLine;
    const update = { portalAssignmentRevoked: stash };
    if (data.portalClientSlug !== undefined) update.portalClientSlug = FieldValue.delete();
    if (data.cruiseLine !== undefined) update.cruiseLine = FieldValue.delete();
    return update;
  });

  await clientRef.update({ active: false, deactivatedAt: new Date() });
  return NextResponse.json({ success: true, usersRevoked: revoked, applicationsDetached: assigned.length });
}

async function reactivateClient(adminDb, slug) {
  const clientRef = adminDb.collection('clients').doc(slug);
  const snap = await clientRef.get();
  if (!snap.exists) return NextResponse.json({ error: 'Client not found.' }, { status: 404 });
  if (snap.data().active !== false) {
    return NextResponse.json({ success: true, alreadyActive: true });
  }

  // Restore assignments BEFORE flipping the flag, so a crash leaves the
  // client inactive (safe direction) rather than active-but-detached.
  const stashed = await adminDb.collection('applications').where('portalAssignmentRevoked.slug', '==', slug).get();
  await batchCommit(adminDb, stashed.docs, (d) => {
    const stash = d.data().portalAssignmentRevoked || {};
    const update = { portalAssignmentRevoked: FieldValue.delete() };
    if (stash.portalClientSlug !== undefined) update.portalClientSlug = stash.portalClientSlug;
    if (stash.cruiseLine !== undefined) update.cruiseLine = stash.cruiseLine;
    return update;
  });

  await clientRef.update({ active: true, reactivatedAt: new Date() });
  // Portal users are deliberately NOT restored: re-invite them.
  return NextResponse.json({ success: true, applicationsRestored: stashed.size });
}

async function safeDeleteClient(adminDb, slug) {
  const clientRef = adminDb.collection('clients').doc(slug);
  const snap = await clientRef.get();
  if (!snap.exists) return NextResponse.json({ error: 'Client not found.' }, { status: 404 });

  const usersSnap = await adminDb.collection('portalUsers').where('clientSlug', '==', slug).get();
  const assigned = await liveAssignments(adminDb, slug);
  if (usersSnap.size > 0 || assigned.length > 0) {
    return NextResponse.json(
      {
        error: `Cannot delete: ${usersSnap.size} portal user(s) and ${assigned.length} assigned application(s) still reference this client. Deactivate it first, then delete once cleanup is finished.`,
        portalUsers: usersSnap.size,
        applications: assigned.length,
      },
      { status: 409 }
    );
  }
  await clientRef.delete();
  return NextResponse.json({ success: true });
}

export async function POST(request) {
  try {
    const auth = await requireAdmin(request);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const body = await request.json();
    const action = body?.action;
    const slug = (body?.slug || '').trim();
    if ((action !== 'deactivate' && action !== 'reactivate') || !isValidClientSlug(slug)) {
      return NextResponse.json({ error: 'Valid action (deactivate|reactivate) and client slug are required.' }, { status: 400 });
    }

    const adminAuth = getAdminAuth();
    const adminDb = getAdminDb();
    if (action === 'deactivate') return await deactivateClient(adminAuth, adminDb, slug);
    return await reactivateClient(adminDb, slug);
  } catch (err) {
    console.error('clients POST error:', err);
    return NextResponse.json({ error: err.message || 'Failed to update client' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const auth = await requireAdmin(request);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { searchParams } = new URL(request.url);
    const slug = (searchParams.get('slug') || '').trim();
    if (!isValidClientSlug(slug)) {
      return NextResponse.json({ error: 'Valid client slug is required.' }, { status: 400 });
    }
    return await safeDeleteClient(getAdminDb(), slug);
  } catch (err) {
    console.error('clients DELETE error:', err);
    return NextResponse.json({ error: err.message || 'Failed to delete client' }, { status: 500 });
  }
}
