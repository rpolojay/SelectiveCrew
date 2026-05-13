'use client';
import { useState } from 'react';
import { useLang } from '../../lib/LanguageContext';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB4YY3u9ZBfQr6h5j_zwlYyLh7pQ6drufI",
  authDomain: "studio-6715036493-baccc.firebaseapp.com",
  projectId: "studio-6715036493-baccc",
  storageBucket: "studio-6715036493-baccc.firebasestorage.app",
  messagingSenderId: "36078031878",
  appId: "1:36078031878:web:d1dc9f237cf4a41b265f87"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export default function EmployersPage() {
  const { lang } = useLang();
  const es = lang === 'es';

  const navy = "#0a1628";
  const ocean = "#0e4d8a";
  const gold = "#f0a500";

  const [form, setForm] = useState({ name: '', company: '', email: '', positions: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [focused, setFocused] = useState('');

  const whatsappMsg = es
    ? 'Hola Selective Crew, soy un empleador interesado en contratar talento latinoamericano para mi línea de cruceros.'
    : 'Hello Selective Crew, I am an employer interested in sourcing Latin American talent for my cruise line.';
  const whatsappUrl = `https://wa.me/573188474058?text=${encodeURIComponent(whatsappMsg)}`;

  const positions = [
    { emoji: "🛍️", title_en: "Retail Sales", title_es: "Ventas al por Menor", desc_en: "Duty-free sales associates, luxury retail specialists, assistant managers and retail managers.", desc_es: "Asociados de ventas duty-free, especialistas en retail de lujo, asistentes y gerentes de tienda." },
    { emoji: "📸", title_en: "Photography", title_es: "Fotografía", desc_en: "Onboard photographers, photo managers, senior photographers for guest portrait and event photography.", desc_es: "Fotógrafos a bordo, gerentes de fotografía y fotógrafos senior para retratos y eventos." },
    { emoji: "🍽️", title_en: "Food & Beverage", title_es: "Alimentos y Bebidas", desc_en: "Waitstaff, bartenders, baristas, restaurant supervisors and F&B managers.", desc_es: "Meseros, bartenders, baristas, supervisores de restaurante y gerentes de A&B." },
    { emoji: "🛏️", title_en: "Housekeeping", title_es: "Housekeeping", desc_en: "Cabin stewards, housekeeping supervisors and senior housekeeping management.", desc_es: "Camareros de cabina, supervisores de housekeeping y gerencia senior." },
    { emoji: "🎭", title_en: "Entertainment", title_es: "Entretenimiento", desc_en: "Activity hosts, entertainment staff, youth coordinators and guest experience teams.", desc_es: "Animadores, personal de entretenimiento, coordinadores juveniles y equipos de experiencia al huésped." },
    { emoji: "💆", title_en: "Spa & Wellness", title_es: "Spa y Bienestar", desc_en: "Massage therapists, beauticians, fitness instructors and spa managers.", desc_es: "Terapeutas de masajes, esteticistas, instructores de fitness y gerentes de spa." },
  ];

  const whyUs = es ? [
    { emoji: "🌎", title: "Especialistas en LATAM", desc: "Somos la agencia líder en reclutamiento de talento latinoamericano para la industria de cruceros." },
    { emoji: "✅", title: "Candidatos 100% Verificados", desc: "Cada candidato pasa por verificación de documentos, evaluación de inglés, entrevista en video y revisión de antecedentes." },
    { emoji: "⚡", title: "Entrega Rápida", desc: "Presentamos una lista corta de candidatos calificados en 7–14 días hábiles." },
    { emoji: "🤝", title: "17 Años de Experiencia", desc: "Desde 2009 hemos colocado más de 2,000 profesionales en las principales líneas de cruceros." },
    { emoji: "📋", title: "MLC 2006 Standards", desc: "Todo nuestro proceso cumple con los estándares internacionales de reclutamiento marítimo." },
    { emoji: "🔄", title: "Soporte Post-Colocación", desc: "Hacemos seguimiento durante los primeros meses del contrato para garantizar una integración exitosa." },
  ] : [
    { emoji: "🌎", title: "LATAM Specialists", desc: "We are the leading agency for Latin American talent recruitment in the cruise industry." },
    { emoji: "✅", title: "100% Vetted Candidates", desc: "Every candidate goes through document verification, English assessment, video interview, and background review." },
    { emoji: "⚡", title: "Fast Turnaround", desc: "We present a shortlist of qualified candidates within 7–14 business days." },
    { emoji: "🤝", title: "17 Years of Experience", desc: "Since 2009 we have placed over 2,000 professionals at leading cruise lines." },
    { emoji: "📋", title: "MLC 2006 Standards", desc: "Our entire process complies with international maritime recruitment standards." },
    { emoji: "🔄", title: "Post-Placement Support", desc: "We follow up during the first months of the contract to ensure successful integration." },
  ];

  const process = es ? [
    { step: "01", title: "Cuéntanos tus Necesidades", desc: "Contáctanos por WhatsApp o formulario con las posiciones que necesitas, número de candidatos y plazo de incorporación." },
    { step: "02", title: "Búsqueda y Filtrado", desc: "Buscamos en nuestra base de datos de más de 2,000 candidatos latinoamericanos y publicamos activamente la posición." },
    { step: "03", title: "Evaluación Rigurosa", desc: "Evaluamos inglés, personalidad, experiencia en ventas y actitud de servicio. Solo te enviamos candidatos que han pasado nuestro proceso completo." },
    { step: "04", title: "Entrevistas en Video", desc: "Cada candidato completa una entrevista en video. Recibes el video junto con el perfil completo del candidato." },
    { step: "05", title: "Presentación de Candidatos", desc: "Te presentamos una lista corta de los mejores candidatos con perfiles completos y nuestra evaluación profesional." },
    { step: "06", title: "Incorporación", desc: "Te acompañamos durante todo el proceso de incorporación hasta que el candidato sube al barco." },
  ] : [
    { step: "01", title: "Tell Us Your Needs", desc: "Contact us via WhatsApp or form with the positions you need, number of candidates, and desired start date." },
    { step: "02", title: "Search & Sourcing", desc: "We search our database of 2,000+ Latin American candidates and actively post the position across our channels." },
    { step: "03", title: "Rigorous Screening", desc: "We assess English level, personality, sales experience, and service attitude. We only send you fully screened candidates." },
    { step: "04", title: "Video Interviews", desc: "Every candidate completes a video interview. You receive the video along with the candidate's full profile." },
    { step: "05", title: "Candidate Shortlist", desc: "We present a shortlist of the best candidates with complete profiles and our professional assessment." },
    { step: "06", title: "Onboarding Support", desc: "We support you throughout the entire onboarding process until the candidate is aboard the ship." },
  ];

  const inputStyle = (field) => ({
    width: "100%", border: `1.5px solid ${focused === field ? ocean : "#dde5f0"}`,
    borderRadius: 10, padding: "12px 16px", fontSize: 14, outline: "none",
    background: "#fff", boxSizing: "border-box", color: navy, fontFamily: "system-ui, sans-serif"
  });

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", color: navy }}>

      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, ${navy} 0%, ${ocean} 100%)`, color: "#fff", padding: "88px 20px", textAlign: "center" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: gold, textTransform: "uppercase", marginBottom: 14 }}>
            {es ? "Para Empleadores" : "For Employers"}
          </div>
          <h1 style={{ fontSize: 44, fontWeight: 800, marginBottom: 20, lineHeight: 1.2 }}>
            {es ? "El Mejor Talento Latinoamericano, Listo para Zarpar" : "The Best Latin American Talent, Ready to Set Sail"}
          </h1>
          <p style={{ fontSize: 17, color: "#b8d0f0", lineHeight: 1.8, marginBottom: 40, maxWidth: 620, margin: "0 auto 40px" }}>
            {es
              ? "Somos su socio de reclutamiento de confianza en América Latina. Proveemos candidatos completamente verificados para las principales líneas de cruceros y concesionarias a bordo del mundo."
              : "We are your trusted recruitment partner in Latin America. We provide fully vetted candidates for the world's leading cruise lines and onboard concessionaires."}
          </p>

          {/* Two CTA buttons */}
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 10, background: "#25D366", color: "#fff", padding: "14px 32px", borderRadius: 14, fontWeight: 800, fontSize: 15, textDecoration: "none" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              {es ? "WhatsApp" : "WhatsApp"}
            </a>
            <a href="#contact-form"
              style={{ display: "inline-block", background: gold, color: navy, padding: "14px 32px", borderRadius: 14, fontWeight: 800, fontSize: 15, textDecoration: "none" }}>
              {es ? "📋 Enviar Consulta" : "📋 Send Inquiry"}
            </a>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, maxWidth: 700, margin: "48px auto 0" }}>
            {[
              { value: "2,000+", label: es ? "Candidatos Colocados" : "Candidates Placed" },
              { value: "17", label: es ? "Años de Experiencia" : "Years of Experience" },
              { value: "11", label: es ? "Países LATAM" : "LATAM Countries" },
              { value: "7–14", label: es ? "Días para Shortlist" : "Days to Shortlist" },
            ].map((s) => (
              <div key={s.value} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: gold }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "#b8d0f0", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Positions */}
      <section style={{ padding: "80px 20px", background: "#f8faff" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: gold, textTransform: "uppercase", marginBottom: 10 }}>
              {es ? "Nuestras Especialidades" : "Our Specialties"}
            </div>
            <h2 style={{ fontSize: 34, fontWeight: 800, marginBottom: 12 }}>
              {es ? "Posiciones que Podemos Cubrir" : "Positions We Can Fill"}
            </h2>
            <p style={{ fontSize: 15, color: "#666", maxWidth: 560, margin: "0 auto" }}>
              {es ? "Reclutamos talento latinoamericano de primer nivel para una amplia variedad de departamentos a bordo." : "We recruit top Latin American talent for a wide variety of onboard departments."}
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {positions.map((p) => (
              <div key={p.title_en} style={{ background: "#fff", borderRadius: 18, padding: 28, border: "1px solid #e0e8f5", boxShadow: "0 2px 16px rgba(14,77,138,0.06)" }}>
                <div style={{ fontSize: 44, marginBottom: 14 }}>{p.emoji}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: navy, marginBottom: 8 }}>{es ? p.title_es : p.title_en}</h3>
                <p style={{ fontSize: 13, color: "#666", lineHeight: 1.7 }}>{es ? p.desc_es : p.desc_en}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section style={{ padding: "80px 20px", background: "#fff" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: gold, textTransform: "uppercase", marginBottom: 10 }}>
              {es ? "Por Qué Elegirnos" : "Why Choose Us"}
            </div>
            <h2 style={{ fontSize: 34, fontWeight: 800 }}>
              {es ? "Lo que nos hace diferentes" : "What makes us different"}
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {whyUs.map((w) => (
              <div key={w.title} style={{ background: "#f8faff", borderRadius: 16, padding: 28, border: "1px solid #e8eef8" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{w.emoji}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: navy, marginBottom: 8 }}>{w.title}</h3>
                <p style={{ fontSize: 13, color: "#666", lineHeight: 1.8 }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section style={{ padding: "80px 20px", background: "#f8faff" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: gold, textTransform: "uppercase", marginBottom: 10 }}>
              {es ? "Nuestro Proceso" : "Our Process"}
            </div>
            <h2 style={{ fontSize: 34, fontWeight: 800 }}>
              {es ? "Cómo trabajamos con usted" : "How we work with you"}
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {process.map((item, i) => (
              <div key={item.step} style={{ display: "flex", gap: 24, position: "relative" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: i === process.length - 1 ? gold : ocean, color: i === process.length - 1 ? navy : "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, flexShrink: 0 }}>
                    {item.step}
                  </div>
                  {i < process.length - 1 && <div style={{ width: 2, flex: 1, background: "#dde8f5", minHeight: 40 }} />}
                </div>
                <div style={{ paddingTop: 14, paddingBottom: 32 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: navy, marginBottom: 6 }}>{item.title}</h3>
                  <p style={{ fontSize: 14, color: "#666", lineHeight: 1.8 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" style={{ padding: "80px 20px", background: "#fff" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: gold, textTransform: "uppercase", marginBottom: 10 }}>
              {es ? "Contáctanos" : "Get In Touch"}
            </div>
            <h2 style={{ fontSize: 34, fontWeight: 800, marginBottom: 12 }}>
              {es ? "Hablemos de sus necesidades" : "Let's talk about your needs"}
            </h2>
            <p style={{ fontSize: 15, color: "#666" }}>
              {es ? "Respondemos en menos de 24 horas." : "We respond in less than 24 hours."}
            </p>
          </div>

          {/* WhatsApp + Form side by side */}
          <div style={{ background: "#25D366", borderRadius: 16, padding: 24, marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
                {es ? "¿Prefiere WhatsApp?" : "Prefer WhatsApp?"}
              </p>
              <p style={{ fontSize: 13, color: "#d4f5df" }}>
                {es ? "Chatea directamente con nuestro equipo ahora." : "Chat directly with our team right now."}
              </p>
            </div>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", color: "#25D366", padding: "12px 24px", borderRadius: 50, textDecoration: "none", fontSize: 14, fontWeight: 800, whiteSpace: "nowrap" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              {es ? "Abrir WhatsApp" : "Open WhatsApp"}
            </a>
          </div>

          {submitted ? (
            <div style={{ background: "#f0fff4", border: "2px solid #22c55e", borderRadius: 16, padding: 48, textAlign: "center" }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: navy, marginBottom: 8 }}>
                {es ? "¡Mensaje Enviado!" : "Message Sent!"}
              </h3>
              <p style={{ fontSize: 14, color: "#555" }}>
                {es ? "Gracias por contactarnos. Nuestro equipo le responderá en menos de 24 horas." : "Thank you for reaching out. Our team will respond within 24 hours."}
              </p>
            </div>
          ) : (
            <div style={{ background: "#f8faff", borderRadius: 16, padding: 32, border: "1px solid #e0e8f5" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: navy, marginBottom: 6 }}>
                    {es ? "Nombre Completo *" : "Full Name *"}
                  </label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    onFocus={() => setFocused('name')} onBlur={() => setFocused('')}
                    placeholder={es ? "Juan García" : "John Smith"}
                    style={inputStyle('name')} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: navy, marginBottom: 6 }}>
                    {es ? "Empresa / Línea de Cruceros *" : "Company / Cruise Line *"}
                  </label>
                  <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                    onFocus={() => setFocused('company')} onBlur={() => setFocused('')}
                    placeholder={es ? "ej. Norwegian Cruise Line" : "e.g. Norwegian Cruise Line"}
                    style={inputStyle('company')} />
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: navy, marginBottom: 6 }}>
                  {es ? "Correo Electrónico *" : "Email Address *"}
                </label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                  placeholder="you@company.com"
                  style={inputStyle('email')} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: navy, marginBottom: 6 }}>
                  {es ? "Posiciones que Necesita Cubrir" : "Positions You Need to Fill"}
                </label>
                <input type="text" value={form.positions} onChange={(e) => setForm({ ...form, positions: e.target.value })}
                  onFocus={() => setFocused('positions')} onBlur={() => setFocused('')}
                  placeholder={es ? "ej. 5 Asociados de Ventas, 2 Fotógrafos" : "e.g. 5 Retail Sales Associates, 2 Photographers"}
                  style={inputStyle('positions')} />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: navy, marginBottom: 6 }}>
                  {es ? "Mensaje" : "Message"}
                </label>
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  onFocus={() => setFocused('message')} onBlur={() => setFocused('')}
                  rows={4}
                  placeholder={es ? "Cuéntenos sobre sus necesidades de personal, fechas de incorporación y cualquier requisito específico..." : "Tell us about your staffing needs, start dates, and any specific requirements..."}
                  style={{ ...inputStyle('message'), resize: "vertical" }} />
              </div>
              <button
                onClick={async () => {
                  if (!form.name || !form.company || !form.email) return;
                  setSubmitting(true);
                  try {
                    await addDoc(collection(db, "employer_inquiries"), {
                      type: "Employer Inquiry",
                      name: form.name,
                      company: form.company,
                      email: form.email,
                      positions: form.positions || "",
                      message: form.message || "",
                      status: "new",
                      createdAt: serverTimestamp(),
                    });
                  } catch (e) {
                    console.error(e);
                  }
                  setSubmitting(false);
                  setSubmitted(true);
                }}
                disabled={submitting}
                style={{ width: "100%", background: ocean, color: "#fff", border: "none", borderRadius: 12, padding: "15px", fontSize: 15, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1 }}>
                {submitting ? (es ? "Enviando..." : "Sending...") : (es ? "Enviar Consulta →" : "Send Inquiry →")}
              </button>
              <p style={{ fontSize: 11, color: "#aaa", textAlign: "center", marginTop: 12 }}>
                {es ? "También puede escribirnos directamente a rpolo@selectivecrew.com" : "You can also email us directly at rpolo@selectivecrew.com"}
              </p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
