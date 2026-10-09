'use client';
import { useEffect, useState, useRef } from 'react';

export default function GmailCallback() {
  const [status, setStatus] = useState('Connecting to Gmail...');
  const [error, setError] = useState('');
  const attempted = useRef(false);

  useEffect(() => {
    if (attempted.current) return;
    attempted.current = true;

    const params = new URLSearchParams(window.location.search);
    const code  = params.get('code');
    const err   = params.get('error');

    if (err) {
      setError('Google returned an error: ' + err);
      setTimeout(() => { window.location.href = '/admin'; }, 4000);
      return;
    }

    if (!code) {
      window.location.href = '/admin';
      return;
    }

    setStatus('Exchanging authorization code...');

    fetch('/api/gmail?action=exchange&code=' + encodeURIComponent(code))
      .then(r => r.json())
      .then(d => {
        if (d.access_token || d.saved) {
          setStatus('Connected successfully! Redirecting...');
          if (d.access_token) {
            localStorage.setItem('gmail_token', d.access_token);
            localStorage.setItem('gmail_ready', '1');
          }
          setTimeout(() => { window.location.href = '/admin'; }, 1500);
        } else {
          setError('Failed: ' + (d.error || 'Unknown error'));
          setTimeout(() => { window.location.href = '/admin'; }, 4000);
        }
      })
      .catch(e => {
        setError('Network error: ' + e.message);
        setTimeout(() => { window.location.href = '/admin'; }, 4000);
      });
  }, []);

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#f0f4fb',fontFamily:'system-ui'}}>
      <div style={{background:'#fff',borderRadius:20,padding:48,textAlign:'center',maxWidth:420,width:'100%',boxShadow:'0 8px 48px rgba(14,77,138,0.12)'}}>
        <div style={{fontSize:48,marginBottom:16}}>{error ? '❌' : '📧'}</div>
        <h2 style={{color:'#0a1628',marginBottom:12}}>
          {error ? 'Connection Failed' : 'Connecting Gmail'}
        </h2>
        <p style={{color: error ? '#dc2626' : '#666', lineHeight:1.6}}>
          {error || status}
        </p>
        {error && (
          <div style={{marginTop:20,background:'#fef2f2',border:'1px solid #fca5a5',borderRadius:10,padding:'12px 16px',textAlign:'left'}}>
            <p style={{fontSize:12,color:'#991b1b',margin:0}}>
              If this keeps failing, contact support on WhatsApp: +57 318 847 4058
            </p>
          </div>
        )}
        <p style={{fontSize:12,color:'#94a3b8',marginTop:16}}>Redirecting to admin panel...</p>
      </div>
    </div>
  );
}
