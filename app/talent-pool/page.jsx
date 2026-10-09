'use client';
import { useState } from 'react';
import { useLang } from '../../lib/LanguageContext';
import { db, storage } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const navy = "#0a1628";
const ocean = "#0e4d8a";
const gold = "#f0a500";

const NATIONALITIES = [
  { value: 'Colombia', label_en: 'Colombia', label_es: 'Colombia' },
  { value: 'Peru', label_en: 'Peru', label_es: 'Peru' },
  { value: 'Ecuador', label_en: 'Ecuador', label_es: 'Ecuador' },
  { value: 'Chile', label_en: 'Chile', label_es: 'Chile' },
  { value: 'Argentina', label_en: 'Argentina', label_es: 'Argentina' },
  { value: 'Panama', label_en: 'Panama', label_es: 'Panama' },
  { value: 'Dominican Republic', label_en: 'Dominican Republic', label_es: 'Republica Dominicana' },
  { value: 'Mexico', label_en: 'Mexico', label_es: 'Mexico' },
  { value: 'Venezuela', label_en: 'Venezuela', label_es: 'Venezuela' },
  { value: 'Costa Rica', label_en: 'Costa Rica', label_es: 'Costa Rica' },
  { value: 'Paraguay', label_en: 'Paraguay', label_es: 'Paraguay' },
  { value: 'Uruguay', label_en: 'Uruguay', label_es: 'Uruguay' },
];

// Content types accepted by the cvs/ Storage rule; set explicitly because some
// browsers report an empty type for .doc/.docx files.
const CV_TYPES = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};
const CV_MAX_BYTES = 3 * 1024 * 1024;

function cvProblem(file, es) {
  if (!file) return es ? 'Sube tu CV (PDF, DOC o DOCX, maximo 3 MB).' : 'Please upload your CV (PDF, DOC or DOCX, max 3 MB).';
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  if (!CV_TYPES[ext]) return es ? 'Formato no valido. Sube un archivo PDF, DOC o DOCX.' : 'Invalid file type. Please upload a PDF, DOC or DOCX file.';
  if (file.size > CV_MAX_BYTES) return es ? 'Tu CV supera 3 MB. Sube un archivo mas pequeno.' : 'Your CV is larger than 3 MB. Please upload a smaller file.';
  return '';
}

export default function TalentPoolPage() {
  const { lang } = useLang();
  const es = lang === 'es';
  const [form, setForm] = useState({ name: '', email: '', whatsapp: '', nationality: '', position: '', english: '', experience: '' });
  const [cvFile, setCvFile] = useState(null);
  const [errors, setErrors] = useState({ nationality: '', cv: '' });
  const [status, setStatus] = useState('idle');

  const positions = [
    { value: 'retail-sales', label_en: 'Retail Sales Associate', label_es: 'Asociado de Ventas' },
    { value: 'jewelry', label_en: 'Fine Jewelry Specialist', label_es: 'Especialista en Joyeria' },
    { value: 'manager', label_en: 'Assistant Retail Sales Manager', label_es: 'Asistente de Gerente de Ventas' },
    { value: 'photographer', label_en: 'Photographer (NCL)', label_es: 'Fotografo (NCL)' },
    { value: 'any', label_en: 'Any Position', label_es: 'Cualquier Posicion' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {
      nationality: form.nationality ? '' : (es ? 'Selecciona tu nacionalidad.' : 'Please select your nationality.'),
      cv: cvProblem(cvFile, es),
    };
    setErrors(nextErrors);
    if (nextErrors.nationality || nextErrors.cv) return;
    setStatus('loading');
    try {
      const ext = cvFile.name.split('.').pop().toLowerCase();
      const cvRef = ref(storage, 'cvs/' + globalThis.crypto.randomUUID() + '.cv');
      await uploadBytes(cvRef, cvFile, { contentType: CV_TYPES[ext] });
      const cvUrl = await getDownloadURL(cvRef);
      await addDoc(collection(db, 'talent_pool'), {
        ...form, cvUrl, cvFileName: cvFile.name.slice(0, 150), createdAt: serverTimestamp(),
      });
      setStatus('success');
    } catch (err) {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div style={{ minHeight: '100vh', background: '#f8faff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ background: '#fff', borderRadius: 24, padding: '60px 40px', maxWidth: 480, width: '100%', textAlign: 'center', boxShadow: '0 8px 40px rgba(14,77,138,0.12)' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: navy, marginBottom: 12 }}>
            {es ? 'Bienvenido al Talent Pool!' : 'Welcome to the Talent Pool!'}
          </h2>
          <p style={{ color: '#666', lineHeight: 1.7, marginBottom: 28 }}>
            {es
              ? 'Hemos guardado tu perfil. Te contactaremos por WhatsApp cuando tengamos una posicion que coincida con tu perfil.'
              : 'We have saved your profile. We will contact you via WhatsApp when we have a position that matches your profile.'}
          </p>
          <a href="/" style={{ display: 'inline-block', background: gold, color: navy, borderRadius: 12, padding: '14px 32px', fontSize: 15, fontWeight: 800, textDecoration: 'none' }}>
            {es ? 'Volver al Inicio' : 'Back to Home'}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <section style={{ background: `linear-gradient(135deg, ${navy} 0%, ${ocean} 100%)`, color: '#fff', padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: gold, textTransform: 'uppercase', marginBottom: 14 }}>
            {es ? 'Talent Pool' : 'Talent Pool'}
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16 }}>
            {es ? 'No Estas Listo Todavia? Guardamos Tu Perfil' : "Not Ready Yet? We'll Keep Your Profile"}
          </h1>
          <p style={{ fontSize: 16, color: '#b8d0f0', lineHeight: 1.8 }}>
            {es
              ? 'Registrate en nuestro Talent Pool y te avisaremos cuando tengamos la posicion perfecta para ti.'
              : "Join our Talent Pool and we'll notify you when the perfect position opens up."}
          </p>
        </div>
      </section>

      <section style={{ padding: '60px 20px', background: '#f8faff' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <div style={{ background: '#fff', borderRadius: 24, padding: '40px', boxShadow: '0 4px 24px rgba(14,77,138,0.08)' }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: navy, marginBottom: 8 }}>
              {es ? 'Tu Informacion' : 'Your Information'}
            </h2>
            <p style={{ color: '#888', fontSize: 14, marginBottom: 28 }}>
              {es ? 'Completa tu perfil y te contactamos.' : 'Fill in your profile and we will contact you.'}
            </p>
            <form onSubmit={handleSubmit}>
              {[
                { key: 'name', label_en: 'Full Name', label_es: 'Nombre Completo', type: 'text', required: true },
                { key: 'email', label_en: 'Email Address', label_es: 'Correo Electronico', type: 'email', required: true },
                { key: 'whatsapp', label_en: 'WhatsApp Number (with country code)', label_es: 'WhatsApp (con codigo de pais)', type: 'tel', required: true },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 }}>
                    {es ? f.label_es : f.label_en}
                  </label>
                  <input
                    type={f.type}
                    required={f.required}
                    value={form[f.key]}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #e0e8f4', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              ))}

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 }}>
                  {es ? 'Nacionalidad' : 'Nationality'} <span style={{ color: '#e85d4a' }}>*</span>
                </label>
                <select
                  value={form.nationality}
                  onChange={e => { setForm({ ...form, nationality: e.target.value }); setErrors({ ...errors, nationality: '' }); }}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid ' + (errors.nationality ? '#e24b4a' : '#e0e8f4'), fontSize: 14, outline: 'none', background: '#fff', boxSizing: 'border-box' }}>
                  <option value="">{es ? 'Selecciona tu nacionalidad' : 'Select your nationality'}</option>
                  {NATIONALITIES.map(n => (
                    <option key={n.value} value={n.value}>{es ? n.label_es : n.label_en}</option>
                  ))}
                </select>
                {errors.nationality && <p style={{ color: '#c0392b', fontSize: 12, marginTop: 6 }}>{errors.nationality}</p>}
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 }}>
                  {es ? 'Posicion de Interes' : 'Position of Interest'}
                </label>
                <select
                  value={form.position}
                  onChange={e => setForm({ ...form, position: e.target.value })}
                  required
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #e0e8f4', fontSize: 14, outline: 'none', background: '#fff', boxSizing: 'border-box' }}>
                  <option value="">{es ? 'Selecciona una posicion' : 'Select a position'}</option>
                  {positions.map(p => (
                    <option key={p.value} value={p.value}>{es ? p.label_es : p.label_en}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 }}>
                  {es ? 'Nivel de Ingles' : 'English Level'}
                </label>
                <select
                  value={form.english}
                  onChange={e => setForm({ ...form, english: e.target.value })}
                  required
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #e0e8f4', fontSize: 14, outline: 'none', background: '#fff', boxSizing: 'border-box' }}>
                  <option value="">{es ? 'Selecciona tu nivel' : 'Select your level'}</option>
                  <option value="basic">{es ? 'Basico' : 'Basic'}</option>
                  <option value="intermediate">{es ? 'Intermedio' : 'Intermediate'}</option>
                  <option value="advanced">{es ? 'Avanzado' : 'Advanced'}</option>
                  <option value="fluent">{es ? 'Fluido' : 'Fluent'}</option>
                </select>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 }}>
                  {es ? 'CV / Hoja de vida' : 'Resume / CV'} <span style={{ color: '#e85d4a' }}>*</span>
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={e => {
                    const file = e.target.files?.[0] || null;
                    setCvFile(file);
                    setErrors({ ...errors, cv: file ? cvProblem(file, es) : '' });
                  }}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px dashed ' + (errors.cv ? '#e24b4a' : '#c9d6ea'), fontSize: 13, background: '#fff', boxSizing: 'border-box' }}
                />
                <p style={{ color: '#888', fontSize: 11, marginTop: 6 }}>{es ? 'PDF, DOC o DOCX. Maximo 3 MB.' : 'PDF, DOC or DOCX. Max 3 MB.'}</p>
                <p style={{ background: '#fdecea', border: '1px solid #e24b4a', borderRadius: 8, padding: '8px 12px', color: '#b42318', fontSize: 12, fontWeight: 700, lineHeight: 1.5, margin: '6px 0 0' }}>
                  {es
                    ? '⚠️ Tu CV debe estar en inglés. Los CV enviados en otro idioma no serán considerados.'
                    : '⚠️ Your CV must be in English. CVs submitted in any other language will not be considered.'}
                </p>
                <p style={{ color: '#64748b', fontSize: 12, lineHeight: 1.5, margin: '6px 0 0' }}>
                  {es
                    ? 'Debido al alto volumen de aplicaciones, solo los candidatos que cumplan con los requisitos del cargo serán contactados.'
                    : 'Due to the high volume of applications, only candidates who meet the position requirements will be contacted.'}
                </p>
                {errors.cv && <p style={{ color: '#c0392b', fontSize: 12, marginTop: 4 }}>{errors.cv}</p>}
              </div>

              <div style={{ marginBottom: 28 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 }}>
                  {es ? 'Experiencia relevante (opcional)' : 'Relevant experience (optional)'}
                </label>
                <textarea
                  value={form.experience}
                  onChange={e => setForm({ ...form, experience: e.target.value })}
                  rows={3}
                  placeholder={es ? 'Retail, ventas, hosteleria...' : 'Retail, sales, hospitality...'}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #e0e8f4', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                style={{ width: '100%', background: gold, color: navy, border: 'none', borderRadius: 12, padding: '16px', fontSize: 16, fontWeight: 800, cursor: 'pointer' }}>
                {status === 'loading'
                  ? (es ? 'Guardando...' : 'Saving...')
                  : (es ? 'Unirme al Talent Pool →' : 'Join the Talent Pool →')}
              </button>

              {status === 'error' && (
                <p style={{ color: 'red', fontSize: 13, textAlign: 'center', marginTop: 12 }}>
                  {es ? 'Error. Intentalo de nuevo.' : 'Error. Please try again.'}
                </p>
              )}
            </form>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 32 }}>
            {[
              { icon: '🔔', title_en: 'Priority Alerts', title_es: 'Alertas Prioritarias', desc_en: 'First to know when positions open', desc_es: 'Primero en saber cuando abren posiciones' },
              { icon: '💬', title_en: 'WhatsApp Contact', title_es: 'Contacto WhatsApp', desc_en: 'We reach out directly to you', desc_es: 'Te contactamos directamente' },
              { icon: '🌍', title_en: 'No Commitment', title_es: 'Sin Compromiso', desc_en: 'Free to apply when ready', desc_es: 'Libre de aplicar cuando estes listo' },
            ].map(item => (
              <div key={item.icon} style={{ background: '#fff', borderRadius: 16, padding: 20, textAlign: 'center', boxShadow: '0 2px 12px rgba(14,77,138,0.06)' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</div>
                <p style={{ fontSize: 13, fontWeight: 700, color: navy, marginBottom: 4 }}>{es ? item.title_es : item.title_en}</p>
                <p style={{ fontSize: 11, color: '#888' }}>{es ? item.desc_es : item.desc_en}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
