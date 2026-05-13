'use client';
import { useState } from 'react';
import Link from 'next/link';
import { db, storage } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useLang } from '../../lib/LanguageContext';

const REQUIRED_DOCS = [
  { id:'passport', label:'Passport', label_es:'Pasaporte', desc:'Color scan of main page. Must be valid for at least 12 months.', desc_es:'Escaner a color de la pagina principal. Debe tener vigencia de al menos 12 meses.', required:true },
  { id:'background', label:'Criminal Background Check', label_es:'Antecedentes Penales', desc:'Official certificate from your country\'s police or judicial authority. Must be recent (within 3 months).', desc_es:'Certificado oficial de la autoridad policial o judicial de tu pais. Debe ser reciente (menos de 3 meses).', required:true },
  { id:'medical', label:'Maritime Medical Certificate', label_es:'Certificado Medico Maritimo', desc:'Pre-employment medical exam by an authorized doctor. We can guide you on where to get this done.', desc_es:'Examen medico pre-empleo por medico autorizado. Te indicamos donde realizarlo.', required:true },
  { id:'photo', label:'Professional Photo', label_es:'Foto Profesional', desc:'Recent passport-style photo, white background, formal attire.', desc_es:'Foto reciente estilo pasaporte, fondo blanco, vestimenta formal.', required:true },
  { id:'cv', label:'CV / Resume', label_es:'CV / Hoja de Vida', desc:'Updated CV in PDF format. Include all relevant retail or sales experience.', desc_es:'CV actualizado en formato PDF. Incluye toda tu experiencia en retail o ventas.', required:false },
  { id:'visa', label:'C1/D Visa (if already obtained)', label_es:'Visa C1/D (si ya la tienes)', desc:'US crew visa. Only required for ships departing from US ports. We guide you through the application.', desc_es:'Visa de tripulante para EE.UU. Solo requerida para barcos desde puertos americanos. Te guiamos en el tramite.', required:false },
];

const navy = "#0a1628";
const teal = "#0d9488";
const gold = "#c9a84c";

export default function DocumentsPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [candidateFound, setCandidateFound] = useState(null);
  const [searching, setSearching] = useState(false);
  const [uploads, setUploads] = useState({});
  const [progress, setProgress] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { lang } = useLang();
  const es = lang === 'es';

  async function findCandidate() {
    if (!email) { setError('Please enter your email address.'); return; }
    setSearching(true);
    setError('');
    try {
      const snap = await getDocs(query(collection(db, 'applications'), where('email', '==', email)));
      if (!snap.empty) {
        const data = snap.docs[0].data();
        setCandidateFound({ id: snap.docs[0].id, ...data });
        setFullName(data.fullName || '');
        setStep(2);
      } else {
        setError('No application found with this email. Please apply first at selectivecrew.com/apply or contact us on WhatsApp.');
      }
    } catch(e) {
      setError('Something went wrong. Please try again.');
    }
    setSearching(false);
  }

  async function uploadFile(docId, file) {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { setError(`${docId}: File must be under 10MB.`); return; }
    setProgress(p => ({ ...p, [docId]: 0 }));
    try {
      const storageRef = ref(storage, `candidate-documents/${email}/${docId}-${Date.now()}-${file.name.replace(/\s/g,'_')}`);
      const task = uploadBytesResumable(storageRef, file);
      task.on('state_changed',
        snap => setProgress(p => ({ ...p, [docId]: Math.round((snap.bytesTransferred / snap.totalBytes) * 100) })),
        err => { setError(`Upload failed for ${docId}. Please try again.`); setProgress(p => ({ ...p, [docId]: null })); },
        async () => {
          const url = await getDownloadURL(task.snapshot.ref);
          setUploads(u => ({ ...u, [docId]: { url, name: file.name } }));
          setProgress(p => ({ ...p, [docId]: 100 }));
        }
      );
    } catch(e) {
      setError(`Upload failed. Please try again.`);
    }
  }

  async function handleSubmit() {
    const requiredUploaded = REQUIRED_DOCS.filter(d => d.required).every(d => uploads[d.id]);
    if (!requiredUploaded) { setError('Please upload all required documents before submitting.'); return; }
    setSubmitting(true);
    setError('');
    try {
      await addDoc(collection(db, 'candidateDocuments'), {
        email,
        fullName,
        applicationId: candidateFound?.id || '',
        country: candidateFound?.country || '',
        documents: uploads,
        status: 'submitted',
        submittedAt: serverTimestamp(),
      });
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'careers@selectivecrew.com',
          subject: `Documents Submitted — ${fullName} (${candidateFound?.country || ''})`,
          text: `${fullName} has submitted their documents.\n\nEmail: ${email}\nCountry: ${candidateFound?.country || ''}\n\nDocuments uploaded:\n${Object.entries(uploads).map(([k,v]) => `- ${k}: ${v.url}`).join('\n')}\n\nView in admin panel.`,
        }),
      });
      setSubmitted(true);
    } catch(e) {
      setError('Something went wrong. Please try again.');
    }
    setSubmitting(false);
  }

  if (submitted) return (
    <div style={{minHeight:'60vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'40px 20px',background:'#f8fafc'}}>
      <div style={{background:'#fff',borderRadius:20,padding:'48px 36px',maxWidth:480,width:'100%',textAlign:'center',boxShadow:'0 8px 48px rgba(10,22,40,0.1)'}}>
        <div style={{width:72,height:72,background:'#d1fae5',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px'}}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <h2 style={{fontSize:24,fontWeight:700,color:navy,marginBottom:12,fontFamily:"'Playfair Display',serif"}}>Documents Submitted</h2>
        <p style={{fontSize:14,color:'#64748b',lineHeight:1.8,marginBottom:24}}>Thank you {fullName}. Our team will review your documents and contact you within 48 hours via WhatsApp.</p>
        <Link href="/" style={{display:'inline-block',background:teal,color:'#fff',borderRadius:10,padding:'12px 28px',fontSize:14,fontWeight:600,textDecoration:'none'}}>Back to Home</Link>
      </div>
    </div>
  );

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>
      <div style={{background:'#f8fafc',minHeight:'60vh',padding:'40px 20px',fontFamily:"'DM Sans',sans-serif"}}>
        <div style={{maxWidth:680,margin:'0 auto'}}>

          {/* Header */}
          <div style={{background:'linear-gradient(135deg,#0a1628 0%,#1a3a5c 100%)',borderRadius:18,padding:'32px 28px',marginBottom:24,color:'#fff'}}>
            <div style={{fontSize:10,fontWeight:700,color:gold,letterSpacing:2,textTransform:'uppercase',marginBottom:8}}>Document Submission Portal</div>
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(20px,3vw,26px)',fontWeight:700,marginBottom:10,color:'#f8f4ec'}}>Submit Your Documents</h1>
            <p style={{fontSize:13,color:'rgba(248,244,236,0.65)',lineHeight:1.7}}>Upload your required documents securely. All files are encrypted and only accessible to the Selective Crew recruitment team.</p>
          </div>

          {/* Progress */}
          <div style={{background:'#fff',borderRadius:12,padding:'16px 20px',marginBottom:20,boxShadow:'0 2px 12px rgba(10,22,40,0.06)'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
              {['Verify Identity','Upload Documents','Confirmation'].map((label,i) => (
                <div key={label} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,flex:1}}>
                  <div style={{width:32,height:32,borderRadius:'50%',background:step > i+1 ? teal : step === i+1 ? navy : '#e8eef8',color:step >= i+1 ? '#fff' : '#aaa',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700}}>
                    {step > i+1 ? '✓' : i+1}
                  </div>
                  <span style={{fontSize:10,color:step >= i+1 ? navy : '#aaa',fontWeight:600,textAlign:'center'}}>{label}</span>
                </div>
              ))}
            </div>
            <div style={{height:4,background:'#e8eef8',borderRadius:4}}>
              <div style={{height:4,background:teal,borderRadius:4,width:step===1?'33%':step===2?'66%':'100%',transition:'width 0.4s'}}/>
            </div>
          </div>

          <div style={{background:'#fff',borderRadius:18,padding:'32px 28px',boxShadow:'0 4px 24px rgba(10,22,40,0.08)'}}>

            {/* STEP 1 - Verify */}
            {step === 1 && (
              <div>
                <div style={{marginBottom:24}}>
                  <div style={{fontSize:10,fontWeight:700,color:gold,letterSpacing:2,textTransform:'uppercase',marginBottom:4}}>Step 1 of 3</div>
                  <h2 style={{fontSize:20,fontWeight:700,color:navy,fontFamily:"'Playfair Display',serif"}}>Verify Your Identity</h2>
                  <p style={{fontSize:13,color:'#64748b',marginTop:4}}>Enter the email address you used when you applied with Selective Crew.</p>
                </div>
                <div style={{marginBottom:14}}>
                  <label style={{display:'block',fontSize:12,fontWeight:600,color:'#334155',marginBottom:5}}>Email address *</label>
                  <input style={{width:'100%',padding:'11px 14px',border:'1.5px solid #dde5f0',borderRadius:9,fontSize:14,fontFamily:'inherit',color:navy,background:'#f8fafc',boxSizing:'border-box',outline:'none'}}
                    type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)}
                    onKeyDown={e=>e.key==='Enter'&&findCandidate()} />
                </div>
                {error && <div style={{background:'#fef2f2',border:'1px solid #fca5a5',borderRadius:8,padding:'10px 14px',fontSize:13,color:'#991b1b',marginBottom:14}}>{error}</div>}
                <button onClick={findCandidate} disabled={searching}
                  style={{width:'100%',background:teal,color:'#fff',border:'none',borderRadius:10,padding:14,fontSize:15,fontWeight:700,cursor:searching?'not-allowed':'pointer',opacity:searching?0.7:1,fontFamily:'inherit'}}>
                  {searching ? 'Searching...' : 'Find My Application ->'}
                </button>
                <p style={{textAlign:'center',fontSize:12,color:'#94a3b8',marginTop:12}}>
                  Not applied yet? <Link href="/apply" style={{color:teal,fontWeight:600,textDecoration:'none'}}>Apply first here</Link>
                </p>
              </div>
            )}

            {/* STEP 2 - Upload */}
            {step === 2 && (
              <div>
                <div style={{marginBottom:24}}>
                  <div style={{fontSize:10,fontWeight:700,color:gold,letterSpacing:2,textTransform:'uppercase',marginBottom:4}}>Step 2 of 3</div>
                  <h2 style={{fontSize:20,fontWeight:700,color:navy,fontFamily:"'Playfair Display',serif"}}>Upload Your Documents</h2>
                  <div style={{background:'#f0fdf9',border:'1px solid #ccfbf1',borderRadius:10,padding:'12px 16px',marginTop:10}}>
                    <p style={{fontSize:13,color:'#065f46',fontWeight:600,margin:0}}>Welcome back, {fullName}</p>
                    <p style={{fontSize:12,color:'#047857',margin:'4px 0 0'}}>From {candidateFound?.country} · Applied for {candidateFound?.role || 'Cruise Ship Role'}</p>
                  </div>
                </div>

                {REQUIRED_DOCS.map(doc => (
                  <div key={doc.id} style={{background:'#f8fafc',border:'1px solid #e2e8f0',borderRadius:12,padding:'18px 20px',marginBottom:14}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:6}}>
                      <div>
                        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                          <span style={{fontSize:14,fontWeight:700,color:navy}}>{doc.label}</span>
                          {doc.required
                            ? <span style={{fontSize:10,fontWeight:700,background:'#fef2f2',color:'#dc2626',padding:'2px 8px',borderRadius:100,border:'1px solid #fca5a5'}}>Required</span>
                            : <span style={{fontSize:10,fontWeight:700,background:'#f0fdf9',color:'#16a34a',padding:'2px 8px',borderRadius:100,border:'1px solid #bbf7d0'}}>Optional</span>}
                        </div>
                        <p style={{fontSize:12,color:'#64748b',margin:0,lineHeight:1.5}}>{doc.desc}</p>
                      </div>
                      {uploads[doc.id] && (
                        <div style={{flexShrink:0,marginLeft:12}}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        </div>
                      )}
                    </div>

                    {uploads[doc.id] ? (
                      <div style={{background:'#f0fdf9',border:'1px solid #bbf7d0',borderRadius:8,padding:'8px 12px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <span style={{fontSize:12,color:'#16a34a',fontWeight:600}}>✓ {uploads[doc.id].name}</span>
                        <button onClick={()=>setUploads(u=>{const n={...u};delete n[doc.id];return n;})}
                          style={{background:'none',border:'none',color:'#94a3b8',fontSize:12,cursor:'pointer',fontFamily:'inherit'}}>Remove</button>
                      </div>
                    ) : progress[doc.id] !== undefined && progress[doc.id] !== null && progress[doc.id] < 100 ? (
                      <div style={{marginTop:8}}>
                        <div style={{background:'#e8eef8',borderRadius:4,height:6}}>
                          <div style={{background:teal,borderRadius:4,height:6,width:progress[doc.id]+'%',transition:'width 0.2s'}}/>
                        </div>
                        <p style={{fontSize:12,color:teal,marginTop:4}}>Uploading... {progress[doc.id]}%</p>
                      </div>
                    ) : (
                      <label style={{display:'block',marginTop:10,cursor:'pointer'}}>
                        <div style={{border:'2px dashed #cbd5e1',borderRadius:8,padding:'14px',textAlign:'center',transition:'all 0.2s'}}
                          onMouseOver={e=>e.currentTarget.style.borderColor=teal}
                          onMouseOut={e=>e.currentTarget.style.borderColor='#cbd5e1'}>
                          <p style={{fontSize:13,color:'#64748b',margin:0}}>Click to upload or drag and drop</p>
                          <p style={{fontSize:11,color:'#94a3b8',margin:'4px 0 0'}}>PDF, JPG, PNG · Max 10MB</p>
                        </div>
                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={{display:'none'}}
                          onChange={e=>e.target.files[0]&&uploadFile(doc.id,e.target.files[0])} />
                      </label>
                    )}
                  </div>
                ))}

                {error && <div style={{background:'#fef2f2',border:'1px solid #fca5a5',borderRadius:8,padding:'10px 14px',fontSize:13,color:'#991b1b',marginBottom:14}}>{error}</div>}

                <div style={{background:'#f0fdf9',border:'1px solid #ccfbf1',borderRadius:10,padding:'12px 16px',marginBottom:16}}>
                  <p style={{fontSize:13,color:'#065f46',fontWeight:600,marginBottom:3}}>Ready to submit?</p>
                  <p style={{fontSize:12,color:'#047857'}}>Upload all required documents then click submit. Our team will review within 48 hours.</p>
                </div>

                <div style={{display:'flex',gap:10}}>
                  <button onClick={()=>setStep(1)} style={{flex:1,background:'#f1f5f9',color:'#64748b',border:'none',borderRadius:10,padding:13,fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>Back</button>
                  <button onClick={handleSubmit} disabled={submitting}
                    style={{flex:2,background:teal,color:'#fff',border:'none',borderRadius:10,padding:13,fontSize:15,fontWeight:700,cursor:submitting?'not-allowed':'pointer',opacity:submitting?0.7:1,fontFamily:'inherit'}}>
                    {submitting ? 'Submitting...' : 'Submit Documents ->'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <p style={{textAlign:'center',fontSize:12,color:'#94a3b8',marginTop:16}}>
            Questions? <a href="https://wa.me/573188474058" style={{color:teal,fontWeight:600,textDecoration:'none'}}>WhatsApp: +57 318 847 4058</a>
          </p>
        </div>
      </div>
    </>
  );
}