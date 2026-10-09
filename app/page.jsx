'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useLang } from '../lib/LanguageContext';
import { t } from '../lib/translations';
import LeadCaptureForm from '../components/LeadCaptureForm';

const FEATURED_JOBS = [
  { title_en:'Fast Track Assistant Manager', title_es:'Fast Track Asistente de Gerente', company:'Starboard Cruise Services', tag_en:'HOT JOB', tag_es:'EMPLEO CALIENTE', location:'Worldwide', hot:true, spotsLeft:13, link:'/fast-track-manager', logo:'https://res.cloudinary.com/dr9xpsjmb/image/upload/v1767023146/SC_Enhanced_ssyr8a.jpg', note_en:'Requires team leadership of 10+ people', note_es:'Requiere liderazgo de equipos de 10+ personas' },
  { title_en:'Duty Free Sales Associate', title_es:'Asociado de Ventas Duty Free', company:'Starboard Cruise Services', tag_en:'JAPANESE SPEAKERS', tag_es:'HABLANTES DE JAPONES', location:'Asia / Pacific', hot:true, spotsLeft:12, link:'/japanese-speakers', logo:'https://res.cloudinary.com/dr9xpsjmb/image/upload/v1767023146/SC_Enhanced_ssyr8a.jpg', note_en:'Conversational to fluent Japanese required', note_es:'Se requiere japones conversacional a fluido' },
  { title_en:'Retail Sales Associate', title_es:'Asociado de Ventas', company:'Starboard Cruise Services', tag_en:'Retail', tag_es:'Ventas', location:'Worldwide', link:'/apply', logo:'https://res.cloudinary.com/dr9xpsjmb/image/upload/v1767023146/SC_Enhanced_ssyr8a.jpg' },
  { title_en:'Photographer', title_es:'Fotografo', company:'Norwegian Cruise Line', tag_en:'Photography', tag_es:'Fotografia', location:'Worldwide', link:'/cruise-ship-photographer-jobs', logo:'https://res.cloudinary.com/dr9xpsjmb/image/upload/v1767023146/SC_Enhanced_ssyr8a.jpg' },

  { title_en:'Assistant Retail Sales Manager', title_es:'Asistente de Gerente de Ventas', company:'Starboard Cruise Services', tag_en:'Management', tag_es:'Gerencia', location:'Worldwide', link:'/apply', logo:'https://res.cloudinary.com/dr9xpsjmb/image/upload/v1767023146/SC_Enhanced_ssyr8a.jpg' },
];

const TESTIMONIALS = [
  { name:'Ruben De Jesus Hernandez', role_en:'Starboard Cruise Services - Sales Associate', role_es:'Starboard Cruise Services - Asociado de Ventas', country:'Colombia', avatar:'https://faithful-orange-dfimzrrnwd.edgeone.app/rubendejesushernandez.png', quote_en:'Thanks to Selective Crew I am now working on a cruise ship. The agency is very professional and the staff is very friendly. Placed within 3 weeks.', quote_es:'Gracias a Selective Crew ahora estoy trabajando en un crucero. La agencia es muy profesional y el personal es muy amable. Colocado en 3 semanas.' },
  { name:'Shalom Coba', role_en:'Harding Retail - Sales Associate', role_es:'Harding Retail - Asociada de Ventas', country:'Colombia', avatar:'https://remarkable-fuchsia-ausorrtqqo.edgeone.app/shalom.coba_.png', quote_en:'Selective Crew helped me get a job on a cruise ship and now I am traveling the world. I recommend them 100%. Placed within a month of applying.', quote_es:'Selective Crew me ayudo a conseguir trabajo en un crucero y ahora estoy viajando por el mundo. Los recomiendo 100%. Colocada en un mes.' },
  { name:'Evelin Hidalgo', role_en:'Starboard Cruise Services - Retail Supervisor', role_es:'Starboard Cruise Services - Supervisora de Ventas', country:'Colombia', avatar:'https://beautiful-lavender-wsslydh03d.edgeone.app/heriito.hidalgo.png', quote_en:'Selective Crew is the best agency to get a job on a cruise ship. Very professional throughout the process. Went from applicant to Retail Supervisor within her first year.', quote_es:'Selective Crew es la mejor agencia para conseguir trabajo en un crucero. Muy profesionales durante todo el proceso. Paso de candidata a Supervisora en su primer ano.' },
];

const BLOG_POSTS = [
  { title_en:'The Ultimate Cruise Ship Packing List for Crew (2026)', title_es:'La Lista Definitiva de Equipaje para Tripulacion (2026)', excerpt_en:'What to bring, what to leave, and how to pack for six months at sea.', excerpt_es:'Que llevar, que dejar y como empacar para seis meses en el mar.', image:'https://enthusiastic-beige-gu1eaf4v8j-g2d3hpdfee.edgeone.app/The%20Ultimate%20Cruise%20Ship%20Packing%20List%20for%20Crew%202026.png', tag:'Crew Life' },
  { title_en:'Cruise Ship Salaries 2026: Real Paychecks Revealed', title_es:'Salarios en Cruceros 2026: Cheques Reales Revelados', excerpt_en:'The advertised salary is almost never what you actually take home. Here is the truth.', excerpt_es:'El salario anunciado casi nunca es lo que realmente te llevas a casa. Aqui la verdad.', image:'https://cooing-fuchsia-u3s0ifvlw1-mhiwbg5mbt.edgeone.app/cruise-ship-salary-2025.jpg.png', tag:'Salaries' },
  { title_en:'A Day in the Life of a Cruise Ship Chef', title_es:'Un Dia en la Vida de un Chef de Crucero', excerpt_en:'What it is like to cook for thousands of guests on the open ocean.', excerpt_es:'Como es cocinar para miles de huespedes en el oceano abierto.', image:'https://firebasestorage.googleapis.com/v0/b/studio-6715036493-baccc.firebasestorage.app/o/A%20Day%20in%20the%20Life%20of%20a%20Cruise%20Ship%20Chef.webp?alt=media&token=f81c6b70-05c3-4bd4-8fa4-9768e37e27ae', tag:'Crew Life' },
];

const COUNTRIES = ['Colombia','Chile','Argentina','Mexico','Peru','Ecuador','Panama','Costa Rica','Venezuela','Uruguay','Dominican Republic'];

export default function HomePage() {
  const { lang } = useLang();
  const tx = t[lang];
  const es = lang === 'es';
  const [qualifyStep, setQualifyStep] = useState(0);
  const [qualifyAnswers, setQualifyAnswers] = useState({});

  const qualifyQuestions = [
    { q: es ? 'Tienes pasaporte vigente?' : 'Do you have a valid passport?', opts: [es?'Si, vigente':'Yes, valid', es?'No o vencido':'No or expired'] },
    { q: es ? 'Tu nivel de ingles es:' : 'Your English level is:', opts: [es?'Basico':'Basic', es?'Intermedio':'Intermediate', es?'Avanzado':'Advanced'] },
    { q: es ? 'Tienes experiencia en ventas o atencion al cliente?' : 'Do you have sales or customer service experience?', opts: [es?'Si':'Yes', es?'No, pero quiero aprender':'No, but I want to learn'] },
  ];

  const qualifyResult = qualifyAnswers[0] === (es?'Si, vigente':'Yes, valid') && qualifyAnswers[1] !== (es?'Basico':'Basic');

  return (
    <div style={{background:'#fff',fontFamily:"'DM Sans','Segoe UI',sans-serif",color:'#0a1628'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;}
        .job-card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:20px;transition:all 0.25s;position:relative;overflow:hidden;}
        .job-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#0d9488,#14b8a6);transform:scaleX(0);transform-origin:left;transition:transform 0.3s;}
        .job-card:hover{transform:translateY(-3px);box-shadow:0 16px 40px rgba(10,22,40,0.1);border-color:#ccfbf1;}
        .job-card:hover::before{transform:scaleX(1);}
        .trust-item{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:500;color:#475569;}
        .trust-dot{width:5px;height:5px;border-radius:50%;background:#0d9488;flex-shrink:0;}
        .step-num{width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,#0d9488,#14b8a6);color:#fff;font-family:'Playfair Display',serif;font-size:20px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 8px 20px rgba(13,148,136,0.25);}
        .qualify-opt{width:100%;padding:12px 16px;background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;font-family:inherit;color:#0a1628;cursor:pointer;text-align:left;transition:all 0.2s;margin-bottom:8px;}
        .qualify-opt:hover{border-color:#0d9488;background:#f0fdf9;color:#0f766e;}
        .blog-card{text-decoration:none;display:block;background:#fff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;transition:all 0.25s;}
        .blog-card:hover{transform:translateY(-3px);box-shadow:0 16px 40px rgba(10,22,40,0.1);}
        .blog-card img{transition:transform 0.4s;}
        .blog-card:hover img{transform:scale(1.04);}
        .teal-link{color:#0d9488;font-weight:600;font-size:14px;text-decoration:none;}
        .teal-link:hover{text-decoration:underline;}
        .scam-check{display:flex;align-items:flex-start;gap:12px;padding:14px 0;border-bottom:1px solid #f1f5f9;}
        .scam-check:last-child{border-bottom:none;}
        @media(max-width:768px){
          .hero-grid{grid-template-columns:1fr!important;}
          .card-stack{display:none!important;}
          .why-grid{grid-template-columns:1fr!important;}
          .blog-grid{grid-template-columns:1fr!important;}
          .jobs-grid{grid-template-columns:1fr!important;}
          .steps-grid{grid-template-columns:1fr!important;}
          .testimonials-grid{grid-template-columns:1fr!important;}
          .training-grid{grid-template-columns:1fr!important;}
        }
      `}</style>

      {/* URGENCY BAR */}
      <div style={{background:'#0a1628',padding:'10px 16px',textAlign:'center',borderBottom:'2px solid #0d9488'}}>
        <p style={{color:'#fff',fontSize:13,fontWeight:600,margin:0}}>
          <span style={{background:'#ef4444',color:'#fff',fontSize:10,fontWeight:800,padding:'2px 7px',borderRadius:4,marginRight:10,letterSpacing:1}}>NOW HIRING</span>
          {es?'Contratamos todo el año para nuevas salidas - Asegura tu lugar en el próximo contrato ':'Hiring year-round for new departures - Secure your spot on the next contract '}
          <Link href="/apply" style={{color:'#14b8a6',fontWeight:700,textDecoration:'underline'}}>{es?'Aplica gratis ->':'Apply free ->'}</Link>
        </p>
      </div>

      {/* HERO */}
      <section style={{background:'linear-gradient(160deg,#0a1628 0%,#0d2240 55%,#0d4a6e 100%)',padding:'80px 24px 100px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)',backgroundSize:'64px 64px'}}></div>
        <div style={{position:'absolute',top:'20%',left:'5%',width:400,height:400,borderRadius:'50%',background:'radial-gradient(circle,rgba(13,148,136,0.12) 0%,transparent 70%)'}}></div>
        <div style={{position:'absolute',bottom:'10%',right:'5%',width:300,height:300,borderRadius:'50%',background:'radial-gradient(circle,rgba(14,77,138,0.15) 0%,transparent 70%)'}}></div>
        <div className="container-main" style={{position:'relative'}}>
          <div className="hero-grid" style={{display:'grid',gridTemplateColumns:'1fr 420px',gap:56,alignItems:'center'}}>
            <div>
              <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(13,148,136,0.15)',border:'1px solid rgba(13,148,136,0.3)',borderRadius:100,padding:'5px 14px',marginBottom:24}}>
                <div style={{width:6,height:6,borderRadius:'50%',background:'#14b8a6',boxShadow:'0 0 8px #14b8a6'}}></div>
                <span style={{fontSize:12,fontWeight:600,color:'#5eead4',letterSpacing:1}}>{es?'AGENCIA OFICIAL · DESDE 2009':'OFFICIAL AGENCY · SINCE 2009'}</span>
              </div>
              <h1 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:'clamp(32px,4.5vw,54px)',fontWeight:700,color:'#fff',lineHeight:1.15,marginBottom:20}}>
                {es ? <>Trabajos en Cruceros para Latinoamericanos - <span style={{color:'#14b8a6'}}>100% Gratis, Directos y Legitimos</span></> : <>Cruise Ship Jobs for Latin Americans - <span style={{color:'#14b8a6'}}>100% Free, Direct, and Legit</span></>}
              </h1>
              <p style={{fontSize:17,color:'rgba(255,255,255,0.65)',lineHeight:1.75,marginBottom:36,maxWidth:560}}>
                {es ? 'Desde 2009, Selective Crew ha ayudado a mas de 2,000 candidatos de America Latina a acceder a oportunidades reales en cruceros a traves de alianzas de contratacion directa y apoyo guiado desde la aplicacion hasta el embarque.' : 'Since 2009, Selective Crew has helped 2,000+ candidates from Latin America access real cruise ship opportunities through direct recruitment partnerships and guided support from application to embarkation.'}
              </p>
              <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:28}}>
                <Link href="/jobs" style={{background:'#0d9488',color:'#fff',padding:'14px 28px',borderRadius:10,fontSize:15,fontWeight:700,fontFamily:'inherit',textDecoration:'none',display:'inline-flex',alignItems:'center',gap:8}}>
                  {es?'Ver Vacantes y Aplicar Gratis':'View Jobs & Apply Free'} {'->'}
                </Link>
                <button onClick={()=>setQualifyStep(1)} style={{background:'rgba(255,255,255,0.08)',color:'#fff',border:'1.5px solid rgba(255,255,255,0.25)',padding:'14px 24px',borderRadius:10,fontSize:15,fontWeight:600,fontFamily:'inherit',cursor:'pointer'}}>
                  {es?'Verificar si Califico':'Check if You Qualify'}
                </button>
              </div>
              {/* Colombia candidate callout */}
              <div style={{background:'rgba(20,184,166,0.1)',border:'1px solid rgba(20,184,166,0.35)',borderRadius:12,padding:'16px 18px',marginBottom:24,display:'flex',flexWrap:'wrap',alignItems:'center',justifyContent:'space-between',gap:12}}>
                <div style={{flex:'1 1 260px'}}>
                  <p style={{color:'#fff',fontSize:15,fontWeight:700,margin:'0 0 4px'}}>{es?'🇨🇴 ¿Eres de Colombia y quieres trabajar en un crucero?':'🇨🇴 From Colombia and want to work on a cruise ship?'}</p>
                  <p style={{color:'rgba(255,255,255,0.65)',fontSize:13,margin:0}}>{es?'Estamos reclutando para oportunidades actuales en ventas, retail, fotografía y management.':'We are recruiting for current opportunities in sales, retail, photography and management.'}</p>
                </div>
                <Link href="/cruise-jobs-colombia" style={{color:'#14b8a6',fontSize:14,fontWeight:700,textDecoration:'underline',whiteSpace:'nowrap'}}>
                  {es?'Ver vacantes para colombianos':'View jobs for Colombians'} {'->'}
                </Link>
              </div>
              <div style={{display:'flex',flexWrap:'wrap',gap:16,alignItems:'center',paddingTop:20,borderTop:'1px solid rgba(255,255,255,0.1)'}}>
                {[{label:es?'Sin costo para candidatos':'No candidate fees',highlight:true},{label:es?'Fundada 2009':'Founded 2009'},{label:es?'2,000+ candidatos colocados':'2,000+ candidates placed'},{label:'MLC 2006 aligned'}].map((item,i)=>(
                  <div key={i} className="trust-item" style={{color:item.highlight?'#5eead4':'rgba(255,255,255,0.55)',fontWeight:item.highlight?700:undefined}}><div className="trust-dot" style={{background:'#14b8a6'}}></div>{item.label}</div>
                ))}
              </div>
            </div>
            <div className="card-stack" style={{display:'flex',flexDirection:'column',gap:12}}>
              <div style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:16,padding:'18px 20px',backdropFilter:'blur(8px)'}}>
                <div style={{fontSize:10,fontWeight:700,letterSpacing:1.5,color:'#14b8a6',textTransform:'uppercase',marginBottom:12}}>{es?'Vacante Destacada':'Featured Role'}</div>
                <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
                  <img src="https://res.cloudinary.com/dr9xpsjmb/image/upload/v1767023146/SC_Enhanced_ssyr8a.jpg" alt="Starboard" style={{width:40,height:40,borderRadius:8,objectFit:'cover'}}/>
                  <div><p style={{fontSize:14,fontWeight:700,color:'#fff',margin:0}}>Retail Sales Associate</p><p style={{fontSize:12,color:'rgba(255,255,255,0.5)',margin:0}}>Starboard Cruise Services · Worldwide</p></div>
                </div>
                <div style={{display:'flex',gap:8}}>
                  <span style={{fontSize:11,background:'rgba(13,148,136,0.2)',color:'#5eead4',padding:'3px 10px',borderRadius:100,fontWeight:600}}>$900-$1,500/mo</span>
                  <span style={{fontSize:11,background:'rgba(255,255,255,0.08)',color:'rgba(255,255,255,0.6)',padding:'3px 10px',borderRadius:100}}>Meals + housing included</span>
                </div>
              </div>
              <div style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:16,padding:'18px 20px',backdropFilter:'blur(8px)'}}>
                <div style={{fontSize:10,fontWeight:700,letterSpacing:1.5,color:'#14b8a6',textTransform:'uppercase',marginBottom:12}}>{es?'Paises que Reclutamos':'Countries We Recruit From'}</div>
                <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                  {COUNTRIES.map(c=>(<span key={c} style={{fontSize:11,background:'rgba(255,255,255,0.08)',color:'rgba(255,255,255,0.65)',padding:'4px 10px',borderRadius:100}}>{c}</span>))}
                </div>
              </div>
              <div style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:16,padding:'18px 20px',backdropFilter:'blur(8px)'}}>
                <div style={{fontSize:10,fontWeight:700,letterSpacing:1.5,color:'#14b8a6',textTransform:'uppercase',marginBottom:12}}>{es?'Que pasa despues de aplicar':'What Happens After You Apply'}</div>
                {[{n:'1',label:es?'Revisamos tu perfil en 48h':'We review your profile in 48h'},{n:'2',label:es?'Entrevista por video contigo':'Video interview with our team'},{n:'3',label:es?'Te guiamos hasta que abordas':'We guide you until you board'}].map(s=>(
                  <div key={s.n} style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
                    <div style={{width:22,height:22,borderRadius:'50%',background:'rgba(13,148,136,0.3)',border:'1px solid rgba(13,148,136,0.5)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:'#14b8a6',flexShrink:0}}>{s.n}</div>
                    <span style={{fontSize:13,color:'rgba(255,255,255,0.7)'}}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div style={{position:'absolute',bottom:0,left:0,right:0,lineHeight:0}}>
          <svg viewBox="0 0 1440 56" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{display:'block',width:'100%',height:56}}>
            <path d="M0,28 C360,56 720,0 1080,32 C1260,48 1380,12 1440,28 L1440,56 L0,56 Z" fill="#fff"/>
          </svg>
        </div>
      </section>

      {/* QUALIFY MODAL */}
      {qualifyStep > 0 && (
        <div style={{position:'fixed',inset:0,background:'rgba(10,22,40,0.7)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
          <div style={{background:'#fff',borderRadius:20,padding:36,maxWidth:460,width:'100%',boxShadow:'0 24px 64px rgba(0,0,0,0.25)'}}>
            {qualifyStep <= qualifyQuestions.length ? (
              <>
                <div style={{fontSize:12,color:'#0d9488',fontWeight:700,letterSpacing:1,textTransform:'uppercase',marginBottom:8}}>{es?`Pregunta ${qualifyStep} de ${qualifyQuestions.length}`:`Question ${qualifyStep} of ${qualifyQuestions.length}`}</div>
                <div style={{height:4,background:'#f1f5f9',borderRadius:4,marginBottom:20}}><div style={{height:4,background:'#0d9488',borderRadius:4,width:`${(qualifyStep/qualifyQuestions.length)*100}%`,transition:'width 0.3s'}}></div></div>
                <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:600,color:'#0a1628',marginBottom:20}}>{qualifyQuestions[qualifyStep-1].q}</h3>
                {qualifyQuestions[qualifyStep-1].opts.map(opt=>(
                  <button key={opt} className="qualify-opt" onClick={()=>{setQualifyAnswers(prev=>({...prev,[qualifyStep-1]:opt}));if(qualifyStep<qualifyQuestions.length)setQualifyStep(s=>s+1);else setQualifyStep(qualifyQuestions.length+1);}}>{opt}</button>
                ))}
                <button onClick={()=>{setQualifyStep(0);setQualifyAnswers({});}} style={{background:'none',border:'none',color:'#94a3b8',fontSize:13,cursor:'pointer',marginTop:8,fontFamily:'inherit'}}>{es?'Cancelar':'Cancel'}</button>
              </>
            ) : (
              <div style={{textAlign:'center',padding:'8px 0'}}>
                <div style={{fontSize:48,marginBottom:16}}>{qualifyResult?'?':'??'}</div>
                <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:'#0a1628',marginBottom:12}}>{qualifyResult?(es?'Calificas!':'You Qualify!'):(es?'Sigues siendo un candidato potencial':'You Are Still a Potential Candidate')}</h3>
                <p style={{fontSize:14,color:'#475569',lineHeight:1.7,marginBottom:24}}>{qualifyResult?(es?'Tu perfil cumple los requisitos basicos de Selective Crew. Da el siguiente paso y aplica - es completamente gratis.':"Your profile meets Selective Crew's basic requirements. Take the next step and apply - it's completely free."):(es?'Incluso si no cumples todos los requisitos ahora, contactanos. Podemos orientarte sobre como prepararte para una futura aplicacion.':"Even if you don't meet all requirements now, contact us. We can guide you on how to prepare for a future application.")}</p>
                <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap'}}>
                  <Link href="/apply" onClick={()=>setQualifyStep(0)} style={{background:'#0d9488',color:'#fff',padding:'12px 24px',borderRadius:10,fontSize:14,fontWeight:700,fontFamily:'inherit',textDecoration:'none'}}>{es?'Aplicar Ahora - Gratis':'Apply Now - Free'}</Link>
                  <button onClick={()=>{setQualifyStep(0);setQualifyAnswers({});}} style={{background:'#f8fafc',color:'#64748b',border:'1px solid #e2e8f0',padding:'12px 20px',borderRadius:10,fontSize:14,fontFamily:'inherit',cursor:'pointer'}}>{es?'Cerrar':'Close'}</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FEATURED JOBS */}
      <section style={{padding:'80px 24px',background:'#fff'}}>
        <div className="container-main">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:40,flexWrap:'wrap',gap:12}}>
            <div>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:2,color:'#0d9488',textTransform:'uppercase',display:'block',marginBottom:8}}>Direct Hiring</span>
              <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(26px,4vw,36px)',fontWeight:700,color:'#0a1628'}}>{es?'Posiciones Abiertas en Cruceros':'Featured Cruise Ship Jobs'}</h2>
            </div>
            <Link href="/jobs" className="teal-link">{es?'Ver todas las posiciones':'View all positions'} {'->'}</Link>
          </div>
          <div className="jobs-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:20}}>
            {FEATURED_JOBS.map(job => job.hot ? (
              <div key={job.title_en} style={{background:'linear-gradient(145deg,#0a1628,#112240)',borderRadius:16,overflow:'hidden',border:'1px solid rgba(239,68,68,0.2)',boxShadow:'0 8px 32px rgba(239,68,68,0.08)'}}>
                <div style={{background:'linear-gradient(90deg,#dc2626,#ef4444)',padding:'7px 16px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{fontSize:10,fontWeight:800,color:'#fff',letterSpacing:1.5,textTransform:'uppercase'}}>{es?'Empleo Caliente':'Hot Job'}</span>
                  <span style={{fontSize:11,fontWeight:700,color:'rgba(255,255,255,0.9)',background:'rgba(0,0,0,0.2)',padding:'2px 8px',borderRadius:10}}>{job.spotsLeft} {es?'cupos':'spots'}</span>
                </div>
                <div style={{padding:'18px 18px 22px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
                    <img src={job.logo} alt={job.company} style={{width:34,height:34,borderRadius:7,objectFit:'cover'}}/>
                    <span style={{fontSize:10,fontWeight:700,background:'rgba(240,165,0,0.15)',color:'#f0a500',padding:'2px 8px',borderRadius:100,textTransform:'uppercase',letterSpacing:1}}>{es?job.tag_es:job.tag_en}</span>
                  </div>
                  <h3 style={{fontSize:15,fontWeight:700,color:'#fff',marginBottom:4,lineHeight:1.3}}>{es?job.title_es:job.title_en}</h3>
                  <p style={{fontSize:12,color:'#7db4e0',marginBottom:3}}>{job.company}</p>
                  <p style={{fontSize:11,color:'#5a8aaa',marginBottom:14}}>{job.location}</p>
                  <div style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:8,padding:'7px 10px',marginBottom:14}}>
                    <p style={{fontSize:11,color:'#fca5a5',fontWeight:600,lineHeight:1.5}}>{es?job.note_es:job.note_en}</p>
                  </div>
                  <Link href={job.link} style={{display:'block',background:'#dc2626',color:'#fff',borderRadius:9,padding:'10px',fontSize:13,fontWeight:700,textAlign:'center',textDecoration:'none'}}>{es?'Ver Posicion ->':'View Position ->'}</Link>
                </div>
              </div>
            ) : (
              <div key={job.title_en} className="job-card">
                <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14}}>
                  <img src={job.logo} alt={job.company} style={{width:42,height:42,borderRadius:9,objectFit:'cover'}}/>
                  <span style={{fontSize:10,fontWeight:700,background:'#f0fdf9',color:'#0f766e',padding:'3px 10px',borderRadius:100,border:'1px solid #99f6e4'}}>{es?job.tag_es:job.tag_en}</span>
                </div>
                <h3 style={{fontSize:15,fontWeight:700,color:'#0a1628',marginBottom:4,lineHeight:1.3}}>{es?job.title_es:job.title_en}</h3>
                <p style={{fontSize:13,color:'#64748b',marginBottom:3}}>{job.company}</p>
                <p style={{fontSize:12,color:'#94a3b8',marginBottom:18}}>{job.location}</p>
                <Link href={job.link} style={{display:'flex',alignItems:'center',justifyContent:'center',background:'#0d9488',color:'#fff',borderRadius:9,padding:'11px',fontSize:13,fontWeight:700,textDecoration:'none'}}>{es?'Aplicar Gratis':'Apply Free'}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* EMPLOYER INTRODUCTION */}
      <section style={{padding:'28px 24px',background:'#f0fdfa',borderTop:'1px solid #ccfbf1',borderBottom:'1px solid #ccfbf1'}}>
        <div style={{maxWidth:1000,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',gap:20,flexWrap:'wrap'}}>
          <p style={{fontSize:14,color:'#0f3d3a',lineHeight:1.6,margin:0}}><strong>For U.S. employers:</strong> LATAM Recruiting as a Service, with candidate pipeline visibility included.</p>
          <Link href="/employers" style={{color:'#0f766e',fontSize:14,fontWeight:700,textDecoration:'none'}}>Explore employer recruiting →</Link>
        </div>
      </section>

      {/* PARTNER LOGOS BAR */}
      <section style={{padding:'32px 24px',background:'#fff',borderTop:'1px solid #f1f5f9',borderBottom:'1px solid #f1f5f9'}}>
        <div style={{maxWidth:1000,margin:'0 auto'}}>
          <p style={{fontSize:11,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'#94a3b8',textAlign:'center',marginBottom:24}}>{es?'Nuestros Socios de Contratacion':'Our Hiring Partners'}</p>
          <div style={{display:'flex',flexWrap:'wrap',alignItems:'center',justifyContent:'center',gap:48}}>
            <img src="https://firebasestorage.googleapis.com/v0/b/studio-6715036493-baccc.firebasestorage.app/o/STBD%20Logo.png?alt=media&token=cc2f9400-b968-4a0b-83c9-eb383d95a19c" alt="Starboard Cruise Services" style={{height:80,objectFit:'contain',filter:'grayscale(100%)',opacity:0.6}}/>
            <img src="https://firebasestorage.googleapis.com/v0/b/studio-6715036493-baccc.firebasestorage.app/o/logo-ncl-black.svg?alt=media&token=b6821dea-c16c-4d30-9908-a64710e7cb59" alt="Norwegian Cruise Line" style={{height:40,objectFit:'contain',filter:'grayscale(100%)',opacity:0.6}}/>
            <img src="https://firebasestorage.googleapis.com/v0/b/studio-6715036493-baccc.firebasestorage.app/o/GCT_GCCL_twoline.png?alt=media&token=6c10e997-af0b-4e9d-9032-cca5d4c09bdd" alt="Grand Circle Cruise Line" style={{height:40,objectFit:'contain',filter:'grayscale(100%)',opacity:0.6}}/>
          </div>
        </div>
      </section>
      {/* WHY TRUST */}
      <section style={{padding:'80px 24px',background:'#f8fafc'}}>
        <div className="container-main" style={{maxWidth:1000}}>
          <div style={{textAlign:'center',marginBottom:52}}>
            <span style={{fontSize:11,fontWeight:700,letterSpacing:2,color:'#0d9488',textTransform:'uppercase',display:'block',marginBottom:8}}>Trust & Transparency</span>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(26px,4vw,36px)',fontWeight:700,color:'#0a1628',marginBottom:12}}>{es?'Por que los candidatos confian en Selective Crew':'Why Candidates Trust Selective Crew'}</h2>
            <p style={{fontSize:16,color:'#64748b',maxWidth:580,margin:'0 auto',lineHeight:1.7}}>{es?'Somos una agencia licenciada con mas de 17 anos en la industria, con sede en Bogota, Colombia. Aqui esta la prueba.':'We are a licensed agency with over 17 years in the industry, based in Bogota, Colombia. Here is the proof.'}</p>
          </div>
          <div className="why-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:32}}>
            {[
              {icon:'✅',title:es?'Nunca cobramos a candidatos':'We never charge candidates',desc:es?'Ayudar a candidatos a encontrar trabajo es nuestro negocio - no cobramos por oportunidades. Es la ley maritima internacional y un principio que no negociamos.':'Helping candidates find work is our business - we do not charge for opportunities. It is international maritime law and a principle we do not negotiate.'},
              {icon:'🤝',title:es?'Contratacion directa sin intermediarios':'Direct hiring, no hidden middlemen',desc:es?'Trabajamos directamente con Starboard Cruise Services y Norwegian Cruise Line. No hay intermediarios entre tu y el empleador real.':'We work directly with Starboard Cruise Services and Norwegian Cruise Line. There are no middlemen between you and the real employer.'},
              {icon:'⚓',title:es?'Agencia alineada con estandares MLC 2006':'MLC 2006 aligned recruitment agency',desc:es?'Selective Crew esta basada en Colombia y se acoge voluntariamente a los estandares del Convenio de Trabajo Maritimo MLC 2006, que prohibe el cobro de honorarios a candidatos.':'Selective Crew is based in Colombia and voluntarily abides by the Maritime Labour Convention MLC 2006 standards, which prohibit charging fees to candidates.'},
              {icon:'🌟',title:es?'2,000+ candidatos colocados desde 2009':'2,000+ candidates placed since 2009',desc:es?'Llevamos mas de 17 anos conectando talento latinoamericano con las mejores lineas de cruceros del mundo. Nuestro historial habla por si mismo.':'We have spent over 17 years connecting Latin American talent with the world\'s best cruise lines. Our track record speaks for itself.'},
            ].map(item=>(
              <div key={item.title} style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:16,padding:'24px 26px',transition:'all 0.25s'}} onMouseOver={e=>{e.currentTarget.style.borderColor='#99f6e4';e.currentTarget.style.transform='translateY(-2px)';}} onMouseOut={e=>{e.currentTarget.style.borderColor='#e2e8f0';e.currentTarget.style.transform='none';}}>
                <div style={{fontSize:28,marginBottom:12}}>{item.icon}</div>
                <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:600,color:'#0a1628',marginBottom:8,lineHeight:1.35}}>{item.title}</h3>
                <p style={{fontSize:14,color:'#475569',lineHeight:1.75}}>{item.desc}</p>
              </div>
            ))}
          </div>
          <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:16,padding:'28px 32px',borderLeft:'4px solid #f59e0b'}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
              <span style={{fontSize:22}}>??</span>
              <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:19,fontWeight:600,color:'#0a1628'}}>{es?'Preocupado por estafas? Comienza con los hechos.':'Worried about scams? Start with the facts.'}</h3>
            </div>
            <p style={{fontSize:14,color:'#475569',lineHeight:1.75,marginBottom:16}}>{es?'Hay muchas ofertas de trabajo falsas en cruceros en linea, por lo que los candidatos necesitan pruebas antes de aplicar. Selective Crew muestra esas pruebas claramente: historia real de la empresa, alianzas directas con cruceros, resenas publicas y una politica estricta de cero honorarios para candidatos.':'There are many fake cruise job offers online, so candidates need proof before they apply. Selective Crew shows that proof clearly: real company history, direct cruise partnerships, public reviews, and a strict no-fee policy for candidates.'}</p>
            <div style={{display:'flex',flexWrap:'wrap',gap:10}}>
              <Link href="/is-selective-crew-legit" style={{background:'#f8fafc',color:'#0d9488',border:'1px solid #99f6e4',padding:'9px 18px',borderRadius:8,fontSize:13,fontWeight:600,textDecoration:'none'}}>{es?'Es legitima Selective Crew? ->':'Is Selective Crew Legit? ->'}</Link>
              <a href="https://www.facebook.com/selectivecrew/reviews" target="_blank" rel="noopener noreferrer" style={{background:'#f8fafc',color:'#0a1628',border:'1px solid #e2e8f0',padding:'9px 18px',borderRadius:8,fontSize:13,fontWeight:600,textDecoration:'none'}}>{es?'Ver Resenas en Facebook ->':'Read Facebook Reviews ->'}</a>
            </div>
          </div>
        </div>
      </section>

      <div style={{lineHeight:0,background:'#f8fafc'}}>
        <svg viewBox="0 0 1440 40" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{display:'block',width:'100%',height:40}}>
          <path d="M0,20 C480,40 960,0 1440,20 L1440,40 L0,40 Z" fill="#fff"/>
        </svg>
      </div>

      {/* HOW IT WORKS */}
      <section style={{padding:'80px 24px',background:'#fff'}}>
        <div className="container-main" style={{maxWidth:900,textAlign:'center'}}>
          <span style={{fontSize:11,fontWeight:700,letterSpacing:2,color:'#0d9488',textTransform:'uppercase',display:'block',marginBottom:8}}>Simple & Transparent</span>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(26px,4vw,36px)',fontWeight:700,color:'#0a1628',marginBottom:12}}>{es?'Como funciona el proceso de contratacion':'How the Hiring Process Works'}</h2>
          <p style={{fontSize:16,color:'#64748b',marginBottom:56,maxWidth:540,margin:'0 auto 56px'}}>{es?'Sin costos ocultos, sin intermediarios, sin sorpresas.':'No hidden costs, no middlemen, no surprises.'}</p>
          <div className="steps-grid" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:40,position:'relative'}}>
            <div style={{position:'absolute',top:26,left:'18%',right:'18%',height:2,background:'linear-gradient(90deg,#0d9488,#14b8a6)',opacity:0.25,zIndex:0}}></div>
            {[
              {n:'01',title:es?'Explora las posiciones abiertas':'Browse current cruise ship openings',desc:es?'Navega por nuestras vacantes actuales por rol y empresa. Filtra por departamento para encontrar tu posicion ideal.':'Browse our current openings by role and company. Filter by department to find your ideal position.'},
              {n:'02',title:es?'Envia tu aplicacion sin costo':'Submit your application at no cost',desc:es?'Aplica directamente a traves de nuestra plataforma sin ningun costo. Nunca cobramos a los candidatos - nunca.':'Apply directly through our platform at no cost. We never charge candidates - ever.'},
              {n:'03',title:es?'Recibe orientacion hasta que abordas':'Get reviewed, interviewed, and guided',desc:es?'Nuestro equipo revisa tu perfil, te entrevista y te guia durante todo el proceso de embarque hasta que estes listo para abordar.':'Our team reviews your profile, interviews you, and guides you through the full onboarding process until you are ready to board.'},
            ].map(step=>(
              <div key={step.n} style={{position:'relative',zIndex:1}}>
                <div className="step-num" style={{margin:'0 auto 20px'}}>{step.n}</div>
                <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:600,color:'#0a1628',marginBottom:10,lineHeight:1.35}}>{step.title}</h3>
                <p style={{fontSize:14,color:'#64748b',lineHeight:1.75}}>{step.desc}</p>
              </div>
            ))}
          </div>
          <Link href="/apply" style={{marginTop:48,display:'inline-flex',alignItems:'center',gap:8,background:'#0a1628',color:'#fff',padding:'14px 32px',borderRadius:10,fontSize:15,fontWeight:700,fontFamily:'inherit',textDecoration:'none'}}>
            {es?'Iniciar mi Aplicacion - Gratis':'Start My Application - Free'} {'->'}
          </Link>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{padding:'80px 24px',background:'#0a1628',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'radial-gradient(circle at 15% 80%, rgba(13,148,136,0.1) 0%, transparent 45%), radial-gradient(circle at 85% 20%, rgba(14,77,138,0.12) 0%, transparent 45%)'}}></div>
        <div className="container-main" style={{position:'relative'}}>
          <div style={{textAlign:'center',marginBottom:52}}>
            <span style={{fontSize:11,fontWeight:700,letterSpacing:2,color:'#14b8a6',textTransform:'uppercase',display:'block',marginBottom:8}}>Proven Results</span>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(26px,4vw,36px)',fontWeight:700,color:'#fff',marginBottom:12}}>{es?'Colombianos que Iniciaron su Carrera en Cruceros':'Colombians Who Started Their Cruise Careers'}</h2>
            <p style={{fontSize:15,color:'rgba(255,255,255,0.5)',maxWidth:500,margin:'0 auto'}}>{es?'Mas de 2,000 profesionales latinoamericanos ya trabajan en cruceros gracias a Selective Crew.':'Over 2,000 Latin American professionals are already working on cruise ships thanks to Selective Crew.'}</p>
          </div>
          <div className="testimonials-grid" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}}>
            {TESTIMONIALS.map(item=>(
              <div key={item.name} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:16,padding:'28px',position:'relative'}}>
                <div style={{position:'absolute',top:16,left:20,fontFamily:"'Playfair Display',serif",fontSize:64,color:'#0d9488',opacity:0.25,lineHeight:1}}>"</div>
                <div style={{paddingTop:12,position:'relative',zIndex:1}}>
                  <p style={{fontSize:14,color:'rgba(255,255,255,0.72)',lineHeight:1.8,marginBottom:20,fontStyle:'italic'}}>"{es?item.quote_es:item.quote_en}"</p>
                  <div style={{display:'flex',alignItems:'center',gap:12,borderTop:'1px solid rgba(255,255,255,0.08)',paddingTop:16}}>
                    <img src={item.avatar} alt={item.name} style={{width:46,height:46,borderRadius:'50%',objectFit:'cover',border:'2px solid rgba(13,148,136,0.4)'}}/>
                    <div>
                      <p style={{fontSize:14,fontWeight:700,color:'#fff',margin:0}}>{item.name}</p>
                      <p style={{fontSize:12,color:'#14b8a6',margin:0}}>{es?item.role_es:item.role_en}</p>
                      <p style={{fontSize:11,color:'rgba(255,255,255,0.35)',margin:0}}>{item.country}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{textAlign:'center',marginTop:40}}>
            <a href="https://www.facebook.com/selectivecrew/reviews" target="_blank" rel="noopener noreferrer" style={{background:'#f0a500',color:'#0a1628',padding:'13px 28px',borderRadius:10,fontSize:14,fontWeight:700,fontFamily:'inherit',textDecoration:'none',display:'inline-block'}}>{es?'Leer Resenas en Facebook ->':'Read Facebook Reviews ->'}</a>
          </div>
        </div>
        <div style={{position:'absolute',bottom:0,left:0,right:0,lineHeight:0}}>
          <svg viewBox="0 0 1440 40" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{display:'block',width:'100%',height:40}}>
            <path d="M0,20 C360,40 720,0 1080,30 C1260,40 1380,10 1440,20 L1440,40 L0,40 Z" fill="#f8fafc"/>
          </svg>
        </div>
      </section>

      {/* FOR EMPLOYERS */}
      <section style={{padding:'80px 24px',background:'#f8fafc'}}>
        <div className="container-main" style={{maxWidth:960}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:56,alignItems:'center'}} className="hero-grid">
            <div>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:2,color:'#0d9488',textTransform:'uppercase',display:'block',marginBottom:8}}>For Employers</span>
              <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(24px,4vw,34px)',fontWeight:700,color:'#0a1628',marginBottom:16,lineHeight:1.25}}>{es?'Contratando Talento en America Latina?':'Hiring Talent in Latin America?'}</h2>
              <p style={{fontSize:15,color:'#475569',lineHeight:1.8,marginBottom:20}}>{es?'Selective Crew ayuda a empresas de Estados Unidos a contratar talento calificado en America Latina mediante reclutamiento gestionado y coordinacion de candidatos.':'For U.S. employers, Selective Crew provides LATAM Recruiting as a Service: qualified Latin American talent, managed through our proprietary candidate pipeline.'}</p>
              {[es?'Acceso a una red de mas de 10,000 candidatos evaluados':'Access to a network of 10,000+ screened candidates',es?'Evaluacion de ingles, personalidad y experiencia en ventas':'English, personality and sales experience evaluation',es?'Coordinacion de candidatos desde aplicacion hasta embarque':'Candidate coordination from application to embarkation',es?'Experiencia directa con Starboard y Norwegian desde 2009':'Direct experience with Starboard and Norwegian since 2009'].map(item=>(
                <div key={item} style={{display:'flex',alignItems:'flex-start',gap:10,marginBottom:10}}>
                  <div style={{width:20,height:20,borderRadius:'50%',background:'#ccfbf1',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:2}}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5L4 7L8 3" stroke="#0d9488" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </div>
                  <p style={{fontSize:14,color:'#334155',lineHeight:1.6,margin:0}}>{item}</p>
                </div>
              ))}
              <Link href="/employers" style={{display:'inline-flex',alignItems:'center',gap:8,background:'#0a1628',color:'#fff',padding:'13px 24px',borderRadius:10,fontSize:14,fontWeight:700,fontFamily:'inherit',textDecoration:'none',marginTop:20}}>{es?'Reclutamiento LATAM ->':'Explore LATAM Recruiting ->'}</Link>
            </div>
            <div style={{background:'linear-gradient(145deg,#0a1628,#0d4a6e)',borderRadius:20,padding:36,color:'#fff'}}>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:2,color:'#14b8a6',textTransform:'uppercase',marginBottom:16}}>{es?'Nuestros Socios':'Our Partners'}</div>
              {[{name:'Starboard Cruise Services',tag:es?'Socio Fundador · Desde 2010':'Founding Partner · Since 2010',icon:'📋'},{name:'Norwegian Cruise Line',tag:es?'Socio Oficial · Desde 2023':'Official Partner · Since 2023',icon:'🌟'},{name:'Grand Circle Cruise Line',tag:es?'Socio Oficial · Desde 2024':'Official Partner · Since 2024',icon:'🛡️'}].map(p=>(
                <div key={p.name} style={{display:'flex',alignItems:'center',gap:14,padding:'14px 0',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
                  <div style={{width:44,height:44,borderRadius:'50%',background:'rgba(13,148,136,0.15)',border:'1px solid rgba(13,148,136,0.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>{p.icon}</div>
                  <div><p style={{fontSize:14,fontWeight:700,color:'#fff',margin:0}}>{p.name}</p><p style={{fontSize:12,color:'#14b8a6',margin:0}}>{p.tag}</p></div>
                </div>
              ))}
              <div style={{marginTop:20,padding:'16px',background:'rgba(13,148,136,0.1)',borderRadius:10,border:'1px solid rgba(13,148,136,0.2)'}}>
                <p style={{fontSize:13,color:'rgba(255,255,255,0.65)',lineHeight:1.7,margin:0}}>{es?'"Selective Crew entiende exactamente el tipo de candidato que necesitamos. Su proceso de seleccion nos ahorra tiempo y garantiza calidad."':'"Selective Crew understands exactly the type of candidate we need. Their selection process saves us time and guarantees quality."'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Employer offer: secondary to the candidate-first homepage */}
      <section aria-label={es ? 'Servicios para empresas' : 'Services for employers'} style={{ padding: '20px 24px', background: '#f0fdfa', borderBottom: '1px solid #ccfbf1' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
          <div>
            <p style={{ margin: '0 0 4px', color: '#0f766e', fontSize: 11, fontWeight: 800, letterSpacing: 1.4, textTransform: 'uppercase' }}>
              {es ? 'Para empresas de EE. UU.' : 'For U.S. employers'}
            </p>
            <p style={{ margin: 0, color: '#0a1628', fontSize: 15, lineHeight: 1.5, fontWeight: 600 }}>
              {es ? 'Talento calificado de América Latina, gestionado a través de nuestro pipeline propietario de candidatos.' : 'Qualified Latin American talent, managed through our proprietary candidate pipeline.'}
            </p>
          </div>
          <Link href="/employers" style={{ color: '#0f766e', fontSize: 14, fontWeight: 800, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            {es ? 'Soluciones para empresas' : 'For Employers'} {'->'}
          </Link>
        </div>
      </section>


      {/* BLOG */}
      <section style={{padding:'80px 24px',background:'#fff'}}>
        <div className="container-main">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:40,flexWrap:'wrap',gap:12}}>
            <div>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:2,color:'#0d9488',textTransform:'uppercase',display:'block',marginBottom:8}}>Crew Life Resources</span>
              <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(26px,4vw,36px)',fontWeight:700,color:'#0a1628'}}>{es?'Todo lo que necesitas saber':'Everything You Need to Know'}</h2>
            </div>
            <Link href="/blog" className="teal-link">{es?'Ver todos los articulos':'Read all articles'} {'->'}</Link>
          </div>
          <div className="blog-grid" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:24}}>
            {BLOG_POSTS.map((post,i)=>(
              <Link key={i} href="/blog" className="blog-card">
                <div style={{height:196,overflow:'hidden',position:'relative'}}>
                  <img src={post.image} alt={es?post.title_es:post.title_en} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                  <div style={{position:'absolute',top:12,left:12,background:'rgba(13,148,136,0.9)',color:'#fff',fontSize:10,fontWeight:700,padding:'3px 10px',borderRadius:100,letterSpacing:0.5}}>{post.tag}</div>
                </div>
                <div style={{padding:'20px 22px 24px'}}>
                  <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:600,color:'#0a1628',marginBottom:8,lineHeight:1.4}}>{es?post.title_es:post.title_en}</h3>
                  <p style={{fontSize:13,color:'#64748b',lineHeight:1.7,marginBottom:12}}>{es?post.excerpt_es:post.excerpt_en}</p>
                  <span style={{fontSize:13,color:'#0d9488',fontWeight:600}}>{es?'Leer mas ->':'Read more ->'}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      
      {/* MONEYMIGO BANNER */}
      <section style={{padding:'48px 24px',background:'#f0fdf9',borderTop:'1px solid #99f6e4',borderBottom:'1px solid #99f6e4'}}>
        <div style={{maxWidth:960,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',gap:32,flexWrap:'wrap'}}>
          <div style={{display:'flex',alignItems:'flex-start',gap:16}}>
            <div style={{width:48,height:48,borderRadius:12,background:'#0d9488',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:22}}>??</div>
            <div>
              <p style={{fontSize:11,fontWeight:700,letterSpacing:2,color:'#0d9488',textTransform:'uppercase',marginBottom:4}}>{es?'Recurso para tripulacion':'Resource for Crew Members'}</p>
              <h3 style={{fontSize:'clamp(18px,3vw,24px)',fontWeight:700,color:'#0a1628',marginBottom:6,lineHeight:1.3}}>{es?'Haz que cada contrato cuente':'Make every contract count financially'}</h3>
              <p style={{fontSize:14,color:'#475569',lineHeight:1.7,maxWidth:520}}>{es?'Nos asociamos con MoneyMigo para ofrecerte guias gratuitas sobre como ahorrar y planificar tu futuro.':'We partnered with MoneyMigo to give you free guides on saving, sending money home, and planning your future.'}</p>
            </div>
          </div>
          <a href="https://moneymigo.com" target="_blank" rel="noopener noreferrer" style={{background:'#0d9488',color:'#fff',padding:'12px 24px',borderRadius:10,fontSize:14,fontWeight:700,textDecoration:'none',whiteSpace:'nowrap',flexShrink:0}}>{es?'Ver guias gratis ->':'View free guides ->'}</a>
        </div>
      </section>

      {/* COUNTRY PAGES SECTION */}
      <section style={{padding:'64px 24px',background:'#fff'}}>
        <div className="container-main" style={{maxWidth:960}}>
          <div style={{textAlign:'center',marginBottom:40}}>
            <span style={{fontSize:11,fontWeight:700,letterSpacing:2,color:'#0d9488',textTransform:'uppercase',display:'block',marginBottom:8}}>
              {es ? 'Reclutamos en' : 'We Recruit From'}
            </span>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(22px,3vw,32px)',fontWeight:700,color:'#0a1628',marginBottom:12}}>
              {es ? 'Informacion especifica para tu pais' : 'Country-specific information'}
            </h2>
            <p style={{fontSize:15,color:'#64748b',maxWidth:520,margin:'0 auto',lineHeight:1.7}}>
              {es ? 'Guias de aplicacion, requisitos de documentos y posiciones abiertas para candidatos de Colombia, Peru, Ecuador, Chile, Argentina, Mexico, Panama, Republica Dominicana, Venezuela, Costa Rica y Uruguay.' : 'Application guides, document requirements, and open positions for candidates from Colombia, Peru, Ecuador, Chile, Argentina, Mexico, Panama, Dominican Republic, Venezuela, Costa Rica and Uruguay.'}
            </p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:20}}>
            {[
              { flag:'🇨🇴', country:'Colombia', href:'/cruise-jobs-colombia', desc_en:'Complete guide for Colombian candidates — documents, requirements, and open positions. Agency based in Bogota since 2009.', desc_es:'Guia completa para candidatos colombianos — tramites, requisitos y posiciones. Agencia basada en Bogota desde 2009.', cta_en:'View Colombia guide', cta_es:'Ver guia Colombia', h_en:['Policia Nacional check','C1/D visa from Bogota','Recruiting nationwide'], h_es:['Policia Nacional','Visa C1/D Bogota','Todo el pais'] },
              { flag:'🇵🇪', country:'Peru', href:'/cruise-jobs-peru', desc_en:'Complete guide for Peruvian candidates. 100% virtual process from Lima or any city.', desc_es:'Guia para candidatos peruanos. Proceso 100% virtual desde Lima o cualquier ciudad.', cta_en:'View Peru guide', cta_es:'Ver guia Peru', h_en:['Poder Judicial check','C1/D visa from Lima','Recruiting nationwide'], h_es:['Poder Judicial','Visa C1/D Lima','Todo el pais'] },
              { flag:'🇪🇨', country:'Ecuador', href:'/cruise-jobs-ecuador', desc_en:'Guide for Ecuadorian candidates. We recruit from Quito, Guayaquil and all of Ecuador.', desc_es:'Guia para candidatos ecuatorianos. Reclutamos de Quito, Guayaquil y todo Ecuador.', cta_en:'View Ecuador guide', cta_es:'Ver guia Ecuador', h_en:['Background check','C1/D visa from Quito','Recruiting nationwide'], h_es:['Antecedentes','Visa C1/D Quito','Todo el pais'] },
              { flag:'🇨🇱', country:'Chile', href:'/cruise-jobs-chile', desc_en:'Guide for Chilean candidates. We recruit from Santiago, Valparaiso and all of Chile.', desc_es:'Guia para candidatos chilenos. Reclutamos de Santiago, Valparaiso y todo Chile.', cta_en:'View Chile guide', cta_es:'Ver guia Chile', h_en:['Registro Civil check','C1/D visa from Santiago','Recruiting nationwide'], h_es:['Registro Civil','Visa C1/D Santiago','Todo el pais'] },
              { flag:'🇦🇷', country:'Argentina', href:'/cruise-jobs-argentina', desc_en:'Guide for Argentine candidates. We recruit from Buenos Aires, Cordoba and all of Argentina.', desc_es:'Guia para candidatos argentinos. Reclutamos de Buenos Aires, Cordoba y toda Argentina.', cta_en:'View Argentina guide', cta_es:'Ver guia Argentina', h_en:['Background check','C1/D visa from Buenos Aires','Recruiting nationwide'], h_es:['Antecedentes','Visa C1/D Buenos Aires','Todo el pais'] },
              { flag:'🇲🇽', country:'Mexico', href:'/apply', desc_en:'We recruit Mexican candidates for current cruise ship positions. 100% virtual process.', desc_es:'Reclutamos candidatos mexicanos para posiciones actuales en cruceros. Proceso 100% virtual.', cta_en:'Apply from Mexico', cta_es:'Aplicar desde Mexico', h_en:['Free to apply','Virtual interviews','Guidance through the process'], h_es:['Aplicacion gratis','Entrevistas virtuales','Acompanamiento en el proceso'] },
              { flag:'🇵🇦', country:'Panama', href:'/cruise-jobs-panama', desc_en:'Guide for Panamanian candidates. We recruit from Panama City and all of Panama.', desc_es:'Guia para candidatos panamenos. Reclutamos en Ciudad de Panama y todo el pais.', cta_en:'View Panama guide', cta_es:'Ver guia Panama', h_en:['Background check','C1/D visa from Panama City','Recruiting nationwide'], h_es:['Antecedentes','Visa C1/D Panama City','Todo el pais'] },
              { flag:'🇩🇴', country:'Dominican Republic', href:'/cruise-jobs-dominican-republic', desc_en:'Guide for Dominican candidates. We recruit from Santo Domingo and all of the Dominican Republic.', desc_es:'Guia para candidatos dominicanos. Reclutamos en Santo Domingo y toda la Republica Dominicana.', cta_en:'Apply Free', cta_es:'Aplicar Gratis', h_en:['Background check','C1/D visa from Santo Domingo','Recruiting nationwide'], h_es:['Antecedentes','Visa C1/D Santo Domingo','Todo el pais'] },
              { flag:'🇻🇪', country:'Venezuela', href:'/apply', desc_en:'We recruit Venezuelan candidates for current cruise ship positions. 100% virtual process.', desc_es:'Reclutamos candidatos venezolanos para posiciones actuales en cruceros. Proceso 100% virtual.', cta_en:'Apply from Venezuela', cta_es:'Aplicar desde Venezuela', h_en:['Free to apply','Virtual interviews','Guidance through the process'], h_es:['Aplicacion gratis','Entrevistas virtuales','Acompanamiento en el proceso'] },
              { flag:'🇨🇷', country:'Costa Rica', href:'/apply', desc_en:'We recruit Costa Rican candidates for current cruise ship positions. 100% virtual process.', desc_es:'Reclutamos candidatos costarricenses para posiciones actuales en cruceros. Proceso 100% virtual.', cta_en:'Apply from Costa Rica', cta_es:'Aplicar desde Costa Rica', h_en:['Free to apply','Virtual interviews','Guidance through the process'], h_es:['Aplicacion gratis','Entrevistas virtuales','Acompanamiento en el proceso'] },
              { flag:'🇺🇾', country:'Uruguay', href:'/apply', desc_en:'We recruit Uruguayan candidates for current cruise ship positions. 100% virtual process.', desc_es:'Reclutamos candidatos uruguayos para posiciones actuales en cruceros. Proceso 100% virtual.', cta_en:'Apply from Uruguay', cta_es:'Aplicar desde Uruguay', h_en:['Free to apply','Virtual interviews','Guidance through the process'], h_es:['Aplicacion gratis','Entrevistas virtuales','Acompanamiento en el proceso'] },
            ].map(c => (
              <div key={c.country} style={{background:'#f8fafc',border:'1px solid #e2e8f0',borderRadius:16,padding:'28px',transition:'all 0.25s'}}
                onMouseOver={e=>{e.currentTarget.style.borderColor='#0d9488';e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 12px 32px rgba(13,148,136,0.1)';}}
                onMouseOut={e=>{e.currentTarget.style.borderColor='#e2e8f0';e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none';}}>
                <div style={{fontSize:40,marginBottom:12}}>{c.flag}</div>
                <div style={{fontSize:16,fontWeight:700,color:'#0a1628',fontFamily:"'Playfair Display',serif",marginBottom:8}}>
                  {es ? 'Cruceros para candidatos de' : 'Cruise jobs for candidates from'} {c.country}
                </div>
                <p style={{fontSize:13,color:'#64748b',lineHeight:1.65,marginBottom:16}}>{es ? c.desc_es : c.desc_en}</p>
                <div style={{display:'flex',flexDirection:'column',gap:6,marginBottom:20}}>
                  {(es ? c.h_es : c.h_en).map(h => (
                    <div key={h} style={{display:'flex',alignItems:'center',gap:8,fontSize:12,color:'#475569'}}>
                      <span style={{color:'#0d9488',fontWeight:700}}>?</span> {h}
                    </div>
                  ))}
                </div>
                <Link href={c.href} style={{display:'inline-flex',alignItems:'center',gap:6,background:'#0d9488',color:'#fff',padding:'10px 18px',borderRadius:8,fontSize:13,fontWeight:700,textDecoration:'none'}}>
                  {es ? c.cta_es : c.cta_en}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
{/* ---------------------------------------
          TRAINING LEAD CAPTURE SECTION
      --------------------------------------- */}
      <section style={{padding:'80px 24px',background:'linear-gradient(135deg,#0a1628 0%,#1a3a5c 60%,#0f2d4a 100%)'}}>
        <div className="container-main" style={{maxWidth:960}}>
          <div className="training-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:56,alignItems:'center'}}>
            <div>
              <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(201,168,76,0.15)',border:'1px solid rgba(201,168,76,0.3)',borderRadius:100,padding:'5px 14px',marginBottom:20}}>
                <div style={{width:6,height:6,borderRadius:'50%',background:'#c9a84c'}}></div>
                <span style={{fontSize:12,fontWeight:600,color:'#c9a84c',letterSpacing:1}}>{es?'FORMACION GRATUITA':'FREE TRAINING'}</span>
              </div>
              <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(24px,4vw,34px)',fontWeight:700,color:'#f8f4ec',lineHeight:1.25,marginBottom:16}}>
                {es?'Convierte tu experiencia en retail en una carrera en cruceros':'Turn Your Retail Experience Into a Cruise Ship Career'}
              </h2>
              <p style={{fontSize:15,color:'rgba(248,244,236,0.65)',lineHeight:1.8,marginBottom:24}}>
                {es?'Nuestro curso gratuito de 25 minutos te prepara para destacar en el proceso de seleccion de Selective Crew. Cubre ventas duty-free, conocimiento de productos, tecnicas de atencion al cliente y mas.':'Our free 25-minute course prepares you to stand out in the Selective Crew selection process. Covers duty-free sales, product knowledge, customer service techniques, and more.'}
              </p>
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {[
                  es?'5 modulos · ~25 minutos · Certificado gratis':'5 modules · ~25 minutes · Free certificate',
                  es?'Aprende tecnicas de venta duty-free':'Learn duty-free sales techniques',
                  es?'Conocimiento de productos: perfumes, relojes, cosmeticos':'Product knowledge: perfumes, watches, cosmetics',
                  es?'Candidatos certificados destacan en entrevistas':'Certified candidates stand out in interviews',
                ].map((item,i)=>(
                  <div key={i} style={{display:'flex',alignItems:'center',gap:10}}>
                    <div style={{width:18,height:18,borderRadius:'50%',background:'rgba(201,168,76,0.2)',border:'1px solid rgba(201,168,76,0.4)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                      <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </div>
                    <span style={{fontSize:13,color:'rgba(248,244,236,0.7)'}}>{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/training" style={{display:'inline-flex',alignItems:'center',gap:8,background:'#c9a84c',color:'#0a1628',padding:'13px 24px',borderRadius:10,fontSize:14,fontWeight:700,fontFamily:'inherit',textDecoration:'none',marginTop:28}}>
                {es?'Ver el curso completo ->':'View Full Course ->'}
              </Link>
            </div>
            <div style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(201,168,76,0.2)',borderRadius:20,padding:'32px 28px'}}>
              <LeadCaptureForm source="homepage-training-section" darkBg={true} />
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{padding:'80px 24px',background:'linear-gradient(160deg,#0a1628,#0d4a6e)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'radial-gradient(circle at 25% 50%, rgba(13,148,136,0.12) 0%, transparent 55%), radial-gradient(circle at 75% 50%, rgba(13,148,136,0.08) 0%, transparent 55%)'}}></div>
        <div className="container-main" style={{position:'relative',textAlign:'center',maxWidth:640}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(13,148,136,0.15)',border:'1px solid rgba(13,148,136,0.3)',borderRadius:100,padding:'5px 14px',marginBottom:24}}>
            <div style={{width:6,height:6,borderRadius:'50%',background:'#14b8a6'}}></div>
            <span style={{fontSize:12,color:'#5eead4',fontWeight:600,letterSpacing:1}}>{es?'LISTO PARA ZARPAR':'READY TO SET SAIL'}</span>
          </div>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(28px,5vw,44px)',fontWeight:700,color:'#fff',marginBottom:16,lineHeight:1.2}}>{es?'Tu carrera en el mar comienza hoy':'Your career at sea starts today'}</h2>
          <p style={{color:'rgba(255,255,255,0.55)',fontSize:16,lineHeight:1.8,marginBottom:36}}>{es?'Unete a los miles de profesionales latinoamericanos que ya estan navegando el mundo gracias a Selective Crew. Es completamente gratuito para candidatos - siempre.':'Join the thousands of Latin American professionals already sailing the world thanks to Selective Crew. It is completely free for candidates - always.'}</p>
          <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap',marginBottom:32}}>
            <Link href="/jobs" style={{background:'#0d9488',color:'#fff',padding:'14px 32px',borderRadius:10,fontSize:15,fontWeight:700,fontFamily:'inherit',textDecoration:'none',display:'inline-flex',alignItems:'center',gap:8}}>{es?'Ver Posiciones Abiertas':'View Open Positions'} {'->'}</Link>
            <button onClick={()=>setQualifyStep(1)} style={{background:'rgba(255,255,255,0.08)',color:'#fff',border:'1.5px solid rgba(255,255,255,0.25)',padding:'14px 24px',borderRadius:10,fontSize:15,fontWeight:600,fontFamily:'inherit',cursor:'pointer'}}>{es?'Verificar si Califico':'Check if You Qualify'}</button>
          </div>
          <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',gap:20}}>
            {[es?'Sin costo para candidatos':'No fees for candidates',es?'Contratacion directa':'Direct hiring',es?'Apoyo hasta el embarque':'Support until embarkation'].map(f=>(
              <span key={f} style={{display:'flex',alignItems:'center',gap:7,fontSize:13,color:'rgba(255,255,255,0.55)'}}><span style={{color:'#14b8a6',fontSize:16}}>?</span> {f}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}





