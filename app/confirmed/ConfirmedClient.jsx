'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ConfirmedClient() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [title, setTitle] = useState('');

  useEffect(() => {
    const applicationId = searchParams.get('id');
    const type = searchParams.get('type'); // 'video' or 'omnia'
    if (!applicationId || !['video', 'omnia'].includes(type)) { setStatus('error'); return; }

    setTitle(type === 'video' ? 'Video Watched' : 'Assessment Completed');

    async function markConfirmed() {
      try {
        const response = await fetch('/api/candidate-action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ applicationId, action: type }),
        });
        if (!response.ok) throw new Error('Action could not be confirmed');
        setStatus('success');
      } catch(e) { setStatus('error'); }
    }
    markConfirmed();
  }, [searchParams]);

  const messages = {
    video: { emoji: '🎬', heading: 'Video Confirmed!', body: 'Thank you for watching the mandatory video. Our team has been notified and will be in touch with the next steps.' },
    omnia: { emoji: '📊', heading: 'Assessment Submitted!', body: 'Thank you for completing the Omnia assessment. Our team has been notified and will review your results shortly.' },
  };
  const type = searchParams.get('type') || 'video';
  const msg = messages[type] || messages.video;

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: 40, maxWidth: 480, width: '100%', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        {status === 'loading' && <p style={{ color: '#888' }}>Processing...</p>}
        {status === 'success' && (
          <>
            <div style={{ fontSize: 48, marginBottom: 16 }}>{msg.emoji}</div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0a1628', marginBottom: 12 }}>{msg.heading}</h1>
            <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.7, marginBottom: 24 }}>{msg.body}</p>
            <p style={{ fontSize: 13, color: '#888' }}>You can close this window.</p>
          </>
        )}
        {status === 'error' && <p style={{ color: '#e85d4a' }}>Something went wrong. Please contact us on WhatsApp: +57 318 847 4058</p>}
      </div>
    </div>
  );
}
