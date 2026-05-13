'use client';
import Link from 'next/link';
import { useLang } from '../../lib/LanguageContext';

const schema = {
  '@context': 'https://schema.org',
  '@type': 'JobPosting',
  title: 'Cruise Ship Jobs for Dominican Candidates',
  description: 'Selective Crew recruits Ecuadorian candidates for cruise ship retail sales, photography, and management roles. Free recruitment since 2009.',
  datePosted: '2026-04-01',
  validThrough: '2026-12-31',
  employmentType: 'CONTRACTOR',
  hiringOrganization: { '@type': 'Organization', name: 'Selective Crew', sameAs: 'https://selectivecrew.com' },
  applicantLocationRequirements: { '@type': 'Country', name: 'Dominican Republic' },
  baseSalary: { '@type': 'MonetaryAmount', currency: 'USD', value: { '@type': 'QuantitativeValue', minValue: 900, maxValue: 2000, unitText: 'MONTH' } },
};

const JOBS = [
  { title_en:'Fast Track Assistant Manager', title_es:'Fast Track Asistente de Gerente', company:'Starboard Cruise Services', salary:'$1,500/mo training + $1,200/mo + commissions as ASM', tag:'HOT', href:'/fast-track-manager' },
  { title_en:'Retail Sales Associate', title_es:'Asociado de Ventas', company:'Starboard Cruise Services', salary:'$900/mo + commissions', href:'/cruise-ship-retail-sales-career' },
  { title_en:'Cruise Ship Photographer', title_es:'Fotografo de Crucero', company:'Norwegian Cruise Line', salary:'$900-$1,400/mo + commissions', href:'/cruise-ship-photographer-jobs' },
  { title_en:'Fine Jewelry Specialist', title_es:'Especialista en Joyeria Fina', company:'Starboard Cruise Services', salary:'$1,000-$1,400/mo + commissions', href:'/apply' },
];

const DATA = {
  flag: '🇩🇴',
  country_en: 'Dominican Republic',
  country_es: 'Republica Dominicana',
  demonym_en: 'Dominican',
  demonym_es: 'dominicano',
  demonym_es_pl: 'dominicanos',
  cities_en: 'Santo Domingo & nationwide',
  cities_es: 'Santo Domingo y todo el pais',
  cities_full_en: 'Santo Domingo and all cities',
  cities_full_es: 'Santo Domingo y todas las ciudades',
  bg_doc_en: 'Procuraduria General de la Republica Dominicana',
  bg_doc_es: 'Procuraduria General de la Republica Dominicana',
  embassy_en: 'US Embassy in Santo Domingo',
  embassy_es: 'Embajada de EE.UU. en Santo Domingo',
  sub_en: 'We recruit from Santo Domingo and all of the Dominican Republic. Direct hiring with Starboard and NCL.',
  sub_es: 'Conectamos candidatos dominicanos con empleos reales en cruceros desde 2009. 100% gratuito, siempre.',
};

const STEPS_EN = [
  { n:'01', title:'Apply free online', desc:'Complete the short form at selectivecrew.com/apply. Only name, WhatsApp, email and country needed in Step 1.' },
  { n:'02', title:'We review your profile', desc:'Our team reviews your sales experience, English level and availability within 48 hours.' },
  { n:'03', title:'Video interview', desc:'If your profile qualifies, we contact you via WhatsApp to schedule a video interview.' },
  { n:'04', title:'Documents and C1/D visa', desc:'We guide you through passport, background check from the Ministerio del Interior, medical exam, and C1/D visa.' },
  { n:'05', title:'You board the ship', desc:'The company pays your flight. We give you embarkation instructions and follow up until you are on board.' },
];
const STEPS_ES = [
  { n:'01', title:'Aplica gratis en linea', desc:'Completa el formulario en selectivecrew.com/apply. Solo nombre, WhatsApp, email y pais en el primer paso.' },
  { n:'02', title:'Revisamos tu perfil', desc:'Nuestro equipo revisa tu experiencia, nivel de ingles y disponibilidad dentro de 48 horas.' },
  { n:'03', title:'Entrevista por video', desc:'Si tu perfil califica, te contactamos por WhatsApp para coordinar una entrevista de video.' },
  { n:'04', title:'Documentos y visa C1/D', desc:'Te guiamos con pasaporte, antecedentes de la Procuraduria General, examen medico y visa C1/D.' },
  { n:'05', title:'Abordas el crucero', desc:'La empresa paga tu vuelo. Te damos instrucciones de embarque y seguimiento hasta que estes a bordo.' },
];
const FAQS_EN = [
  { q:'Does Selective Crew charge Ecuadorian candidates?', a:'No. Never. Our service is 100% free for Ecuadorian candidates. The employer pays us, not you.' },
  { q:'What English level do I need?', a:'Intermediate to advanced English is required for sales and photography roles. You must communicate confidently with international passengers.' },
  { q:'How do I get my background check in Ecuador?', a:'You can obtain your certificate from the Ministerio del Interior in Ecuador online or in person at their offices.' },
  { q:'What is the C1/D visa?', a:'It is the crew visa for ships departing from US ports. We guide you through the process after your job offer. Cost is generally reimbursed onboard.' },
  { q:'Can candidates from Guayaquil and Quito both apply?', a:'Yes. We recruit from Santo Domingo, Santiago y La Romana and every city in Ecuador. Flights to embarkation are paid by the company.' },
  { q:'How long does the process take?', a:'Typically 4 to 12 weeks depending on vacancy availability and how quickly you complete your documents.' },
];
const FAQS_ES = [
  { q:'Selective Crew cobra algo a los candidatos ecuatorianos?', a:'No. Nunca. Nuestro servicio es 100% gratuito para candidatos ecuatorianos. El empleador nos paga, no tu.' },
  { q:'Que nivel de ingles necesito?', a:'Ingles intermedio a avanzado para roles de ventas y fotografia. Debes poder comunicarte con confianza con pasajeros internacionales.' },
  { q:'Como obtengo mis antecedentes penales en Ecuador?', a:'Puedes obtener tu certificado del Procuraduria General de la Republica Dominicana en linea o presencialmente en sus oficinas.' },
  { q:'Que es la visa C1/D?', a:'Es la visa de tripulante para buques desde puertos de EE.UU. Te guiamos despues de tu oferta. El costo es generalmente reembolsado a bordo.' },
  { q:'Pueden aplicar candidatos de Guayaquil y Quito?', a:'Si. Reclutamos de Santo Domingo, Santiago y La Romana y todas las ciudades. Los vuelos son pagados por la empresa.' },
  { q:'Cuanto tiempo tarda el proceso?', a:'Tipicamente entre 4 y 12 semanas segun disponibilidad de vacantes y rapidez en documentos.' },
];
const REQS_EN = [
  { icon:'📄', title:'Valid Ecuadorian passport', desc:'You need a valid Ecuadorian passport. Candidates with valid passports advance faster in the process.' },
  { icon:'🔍', title:'Background check', desc:'Certificate from the Procuraduria General of Dominican Republic. Available online or in person.' },
  { icon:'🏥', title:'Maritime medical exam', desc:'Pre-employment medical by an authorized doctor. We guide you on where to complete it when you advance.' },
  { icon:'🇺🇸', title:'C1/D visa for the US', desc:'Required for ships from US ports. Processed at the US Embassy in Quito. Cost generally reimbursed onboard.' },
  { icon:'🗣️', title:'Intermediate to advanced English', desc:'Confident conversational English for guest-facing roles. Our free training course can help you prepare.' },
  { icon:'💼', title:'Sales or retail experience', desc:'1+ year in sales, retail, hospitality or customer service. Cosmetics, fashion or electronics experience valued.' },
];
const REQS_ES = [
  { icon:'📄', title:'Pasaporte ecuatoriano vigente', desc:'Necesitas un pasaporte ecuatoriano valido. Los candidatos con pasaporte avanzan mas rapido en el proceso.' },
  { icon:'🔍', title:'Antecedentes penales', desc:'Certificado del Procuraduria General de la Republica Dominicana. Disponible en linea o presencialmente.' },
  { icon:'🏥', title:'Examen medico maritimo', desc:'Examen medico pre-empleo por medico autorizado. Te indicamos donde realizarlo cuando avances.' },
  { icon:'🇺🇸', title:'Visa C1/D para EE.UU.', desc:'Requerida para barcos desde puertos americanos. Se tramita en la Embajada de EE.UU. en Quito. Costo generalmente reembolsado.' },
  { icon:'🗣️', title:'Ingles intermedio a avanzado', desc:'Ingles conversacional con confianza para roles con clientes. Nuestro curso gratuito puede ayudarte.' },
  { icon:'💼', title:'Experiencia en ventas o retail', desc:'1+ ano en ventas, retail, hospitalidad o atencion al cliente. Experiencia en cosmeticos, moda o electronicos es valorada.' },
];

export default function CruiseJobsDominicanRepublicPage() {
  const { lang } = useLang();
  const es = lang === 'es';
  const STEPS = es ? STEPS_ES : STEPS_EN;
  const FAQS = es ? FAQS_ES : FAQS_EN;
  const REQS = es ? REQS_ES : REQS_EN;
  const d = DATA;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        .cc{max-width:960px;margin:0 auto;padding:0 24px;}
        .cc-serif{font-family:'Playfair Display',Georgia,serif;}
        .cc-card{background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:24px;}
        .cc-btn{display:inline-flex;align-items:center;gap:8px;background:#0d9488;color:#fff;padding:13px 24px;border-radius:10px;font-size:14px;font-weight:700;font-family:inherit;text-decoration:none;border:none;cursor:pointer;}
        .cc-btn-gold{background:#c9a84c!important;color:#0a1628!important;}
        .cc-step{display:flex;gap:16px;padding:18px 0;border-bottom:1px solid #f1f5f9;}
        .cc-step:last-child{border-bottom:none;}
        .cc-snum{width:40px;height:40px;border-radius:50%;background:#0d9488;color:#fff;font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
        .cc-faq{border-bottom:1px solid #f1f5f9;padding:18px 0;}
        .cc-faq:last-child{border-bottom:none;}
        .cc-job{display:flex;justify-content:space-between;align-items:center;padding:16px 0;border-bottom:1px solid #f1f5f9;gap:12px;flex-wrap:wrap;}
        .cc-job:last-child{border-bottom:none;}
        .cc-sticky{display:none;}
        @media(max-width:768px){
          .cc-2{grid-template-columns:1fr!important;}
          .cc-sticky{display:flex;position:fixed;bottom:0;left:0;right:0;padding:14px 20px;background:rgba(10,22,40,0.97);backdrop-filter:blur(8px);border-top:1px solid rgba(255,255,255,0.1);z-index:90;gap:10px;}
          .cc-sticky a{flex:1;text-align:center;justify-content:center;font-size:13px;padding:12px;}
        }
      `}</style>

      <section style={{background:'linear-gradient(160deg,#0a1628 0%,#0d2240 55%,#0d4a6e 100%)',padding:'72px 24px 80px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)',backgroundSize:'60px 60px'}}/>
        <div className="cc" style={{position:'relative'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(13,148,136,0.15)',border:'1px solid rgba(13,148,136,0.3)',borderRadius:100,padding:'5px 14px',marginBottom:20}}>
            <span style={{fontSize:16}}>{d.flag}</span>
            <span style={{fontSize:11,fontWeight:700,color:'#5eead4',letterSpacing:1.5}}>{es ? `SELECTIVE CREW · ${d.country_es.toUpperCase()} · DESDE 2009` : `SELECTIVE CREW · ${d.country_en.toUpperCase()} · SINCE 2009`}</span>
          </div>
          <h1 className="cc-serif" style={{fontSize:'clamp(28px,4vw,48px)',fontWeight:700,color:'#f8f4ec',lineHeight:1.15,marginBottom:16}}>
            {es ? 'Trabajos en Cruceros' : 'Cruise Ship Jobs'}<br />
            <span style={{color:'#14b8a6'}}>{es ? `para ${d.country_es}nos` : `for ${d.demonym_en} Candidates`}</span>
          </h1>
          <p style={{fontSize:16,color:'rgba(248,244,236,0.65)',lineHeight:1.8,marginBottom:32,maxWidth:560}}>{es ? d.sub_es : d.sub_en}</p>
          <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:36}}>
            <Link href="/apply" className="cc-btn">{es ? 'Aplicar Gratis Ahora' : 'Apply Free Now'}</Link>
            <Link href="/jobs" className="cc-btn" style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.2)'}}>{es ? 'Ver Posiciones' : 'View Positions'}</Link>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:12}}>
            {[
              {icon:d.flag, en:`Recruiting in ${d.country_en}`, es:`Reclutamos en ${d.country_es}`, sub_en:d.cities_en, sub_es:d.cities_es},
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

      <section style={{padding:'64px 24px',background:'#f8fafc'}}>
        <div className="cc" style={{maxWidth:720}}>
          <span style={{display:'inline-block',fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',color:'#64748b',background:'#f1f5f9',borderRadius:100,padding:'4px 12px',marginBottom:12}}>{es ? 'Vacantes Abiertas' : 'Open Positions'}</span>
          <h2 className="cc-serif" style={{fontSize:'clamp(22px,3vw,32px)',color:'#0a1628',marginBottom:8}}>{es ? `Posiciones disponibles para candidatos ${d.demonym_es_pl}` : `Open positions for ${d.demonym_en} candidates`}</h2>
          <p style={{fontSize:15,color:'#64748b',marginBottom:32,lineHeight:1.7}}>{es ? 'Todas las posiciones son gratuitas para aplicar. Vuelo, alojamiento y comidas incluidos.' : 'All positions are free to apply. Flight, accommodation and meals included.'}</p>
          <div className="cc-card">
            {JOBS.map(job => (
              <div key={job.title_en} className="cc-job">
                <div>
                  <div style={{fontSize:15,fontWeight:700,color:'#0a1628',marginBottom:2}}>{es ? job.title_es : job.title_en}</div>
                  <div style={{fontSize:13,color:'#0d9488',fontWeight:600,marginBottom:2}}>{job.company}</div>
                  <div style={{fontSize:13,color:'#64748b'}}>{job.salary}</div>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  {job.tag === 'HOT' && <span style={{fontSize:10,fontWeight:700,background:'#dc2626',color:'#fff',padding:'3px 10px',borderRadius:100}}>HOT</span>}
                  <Link href={job.href} className="cc-btn" style={{padding:'8px 16px',fontSize:13}}>{es ? 'Aplicar' : 'Apply'}</Link>
                </div>
              </div>
            ))}
          </div>
          <div style={{marginTop:16,textAlign:'center'}}><Link href="/jobs" style={{fontSize:14,color:'#0d9488',fontWeight:600,textDecoration:'none'}}>{es ? 'Ver todas las posiciones' : 'View all positions'}</Link></div>
        </div>
      </section>

      <section style={{padding:'64px 24px',background:'#fff'}}>
        <div className="cc">
          <span style={{display:'inline-block',fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',color:'#64748b',background:'#f1f5f9',borderRadius:100,padding:'4px 12px',marginBottom:12}}>{es ? 'Requisitos' : 'Requirements'}</span>
          <h2 className="cc-serif" style={{fontSize:'clamp(22px,3vw,32px)',color:'#0a1628',marginBottom:8}}>{es ? `Que necesitas para aplicar desde ${d.country_es}` : `What you need to apply from ${d.country_en}`}</h2>
          <p style={{fontSize:15,color:'#64748b',marginBottom:36,lineHeight:1.7,maxWidth:600}}>{es ? 'No necesitas tenerlos todos listos — te guiamos en el proceso.' : 'You do not need all of these ready — we guide you through the process.'}</p>
          <div className="cc-2" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
            {REQS.map(item => (
              <div key={item.title} className="cc-card" style={{borderLeft:'3px solid #0d9488'}}>
                <div style={{fontSize:24,marginBottom:10}}>{item.icon}</div>
                <div style={{fontSize:14,fontWeight:700,color:'#0a1628',marginBottom:6}}>{item.title}</div>
                <div style={{fontSize:13,color:'#64748b',lineHeight:1.65}}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{padding:'64px 24px',background:'#f8fafc'}}>
        <div className="cc" style={{maxWidth:680}}>
          <span style={{display:'inline-block',fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',color:'#64748b',background:'#f1f5f9',borderRadius:100,padding:'4px 12px',marginBottom:12}}>{es ? 'Proceso' : 'Process'}</span>
          <h2 className="cc-serif" style={{fontSize:'clamp(22px,3vw,32px)',color:'#0a1628',marginBottom:8}}>{es ? `Como funciona el proceso para candidatos ${d.demonym_es_pl}` : `How the process works for ${d.demonym_en} candidates`}</h2>
          <p style={{fontSize:15,color:'#64748b',marginBottom:32,lineHeight:1.7}}>{es ? 'Transparente, gratuito, y con acompanamiento en cada paso.' : 'Transparent, free, and with support at every step.'}</p>
          <div className="cc-card">
            {STEPS.map(s => (
              <div key={s.n} className="cc-step">
                <div className="cc-snum">{s.n}</div>
                <div><div style={{fontSize:15,fontWeight:700,color:'#0a1628',marginBottom:4}}>{s.title}</div><div style={{fontSize:13,color:'#64748b',lineHeight:1.65}}>{s.desc}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{padding:'64px 24px',background:'#fff'}}>
        <div className="cc" style={{maxWidth:720}}>
          <span style={{display:'inline-block',fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',color:'#64748b',background:'#f1f5f9',borderRadius:100,padding:'4px 12px',marginBottom:12}}>{es ? 'Preguntas Frecuentes' : 'FAQ'}</span>
          <h2 className="cc-serif" style={{fontSize:'clamp(22px,3vw,32px)',color:'#0a1628',marginBottom:36}}>{es ? `Preguntas frecuentes de candidatos ${d.demonym_es_pl}` : `FAQ for ${d.demonym_en} candidates`}</h2>
          <div className="cc-card">
            {FAQS.map(faq => (
              <div key={faq.q} className="cc-faq">
                <div style={{fontSize:15,fontWeight:700,color:'#0a1628',marginBottom:8}}>{faq.q}</div>
                <div style={{fontSize:14,color:'#64748b',lineHeight:1.7}}>{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{padding:'48px 24px',background:'#f8fafc'}}>
        <div className="cc" style={{maxWidth:720}}>
          <div style={{background:'linear-gradient(135deg,#0a1628,#1a3a5c)',borderRadius:16,padding:'32px 28px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:20}}>
            <div>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:2,color:'#c9a84c',textTransform:'uppercase',marginBottom:8}}>{es ? 'Curso Gratuito' : 'Free Course'}</div>
              <div style={{fontSize:18,fontFamily:"'Playfair Display',serif",fontWeight:700,color:'#f8f4ec',marginBottom:6}}>{es ? 'Tu ingles o experiencia necesita refuerzo?' : 'Need to strengthen your English or experience?'}</div>
              <div style={{fontSize:13,color:'rgba(248,244,236,0.6)'}}>{es ? 'Toma nuestro curso gratuito de 25 minutos.' : 'Take our free 25-minute course and improve your chances.'}</div>
            </div>
            <Link href="/training" className="cc-btn cc-btn-gold" style={{whiteSpace:'nowrap'}}>{es ? 'Ver Curso Gratuito' : 'View Free Course'}</Link>
          </div>
        </div>
      </section>

      <section style={{padding:'72px 24px',background:'#0a1628',textAlign:'center'}}>
        <div className="cc" style={{maxWidth:580}}>
          <span style={{fontSize:24,display:'block',marginBottom:16}}>{d.flag}</span>
          <h2 className="cc-serif" style={{fontSize:'clamp(22px,3.5vw,36px)',color:'#f8f4ec',marginBottom:12}}>{es ? `Listo para aplicar desde ${d.country_es}?` : `Ready to apply from ${d.country_en}?`}</h2>
          <p style={{fontSize:15,color:'rgba(248,244,236,0.55)',lineHeight:1.8,marginBottom:32}}>{es ? 'Gratis para aplicar. Respuesta en 48 horas por WhatsApp.' : 'Free to apply. Response within 48 hours via WhatsApp.'}</p>
          <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/apply" className="cc-btn" style={{background:'#0d9488'}}>{es ? 'Aplicar Gratis Ahora' : 'Apply Free Now'}</Link>
            <Link href="/jobs" className="cc-btn" style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)',color:'rgba(248,244,236,0.7)'}}>{es ? 'Ver Posiciones' : 'View Positions'}</Link>
          </div>
          <div style={{marginTop:24,display:'flex',justifyContent:'center',flexWrap:'wrap',gap:20}}>
            {(es ? ['100% gratuito','Reclutamos en todo el pais','Respuesta en 48 horas'] : ['100% free','Recruiting nationwide','Response within 48 hours']).map(f => (
              <span key={f} style={{fontSize:12,color:'rgba(248,244,236,0.35)',display:'flex',alignItems:'center',gap:6}}><span style={{color:'#14b8a6'}}>✓</span> {f}</span>
            ))}
          </div>
          <div style={{marginTop:28,paddingTop:20,borderTop:'1px solid rgba(255,255,255,0.07)'}}>
            <a href="https://wa.me/573188474058" target="_blank" rel="noopener noreferrer" style={{fontSize:13,color:'rgba(248,244,236,0.4)',textDecoration:'none'}}>{es ? 'Preguntas? WhatsApp: +57 318 847 4058' : 'Questions? WhatsApp: +57 318 847 4058'}</a>
          </div>
        </div>
      </section>
      <div className="cc-sticky">
        <Link href="/apply" className="cc-btn" style={{background:'#0d9488'}}>{es ? 'Aplicar Gratis' : 'Apply Free'}</Link>
        <Link href="/jobs" className="cc-btn" style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.2)',color:'rgba(248,244,236,0.7)',flex:1,textAlign:'center',justifyContent:'center',fontSize:13,padding:'12px'}}>{es ? 'Ver Posiciones' : 'View Positions'}</Link>
      </div>
    </>
  );
}