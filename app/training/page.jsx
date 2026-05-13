'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { startSession } from '../../lib/tracking';

export default function TrainingLandingPage() {
  const router = useRouter();
  const [mode, setMode]   = useState('landing');
  const [form, setForm]   = useState({ name:'', email:'', password:'', retail:'' });
  const [error, setError] = useState('');
  const [busy, setBusy]   = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) { await startSession(u); router.push('/training/course'); }
    });
    return unsub;
  }, []);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function register(e) {
    e.preventDefault(); setError(''); setBusy(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(cred.user, { displayName: form.name });
      await startSession({ ...cred.user, displayName: form.name });
      router.push('/training/course');
    } catch (err) { setError(err.message.replace('Firebase: ','')); }
    finally { setBusy(false); }
  }

  async function login(e) {
    e.preventDefault(); setError(''); setBusy(true);
    try { await signInWithEmailAndPassword(auth, form.email, form.password); router.push('/training/course'); }
    catch { setError('Invalid email or password. Please try again.'); }
    finally { setBusy(false); }
  }

  if (mode === 'landing') return (
    <div style={{fontFamily:"'DM Sans',sans-serif",color:'#0a1628',minHeight:'100vh'}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>
      <div style={{background:'linear-gradient(135deg,#0a1628 0%,#1a3a5c 60%,#0f2d4a 100%)',padding:'5rem 1.5rem 4rem'}}>
        <div style={{maxWidth:700,margin:'0 auto'}}>
          <div style={{fontSize:11,fontWeight:500,letterSpacing:'2px',textTransform:'uppercase',color:'#c9a84c',marginBottom:12}}>SelectiveCrew · Training Portal</div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(26px,4vw,42px)',fontWeight:600,color:'#f8f4ec',lineHeight:1.2,marginBottom:16}}>Turn Your Retail Experience<br/>Into a Cruise Ship Career</h1>
          <p style={{fontSize:15,color:'rgba(248,244,236,0.7)',lineHeight:1.7,marginBottom:28,maxWidth:560}}>Already working in retail, hospitality, or luxury sales? This free course bridges the gap between your current skills and the world of onboard duty-free retail — one of the most rewarding roles on a luxury cruise ship.</p>
          <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
            <button onClick={()=>setMode('register')} style={{padding:'12px 24px',background:'#c9a84c',color:'#0a1628',border:'none',borderRadius:8,fontSize:14,fontWeight:600,cursor:'pointer'}}>Start Free Training →</button>
            <button onClick={()=>setMode('login')} style={{padding:'12px 24px',background:'transparent',color:'rgba(248,244,236,0.75)',border:'1px solid rgba(248,244,236,0.25)',borderRadius:8,fontSize:14,cursor:'pointer'}}>Already registered? Sign in</button>
          </div>
        </div>
      </div>

      <div style={{padding:'4rem 1.5rem'}}>
        <div style={{maxWidth:740,margin:'0 auto'}}>
          <div style={{fontSize:11,fontWeight:500,letterSpacing:'2px',textTransform:'uppercase',color:'#c9a84c',marginBottom:10}}>Who Should Take This Course</div>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(20px,3vw,28px)',color:'#0a1628',marginBottom:12}}>Built for candidates with retail foundations</h2>
          <p style={{fontSize:14,color:'#5a6478',lineHeight:1.7,marginBottom:28}}>This training is recommended if you have experience in any of the following — it will help you stand out during SelectiveCrew selection.</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:14}}>
            {[['🛍️','Retail Sales','Fashion, electronics, beauty, or department store sales.'],['✈️','Airport Duty-Free','Direct duty-free background — you already speak the language.'],['🍷','Luxury Hospitality','Fine dining, hotel concierge, or premium F&B service.'],['💄','Beauty & Cosmetics','Fragrance, skincare, or makeup counter experience is highly valued.'],['⌚','Jewelry & Watches','High-ticket product sales experience transfers directly onboard.'],['🎓','Tourism & Hospitality','Graduates eager to launch an international career at sea.']].map(([icon,title,desc])=>(
              <div key={title} style={{background:'#fff',border:'1px solid rgba(10,22,40,0.1)',borderRadius:12,padding:'1.25rem'}}>
                <div style={{fontSize:24,marginBottom:8}}>{icon}</div>
                <div style={{fontSize:14,fontWeight:500,color:'#0a1628',marginBottom:5}}>{title}</div>
                <div style={{fontSize:12,color:'#5a6478',lineHeight:1.55}}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{background:'#f8f4ec',padding:'4rem 1.5rem'}}>
        <div style={{maxWidth:740,margin:'0 auto'}}>
          <div style={{fontSize:11,fontWeight:500,letterSpacing:'2px',textTransform:'uppercase',color:'#c9a84c',marginBottom:10}}>Course Contents</div>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(20px,3vw,28px)',color:'#0a1628',marginBottom:24}}>5 modules · ~25 minutes · Free certificate</h2>
          {[['01','Orientation','Your role, the duty-free value proposition, and the service-first mindset.'],['02','Product Knowledge','Spirits, perfumes, watches, cosmetics — what to know and how to sell each.'],['03','Sales Techniques','The ACES method, live scenarios, objection handling, and the add-on close.'],['04','Regulations','Age verification, customs allowances, port rules, and fraud prevention.'],['05','Final Assessment','5-question quiz. Score 80%+ to earn your SelectiveCrew training certificate.']].map(([num,title,desc])=>(
            <div key={num} style={{display:'flex',gap:16,padding:'16px 0',borderBottom:'1px solid rgba(10,22,40,0.08)'}}>
              <div style={{fontSize:11,fontWeight:600,color:'#c9a84c',letterSpacing:1,minWidth:28}}>{num}</div>
              <div><div style={{fontSize:14,fontWeight:500,color:'#0a1628',marginBottom:3}}>{title}</div><div style={{fontSize:13,color:'#5a6478'}}>{desc}</div></div>
            </div>
          ))}
        </div>
      </div>

      <div style={{background:'#fffbf0',padding:'2rem 1.5rem'}}>
        <div style={{maxWidth:740,margin:'0 auto',display:'flex',gap:14,background:'#fff8e1',border:'1px solid #e8d5a0',borderLeft:'4px solid #c9a84c',borderRadius:'0 10px 10px 0',padding:'16px 20px'}}>
          <div style={{fontSize:20,flexShrink:0}}>⚠️</div>
          <div>
            <div style={{fontSize:13,fontWeight:600,color:'#3a2e0a',marginBottom:6}}>Important — Please Read Before Enrolling</div>
            <p style={{fontSize:13,color:'#6b5515',lineHeight:1.6}}>Completing this training course <strong>does not guarantee employment</strong> with any cruise line or through SelectiveCrew. Job placement depends on multiple additional factors including English language proficiency, personal character and personality, professional conduct, physical presentation, interview performance, and available vacancies.</p>
          </div>
        </div>
      </div>

      <div style={{background:'#0a1628',padding:'4rem 1.5rem',textAlign:'center'}}>
        <div style={{maxWidth:740,margin:'0 auto'}}>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(20px,3vw,28px)',color:'#f8f4ec',marginBottom:12}}>Ready to get started?</h2>
          <p style={{fontSize:14,color:'rgba(248,244,236,0.6)',marginBottom:24}}>Free, 25 minutes, and sets you apart from candidates who have not prepared.</p>
          <button onClick={()=>setMode('register')} style={{padding:'12px 28px',background:'#c9a84c',color:'#0a1628',border:'none',borderRadius:8,fontSize:14,fontWeight:600,cursor:'pointer'}}>Create Free Account & Begin →</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:'100vh',background:'#f5f4f0',display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem 1rem',fontFamily:"'DM Sans',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>
      <div style={{background:'#fff',border:'1px solid rgba(10,22,40,0.1)',borderRadius:16,padding:'2.5rem 2rem',maxWidth:420,width:'100%'}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:'#0a1628',marginBottom:20}}>Selective<span style={{color:'#c9a84c'}}>Crew</span></div>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:500,color:'#0a1628',marginBottom:5}}>{mode==='register'?'Create your training account':'Welcome back'}</h2>
        <p style={{fontSize:13,color:'#5a6478',marginBottom:24}}>{mode==='register'?'Free · Takes 30 seconds':'Sign in to continue your training'}</p>
        <form onSubmit={mode==='register'?register:login} style={{display:'flex',flexDirection:'column',gap:12}}>
          {mode==='register'&&<>
            <input name="name" placeholder="Full name" value={form.name} onChange={handle} required style={{padding:'10px 14px',border:'1px solid rgba(10,22,40,0.15)',borderRadius:8,fontSize:14,fontFamily:"'DM Sans',sans-serif",color:'#0a1628',background:'#f8f9fb'}}/>
            <select name="retail" value={form.retail} onChange={handle} required style={{padding:'10px 14px',border:'1px solid rgba(10,22,40,0.15)',borderRadius:8,fontSize:14,fontFamily:"'DM Sans',sans-serif",color:'#0a1628',background:'#f8f9fb'}}>
              <option value="">Your retail background...</option>
              <option>Retail Sales (Fashion / Electronics / General)</option>
              <option>Airport Duty-Free</option>
              <option>Luxury / Cosmetics / Fragrance</option>
              <option>Jewelry & Watches</option>
              <option>Hospitality / Hotel / F&B</option>
              <option>Tourism & Hospitality Graduate</option>
              <option>Other retail experience</option>
            </select>
          </>}
          <input name="email" type="email" placeholder="Email address" value={form.email} onChange={handle} required style={{padding:'10px 14px',border:'1px solid rgba(10,22,40,0.15)',borderRadius:8,fontSize:14,fontFamily:"'DM Sans',sans-serif",color:'#0a1628',background:'#f8f9fb'}}/>
          <input name="password" type="password" placeholder="Password (min 6 characters)" value={form.password} onChange={handle} required minLength={6} style={{padding:'10px 14px',border:'1px solid rgba(10,22,40,0.15)',borderRadius:8,fontSize:14,fontFamily:"'DM Sans',sans-serif",color:'#0a1628',background:'#f8f9fb'}}/>
          {error&&<div style={{background:'#fcebeb',border:'1px solid #e24b4a',borderRadius:8,padding:'10px 14px',fontSize:13,color:'#501313'}}>{error}</div>}
          <button type="submit" disabled={busy} style={{padding:'11px 18px',background:'#0a1628',color:'#c9a84c',border:'none',borderRadius:8,fontSize:14,fontWeight:500,cursor:'pointer',fontFamily:"'DM Sans',sans-serif"}}>{busy?'Please wait...':(mode==='register'?'Create account & start training →':'Sign in →')}</button>
        </form>
        <div style={{marginTop:20,fontSize:13,color:'#5a6478',textAlign:'center'}}>
          {mode==='register'?'Already have an account? ':'Do not have an account? '}
          <button onClick={()=>{setMode(mode==='register'?'login':'register');setError('');}} style={{background:'none',border:'none',color:'#c9a84c',fontWeight:500,cursor:'pointer',fontSize:13,textDecoration:'underline'}}>{mode==='register'?'Sign in':'Register free'}</button>
        </div>
        <button onClick={()=>setMode('landing')} style={{background:'none',border:'none',color:'#c9a84c',cursor:'pointer',fontSize:13,marginTop:12,display:'block',textDecoration:'underline'}}>← Back to overview</button>
      </div>
    </div>
  );
}
