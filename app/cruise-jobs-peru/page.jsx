'use client';
import Link from 'next/link';
import { useLang } from '../../lib/LanguageContext';

const schema = {
  '@context': 'https://schema.org',
  '@type': 'JobPosting',
  title: 'Cruise Ship Jobs for Peruvian Candidates',
  description: 'Selective Crew recruits Peruvian candidates for cruise ship retail sales, photography, and management roles. Free recruitment since 2009.',
  datePosted: '2026-04-01',
  validThrough: '2026-12-31',
  employmentType: 'CONTRACTOR',
  hiringOrganization: { '@type': 'Organization', name: 'Selective Crew', sameAs: 'https://selectivecrew.com' },
  applicantLocationRequirements: { '@type': 'Country', name: 'Peru' },
  baseSalary: { '@type': 'MonetaryAmount', currency: 'USD', value: { '@type': 'QuantitativeValue', minValue: 900, maxValue: 2000, unitText: 'MONTH' } },
};

const JOBS = [
  { title_en:'Fast Track Assistant Manager', title_es:'Fast Track Asistente de Gerente', company:'Starboard Cruise Services', salary:'$1,500/mo training + $1,200/mo + commissions as ASM', tag:'HOT', href:'/fast-track-manager' },
  { title_en:'Retail Sales Associate', title_es:'Asociado de Ventas', company:'Starboard Cruise Services', salary:'$900/mo + commissions', href:'/cruise-ship-retail-sales-career' },
  { title_en:'Cruise Ship Photographer', title_es:'Fotografo de Crucero', company:'Norwegian Cruise Line', salary:'$900-$1,400/mo + commissions', href:'/cruise-ship-photographer-jobs' },
  { title_en:'Fine Jewelry Specialist', title_es:'Especialista en Joyeria Fina', company:'Starboard Cruise Services', salary:'$1,000-$1,400/mo + commissions', href:'/apply' },
];

const STEPS_EN = [
  { n:'01', title:'Apply free online', desc:'Complete the short form at selectivecrew.com/apply. You only need your name, WhatsApp, email and country in Step 1.' },
  { n:'02', title:'We review your profile', desc:'Our team reviews your sales experience, English level and availability within 48 hours.' },
  { n:'03', title:'Video interview', desc:'If your profile qualifies, we contact you via WhatsApp to schedule a video interview.' },
  { n:'04', title:'Documents and C1/D visa', desc:'We guide you through every step — passport, Poder Judicial background check, medical exam, and C1/D visa from Lima.' },
  { n:'05', title:'You board the ship', desc:'The company pays your flight. We give you embarkation instructions and follow up until you are on board.' },
];

const STEPS_ES = [
  { n:'01', title:'Aplica gratis en linea', desc:'Completa el formulario corto en selectivecrew.com/apply. Solo necesitas nombre, WhatsApp, email y pais en el primer paso.' },
  { n:'02', title:'Revisamos tu perfil', desc:'Nuestro equipo revisa tu experiencia en ventas, nivel de ingles y disponibilidad dentro de 48 horas.' },
  { n:'03', title:'Entrevista por video', desc:'Si tu perfil califica, te contactamos por WhatsApp para coordinar una entrevista de video.' },
  { n:'04', title:'Documentos y visa C1/D', desc:'Te guiamos en cada paso — pasaporte, antecedentes del Poder Judicial, examen medico y visa C1/D desde Lima.' },
  { n:'05', title:'Abordas el crucero', desc:'La empresa paga tu vuelo. Te damos instrucciones de embarque y seguimiento hasta que estes a bordo.' },
];

const FAQS_EN = [
  { q:'Does Selective Crew charge Peruvian candidates?', a:'No. Never. Our service is 100% free for Peruvian candidates. The employer pays us, not you. This is aligned with MLC 2006 standards.' },
  { q:'What English level do I need?', a:'Intermediate to advanced English is required for sales and photography roles. You must communicate confidently with international passengers in English.' },
  { q:'How do I get my background check in Peru?', a:'You can get the Certificado de Antecedentes Penales from the Poder Judicial online or in person. The police certificate from the Ministerio del Interior is also requested.' },
  { q:'What is the C1/D visa and how do I get it from Lima?', a:'It is the crew visa for ships departing from US ports. It is processed at the US Embassy in Lima. We guide you through the process. The cost is generally reimbursed onboard.' },
  { q:'Can candidates from any Peruvian city apply?', a:'Yes. We recruit from Lima, Arequipa, Trujillo, Cusco and all cities. Flights to the embarkation point are paid by the company.' },
  { q:'How long does the process take?', a:'The full process typically takes 4 to 12 weeks depending on vacancy availability and how quickly you complete your documents.' },
];

const FAQS_ES = [
  { q:'Selective Crew cobra algo a los candidatos peruanos?', a:'No. Nunca. Nuestro servicio es 100% gratuito para candidatos peruanos. El empleador nos paga, no tu. Esto esta alineado con los estandares MLC 2006.' },
  { q:'Que nivel de ingles necesito?', a:'Ingles intermedio a avanzado es requerido para roles de ventas y fotografia. Debes poder comunicarte con confianza con pasajeros internacionales en ingles.' },
  { q:'Como obtengo mis antecedentes penales en Peru?', a:'Puedes obtener el Certificado de Antecedentes Penales del Poder Judicial en linea o presencialmente. Tambien se solicita el certificado policial del Ministerio del Interior.' },
  { q:'Que es la visa C1/D y como la tramito desde Lima?', a:'Es la visa de tripulante para buques que zarpan desde puertos de EE.UU. Se tramita en la Embajada de EE.UU. en Lima. El costo generalmente es reembolsado a bordo.' },
  { q:'Pueden aplicar candidatos de cualquier ciudad del Peru?', a:'Si. Reclutamos de Lima, Arequipa, Trujillo, Cusco y todas las ciudades. Los vuelos son pagados por la empresa.' },
  { q:'Cuanto tiempo tarda el proceso?', a:'El proceso completo tipicamente toma entre 4 y 12 semanas segun disponibilidad de vacantes y rapidez en documentos.' },
];

const REQS_EN = [
  { icon:'📄', title:'Valid Peruvian passport', desc:'You need a valid Peruvian passport. You can apply through MIGRACIONES. Candidates with valid passports advance faster in the process.' },
  { icon:'🔍', title:'Criminal background check', desc:'Certificado de Antecedentes Penales from the Poder Judicial and police certificate from the Ministerio del Interior. Both available online or in person.' },
  { icon:'🏥', title:'Maritime medical exam', desc:'Pre-employment medical exam by an authorized doctor. We tell you where to do it in Lima when you advance in the selection process.' },
  { icon:'🇺🇸', title:'C1/D visa for the US', desc:'Required for ships departing from US ports. Processed at the US Embassy in Lima. Cost is generally reimbursed onboard.' },
  { icon:'🗣️', title:'Intermediate to advanced English', desc:'For sales and photography roles you need confident conversational English. If your English needs work, we recommend our free preparation course.' },
  { icon:'💼', title:'Sales or retail experience', desc:'1+ year in sales, retail, hospitality or customer service. Luxury retail, cosmetics or jewelry experience in Lima is especially valued.' },
];

const REQS_ES = [
  { icon:'📄', title:'Pasaporte peruano vigente', desc:'Necesitas un pasaporte peruano valido. Puedes tramitarlo en MIGRACIONES. Los candidatos con pasaporte vigente avanzan mas rapido en el proceso.' },
  { icon:'🔍', title:'Antecedentes penales y policiales', desc:'Certificado de Antecedentes Penales del Poder Judicial y certificado policial del Ministerio del Interior. Ambos disponibles en linea o presencialmente.' },
  { icon:'🏥', title:'Examen medico maritimo', desc:'Examen medico pre-empleo por medico autorizado. Te indicamos donde realizarlo en Lima cuando avances en el proceso de seleccion.' },
  { icon:'🇺🇸', title:'Visa C1/D para EE.UU.', desc:'Requerida para barcos que zarpan desde puertos americanos. Se tramita en la Embajada de EE.UU. en Lima. El costo generalmente es reembolsado a bordo.' },
  { icon:'🗣️', title:'Ingles intermedio a avanzado', desc:'Para roles de ventas y fotografia necesitas ingles conversacional con confianza. Si tu ingles necesita refuerzo, te recomendamos nuestro curso gratuito.' },
  { icon:'💼', title:'Experiencia en ventas o retail', desc:'1+ ano en ventas, retail, hospitalidad o atencion al cliente. Experiencia en retail de lujo, cosmeticos o joyeria en Lima es especialmente valorada.' },
];

const PARTNERS = [
  { name:'Starboard Cruise Services', role_en:'Retail Sales & Management', role_es:'Ventas Retail y Gerencia', since:'2010' },
  { name:'Norwegian Cruise Line', role_en:'Photography & Sales', role_es:'Fotografia y Ventas', since:'2023' },
  { name:'Harding Retail', role_en:'Onboard Sales', role_es:'Ventas Onboard', since_en:'Active', since_es:'Activo' },
  { name:'Grand Circle Cruise Line', role_en:'Expedition Sales', role_es:'Ventas Expedicion', since:'2024' },
];

export default function CruiseJobsPeruPage() {
  const { lang } = useLang();
  const es = lang === 'es';
  const STEPS = es ? STEPS_ES : STEPS_EN;
  const FAQS = es ? FAQS_ES : FAQS_EN;
  const REQS = es ? REQS_ES : REQS_EN;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        .pe-c{max-width:960px;margin:0 auto;padding:0 24px;}
        .pe-serif{font-family:'Playfair Display',Georgia,serif;}
        .pe-card{background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:24px;}
        .pe-btn{display:inline-flex;align-items:center;gap:8px;background:#0d9488;color:#fff;padding:13px 24px;border-radius:10px;font-size:14px;font-weight:700;font-family:inherit;text-decoration:none;border:none;cursor:pointer;}
        .pe-btn-gold{background:#c9a84c!important;color:#0a1628!important;}
        .pe-step{display:flex;gap:16px;padding:18px 0;border-bottom:1px solid #f1f5f9;}
        .pe-step:last-child{border-bottom:none;}
        .pe-snum{width:40px;height:40px;border-radius:50%;background:#0d9488;color:#fff;font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
        .pe-faq{border-bottom:1px solid #f1f5f9;padding:18px 0;}
        .pe-faq:last-child{border-bottom:none;}
        .pe-job{display:flex;justify-content:space-between;align-items:center;padding:16px 0;border-bottom:1px solid #f1f5f9;gap:12px;flex-wrap:wrap;}
        .pe-job:last-child{border-bottom:none;}
        .pe-sticky{display:none;}
        @media(max-width:768px){
          .pe-2{grid-template-columns:1fr!important;}
          .pe-sticky{display:flex;position:fixed;bottom:0;left:0;right:0;padding:14px 20px;background:rgba(10,22,40,0.97);backdrop-filter:blur(8px);border-top:1px solid rgba(255,255,255,0.1);z-index:90;gap:10px;}
          .pe-sticky a{flex:1;text-align:center;justify-content:center;font-size:13px;padding:12px;}
        }
      `}</style>

      {/* HERO */}
      <section style={{background:'linear-gradient(160deg,#0a1628 0%,#0d2240 55%,#0d4a6e 100%)',padding:'72px 24px 80px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)',backgroundSize:'60px 60px'}}/>
        <div className="pe-c" style={{position:'relative'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(13,148,136,0.15)',border:'1px solid rgba(13,148,136,0.3)',borderRadius:100,padding:'5px 14px',marginBottom:20}}>
            <span style={{fontSize:16}}>🇵🇪</span>
            <span style={{fontSize:11,fontWeight:700,color:'#5eead4',letterSpacing:1.5}}>
              {es ? 'SELECTIVE CREW · PERU · DESDE 2009' : 'SELECTIVE CREW · PERU · SINCE 2009'}
            </span>
          </div>
          <h1 className="pe-serif" style={{fontSize:'clamp(28px,4vw,48px)',fontWeight:700,color:'#f8f4ec',lineHeight:1.15,marginBottom:16}}>
            {es ? 'Trabajos en Cruceros' : 'Cruise Ship Jobs'}<br />
            <span style={{color:'#14b8a6'}}>{es ? 'para Peruanos' : 'for Peruvian Candidates'}</span>
          </h1>
          <p style={{fontSize:16,color:'rgba(248,244,236,0.65)',lineHeight:1.8,marginBottom:32,maxWidth:560}}>
            {es
              ? 'Selective Crew ha conectado a candidatos peruanos con empleos reales en cruceros desde 2009. Trabajamos directamente con Starboard y NCL — 100% gratuito para candidatos, siempre.'
              : 'Selective Crew has connected Peruvian candidates with real cruise ship jobs since 2009. We work directly with Starboard and NCL — 100% free for candidates, always.'}
          </p>
          <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:36}}>
            <Link href="/apply" className="pe-btn">{es ? 'Aplicar Gratis Ahora' : 'Apply Free Now'}</Link>
            <Link href="/jobs" className="pe-btn" style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.2)'}}>{es ? 'Ver Posiciones' : 'View Positions'}</Link>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:12}}>
            {[
              {icon:'🇵🇪', en:'Recruiting in Peru', es:'Reclutamos en Peru', sub_en:'Lima & nationwide', sub_es:'Lima y todo el pais'},
              {icon:'💰', en:'100% Free', es:'100% Gratis', sub_en:'We never charge', sub_es:'Nunca cobramos'},
              {icon:'👥', en:'2,000+ placed', es:'2,000+ colocados', sub_en:'All LATAM since 2009', sub_es:'Toda LATAM desde 2009'},
              {icon:'🚢', en:'Direct hiring', es:'Contratacion directa', sub_en:'Starboard & NCL', sub_es:'Starboard & NCL'},
            ].map(item => (
              <div key={item.en} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,padding:'14px'}}>
                <div style={{fontSize:20,marginBottom:6}}>{item.icon}</div>
                <div style={{fontSize:13,fontWeight:600,color:'#f8f4ec'}}>{es ? item.es : item.en}</div>
                <div style={{fontSize:11,color:'rgba(248,244,236,0.45)'}}>{es ? item.sub_es : item.sub_en}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY PERU */}
      <section style={{padding:'64px 24px',background:'#fff'}}>
        <div className="pe-c">
          <div className="pe-2" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:48,alignItems:'center'}}>
            <div>
              <span style={{display:'inline-block',fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',color:'#64748b',background:'#f1f5f9',borderRadius:100,padding:'4px 12px',marginBottom:12}}>
                {es ? 'Por que Peru' : 'Why Peru'}
              </span>
              <h2 className="pe-serif" style={{fontSize:'clamp(22px,3vw,32px)',color:'#0a1628',marginBottom:16}}>
                {es ? 'Peru es uno de nuestros mercados mas activos en Sudamerica' : 'Peru is one of our most active markets in South America'}
              </h2>
              <p style={{fontSize:15,color:'#64748b',lineHeight:1.8,marginBottom:20}}>
                {es
                  ? 'Los candidatos peruanos destacan por su orientacion al servicio, trabajo en equipo, y aptitud para ventas y hospitalidad. Lima tiene un fuerte perfil para retail de lujo, cosmeticos y joyeria.'
                  : 'Peruvian candidates stand out for their service orientation, teamwork, and aptitude for sales and hospitality. Lima has a strong profile for luxury retail, cosmetics and jewelry.'}
              </p>
              {(es ? [
                'Reclutamos en Lima, Arequipa, Trujillo, Cusco y todo el Peru',
                'Entrevistas virtuales — proceso 100% remoto',
                'Guia completa: pasaporte, antecedentes, visa C1/D desde Lima',
                'Acompanamiento personalizado hasta que abordas el barco',
                'Proceso gratuito — el empleador paga nuestra comision, no tu',
              ] : [
                'We recruit from Lima, Arequipa, Trujillo, Cusco and all of Peru',
                'Virtual interviews — 100% remote process',
                'Full guidance: passport, background check, C1/D visa from Lima',
                'Personalized support until you board the ship',
                'Free process — the employer pays our fee, not you',
              ]).map(item => (
                <div key={item} style={{display:'flex',alignItems:'flex-start',gap:10,marginBottom:10}}>
                  <div style={{width:20,height:20,borderRadius:'50%',background:'#f0fdf9',border:'1px solid #0d9488',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:1}}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5L4 7L8 3" stroke="#0d9488" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <span style={{fontSize:14,color:'#334155',lineHeight:1.6}}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{background:'linear-gradient(145deg,#0a1628,#0d4a6e)',borderRadius:20,padding:32,color:'#fff'}}>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:2,color:'#14b8a6',textTransform:'uppercase',marginBottom:20}}>
                {es ? 'Candidatos peruanos colocados en' : 'Peruvian candidates placed with'}
              </div>
              {PARTNERS.map(p => (
                <div key={p.name} style={{padding:'14px 0',borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
                  <div style={{fontSize:13,fontWeight:700,color:'#f8f4ec'}}>{p.name}</div>
                  <div style={{fontSize:11,color:'rgba(248,244,236,0.45)',marginTop:2}}>
                    {es ? p.role_es : p.role_en} · {es ? (p.since_es || p.since) : (p.since_en || p.since)}
                  </div>
                </div>
              ))}
              <Link href="/apply" className="pe-btn pe-btn-gold" style={{display:'block',textAlign:'center',marginTop:20,justifyContent:'center'}}>
                {es ? 'Aplicar Ahora — Gratis' : 'Apply Now — Free'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* OPEN JOBS */}
      <section style={{padding:'64px 24px',background:'#f8fafc'}}>
        <div className="pe-c" style={{maxWidth:720}}>
          <span style={{display:'inline-block',fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',color:'#64748b',background:'#f1f5f9',borderRadius:100,padding:'4px 12px',marginBottom:12}}>
            {es ? 'Vacantes Abiertas' : 'Open Positions'}
          </span>
          <h2 className="pe-serif" style={{fontSize:'clamp(22px,3vw,32px)',color:'#0a1628',marginBottom:8}}>
            {es ? 'Posiciones disponibles para candidatos peruanos' : 'Open positions for Peruvian candidates'}
          </h2>
          <p style={{fontSize:15,color:'#64748b',marginBottom:32,lineHeight:1.7}}>
            {es ? 'Todas las posiciones son gratuitas para aplicar. Vuelo, alojamiento y comidas incluidos.' : 'All positions are free to apply. Flight, accommodation and meals included.'}
          </p>
          <div className="pe-card">
            {JOBS.map(job => (
              <div key={job.title_en} className="pe-job">
                <div>
                  <div style={{fontSize:15,fontWeight:700,color:'#0a1628',marginBottom:2}}>{es ? job.title_es : job.title_en}</div>
                  <div style={{fontSize:13,color:'#0d9488',fontWeight:600,marginBottom:2}}>{job.company}</div>
                  <div style={{fontSize:13,color:'#64748b'}}>{job.salary}</div>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  {job.tag === 'HOT' && <span style={{fontSize:10,fontWeight:700,background:'#dc2626',color:'#fff',padding:'3px 10px',borderRadius:100}}>HOT</span>}
                  <Link href={job.href} className="pe-btn" style={{padding:'8px 16px',fontSize:13}}>{es ? 'Aplicar' : 'Apply'}</Link>
                </div>
              </div>
            ))}
          </div>
          <div style={{marginTop:16,textAlign:'center'}}>
            <Link href="/jobs" style={{fontSize:14,color:'#0d9488',fontWeight:600,textDecoration:'none'}}>
              {es ? 'Ver todas las posiciones abiertas' : 'View all open positions'}
            </Link>
          </div>
        </div>
      </section>

      {/* REQUIREMENTS */}
      <section style={{padding:'64px 24px',background:'#fff'}}>
        <div className="pe-c">
          <span style={{display:'inline-block',fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',color:'#64748b',background:'#f1f5f9',borderRadius:100,padding:'4px 12px',marginBottom:12}}>
            {es ? 'Requisitos' : 'Requirements'}
          </span>
          <h2 className="pe-serif" style={{fontSize:'clamp(22px,3vw,32px)',color:'#0a1628',marginBottom:8}}>
            {es ? 'Que necesitas para aplicar desde Peru' : 'What you need to apply from Peru'}
          </h2>
          <p style={{fontSize:15,color:'#64748b',marginBottom:36,lineHeight:1.7,maxWidth:600}}>
            {es ? 'No necesitas tenerlos todos listos para aplicar — te guiamos en el proceso.' : 'You do not need all of these ready to apply — we guide you through the process.'}
          </p>
          <div className="pe-2" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
            {REQS.map(item => (
              <div key={item.title} className="pe-card" style={{borderLeft:'3px solid #0d9488'}}>
                <div style={{fontSize:24,marginBottom:10}}>{item.icon}</div>
                <div style={{fontSize:14,fontWeight:700,color:'#0a1628',marginBottom:6}}>{item.title}</div>
                <div style={{fontSize:13,color:'#64748b',lineHeight:1.65}}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section style={{padding:'64px 24px',background:'#f8fafc'}}>
        <div className="pe-c" style={{maxWidth:680}}>
          <span style={{display:'inline-block',fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',color:'#64748b',background:'#f1f5f9',borderRadius:100,padding:'4px 12px',marginBottom:12}}>
            {es ? 'Proceso' : 'Process'}
          </span>
          <h2 className="pe-serif" style={{fontSize:'clamp(22px,3vw,32px)',color:'#0a1628',marginBottom:8}}>
            {es ? 'Como funciona el proceso para candidatos peruanos' : 'How the process works for Peruvian candidates'}
          </h2>
          <p style={{fontSize:15,color:'#64748b',marginBottom:32,lineHeight:1.7}}>
            {es ? 'Transparente, gratuito, y con acompanamiento en cada paso.' : 'Transparent, free, and with support at every step.'}
          </p>
          <div className="pe-card">
            {STEPS.map(s => (
              <div key={s.n} className="pe-step">
                <div className="pe-snum">{s.n}</div>
                <div>
                  <div style={{fontSize:15,fontWeight:700,color:'#0a1628',marginBottom:4}}>{s.title}</div>
                  <div style={{fontSize:13,color:'#64748b',lineHeight:1.65}}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{padding:'64px 24px',background:'#fff'}}>
        <div className="pe-c" style={{maxWidth:720}}>
          <span style={{display:'inline-block',fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',color:'#64748b',background:'#f1f5f9',borderRadius:100,padding:'4px 12px',marginBottom:12}}>
            {es ? 'Preguntas Frecuentes' : 'FAQ'}
          </span>
          <h2 className="pe-serif" style={{fontSize:'clamp(22px,3vw,32px)',color:'#0a1628',marginBottom:36}}>
            {es ? 'Preguntas frecuentes de candidatos peruanos' : 'Frequently asked questions from Peruvian candidates'}
          </h2>
          <div className="pe-card">
            {FAQS.map(faq => (
              <div key={faq.q} className="pe-faq">
                <div style={{fontSize:15,fontWeight:700,color:'#0a1628',marginBottom:8}}>{faq.q}</div>
                <div style={{fontSize:14,color:'#64748b',lineHeight:1.7}}>{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRAINING */}
      <section style={{padding:'48px 24px',background:'#f8fafc'}}>
        <div className="pe-c" style={{maxWidth:720}}>
          <div style={{background:'linear-gradient(135deg,#0a1628,#1a3a5c)',borderRadius:16,padding:'32px 28px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:20}}>
            <div>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:2,color:'#c9a84c',textTransform:'uppercase',marginBottom:8}}>{es ? 'Curso Gratuito' : 'Free Course'}</div>
              <div style={{fontSize:18,fontFamily:"'Playfair Display',serif",fontWeight:700,color:'#f8f4ec',marginBottom:6}}>
                {es ? 'Tu ingles o experiencia necesita refuerzo?' : 'Need to strengthen your English or experience?'}
              </div>
              <div style={{fontSize:13,color:'rgba(248,244,236,0.6)'}}>
                {es ? 'Toma nuestro curso gratuito de 25 minutos y mejora tus posibilidades.' : 'Take our free 25-minute course and improve your chances of being selected.'}
              </div>
            </div>
            <Link href="/training" className="pe-btn pe-btn-gold" style={{whiteSpace:'nowrap'}}>
              {es ? 'Ver Curso Gratuito' : 'View Free Course'}
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{padding:'72px 24px',background:'#0a1628',textAlign:'center'}}>
        <div className="pe-c" style={{maxWidth:580}}>
          <span style={{fontSize:24,display:'block',marginBottom:16}}>🇵🇪</span>
          <h2 className="pe-serif" style={{fontSize:'clamp(22px,3.5vw,36px)',color:'#f8f4ec',marginBottom:12}}>
            {es ? 'Listo para aplicar desde Peru?' : 'Ready to apply from Peru?'}
          </h2>
          <p style={{fontSize:15,color:'rgba(248,244,236,0.55)',lineHeight:1.8,marginBottom:32}}>
            {es ? 'Gratis para aplicar. Respuesta en 48 horas por WhatsApp.' : 'Free to apply. Response within 48 hours via WhatsApp.'}
          </p>
          <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/apply" className="pe-btn" style={{background:'#0d9488'}}>{es ? 'Aplicar Gratis Ahora' : 'Apply Free Now'}</Link>
            <Link href="/jobs" className="pe-btn" style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)',color:'rgba(248,244,236,0.7)'}}>{es ? 'Ver Posiciones' : 'View Positions'}</Link>
          </div>
          <div style={{marginTop:24,display:'flex',justifyContent:'center',flexWrap:'wrap',gap:20}}>
            {(es ? ['100% gratuito para candidatos','Reclutamos en todo el Peru','Respuesta en 48 horas'] : ['100% free for candidates','Recruiting nationwide in Peru','Response within 48 hours']).map(f => (
              <span key={f} style={{fontSize:12,color:'rgba(248,244,236,0.35)',display:'flex',alignItems:'center',gap:6}}><span style={{color:'#14b8a6'}}>✓</span> {f}</span>
            ))}
          </div>
          <div style={{marginTop:28,paddingTop:20,borderTop:'1px solid rgba(255,255,255,0.07)'}}>
            <a href="https://wa.me/573224849050" target="_blank" rel="noopener noreferrer" style={{fontSize:13,color:'rgba(248,244,236,0.4)',textDecoration:'none'}}>
              {es ? 'Preguntas? WhatsApp: +57 318 847 4058' : 'Questions? WhatsApp: +57 318 847 4058'}
            </a>
          </div>
        </div>
      </section>

      <div className="pe-sticky">
        <Link href="/apply" className="pe-btn" style={{background:'#0d9488'}}>{es ? 'Aplicar Gratis' : 'Apply Free'}</Link>
        <Link href="/jobs" className="pe-btn" style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.2)',color:'rgba(248,244,236,0.7)',flex:1,textAlign:'center',justifyContent:'center',fontSize:13,padding:'12px'}}>{es ? 'Ver Posiciones' : 'View Positions'}</Link>
      </div>
    </>
  );
}
