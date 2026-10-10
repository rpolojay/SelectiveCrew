'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useLang } from '../../lib/LanguageContext';

const navy = "#0a1628";
const teal = "#0d9488";

// "Book a 15-min call" target. Points to the form until a Cal.com URL exists;
// set it to the https:// booking URL and the buttons open it in a new tab.
const CAL_LINK = '#contact';
const CAL_EXTERNAL = CAL_LINK.startsWith('http');

const ROLES = [
  { icon: '🎧', en: 'Bilingual Intake Specialist', es: 'Especialista Bilingüe de Admisión (Intake)', desc_en: 'Answers calls, chats and web leads in English and Spanish, collects case details, and schedules consultations.', desc_es: 'Atiende llamadas, chats y prospectos web en inglés y español, recopila los detalles del caso y agenda consultas.' },
  { icon: '📞', en: 'Legal Receptionist', es: 'Recepcionista Legal', desc_en: 'Manages phones, calendars, client reminders and walk-in coordination for your front office.', desc_es: 'Gestiona teléfonos, agendas, recordatorios a clientes y la coordinación de visitas presenciales en tu recepción.' },
  { icon: '📋', en: 'Case Follow-up Assistant', es: 'Asistente de Seguimiento de Casos', desc_en: 'Keeps clients updated, collects documents and signatures, and chases missing information.', desc_es: 'Mantiene informados a los clientes, recopila documentos y firmas, y da seguimiento a la información pendiente.' },
  { icon: '📊', en: 'Admin & CRM Assistant', es: 'Asistente Administrativo y de CRM', desc_en: 'Data entry, file organization and CRM updates in tools like Clio, MyCase, Lawmatics and Filevine.', desc_es: 'Ingreso de datos, organización de archivos y actualización del CRM en herramientas como Clio, MyCase, Lawmatics y Filevine.' },
];

const WHY = [
  { icon: '🌎', en: '2,000+ professionals placed internationally since 2009', es: 'Más de 2,000 profesionales colocados internacionalmente desde 2009' },
  { icon: '🗣️', en: 'Native Spanish, English tested at C1', es: 'Español nativo, inglés evaluado en nivel C1' },
  { icon: '✅', en: 'Screened for English, work history and references', es: 'Evaluados en inglés, historial laboral y referencias' },
  { icon: '⚡', en: 'Candidate profiles typically within 48 hours', es: 'Perfiles de candidatos normalmente en 48 horas' },
  { icon: '🕒', en: 'Works in U.S. time zones (Colombia is UTC-5)', es: 'Trabajan en horarios de EE.UU. (Colombia está en UTC-5)' },
  { icon: '🔄', en: 'Replacement candidate at no additional placement fee within the first 30 days', es: 'Candidato de reemplazo sin tarifa de colocación adicional durante los primeros 30 días' },
  { icon: '💳', en: 'One-time placement fee, no long-term contracts', es: 'Tarifa de colocación única, sin contratos a largo plazo' },
];

const PLANS = [
  { title_en: 'Placement fee', title_es: 'Tarifa de colocación', price: '$1,200', unit_en: ' per hire', unit_es: ' por contratación', hot: false, features_en: ['Paid once, when your team member starts', 'Includes sourcing, English testing and screening', '1–2 matched profiles'], features_es: ['Se paga una sola vez, cuando tu integrante comienza', 'Incluye búsqueda, evaluación de inglés y filtro de candidatos', '1–2 perfiles seleccionados para tu firma'] },
  { title_en: 'Ongoing support (optional)', title_es: 'Soporte continuo (opcional)', price: '$300', unit_en: '/month', unit_es: '/mes', hot: false, features_en: ['Regular check-ins', 'Performance follow-up', 'Replacement candidate at no additional placement fee if your team member leaves, while your support plan is active'], features_es: ['Reuniones de seguimiento periódicas', 'Seguimiento del desempeño', 'Candidato de reemplazo sin tarifa de colocación adicional si tu integrante se retira, mientras tu plan de soporte esté activo'] },
  { title_en: 'Team member’s pay', title_es: 'Pago del integrante del equipo', price: '$900–$1,300', priceSize: 26, unit_en: '/month', unit_es: '/mes', hot: false, features_en: ['Paid directly by your firm', 'Typical full-time range, depending on the role', 'We’ll recommend a fair rate'], features_es: ['Lo paga directamente tu firma', 'Rango típico a tiempo completo, según el rol', 'Te recomendamos una tarifa justa'] },
];

const FAQS = [
  { q_en: 'Who employs the team member?', q_es: '¿Quién es el empleador del integrante del equipo?', a_en: 'We recruit, screen and present candidates. Your firm engages the team member directly or through an employer-of-record service such as Deel or Ontop, pays them directly, and directs and supervises their work. We can recommend options and help with setup.', a_es: 'Nosotros reclutamos, evaluamos y presentamos a los candidatos. Tu firma contrata al integrante directamente o a través de un servicio de employer of record (empleador registrado) como Deel u Ontop, le paga directamente y dirige y supervisa su trabajo. Podemos recomendarte opciones y ayudarte con la configuración.' },
  { q_en: 'How do you handle confidentiality?', q_es: '¿Cómo manejan la confidencialidad?', a_en: 'Team members sign a confidentiality agreement before starting. Your firm controls their system access, supervises their work, and remains responsible for client communications and compliance with applicable professional rules. Team members perform administrative tasks only as directed by your firm and do not provide legal advice.', a_es: 'Los integrantes del equipo firman un acuerdo de confidencialidad antes de comenzar. Tu firma controla su acceso a los sistemas, supervisa su trabajo y sigue siendo responsable de la comunicación con los clientes y del cumplimiento de las normas profesionales aplicables. Los integrantes realizan únicamente tareas administrativas según las indicaciones de tu firma y no brindan asesoría legal.' },
  { q_en: 'What time zone do they work in?', q_es: '¿En qué zona horaria trabajan?', a_en: 'Colombia is UTC-5, the same as U.S. Eastern Standard Time, with full overlap with Central time. Schedules can be adjusted for Mountain and Pacific.', a_es: 'Colombia está en UTC-5, igual que la hora estándar del Este de EE.UU., con coincidencia total con la hora del Centro. Los horarios se pueden ajustar para las zonas de Montaña y Pacífico.' },
  { q_en: 'What if the candidate isn’t the right fit?', q_es: '¿Qué pasa si el candidato no es el indicado?', a_en: 'If it’s not the right fit within the first 30 days, we’ll present a replacement candidate at no additional placement fee, per our written service terms.', a_es: 'Si no es la persona indicada dentro de los primeros 30 días, te presentaremos un candidato de reemplazo sin tarifa de colocación adicional, según nuestros términos de servicio por escrito.' },
  { q_en: 'How do I pay?', q_es: '¿Cómo pago?', a_en: 'Our placement fee is paid once, when your team member starts, and optional ongoing support is billed monthly, in USD by card or bank transfer. You pay your team member directly or through your employer-of-record service.', a_es: 'La tarifa de colocación se paga una sola vez, cuando tu integrante comienza, y el soporte continuo opcional se factura mensualmente, en dólares (USD) con tarjeta o transferencia bancaria. A tu integrante le pagas directamente o a través de tu servicio de employer of record.' },
  { q_en: 'How is this different from Upwork or Fiverr?', q_es: '¿En qué se diferencia de Upwork o Fiverr?', a_en: 'We vet every candidate for English, reliability and work history. You get one verified professional, not 50 proposals, and if it doesn’t work out, a replacement candidate at no additional placement fee within the first 30 days.', a_es: 'Evaluamos a cada candidato en inglés, confiabilidad e historial laboral. Recibes un profesional verificado, no 50 propuestas, y si no funciona, un candidato de reemplazo sin tarifa de colocación adicional durante los primeros 30 días.' },
];

export default function RemoteStaffingPage() {
  const { lang } = useLang();
  const es = lang === 'es';
  const [form, setForm] = useState({ name: '', email: '', company: '', practice: '', role: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sendError, setSendError] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setSendError(false);
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'careers@selectivecrew.com',
          subject: `Remote Staffing Inquiry — ${form.company} (${form.role})`,
          text: `Name: ${form.name}\nEmail: ${form.email}\nCompany: ${form.company}${form.practice ? `\nPractice area: ${form.practice}` : ''}\nRole needed: ${form.role}\nMessage: ${form.message}`,
        }),
      });
      // Only a successful response counts; on failure the form keeps its values.
      if (!res.ok) throw new Error(`send-email ${res.status}`);
      setSubmitted(true);
    } catch {
      setSendError(true);
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
            <span style={{ fontSize: 11, fontWeight: 700, color: '#5eead4', letterSpacing: 1.5 }}>{es ? 'SELECTIVE CREW · PERSONAL REMOTO PARA FIRMAS DE ABOGADOS' : 'SELECTIVE CREW · REMOTE STAFFING FOR LAW FIRMS'}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 800, color: '#f8f4ec', lineHeight: 1.15, marginBottom: 20 }}>
            {es ? 'Soporte bilingüe de admisión' : 'Bilingual intake support'}<br />
            <span style={{ color: teal }}>{es ? 'para firmas de abogados en EE.UU.' : 'for U.S. law firms.'}</span>
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(248,244,236,0.65)', lineHeight: 1.8, marginBottom: 32, maxWidth: 580 }}>
            {es ? 'Profesionales colombianos con español nativo e inglés evaluado, para ayudar a tu firma con llamadas, agenda y seguimiento a clientes, a un costo menor que una contratación típica en EE.UU.' : 'Native Spanish-speaking, English-tested professionals from Colombia to help your firm handle calls, scheduling and client follow-up, at a lower cost than a typical U.S. hire.'}
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href={CAL_LINK} {...(CAL_EXTERNAL ? { target: '_blank', rel: 'noopener noreferrer' } : {})} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: teal, color: '#fff', padding: '14px 28px', borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
              {es ? 'Agenda una llamada de 15 min' : 'Book a 15-min call'}
            </a>
            <a href="#contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: '#f8f4ec', padding: '13px 24px', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none', border: '1.5px solid rgba(248,244,236,0.25)' }}>
              {es ? 'Ver perfiles de candidatos' : 'See candidate profiles'}
            </a>
          </div>
          <div style={{ display: 'flex', gap: 24, marginTop: 40, flexWrap: 'wrap' }}>
            {[
              { val: '2,000+', label: es ? 'Profesionales colocados internacionalmente desde 2009' : 'Professionals placed internationally since 2009' },
              { val: '17', label: es ? 'Años reclutando talento latinoamericano' : 'Years recruiting Latin American talent' },
              { val: es ? '48 h' : '48 hrs', label: es ? 'Perfiles de candidatos normalmente en 48 horas' : 'Candidate profiles typically within 48 hours' },
              { val: '$1,200', label: es ? 'Tarifa única de colocación' : 'One-time placement fee' },
            ].map(s => (
              <div key={s.val} style={{ maxWidth: 200 }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#f8f4ec' }}>{s.val}</div>
                <div style={{ fontSize: 12, color: 'rgba(248,244,236,0.5)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section style={{ padding: '72px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#64748b', background: '#f1f5f9', borderRadius: 100, padding: '4px 12px', marginBottom: 12 }}>
            {es ? 'El Problema' : 'The Problem'}
          </span>
          <h2 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 700, color: navy, marginBottom: 8 }}>
            {es ? 'Cada llamada sin responder es un caso que no firmaste.' : 'Every unanswered call is a case you didn’t sign.'}
          </h2>
          <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.7, maxWidth: 720 }}>
            {es ? 'Los clientes hispanohablantes llaman cuando necesitan ayuda, y si nadie contesta, llaman a la siguiente firma. Contratar personal bilingüe en EE.UU. es caro y lento. Nuestro equipo bilingüe trabaja en tu horario, en tus sistemas y bajo la supervisión de tu firma.' : 'Spanish-speaking clients call when they need help, and they call the next firm if nobody answers. Hiring bilingual staff in the U.S. is expensive and slow. Our bilingual team members work your hours, in your systems, under your firm’s supervision.'}
          </p>
        </div>
      </section>

      {/* ROLES */}
      <section id="roles" style={{ padding: '72px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#64748b', background: '#fff', borderRadius: 100, padding: '4px 12px', marginBottom: 12 }}>
            {es ? 'Roles Disponibles' : 'Available Roles'}
          </span>
          <h2 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 700, color: navy, marginBottom: 8 }}>
            {es ? 'Soporte bilingüe diseñado para firmas de abogados' : 'Bilingual support built for law firms'}
          </h2>
          <p style={{ fontSize: 15, color: '#64748b', marginBottom: 36, lineHeight: 1.7 }}>
            {es ? 'Cada candidato es hablante nativo de español con inglés profesional evaluado (C1).' : 'Every candidate is a native Spanish speaker with tested professional English (C1).'}
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
            {es ? 'Conoce a tus primeros candidatos, normalmente en 48 horas' : 'Meet your first candidates, typically within 48 hours'}
          </h2>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 28 }}>
            {[
              { n: '01', en: 'Tell us what you need', es: 'Cuéntanos qué necesitas', desc_en: 'Role, hours, tools and practice area. Takes 2 minutes.', desc_es: 'Rol, horario, herramientas y área de práctica. Toma 2 minutos.' },
              { n: '02', en: 'Review profiles', es: 'Revisa los perfiles', desc_en: 'Typically within 48 hours, you get 1–2 vetted profiles with a short video introduction.', desc_es: 'Normalmente en 48 horas recibes 1–2 perfiles evaluados con un breve video de presentación.' },
              { n: '03', en: 'Start working together', es: 'Empiecen a trabajar juntos', desc_en: 'Your team member starts, and you evaluate communication, reliability and results.', desc_es: 'Tu integrante comienza y tú evalúas comunicación, confiabilidad y resultados.' },
              { n: '04', en: 'Keep or replace', es: 'Continúa o reemplaza', desc_en: 'If it works, they stay on your team. If it’s not the right fit within the first 30 days, we’ll present a replacement candidate at no additional placement fee.', desc_es: 'Si funciona, se queda en tu equipo. Si no es la persona indicada dentro de los primeros 30 días, te presentaremos un candidato de reemplazo sin tarifa de colocación adicional.' },
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
            {es ? 'Precios simples y transparentes' : 'Simple, transparent pricing'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 20 }}>
            {PLANS.map(p => (
              <div key={p.price} style={{ background: p.hot ? navy : '#fff', border: `1px solid ${p.hot ? teal : '#e2e8f0'}`, borderRadius: 16, padding: 28, position: 'relative' }}>
                {p.hot && <div style={{ position: 'absolute', top: -10, left: 20, background: teal, color: '#fff', fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 100, letterSpacing: 1 }}>{es ? 'MÁS POPULAR' : 'MOST POPULAR'}</div>}
                <div style={{ fontSize: 14, fontWeight: 700, color: p.hot ? '#5eead4' : '#64748b', marginBottom: 8 }}>{es ? p.title_es : p.title_en}</div>
                <div style={{ fontSize: p.priceSize || 32, fontWeight: 800, color: p.hot ? '#f8f4ec' : navy, marginBottom: 20 }}>{p.price}<span style={{ fontSize: 15, fontWeight: 600 }}>{es ? p.unit_es : p.unit_en}</span></div>
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
            {es ? 'Sin contratos a largo plazo. Candidato de reemplazo sin tarifa de colocación adicional durante los primeros 30 días, según nuestros términos de servicio por escrito. Los servicios se prestan bajo un acuerdo escrito firmado antes de iniciar cualquier colaboración.' : 'No long-term contracts. Replacement candidate at no additional placement fee within the first 30 days, per our written service terms. Services are provided under a written agreement signed before any engagement begins.'}
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
            {es ? 'Normalmente respondemos en menos de 48 horas con perfiles que se ajusten a tu firma.' : 'We typically reply within 48 hours with profiles that fit your firm.'}
          </p>
          {submitted ? (
            <div style={{ background: 'rgba(13,148,136,0.12)', border: '1px solid rgba(13,148,136,0.25)', borderRadius: 16, padding: '40px 32px', textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>✅</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#f8f4ec', marginBottom: 10 }}>{es ? '¡Solicitud Recibida!' : 'Request Received!'}</div>
              <p style={{ fontSize: 14, color: 'rgba(248,244,236,0.65)', lineHeight: 1.7 }}>{es ? 'Normalmente respondemos en menos de 48 horas.' : 'We typically reply within 48 hours.'}</p>
            </div>
          ) : (
            <form onSubmit={submit} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { name: 'name', label_en: 'Your name *', label_es: 'Tu nombre *', type: 'text' },
                { name: 'email', label_en: 'Work email *', label_es: 'Email de trabajo *', type: 'email' },
                { name: 'company', label_en: 'Firm name *', label_es: 'Nombre de la firma *', type: 'text' },
              ].map(field => (
                <div key={field.name}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(248,244,236,0.6)', display: 'block', marginBottom: 6 }}>{es ? field.label_es : field.label_en}</label>
                  <input type={field.type} name={field.name} value={form[field.name]} onChange={handle} required style={inp} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(248,244,236,0.6)', display: 'block', marginBottom: 6 }}>{es ? 'Área de práctica (opcional)' : 'Practice area (optional)'}</label>
                <select name="practice" value={form.practice} onChange={handle} style={{ ...inp, appearance: 'none' }}>
                  <option value="">{es ? 'Seleccionar' : 'Select practice area'}</option>
                  <option value="Immigration">{es ? 'Inmigración' : 'Immigration'}</option>
                  <option value="Personal Injury">{es ? 'Lesiones Personales' : 'Personal Injury'}</option>
                  <option value="Family Law">{es ? 'Derecho de Familia' : 'Family Law'}</option>
                  <option value="Other">{es ? 'Otro' : 'Other'}</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(248,244,236,0.6)', display: 'block', marginBottom: 6 }}>{es ? 'Rol que necesitas *' : 'Role needed *'}</label>
                <select name="role" value={form.role} onChange={handle} required style={{ ...inp, appearance: 'none' }}>
                  <option value="">{es ? 'Seleccionar' : 'Select role'}</option>
                  <option value="Intake Specialist">{es ? 'Especialista de Admisión' : 'Intake Specialist'}</option>
                  <option value="Legal Receptionist">{es ? 'Recepcionista Legal' : 'Legal Receptionist'}</option>
                  <option value="Case Follow-up">{es ? 'Seguimiento de Casos' : 'Case Follow-up'}</option>
                  <option value="Admin & CRM">{es ? 'Administrativo y CRM' : 'Admin & CRM'}</option>
                  <option value="Other">{es ? 'Otro' : 'Other'}</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(248,244,236,0.6)', display: 'block', marginBottom: 6 }}>{es ? 'Mensaje (opcional)' : 'Message (optional)'}</label>
                <textarea name="message" value={form.message} onChange={handle} rows={3} style={{ ...inp, resize: 'none', fontFamily: 'inherit' }} />
              </div>
              <button type="submit" disabled={busy} style={{ width: '100%', background: busy ? '#64748b' : teal, color: '#fff', border: 'none', borderRadius: 10, padding: '14px', fontSize: 15, fontWeight: 700, cursor: busy ? 'not-allowed' : 'pointer' }}>
                {busy ? (es ? 'Enviando...' : 'Sending...') : (es ? 'Solicitar candidatos' : 'Request candidates')}
              </button>
              {sendError && (
                <p role="alert" style={{ fontSize: 13, color: '#fecaca', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)', borderRadius: 8, padding: '10px 12px', margin: 0, lineHeight: 1.6 }}>
                  {es ? 'Lo sentimos, tu solicitud no pudo enviarse. Intenta de nuevo o escríbenos a careers@selectivecrew.com.' : 'Sorry, your request couldn’t be sent. Please try again or email us at careers@selectivecrew.com.'}
                </p>
              )}
              <p style={{ fontSize: 12, color: 'rgba(248,244,236,0.3)', textAlign: 'center', margin: 0 }}>
                {es ? 'Sin compromiso.' : 'No commitment.'}
              </p>
            </form>
          )}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginTop: 24 }}>
            <span style={{ fontSize: 14, color: 'rgba(248,244,236,0.55)' }}>{es ? '¿Prefieres hablar?' : 'Prefer to talk?'}</span>
            <a href={CAL_LINK} {...(CAL_EXTERNAL ? { target: '_blank', rel: 'noopener noreferrer' } : {})} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: '#f8f4ec', padding: '11px 22px', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none', border: '1.5px solid rgba(248,244,236,0.25)' }}>
              {es ? 'Agenda una llamada de 15 min' : 'Book a 15-min call'}
            </a>
          </div>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section style={{ padding: '32px 24px', background: '#f8fafc' }}>
        <p style={{ maxWidth: 900, margin: '0 auto', fontSize: 12, color: '#64748b', lineHeight: 1.7 }}>
          {es ? 'Selective Crew presta servicios de reclutamiento y coordinación de personal y no es una firma de abogados. Las firmas clientes dirigen y supervisan todo el trabajo realizado y son las únicas responsables de la asesoría legal, la relación con sus clientes, la protección de datos y el cumplimiento de las normas profesionales y legales aplicables. No se garantizan resultados. Los servicios se prestan bajo un acuerdo escrito firmado antes de iniciar cualquier colaboración.' : 'Selective Crew provides recruitment and staffing coordination services and is not a law firm. Client firms direct and supervise all work performed and remain solely responsible for legal advice, client relationships, data protection and compliance with applicable professional and legal rules. Results are not guaranteed. Services are provided under a written agreement signed before any engagement begins.'}
        </p>
      </section>

    </div>
  );
}
