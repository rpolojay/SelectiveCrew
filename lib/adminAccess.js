export const ADMIN_EMAILS = Object.freeze([
  'careers@selectivecrew.com',
  'rpolo@selectivecrew.com',
]);

export async function isAdminAccount(user) {
  if (!user) return false;

  try {
    const { claims } = await user.getIdTokenResult();
    // Presence-based, matching firestore.rules and requireAdmin: even an
    // empty-string clientSlug marks a portal user, never an admin.
    if (claims.clientSlug !== undefined) return false;
    const email = String(user.email || '').trim().toLowerCase();
    return user.emailVerified === true && (claims.admin === true || ADMIN_EMAILS.includes(email));
  } catch {
    return false;
  }
}
