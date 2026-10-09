'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../lib/firebase';

const navy = '#0a1628';
const gold = '#c9a84c';

export default function PortalLoginPage() {
  const { slug } = useParams();
  const router = useRouter();

  const [client, setClient] = useState(null);
  const [clientLoading, setClientLoading] = useState(true);
  const [checkingSession, setCheckingSession] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'clients', slug));
        if (active) setClient(snap.exists() ? { id: snap.id, ...snap.data() } : null);
      } catch (e) {
        if (active) setClient(null);
      }
      if (active) setClientLoading(false);
    })();
    return () => { active = false; };
  }, [slug]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { setCheckingSession(false); return; }
      try {
        const puSnap = await getDoc(doc(db, 'portalUsers', u.uid));
        if (puSnap.exists() && puSnap.data().clientSlug) {
          router.replace('/portal/' + puSnap.data().clientSlug + '/dashboard');
          return;
        }
      } catch (e) {}
      setCheckingSession(false);
    });
    return () => unsub();
  }, [router]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);
    setError('');
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const puSnap = await getDoc(doc(db, 'portalUsers', cred.user.uid));
      if (!puSnap.exists() || !puSnap.data().clientSlug) {
        // Do NOT sign out here: Firebase Auth's session is shared across
        // every selectivecrew.com tab in this browser (including /admin).
        // This account just isn't a portal user, so it simply won't be
        // redirected to a dashboard, but we must not clear the shared
        // session — that could kill someone else's authenticated tab.
        setError('This account is not linked to a client portal. Contact Selective Crew.');
        setSubmitting(false);
        return;
      }
      router.replace('/portal/' + puSnap.data().clientSlug + '/dashboard');
    } catch (err) {
      setError('Invalid email or password.');
      setSubmitting(false);
    }
  }

  const accent = (client && client.color) || navy;

  if (clientLoading || checkingSession) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: navy }}>
        <p style={{ color: '#fff', fontFamily: 'system-ui,sans-serif', fontSize: 14 }}>Loading...</p>
      </div>
    );
  }

  if (!client) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: navy, fontFamily: 'system-ui,sans-serif', padding: 20 }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: '40px 36px', width: '100%', maxWidth: 380, textAlign: 'center', boxShadow: '0 24px 80px rgba(10,22,40,0.3)' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>&#9875;</div>
          <p style={{ fontSize: 16, fontWeight: 800, color: navy, marginBottom: 6 }}>Portal Not Found</p>
          <p style={{ fontSize: 13, color: '#888' }}>No client portal exists for "{slug}". Please check your link or contact Selective Crew.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg,' + accent + ',#1a3a5c)', fontFamily: 'system-ui,sans-serif' }}>
      <style>{`
        * { box-sizing: border-box; }
        input:focus { border-color: ${accent} !important; }
        @media (max-width: 480px) {
          .portal-login-card { padding: 32px 24px !important; }
        }
      `}</style>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div className="portal-login-card" style={{ background: '#fff', borderRadius: 20, padding: '44px 40px', width: '100%', maxWidth: 400, boxShadow: '0 24px 80px rgba(10,22,40,0.35)' }}>
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <div style={{ fontSize: 34, marginBottom: 10 }}>&#9875;</div>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#9aa5b1', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>Selective Crew</p>
            <p style={{ fontSize: 20, fontWeight: 800, color: navy, margin: 0 }}>{client.name} Portal</p>
          </div>
          <form onSubmit={handleSubmit}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com"
              style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #dde5f0', borderRadius: 9, fontSize: 14, boxSizing: 'border-box', outline: 'none', marginBottom: 16 }} />
            <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="********"
              style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #dde5f0', borderRadius: 9, fontSize: 14, boxSizing: 'border-box', outline: 'none', marginBottom: 18 }} />
            {error && <div style={{ color: '#991b1b', background: '#fef2f2', padding: '10px 12px', borderRadius: 8, fontSize: 12, marginBottom: 14 }}>{error}</div>}
            <button type="submit" disabled={submitting} style={{ width: '100%', background: accent, color: '#fff', border: 'none', borderRadius: 10, padding: 13, fontSize: 15, fontWeight: 700, cursor: submitting ? 'default' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
              {submitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
      <div style={{ textAlign: 'center', padding: '18px 0', color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
        Powered by <span style={{ color: gold, fontWeight: 700 }}>Selective Crew</span>
      </div>
    </div>
  );
}
