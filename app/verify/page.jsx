'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getCertificate } from '../../lib/tracking';

function VerifyContent() {
  const params  = useSearchParams();
  const certId  = params.get('id');
  const [cert, setCert]     = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    if (!certId) { setStatus('notfound'); return; }
    getCertificate(certId).then((data) => {
      if (!data) { setStatus('notfound'); return; }
      const expired = data.expiresAt?.toDate ? data.expiresAt.toDate() < new Date() : false;
      setCert(data);
      setStatus(expired || !data.valid ? 'invalid' : 'valid');
    }).catch(() => setStatus('notfound'));
  }, [certId]);

  return (
    <div style={{fontFamily:"'DM Sans',sans-serif",minHeight:'100vh',background:'#f5f4f0'}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500&display=swap'); @keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{background:'#0a1628',padding:'14px 24px',display:'flex',alignItems:'center',gap:16}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:'#fff'}}>Selective<span style={{color:'#c9a84c'}}>Crew</span></div>
        <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',letterSpacing:1,textTransform:'uppercase'}}>Certificate Verification</div>
      </div>

      <div style={{maxWidth:520,margin:'3rem auto',padding:'0 1rem'}}>
        {status==='loading'&&(
          <div style={{background:'#fff',border:'1px solid rgba(10,22,40,0.1)',borderRadius:16,padding:'2.5rem 2rem',textAlign:'center'}}>
            <div style={{width:36,height:36,border:'3px solid #eee',borderTop:'3px solid #c9a84c',borderRadius:'50%',animation:'spin 0.8s linear infinite',margin:'0 auto 16px'}}></div>
            <p style={{fontSize:13,color:'#5a6478'}}>Verifying certificate...</p>
          </div>
        )}

        {status==='valid'&&cert&&(
          <div style={{background:'#fff',border:'1px solid rgba(10,22,40,0.1)',borderRadius:16,padding:'2.5rem 2rem',textAlign:'center'}}>
            <div style={{width:60,height:60,borderRadius:'50%',background:'#eaf3de',color:'#1D9E75',fontSize:26,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>?</div>
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:'#0a1628',marginBottom:8}}>Certificate Verified</h1>
            <p style={{fontSize:13,color:'#5a6478',lineHeight:1.6,marginBottom:16}}>This is an authentic SelectiveCrew training certificate.</p>
            <div style={{background:'#f8f9fb',border:'1px solid rgba(10,22,40,0.08)',borderRadius:10,padding:'1rem',margin:'1.25rem 0',textAlign:'left'}}>
              {[['Candidate',cert.candidateName],['Course',cert.course],['Score',`${cert.score}/${cert.total} (${cert.percentage}%)`],['Issued',cert.issuedAt?.toDate?.().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})||'—'],['Expires',cert.expiresAt?.toDate?.().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})||'—'],['Certificate ID',cert.certId]].map(([label,value])=>(
                <div key={label} style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid rgba(10,22,40,0.06)',fontSize:13,gap:12}}>
                  <span style={{color:'#5a6478',flexShrink:0}}>{label}</span>
                  <span style={{fontWeight:500,color:'#0a1628',textAlign:'right',wordBreak:'break-all'}}>{value}</span>
                </div>
              ))}
            </div>
            <div style={{background:'#fff8e1',border:'1px solid #e8d5a0',borderLeft:'3px solid #c9a84c',borderRadius:'0 8px 8px 0',padding:'12px 14px',textAlign:'left'}}>
              <div style={{fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:1,color:'#c9a84c',marginBottom:5}}>Employment Disclaimer</div>
              <p style={{fontSize:12,color:'#6b5515',lineHeight:1.6}}>This certificate confirms completion of SelectiveCrew training only. It does <strong>not</strong> constitute a job offer or guarantee of employment. Placement decisions are made independently by SelectiveCrew based on English proficiency, character, personality, professional conduct, and interview performance.</p>
            </div>
          </div>
        )}

        {status==='invalid'&&(
          <div style={{background:'#fff',border:'1px solid rgba(10,22,40,0.1)',borderRadius:16,padding:'2.5rem 2rem',textAlign:'center'}}>
            <div style={{width:60,height:60,borderRadius:'50%',background:'#fcebeb',color:'#e24b4a',fontSize:26,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>?</div>
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:'#e24b4a',marginBottom:8}}>Certificate Expired or Invalid</h1>
            <p style={{fontSize:13,color:'#5a6478',lineHeight:1.6}}>This certificate exists but is no longer valid. SelectiveCrew certificates are valid for 12 months from issue date.</p>
          </div>
        )}

        {status==='notfound'&&(
          <div style={{background:'#fff',border:'1px solid rgba(10,22,40,0.1)',borderRadius:16,padding:'2.5rem 2rem',textAlign:'center'}}>
            <div style={{width:60,height:60,borderRadius:'50%',background:'#f5f4f0',color:'#888',fontSize:26,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>?</div>
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:'#5a6478',marginBottom:8}}>Certificate Not Found</h1>
            <p style={{fontSize:13,color:'#5a6478',lineHeight:1.6,marginBottom:8}}>No certificate was found with ID: <code style={{background:'#f5f4f0',padding:'2px 6px',borderRadius:4}}>{certId||'none'}</code></p>
            <p style={{fontSize:13,color:'#5a6478',lineHeight:1.6}}>Please check the certificate ID or contact SelectiveCrew directly.</p>
          </div>
        )}

        <div style={{textAlign:'center',marginTop:16,display:'flex',gap:8,justifyContent:'center',alignItems:'center'}}>
          <a href="https://selectivecrew.com" style={{fontSize:12,color:'#c9a84c',textDecoration:'none'}}>selectivecrew.com</a>
          {certId&&<><span style={{color:'#ccc',fontSize:12}}>·</span><span style={{color:'#aaa',fontSize:12}}>ID: {certId}</span></>}
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',fontFamily:"'DM Sans',sans-serif",color:'#5a6478'}}>Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
