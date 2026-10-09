'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useLang } from '../../lib/LanguageContext';

const navy = "#0a1628";
const teal = "#0d9488";
const gold = "#c9a84c";
const red  = "#dc2626";

const JOBS = [
  {
    title_en: 'Fast Track Assistant Manager',
    title_es: 'Fast Track Asistente de Gerente',
    company: 'Starboard Cruise Services',
    location_en: 'Worldwide', location_es: 'Todo el Mundo',
    duration_en: '4-8 Months', duration_es: '4-8 Meses',
    salary_en: '$1,200-$2,000/mo + commissions',
    salary_es: '$1,200-$2,000/mes + comisiones',
    category_en: 'Retail Management', category_es: 'Gerencia Retail',
    applyLink: '/fast-track-manager',
    hot: true, hotColor: red,
    badge_en: 'HOT ROLE', badge_es: 'EMPLEO CALIENTE',
    spotsLeft: 13,
    highlight_en: 'Requires retail team leadership of 10+ people',
    highlight_es: 'Requiere liderazgo de equipos de retail de 10+ personas',
    tags_en: ['Leadership','Sales targets','Commission-based'],
    tags_es: ['Liderazgo','Metas de ventas','Basado en comisiones'],
  },
  {
    title_en: 'Duty Free Sales Associate — Japanese Speakers',
    title_es: 'Asociado Duty Free — Hablantes de Japones',
    company: 'Starboard Cruise Services',
    location_en: 'Asia / Pacific', location_es: 'Asia / Pacifico',
    duration_en: '6 Months', duration_es: '6 Meses',
    salary_en: '$900/mo + commissions',
    salary_es: '$900/mes + comisiones',
    category_en: 'Retail', category_es: 'Ventas',
    applyLink: '/japanese-speakers',
    hot: true, hotColor: '#1a56db',
    badge_en: 'JAPANESE SPEAKERS', badge_es: 'HABLANTES DE JAPONES',
    spotsLeft: 12,
    highlight_en: 'Conversational to fluent Japanese required',
    highlight_es: 'Se requiere japones conversacional a fluido',
    tags_en: ['Duty-free sales','Japanese required','Asia routes'],
    tags_es: ['Ventas duty-free','Japones requerido','Rutas Asia'],
  },
  {
    title_en: 'Retail Sales Associate',
    title_es: 'Asociado de Ventas',
    company: 'Starboard Cruise Services',
    location_en: 'Worldwide', location_es: 'Todo el Mundo',
    duration_en: '6 Months', duration_es: '6 Meses',
    salary_en: '$900/mo + performance commissions',
    salary_es: '$900/mes + comisiones por desempeno',
    category_en: 'Retail', category_es: 'Ventas',
    applyLink: '/cruise-ship-retail-sales-career',
    tags_en: ['Guest-facing sales','Duty-free','Commission-based'],
    tags_es: ['Ventas al cliente','Duty-free','Basado en comisiones'],
  },
  {
    title_en: 'Fine Jewelry Specialist',
    title_es: 'Especialista en Joyeria Fina',
    company: 'Starboard Cruise Services',
    location_en: 'Worldwide', location_es: 'Todo el Mundo',
    duration_en: '6 Months', duration_es: '6 Meses',
    salary_en: '$1,000-$1,400/mo + commissions',
    salary_es: '$1,000-$1,400/mes + comisiones',
    category_en: 'Luxury Retail', category_es: 'Retail de Lujo',
    applyLink: '/apply',
    tags_en: ['Luxury sales','Jewelry & watches','High-ticket items'],
    tags_es: ['Ventas de lujo','Joyeria y relojes','Articulos de alto valor'],
  },
  {
    title_en: 'Assistant Retail Sales Manager',
    title_es: 'Asistente de Gerente de Ventas',
    company: 'Starboard Cruise Services',
    location_en: 'Worldwide', location_es: 'Todo el Mundo',
    duration_en: '6-8 Months', duration_es: '6-8 Meses',
    salary_en: '$1,100-$1,600/mo + commissions',
    salary_es: '$1,100-$1,600/mes + comisiones',
    category_en: 'Retail Management', category_es: 'Gerencia Retail',
    applyLink: '/apply',
    tags_en: ['Team leadership','Sales targets','Management track'],
    tags_es: ['Liderazgo','Metas de ventas','Carrera gerencial'],
  },
  {
    title_en: 'Cruise Ship Photographer',
    title_es: 'Fotografo de Crucero',
    company: 'Norwegian Cruise Line',
    location_en: 'Worldwide', location_es: 'Todo el Mundo',
    duration_en: '4-6 Months', duration_es: '4-6 Meses',
    salary_en: '$900-$1,400/mo + commissions',
    salary_es: '$900-$1,400/mes + comisiones',
    category_en: 'Photography', category_es: 'Fotografia',
    applyLink: '/cruise-ship-photographer-jobs',
    tags_en: ['Portrait photography','Gallery sales','Guest-facing'],
    tags_es: ['Fotografia de retrato','Ventas de galeria','Atencion al cliente'],
  },
];

const CATEGORIES = ['All', 'Retail', 'Retail Management', 'Luxury Retail', 'Photography'];
const CATEGORIES_ES = ['Todos', 'Ventas', 'Gerencia Retail', 'Retail de Lujo', 'Fotografia'];

export default function JobsClient() {
  const { lang } = useLang();
  const es = lang === 'es';
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All' || filter === 'Todos'
    ? JOBS
    : JOBS.filter(j => j.category_en === filter || j.category_es === filter);

  return (
    <div style={{ background:'#f8fafc', minHeight:'100vh', fontFamily:"'DM Sans','Segoe UI',sans-serif", color:navy }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        .job-card { background:#fff; border:1px solid #e2e8f0; border-radius:16px; padding:24px; transition:all 0.2s; }
        .job-card:hover { transform:translateY(-2px); box-shadow:0 12px 32px rgba(10,22,40,0.1); border-color:#0d9488; }
        .filter-btn { padding:7px 16px; border-radius:100px; font-size:12px; font-weight:600; cursor:pointer; border:1px solid #e2e8f0; background:#fff; color:#64748b; transition:all 0.2s; font-family:inherit; }
        .filter-btn.active { background:#0a1628; color:#fff; border-color:#0a1628; }
        .filter-btn:hover:not(.active) { border-color:#0d9488; color:#0d9488; }
        @media(max-width:640px) { .job-inner { flex-direction:column !important; } .job-cta { width:100% !important; } }
      `}</style>

      {/* Hero */}
      <section style={{ background:'linear-gradient(160deg,#0a1628 0%,#0d2240 55%,#0d4a6e 100%)', padding:'64px 24px 56px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)', backgroundSize:'60px 60px' }} />
        <div style={{ maxWidth:800, margin:'0 auto', position:'relative' }}>
          <Link href="/" style={{ color:'rgba(248,244,236,0.5)', fontSize:13, textDecoration:'none', display:'inline-block', marginBottom:20 }}>
            {'<-'} {es ? 'Volver al Inicio' : 'Back to Home'}
          </Link>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(13,148,136,0.15)', border:'1px solid rgba(13,148,136,0.3)', borderRadius:100, padding:'5px 14px', marginBottom:16 }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#14b8a6' }} />
            <span style={{ fontSize:11, fontWeight:700, color:'#5eead4', letterSpacing:1.5 }}>
              {es ? 'CONTRATACION DIRECTA · GRATIS' : 'DIRECT HIRING · FREE TO APPLY'}
            </span>
          </div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(26px,4vw,40px)', fontWeight:700, color:'#f8f4ec', marginBottom:12, lineHeight:1.2 }}>
            {es ? 'Posiciones Abiertas en Cruceros' : 'Open Cruise Ship Positions'}
          </h1>
          <p style={{ fontSize:15, color:'rgba(248,244,236,0.6)', marginBottom:24, maxWidth:560, lineHeight:1.7 }}>
            {es
              ? 'Roles de ventas, fotografia y gerencia en las principales lineas de cruceros. Aplicacion 100% gratuita — siempre.'
              : 'Sales, photography, and management roles with leading cruise lines. 100% free to apply — always.'}
          </p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:16 }}>
            {[
              es ? '100% Gratis para candidatos' : '100% Free for candidates',
              es ? 'Contratacion directa' : 'Direct hiring',
              es ? '2,000+ colocados desde 2009' : '2,000+ placed since 2009',
            ].map(f => (
              <span key={f} style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'rgba(248,244,236,0.5)' }}>
                <span style={{ color:'#14b8a6' }}>✓</span> {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Filter tabs */}
      <div style={{ background:'#fff', borderBottom:'1px solid #e2e8f0', padding:'16px 24px', position:'sticky', top:68, zIndex:50 }}>
        <div style={{ maxWidth:800, margin:'0 auto', display:'flex', gap:8, flexWrap:'wrap' }}>
          {(es ? CATEGORIES_ES : CATEGORIES).map((cat,i) => (
            <button key={cat} className={`filter-btn${filter === cat || filter === CATEGORIES[i] ? ' active' : ''}`}
              onClick={() => setFilter(es ? CATEGORIES_ES[i] : CATEGORIES[i])}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs list */}
      <section style={{ padding:'40px 24px 64px' }}>
        <div style={{ maxWidth:800, margin:'0 auto', display:'flex', flexDirection:'column', gap:16 }}>

          {filtered.map((job, i) => job.hot ? (
            /* Hot job card */
            <div key={i} style={{ background:`linear-gradient(145deg,#0a1628,#112240)`, borderRadius:16, overflow:'hidden', border:`1.5px solid ${job.hotColor}40`, boxShadow:`0 8px 32px ${job.hotColor}15` }}>
              <div style={{ background:job.hotColor, padding:'8px 20px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:11, fontWeight:800, color:'#fff', letterSpacing:1.5, textTransform:'uppercase' }}>
                  {es ? job.badge_es : job.badge_en}
                </span>
                <span style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.9)', background:'rgba(0,0,0,0.2)', padding:'2px 10px', borderRadius:100 }}>
                  {job.spotsLeft} {es ? 'cupos' : 'spots'}
                </span>
              </div>
              <div className="job-inner" style={{ padding:'22px', display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:16 }}>
                <div style={{ flex:1 }}>
                  <h3 style={{ fontSize:18, fontWeight:700, color:'#f8f4ec', marginBottom:4, fontFamily:"'Playfair Display',serif" }}>{es ? job.title_es : job.title_en}</h3>
                  <p style={{ fontSize:13, color:'rgba(248,244,236,0.5)', marginBottom:12 }}>{job.company}</p>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:12 }}>
                    {(es ? job.tags_es : job.tags_en).map(tag => (
                      <span key={tag} style={{ fontSize:11, background:'rgba(255,255,255,0.08)', color:'rgba(248,244,236,0.6)', padding:'3px 10px', borderRadius:100 }}>{tag}</span>
                    ))}
                  </div>
                  <div style={{ fontSize:14, fontWeight:700, color:gold, marginBottom:4 }}>{es ? job.salary_es : job.salary_en}</div>
                  <div style={{ fontSize:12, color:'rgba(248,244,236,0.4)' }}>
                    {es ? job.location_es : job.location_en} · {es ? job.duration_es : job.duration_en} · {es ? 'Vuelo incluido' : 'Flight included'}
                  </div>
                  {job.highlight_en && (
                    <div style={{ marginTop:12, background:`${job.hotColor}15`, border:`1px solid ${job.hotColor}30`, borderRadius:8, padding:'8px 12px' }}>
                      <p style={{ fontSize:12, color:`${job.hotColor === red ? '#fca5a5' : '#93c5fd'}`, fontWeight:600 }}>
                        {es ? job.highlight_es : job.highlight_en}
                      </p>
                    </div>
                  )}
                </div>
                <div className="job-cta" style={{ display:'flex', flexDirection:'column', gap:8, minWidth:140 }}>
                  <Link href={job.applyLink} style={{ display:'block', background:job.hotColor, color:'#fff', borderRadius:10, padding:'11px 18px', fontSize:13, fontWeight:700, textDecoration:'none', textAlign:'center' }}>
                    {es ? 'Aplicar Ahora' : 'Apply Now'}
                  </Link>
                  <Link href={job.applyLink} style={{ display:'block', background:'rgba(255,255,255,0.06)', color:'rgba(248,244,236,0.6)', borderRadius:10, padding:'9px 18px', fontSize:12, fontWeight:600, textDecoration:'none', textAlign:'center', border:'1px solid rgba(255,255,255,0.1)' }}>
                    {es ? 'Ver Detalles' : 'View Details'}
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* Standard job card */
            <div key={i} className="job-card">
              <div className="job-inner" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:16 }}>
                <div style={{ flex:1 }}>
                  {job.badge_en && (
                    <div style={{ display:'inline-block', fontSize:10, fontWeight:700, background:'rgba(201,168,76,0.15)', color:gold, border:`1px solid rgba(201,168,76,0.3)`, borderRadius:100, padding:'3px 10px', letterSpacing:1, marginBottom:8 }}>
                      {es ? job.badge_es : job.badge_en}
                    </div>
                  )}
                  <h3 style={{ fontSize:17, fontWeight:700, color:navy, marginBottom:4, fontFamily:"'Playfair Display',serif" }}>{es ? job.title_es : job.title_en}</h3>
                  <p style={{ fontSize:13, color:teal, fontWeight:600, marginBottom:10 }}>{job.company}</p>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:10 }}>
                    {(es ? job.tags_es : job.tags_en).map(tag => (
                      <span key={tag} style={{ fontSize:11, background:'#f0fdf9', color:'#0f766e', padding:'3px 10px', borderRadius:100, border:'1px solid #ccfbf1' }}>{tag}</span>
                    ))}
                  </div>
                  <div style={{ fontSize:14, fontWeight:700, color:navy, marginBottom:4 }}>{es ? job.salary_es : job.salary_en}</div>
                  <div style={{ fontSize:12, color:'#94a3b8' }}>
                    {es ? job.location_es : job.location_en} · {es ? job.duration_es : job.duration_en} · {es ? 'Vuelo incluido' : 'Flight included'}
                  </div>
                </div>
                <div className="job-cta" style={{ display:'flex', flexDirection:'column', gap:8, minWidth:130 }}>
                  <Link href={job.applyLink} style={{ display:'block', background:teal, color:'#fff', borderRadius:10, padding:'11px 16px', fontSize:13, fontWeight:700, textDecoration:'none', textAlign:'center' }}>
                    {es ? 'Aplicar Gratis' : 'Apply Free'}
                  </Link>
                  <Link href={job.applyLink} style={{ display:'block', background:'#f8fafc', color:'#64748b', borderRadius:10, padding:'9px 16px', fontSize:12, fontWeight:600, textDecoration:'none', textAlign:'center', border:'1px solid #e2e8f0' }}>
                    {es ? 'Ver Detalles' : 'View Details'}
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div style={{ textAlign:'center', padding:'60px 20px', color:'#94a3b8' }}>
              <div style={{ fontSize:40, marginBottom:12 }}>🔍</div>
              <p style={{ fontSize:16, fontWeight:600 }}>{es ? 'No hay posiciones en esta categoria' : 'No positions in this category'}</p>
            </div>
          )}
        </div>
      </section>

      {/* Talent pool CTA */}
      <section style={{ padding:'48px 24px', background:'#0a1628' }}>
        <div style={{ maxWidth:600, margin:'0 auto', textAlign:'center' }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(20px,3vw,28px)', fontWeight:700, color:'#f8f4ec', marginBottom:10 }}>
            {es ? 'No ves tu posicion ideal?' : "Don't see your ideal position?"}
          </h2>
          <p style={{ color:'rgba(248,244,236,0.55)', fontSize:14, marginBottom:24, lineHeight:1.7 }}>
            {es
              ? 'Nuevas posiciones se agregan cada semana. Unete a nuestro Talent Pool y seras el primero en saber cuando abra tu rol.'
              : 'New positions are added weekly. Join our Talent Pool and be the first to know when your role opens.'}
          </p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <Link href="/talent-pool" style={{ display:'inline-block', background:gold, color:'#0a1628', borderRadius:10, padding:'13px 28px', fontSize:14, fontWeight:700, textDecoration:'none' }}>
              {es ? 'Unirme al Talent Pool' : 'Join the Talent Pool'}
            </Link>
            <Link href="/apply" style={{ display:'inline-block', background:'rgba(255,255,255,0.08)', color:'rgba(248,244,236,0.7)', borderRadius:10, padding:'13px 24px', fontSize:14, fontWeight:600, textDecoration:'none', border:'1px solid rgba(255,255,255,0.15)' }}>
              {es ? 'Aplicar Ahora' : 'Apply Now'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
