// Shared portal input validation (single documented source).
//
// Client slugs are DNS-label shaped: lowercase alphanumerics and interior
// hyphens, 1-63 chars, never starting or ending with a hyphen. This keeps
// slugs safe for Firestore document ids, URL path segments, and HTML
// attributes without further encoding.

// Strict slug format (see above). Used by portal-users, the clients admin
// API, and (implicitly) the approval allowlist keys.
export const CLIENT_SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

export function isValidClientSlug(slug) {
  return typeof slug === 'string' && CLIENT_SLUG_RE.test(slug);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email) {
  return typeof email === 'string' && email.length <= 254 && EMAIL_RE.test(email);
}

// Minimal HTML escaping for untrusted text interpolated into invitation
// emails and pages. Mirrors the helper in request-portal-access.
export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]);
}
