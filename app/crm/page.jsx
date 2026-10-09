'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useLang } from '../../lib/LanguageContext';

const navy = '#0a1628';
const teal = '#0d9488';
const gold = '#c9a84c';
const ocean = '#0e4d8a';

const FEATURES_EN = [
  { icon: '??', title: 'Kanban Pipeline', desc: 'Drag and drop candidates through your recruitment stages. Applied, Reviewing, Interviewed, Shortlisted, Placed — fully customizable.' },
  { icon: '??', title: 'Auto-Scoring', desc: 'Every candidate automatically scored A through D based on English, experience, passport, and availability.' },
  { icon: '??', title: 'Email Automation', desc: 'One-click templates for every stage. Stage-based emails sent automatically when you move a candidate.' },
  { icon: '??', title: 'Interview Scheduling', desc: 'Schedule interviews with Google Meet links generated automatically. Confirmation emails sent instantly.' },
  { icon: '??', title: 'Document Portal', desc: 'Candidates upload passport, background check, and medical certificate directly. Attaches to their profile.' },
  { icon: '??', title: 'Pipeline Reports', desc: 'Weekly recruitment reports by email. Applications by country, grade breakdown, placements, revenue.' },
  { icon: '??', title: 'Stage-Based Emails', desc: 'Move a candidate to a new stage and they automatically receive a personalized email. Zero manual work.' },
  { icon: '??', title: 'Placement Tracking', desc: 'Track every placement with client, start date, position, and agency fee. Monthly revenue charts included.' },
];
const FEATURES_ES = [
  { icon: '??', title: 'Pipeline Kanban', desc: 'Arrastra candidatos entre etapas. Aplicado, Revisando, Entrevistado, Preseleccionado, Colocado — completamente personalizable.' },
  { icon: '??', title: 'Scoring Automatico', desc: 'Cada candidato calificado automaticamente de A a D segun ingles, experiencia, pasaporte y disponibilidad.' },
  { icon: '??', title: 'Emails Automatizados', desc: 'Plantillas con un clic para cada etapa. Emails automaticos cuando mueves un candidato de etapa.' },
  { icon: '??', title: 'Programar Entrevistas', desc: 'Agenda entrevistas con links de Google Meet generados automaticamente. Confirmacion enviada al instante.' },
  { icon: '??', title: 'Portal de Documentos', desc: 'Candidatos suben pasaporte, antecedentes y certificado medico directamente. Se adjunta a su perfil.' },
  { icon: '??', title: 'Reportes de Pipeline', desc: 'Reportes semanales por email. Aplicaciones por pais, calificaciones, colocaciones e ingresos.' },
  { icon: '??', title: 'Emails por Etapa', desc: 'Al mover un candidato de etapa recibe automaticamente un email personalizado. Cero seguimiento manual.' },
  { icon: '??', title: 'Seguimiento de Colocaciones', desc: 'Controla cada colocacion con cliente, fecha, cargo y honorario. Graficos de ingresos mensuales.' },
];

const PACKAGES = [
  {
    name: 'Starter',
    price: '$2,500',
    delivery: '2 weeks',
    color: teal,
    bg: '#f0fdf9',
    border: '#99f6e4',
    features: [
      'Full recruitment CRM admin panel',
      'Kanban pipeline with drag and drop',
      'Up to 5 custom job role pages',
      'Apply page with auto-scoring',
      'Candidate confirmation emails',
      'Firebase hosting + deployment',
      'Your branding, logo and colors',
      '1 month of support',
    ],
  },
  {
    name: 'Professional',
    price: '$4,500',
    delivery: '3 weeks',
    color: ocean,
    bg: '#eff6ff',
    border: '#93c5fd',
    popular: true,
    features: [
      'Everything in Starter',
      'Gmail inbox integration',
      'Interview scheduling with Google Meet',
      'Document upload portal for candidates',
      'Stage-based automated emails',
      'Assignment auto-import from email',
      'Weekly report button',
      '3 months of support',
    ],
  },
  {
    name: 'Premium',
    price: '$7,500',
    delivery: '4 weeks',
    color: '#7c3aed',
    bg: '#faf5ff',
    border: '#c4b5fd',
    features: [
      'Everything in Professional',
      'Custom landing pages per country (up to 5)',
      'Training course integration',
      'Placement tracking + revenue reports',
      'Testimonial automation',
      'Bilingual (English + Spanish)',
      'SEO-optimized job pages',
      '6 months of support',
    ],
  },
];

const FAQS_EN = [
  { q: 'Do I need technical knowledge?', a: 'No. Everything is point and click — pipeline, emails, scheduling, reports. We handle all technical setup and deployment.' },
  { q: 'Can I use my own domain?', a: 'Yes. The CRM is deployed to your domain — youragency.com/admin. Candidates apply at youragency.com/apply and upload documents at youragency.com/documents.' },
  { q: 'How long does delivery take?', a: 'Starter: 2 weeks. Professional: 3 weeks. Premium: 4 weeks. Fully working system on delivery day.' },
  { q: 'Can I customize job roles and pipeline stages?', a: 'Yes. We configure everything specifically for your agency — your roles, stages, email templates, and branding.' },
  { q: 'What happens after delivery?', a: 'You receive full access and a walkthrough video. Support included per package. Optional monthly support available after.' },
  { q: 'Is this a monthly subscription?', a: 'No. One-time build fee. You own the system. Only Firebase hosting (~\/month) applies after delivery.' },
  { q: 'What countries do you serve?', a: 'We work with agencies across Latin America and internationally. Any niche — hospitality, maritime, healthcare, technology, construction.' },
];
const FAQS_ES = [
  { q: 'Necesito conocimientos tecnicos?', a: 'No. Todo es apuntar y hacer clic — pipeline, emails, entrevistas, reportes. Nosotros manejamos toda la configuracion tecnica.' },
  { q: 'Puedo usar mi propio dominio?', a: 'Si. El CRM se despliega en tu dominio — tuagencia.com/admin. Candidatos aplican en tuagencia.com/apply y suben documentos en tuagencia.com/documents.' },
  { q: 'Cuanto tiempo tarda la entrega?', a: 'Starter: 2 semanas. Professional: 3 semanas. Premium: 4 semanas. Sistema completamente funcional el dia de entrega.' },
  { q: 'Puedo personalizar los roles y etapas?', a: 'Si. Configuramos todo especificamente para tu agencia — tus roles, etapas, plantillas de email y marca.' },
  { q: 'Que pasa despues de la entrega?', a: 'Recibes acceso completo y video de capacitacion. Soporte incluido segun el paquete. Soporte mensual opcional disponible despues.' },
  { q: 'Es una suscripcion mensual?', a: 'No. Pago unico. Eres dueno del sistema. Solo aplica el hosting de Firebase (~\/mes) despues de la entrega.' },
  { q: 'A que paises sirven?', a: 'Trabajamos con agencias en toda America Latina e internacionalmente. Cualquier nicho — hospitalidad, maritimo, salud, tecnologia, construccion.' },
];

export default function CRMPage() {
  const { lang } = useLang();
  const es = lang === 'es';
  const [formData, setFormData] = useState({ name:'', agency:'', email:'', whatsapp:'', country:'', package:'', candidates:'' });
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const handle = e => setFormData({...formData, [e.target.name]: e.target.value});

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'careers@selectivecrew.com',
          subject: 'CRM Inquiry - ' + formData.agency + ' (' + formData.country + ') - ' + formData.package,
          text: 'CRM SYSTEM INQUIRY\n\nName: ' + formData.name + '\nAgency: ' + formData.agency + '\nEmail: ' + formData.email + '\nWhatsApp: ' + formData.whatsapp + '\nCountry: ' + formData.country + '\nPackage Interest: ' + formData.package + '\nCandidates per month: ' + formData.candidates,
        }),
      });
      setSubmitted(true);
    } catch(e) { alert('Something went wrong. Please contact us on WhatsApp: +57 318 847 4058'); }
    setBusy(false);
  }

  const inp = { width:'100%', padding:'11px 14px', border:'1.5px solid #d1d9e6', borderRadius:8, fontSize:14, fontFamily:'inherit', color:navy, background:'#f8fafc', boxSizing:'border-box', outline:'none' };
  const sel = { ...inp, appearance:'none', cursor:'pointer' };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .crm-container { max-width: 1000px; margin: 0 auto; padding: 0 24px; }
        .crm-serif { font-family: 'Playfair Display', Georgia, serif; }
        .crm-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 28px; }
        .crm-btn-gold { display: inline-flex; align-items: center; gap: 8px; background: #c9a84c; color: #0a1628; padding: 14px 28px; border-radius: 10px; font-size: 15px; font-weight: 700; font-family: inherit; text-decoration: none; border: none; cursor: pointer; }
        .crm-btn-outline { display: inline-flex; align-items: center; gap: 8px; background: transparent; color: #f8f4ec; padding: 13px 24px; border-radius: 10px; font-size: 14px; font-weight: 600; font-family: inherit; text-decoration: none; border: 1.5px solid rgba(248,244,236,0.25); cursor: pointer; }
        .crm-faq { border-bottom: 1px solid #f1f5f9; padding: 20px 0; }
        .crm-faq:last-child { border-bottom: none; }
        @media (max-width: 768px) {
          .crm-hero-grid { grid-template-columns: 1fr !important; }
          .crm-packages-grid { grid-template-columns: 1fr !important; }
          .crm-features-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* HERO */}
      <section style={{ background:'linear-gradient(160deg,#0a1628 0%,#0e2d4a 60%,#0a1628 100%)', padding:'80px 24px 90px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)', backgroundSize:'60px 60px' }} />
        <div style={{ position:'absolute', top:'5%', right:'-5%', width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle,rgba(13,148,136,0.08) 0%,transparent 70%)' }} />
        <div className="crm-container" style={{ position:'relative', textAlign:'center' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(13,148,136,0.15)', border:'1px solid rgba(13,148,136,0.3)', borderRadius:100, padding:'5px 16px', marginBottom:24 }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:teal }} />
            <span style={{ fontSize:11, fontWeight:700, color:'#5eead4', letterSpacing:1.5 }}>CUSTOM RECRUITMENT CRM · BUILT FOR YOUR AGENCY</span>
          </div>
          <h1 className="crm-serif" style={{ fontSize:'clamp(30px,4.5vw,54px)', fontWeight:700, color:'#f8f4ec', lineHeight:1.1, marginBottom:24, maxWidth:800, margin:'0 auto 24px' }}>
            {es ? 'Tu Propio CRM de Reclutamiento' : 'Your Own Recruitment CRM'}<br /><span style={{ color:teal }}>{es ? 'Listo en 2-4 Semanas' : 'Built in 2-4 Weeks'}</span>
          </h1>
          <p style={{ fontSize:17, color:'rgba(248,244,236,0.65)', lineHeight:1.8, marginBottom:40, maxWidth:620, margin:'0 auto 40px' }}>
            {es ? 'Un sistema de reclutamiento completamente personalizado, desplegado en tu dominio. Pipeline, scoring automatico, emails automatizados, programacion de entrevistas, portal de documentos — todo lo que tu agencia necesita para crecer.' : 'A fully custom recruitment system deployed to your domain. Pipeline management, auto-scoring, email automation, interview scheduling, document collection — everything your agency needs to scale.'}
          </p>
          <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap', marginBottom:48 }}>
            <a href="#packages" className="crm-btn-gold">See Packages & Pricing</a>
            <a href="#contact" className="crm-btn-outline">Book a Free Demo</a>
          </div>
          <div style={{ display:'flex', justifyContent:'center', gap:40, flexWrap:'wrap' }}>
            {[
              [es?'Pago unico':'One-time fee', es?'Sin mensualidades':'No monthly subscriptions'],
              [es?'Entrega en 2-4 semanas':'2-4 week delivery', es?'Listo desde el dia uno':'Ready to use on day one'],
              [es?'Tu marca':'Your branding', es?'Tu dominio, tus colores':'Your domain, your colors'],
              [es?'Tuyo para siempre':'Full ownership', es?'Eres dueno del sistema':'You own the system forever'],
            ].map(([title, sub]) => (
              <div key={title} style={{ textAlign:'center' }}>
                <div style={{ fontSize:14, fontWeight:700, color:'#f8f4ec' }}>{title}</div>
                <div style={{ fontSize:12, color:'rgba(248,244,236,0.45)' }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BUILT ON REAL EXPERIENCE */}
      <section style={{ padding:'72px 24px', background:'#fff' }}>
        <div className="crm-container">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, alignItems:'center' }} className="crm-hero-grid">
            <div>
              <span style={{ display:'inline-block', fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', color:'#64748b', background:'#f1f5f9', borderRadius:100, padding:'4px 12px', marginBottom:12 }}>Built from experience</span>
              <h2 className="crm-serif" style={{ fontSize:'clamp(22px,3vw,34px)', color:navy, marginBottom:16 }}>{es ? 'Construido por un reclutador, para reclutadores' : 'Built by a recruiter, for recruiters'}</h2>
              <p style={{ fontSize:15, color:'#64748b', lineHeight:1.8, marginBottom:16 }}>{es ? 'Este sistema fue construido desde cero para Selective Crew — una agencia de reclutamiento maritimo que coloca candidatos de America Latina desde 2009. Cada funcion fue creada para resolver un problema real de reclutamiento.' : 'This system was built from scratch for Selective Crew — a cruise ship recruitment agency placing candidates from Latin America since 2009. Every feature was built to solve a real recruiting problem.'}</p>
              <p style={{ fontSize:15, color:'#64748b', lineHeight:1.8, marginBottom:24 }}>{es ? 'No somos una empresa de software que adivino lo que necesitan los reclutadores. Somos reclutadores que construimos exactamente lo que necesitabamos — y ahora lo construimos para otras agencias.' : 'We are not a software company that guessed what recruiters need. We are recruiters who built exactly what we needed — and now we build it for other agencies.'}</p>
              {[
                es?'Gestiona +500 aplicaciones de candidatos por mes':'Manages 500+ candidate applications per month',
                es?'Usado diariamente por nuestro equipo':'Used daily by our own recruitment team',
                es?'Redujo el tiempo de email manual en un 80%':'Reduced manual email time by 80%',
                es?'Controla colocaciones e ingresos de la agencia':'Tracks placements and agency revenue',
              ].map(item => (
                <div key={item} style={{ display:'flex', gap:10, alignItems:'flex-start', marginBottom:10 }}>
                  <div style={{ width:20, height:20, borderRadius:'50%', background:'#f0fdf9', border:'1px solid '+teal, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5L4 7L8 3" stroke="#0d9488" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <span style={{ fontSize:14, color:'#334155', lineHeight:1.6 }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ background:'linear-gradient(135deg,#0a1628 0%,#0e2d4a 100%)', borderRadius:20, padding:32, color:'#fff' }}>
              <div style={{ fontSize:11, fontWeight:700, color:teal, letterSpacing:2, textTransform:'uppercase', marginBottom:20 }}>What your admin panel looks like</div>
              {[
                { label:'Total Candidates', value:'247', color:'#a78bfa' },
                { label:'This Week', value:'+18', color:teal },
                { label:'Placed', value:'34', color:'#4ade80' },
                { label:'Conversion', value:'13.8%', color:gold },
              ].map(s => (
                <div key={s.label} style={{ display:'flex', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize:13, color:'rgba(255,255,255,0.5)' }}>{s.label}</span>
                  <span style={{ fontSize:16, fontWeight:800, color:s.color }}>{s.value}</span>
                </div>
              ))}
              <div style={{ marginTop:20, display:'flex', gap:8, flexWrap:'wrap' }}>
                {['Applied','Reviewing','Pre Interview','Shortlisted','Placed'].map((stage, i) => (
                  <span key={stage} style={{ fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:20, background:['#ede9fe','#dbeafe','#faf5ff','#ccfbf1','#bbf7d0'][i], color:['#7c3aed','#1e40af','#7c3aed','#0d9488','#16a34a'][i] }}>{stage}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding:'72px 24px', background:'#f8fafc' }}>
        <div className="crm-container">
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <span style={{ display:'inline-block', fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', color:'#64748b', background:'#f1f5f9', borderRadius:100, padding:'4px 12px', marginBottom:12 }}>Features</span>
            <h2 className="crm-serif" style={{ fontSize:'clamp(22px,3vw,34px)', color:navy }}>Everything your agency needs</h2>
          </div>
          <div className="crm-features-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:20 }}>
            {(es ? FEATURES_ES : FEATURES_EN).map(f => (
              <div key={f.title} className="crm-card" style={{ borderLeft:'3px solid '+teal }}>
                <div style={{ fontSize:28, marginBottom:12 }}>{f.icon}</div>
                <div style={{ fontSize:15, fontWeight:700, color:navy, marginBottom:8 }}>{f.title}</div>
                <div style={{ fontSize:13, color:'#64748b', lineHeight:1.7 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section id="packages" style={{ padding:'72px 24px', background:'#fff' }}>
        <div className="crm-container">
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <span style={{ display:'inline-block', fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', color:'#64748b', background:'#f1f5f9', borderRadius:100, padding:'4px 12px', marginBottom:12 }}>Pricing</span>
            <h2 className="crm-serif" style={{ fontSize:'clamp(22px,3vw,34px)', color:navy, marginBottom:12 }}>One-time investment. You own it forever.</h2>
            <p style={{ fontSize:15, color:'#64748b', maxWidth:520, margin:'0 auto' }}>No monthly fees. No subscriptions. Pay once, own the system permanently. Only Firebase hosting (~$20/month) applies after delivery.</p>
          </div>
          <div className="crm-packages-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
            {PACKAGES.map(pkg => (
              <div key={pkg.name} style={{ background: pkg.popular ? navy : '#fff', border:'2px solid '+(pkg.popular ? teal : pkg.border), borderRadius:20, padding:32, position:'relative' }}>
                {pkg.popular && (
                  <div style={{ position:'absolute', top:-14, left:'50%', transform:'translateX(-50%)', background:teal, color:'#fff', fontSize:11, fontWeight:800, padding:'4px 16px', borderRadius:100, whiteSpace:'nowrap' }}>MOST POPULAR</div>
                )}
                <div style={{ fontSize:13, fontWeight:700, color: pkg.popular ? teal : pkg.color, textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>{pkg.name}</div>
                <div style={{ fontSize:40, fontWeight:800, color: pkg.popular ? '#f8f4ec' : navy, marginBottom:4 }}>{pkg.price}</div>
                <div style={{ fontSize:13, color: pkg.popular ? 'rgba(248,244,236,0.5)' : '#94a3b8', marginBottom:24 }}>one-time · delivered in {pkg.delivery}</div>
                <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:28 }}>
                  {pkg.features.map(f => (
                    <div key={f} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                      <div style={{ width:18, height:18, borderRadius:'50%', background: pkg.popular ? 'rgba(13,148,136,0.2)' : pkg.bg, border:'1px solid '+(pkg.popular ? teal : pkg.border), display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2 }}>
                        <svg width="9" height="9" viewBox="0 0 10 10" fill="none"><path d="M2 5L4 7L8 3" stroke={pkg.popular ? teal : pkg.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      <span style={{ fontSize:13, color: pkg.popular ? 'rgba(248,244,236,0.8)' : '#334155', lineHeight:1.5 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <a href="#contact" style={{ display:'block', textAlign:'center', background: pkg.popular ? teal : pkg.color, color:'#fff', borderRadius:10, padding:'13px', fontSize:14, fontWeight:700, textDecoration:'none' }}>
                  Get Started
                </a>
              </div>
            ))}
          </div>
          <div style={{ marginTop:24, background:'#f0fdf9', border:'1px solid #99f6e4', borderRadius:12, padding:'16px 20px', textAlign:'center' }}>
            <p style={{ fontSize:14, color:'#065f46', margin:0 }}>Not sure which package is right for you? <a href="#contact" style={{ color:teal, fontWeight:700, textDecoration:'none' }}>Book a free 30-minute demo call</a> and we will recommend the best fit for your agency.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding:'72px 24px', background:'#f8fafc' }}>
        <div className="crm-container" style={{ maxWidth:720 }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <span style={{ display:'inline-block', fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', color:'#64748b', background:'#f1f5f9', borderRadius:100, padding:'4px 12px', marginBottom:12 }}>FAQ</span>
            <h2 className="crm-serif" style={{ fontSize:'clamp(22px,3vw,34px)', color:navy }}>Common questions</h2>
          </div>
          <div className="crm-card">
            {(es ? FAQS_ES : FAQS_EN).map(faq => (
              <div key={faq.q} className="crm-faq">
                <div style={{ fontSize:15, fontWeight:700, color:navy, marginBottom:8 }}>{faq.q}</div>
                <div style={{ fontSize:14, color:'#64748b', lineHeight:1.7 }}>{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section id="contact" style={{ padding:'72px 24px', background:'#0a1628' }}>
        <div className="crm-container" style={{ maxWidth:640 }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <span style={{ display:'inline-block', fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', background:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.5)', borderRadius:100, padding:'4px 12px', marginBottom:12 }}>Get Started</span>
            <h2 className="crm-serif" style={{ fontSize:'clamp(22px,3vw,34px)', color:'#f8f4ec', marginBottom:12 }}>Book your free demo call</h2>
            <p style={{ fontSize:15, color:'rgba(248,244,236,0.55)', lineHeight:1.7 }}>{es ? 'Cuentanos sobre tu agencia y agendaremos una demo de 30 minutos mostrando exactamente como funciona el sistema para tu caso.' : 'Tell us about your agency and we will schedule a 30-minute demo showing exactly how the system works for your use case.'}</p>
          </div>

          {submitted ? (
            <div style={{ background:'rgba(13,148,136,0.12)', border:'1px solid rgba(13,148,136,0.25)', borderRadius:16, padding:'40px 32px', textAlign:'center' }}>
              <div style={{ fontSize:40, marginBottom:16 }}>?</div>
              <div style={{ fontSize:20, fontFamily:"'Playfair Display',serif", color:'#f8f4ec', marginBottom:10 }}>Request Received</div>
              <p style={{ fontSize:14, color:'rgba(248,244,236,0.65)', lineHeight:1.7 }}>{es ? 'Gracias! Te contactaremos en 24 horas por WhatsApp o email para agendar tu demo.' : 'Thank you! We will contact you within 24 hours via WhatsApp or email to schedule your demo call.'}</p>
            </div>
          ) : (
            <form onSubmit={submit} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:'32px 28px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:'rgba(248,244,236,0.6)', display:'block', marginBottom:6 }}>Your name *</label>
                  <input name="name" value={formData.name} onChange={handle} required style={inp} placeholder="Full name" />
                </div>
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:'rgba(248,244,236,0.6)', display:'block', marginBottom:6 }}>Agency name *</label>
                  <input name="agency" value={formData.agency} onChange={handle} required style={inp} placeholder="Your agency name" />
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:'rgba(248,244,236,0.6)', display:'block', marginBottom:6 }}>Email *</label>
                  <input name="email" type="email" value={formData.email} onChange={handle} required style={inp} placeholder="your@email.com" />
                </div>
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:'rgba(248,244,236,0.6)', display:'block', marginBottom:6 }}>WhatsApp *</label>
                  <input name="whatsapp" value={formData.whatsapp} onChange={handle} required style={inp} placeholder="+57 300 000 0000" />
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:'rgba(248,244,236,0.6)', display:'block', marginBottom:6 }}>Country *</label>
                  <select name="country" value={formData.country} onChange={handle} required style={sel}>
                    <option value="">Select country</option>
                    {['Colombia','Mexico','Peru','Chile','Argentina','Ecuador','Panama','Spain','United States','Other'].map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:'rgba(248,244,236,0.6)', display:'block', marginBottom:6 }}>Candidates per month</label>
                  <select name="candidates" value={formData.candidates} onChange={handle} style={sel}>
                    <option value="">Select range</option>
                    <option>Less than 50</option>
                    <option>50-200</option>
                    <option>200-500</option>
                    <option>500+</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom:20 }}>
                <label style={{ fontSize:12, fontWeight:600, color:'rgba(248,244,236,0.6)', display:'block', marginBottom:6 }}>Package interest</label>
                <select name="package" value={formData.package} onChange={handle} style={sel}>
                  <option value="">Select package</option>
                  <option>Starter — $2,500</option>
                  <option>Professional — $4,500</option>
                  <option>Premium — $7,500</option>
                  <option>Not sure — show me the demo first</option>
                </select>
              </div>
              <button type="submit" disabled={busy} className="crm-btn-gold" style={{ width:'100%', justifyContent:'center', fontSize:15 }}>
                {busy ? 'Sending...' : es ? 'Agendar Demo Gratis ->' : 'Book Free Demo Call ->'}
              </button>
              <p style={{ textAlign:'center', fontSize:12, color:'rgba(248,244,236,0.3)', marginTop:14 }}>We respond within 24 hours. No commitment required.</p>
            </form>
          )}

          <div style={{ marginTop:32, textAlign:'center' }}>
            <p style={{ fontSize:13, color:'rgba(248,244,236,0.4)', marginBottom:12 }}>Prefer to reach us directly?</p>
            <a href="https://wa.me/573224849050" style={{ display:'inline-flex', alignItems:'center', gap:8, background:'#25D366', color:'#fff', borderRadius:10, padding:'12px 24px', fontSize:14, fontWeight:700, textDecoration:'none' }}>
              WhatsApp: +57 318 847 4058
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
