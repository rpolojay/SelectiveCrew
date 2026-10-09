'use client';
import { useState, useEffect } from 'react';
import { useLang } from '../../lib/LanguageContext';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, onAuthStateChanged, updateProfile, signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { startSession } from '../../lib/tracking';

const navy = '#0a1628';
const gold = '#c9a84c';
const teal = '#0d9488';

export default function EmpezarPage() {
  const router = useRouter();
  const { lang, setLang } = useLang();
  const es = lang === 'es';
  const [step, setStep] = useState(1); // 1=hook, 2=form, 3=success
  const [form, setForm] = useState({ name:'', email:'', whatsapp:'', country:'', salesExp:'' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => { signOut(auth); }, []);

  const inp = {width:'100%',padding:'14px 16px',border:'1.5px solid rgba(255,255,255,0.15)',borderRadius:12,fontSize:15,background:'rgba(255,255,255,0.08)',color:'#f8f4ec',outline:'none',fontFamily:'inherit',boxSizing:'border-box'};
  const sel = {...inp,cursor:'pointer'};

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.country) { setError(es?'Por favor completa todos los campos requeridos.':'Please fill in all required fields.'); return; }
    setBusy(true);
    setError('');
    try {
      const password = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
      const cred = await createUserWithEmailAndPassword(auth, form.email, password);
      await updateProfile(cred.user, { displayName: form.name });
      // Send notification
      await fetch('/api/send-email', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          to: 'careers@selectivecrew.com',
          subject: 'New Course Registration — ' + form.name,
          text: 'NUEVA INSCRIPCION\n\nNombre: ' + form.name + '\nEmail: ' + form.email + '\nWhatsApp: ' + form.whatsapp + '\nPais: ' + form.country + '\nExperiencia: ' + form.salesExp + '\nFuente: /empezar',
        })
      });
      setStep(3);
    } catch(err) {
      if (err.code === 'auth/email-already-in-use') {
        try {
          router.push('/training');
        } catch(e) {}
      } else {
        setError('Error: ' + err.message);
      }
    }
    setBusy(false);
  }

  const COUNTRIES = ['Colombia','Peru','Ecuador','Chile','Argentina','Mexico','Panama','Costa Rica','Dominican Republic','Venezuela','Uruguay','Paraguay'];

  if (step === 3) return (
    <div style={{minHeight:'100vh',background:'linear-gradient(160deg,#0a1628,#0d2240)',display:'flex',alignItems:'center',justifyContent:'center',padding:24,fontFamily:'system-ui,sans-serif'}}>
      <div style={{textAlign:'center',maxWidth:440}}>
        <div style={{fontSize:64,marginBottom:20}}>??</div>
        <h1 style={{fontSize:26,fontWeight:800,color:'#f8f4ec',marginBottom:12,lineHeight:1.3}}>You're In! Your Course Is Ready</h1>
        <p style={{fontSize:16,color:'rgba(248,244,236,0.7)',lineHeight:1.7,marginBottom:28}}>Hi <strong style={{color:gold}}>{form.name}</strong>, your account is ready. Take the free course now and get your certificate in 25 minutes.</p>
        <a href="/training/course" style={{display:'block',background:gold,color:navy,padding:'16px',borderRadius:14,fontSize:16,fontWeight:800,textDecoration:'none',marginBottom:12}}>Start the Course Now ?</a>
        <p style={{fontSize:12,color:'rgba(248,244,236,0.35)'}}>You will receive a certificate upon completion</p>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(160deg,#0a1628,#0d2240)',fontFamily:'system-ui,sans-serif',color:'#f8f4ec'}}>
      {/* Language toggle */}
      <div style={{position:'fixed',top:16,right:16,zIndex:100,display:'flex',gap:8}}>
        <button onClick={()=>setLang('en')} style={{background:lang==='en'?gold:'rgba(255,255,255,0.1)',color:lang==='en'?navy:'#f8f4ec',border:'none',borderRadius:8,padding:'6px 12px',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>EN</button>
        <button onClick={()=>setLang('es')} style={{background:lang==='es'?gold:'rgba(255,255,255,0.1)',color:lang==='es'?navy:'#f8f4ec',border:'none',borderRadius:8,padding:'6px 12px',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>ES</button>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');
        * { box-sizing: border-box; }
        .inp-focus:focus { border-color: ${gold} !important; background: rgba(255,255,255,0.12) !important; }
        ::placeholder { color: rgba(248,244,236,0.35) !important; }
        select option { background: #0a1628; color: #f8f4ec; }
        .stat-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 20px; text-align: center; }
        .benefit-item { display: flex; gap: 12px; align-items: flex-start; margin-bottom: 16px; }
      `}</style>

      {/* HERO */}
      <section style={{padding:'56px 24px 48px',textAlign:'center',maxWidth:600,margin:'0 auto'}}>
        <div style={{display:'inline-block',background:'rgba(201,168,76,0.15)',border:'1px solid rgba(201,168,76,0.3)',borderRadius:20,padding:'6px 16px',fontSize:11,fontWeight:700,letterSpacing:2,color:gold,textTransform:'uppercase',marginBottom:20}}>100% Free · No Fees Ever</div>
        <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(28px,7vw,44px)',fontWeight:700,lineHeight:1.15,marginBottom:16}}>
          Learn to sell on<br/>
          <span style={{color:gold}}>luxury cruise ships</span><br/>
          and get the job
        </h1>
        <p style={{fontSize:17,color:'rgba(248,244,236,0.7)',lineHeight:1.75,marginBottom:32,maxWidth:480,margin:'0 auto 32px'}}>Free 25-minute course. Official certificate. Certified candidates are reviewed first by our recruitment team.</p>

        {step === 1 && (
          <div>
            <button onClick={()=>setStep(2)} style={{background:gold,color:navy,border:'none',borderRadius:14,padding:'18px 40px',fontSize:17,fontWeight:800,cursor:'pointer',fontFamily:'inherit',width:'100%',maxWidth:360}}>
              Get My Free Certificate ?
            </button>
            <p style={{fontSize:12,color:'rgba(248,244,236,0.35)',marginTop:12}}>Over 2,000 Latin American candidates placed</p>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:20,padding:'28px 24px',maxWidth:420,margin:'0 auto',textAlign:'left'}}>
            <h2 style={{fontSize:18,fontWeight:700,color:'#f8f4ec',marginBottom:20,textAlign:'center'}}>Create Your Free Account</h2>
            <div style={{marginBottom:14}}>
              <label style={{fontSize:12,fontWeight:600,color:'rgba(248,244,236,0.6)',display:'block',marginBottom:6}}>Full Name *</label>
              <input className="inp-focus" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your full name" required style={inp}/>
            </div>
            <div style={{marginBottom:14}}>
              <label style={{fontSize:12,fontWeight:600,color:'rgba(248,244,236,0.6)',display:'block',marginBottom:6}}>Email *</label>
              <input className="inp-focus" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="tu@email.com" required style={inp}/>
            </div>
            <div style={{marginBottom:14}}>
              <label style={{fontSize:12,fontWeight:600,color:'rgba(248,244,236,0.6)',display:'block',marginBottom:6}}>WhatsApp</label>
              <input className="inp-focus" type="tel" value={form.whatsapp} onChange={e=>setForm({...form,whatsapp:e.target.value})} placeholder="+57 300 000 0000" style={inp}/>
            </div>
            <div style={{marginBottom:14}}>
              <label style={{fontSize:12,fontWeight:600,color:'rgba(248,244,236,0.6)',display:'block',marginBottom:6}}>Country *</label>
              <select className="inp-focus" value={form.country} onChange={e=>setForm({...form,country:e.target.value})} required style={sel}>
                <option value="">Select your country</option>
                {COUNTRIES.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{marginBottom:20}}>
              <label style={{fontSize:12,fontWeight:600,color:'rgba(248,244,236,0.6)',display:'block',marginBottom:6}}>Sales Experience</label>
              <select className="inp-focus" value={form.salesExp} onChange={e=>setForm({...form,salesExp:e.target.value})} style={sel}>
                <option value="">Select your experience</option>
                <option value="less-than-1">Less than 1 year</option>
                <option value="1-2">1-2 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5+">More than 5 years</option>
                <option value="none">No experience yet</option>
              </select>
            </div>
            {error && <div style={{background:'rgba(239,68,68,0.15)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:10,padding:'10px 14px',fontSize:13,color:'#fca5a5',marginBottom:16}}>{error}</div>}
            <button type="submit" disabled={busy} style={{width:'100%',background:busy?'rgba(201,168,76,0.5)':gold,color:navy,border:'none',borderRadius:12,padding:'15px',fontSize:15,fontWeight:800,cursor:'pointer',fontFamily:'inherit'}}>
              {busy?es?'Creando tu cuenta...':'Creating your account...':es?'Comenzar el Curso Gratis ?':'Start the Free Course ?'}
            </button>
            <p style={{fontSize:11,color:'rgba(248,244,236,0.3)',textAlign:'center',marginTop:12}}>No password required · Free forever · MLC 2006 compliant</p>
          </form>
        )}
      </section>

      {/* STATS */}
      <section style={{padding:'0 24px 48px',maxWidth:600,margin:'0 auto'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
          {[{n:'2,000+',l:es?'Colocados desde 2009':'Placed since 2009'},{n:'25 min',l:es?'Duración del curso':'Course duration'},{n:'$900+',l:es?'Salario base mensual':'Monthly base salary'}].map((s,i)=>(
            <div key={i} className="stat-card">
              <div style={{fontSize:22,fontWeight:800,color:gold,marginBottom:4}}>{s.n}</div>
              <div style={{fontSize:11,color:'rgba(248,244,236,0.55)',lineHeight:1.4}}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* BENEFITS */}
      <section style={{padding:'0 24px 48px',maxWidth:600,margin:'0 auto'}}>
        <h2 style={{fontSize:20,fontWeight:700,color:'#f8f4ec',marginBottom:24,textAlign:'center'}}>What Will You Learn?</h2>
        {[
          {icon:'??',title:es?'Ventas Duty-Free':'Duty-Free Sales',desc:es?'Perfumes, licores, cosméticos, relojes y joyería — los productos que venderás a bordo.':'Perfumes, spirits, cosmetics, watches and jewelry — the products you will sell on board.'},
          {icon:'???',title:es?'Técnicas de Venta':'Sales Techniques',desc:es?'El método ACES: Preguntar, Conectar, Educar, Vender. Probado en cruceros reales.':'The ACES method: Ask, Connect, Educate, Sell. Proven on real cruise ships.'},
          {icon:'??',title:es?'Atención al Cliente Internacional':'International Guest Service',desc:es?'Cómo conectar con pasajeros de todo el mundo y superar objeciones en inglés.':'How to connect with guests from around the world and handle objections in English.'},
          {icon:'??',title:es?'Certificado Oficial':'Official Certificate',desc:es?'Un certificado verificable de SelectiveCrew que te pone al frente de otros candidatos.':'A verifiable SelectiveCrew certificate that puts you ahead of other candidates.'},
        ].map((b,i)=>(
          <div key={i} className="benefit-item">
            <div style={{fontSize:28,flexShrink:0,marginTop:2}}>{b.icon}</div>
            <div>
              <div style={{fontSize:15,fontWeight:700,color:'#f8f4ec',marginBottom:4}}>{b.title}</div>
              <div style={{fontSize:14,color:'rgba(248,244,236,0.6)',lineHeight:1.65}}>{b.desc}</div>
            </div>
          </div>
        ))}
      </section>

      {/* TESTIMONIALS */}
      <section style={{padding:'0 24px 48px',maxWidth:600,margin:'0 auto'}}>
        <h2 style={{fontSize:20,fontWeight:700,color:'#f8f4ec',marginBottom:24,textAlign:'center'}}>What Our Candidates Say</h2>
        {[
          {name:'Rubén De Jesús H.',country:'Colombia',quote:es?'Gracias a Selective Crew ahora trabajo en un crucero. Muy profesionales, me colocaron en 3 semanas.':'Thanks to Selective Crew I now work on a cruise ship. Very professional — placed within 3 weeks.'},
          {name:'Shalom Coba',country:'Colombia',quote:es?'Ahora estoy viajando por el mundo. Los recomiendo 100%. Me colocaron en menos de un mes.':'Now I am traveling the world. I recommend them 100%. Placed within a month.'},
          {name:'Evelin Hidalgo',country:'Colombia',quote:es?'Pasé de candidata a Supervisora de Ventas en mi primer año. El mejor paso que di en mi vida.':'I went from candidate to Retail Supervisor in my first year. The best decision I ever made.'},
        ].map((t,i)=>(
          <div key={i} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:16,padding:'20px',marginBottom:12}}>
            <p style={{fontSize:14,color:'rgba(248,244,236,0.8)',lineHeight:1.7,marginBottom:12,fontStyle:'italic'}}>"{t.quote}"</p>
            <div style={{fontSize:13,fontWeight:700,color:gold}}>{t.name} <span style={{color:'rgba(248,244,236,0.4)',fontWeight:400}}>· {t.country}</span></div>
          </div>
        ))}
      </section>

      {/* BOTTOM CTA */}
      <section style={{padding:'0 24px 64px',maxWidth:600,margin:'0 auto',textAlign:'center'}}>
        <div style={{background:'rgba(201,168,76,0.1)',border:'1px solid rgba(201,168,76,0.25)',borderRadius:20,padding:'32px 24px'}}>
          <h2 style={{fontSize:22,fontWeight:800,color:'#f8f4ec',marginBottom:8}}>Ready to Start?</h2>
          <p style={{fontSize:14,color:'rgba(248,244,236,0.6)',marginBottom:24,lineHeight:1.7}}>The course is completely free. Takes 25 minutes. Get your certificate today.</p>
          <button onClick={()=>{setStep(2);window.scrollTo({top:0,behavior:'smooth'});}} style={{background:gold,color:navy,border:'none',borderRadius:14,padding:'16px 36px',fontSize:16,fontWeight:800,cursor:'pointer',fontFamily:'inherit',width:'100%',maxWidth:320}}>
            Get My Free Certificate ?
          </button>
          <p style={{fontSize:12,color:'rgba(248,244,236,0.3)',marginTop:12}}>Free · No credit card · Open to all Latin American countries</p>
        </div>
      </section>
    </div>
  );
}



