'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { doc, getDoc, collection, query, where, or, getDocs, updateDoc, deleteField } from 'firebase/firestore';
import { auth, db } from '../../../../lib/firebase';

const navy = '#0a1628';
const gold = '#c9a84c';
const neonBlue = '#00d4ff';

// Admin CRM statuses collapse into these 5 client-facing labels, used only
// as the fallback shown until a portal user sets their own portalStatus.
// This mapping is read-only against the admin `status` field - the portal
// never writes to `status`, so the admin pipeline is unaffected.
const ADMIN_STATUS_LABEL = {
  new:               'Screening',
  reviewing:         'Screening',
  shortlisted:       'Visa Process',
  offered:           'Visa Process',
  preinterview:      'Interview',
  interviewed:       'Interview',
  placed:            'Ready',
  waitingassignment: 'Ready',
  assigned:          'Assigned',
  placedpaid:        'Assigned',
  rejected:          'Rejected',
};
const STATUS_LABEL_STYLES = {
  Screening:      { color: '#7c3aed', bg: '#ede9fe' },
  'Visa Process': { color: '#0284c7', bg: '#e0f2fe' },
  Interview:      { color: '#d97706', bg: '#fef3c7' },
  Ready:          { color: '#ffffff', bg: '#00c853', shadow: '0 0 0 1px rgba(0,200,83,0.35), 0 0 10px rgba(0,200,83,0.55)' },
  Assigned:       { color: '#0369a1', bg: '#bae6fd' },
  Rejected:       { color: '#b91c1c', bg: '#fecaca' },
};
// The set of values a portal user can pick from the Status dropdown.
const PORTAL_STATUS_OPTIONS = ['Screening', 'Interview', 'Visa Process', 'Ready', 'Assigned'];
const STATUS_FILTER_OPTIONS = ['Screening', 'Visa Process', 'Interview', 'Ready', 'Assigned', 'Rejected'];

const COUNTRY_OPTIONS = ['Colombia', 'Peru', 'Ecuador', 'Chile', 'Argentina', 'Panama', 'Dominican Republic', 'Mexico', 'Venezuela', 'Costa Rica', 'Paraguay', 'Uruguay'];

// portalStatus (set by the client via the dropdown) takes priority over the
// mapped admin status, so the two pipelines stay fully independent: the
// client can change their own view without ever writing to `status`, and
// the admin CRM never reads `portalStatus` at all.
function getStatusLabel(c) {
  return c.portalStatus || ADMIN_STATUS_LABEL[c.status] || 'Screening';
}
function getStatusBadge(c) {
  const label = getStatusLabel(c);
  return { label, ...(STATUS_LABEL_STYLES[label] || STATUS_LABEL_STYLES.Screening) };
}

function getScreeningStatus(c) {
  if (c.status === 'rejected') return 'failed';
  if (!c.status || c.status === 'new' || c.status === 'reviewing') return 'pending';
  return 'passed';
}

const INTERVIEW_DONE_STATUSES = ['interviewed', 'placed', 'waitingassignment', 'assigned', 'placedpaid'];
function getInterviewStatus(c) {
  if (INTERVIEW_DONE_STATUSES.includes(c.status)) return 'done';
  if (c.interviewDate) return 'pending';
  return 'none';
}

// Small set of common source-country -> ISO code mappings for the flag
// column. Falls back to no flag (just the country name) if unmapped.
const COUNTRY_CODES = {
  philippines: 'PH', indonesia: 'ID', india: 'IN', colombia: 'CO', mexico: 'MX',
  honduras: 'HN', jamaica: 'JM', 'south africa': 'ZA', 'dominican republic': 'DO',
  peru: 'PE', ecuador: 'EC', brazil: 'BR', argentina: 'AR', chile: 'CL', panama: 'PA',
  'costa rica': 'CR', guatemala: 'GT', 'el salvador': 'SV', nicaragua: 'NI',
  venezuela: 'VE', nigeria: 'NG', ghana: 'GH', kenya: 'KE', vietnam: 'VN',
  thailand: 'TH', 'sri lanka': 'LK', nepal: 'NP', bangladesh: 'BD', ukraine: 'UA',
  romania: 'RO', poland: 'PL', serbia: 'RS', turkey: 'TR', egypt: 'EG', morocco: 'MA',
  'united states': 'US', usa: 'US', 'united kingdom': 'GB', uk: 'GB', canada: 'CA',
  australia: 'AU', spain: 'ES', portugal: 'PT', italy: 'IT', greece: 'GR',
  bulgaria: 'BG', croatia: 'HR', hungary: 'HU', 'czech republic': 'CZ', slovakia: 'SK',
  russia: 'RU', china: 'CN', malaysia: 'MY', myanmar: 'MM', cambodia: 'KH',
};
function countryFlag(country) {
  if (!country) return '';
  const code = COUNTRY_CODES[String(country).trim().toLowerCase()];
  if (!code) return '';
  return code.replace(/./g, ch => String.fromCodePoint(127397 + ch.charCodeAt(0)));
}

export default function PortalDashboardPage() {
  const { slug } = useParams();
  const router = useRouter();

  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState(null);
  const [client, setClient] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const positionFilterOptions = [...new Set(candidates.map(candidate => candidate.position).filter(Boolean))].sort();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [positionFilter, setPositionFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [pwOpen, setPwOpen] = useState(false);
  const [pwCurrent, setPwCurrent] = useState('');
  const [pwNew, setPwNew] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [pwStatus, setPwStatus] = useState(''); // '' | 'saving' | 'success'
  const [pwError, setPwError] = useState('');
  const slugRef = useRef(slug);
  slugRef.current = slug;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { router.replace('/portal/' + slugRef.current); return; }
      try {
        const puSnap = await getDoc(doc(db, 'portalUsers', u.uid));
        if (!puSnap.exists() || !puSnap.data().clientSlug) {
          // Do NOT call signOut(auth) here: Firebase Auth persists its
          // session per browser origin, shared across every selectivecrew.com
          // tab/page (including /admin). Signing out here would kill an
          // admin's session elsewhere in the same browser just because this
          // dashboard doesn't recognize them as a portal user. Redirect only.
          router.replace('/portal/' + slugRef.current);
          return;
        }
        if (puSnap.data().clientSlug !== slugRef.current) {
          router.replace('/portal/' + puSnap.data().clientSlug + '/dashboard');
          return;
        }
        setUser(u);
        setAuthChecked(true);
      } catch (e) {
        router.replace('/portal/' + slugRef.current);
      }
    });
    return () => unsub();
  }, [router]);

  useEffect(() => {
    if (!authChecked) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'clients', slug));
        setClient(snap.exists() ? { id: snap.id, ...snap.data() } : { id: slug, name: slug, color: navy });
      } catch (e) {
        setClient({ id: slug, name: slug, color: navy });
      }
    })();
  }, [authChecked, slug]);

  const loadCandidates = useCallback(async () => {
    try {
      const q = query(collection(db, 'applications'), or(
        where('portalClientSlug', '==', slug),
        where('cruiseLine', '==', slug),
      ));
      const snap = await getDocs(q);
      setCandidates(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLastUpdated(new Date());
    } catch (e) {
      console.error('Failed to load candidates:', e);
    }
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    if (!authChecked) return;
    loadCandidates();
    const interval = setInterval(loadCandidates, 60000);
    return () => clearInterval(interval);
  }, [authChecked, loadCandidates]);

  async function handleLogout() {
    await signOut(auth);
    router.replace('/portal/' + slug);
  }

  function openChangePassword() {
    setPwCurrent(''); setPwNew(''); setPwConfirm(''); setPwError(''); setPwStatus('');
    setPwOpen(true);
  }

  function closeChangePassword() {
    if (pwStatus === 'saving') return;
    setPwOpen(false);
    setPwCurrent(''); setPwNew(''); setPwConfirm(''); setPwError(''); setPwStatus('');
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setPwError('');
    if (!pwCurrent || !pwNew || !pwConfirm) { setPwError('Please fill in all three fields.'); return; }
    if (pwNew.length < 8) { setPwError('New password must be at least 8 characters.'); return; }
    if (pwNew !== pwConfirm) { setPwError('New password and confirmation do not match.'); return; }
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.email) { setPwError('Your session has expired. Please sign in again.'); return; }
    setPwStatus('saving');
    try {
      // updatePassword() requires a recent sign-in; re-authenticating with the
      // current password satisfies that and confirms the password is correct.
      await reauthenticateWithCredential(currentUser, EmailAuthProvider.credential(currentUser.email, pwCurrent));
      await updatePassword(currentUser, pwNew);
      setPwCurrent(''); setPwNew(''); setPwConfirm('');
      setPwStatus('success');
    } catch (err) {
      const code = err && err.code;
      setPwStatus('');
      if (code === 'auth/wrong-password' || code === 'auth/invalid-credential' || code === 'auth/invalid-login-credentials') {
        setPwError('Current password is incorrect.');
      } else if (code === 'auth/too-many-requests') {
        setPwError('Too many attempts. Please wait a few minutes and try again.');
      } else if (code === 'auth/weak-password') {
        setPwError('That password is too weak. Please choose a stronger one.');
      } else {
        setPwError('Could not update your password. Please try again.');
      }
    }
  }

  async function removeFromPortalPipeline(id) {
    if (!window.confirm('Remove this candidate from the ' + (client?.name || slug) + ' pipeline?')) return;
    try {
      // Clear both the new client assignment and the legacy cruise
      // assignment. The application and its other fields remain intact.
      await updateDoc(doc(db, 'applications', id), { cruiseLine: deleteField(), portalClientSlug: deleteField() });
      setCandidates(prev => prev.filter(c => c.id !== id));
      setSelectedCandidate(prev => (prev && prev.id === id) ? null : prev);
    } catch (e) {
      console.error('Failed to remove candidate from portal:', e);
      alert('Could not remove that candidate. Please try again.');
    }
  }

  async function updatePortalStatus(id, newLabel) {
    try {
      // Written to portalStatus only - the admin CRM's `status` field is
      // never touched, so the admin pipeline stages are unaffected.
      await updateDoc(doc(db, 'applications', id), { portalStatus: newLabel });
      setCandidates(prev => prev.map(c => c.id === id ? { ...c, portalStatus: newLabel } : c));
      setSelectedCandidate(prev => (prev && prev.id === id) ? { ...prev, portalStatus: newLabel } : prev);
    } catch (e) {
      console.error('Failed to update portal status:', e);
      alert('Could not update that status. Please try again.');
    }
  }

  async function updateCandidateCountry(id, newCountry) {
    try {
      await updateDoc(doc(db, 'applications', id), { country: newCountry });
      setCandidates(prev => prev.map(c => c.id === id ? { ...c, country: newCountry } : c));
      setSelectedCandidate(prev => (prev && prev.id === id) ? { ...prev, country: newCountry } : prev);
    } catch (e) {
      console.error('Failed to update candidate country:', e);
      alert('Could not update that nationality. Please try again.');
    }
  }

  const filtered = candidates
    .filter(c => !search || (c.fullName || '').toLowerCase().includes(search.toLowerCase()))
    .filter(c => statusFilter === 'all' || getStatusBadge(c).label === statusFilter)
    .filter(c => positionFilter === 'all' || c.position === positionFilter);

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'status') {
      const s = getStatusBadge(a).label.localeCompare(getStatusBadge(b).label);
      if (s !== 0) return s;
    }
    return (a.fullName || '').localeCompare(b.fullName || '');
  });

  const accent = (client && client.color) || navy;

  if (!authChecked || loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4fb', fontFamily: 'system-ui,sans-serif' }}>
        <p style={{ color: '#888', fontSize: 14 }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4fb', fontFamily: 'system-ui,sans-serif', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        * { box-sizing: border-box; }
        .portal-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .portal-row { cursor: pointer; transition: background 0.12s; }
        .portal-row:hover:not(.portal-row-selected) { background: #eef2fb !important; }
        @media (max-width: 768px) {
          .portal-header { padding: 0 14px !important; }
          .portal-header-name { font-size: 12px !important; }
          .portal-content { padding: 14px 10px !important; }
          .portal-toolbar { flex-direction: column !important; align-items: flex-start !important; }
        }
        .portal-modal-overlay { position: fixed; inset: 0; background: rgba(10,22,40,0.55); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .portal-modal { background: #fff; border-radius: 20px; width: 100%; max-width: 460px; max-height: 88vh; overflow-y: auto; box-shadow: 0 24px 80px rgba(10,22,40,0.35); }
        @media (max-width: 640px) {
          .portal-modal-overlay { align-items: flex-end; padding: 0; }
          .portal-modal { max-width: 100%; max-height: 92vh; border-radius: 20px 20px 0 0; }
        }
      `}</style>
      <div className="portal-header" style={{ background: accent, padding: '0 24px', height: 60, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: 1.2, margin: '0 0 2px' }}>Selective Crew</p>
          <p className="portal-header-name" style={{ fontSize: 15, fontWeight: 800, color: '#fff', margin: 0 }}>{client.name} Portal</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{user && user.email}</span>
          <button onClick={openChangePassword} style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Change Password</button>
          <button onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Sign Out</button>
        </div>
      </div>

      <div className="portal-content" style={{ padding: '20px 24px', flex: 1 }}>
        <div className="portal-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name..."
              style={{ padding: '9px 14px', border: '1.5px solid #dde5f0', borderRadius: 9, fontSize: 13, outline: 'none', width: 200 }} />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              style={{ padding: '9px 12px', border: '1.5px solid #dde5f0', borderRadius: 9, fontSize: 13, outline: 'none', background: '#fff', color: navy }}>
              <option value="all">All Statuses</option>
              {STATUS_FILTER_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={positionFilter} onChange={e => setPositionFilter(e.target.value)}
              style={{ padding: '9px 12px', border: '1.5px solid #dde5f0', borderRadius: 9, fontSize: 13, outline: 'none', background: '#fff', color: navy }}>
              <option value="all">All Positions</option>
              {positionFilterOptions.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              style={{ padding: '9px 12px', border: '1.5px solid #dde5f0', borderRadius: 9, fontSize: 13, outline: 'none', background: '#fff', color: navy }}>
              <option value="name">Sort: Name</option>
              <option value="status">Sort: Status</option>
            </select>
            <span style={{ fontSize: 12, fontWeight: 700, color: navy }}>{sorted.length} candidate{sorted.length !== 1 ? 's' : ''}</span>
          </div>
          <span style={{ fontSize: 11, color: '#aaa' }}>{lastUpdated ? 'Updated ' + lastUpdated.toLocaleTimeString() : ''} · refreshes every 60s</span>
        </div>

        <div className="portal-table-wrap" style={{ border: '1px solid #e2e8f0', borderRadius: 14, background: '#fff' }}>
          <table style={{ width: '100%', minWidth: 1440, borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: navy }}>
                {['Candidate', 'Position', 'Nationality', 'Screening', 'Interview', 'Status', 'Client', 'Cruise Line', 'iCIMS ID', 'Notes', ''].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '11px 14px', color: '#fff', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 && (
                <tr><td colSpan={11} style={{ textAlign: 'center', padding: '32px 0', color: '#aaa', fontSize: 13 }}>No candidates found</td></tr>
              )}
              {sorted.map((c, i) => {
                const isSelected = selectedCandidate && selectedCandidate.id === c.id;
                const statusBadge = getStatusBadge(c);
                const screening = getScreeningStatus(c);
                const interview = getInterviewStatus(c);
                return (
                  <tr key={c.id}
                    onClick={() => setSelectedCandidate(c)}
                    className={'portal-row' + (isSelected ? ' portal-row-selected' : '')}
                    style={{
                      background: isSelected ? '#fbf3de' : (i % 2 === 0 ? '#fff' : '#f8fafc'),
                      borderLeft: '3px solid ' + (isSelected ? gold : 'transparent'),
                      borderBottom: '1px solid #eef1f6',
                    }}>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,' + navy + ',#0e4d8a)', color: '#fff', fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {(c.fullName || '?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: navy, whiteSpace: 'nowrap' }}>
                            {countryFlag(c.country) && <span style={{ marginRight: 5 }}>{countryFlag(c.country)}</span>}
                            {c.fullName || 'Unknown'}
                          </div>
                          {c.country && <div style={{ fontSize: 11, color: '#888' }}>{c.country}</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '10px 14px', color: '#334155', whiteSpace: 'nowrap' }}>{c.position || '—'}</td>
                    <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }} onClick={e => e.stopPropagation()}>
                      <select
                        value={c.country || ''}
                        onChange={e => updateCandidateCountry(c.id, e.target.value)}
                        title="Change nationality"
                        style={{ border: '1px solid #dde5f0', borderRadius: 7, padding: '4px 8px', fontSize: 12, color: '#334155', background: '#fff', cursor: 'pointer', outline: 'none' }}>
                        <option value="">—</option>
                        {COUNTRY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        {c.country && !COUNTRY_OPTIONS.includes(c.country) && <option value={c.country}>{c.country}</option>}
                      </select>
                    </td>
                    <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                      {screening === 'passed' && <span style={{ color: '#15803d', fontWeight: 700, fontSize: 12 }}>&#9989; Passed</span>}
                      {screening === 'pending' && <span style={{ color: '#b45309', fontWeight: 700, fontSize: 12 }}>&#9203; Pending</span>}
                      {screening === 'failed' && <span style={{ color: '#b91c1c', fontWeight: 700, fontSize: 12 }}>&#10060; Failed</span>}
                    </td>
                    <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                      {interview === 'done' && <span style={{ color: '#15803d', fontWeight: 700, fontSize: 12 }}>&#9989; Done</span>}
                      {interview === 'pending' && <span style={{ color: '#b45309', fontWeight: 700, fontSize: 12 }}>&#9203; Pending</span>}
                      {interview === 'none' && <span style={{ color: '#aaa', fontWeight: 700, fontSize: 12 }}>&mdash;</span>}
                    </td>
                    <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }} onClick={e => e.stopPropagation()}>
                      <select
                        value={statusBadge.label}
                        onChange={e => updatePortalStatus(c.id, e.target.value)}
                        title="Change candidate status"
                        style={{ background: statusBadge.bg, color: statusBadge.color, boxShadow: statusBadge.shadow || 'none', borderRadius: 20, padding: '3px 22px 3px 10px', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.3, border: 'none', cursor: 'pointer', appearance: 'auto' }}>
                        {!PORTAL_STATUS_OPTIONS.includes(statusBadge.label) && (
                          <option value={statusBadge.label} disabled>{statusBadge.label}</option>
                        )}
                        {PORTAL_STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                      <span style={{ background: neonBlue, color: navy, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 800 }}>{client?.name || slug}</span>
                    </td>
                    <td style={{ padding: '10px 14px', color: '#334155', whiteSpace: 'nowrap' }}>{c.shipCruiseLine || '—'}</td>
                    <td style={{ padding: '10px 14px', color: '#334155', whiteSpace: 'nowrap' }}>{c.icims_id || '—'}</td>
                    <td style={{ padding: '10px 14px', color: '#666', fontSize: 12, maxWidth: 220 }}>
                      {c.notes ? (c.notes.length > 50 ? c.notes.slice(0, 50) + '…' : c.notes) : '—'}
                    </td>
                    <td style={{ padding: '10px 14px' }} onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => removeFromPortalPipeline(c.id)}
                        title="Remove from pipeline"
                        aria-label="Remove from pipeline"
                        style={{ width: 22, height: 22, borderRadius: '50%', background: '#fee2e2', color: '#dc2626', border: 'none', fontSize: 12, fontWeight: 800, lineHeight: '22px', textAlign: 'center', padding: 0, cursor: 'pointer' }}>
                        &#10005;
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '16px 0', color: '#aaa', fontSize: 12 }}>
        Powered by <span style={{ color: gold, fontWeight: 700 }}>Selective Crew</span>
      </div>

      {selectedCandidate && (() => {
        const c = selectedCandidate;
        const statusBadge = getStatusBadge(c);
        const appliedDate = c.createdAt && c.createdAt.seconds ? new Date(c.createdAt.seconds * 1000).toLocaleDateString() : '';
        return (
          <div className="portal-modal-overlay" onClick={() => setSelectedCandidate(null)}>
            <div className="portal-modal" onClick={e => e.stopPropagation()}>
              <div style={{ padding: '18px 22px', borderBottom: '1px solid #e8eef8', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: navy, borderRadius: '20px 20px 0 0', position: 'sticky', top: 0 }}>
                <p style={{ fontSize: 15, fontWeight: 800, color: '#fff', margin: 0 }}>Candidate Details</p>
                <button onClick={() => setSelectedCandidate(null)} aria-label="Close" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>&#10005;</button>
              </div>
              <div style={{ padding: 24 }}>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,' + navy + ',#0e4d8a)', color: '#fff', fontSize: 22, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                    {(c.fullName || '?').charAt(0).toUpperCase()}
                  </div>
                  <p style={{ fontSize: 18, fontWeight: 800, color: navy, margin: '0 0 6px' }}>
                    {countryFlag(c.country) && <span style={{ marginRight: 6 }}>{countryFlag(c.country)}</span>}
                    {c.fullName || 'Unknown'}
                  </p>
                  <span style={{ background: statusBadge.bg, color: statusBadge.color, boxShadow: statusBadge.shadow || 'none', borderRadius: 20, padding: '3px 12px', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.3 }}>{statusBadge.label}</span>
                </div>

                <div style={{ background: neonBlue, color: navy, borderRadius: 12, padding: '12px 16px', marginBottom: 14, textAlign: 'center' }}>
                  <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 3px', opacity: 0.75 }}>Client</p>
                  <p style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>{client?.name || slug}</p>
                </div>

                <div style={{ background: '#f8faff', borderRadius: 12, padding: 16, marginBottom: 14, border: '1px solid #e8eef8' }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Contact</p>
                  {[
                    { label: 'Email', value: c.email },
                    { label: 'WhatsApp', value: c.whatsapp, href: c.whatsapp ? 'https://wa.me/' + c.whatsapp.replace(/\D/g, '') : null },
                    { label: 'Country', value: c.country },
                  ].filter(f => f.value).map(f => (
                    <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9', fontSize: 13 }}>
                      <span style={{ color: '#888', fontWeight: 600 }}>{f.label}</span>
                      {f.href ? (
                        <a href={f.href} target="_blank" rel="noopener noreferrer" style={{ color: '#16a34a', fontWeight: 700, textDecoration: 'none' }}>{f.value}</a>
                      ) : (
                        <span style={{ color: navy, textAlign: 'right', maxWidth: 220, wordBreak: 'break-all' }}>{f.value}</span>
                      )}
                    </div>
                  ))}
                </div>

                <div style={{ background: '#f8faff', borderRadius: 12, padding: 16, marginBottom: 14, border: '1px solid #e8eef8' }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Application</p>
                  {[
                    { label: 'Position', value: c.position },
                    { label: 'English Level', value: c.englishLevel || c.english },
                    { label: 'Experience', value: c.experience },
                    { label: 'Applied', value: appliedDate },
                    { label: 'Score', value: c.grade ? (c.score ? c.score + '/100 ' : '') + 'Grade ' + c.grade : '' },
                  ].filter(f => f.value).map(f => (
                    <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9', fontSize: 13 }}>
                      <span style={{ color: '#888', fontWeight: 600 }}>{f.label}</span>
                      <span style={{ color: navy, textAlign: 'right', maxWidth: 220, wordBreak: 'break-all' }}>{f.value}</span>
                    </div>
                  ))}
                </div>

                {(c.interviewDate || c.meetLink) && (
                  <div style={{ background: '#f8faff', borderRadius: 12, padding: 16, marginBottom: 14, border: '1px solid #e8eef8' }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Interview</p>
                    {c.interviewDate && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9', fontSize: 13 }}>
                        <span style={{ color: '#888', fontWeight: 600 }}>Date &amp; Time</span>
                        <span style={{ color: navy }}>{c.interviewDate}{c.interviewTime ? ' ' + c.interviewTime : ''}</span>
                      </div>
                    )}
                    {c.meetLink && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13 }}>
                        <span style={{ color: '#888', fontWeight: 600 }}>Meet Link</span>
                        <a href={c.meetLink} target="_blank" rel="noopener noreferrer" style={{ color: '#0e4d8a', fontWeight: 700, textDecoration: 'none' }}>Join &rarr;</a>
                      </div>
                    )}
                  </div>
                )}

                {(c.sbInterested || c.videoWatched || c.omniaCompleted) && (
                  <div style={{ background: '#f8faff', borderRadius: 12, padding: 16, marginBottom: 14, border: '1px solid #e8eef8' }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Milestones</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {c.sbInterested && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 10, fontWeight: 800, background: '#d1fae5', color: '#16a34a', borderRadius: 4, padding: '2px 6px' }}>SB &#10003;</span>
                          <span style={{ fontSize: 12, color: navy }}>Confirmed interest in Starboard</span>
                        </div>
                      )}
                      {c.videoWatched && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 10, fontWeight: 800, background: '#fef9c3', color: '#854d0e', borderRadius: 4, padding: '2px 6px' }}>VID &#10003;</span>
                          <span style={{ fontSize: 12, color: navy }}>Watched mandatory video</span>
                        </div>
                      )}
                      {c.omniaCompleted && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 10, fontWeight: 800, background: '#ede9fe', color: '#6d28d9', borderRadius: 4, padding: '2px 6px' }}>OMN &#10003;</span>
                          <span style={{ fontSize: 12, color: navy }}>Completed Omnia assessment</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {c.notes && (
                  <div style={{ background: '#f8faff', borderRadius: 12, padding: 16, marginBottom: 4, border: '1px solid #e8eef8' }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Notes</p>
                    <p style={{ fontSize: 13, color: navy, margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{c.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
      {pwOpen && (
        <div className="portal-modal-overlay" onClick={closeChangePassword}>
          <div className="portal-modal" style={{ maxWidth: 380 }} onClick={e => e.stopPropagation()}>
            <form onSubmit={handleChangePassword} style={{ padding: '22px 24px' }}>
              <p style={{ fontSize: 16, fontWeight: 800, color: navy, margin: '0 0 16px' }}>Change Password</p>
              {pwStatus === 'success' ? (
                <>
                  <p style={{ background: '#dcfce7', color: '#15803d', borderRadius: 9, padding: '10px 12px', fontSize: 13, fontWeight: 600, margin: '0 0 16px' }}>Password updated successfully</p>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={closeChangePassword} style={{ background: navy, color: '#fff', border: 'none', borderRadius: 9, padding: '9px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Close</button>
                  </div>
                </>
              ) : (
                <>
                  {[
                    ['Current password', pwCurrent, setPwCurrent, 'current-password'],
                    ['New password', pwNew, setPwNew, 'new-password'],
                    ['Confirm new password', pwConfirm, setPwConfirm, 'new-password'],
                  ].map(([label, value, setter, autoComplete]) => (
                    <label key={label} style={{ display: 'block', marginBottom: 12 }}>
                      <span style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 4 }}>{label}</span>
                      <input type="password" value={value} onChange={e => setter(e.target.value)} autoComplete={autoComplete}
                        style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #dde5f0', borderRadius: 9, fontSize: 13, outline: 'none' }} />
                    </label>
                  ))}
                  {pwError && <p style={{ color: '#b91c1c', background: '#fef2f2', borderRadius: 8, padding: '8px 12px', fontSize: 12, margin: '0 0 12px' }}>{pwError}</p>}
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                    <button type="button" onClick={closeChangePassword} disabled={pwStatus === 'saving'} style={{ background: '#f1f5f9', color: '#334155', border: 'none', borderRadius: 9, padding: '9px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                    <button type="submit" disabled={pwStatus === 'saving'} style={{ background: navy, color: '#fff', border: 'none', borderRadius: 9, padding: '9px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>{pwStatus === 'saving' ? 'Saving...' : 'Save'}</button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
