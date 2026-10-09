'use client';
import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';
import { saveLead } from '../lib/tracking';

// Content types accepted by the cvs/ Storage rule; set explicitly because some
// browsers report an empty type for .doc/.docx files.
const CV_TYPES = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};
const CV_MAX_BYTES = 3 * 1024 * 1024;

function cvProblem(file) {
  if (!file) return 'Please upload your CV (PDF, DOC or DOCX, max 3 MB) to get access.';
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  if (!CV_TYPES[ext]) return 'Invalid file type. Please upload a PDF, DOC or DOCX file.';
  if (file.size > CV_MAX_BYTES) return 'Your CV is larger than 3 MB. Please upload a smaller file.';
  return '';
}

export default function LeadCaptureForm({ source = 'homepage', darkBg = false }) {
  const [form, setForm] = useState({ name: '', email: '' });
  const [cvFile, setCvFile] = useState(null);
  const [cvError, setCvError] = useState('');
  const [status, setStatus] = useState('idle'); // idle | busy | success | duplicate | error

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    const problem = cvProblem(cvFile);
    setCvError(problem);
    if (problem) return;
    setStatus('busy');
    let cvUrl = '';
    try {
      const ext = cvFile.name.split('.').pop().toLowerCase();
      const cvRef = ref(storage, 'cvs/' + globalThis.crypto.randomUUID() + '.cv');
      await uploadBytes(cvRef, cvFile, { contentType: CV_TYPES[ext] });
      cvUrl = await getDownloadURL(cvRef);
    } catch (uploadErr) {
      console.error('CV upload failed:', uploadErr);
      setStatus('error');
      return;
    }
    const result = await saveLead({ name: form.name, email: form.email, source, cvUrl });
    if (result.success && result.duplicate) setStatus('duplicate');
    else if (result.success) {
      setStatus('success');
      // Send training access email with resume requirement
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'training-access', email: form.email, name: form.name,
          }),
        });
      } catch(e) { console.error('Email failed:', e); }
    }
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
        Free Training – Get Access
      </div>
      <div style={{ fontSize: 13, color: labelColor, marginBottom: 6, lineHeight: 1.5 }}>
        Enter your details and we will send you access to our free duty-free retail training course.
      </div>
      <input name="name" placeholder="Your full name" value={form.name} onChange={handle} required style={inputStyle} />
      <input name="email" type="email" placeholder="Email address" value={form.email} onChange={handle} required style={inputStyle} />
      <label style={{ fontSize: 12, color: labelColor, marginTop: 2 }}>
        Resume / CV <span style={{ color: '#e85d4a' }}>*</span> <span style={{ opacity: 0.8 }}>(PDF, DOC or DOCX · max 3 MB)</span>
      </label>
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          setCvFile(file);
          setCvError(file ? cvProblem(file) : '');
        }}
        style={{ ...inputStyle, padding: '8px 10px', border: '1px dashed ' + (cvError ? '#e24b4a' : 'rgba(10,22,40,0.25)') }}
      />
      <div style={{ background: '#fdecea', border: '1px solid #e24b4a', borderRadius: 8, padding: '8px 12px', color: '#b42318', fontSize: 12, fontWeight: 700, lineHeight: 1.5 }}>
        <div>⚠️ Your CV must be in English. CVs submitted in any other language will not be considered.</div>
        <div>⚠️ Tu CV debe estar en inglés. Los CV enviados en otro idioma no serán considerados.</div>
      </div>
      <div style={{ color: labelColor, fontSize: 12, lineHeight: 1.5 }}>
        <div>Due to the high volume of applications, only candidates who meet the position requirements will be contacted.</div>
        <div>Debido al alto volumen de aplicaciones, solo los candidatos que cumplan con los requisitos del cargo serán contactados.</div>
      </div>
      {cvError && (
        <div style={{ background: '#fcebeb', border: '1px solid #e24b4a', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#501313' }}>
          {cvError}
        </div>
      )}
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
