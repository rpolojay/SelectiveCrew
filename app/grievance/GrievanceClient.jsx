'use client';
import { useState } from 'react';
import { useLang } from '../../lib/LanguageContext';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const navy = "#0a1628";
const ocean = "#0e4d8a";
const gold = "#f0a500";

const GRIEVANCE_TYPES_EN = [
  'Discrimination or Harassment',
  'Unfair Treatment During Recruitment',
  'Breach of Confidentiality',
  'Unprofessional Conduct by Staff',
  'Misleading Job Information',
  'Delayed or No Response from Recruiter',
  'MLC 2006 Standards Concern',
  'Other',
];

const GRIEVANCE_TYPES_ES = [
  'Discriminacion o Acoso',
  'Trato Injusto Durante el Reclutamiento',
  'Violacion de Confidencialidad',
  'Conducta No Profesional del Personal',
  'Informacion de Trabajo Engañosa',
  'Respuesta Tardía o Nula del Reclutador',
  'Preocupacion sobre Estandares MLC 2006',
  'Otro',
];

export default function GrievancePage() {
  const { lang } = useLang();
  const es = lang === 'es';
  const [status, setStatus] = useState('idle');
  const [refNumber, setRefNumber] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    whatsapp: '',
    country: '',
    grievanceType: '',
    description: '',
    date: '',
    evidence: '',
    anonymous: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.grievanceType || !form.description) return;
    setStatus('loading');
    try {
      const ref = 'GRV-' + Date.now().toString().slice(-6);
      await addDoc(collection(db, 'grievances'), {
        ...form,
        referenceNumber: ref,
        status: 'received',
        createdAt: serverTimestamp(),
      });
      setRefNumber(ref);
      setStatus('success');
    } catch (err) {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div style={{ minHeight: '100vh', background: '#f0f4fb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ background: '#fff', borderRadius: 24, padding: '48px 36px', maxWidth: 520, width: '100%', textAlign: 'center', boxShadow: '0 8px 48px rgba(14,77,138,0.12)' }}>
          <div style={{ width: 72, height: 72, background: '#d1fae5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: navy, marginBottom: 12 }}>
            {es ? 'Queja Recibida' : 'Grievance Received'}
          </h2>
          <p style={{ color: '#666', lineHeight: 1.8, marginBottom: 20 }}>
            {es
              ? 'Tu queja ha sido registrada de forma confidencial. Nuestro equipo la revisara dentro de 5 dias habiles.'
              : 'Your grievance has been logged confidentially. Our team will review it within 5 business days.'}
          </p>
          <div style={{ background: '#f0f7ff', border: '1px solid #bfdbfe', borderRadius: 14, padding: '16px 20px', marginBottom: 24 }}>
            <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
              {es ? 'Numero de Referencia' : 'Reference Number'}
            </p>
            <p style={{ fontSize: 22, fontWeight: 800, color: ocean, letterSpacing: 2 }}>{refNumber}</p>
            <p style={{ fontSize: 12, color: '#888', marginTop: 6 }}>
              {es ? 'Guarda este numero para dar seguimiento a tu caso.' : 'Save this number to follow up on your case.'}
            </p>
          </div>
          <p style={{ fontSize: 13, color: '#888', marginBottom: 24, lineHeight: 1.7 }}>
            {es
              ? 'Si proporcionaste tu email, recibiras una confirmacion. Puedes contactarnos en careers@selectivecrew.com con tu numero de referencia.'
              : 'If you provided your email, you will receive a confirmation. You can follow up at careers@selectivecrew.com with your reference number.'}
          </p>
          <a href="/" style={{ display: 'inline-block', background: navy, color: '#fff', borderRadius: 12, padding: '13px 32px', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
            {es ? 'Volver al Inicio' : 'Back to Home'}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#f0f4fb', minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, ${navy} 0%, ${ocean} 100%)`, color: '#fff', padding: '60px 20px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: gold, textTransform: 'uppercase', marginBottom: 12 }}>
            {es ? 'Politica de Quejas' : 'Grievance Policy'}
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 16 }}>
            {es ? 'Formulario de Queja Formal' : 'Formal Grievance Form'}
          </h1>
          <p style={{ color: '#b8d0f0', fontSize: 15, lineHeight: 1.8, marginBottom: 24 }}>
            {es
              ? 'Selective Crew se compromete a tratar a todos los candidatos, empleadores y partes interesadas con justicia, respeto y profesionalismo. Si has experimentado algo que no cumplio con este estandar, queremos saberlo.'
              : 'Selective Crew is committed to treating all candidates, employers, and stakeholders with fairness, respect, and professionalism. If you have experienced something that fell short of this standard, we want to know.'}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { icon: '🔒', title_en: 'Confidential', title_es: 'Confidencial', desc_en: 'All reports handled privately', desc_es: 'Todos los informes son privados' },
              { icon: '⚖️', title_en: 'Fair Process', title_es: 'Proceso Justo', desc_en: 'Impartial review by management', desc_es: 'Revision imparcial por la direccion' },
              { icon: '📋', title_en: '5 Business Days', title_es: '5 Dias Habiles', desc_en: 'Response within 5 business days', desc_es: 'Respuesta en 5 dias habiles' },
            ].map((item, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px 14px', textAlign: 'center' }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{item.icon}</div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{es ? item.title_es : item.title_en}</p>
                <p style={{ fontSize: 11, color: '#b8d0f0' }}>{es ? item.desc_es : item.desc_en}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Policy Summary */}
      <section style={{ padding: '40px 20px 0' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: '28px 32px', boxShadow: '0 2px 16px rgba(14,77,138,0.06)', border: '1px solid #e8eef8', marginBottom: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: navy, marginBottom: 16 }}>
              {es ? 'Nuestra Politica de Quejas' : 'Our Grievance Policy'}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { en: 'All grievances are taken seriously and handled with full confidentiality.', es: 'Todas las quejas se toman en serio y se manejan con total confidencialidad.' },
                { en: 'You will receive a reference number upon submission to track your case.', es: 'Recibiras un numero de referencia al enviar para rastrear tu caso.' },
                { en: 'Our management team will review your grievance within 5 business days.', es: 'Nuestro equipo directivo revisara tu queja en 5 dias habiles.' },
                { en: 'No person who submits a grievance in good faith will face retaliation of any kind.', es: 'Ninguna persona que presente una queja de buena fe enfrentara represalias de ningun tipo.' },
                { en: 'If your grievance relates to MLC 2006 standards, it will be escalated to our standards officer.', es: 'Si tu queja se relaciona con los estandares MLC 2006, sera escalada a nuestro oficial de estandares.' },
                { en: 'Anonymous submissions are accepted, though they may limit our ability to investigate fully.', es: 'Se aceptan envios anonimos, aunque pueden limitar nuestra capacidad de investigar completamente.' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ color: '#16a34a', fontWeight: 700, flexShrink: 0 }}>✓</span>
                  <p style={{ fontSize: 14, color: '#555', lineHeight: 1.7 }}>{es ? item.es : item.en}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section style={{ padding: '0 20px 60px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: '36px 32px', boxShadow: '0 4px 24px rgba(14,77,138,0.08)', border: '1px solid #e8eef8' }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: navy, marginBottom: 6 }}>
              {es ? 'Enviar Queja' : 'Submit Grievance'}
            </h2>
            <p style={{ fontSize: 13, color: '#888', marginBottom: 28 }}>
              {es ? 'Los campos marcados con * son obligatorios.' : 'Fields marked with * are required.'}
            </p>

            <form onSubmit={handleSubmit}>

              {/* Anonymous toggle */}
              <div style={{ background: '#f8faff', borderRadius: 12, padding: '14px 18px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12, border: '1px solid #e8eef8' }}>
                <input type="checkbox" id="anon" checked={form.anonymous} onChange={e => setForm({ ...form, anonymous: e.target.checked })}
                  style={{ width: 18, height: 18, cursor: 'pointer', accentColor: ocean }} />
                <label htmlFor="anon" style={{ fontSize: 14, color: '#555', cursor: 'pointer', lineHeight: 1.5 }}>
                  <strong style={{ color: navy }}>{es ? 'Enviar anonimamente' : 'Submit anonymously'}</strong>
                  <br />
                  <span style={{ fontSize: 12, color: '#888' }}>
                    {es ? 'Tu identidad no sera revelada. Nota: esto puede limitar la investigacion.' : 'Your identity will not be disclosed. Note: this may limit the investigation.'}
                  </span>
                </label>
              </div>

              {/* Personal info — hidden if anonymous */}
              {!form.anonymous && (
                <div style={{ marginBottom: 8 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
                    {es ? 'Informacion Personal' : 'Personal Information'}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    {[
                      { key: 'fullName', label_en: 'Full Name *', label_es: 'Nombre Completo *', type: 'text', ph_en: 'Your full name', ph_es: 'Tu nombre completo' },
                      { key: 'email', label_en: 'Email Address *', label_es: 'Correo Electronico *', type: 'email', ph_en: 'your@email.com', ph_es: 'tu@correo.com' },
                      { key: 'whatsapp', label_en: 'WhatsApp', label_es: 'WhatsApp', type: 'tel', ph_en: '+57 300 000 0000', ph_es: '+57 300 000 0000' },
                      { key: 'country', label_en: 'Country', label_es: 'Pais', type: 'text', ph_en: 'Your country', ph_es: 'Tu pais' },
                    ].map(f => (
                      <div key={f.key}>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 5 }}>
                          {es ? f.label_es : f.label_en}
                        </label>
                        <input type={f.type} placeholder={es ? f.ph_es : f.ph_en}
                          value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                          style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #e0e8f4', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Grievance details */}
              <p style={{ fontSize: 12, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
                {es ? 'Detalles de la Queja' : 'Grievance Details'}
              </p>

              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 }}>
                  {es ? 'Tipo de Queja *' : 'Type of Grievance *'}
                </label>
                <select required value={form.grievanceType} onChange={e => setForm({ ...form, grievanceType: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #e0e8f4', fontSize: 14, outline: 'none', background: '#fff', boxSizing: 'border-box' }}>
                  <option value="">{es ? 'Seleccionar tipo...' : 'Select type...'}</option>
                  {(es ? GRIEVANCE_TYPES_ES : GRIEVANCE_TYPES_EN).map((type, i) => (
                    <option key={i} value={GRIEVANCE_TYPES_EN[i]}>{type}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 }}>
                  {es ? 'Fecha del Incidente' : 'Date of Incident'}
                </label>
                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #e0e8f4', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 }}>
                  {es ? 'Descripcion de la Queja *' : 'Description of Grievance *'}
                </label>
                <p style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>
                  {es
                    ? 'Describe lo que ocurrio con el mayor detalle posible. Incluye nombres, fechas, y cualquier contexto relevante.'
                    : 'Describe what happened in as much detail as possible. Include names, dates, and any relevant context.'}
                </p>
                <textarea required rows={6} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder={es ? 'Describe el incidente con detalle...' : 'Describe the incident in detail...'}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #e0e8f4', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'system-ui, sans-serif' }} />
              </div>

              <div style={{ marginBottom: 28 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 }}>
                  {es ? 'Evidencia o Documentacion (enlace)' : 'Evidence or Documentation (link)'}
                </label>
                <p style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>
                  {es
                    ? 'Si tienes capturas de pantalla, correos u otros documentos, subelos a Google Drive y pega el enlace aqui.'
                    : 'If you have screenshots, emails, or other documents, upload them to Google Drive and paste the link here.'}
                </p>
                <input type="url" value={form.evidence} onChange={e => setForm({ ...form, evidence: e.target.value })}
                  placeholder="https://drive.google.com/..."
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #e0e8f4', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              </div>

              {/* Declaration */}
              <div style={{ background: '#f8faff', borderRadius: 12, padding: '16px 18px', marginBottom: 24, border: '1px solid #e8eef8' }}>
                <p style={{ fontSize: 12, color: '#666', lineHeight: 1.7 }}>
                  {es
                    ? 'Al enviar este formulario, confirmo que la informacion proporcionada es veridica y completa segun mi leal saber y entender. Entiendo que las quejas falsas o maliciosas pueden tener consecuencias.'
                    : 'By submitting this form, I confirm that the information provided is truthful and complete to the best of my knowledge. I understand that false or malicious grievances may have consequences.'}
                </p>
              </div>

              {status === 'error' && (
                <p style={{ color: '#e85d4a', fontSize: 13, marginBottom: 16, background: '#fff5f5', padding: '10px 14px', borderRadius: 8 }}>
                  ⚠️ {es ? 'Error al enviar. Por favor intenta de nuevo.' : 'Error submitting. Please try again.'}
                </p>
              )}

              <button type="submit" disabled={status === 'loading'}
                style={{ width: '100%', background: status === 'loading' ? '#ccc' : navy, color: '#fff', border: 'none', borderRadius: 12, padding: '16px', fontSize: 15, fontWeight: 800, cursor: status === 'loading' ? 'not-allowed' : 'pointer' }}>
                {status === 'loading'
                  ? (es ? 'Enviando...' : 'Submitting...')
                  : (es ? 'Enviar Queja Formalmente →' : 'Submit Grievance Formally →')}
              </button>

              <p style={{ fontSize: 11, color: '#aaa', textAlign: 'center', marginTop: 14 }}>
                {es
                  ? 'Tu queja sera tratada con estricta confidencialidad por el equipo directivo de Selective Crew.'
                  : 'Your grievance will be handled with strict confidentiality by the Selective Crew management team.'}
              </p>
            </form>
          </div>

          {/* Contact alternative */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '24px 28px', marginTop: 20, boxShadow: '0 2px 12px rgba(14,77,138,0.06)', border: '1px solid #e8eef8', textAlign: 'center' }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: navy, marginBottom: 8 }}>
              {es ? 'Prefieres contactarnos directamente?' : 'Prefer to contact us directly?'}
            </p>
            <p style={{ fontSize: 13, color: '#666', marginBottom: 16 }}>
              {es ? 'Puedes enviarnos un correo en cualquier momento.' : 'You can email us at any time.'}
            </p>
            <a href="mailto:careers@selectivecrew.com"
              style={{ display: 'inline-block', background: ocean, color: '#fff', borderRadius: 10, padding: '12px 24px', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
              careers@selectivecrew.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
