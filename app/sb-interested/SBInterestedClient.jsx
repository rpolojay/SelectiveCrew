'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SBInterestedClient() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [debug, setDebug] = useState('');

  useEffect(() => {
    const applicationId = searchParams.get('id');
    if (!applicationId) { setStatus('error'); setDebug('Invalid confirmation link'); return; }
    
    async function markInterested() {
      try {
        const response = await fetch('/api/candidate-action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ applicationId, action: 'starboard' }),
        });
        if (!response.ok) throw new Error('Action could not be confirmed');
        setStatus('success');
      } catch(e) {
        setDebug('Please contact our recruiting team for assistance.');
        setStatus('error');
      }
    }
    markInterested();
  }, [searchParams]);

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: 40, maxWidth: 480, width: '100%', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        {status === 'loading' && <p style={{ color: '#888' }}>Processing...</p>}
        {status === 'success' && (
          <>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0a1628', marginBottom: 12 }}>Thank you!</h1>
            <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.7, marginBottom: 24 }}>
              We have received your confirmation. Our team at <strong>Selective Crew</strong> will be in touch with you shortly with the next steps.
            </p>
            <p style={{ fontSize: 13, color: '#888' }}>You can close this window.</p>
            {debug && <p style={{ fontSize: 11, color: '#ccc', marginTop: 16 }}>{debug}</p>}
          </>
        )}
        {status === 'error' && <p style={{ color: '#e85d4a' }}>Something went wrong. Please contact us on WhatsApp: +57 318 847 4058<br/><small>{debug}</small></p>}
      </div>
    </div>
  );
}
