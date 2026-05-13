'use client';
import { useState } from 'react';
import { useLang } from '../../lib/LanguageContext';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const navy = "#0a1628";
const ocean = "#0e4d8a";
const gold = "#f0a500";

export default function TalentPoolPage() {
  const { lang } = useLang();
  const es = lang === 'es';
  const [form, setForm] = useState({ name: '', email: '', whatsapp: '', country: '', position: '', english: '', experience: '' });
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
    setStatus('loading');
    try {
      await addDoc(collection(db, 'talent_pool'), { ...form, createdAt: serverTimestamp() });
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
                { key: 'country', label_en: 'Country', label_es: 'Pais', type: 'text', required: true },
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
