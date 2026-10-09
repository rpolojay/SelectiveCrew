'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useLang } from '../lib/LanguageContext';

const LATAM_COUNTRIES = [
  'Colombia', 'Chile', 'Argentina', 'Mexico', 'Peru',
  'Ecuador', 'Panama', 'Costa Rica', 'Venezuela',
  'Uruguay', 'Dominican Republic',
];

const LATAM_COUNTRIES_ES = [
  'Colombia', 'Chile', 'Argentina', 'Mexico', 'Peru',
  'Ecuador', 'Panama', 'Costa Rica', 'Venezuela',
  'Uruguay', 'Republica Dominicana',
];

export default function WhatsAppButton() {
  const { lang } = useLang();
  const es = lang === 'es';
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [country, setCountry] = useState('');
  const [speaksEnglish, setSpeaksEnglish] = useState(null);
  const [questionType, setQuestionType] = useState(null);

  if (pathname && pathname.startsWith('/portal')) return null;

  const phone = '573224849050';
  const green = '#25D366';
  const navy = '#0a1628';
  const ocean = '#0e4d8a';
  const gold = '#f0a500';

  const handleWhatsApp = () => {
    const message = es
      ? `Hola! Soy de ${country} y tengo una consulta general sobre Selective Crew.`
      : `Hello! I am from ${country} and I have a general question about Selective Crew.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setStep(1);
    setCountry('');
    setSpeaksEnglish(null);
    setQuestionType(null);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div onClick={handleClose}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9998 }} />
      )}

      {/* Modal */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 100, left: 20, zIndex: 9999,
          background: '#fff', borderRadius: 20, padding: '24px 20px',
          width: 320, maxWidth: 'calc(100vw - 40px)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
          fontFamily: 'system-ui, sans-serif',
        }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 40, height: 40, background: green, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 800, color: navy, margin: 0 }}>Selective Crew</p>
                <p style={{ fontSize: 11, color: '#888', margin: 0 }}>WhatsApp</p>
              </div>
            </div>
            <button onClick={handleClose}
              style={{ background: '#f0f4fb', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', fontSize: 14, color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ✕
            </button>
          </div>

          {/* Important notice */}
          <div style={{ background: '#fff8e1', border: '1px solid #ffe082', borderRadius: 12, padding: '12px 14px', marginBottom: 20 }}>
            <p style={{ fontSize: 12, fontWeight: 800, color: '#92400e', marginBottom: 4 }}>
              ⚠️ {es ? 'Aviso importante' : 'Important notice'}
            </p>
            <p style={{ fontSize: 12, color: '#78350f', lineHeight: 1.6, margin: 0 }}>
              {es
                ? 'Si quieres postularte a un trabajo, no uses WhatsApp. Todas las vacantes abiertas estan en esta pagina web y debes aplicar aqui. WhatsApp es solo para preguntas generales.'
                : 'If you want to apply for a job, do not use WhatsApp. All open positions are posted on this website and applications must be submitted here. WhatsApp is for general questions only.'}
            </p>
            <a href="/jobs" onClick={handleClose}
              style={{ display: 'inline-block', marginTop: 10, background: navy, color: '#fff', borderRadius: 8, padding: '8px 14px', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
              {es ? 'Ver Posiciones Abiertas →' : 'View Open Positions →'}
            </a>
          </div>

          {/* Progress dots */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 18, justifyContent: 'center' }}>
            {[1, 2, 3].map(s => (
              <div key={s} style={{ width: s === step ? 20 : 8, height: 8, borderRadius: 4, background: s <= step ? green : '#e0e8f4', transition: 'all 0.3s' }} />
            ))}
          </div>

          {/* Step 1 — What is your question about? */}
          {step === 1 && (
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: navy, marginBottom: 6 }}>
                {es ? 'Sobre que es tu pregunta?' : 'What is your question about?'}
              </p>
              <p style={{ fontSize: 11, color: '#888', marginBottom: 14 }}>
                {es ? 'Selecciona el tipo de consulta.' : 'Select the type of inquiry.'}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {[
                  { val: 'general', icon: '💬', label_en: 'General question about Selective Crew', label_es: 'Pregunta general sobre Selective Crew' },
                  { val: 'requirements', icon: '📋', label_en: 'Questions about job requirements', label_es: 'Preguntas sobre requisitos del trabajo' },
                  { val: 'process', icon: '🔄', label_en: 'Questions about the hiring process', label_es: 'Preguntas sobre el proceso de contratacion' },
                  { val: 'apply', icon: '📝', label_en: 'I want to apply for a job', label_es: 'Quiero aplicar a un trabajo' },
                ].map(opt => (
                  <button key={opt.val} onClick={() => setQuestionType(opt.val)}
                    style={{ padding: '12px 14px', borderRadius: 12, border: questionType === opt.val ? `2px solid ${ocean}` : '2px solid #e0e8f4', background: questionType === opt.val ? '#f0f7ff' : '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: navy, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 18 }}>{opt.icon}</span>
                    {es ? opt.label_es : opt.label_en}
                  </button>
                ))}
              </div>

              {/* If they want to apply — redirect to website */}
              {questionType === 'apply' && (
                <div style={{ background: '#f0f7ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: '14px', marginBottom: 12 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: ocean, marginBottom: 6 }}>
                    {es ? 'Para aplicar, ve a nuestra pagina de empleos.' : 'To apply, visit our jobs page.'}
                  </p>
                  <p style={{ fontSize: 12, color: '#555', marginBottom: 12, lineHeight: 1.6 }}>
                    {es
                      ? 'Todas las posiciones abiertas estan listadas en el sitio web. Las aplicaciones deben enviarse alli, no por WhatsApp.'
                      : 'All open positions are listed on the website. Applications must be submitted there, not via WhatsApp.'}
                  </p>
                  <a href="/jobs" onClick={handleClose}
                    style={{ display: 'block', textAlign: 'center', background: navy, color: '#fff', borderRadius: 10, padding: '12px', fontSize: 13, fontWeight: 800, textDecoration: 'none' }}>
                    {es ? 'Ver Todas las Posiciones →' : 'View All Open Positions →'}
                  </a>
                </div>
              )}

              {questionType && questionType !== 'apply' && (
                <button onClick={() => setStep(2)}
                  style={{ width: '100%', background: green, color: '#fff', border: 'none', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                  {es ? 'Continuar →' : 'Continue →'}
                </button>
              )}
            </div>
          )}

          {/* Step 2 — Country */}
          {step === 2 && (
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: navy, marginBottom: 6 }}>
                {es ? 'De que pais eres?' : 'Which country are you from?'}
              </p>
              <p style={{ fontSize: 11, color: '#888', marginBottom: 12 }}>
                {es ? 'Solo atendemos candidatos de America Latina.' : 'We only assist candidates from Latin America.'}
              </p>
              <select value={country} onChange={e => setCountry(e.target.value)}
                style={{ width: '100%', padding: '11px 12px', borderRadius: 10, border: '1.5px solid #e0e8f4', fontSize: 14, outline: 'none', background: '#fff', boxSizing: 'border-box', marginBottom: 12 }}>
                <option value="">{es ? 'Seleccionar pais...' : 'Select country...'}</option>
                {(es ? LATAM_COUNTRIES_ES : LATAM_COUNTRIES).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="OTHER">{es ? 'Otro pais' : 'Other country'}</option>
              </select>

              <div style={{ background: '#f0f7ff', borderRadius: 10, padding: '10px 12px', marginBottom: 14 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: ocean, marginBottom: 4 }}>
                  {es ? 'Paises atendidos:' : 'Countries we serve:'}
                </p>
                <p style={{ fontSize: 11, color: '#555', lineHeight: 1.6 }}>
                  Colombia, Chile, Argentina, Mexico, Peru, Ecuador, Panama, Costa Rica, Venezuela, Uruguay, {es ? 'Rep. Dominicana' : 'Dominican Republic'}
                </p>
              </div>

              {country === 'OTHER' ? (
                <div style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 10, padding: '12px', marginBottom: 12 }}>
                  <p style={{ fontSize: 12, color: '#991b1b', fontWeight: 600, marginBottom: 6 }}>
                    {es ? 'Lo sentimos, actualmente solo atendemos candidatos de America Latina.' : 'Sorry, we currently only serve candidates from Latin America.'}
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setStep(1)}
                    style={{ flex: 1, background: '#f0f4fb', color: '#555', border: 'none', borderRadius: 10, padding: '12px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    ← {es ? 'Atras' : 'Back'}
                  </button>
                  <button onClick={() => country && country !== 'OTHER' && setStep(3)} disabled={!country || country === 'OTHER'}
                    style={{ flex: 2, background: country && country !== 'OTHER' ? green : '#ccc', color: '#fff', border: 'none', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 700, cursor: country && country !== 'OTHER' ? 'pointer' : 'not-allowed' }}>
                    {es ? 'Continuar →' : 'Continue →'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 3 — English */}
          {step === 3 && (
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: navy, marginBottom: 6 }}>
                {es ? 'Hablas ingles?' : 'Do you speak English?'}
              </p>
              <p style={{ fontSize: 11, color: '#888', marginBottom: 16 }}>
                {es ? 'Nuestro equipo atiende en ingles y espanol.' : 'Our team responds in English and Spanish.'}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                {[
                  { val: true, label_en: 'Yes', label_es: 'Si', icon: '✅' },
                  { val: false, label_en: 'No / Basic', label_es: 'No / Basico', icon: '🇪🇸' },
                ].map(opt => (
                  <button key={String(opt.val)} onClick={() => setSpeaksEnglish(opt.val)}
                    style={{ padding: '14px 10px', borderRadius: 12, border: speaksEnglish === opt.val ? `2px solid ${green}` : '2px solid #e0e8f4', background: speaksEnglish === opt.val ? '#f0fff4' : '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: navy }}>
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{opt.icon}</div>
                    {es ? opt.label_es : opt.label_en}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <button onClick={() => setStep(2)}
                  style={{ flex: 1, background: '#f0f4fb', color: '#555', border: 'none', borderRadius: 10, padding: '12px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  ← {es ? 'Atras' : 'Back'}
                </button>
                {speaksEnglish !== null && (
                  <button onClick={handleWhatsApp}
                    style={{ flex: 2, background: green, color: '#fff', border: 'none', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    {es ? 'Abrir WhatsApp' : 'Open WhatsApp'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Fixed button + notice */}
      <div style={{ position: 'fixed', bottom: 20, left: 20, zIndex: 9997, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
        
        {/* Button */}
        <button onClick={() => setOpen(!open)}
          style={{ display: 'flex', alignItems: 'center', gap: 10, background: green, color: '#fff', padding: '10px 14px', borderRadius: 50, boxShadow: '0 4px 24px rgba(37,211,102,0.4)', border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700, fontFamily: 'system-ui, sans-serif' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          {es ? 'WhatsApp – Solo Preguntas' : 'WhatsApp – Questions Only'}
        </button>
        {/* Sub-label */}
        <p style={{ fontSize: 11, color: '#fff', margin: 0, textAlign: 'left', fontWeight: 600, textShadow: '0 1px 4px rgba(0,0,0,0.8)', background: 'rgba(0,0,0,0.4)', borderRadius: 6, padding: '3px 8px' }}>
          {es ? 'No para aplicaciones' : 'Not for job applications'}
        </p>
      </div>
    </>
  );
}

