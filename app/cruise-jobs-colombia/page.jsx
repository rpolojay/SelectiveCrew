'use client';
import Link from 'next/link';
import { useLang } from '../../lib/LanguageContext';

const schema = {
  '@context': 'https://schema.org',
  '@type': 'JobPosting',
  title: 'Cruise Ship Jobs for Colombian Candidates',
  description: 'Selective Crew recruits Colombian candidates for cruise ship retail sales, photography, and management roles. Free recruitment based in Colombia since 2009.',
  datePosted: '2026-04-01',
  validThrough: '2026-12-31',
  employmentType: 'CONTRACTOR',
  hiringOrganization: { '@type': 'Organization', name: 'Selective Crew', sameAs: 'https://selectivecrew.com' },
  applicantLocationRequirements: { '@type': 'Country', name: 'Colombia' },
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
  { n:'04', title:'Documents and C1/D visa', desc:'We guide you through every step — passport, Policia Nacional background check, medical exam, and C1/D visa for the US.' },
  { n:'05', title:'You board the ship', desc:'The company pays your flight. We give you embarkation instructions and follow up until you are on board.' },
];

const STEPS_ES = [
  { n:'01', title:'Aplica gratis en linea', desc:'Completa el formulario corto en selectivecrew.com/apply. Solo necesitas nombre, WhatsApp, email y pais en el primer paso.' },
  { n:'02', title:'Revisamos tu perfil', desc:'Nuestro equipo revisa tu experiencia en ventas, nivel de ingles y disponibilidad dentro de 48 horas.' },
  { n:'03', title:'Entrevista por video', desc:'Si tu perfil califica, te contactamos por WhatsApp para coordinar una entrevista de video.' },
  { n:'04', title:'Documentos y visa C1/D', desc:'Te guiamos en cada paso — pasaporte, antecedentes de la Policia Nacional, examen medico y visa C1/D para EE.UU.' },
  { n:'05', title:'Abordas el crucero', desc:'La empresa paga tu vuelo. Te damos instrucciones de embarque y seguimiento hasta que estes a bordo.' },
];

const FAQS_EN = [
  { q:'Does Selective Crew charge Colombian candidates?', a:'No. Never. Our service is 100% free for Colombian candidates. We are a recruitment agency based in Colombia — the employer pays us, not you.' },
  { q:'What English level do I need?', a:'Intermediate to advanced English is required for sales and photography roles. You must be able to communicate confidently with international passengers.' },
  { q:'How do I get my background check in Colombia?', a:'You can get your judicial background certificate from the Policia Nacional online for free at policia.gov.co.' },
  { q:'What is the C1/D visa and how do I get it?', a:'It is the crew visa for ships departing from US ports. We guide you through the process after you receive your job offer. The visa cost is generally reimbursed onboard.' },
  { q:'Can candidates from any Colombian city apply?', a:'Yes. We recruit from Bogota, Medellin, Cali, Barranquilla, Cartagena and every city. Flights to the embarkation point are paid by the company.' },
  { q:'How long does the process take?', a:'The full process typically takes 4 to 12 weeks depending on vacancy availability and how quickly you complete your documents.' },
];

const FAQS_ES = [
  { q:'Selective Crew cobra algo a los candidatos colombianos?', a:'No. Nunca. Nuestro servicio es 100% gratuito para candidatos colombianos. Somos una agencia basada en Colombia — el empleador nos paga, no tu.' },
  { q:'Que nivel de ingles necesito?', a:'Ingles intermedio a avanzado es requerido para roles de ventas y fotografia. Debes poder comunicarte con confianza con pasajeros internacionales.' },
  { q:'Como obtengo mis antecedentes penales en Colombia?', a:'Puedes obtener tu certificado de antecedentes judiciales de la Policia Nacional en linea gratis en policia.gov.co.' },
  { q:'Que es la visa C1/D y como la tramito?', a:'Es la visa de tripulante para buques que zarpan desde puertos de EE.UU. Te guiamos despues de recibir tu oferta. El costo es generalmente reembolsado a bordo.' },
  { q:'Pueden aplicar candidatos de cualquier ciudad de Colombia?', a:'Si. Reclutamos de Bogota, Medellin, Cali, Barranquilla, Cartagena y todas las ciudades. Los vuelos son pagados por la empresa.' },
  { q:'Cuanto tiempo tarda el proceso?', a:'El proceso completo tipicamente toma entre 4 y 12 semanas segun disponibilidad de vacantes y rapidez en documentos.' },
];

const REQS_EN = [
  { icon:'📄', title:'Valid Colombian passport', desc:'You need a valid Colombian passport. If you do not have one, we guide you through the Cancilleria process. Candidates with passports advance faster.' },
  { icon:'🔍', title:'Criminal background check', desc:'Judicial background certificate from the Policia Nacional of Colombia. Available free online at policia.gov.co.' },
  { icon:'🏥', title:'Maritime medical exam', desc:'Pre-employment medical exam by an authorized doctor. We tell you where to do it in Bogota, Medellin or Cali when you advance in the process.' },
  { icon:'🇺🇸', title:'C1/D visa for the US', desc:'Required for ships departing from US ports. Processed at the US Embassy in Bogota. Cost is generally reimbursed onboard.' },
  { icon:'🗣️', title:'Intermediate to advanced English', desc:'For sales and photography roles you need confident conversational English. If your English needs work, we recommend our free preparation course.' },
  { icon:'💼', title:'Sales or retail experience', desc:'1+ year in sales, retail, hospitality or customer service. Fashion, cosmetics, electronics or jewelry experience is especially valued.' },
];

const REQS_ES = [
  { icon:'📄', title:'Pasaporte colombiano vigente', desc:'Necesitas un pasaporte colombiano valido. Si no tienes, te indicamos como tramitarlo en la Cancilleria. Los candidatos con pasaporte avanzan mas rapido.' },
  { icon:'🔍', title:'Antecedentes penales', desc:'Certificado de antecedentes judiciales de la Policia Nacional de Colombia. Se obtiene gratis en linea en policia.gov.co.' },
  { icon:'🏥', title:'Examen medico maritimo', desc:'Examen medico pre-empleo por medico autorizado. Te indicamos donde hacerlo en Bogota, Medellin o Cali cuando avances en el proceso.' },
  { icon:'🇺🇸', title:'Visa C1/D para EE.UU.', desc:'Requerida para barcos que zarpan desde puertos americanos. Se tramita en la Embajada de EE.UU. en Bogota. El costo es generalmente reembolsado a bordo.' },
  { icon:'🗣️', title:'Ingles intermedio a avanzado', desc:'Para roles de ventas y fotografia necesitas ingles conversacional con confianza. Si necesitas refuerzo, te recomendamos nuestro curso gratuito.' },
  { icon:'💼', title:'Experiencia en ventas o retail', desc:'1+ ano en ventas, retail, hospitalidad o atencion al cliente. Experiencia en moda, cosmeticos, electronicos o joyeria es especialmente valorada.' },
];

const PARTNERS = [
  { name:'Starboard Cruise Services', role_en:'Retail Sales & Management', role_es:'Ventas Retail y Gerencia', since:'2010' },
  { name:'Norwegian Cruise Line', role_en:'Photography & Sales', role_es:'Fotografia y Ventas', since:'2023' },
  { name:'Harding Retail', role_en:'Onboard Sales', role_es:'Ventas Onboard', since_en:'Active', since_es:'Activo' },
  { name:'Grand Circle Cruise Line', role_en:'Expedition Sales', role_es:'Ventas Expedicion', since:'2024' },
];

export default function CruiseJobsColombiaPage() {
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
        .co-c{max-width:960px;margin:0 auto;padding:0 24px;}
        .co-serif{font-family:'Playfair Display',Georgia,serif;}
        .co-card{background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:24px;}
        .co-btn{display:inline-flex;align-items:center;gap:8px;background:#0d9488;color:#fff;padding:13px 24px;border-radius:10px;font-size:14px;font-weight:700;font-family:inherit;text-decoration:none;border:none;cursor:pointer;}
        .co-btn-gold{background:#c9a84c!important;color:#0a1628!important;}
        .co-step{display:flex;gap:16px;padding:18px 0;border-bottom:1px solid #f1f5f9;}
        .co-step:last-child{border-bottom:none;}
        .co-snum{width:40px;height:40px;border-radius:50%;background:#0d9488;color:#fff;font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
        .co-faq{border-bottom:1px solid #f1f5f9;padding:18px 0;}
        .co-faq:last-child{border-bottom:none;}
        .co-job{display:flex;justify-content:space-between;align-items:center;padding:16px 0;border-bottom:1px solid #f1f5f9;gap:12px;flex-wrap:wrap;}
        .co-job:last-child{border-bottom:none;}
        .co-tag{display:inline-block;font-size:10px;font-weight:700;letterSpacing:1.5px;textTransform:uppercase;}
        .co-sticky{display:none;}
        @media(max-width:768px){
          .co-2{grid-template-columns:1fr!important;}
          .co-sticky{display:flex;position:fixed;bottom:0;left:0;right:0;padding:14px 20px;background:rgba(10,22,40,0.97);backdrop-filter:blur(8px);border-top:1px solid rgba(255,255,255,0.1);z-index:90;gap:10px;}
          .co-sticky a{flex:1;text-align:center;justify-content:center;font-size:13px;padding:12px;}
        }
      `}</style>

      {/* HERO */}
      <section style={{background:'linear-gradient(160deg,#0a1628 0%,#0d2240 55%,#0d4a6e 100%)',padding:'72px 24px 80px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)',backgroundSize:'60px 60px'}}/>
        <div className="co-c" style={{position:'relative'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(13,148,136,0.15)',border:'1px solid rgba(13,148,136,0.3)',borderRadius:100,padding:'5px 14px',marginBottom:20}}>
            <span style={{fontSize:16}}>🇨🇴</span>
            <span style={{fontSize:11,fontWeight:700,color:'#5eead4',letterSpacing:1.5}}>
              {es ? 'SELECTIVE CREW · COLOMBIA · DESDE 2009' : 'SELECTIVE CREW · COLOMBIA · SINCE 2009'}
            </span>
          </div>
          <h1 className="co-serif" style={{fontSize:'clamp(28px,4vw,48px)',fontWeight:700,color:'#f8f4ec',lineHeight:1.15,marginBottom:16}}>
            {es ? 'Trabajos en Cruceros' : 'Cruise Ship Jobs'}<br />
            <span style={{color:'#14b8a6'}}>{es ? 'para Colombianos' : 'for Colombian Candidates'}</span>
          </h1>
          <p style={{fontSize:16,color:'rgba(248,244,236,0.65)',lineHeight:1.8,marginBottom:32,maxWidth:560}}>
            {es
              ? 'Selective Crew es una agencia colombiana basada en Bogota. Desde 2009 hemos conectado a mas de 2,000 profesionales con empleos reales en cruceros — 100% gratuito para candidatos, siempre.'
              : 'Selective Crew is a Colombian agency based in Bogota. Since 2009 we have connected 2,000+ professionals with real cruise ship jobs — 100% free for candidates, always.'}
          </p>
          <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:36}}>
            <Link href="/apply" className="co-btn">{es ? 'Aplicar Gratis Ahora' : 'Apply Free Now'}</Link>
            <Link href="/jobs" className="co-btn" style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.2)'}}>{es ? 'Ver Posiciones' : 'View Positions'}</Link>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:12}}>
            {[
              {icon:'🇨🇴', en:'Colombian agency', es:'Agencia colombiana', sub_en:'Bogota, Colombia', sub_es:'Bogota, Colombia'},
              {icon:'💰', en:'100% Free', es:'100% Gratis', sub_en:'We never charge', sub_es:'Nunca cobramos'},
              {icon:'👥', en:'2,000+ placed', es:'2,000+ colocados', sub_en:'Since 2009', sub_es:'Desde 2009'},
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

      {/* WHY COLOMBIA */}
      <section style={{padding:'64px 24px',background:'#fff'}}>
        <div className="co-c">
          <div className="co-2" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:48,alignItems:'center'}}>
            <div>
              <span style={{display:'inline-block',fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',color:'#64748b',background:'#f1f5f9',borderRadius:100,padding:'4px 12px',marginBottom:12}}>
                {es ? 'Por que Colombia' : 'Why Colombia'}
              </span>
              <h2 className="co-serif" style={{fontSize:'clamp(22px,3vw,32px)',color:'#0a1628',marginBottom:16}}>
                {es ? 'Colombia es uno de nuestros principales mercados de reclutamiento' : 'Colombia is one of our primary recruitment markets'}
              </h2>
              <p style={{fontSize:15,color:'#64748b',lineHeight:1.8,marginBottom:20}}>
                {es
                  ? 'Los candidatos colombianos tienen caracteristicas que los empleadores de cruceros valoran: disposicion para el servicio, energia, ingles conversacional, y experiencia en retail y hospitalidad.'
                  : 'Colombian candidates have qualities cruise employers value: service orientation, energy, conversational English, and retail and hospitality experience.'}
              </p>
              {(es ? [
                'Reclutamos en todas las ciudades de Colombia',
                'Entrevistas virtuales — no necesitas viajar a Bogota',
                'Guia completa: pasaporte, antecedentes, visa C1/D',
                'Seguimiento personalizado hasta que abordas el barco',
                'Agencia colombiana — hablamos tu idioma',
              ] : [
                'We recruit from every city in Colombia',
                'Virtual interviews — no need to travel to Bogota',
                'Full guidance: passport, background check, C1/D visa',
                'Personalized support until you board the ship',
                'Colombian agency — we understand your context',
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
                {es ? 'Candidatos colombianos colocados en' : 'Colombian candidates placed with'}
              </div>
              {PARTNERS.map(p => (
                <div key={p.name} style={{padding:'14px 0',borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
                  <div style={{fontSize:13,fontWeight:700,color:'#f8f4ec'}}>{p.name}</div>
                  <div style={{fontSize:11,color:'rgba(248,244,236,0.45)',marginTop:2}}>
                    {es ? p.role_es : p.role_en} · {es ? (p.since_es || p.since) : (p.since_en || p.since)}
                  </div>
                </div>
              ))}
              <Link href="/apply" className="co-btn co-btn-gold" style={{display:'block',textAlign:'center',marginTop:20,justifyContent:'center'}}>
                {es ? 'Aplicar Ahora — Gratis' : 'Apply Now — Free'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* OPEN JOBS */}
      <section style={{padding:'64px 24px',background:'#f8fafc'}}>
        <div className="co-c" style={{maxWidth:720}}>
          <span style={{display:'inline-block',fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',color:'#64748b',background:'#f1f5f9',borderRadius:100,padding:'4px 12px',marginBottom:12}}>
            {es ? 'Vacantes Abiertas' : 'Open Positions'}
          </span>
          <h2 className="co-serif" style={{fontSize:'clamp(22px,3vw,32px)',color:'#0a1628',marginBottom:8}}>
            {es ? 'Posiciones disponibles para candidatos colombianos' : 'Open positions for Colombian candidates'}
          </h2>
          <p style={{fontSize:15,color:'#64748b',marginBottom:32,lineHeight:1.7}}>
            {es ? 'Todas las posiciones son gratuitas para aplicar. Vuelo, alojamiento y comidas incluidos.' : 'All positions are free to apply. Flight, accommodation and meals included.'}
          </p>
          <div className="co-card">
            {JOBS.map(job => (
              <div key={job.title_en} className="co-job">
                <div>
                  <div style={{fontSize:15,fontWeight:700,color:'#0a1628',marginBottom:2}}>{es ? job.title_es : job.title_en}</div>
                  <div style={{fontSize:13,color:'#0d9488',fontWeight:600,marginBottom:2}}>{job.company}</div>
                  <div style={{fontSize:13,color:'#64748b'}}>{job.salary}</div>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  {job.tag === 'HOT' && <span style={{fontSize:10,fontWeight:700,background:'#dc2626',color:'#fff',padding:'3px 10px',borderRadius:100}}>HOT</span>}
                  <Link href={job.href} className="co-btn" style={{padding:'8px 16px',fontSize:13}}>{es ? 'Aplicar' : 'Apply'}</Link>
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
        <div className="co-c">
          <span style={{display:'inline-block',fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',color:'#64748b',background:'#f1f5f9',borderRadius:100,padding:'4px 12px',marginBottom:12}}>
            {es ? 'Requisitos' : 'Requirements'}
          </span>
          <h2 className="co-serif" style={{fontSize:'clamp(22px,3vw,32px)',color:'#0a1628',marginBottom:8}}>
            {es ? 'Que necesitas para aplicar desde Colombia' : 'What you need to apply from Colombia'}
          </h2>
          <p style={{fontSize:15,color:'#64748b',marginBottom:36,lineHeight:1.7,maxWidth:600}}>
            {es ? 'No necesitas tenerlos todos listos para aplicar — te guiamos en el proceso.' : 'You do not need all of these ready to apply — we guide you through the process.'}
          </p>
          <div className="co-2" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
            {REQS.map(item => (
              <div key={item.title} className="co-card" style={{borderLeft:'3px solid #0d9488'}}>
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
        <div className="co-c" style={{maxWidth:680}}>
          <span style={{display:'inline-block',fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',color:'#64748b',background:'#f1f5f9',borderRadius:100,padding:'4px 12px',marginBottom:12}}>
            {es ? 'Proceso' : 'Process'}
          </span>
          <h2 className="co-serif" style={{fontSize:'clamp(22px,3vw,32px)',color:'#0a1628',marginBottom:8}}>
            {es ? 'Como funciona el proceso para candidatos colombianos' : 'How the process works for Colombian candidates'}
          </h2>
          <p style={{fontSize:15,color:'#64748b',marginBottom:32,lineHeight:1.7}}>
            {es ? 'Transparente, gratuito, y con acompanamiento en cada paso.' : 'Transparent, free, and with support at every step.'}
          </p>
          <div className="co-card">
            {STEPS.map(s => (
              <div key={s.n} className="co-step">
                <div className="co-snum">{s.n}</div>
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
        <div className="co-c" style={{maxWidth:720}}>
          <span style={{display:'inline-block',fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',color:'#64748b',background:'#f1f5f9',borderRadius:100,padding:'4px 12px',marginBottom:12}}>
            {es ? 'Preguntas Frecuentes' : 'FAQ'}
          </span>
          <h2 className="co-serif" style={{fontSize:'clamp(22px,3vw,32px)',color:'#0a1628',marginBottom:36}}>
            {es ? 'Preguntas frecuentes de candidatos colombianos' : 'Frequently asked questions from Colombian candidates'}
          </h2>
          <div className="co-card">
            {FAQS.map(faq => (
              <div key={faq.q} className="co-faq">
                <div style={{fontSize:15,fontWeight:700,color:'#0a1628',marginBottom:8}}>{faq.q}</div>
                <div style={{fontSize:14,color:'#64748b',lineHeight:1.7}}>{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRAINING */}
      <section style={{padding:'48px 24px',background:'#f8fafc'}}>
        <div className="co-c" style={{maxWidth:720}}>
          <div style={{background:'linear-gradient(135deg,#0a1628,#1a3a5c)',borderRadius:16,padding:'32px 28px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:20}}>
            <div>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:2,color:'#c9a84c',textTransform:'uppercase',marginBottom:8}}>{es ? 'Curso Gratuito' : 'Free Course'}</div>
              <div style={{fontSize:18,fontFamily:"'Playfair Display',serif",fontWeight:700,color:'#f8f4ec',marginBottom:6}}>
                {es ? 'Tu ingles o experiencia necesita refuerzo?' : 'Need to strengthen your English or experience?'}
              </div>
              <div style={{fontSize:13,color:'rgba(248,244,236,0.6)'}}>
                {es ? 'Toma nuestro curso gratuito de 25 minutos y mejora tus posibilidades de ser seleccionado.' : 'Take our free 25-minute course and improve your chances of being selected.'}
              </div>
            </div>
            <Link href="/training" className="co-btn co-btn-gold" style={{whiteSpace:'nowrap'}}>
              {es ? 'Ver Curso Gratuito' : 'View Free Course'}
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{padding:'72px 24px',background:'#0a1628',textAlign:'center'}}>
        <div className="co-c" style={{maxWidth:580}}>
          <span style={{fontSize:24,display:'block',marginBottom:16}}>🇨🇴</span>
          <h2 className="co-serif" style={{fontSize:'clamp(22px,3.5vw,36px)',color:'#f8f4ec',marginBottom:12}}>
            {es ? 'Listo para aplicar desde Colombia?' : 'Ready to apply from Colombia?'}
          </h2>
          <p style={{fontSize:15,color:'rgba(248,244,236,0.55)',lineHeight:1.8,marginBottom:32}}>
            {es ? 'Gratis para aplicar. Agencia colombiana. Respuesta en 48 horas por WhatsApp.' : 'Free to apply. Colombian agency. Response within 48 hours via WhatsApp.'}
          </p>
          <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/apply" className="co-btn" style={{background:'#0d9488'}}>{es ? 'Aplicar Gratis Ahora' : 'Apply Free Now'}</Link>
            <Link href="/jobs" className="co-btn" style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)',color:'rgba(248,244,236,0.7)'}}>{es ? 'Ver Posiciones' : 'View Positions'}</Link>
          </div>
          <div style={{marginTop:24,display:'flex',justifyContent:'center',flexWrap:'wrap',gap:20}}>
            {(es ? ['100% gratuito para candidatos','Agencia basada en Colombia','Respuesta en 48 horas'] : ['100% free for candidates','Agency based in Colombia','Response within 48 hours']).map(f => (
              <span key={f} style={{fontSize:12,color:'rgba(248,244,236,0.35)',display:'flex',alignItems:'center',gap:6}}><span style={{color:'#14b8a6'}}>✓</span> {f}</span>
            ))}
          </div>
          <div style={{marginTop:28,paddingTop:20,borderTop:'1px solid rgba(255,255,255,0.07)'}}>
            <a href="https://wa.me/573188474058" target="_blank" rel="noopener noreferrer" style={{fontSize:13,color:'rgba(248,244,236,0.4)',textDecoration:'none'}}>
              {es ? 'Preguntas? WhatsApp: +57 318 847 4058' : 'Questions? WhatsApp: +57 318 847 4058'}
            </a>
          </div>
        </div>
      </section>

      <div className="co-sticky">
        <Link href="/apply" className="co-btn" style={{background:'#0d9488'}}>{es ? 'Aplicar Gratis' : 'Apply Free'}</Link>
        <Link href="/jobs" className="co-btn" style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.2)',color:'rgba(248,244,236,0.7)',flex:1,textAlign:'center',justifyContent:'center',fontSize:13,padding:'12px'}}>{es ? 'Ver Posiciones' : 'View Positions'}</Link>
      </div>
    </>
  );
}