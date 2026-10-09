'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, getDocs, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../../lib/firebase';
import { isAdminAccount } from '../../../lib/adminAccess';

const navy = '#0a1628';
const ocean = '#0e4d8a';
const gold = '#c9a84c';

function slugify(s) {
  return (s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

function portalWelcomeEmail({ clientName, portalUrl, email, password }) {
  const text = `Hi,

You've been given access to the ${clientName} client portal on Selective Crew.

Portal URL: ${portalUrl}
Login email: ${email}
Temporary password: ${password}

Log in using the link above. We recommend changing your password after your first login.

Best regards,
Selective Crew`;
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;background:#f0f4fb;padding:32px 16px;">
    <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e8eef8;">
      <div style="background:#0a1628;padding:28px 32px;">
        <p style="margin:0;color:#c9a84c;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">Selective Crew</p>
        <p style="margin:6px 0 0;color:#ffffff;font-size:18px;font-weight:800;">Client Portal Access</p>
      </div>
      <div style="padding:28px 32px;color:#0a1628;">
        <p style="margin:0 0 16px;font-size:14px;line-height:1.6;">Hi,</p>
        <p style="margin:0 0 20px;font-size:14px;line-height:1.6;">You've been given access to the <strong>${clientName}</strong> client portal on Selective Crew.</p>
        <div style="background:#f8faff;border:1px solid #e8eef8;border-radius:10px;padding:16px 18px;margin-bottom:20px;">
          <p style="margin:0 0 8px;font-size:13px;"><span style="color:#888;">Portal URL:</span> <a href="${portalUrl}" style="color:#c9a84c;font-weight:700;text-decoration:none;">${portalUrl}</a></p>
          <p style="margin:0 0 8px;font-size:13px;"><span style="color:#888;">Login email:</span> <strong>${email}</strong></p>
          <p style="margin:0;font-size:13px;"><span style="color:#888;">Temporary password:</span> <strong>${password}</strong></p>
        </div>
        <a href="${portalUrl}" style="display:inline-block;background:#c9a84c;color:#0a1628;text-decoration:none;font-weight:700;font-size:13px;padding:12px 22px;border-radius:8px;margin-bottom:20px;">Log In to Portal</a>
        <p style="margin:0;font-size:12px;color:#888;line-height:1.6;">Please log in using the link above and let us know if you'd like your password changed.</p>
      </div>
      <div style="background:#0a1628;padding:14px 32px;">
        <p style="margin:0;color:rgba(255,255,255,0.6);font-size:11px;">Selective Crew &middot; selectivecrew.com</p>
      </div>
    </div>
  </div>`;
  return { text, html };
}

export default function ClientsAdminPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [clients, setClients] = useState([]);
  const [portalUsers, setPortalUsers] = useState([]);

  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [newColor, setNewColor] = useState('#0a1628');
  const [addingClient, setAddingClient] = useState(false);
  const [clientError, setClientError] = useState('');

  const [puEmail, setPuEmail] = useState('');
  const [puPassword, setPuPassword] = useState('');
  const [puClientSlug, setPuClientSlug] = useState('');
  const [addingUser, setAddingUser] = useState(false);
  const [userError, setUserError] = useState('');
  const [userSuccess, setUserSuccess] = useState('');
  const [sendingInvite, setSendingInvite] = useState({});

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { setUser(null); setLoading(false); return; }
      if (!(await isAdminAccount(u))) {
        await signOut(auth);
        setUser(null); setLoginError('This account does not have admin access.'); setLoading(false);
        return;
      }
      setUser(u);
      setLoading(false);
      loadAll();
    });
    return () => unsub();
  }, []);

  async function loadClients() {
    try {
      const snap = await getDocs(collection(db, 'clients'));
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setClients(list);
      if (!puClientSlug && list.length) setPuClientSlug(list[0].slug || list[0].id);
    } catch (e) { console.error(e); }
  }
  async function loadPortalUsers() {
    try {
      const snap = await getDocs(collection(db, 'portalUsers'));
      setPortalUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { console.error(e); }
  }
  function loadAll() { loadClients(); loadPortalUsers(); }

  async function handleAddClient(e) {
    e.preventDefault();
    setClientError('');
    const name = newName.trim();
    const slug = slugify(newSlug || newName);
    if (!name || !slug) { setClientError('Name and slug are required.'); return; }
    if (clients.some(c => c.id === slug)) { setClientError('A client with this slug already exists.'); return; }
    setAddingClient(true);
    try {
      await setDoc(doc(db, 'clients', slug), { name, slug, color: newColor || navy, logo: '', createdAt: serverTimestamp() });
      setNewName(''); setNewSlug(''); setSlugTouched(false); setNewColor('#0a1628');
      await loadClients();
    } catch (err) {
      setClientError('Error: ' + err.message);
    }
    setAddingClient(false);
  }

  async function handleDeleteClient(client) {
    const usersOnClient = portalUsers.filter(u => u.clientSlug === client.id);
    const msg = usersOnClient.length
      ? 'Delete "' + client.name + '"? ' + usersOnClient.length + ' portal user(s) are linked to this client and will lose access.'
      : 'Delete "' + client.name + '"?';
    if (!window.confirm(msg)) return;
    try {
      await deleteDoc(doc(db, 'clients', client.id));
      await loadClients();
    } catch (err) { alert('Error: ' + err.message); }
  }

  async function handleAddPortalUser(e) {
    e.preventDefault();
    setUserError(''); setUserSuccess('');
    if (!puEmail.trim() || !puPassword || !puClientSlug) { setUserError('Email, password and client are required.'); return; }
    setAddingUser(true);
    try {
      const idToken = await auth.currentUser.getIdToken();
      const res = await fetch('/api/portal-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ email: puEmail.trim(), password: puPassword, clientSlug: puClientSlug, sendInvite: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create portal user');

      const createdEmail = puEmail.trim();
      setUserSuccess(data.emailSent
        ? 'Portal user created for ' + createdEmail + '. Welcome email sent.'
        : 'Portal user created for ' + createdEmail + ', but the welcome email failed to send. You can share their password directly.');
      setPuEmail(''); setPuPassword('');
      await loadPortalUsers();
    } catch (err) {
      setUserError(err.message);
    }
    setAddingUser(false);
  }

  async function handleSendInvite(client) {
    const email = window.prompt('Send portal invite to which email address?', '');
    if (!email || !email.trim()) return;
    const trimmedEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) { alert('That does not look like a valid email address.'); return; }

    const existing = portalUsers.find(u => u.clientSlug === client.id && u.email === trimmedEmail.toLowerCase());
    if (existing) {
      if (!window.confirm(trimmedEmail + ' already has portal access for ' + client.name + '. Sending a new invite will reset their password. Continue?')) return;
    }

    setSendingInvite(prev => ({ ...prev, [client.id]: true }));
    try {
      const idToken = await auth.currentUser.getIdToken();
      const res = await fetch('/api/portal-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ email: trimmedEmail, clientSlug: client.id, clientName: client.name, sendInvite: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send invite');
      if (data.emailSent) {
        alert('Invite sent to ' + trimmedEmail + '.');
      } else {
        alert('Portal account created for ' + trimmedEmail + ', but the invite email failed to send' + (data.emailError ? (': ' + data.emailError) : '') + '. You can add them manually below and share their password directly.');
      }
      await loadPortalUsers();
    } catch (err) {
      alert('Error: ' + err.message);
    }
    setSendingInvite(prev => ({ ...prev, [client.id]: false }));
  }

  async function handleDeletePortalUser(pu) {
    if (!window.confirm('Remove portal access for ' + pu.email + '?')) return;
    try {
      const idToken = await auth.currentUser.getIdToken();
      const res = await fetch('/api/portal-users?uid=' + encodeURIComponent(pu.id), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${idToken}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');
      await loadPortalUsers();
    } catch (err) { alert('Error: ' + err.message); }
  }

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p>Loading...</p></div>;

  if (!user) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#0a1628,#1a3a5c)', fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: '40px 36px', width: 360, boxShadow: '0 24px 80px rgba(10,22,40,0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>&#9875;</div>
          <p style={{ fontSize: 15, fontWeight: 800, color: navy }}>Selective Crew CRM</p>
        </div>
        <input type="email" placeholder="Email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #dde5f0', borderRadius: 9, fontSize: 14, boxSizing: 'border-box', outline: 'none', marginBottom: 12 }} />
        <input type="password" placeholder="Password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} onKeyDown={async e => { if (e.key === 'Enter') { try { await signInWithEmailAndPassword(auth, loginEmail, loginPassword); } catch (err) { setLoginError(err.message); } } }} style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #dde5f0', borderRadius: 9, fontSize: 14, boxSizing: 'border-box', outline: 'none', marginBottom: 16 }} />
        {loginError && <div style={{ color: '#991b1b', background: '#fef2f2', padding: '10px', borderRadius: 8, fontSize: 12, marginBottom: 12 }}>{loginError}</div>}
        <button onClick={async () => { try { await signInWithEmailAndPassword(auth, loginEmail, loginPassword); } catch (err) { setLoginError(err.message); } }} style={{ width: '100%', background: navy, color: '#fff', border: 'none', borderRadius: 10, padding: 13, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Sign In</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4fb', fontFamily: 'system-ui,sans-serif' }}>
      <style>{`* { box-sizing: border-box; }`}</style>
      <div style={{ background: navy, padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 20 }}>&#9875;</span>
          <p style={{ fontSize: 13, fontWeight: 800, margin: 0, color: '#f8f4ec' }}>Client Management</p>
          <Link href="/admin" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 600 }}>&larr; Back to CRM</Link>
        </div>
        <button onClick={() => signOut(auth)} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, cursor: 'pointer' }}>Sign Out</button>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '28px 20px', display: 'flex', flexDirection: 'column', gap: 24 }}>

        <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e8eef8' }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: navy, marginBottom: 16 }}>Clients ({clients.length})</h2>
          {clients.length === 0 ? (
            <p style={{ color: '#aaa', fontSize: 13 }}>No clients yet. Add one below.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {clients.map(c => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '12px 16px', background: '#f8faff', borderRadius: 12, border: '1px solid #e8eef8', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: c.color || navy, flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: navy, margin: 0 }}>{c.name}</p>
                      <p style={{ fontSize: 11, color: '#888', margin: 0 }}>/portal/{c.id}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, color: '#aaa' }}>{portalUsers.filter(u => u.clientSlug === c.id).length} portal user(s)</span>
                    <button onClick={() => handleSendInvite(c)} disabled={!!sendingInvite[c.id]} style={{ background: '#f0f7ff', color: ocean, border: '1px solid #bfdbfe', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{sendingInvite[c.id] ? 'Sending...' : 'Send Invite'}</button>
                    <button onClick={() => handleDeleteClient(c)} style={{ background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleAddClient} style={{ borderTop: '1px solid #e8eef8', paddingTop: 18 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Add New Client</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 4 }}>Name</label>
                <input value={newName} onChange={e => { setNewName(e.target.value); if (!slugTouched) setNewSlug(slugify(e.target.value)); }} placeholder="e.g. Starboard Retail Group" style={{ width: '100%', padding: '9px 12px', border: '1px solid #e0e8f4', borderRadius: 8, fontSize: 13, boxSizing: 'border-box', outline: 'none' }} />
              </div>
              <div style={{ flex: '1 1 160px' }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 4 }}>Slug</label>
                <input value={newSlug} onChange={e => { setSlugTouched(true); setNewSlug(slugify(e.target.value)); }} placeholder="e.g. starboard" style={{ width: '100%', padding: '9px 12px', border: '1px solid #e0e8f4', borderRadius: 8, fontSize: 13, boxSizing: 'border-box', outline: 'none' }} />
              </div>
              <div style={{ flex: '0 0 100px' }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 4 }}>Color</label>
                <input type="color" value={newColor} onChange={e => setNewColor(e.target.value)} style={{ width: '100%', height: 36, padding: 2, border: '1px solid #e0e8f4', borderRadius: 8, cursor: 'pointer' }} />
              </div>
            </div>
            {clientError && <div style={{ color: '#991b1b', background: '#fef2f2', padding: '8px 12px', borderRadius: 8, fontSize: 12, marginBottom: 12 }}>{clientError}</div>}
            <button type="submit" disabled={addingClient} style={{ background: ocean, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>{addingClient ? 'Adding...' : '+ Add Client'}</button>
          </form>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e8eef8' }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: navy, marginBottom: 16 }}>Portal Users ({portalUsers.length})</h2>
          {portalUsers.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {portalUsers.map(pu => (
                <div key={pu.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8faff', borderRadius: 10, border: '1px solid #e8eef8' }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: navy, margin: 0 }}>{pu.email}</p>
                    <p style={{ fontSize: 11, color: '#888', margin: 0 }}>Client: {(clients.find(c => c.id === pu.clientSlug) || {}).name || pu.clientSlug}</p>
                  </div>
                  <button onClick={() => handleDeletePortalUser(pu)} style={{ background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: 8, padding: '5px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Remove</button>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleAddPortalUser} style={{ borderTop: portalUsers.length ? '1px solid #e8eef8' : 'none', paddingTop: portalUsers.length ? 18 : 0 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Add Portal User</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 4 }}>Email</label>
                <input type="email" value={puEmail} onChange={e => setPuEmail(e.target.value)} placeholder="client@company.com" style={{ width: '100%', padding: '9px 12px', border: '1px solid #e0e8f4', borderRadius: 8, fontSize: 13, boxSizing: 'border-box', outline: 'none' }} />
              </div>
              <div style={{ flex: '1 1 160px' }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 4 }}>Password</label>
                <input type="text" value={puPassword} onChange={e => setPuPassword(e.target.value)} placeholder="min 6 characters" style={{ width: '100%', padding: '9px 12px', border: '1px solid #e0e8f4', borderRadius: 8, fontSize: 13, boxSizing: 'border-box', outline: 'none' }} />
              </div>
              <div style={{ flex: '1 1 160px' }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 4 }}>Client</label>
                <select value={puClientSlug} onChange={e => setPuClientSlug(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: '1px solid #e0e8f4', borderRadius: 8, fontSize: 13, boxSizing: 'border-box', outline: 'none', background: '#fff' }}>
                  {clients.length === 0 && <option value="">No clients yet</option>}
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            {userError && <div style={{ color: '#991b1b', background: '#fef2f2', padding: '8px 12px', borderRadius: 8, fontSize: 12, marginBottom: 12 }}>{userError}</div>}
            {userSuccess && <div style={{ color: '#166534', background: '#f0fdf4', padding: '8px 12px', borderRadius: 8, fontSize: 12, marginBottom: 12 }}>{userSuccess}</div>}
            <button type="submit" disabled={addingUser || clients.length === 0} style={{ background: ocean, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: clients.length === 0 ? 0.5 : 1 }}>{addingUser ? 'Creating...' : '+ Add Portal User'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
