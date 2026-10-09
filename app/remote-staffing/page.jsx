'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useLang } from '../../lib/LanguageContext';

const navy = "#0a1628";
const teal = "#0d9488";

const ROLES = [
  { icon: '🎧', en: 'Bilingual Customer Service', es: 'Servicio al Cliente Bilingüe', desc_en: 'Spanish/English support for U.S. e-commerce brands. Chat, email, and phone.', desc_es: 'Soporte español/inglés para marcas de e-commerce en EE.UU. Chat, email y teléfono.' },
  { icon: '🛍️', en: 'E-commerce Operations', es: 'Operaciones E-commerce', desc_en: 'Order management, returns, supplier coordination, inventory tracking.', desc_es: 'Gestión de pedidos, devoluciones, coordinación con proveedores, inventario.' },
  { icon: '📋', en: 'Virtual Assistant', es: 'Asistente Virtual', desc_en: 'Executive support, scheduling, research, inbox management for U.S. founders.', desc_es: 'Soporte ejecutivo, agenda, investigación, gestión de inbox para fundadores en EE.UU.' },
  { icon: '📊', en: 'Sales Development Rep', es: 'Representante de Desarrollo de Ventas', desc_en: 'Outbound prospecting, lead qualification, CRM management in English.', desc_es: 'Prospección saliente, calificación de leads, manejo de CRM en inglés.' },
];

const WHY = [
  { icon: '🌎', en: '17 years placing Latin American talent', es: '17 años colocando talento latinoamericano' },
  { icon: '✅', en: '2,000+ professionals placed internationally since 2009', es: 'Más de 2,000 profesionales colocados internacionalmente desde 2009' },
  { icon: '🗣️', en: 'Pre-screened English proficiency', es: 'Inglés pre-evaluado' },
  { icon: '⚡', en: 'Candidate profiles within 48 hours', es: 'Perfiles de candidatos en 48 horas' },
  { icon: '🔄', en: '30-day free replacement guarantee', es: 'Garantía de reemplazo gratis en 30 días' },
  { icon: '💳', en: 'No placement fees — flat monthly rate', es: 'Sin fees de colocación — tarifa mensual fija' },
];

const PLANS = [
  { title_en: 'Entry Level', title_es: 'Nivel Básico', price: '$1,200/mo', hot: false, features_en: ['Bilingual customer service', 'Chat & email support', 'Shopify & Gorgias', 'English B2 level', '40 hrs/week'], features_es: ['Servicio al cliente bilingüe', 'Soporte chat y email', 'Shopify & Gorgias', 'Inglés nivel B2', '40 hrs/semana'] },
  { title_en: 'Mid Level', title_es: 'Nivel Medio', price: '$1,500/mo', hot: true, features_en: ['CS + operations', 'CRM management', 'Shopify + Zendesk', 'English C1 level', 'Team coordination'], features_es: ['CS + operaciones', 'Manejo de CRM', 'Shopify + Zendesk', 'Inglés nivel C1', 'Coordinación de equipo'] },
  { title_en: 'Senior Level', title_es: 'Nivel Senior', price: '$1,800/mo', hot: false, features_en: ['Sales development', 'Team leadership', 'Advanced tools', 'English C1+ level', 'Strategic support'], features_es: ['Desarrollo de ventas', 'Liderazgo de equipo', 'Herramientas avanzadas', 'Inglés C1+', 'Soporte estratégico'] },
];

const FAQS = [
  { q_en: 'What time zones do your candidates work in?', q_es: '¿En qué zona horaria trabajan sus candidatos?', a_en: 'Most candidates are based in Colombia (UTC-5), which overlaps significantly with U.S. Eastern and Central time zones.', a_es: 'La mayoría están en Colombia (UTC-5), zona horaria que se superpone con el este y centro de EE.UU.' },
  { q_en: 'How is this different from Upwork or Fiverr?', q_es: '¿En qué se diferencia de Upwork o Fiverr?', a_en: 'We pre-screen every candidate for English level, reliability, and work history. You get one vetted person — not 50 proposals.', a_es: 'Pre-evaluamos cada candidato en inglés, confiabilidad e historial laboral. Recibes una persona verificada, no 50 propuestas.' },
  { q_en: 'What is the monthly cost?', q_es: '¿Cuál es el costo mensual?', a_en: '$1,200–$1,800/month depending on experience and role. No placement fee. No hidden costs.', a_es: '$1,200–$1,800/mes según experiencia y rol. Sin fee de colocación. Sin costos ocultos.' },
  { q_en: 'Can I try before committing?', q_es: '¿Puedo probar antes de comprometer?', a_en: 'Yes. We offer a 2-week trial. If it is not a fit, we replace at no cost.', a_es: 'Sí. Ofrecemos una prueba de 2 semanas. Si no hay fit, reemplazamos sin costo.' },
  { q_en: 'What tools do your candidates use?', q_es: '¿Qué herramientas usan sus candidatos?', a_en: 'Gorgias, Zendesk, Shopify, HubSpot, Notion, Slack, Asana — most are familiar with standard U.S. business tools.', a_es: 'Gorgias, Zendesk, Shopify, HubSpot, Notion, Slack, Asana — la mayoría conoce las herramientas estándar de EE.UU.' },
];

export default function RemoteStaffingPage() {
  const { lang } = useLang();
  const es = lang === 'es';
  const [form, setForm] = useState({ name: '', email: '', company: '', role: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'careers@selectivecrew.com',
          subject: `Remote Staffing Inquiry — ${form.company} (${form.role})`,
          text: `Name: ${form.name}\nEmail: ${form.email}\nCompany: ${form.company}\nRole needed: ${form.role}\nMessage: ${form.message}`,
        }),
      });
      setSubmitted(true);
    } catch {
      alert('Something went wrong. Please email us at careers@selectivecrew.com');
    } finally {
      setBusy(false);
    }
  }

  const inp = { width: '100%', padding: '11px 14px', border: '1px solid #d1d9e6', borderRadius: 8, fontSize: 14, color: navy, background: '#f8fafc', boxSizing: 'border-box', outline: 'none' };

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: navy, background: '#fff' }}>

      {/* HERO */}
      <section style={{ background: `linear-gradient(160deg, ${navy} 0%, #1a3a5c 60%, #0f2d4a 100%)`, padding: '80px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
        <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(13,148,136,0.15)', border: '1px solid rgba(13,148,136,0.3)', borderRadius: 100, padding: '5px 14px', marginBottom: 20 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#5eead4', letterSpacing: 1.5 }}>SELECTIVE CREW · REMOTE STAFFING</span>
          </div>
          <h1 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 800, color: '#f8f4ec', lineHeight: 1.15, marginBottom: 20 }}>
            {es ? 'Talento Bilingüe de Latinoamérica' : 'Bilingual Latin American Talent'}<br />
            <span style={{ color: teal }}>{es ? 'Para Tu Empresa en EE.UU.' : 'For Your U.S. Business'}</span>
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(248,244,236,0.65)', lineHeight: 1.8, marginBottom: 32, maxWidth: 580 }}>
            {es ? 'Candidatos bilingües pre-verificados listos para trabajar remoto. Customer service, operaciones, ventas — desde $1,200/mes. Sin fees de colocación.' : 'Pre-vetted bilingual candidates ready to work remotely. Customer service, operations, sales — from $1,200/month. No placement fees.'}
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="#contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: teal, color: '#fff', padding: '14px 28px', borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
              {es ? 'Contratar Talento' : 'Hire Remote Talent'}
            </a>
            <a href="#roles" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: '#f8f4ec', padding: '13px 24px', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none', border: '1.5px solid rgba(248,244,236,0.25)' }}>
              {es ? 'Ver Roles' : 'See Available Roles'}
            </a>
          </div>
          <div style={{ display: 'flex', gap: 32, marginTop: 40, flexWrap: 'wrap' }}>
            {[
              { val: '2,000+', label: es ? 'Profesionales latinoamericanos colocados internacionalmente desde 2009' : 'Latin American professionals placed internationally since 2009' },
              { val: '17', label: es ? 'Años de Experiencia' : 'Years of Experience' },
              { val: es ? '48 h' : '48 hrs', label: es ? 'Perfiles de candidatos en 48 horas' : 'Candidate profiles in 48 hours' },
              { val: '$1,200/mo', label: es ? 'Desde' : 'Starting From' },
            ].map(s => (
              <div key={s.val}>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#f8f4ec' }}>{s.val}</div>
                <div style={{ fontSize: 12, color: 'rgba(248,244,236,0.5)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROLES */}
      <section id="roles" style={{ padding: '72px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#64748b', background: '#fff', borderRadius: 100, padding: '4px 12px', marginBottom: 12 }}>
            {es ? 'Roles Disponibles' : 'Available Roles'}
          </span>
          <h2 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 700, color: navy, marginBottom: 8 }}>
            {es ? '¿Qué tipo de talento necesitas?' : 'What type of talent do you need?'}
          </h2>
          <p style={{ fontSize: 15, color: '#64748b', marginBottom: 36, lineHeight: 1.7 }}>
            {es ? 'Cada candidato tiene inglés evaluado y verificación de antecedentes.' : 'Every candidate is English-tested and background-checked.'}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 20 }}>
            {ROLES.map(r => (
              <div key={r.en} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 24, borderLeft: `3px solid ${teal}` }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{r.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: navy, marginBottom: 6 }}>{es ? r.es : r.en}</div>
                <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.65 }}>{es ? r.desc_es : r.desc_en}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section style={{ padding: '72px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#64748b', background: '#f1f5f9', borderRadius: 100, padding: '4px 12px', marginBottom: 12 }}>
            {es ? 'Por Qué Nosotros' : 'Why Selective Crew'}
          </span>
          <h2 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 700, color: navy, marginBottom: 36 }}>
            {es ? '17 años verificando talento latinoamericano' : '17 years vetting Latin American talent'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
            {WHY.map((w, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: 16, border: '1px solid #e2e8f0', borderRadius: 12 }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{w.icon}</span>
                <span style={{ fontSize: 14, color: '#334155', fontWeight: 500, lineHeight: 1.5 }}>{es ? w.es : w.en}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '72px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#64748b', background: '#fff', borderRadius: 100, padding: '4px 12px', marginBottom: 12 }}>
            {es ? 'Cómo Funciona' : 'How It Works'}
          </span>
          <h2 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 700, color: navy, marginBottom: 36 }}>
            {es ? 'Conoce a tus primeros candidatos en 48 horas' : 'Meet your first candidates in 48 hours'}
          </h2>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 28 }}>
            {[
              { n: '01', en: 'Tell us what you need', es: 'Cuéntanos qué necesitas', desc_en: 'Fill out the form below — role, tools, hours, budget. Takes 2 minutes.', desc_es: 'Llena el formulario — rol, herramientas, horas, presupuesto. Toma 2 minutos.' },
              { n: '02', en: 'We match you in 48 hours', es: 'Te hacemos match en 48 horas', desc_en: 'We review our verified candidate pool and send you 1-2 profiles that fit.', desc_es: 'Revisamos nuestro pool verificado y te enviamos 1-2 perfiles.' },
              { n: '03', en: '2-week trial', es: 'Prueba de 2 semanas', desc_en: 'Your candidate starts working. You evaluate fit, communication, and output.', desc_es: 'Tu candidato comienza. Evalúas fit, comunicación y resultados.' },
              { n: '04', en: 'Commit or replace — your call', es: 'Continúas o reemplazamos', desc_en: 'If it works, continue at the agreed monthly rate. If not, we replace at no cost.', desc_es: 'Si funciona, continúas. Si no, reemplazamos sin costo.' },
            ].map((s, i, arr) => (
              <div key={s.n} style={{ display: 'flex', gap: 20, alignItems: 'flex-start', padding: '20px 0', borderBottom: i < arr.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: teal, color: '#fff', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.n}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: navy, marginBottom: 4 }}>{es ? s.es : s.en}</div>
                  <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.65 }}>{es ? s.desc_es : s.desc_en}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding: '72px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#64748b', background: '#f1f5f9', borderRadius: 100, padding: '4px 12px', marginBottom: 12 }}>
            {es ? 'Precios' : 'Pricing'}
          </span>
          <h2 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 700, color: navy, marginBottom: 36 }}>
            {es ? 'Simple y transparente' : 'Simple and transparent'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 20 }}>
            {PLANS.map(p => (
              <div key={p.price} style={{ background: p.hot ? navy : '#fff', border: `1px solid ${p.hot ? teal : '#e2e8f0'}`, borderRadius: 16, padding: 28, position: 'relative' }}>
                {p.hot && <div style={{ position: 'absolute', top: -10, left: 20, background: teal, color: '#fff', fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 100, letterSpacing: 1 }}>MOST POPULAR</div>}
                <div style={{ fontSize: 14, fontWeight: 700, color: p.hot ? '#5eead4' : '#64748b', marginBottom: 8 }}>{es ? p.title_es : p.title_en}</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: p.hot ? '#f8f4ec' : navy, marginBottom: 20 }}>{p.price}</div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(es ? p.features_es : p.features_en).map(f => (
                    <li key={f} style={{ display: 'flex', gap: 8, fontSize: 13, color: p.hot ? 'rgba(248,244,236,0.75)' : '#334155' }}>
                      <span style={{ color: teal, fontWeight: 700, flexShrink: 0 }}>✓</span>{f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 16, textAlign: 'center' }}>
            {es ? 'Sin fee de colocación. Sin contratos largos. Reemplazo gratis en 30 días.' : 'No placement fee. No long contracts. Free replacement within 30 days.'}
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '72px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#64748b', background: '#fff', borderRadius: 100, padding: '4px 12px', marginBottom: 12 }}>FAQ</span>
          <h2 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 700, color: navy, marginBottom: 36 }}>
            {es ? 'Preguntas Frecuentes' : 'Common Questions'}
          </h2>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 28 }}>
            {FAQS.map((f, i, arr) => (
              <div key={i} style={{ paddingBottom: 20, marginBottom: 20, borderBottom: i < arr.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: navy, marginBottom: 8 }}>{es ? f.q_es : f.q_en}</div>
                <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7 }}>{es ? f.a_es : f.a_en}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding: '72px 24px', background: navy }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', borderRadius: 100, padding: '4px 12px', marginBottom: 12 }}>
            {es ? 'Empezar' : 'Get Started'}
          </span>
          <h2 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 700, color: '#f8f4ec', marginBottom: 8 }}>
            {es ? 'Cuéntanos qué necesitas' : 'Tell us what you need'}
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(248,244,236,0.55)', marginBottom: 32, lineHeight: 1.7 }}>
            {es ? 'Te respondemos en menos de 48 horas con perfiles que se ajustan a tu negocio.' : 'We respond within 48 hours with profiles that fit your business.'}
          </p>
          {submitted ? (
            <div style={{ background: 'rgba(13,148,136,0.12)', border: '1px solid rgba(13,148,136,0.25)', borderRadius: 16, padding: '40px 32px', textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>✅</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#f8f4ec', marginBottom: 10 }}>{es ? '¡Solicitud Recibida!' : 'Request Received!'}</div>
              <p style={{ fontSize: 14, color: 'rgba(248,244,236,0.65)', lineHeight: 1.7 }}>{es ? 'Te contactaremos en menos de 48 horas.' : 'We will contact you within 48 hours.'}</p>
            </div>
          ) : (
            <form onSubmit={submit} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { name: 'name', label_en: 'Your name *', label_es: 'Tu nombre *', type: 'text' },
                { name: 'email', label_en: 'Work email *', label_es: 'Email de trabajo *', type: 'email' },
                { name: 'company', label_en: 'Company name *', label_es: 'Nombre de la empresa *', type: 'text' },
              ].map(field => (
                <div key={field.name}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(248,244,236,0.6)', display: 'block', marginBottom: 6 }}>{es ? field.label_es : field.label_en}</label>
                  <input type={field.type} name={field.name} value={form[field.name]} onChange={handle} required style={inp} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(248,244,236,0.6)', display: 'block', marginBottom: 6 }}>{es ? 'Rol que necesitas *' : 'Role you need *'}</label>
                <select name="role" value={form.role} onChange={handle} required style={{ ...inp, appearance: 'none' }}>
                  <option value="">{es ? 'Seleccionar' : 'Select role'}</option>
                  <option value="Customer Service">{es ? 'Servicio al Cliente Bilingüe' : 'Bilingual Customer Service'}</option>
                  <option value="E-commerce Operations">{es ? 'Operaciones E-commerce' : 'E-commerce Operations'}</option>
                  <option value="Virtual Assistant">{es ? 'Asistente Virtual' : 'Virtual Assistant'}</option>
                  <option value="Sales Development">{es ? 'Desarrollo de Ventas' : 'Sales Development Rep'}</option>
                  <option value="Other">{es ? 'Otro' : 'Other'}</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(248,244,236,0.6)', display: 'block', marginBottom: 6 }}>{es ? 'Mensaje (opcional)' : 'Message (optional)'}</label>
                <textarea name="message" value={form.message} onChange={handle} rows={3} style={{ ...inp, resize: 'none', fontFamily: 'inherit' }} />
              </div>
              <button type="submit" disabled={busy} style={{ width: '100%', background: busy ? '#64748b' : teal, color: '#fff', border: 'none', borderRadius: 10, padding: '14px', fontSize: 15, fontWeight: 700, cursor: busy ? 'not-allowed' : 'pointer' }}>
                {busy ? (es ? 'Enviando...' : 'Sending...') : (es ? 'Solicitar Candidatos' : 'Request Candidates')}
              </button>
              <p style={{ fontSize: 12, color: 'rgba(248,244,236,0.3)', textAlign: 'center', margin: 0 }}>
                {es ? 'Sin compromiso. Te respondemos en 48 horas.' : 'No commitment. We respond within 48 hours.'}
              </p>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}
