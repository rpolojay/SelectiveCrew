export const ADMIN_EMAILS = Object.freeze([
  'careers@selectivecrew.com',
  'rpolo@selectivecrew.com',
]);

export async function isAdminAccount(user) {
  if (!user) return false;

  try {
    const { claims } = await user.getIdTokenResult();
    if (claims.clientSlug) return false;
    const email = String(user.email || '').trim().toLowerCase();
    return user.emailVerified === true && (claims.admin === true || ADMIN_EMAILS.includes(email));
  } catch {
    return false;
  }
}
