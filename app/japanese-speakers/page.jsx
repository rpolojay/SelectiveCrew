'use client';
import { useState, useEffect } from 'react';
import { useLang } from '../../lib/LanguageContext';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const navy = "#0a1628";
const ocean = "#0e4d8a";
const gold = "#f0a500";
const red = "#e8341a";
const japan = "#BC002D";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}


function scoreApplication(form) {
  let score = 0;
  const eng = (form.english || form.englishLevel || '').toLowerCase();
  if (eng.includes('advanced') || eng.includes('fluent') || eng.includes('avanzado')) score += 40;
  else if (eng.includes('intermediate') || eng.includes('intermedio') || eng.includes('upper')) score += 25;
  else if (eng.includes('basic') || eng.includes('basico')) score += 10;
  const exp = (form.salesExp || form.salesExperience || form.experience || '').toLowerCase();
  if (exp.includes('5+') || exp.includes('5 y') || exp.includes('more than 4') || exp.includes('mas de 4')) score += 30;
  else if (exp.includes('3-5') || exp.includes('3 a 5') || exp.includes('3') || exp.includes('4')) score += 22;
  else if (exp.includes('1-2') || exp.includes('1 a 2') || exp.includes('1') || exp.includes('2')) score += 15;
  else if (exp.includes('less') || exp.includes('menos') || exp.includes('<1')) score += 5;
  const passport = (form.passport || '').toLowerCase();
  if (passport.includes('valid') || passport.includes('vigente') || passport.includes('yes') || passport.includes('si')) score += 20;
  else if (passport.includes('process') || passport.includes('proceso') || passport.includes('applying')) score += 10;
  else score += 2;
  const avail = (form.availability || '').toLowerCase();
  if (avail.includes('immediately') || avail.includes('inmediato') || avail.includes('now') || avail.includes('ahora')) score += 10;
  else if (avail.includes('1-2') || avail.includes('1 a 2') || avail.includes('month')) score += 7;
  else if (avail.includes('3-6') || avail.includes('3 a 6')) score += 4;
  else score += 1;
  const grade = score >= 75 ? 'A' : score >= 45 ? 'B' : 'C';
  return { score, grade };
}

export default function JapaneseSpeakersPage() {
  const { lang } = useLang();
  const es = lang === 'es';
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('apply');
  const [spotsLeft, setSpotsLeft] = useState(12);
  const [form, setForm] = useState({ fullName: '', email: '', whatsapp: '', country: '', japaneseLevel: '', experience: '' });
  const [status, setStatus] = useState('idle');
  const [timeLeft, setTimeLeft] = useState({ days: 8, hours: 6, mins: 22, secs: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, mins, secs } = prev;
        secs--;
        if (secs < 0) { secs = 59; mins--; }
        if (mins < 0) { mins = 59; hours--; }
        if (hours < 0) { hours = 23; days--; }
        if (days < 0) return prev;
        return { days, hours, mins, secs };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [resumeFile, setResumeFile] = useState(null);
  const [resumeB64, setResumeB64] = useState('');
  function handleResume(file) {
    if (!file) return;
    setResumeFile(file);
    const r = new FileReader();
    r.onload = () => setResumeB64(r.result.split(',')[1]);
    r.readAsDataURL(file);
  }
  const handleSubmit = async (e) => {
    if (!resumeB64) { alert('Please upload your resume before submitting.'); return; }
    e.preventDefault();
    setStatus('loading');
    try {
      await fetch('/api/send-email', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({to:'careers@selectivecrew.com',subject:'Japanese Speakers Application - '+form.name,text:'Name: '+form.name+'\nEmail: '+form.email+'\nCountry: '+form.country+'\nWhatsApp: '+form.whatsapp,attachments:resumeB64?[{filename:resumeFile?resumeFile.name:'resume.pdf',content:resumeB64}]:[]})}); 
    const { score, grade } = scoreApplication(form);
      await addDoc(collection(db, 'applications'), { score, grade,
        ...form,
        position: 'Japanese Speaking Duty Free Sales Associate — Starboard',
        status: 'new',
        createdAt: serverTimestamp(),
      });
      setStatus('success');
      setSpotsLeft(prev => Math.max(0, prev - 1));
    } catch (err) {
      setStatus('error');
    }
  };

  const ApplyForm = () => (
    <div style={{ background: '#fff', borderRadius: 20, padding: '24px', boxShadow: '0 4px 24px rgba(14,77,138,0.10)', border: '1px solid #e8eef8' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h3 style={{ fontSize: 17, fontWeight: 800, color: navy }}>{es ? 'Aplicar Ahora' : 'Apply Now'}</h3>
        <span style={{ background: japan, color: '#fff', fontSize: 11, fontWeight: 800, borderRadius: 20, padding: '4px 10px' }}>
          ???? {spotsLeft} {es ? 'cupos' : 'spots left'}
        </span>
      </div>
      <p style={{ fontSize: 12, color: '#888', marginBottom: 16 }}>
        {es ? 'Te contactamos en 48h por WhatsApp.' : 'We contact you within 48h via WhatsApp.'}
      </p>
      {status === 'success' ? (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <div style={{ width: 56, height: 56, background: '#d1fae5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <p style={{ fontSize: 16, fontWeight: 800, color: navy, marginBottom: 6 }}>{es ? 'Aplicacion Recibida!' : 'Application Received!'}</p>
          <p style={{ fontSize: 13, color: '#666' }}>{es ? 'Te contactaremos por WhatsApp en 48 horas.' : 'We will contact you via WhatsApp within 48 hours.'}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {[
            { key: 'fullName', label_en: 'Full Name', label_es: 'Nombre Completo', type: 'text' },
            { key: 'email', label_en: 'Email', label_es: 'Correo', type: 'email' },
            { key: 'whatsapp', label_en: 'WhatsApp', label_es: 'WhatsApp', type: 'tel' },
            { key: 'country', label_en: 'Country', label_es: 'Pais', type: 'text' },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#666', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {es ? f.label_es : f.label_en}
              </label>
              <input type={f.type} required value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                style={{ width: '100%', padding: '11px 12px', borderRadius: 10, border: '1.5px solid #e0e8f4', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            </div>
          ))}
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#666', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {es ? 'Nivel de Japones' : 'Japanese Level'}
            </label>
            <select required value={form.japaneseLevel} onChange={e => setForm({ ...form, japaneseLevel: e.target.value })}
              style={{ width: '100%', padding: '11px 12px', borderRadius: 10, border: '1.5px solid #e0e8f4', fontSize: 14, outline: 'none', background: '#fff', boxSizing: 'border-box' }}>
              <option value="">{es ? 'Seleccionar' : 'Select'}</option>
              <option value="basic">{es ? 'Basico' : 'Basic'}</option>
              <option value="conversational">{es ? 'Conversacional' : 'Conversational'}</option>
              <option value="advanced">{es ? 'Avanzado' : 'Advanced'}</option>
              <option value="fluent">{es ? 'Fluido / Nativo' : 'Fluent / Native'}</option>
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#666', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {es ? 'Como aprendiste japones?' : 'How did you learn Japanese?'}
            </label>
            <textarea required rows={2} value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })}
              placeholder={es ? 'Estudie en Japon, trabaje con clientes...' : 'Studied in Japan, worked with clients...'}
              style={{ width: '100%', padding: '11px 12px', borderRadius: 10, border: '1.5px solid #e0e8f4', fontSize: 13, outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'system-ui' }} />
          </div>
          <div style={{marginBottom:16}}>
            <label style={{fontSize:13,fontWeight:600,color:'#0a1628',display:'block',marginBottom:6}}>Resume / CV <span style={{color:'#e85d4a'}}>*</span></label>
            <div onClick={()=>document.getElementById('rij').click()} style={{border:'2px dashed '+(resumeFile?'#0d9488':'#c8d6f0'),borderRadius:10,padding:'16px',textAlign:'center',cursor:'pointer',background:resumeFile?'#f0fdf9':'#fafbff'}}>
              {resumeFile?<span style={{fontSize:13,color:'#0d9488',fontWeight:600}}>{resumeFile.name}</span>:<span style={{fontSize:13,color:'#94a3b8'}}>Click to upload resume (PDF, DOC, DOCX)</span>}
            </div>
            <input id="rij" type="file" accept=".pdf,.doc,.docx" style={{display:'none'}} onChange={e=>handleResume(e.target.files[0])}/>
          </div>
          <button type="submit" disabled={status === 'loading'}
            style={{ width: '100%', background: status === 'loading' ? '#ccc' : japan, color: '#fff', border: 'none', borderRadius: 12, padding: '15px', fontSize: 15, fontWeight: 800, cursor: 'pointer' }}>
            {status === 'loading' ? (es ? 'Enviando...' : 'Sending...') : (es ? '???? Aplicar Ahora' : '???? Apply Now')}
          </button>
          <a href="https://wa.me/573224849050" target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#25d366', color: '#fff', borderRadius: 12, padding: '13px', fontSize: 14, fontWeight: 700, textDecoration: 'none', marginTop: 10 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            WhatsApp
          </a>
          <p style={{ fontSize: 11, color: '#aaa', textAlign: 'center', marginTop: 10 }}>
            {es ? '100% gratuito.' : '100% free. Never charged.'}
          </p>
            </form>
      )}
    </div>
  );

  const JobDetails = () => (
    <div>
      {/* Why Japanese */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 2px 12px rgba(14,77,138,0.06)', border: '1px solid #e8eef8' }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: navy, marginBottom: 10 }}>
          {es ? 'Por Que Hablantes de Japones?' : 'Why Japanese Speakers?'}
        </h2>
        <p style={{ fontSize: 13, color: '#555', lineHeight: 1.8 }}>
          {es
            ? 'Starboard opera tiendas duty-free en cruceros con alta concentracion de pasajeros japoneses. Los asociados que hablan japones generan ventas significativamente mas altas en destinos de Asia y el Pacifico.'
            : 'Starboard operates duty-free shops on cruise ships with high concentrations of Japanese passengers. Japanese-speaking associates generate significantly higher sales in Asia and Pacific destinations.'}
        </p>
      </div>

      {/* Key Requirement */}
      <div style={{ background: `linear-gradient(135deg, #1a0810, #2d0a14)`, borderRadius: 16, padding: 20, marginBottom: 16, color: '#fff' }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 10 }}>{es ? 'Requisito Principal' : 'Key Requirement'}</h2>
        <div style={{ background: 'rgba(188,0,45,0.15)', border: '1px solid rgba(188,0,45,0.3)', borderRadius: 10, padding: '14px' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>????</span>
            <p style={{ fontSize: 14, color: '#ff8a9e', fontWeight: 700, lineHeight: 1.5 }}>
              {es ? 'Japones conversacional a fluido — requisito principal innegociable.' : 'Conversational to fluent Japanese — the primary non-negotiable requirement.'}
            </p>
          </div>
        </div>
        <p style={{ fontSize: 12, color: '#8fb8e8', lineHeight: 1.7, marginTop: 10 }}>
          {es
            ? 'No necesitas ser nativo. Latinoamericanos que han estudiado japones o vivido en Japon son candidatos ideales.'
            : 'You do not need to be a native speaker. Latin Americans who have studied Japanese or lived in Japan are ideal.'}
        </p>
      </div>

      {/* Requirements */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 2px 12px rgba(14,77,138,0.06)', border: '1px solid #e8eef8' }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: navy, marginBottom: 12 }}>{es ? 'Requisitos' : 'Requirements'}</h2>
        {[
          { en: 'Conversational to fluent Japanese', es: 'Japones conversacional a fluido', hot: true },
          { en: 'Intermediate to advanced English', es: 'Ingles intermedio a avanzado', hot: false },
          { en: '21 years or older', es: '21 anos o mas', hot: false },
          { en: 'Retail or sales experience preferred', es: 'Experiencia en retail o ventas preferida', hot: false },
          { en: 'Outgoing personality', es: 'Personalidad extrovertida', hot: false },
          { en: 'Clean criminal record', es: 'Antecedentes penales limpios', hot: false },
          { en: 'Valid passport', es: 'Pasaporte vigente', hot: false },
          { en: 'No visible tattoos on face, neck or hands', es: 'Sin tatuajes en cara, cuello o manos', hot: false },
        ].map((r, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, padding: r.hot ? '8px 12px' : '2px 0', background: r.hot ? '#fff0f3' : 'transparent', borderRadius: r.hot ? 8 : 0, border: r.hot ? '1px solid #fecdd3' : 'none' }}>
            <span style={{ color: r.hot ? japan : '#16a34a', fontWeight: 800, flexShrink: 0, fontSize: r.hot ? 16 : 14 }}>{r.hot ? '????' : '?'}</span>
            <p style={{ fontSize: 13, color: r.hot ? '#9f1239' : '#555', fontWeight: r.hot ? 700 : 400 }}>{es ? r.es : r.en}</p>
          </div>
        ))}
      </div>

      {/* Benefits */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 12px rgba(14,77,138,0.06)', border: '1px solid #e8eef8' }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: navy, marginBottom: 12 }}>{es ? 'Beneficios' : 'Benefits'}</h2>
        {[
          { icon: '??', en: '$900/month base + commissions', es: '$900/mes base + comisiones' },
          { icon: '??', en: 'Round-trip flights paid', es: 'Vuelos de ida y vuelta pagados' },
          { icon: '???', en: 'Free accommodation & meals', es: 'Alojamiento y comidas gratis' },
          { icon: '??', en: 'Full medical insurance', es: 'Seguro medico completo' },
          { icon: '??', en: 'Visit Japan, Asia & Pacific ports', es: 'Visita Japon, Asia y el Pacifico' },
          { icon: '??', en: 'Career path to Senior & Manager', es: 'Trayectoria a Senior y Gerente' },
        ].map((b, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>{b.icon}</span>
            <p style={{ fontSize: 13, color: '#555' }}>{es ? b.es : b.en}</p>
          </div>
        ))}
      </div>
      {/* Testimonials */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginTop: 16, boxShadow: '0 2px 12px rgba(14,77,138,0.06)', border: '1px solid #e8eef8' }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: navy, marginBottom: 4 }}>
          {es ? 'Personas reales. Resultados reales.' : 'Real people. Real results.'}
        </h2>
        <p style={{ fontSize: 12, color: '#888', marginBottom: 14 }}>
          {es ? 'Mas de 2,000 candidatos ya trabajando en el mar.' : 'Join 2,000+ candidates already working at sea.'}
        </p>
        {[
          { name:'Ruben De Jesus Hernandez', role:'Sales Associate', company:'Starboard Cruise Services', country:'Colombia ????', quote:'The agency is very professional and the staff is very friendly. Placed within 3 weeks.' },
          { name:'Shalom Coba', role:'Sales Associate', company:'Harding Retail', country:'Colombia ????', quote:'Selective Crew helped me get a job on a cruise ship and now I am traveling the world. Placed within a month.' },
          { name:'Evelin Hidalgo', role:'Retail Supervisor', company:'Starboard Cruise Services', country:'Colombia ????', quote:'Went from applicant to Retail Supervisor within her first year.' },
        ].map((t, i) => (
          <div key={i} style={{ borderLeft: '3px solid '+japan, paddingLeft: 12, marginBottom: 14 }}>
            <div style={{ display:'flex', gap:2, marginBottom:6 }}>
              {[1,2,3,4,5].map(s => <span key={s} style={{ color: japan, fontSize: 12 }}>?</span>)}
            </div>
            <p style={{ fontSize: 13, color: '#555', lineHeight: 1.6, marginBottom: 6, fontStyle: 'italic' }}>"{t.quote}"</p>
            <p style={{ fontSize: 12, fontWeight: 700, color: navy, margin: 0 }}>{t.name}</p>
            <p style={{ fontSize: 11, color: '#888', margin: 0 }}>{t.role} · {t.company} · {t.country}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#fff' }}>

      {/* Urgency bar */}
      <div style={{ background: japan, padding: '10px 16px', textAlign: 'center' }}>
        <p style={{ color: '#fff', fontSize: 13, fontWeight: 700, margin: 0 }}>
          {es ? `URGENTE — Solo ${spotsLeft} cupos de 15 · Se requiere japones` : `URGENT — Only ${spotsLeft} of 15 spots · Japanese required`}
        </p>
      </div>

      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, ${navy} 0%, #1a0810 50%, #2d0a14 100%)`, color: '#fff', padding: isMobile ? '40px 20px 32px' : '80px 20px 60px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: japan, borderRadius: 50, padding: '6px 14px' }}>
              <span style={{ fontSize: 12 }}>????</span>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#fff', letterSpacing: 1, textTransform: 'uppercase' }}>
                {es ? 'Se Requiere Japones' : 'Japanese Required'}
              </span>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: red, borderRadius: 50, padding: '6px 14px' }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#fff', letterSpacing: 1, textTransform: 'uppercase' }}>
                {es ? 'Empleo Caliente' : 'Hot Job'}
              </span>
            </div>
          </div>
          <h1 style={{ fontSize: isMobile ? 26 : 46, fontWeight: 800, lineHeight: 1.15, marginBottom: 8 }}>
            {es ? 'Asociado Duty Free' : 'Duty Free Sales Associate'}
            <br /><span style={{ color: '#ff6b8a', fontSize: isMobile ? 22 : 36 }}>
              {es ? 'Hablantes de Japones' : 'Japanese Speakers'}
            </span>
          </h1>
          <p style={{ fontSize: isMobile ? 13 : 16, color: '#b8d0f0', marginBottom: 20 }}>
            Starboard Cruise Services · {es ? 'Asia / Pacifico' : 'Asia / Pacific'}
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
            {[
              { icon: '????', label_en: 'Japanese + English', label_es: 'Japones + Ingles' },
              { icon: '??', label_en: '$900 + Commission', label_es: '$900 + Comision' },
              { icon: '??', label_en: '6-Month Contract', label_es: '6 Meses' },
            ].map((tag, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 50, padding: '6px 12px' }}>
                <span style={{ fontSize: 12 }}>{tag.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#e0eeff' }}>{es ? tag.label_es : tag.label_en}</span>
              </div>
            ))}
          </div>
          {/* Countdown */}
          <div style={{ background: 'rgba(188,0,45,0.15)', border: '1px solid rgba(188,0,45,0.3)', borderRadius: 12, padding: '12px 16px', display: 'inline-flex', gap: 14, alignItems: 'center' }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#ff8a9e', letterSpacing: 1, textTransform: 'uppercase' }}>{es ? 'Cierra en' : 'Closes in'}</span>
            {[
              { val: timeLeft.days, l: 'D' }, { val: timeLeft.hours, l: 'H' },
              { val: timeLeft.mins, l: 'M' }, { val: timeLeft.secs, l: 'S' },
            ].map((t, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{String(t.val).padStart(2, '0')}</div>
                <div style={{ fontSize: 9, color: '#ff8a9e', marginTop: 2 }}>{t.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MOBILE: Tab switcher */}
      {isMobile ? (
        <div style={{ background: '#f8faff', minHeight: '100vh' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#fff', borderBottom: '1px solid #e8eef8', position: 'sticky', top: 0, zIndex: 10 }}>
            <button onClick={() => setActiveTab('apply')}
              style={{ padding: '14px', fontSize: 14, fontWeight: 700, background: 'none', border: 'none', borderBottom: activeTab === 'apply' ? `3px solid ${japan}` : '3px solid transparent', color: activeTab === 'apply' ? japan : '#888', cursor: 'pointer' }}>
              ???? {es ? 'Aplicar' : 'Apply'}
            </button>
            <button onClick={() => setActiveTab('details')}
              style={{ padding: '14px', fontSize: 14, fontWeight: 700, background: 'none', border: 'none', borderBottom: activeTab === 'details' ? `3px solid ${ocean}` : '3px solid transparent', color: activeTab === 'details' ? ocean : '#888', cursor: 'pointer' }}>
              ?? {es ? 'Detalles' : 'Details'}
            </button>
          </div>
          <div style={{ padding: '20px 16px' }}>
            {activeTab === 'apply' ? <ApplyForm /> : <JobDetails />}
          </div>
        </div>
      ) : (
        <section style={{ padding: '60px 20px', background: '#f8faff' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40, alignItems: 'start' }}>
            <JobDetails />
            <div style={{ position: 'sticky', top: 24 }}><ApplyForm /></div>
          </div>
        </section>
      )}
    </div>
  );
}



