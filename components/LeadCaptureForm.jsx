'use client';
import { useState } from 'react';
import { saveLead } from '../lib/tracking';

export default function LeadCaptureForm({ source = 'homepage', darkBg = false }) {
  const [form, setForm] = useState({ name: '', email: '' });
  const [status, setStatus] = useState('idle'); // idle | busy | success | duplicate | error

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setStatus('busy');
    const result = await saveLead({ name: form.name, email: form.email, source });
    if (result.success && result.duplicate) setStatus('duplicate');
    else if (result.success) setStatus('success');
    else setStatus('error');
  }

  const labelColor = darkBg ? 'rgba(248,244,236,0.75)' : '#5a6478';
  const inputStyle = {
    padding: '10px 14px', border: '1px solid rgba(10,22,40,0.15)',
    borderRadius: 8, fontSize: 14, fontFamily: "'DM Sans',sans-serif",
    color: '#0a1628', background: '#f8f9fb', width: '100%', boxSizing: 'border-box',
  };

  if (status === 'success') return (
    <div style={{ background: '#edfaf3', border: '1px solid #6fcf97', borderRadius: 12, padding: '20px 24px', textAlign: 'center' }}>
      <div style={{ fontSize: 24, marginBottom: 8 }}>✅</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: '#1a5c3a', marginBottom: 4 }}>You are on the list!</div>
      <div style={{ fontSize: 13, color: '#2d7a50' }}>We will send your free training access to <strong>{form.email}</strong> shortly.</div>
    </div>
  );

  if (status === 'duplicate') return (
    <div style={{ background: '#fff8e1', border: '1px solid #e8d5a0', borderRadius: 12, padding: '20px 24px', textAlign: 'center' }}>
      <div style={{ fontSize: 24, marginBottom: 8 }}>👋</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: '#6b5515', marginBottom: 4 }}>Already registered!</div>
      <div style={{ fontSize: 13, color: '#6b5515' }}>That email is already on our list. Check your inbox or <a href="/training" style={{ color: '#c9a84c' }}>go to the training portal</a>.</div>
    </div>
  );

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase', color: '#c9a84c', marginBottom: 4 }}>
        Free Training — Get Access
      </div>
      <div style={{ fontSize: 13, color: labelColor, marginBottom: 6, lineHeight: 1.5 }}>
        Enter your details and we will send you access to our free duty-free retail training course.
      </div>
      <input name="name" placeholder="Your full name" value={form.name} onChange={handle} required style={inputStyle} />
      <input name="email" type="email" placeholder="Email address" value={form.email} onChange={handle} required style={inputStyle} />
      {status === 'error' && (
        <div style={{ background: '#fcebeb', border: '1px solid #e24b4a', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#501313' }}>
          Something went wrong. Please try again.
        </div>
      )}
      <button type="submit" disabled={status === 'busy'} style={{
        padding: '11px 18px', background: '#c9a84c', color: '#0a1628',
        border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600,
        cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
      }}>
        {status === 'busy' ? 'Saving...' : 'Get Free Training Access →'}
      </button>
      <div style={{ fontSize: 11, color: labelColor, textAlign: 'center' }}>
        No spam. No password required. Unsubscribe anytime.
      </div>
    </form>
  );
}