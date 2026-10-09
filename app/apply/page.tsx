'use client';

import { useState } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useLang } from '../../lib/LanguageContext';

const firebaseConfig = {
  apiKey: "AIzaSyB4YY3u9ZBfQr6h5j_zwlYyLh7pQ6drufI",
  authDomain: "studio-6715036493-baccc.firebaseapp.com",
  projectId: "studio-6715036493-baccc",
  storageBucket: "studio-6715036493-baccc.firebasestorage.app",
  messagingSenderId: "36078031878",
};
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Base64 file content (without the data: URL prefix), the format
// /api/send-email accepts for public attachments.
function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// Spanish display text for the messages set in handleSubmit; the English
// strings stay the source so the submission code is unchanged.
const ERROR_ES: Record<string, string> = {
  'Please upload your resume/CV.': 'Por favor sube tu hoja de vida / CV.',
  'Something went wrong. Please try again or contact us on WhatsApp.': 'Algo salió mal. Inténtalo de nuevo o contáctanos por WhatsApp.',
};

// Display labels only; the submitted values stay in English.
const COUNTRY_ES: Record<string, string> = {
  'Peru': 'Perú', 'Mexico': 'México', 'Panama': 'Panamá', 'Dominican Republic': 'República Dominicana',
};
const POSITION_ES: Record<string, string> = {
  'Retail Sales Associate': 'Asociado de Ventas',
  'Assistant Retail Sales Manager': 'Asistente de Gerente de Ventas',
  'Shipboard Photographer': 'Fotógrafo de Crucero',
};

export default function ApplyPage() {
  const { lang } = useLang();
  const es = lang === 'es';
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    whatsapp: '',
    country: '',
    position: '',
    resume: null as File | null,
  });
  const [submitted, setSubmitted] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.resume) {
      setError('Please upload your resume/CV.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const fileName = globalThis.crypto.randomUUID() + '.cv';
      const storageRef = ref(storage, 'cvs/' + fileName);
      await uploadBytes(storageRef, formData.resume);
      const cvUrl = await getDownloadURL(storageRef);

      await addDoc(collection(db, 'applications'), {
        fullName: formData.fullName,
        email: formData.email,
        whatsapp: formData.whatsapp,
        country: formData.country,
        position: formData.position,
        cvUrl: cvUrl,
        stage: 'Applied',
        createdAt: serverTimestamp(),
        source: 'website',
      });

      try {
        // If the file can't be read, the notification still goes out without it.
        let resumeB64 = '';
        try { resumeB64 = await readFileAsBase64(formData.resume); } catch { resumeB64 = ''; }
        const emailRes = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: 'careers@selectivecrew.com',
            subject: 'New Application: ' + formData.fullName + ' - ' + formData.position,
            text: 'New application received!\n\nName: ' + formData.fullName + '\nEmail: ' + formData.email + '\nWhatsApp: ' + formData.whatsapp + '\nCountry: ' + formData.country + '\nPosition: ' + formData.position + '\n\n' + (resumeB64 ? 'The candidate CV is attached to this email and is also available in the admin panel.' : 'The candidate resume is available in the admin panel.') + '\n\nView in admin: https://selectivecrew.com/admin',
            attachments: resumeB64 ? [{ filename: formData.resume.name, content: resumeB64 }] : [],
          }),
        });
        if (!emailRes.ok) console.error('Email notification rejected (non-critical):', emailRes.status);
      } catch (emailErr) {
        console.error('Email notification failed (non-critical):', emailErr);
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Application error:', err); console.error('Error message:', err instanceof Error ? err.message : String(err));
      setError('Something went wrong. Please try again or contact us on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">

      {/* HERO */}
      <section className="bg-white py-12 px-4 text-center border-b border-gray-100">
        <p className="text-sm font-semibold text-green-600 uppercase tracking-widest mb-2">{es ? 'Aplicar es Gratis · Sin Costos, Nunca' : 'Free to Apply · No Fees Ever'}</p>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">{es ? 'Aplica a Trabajos en Cruceros' : 'Apply for Cruise Ship Jobs'}</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          {es
            ? 'Únete a más de 2,000 latinoamericanos que iniciaron su carrera en el mar con Selective Crew. Selecciona tu posición abajo para ver todos los detalles.'
            : 'Join 2,000+ Latin Americans who launched their careers at sea through Selective Crew. Select your position below to see full details.'}
        </p>
      </section>

      {/* OPEN POSITIONS */}
      <section className="max-w-3xl mx-auto px-4 py-10">
        <h2 className="text-xl font-bold text-gray-900 mb-6">{es ? 'Posiciones Abiertas' : 'Open Positions'}</h2>
        <div className="flex flex-col gap-4">
          {[
            { badge: 'OPEN NOW', badge_es: 'ABIERTA AHORA', title: 'Retail Sales Associate', title_es: 'Asociado de Ventas', company: 'Starboard Cruise Services', salary: '$900 – $1,500/mo + commissions', salary_es: '$900 – $1,500/mes + comisiones', contract: '6 months contract', contract_es: 'Contrato de 6 meses', route: 'Worldwide', route_es: 'Mundial' },
            { badge: 'MANAGEMENT', badge_es: 'GERENCIA', title: 'Assistant Retail Sales Manager', title_es: 'Asistente de Gerente de Ventas', company: 'Starboard Cruise Services', salary: '$1,100 – $1,600/mo + commissions', salary_es: '$1,100 – $1,600/mes + comisiones', contract: '6–8 months contract', contract_es: 'Contrato de 6–8 meses', route: 'Worldwide', route_es: 'Mundial' },
            { badge: 'NCL', badge_es: 'NCL', title: 'Shipboard Photographer', title_es: 'Fotógrafo de Crucero', company: 'Norwegian Cruise Line', salary: '$900 – $1,400/mo + commissions', salary_es: '$900 – $1,400/mes + comisiones', contract: '4–6 months contract', contract_es: 'Contrato de 4–6 meses', route: 'Worldwide', route_es: 'Mundial' },
          ].map((job) => (
            <div key={job.title} className="border border-gray-200 rounded-xl p-5 flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded mb-2 inline-block">{es ? job.badge_es : job.badge}</span>
                <h3 className="font-bold text-gray-900">{es ? job.title_es : job.title}</h3>
                <p className="text-sm text-gray-500">{job.company}</p>
                <p className="text-sm text-gray-700 mt-1">{es ? job.salary_es : job.salary} · {es ? job.contract_es : job.contract} · {es ? job.route_es : job.route}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-green-50 py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">{es ? 'Personas reales. Resultados reales.' : 'Real people. Real results.'}</h2>
          <p className="text-center text-gray-500 text-sm mb-8">{es ? 'Únete a más de 2,000 candidatos que ya trabajan en el mar.' : 'Join 2,000+ candidates already working at sea.'}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                name: 'Ruben De Jesus Hernandez',
                role: 'Sales Associate',
                role_es: 'Asociado de Ventas',
                company: 'Starboard Cruise Services',
                country: 'Colombia 🇨🇴',
                quote: 'The agency is very professional and the staff is very friendly. Placed within 3 weeks.',
                quote_es: 'La agencia es muy profesional y el personal es muy amable. Ubicado en 3 semanas.',
              },
              {
                name: 'Shalom Coba',
                role: 'Sales Associate',
                role_es: 'Asociado de Ventas',
                company: 'Harding Retail',
                country: 'Colombia 🇨🇴',
                quote: 'Selective Crew helped me get a job on a cruise ship and now I am traveling the world. Placed within a month.',
                quote_es: 'Selective Crew me ayudó a conseguir trabajo en un crucero y ahora estoy viajando por el mundo. Ubicado en un mes.',
              },
              {
                name: 'Evelin Hidalgo',
                role: 'Retail Supervisor',
                role_es: 'Supervisora de Ventas',
                company: 'Starboard Cruise Services',
                country: 'Colombia 🇨🇴',
                quote: 'Selective Crew is the best agency. Went from applicant to Retail Supervisor within her first year.',
                quote_es: 'Selective Crew es la mejor agencia. Pasó de candidata a Supervisora de Ventas en su primer año.',
              },
            ].map((t) => (
              <div key={t.name} className="bg-white rounded-xl p-5 shadow-sm border border-green-100">
                <div className="flex items-center gap-1 mb-3">
                  {[1,2,3,4,5].map(i => <span key={i} className="text-yellow-400 text-sm">★</span>)}
                </div>
                <p className="text-gray-700 text-sm italic mb-4">"{es ? t.quote_es : t.quote}"</p>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{es ? t.role_es : t.role} · {t.company}</p>
                  <p className="text-xs text-gray-400">{t.country}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORM */}
      <section className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{es ? 'Comienza tu Aplicación' : 'Start Your Application'}</h2>
          <p className="text-gray-500 text-sm">{es ? 'Gratis · Toma 3 minutos · Aún no necesitas documentos' : 'Free · Takes 3 minutes · No documents needed yet'}</p>
        </div>

        {submitted ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{es ? '¡Aplicación Recibida!' : 'Application Received!'}</h3>
            <p className="text-gray-500">{es ? 'Revisaremos tu perfil y te contactaremos dentro de 48 horas.' : "We'll review your profile and contact you within 48 hours."}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{es ? 'Nombre Completo *' : 'Full Name *'}</label>
              <input
                type="text"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.fullName}
                onChange={e => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{es ? 'Correo Electrónico *' : 'Email *'}</label>
              <input
                type="email"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{es ? 'WhatsApp / Teléfono' : 'WhatsApp / Phone'}</label>
              <input
                type="tel"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.whatsapp}
                onChange={e => setFormData({...formData, whatsapp: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{es ? 'País *' : 'Country *'}</label>
              <select
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.country}
                onChange={e => setFormData({...formData, country: e.target.value})}
              >
                <option value="">{es ? 'Selecciona tu país' : 'Select your country'}</option>
                {['Colombia','Peru','Ecuador','Chile','Argentina','Mexico','Panama','Costa Rica','Dominican Republic','Venezuela','Uruguay','Paraguay'].map(c => (
                  <option key={c} value={c}>{es ? (COUNTRY_ES[c] || c) : c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{es ? 'Posición *' : 'Position *'}</label>
              <select
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.position}
                onChange={e => setFormData({...formData, position: e.target.value})}
              >
                <option value="">{es ? 'Selecciona una posición' : 'Select a position'}</option>
                {['Retail Sales Associate','Assistant Retail Sales Manager','Shipboard Photographer'].map(p => (
                  <option key={p} value={p}>{es ? (POSITION_ES[p] || p) : p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{es ? 'Hoja de Vida / CV *' : 'Resume / CV *'}</label>
              <input
                type="file"
                required
                accept=".pdf,.doc,.docx"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={e => setFormData({...formData, resume: e.target.files?.[0] || null})}
              />
              <p className="text-xs text-gray-400 mt-1">{es ? 'Se aceptan PDF, DOC, DOCX' : 'PDF, DOC, DOCX accepted'}</p>
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
            </div>
            {error && (
              <p className="text-red-600 text-sm text-center">{es ? (ERROR_ES[error] || error) : error}</p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-lg text-sm transition-colors"
            >
              {submitting ? (es ? 'Enviando...' : 'Submitting...') : (es ? 'Enviar Aplicación →' : 'Submit Application →')}
            </button>
            <p className="text-center text-xs text-gray-400">{es ? '100% gratis · Cumple con MLC 2006 · Sin costos, nunca' : '100% free · MLC 2006 compliant · No fees ever'}</p>
          </form>
        )}
      </section>

    </main>
  );
}
