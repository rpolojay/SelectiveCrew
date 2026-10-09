'use client';
import { useState } from 'react';
import { useLang } from '../../lib/LanguageContext';

const navy = "#0a1628";
const ocean = "#0e4d8a";
const gold = "#f0a500";

export default function PricingPage() {
  const { lang } = useLang();
  const es = lang === 'es';

  const [form, setForm] = useState({ name: '', company: '', email: '', cruiseLine: '', positions: '', message: '' });
  const [focused, setFocused] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const CRUISE_LINE_OPTIONS = [
    { value: 'starboard', label: 'Starboard Retail Group' },
    { value: 'ncl', label: 'Norwegian Cruise Line' },
    { value: 'grandcircle', label: 'Grand Circle Cruise Line' },
  ];

  const inputStyle = (field) => ({
    width: "100%", border: `1.5px solid ${focused === field ? ocean : "#dde5f0"}`,
    borderRadius: 10, padding: "12px 16px", fontSize: 14, outline: "none",
    background: "#fff", boxSizing: "border-box", color: navy, fontFamily: "inherit"
  });

  async function handleSubmit() {
    if (!form.name || !form.company || !form.email || !form.cruiseLine) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/request-portal-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          company: form.company,
          email: form.email,
          cruiseLine: form.cruiseLine,
          positions: form.positions,
          message: form.message,
        }),
      });
      if (!res.ok) throw new Error('Request failed');
      setSubmitted(true);
    } catch (e) {
      console.error('Failed to send portal access request:', e);
      setError(es ? 'Algo salió mal. Inténtalo de nuevo o escríbenos por WhatsApp.' : 'Something went wrong. Please try again or contact us via WhatsApp.');
    }
    setSubmitting(false);
  }

  const steps = [
    {
      number: "01",
      title_en: "Tell Us What You Need",
      title_es: "Cuéntanos Qué Necesitas",
      desc_en: "Fill out our employer contact form with the positions you are looking to fill, the number of candidates needed, and your timeline.",
      desc_es: "Llena nuestro formulario de contacto con las posiciones que deseas cubrir, el número de candidatos necesarios y tu cronograma.",
    },
    {
      number: "02",
      title_en: "We Source & Screen Candidates",
      title_es: "Buscamos y Seleccionamos Candidatos",
      desc_en: "Our team searches our network of 2,000+ Latin American professionals. We screen for English level, experience, personality, and cultural fit.",
      desc_es: "Nuestro equipo busca en nuestra red de más de 2,000 profesionales latinoamericanos. Filtramos por nivel de inglés, experiencia, personalidad y ajuste cultural.",
    },
    {
      number: "03",
      title_en: "You Interview the Best Candidates",
      title_es: "Entrevistas a los Mejores Candidatos",
      desc_en: "We send you a shortlist of pre-screened candidates with video interviews, CVs, and our assessment. You choose who to move forward with.",
      desc_es: "Te enviamos una lista corta de candidatos preseleccionados con entrevistas en video, CVs y nuestra evaluación. Tú decides con quién continuar.",
    },
    {
      number: "04",
      title_en: "We Handle the Paperwork",
      title_es: "Nosotros Manejamos el Papeleo",
      desc_en: "We assist with documentation, medical certificates, and pre-boarding logistics so your new crew member arrives ready to work.",
      desc_es: "Asistimos con documentación, certificados médicos y logística de pre-embarque para que tu nuevo tripulante llegue listo para trabajar.",
    },
  ];

  const benefits = [
    { icon: "🌎", title_en: "Latin American Specialists", title_es: "Especialistas Latinoamericanos", desc_en: "We exclusively recruit from Latin America — Colombia, Venezuela, Peru, Chile, and 7 other countries.", desc_es: "Reclutamos exclusivamente de América Latina — Colombia, Venezuela, Perú, Chile y 7 países más." },
    { icon: "✅", title_en: "Pre-Screened Candidates", title_es: "Candidatos Preseleccionados", desc_en: "Every candidate has been interviewed, assessed for English level, and verified before reaching you.", desc_es: "Cada candidato ha sido entrevistado, evaluado en inglés y verificado antes de llegar a ti." },
    { icon: "⚡", title_en: "Fast Turnaround", title_es: "Respuesta Rápida", desc_en: "We can typically provide a shortlist of qualified candidates within 2 weeks of your request.", desc_es: "Generalmente podemos proporcionar una lista corta de candidatos calificados en 2 semanas." },
    { icon: "🤝", title_en: "15+ Years Experience", title_es: "Más de 15 Años de Experiencia", desc_en: "Founded in 2009, we have placed 2,000+ candidates with Starboard, NCL, and other major concessionaires.", desc_es: "Fundados en 2009, hemos colocado a más de 2,000 candidatos con Starboard, NCL y otros concesionarios importantes." },
    { icon: "📋", title_en: "MLC 2006 Standards", title_es: "Cumplimiento MLC", desc_en: "All recruitment is conducted in full compliance with the Maritime Labour Convention (MLC 2006).", desc_es: "Todo el reclutamiento se realiza en pleno cumplimiento del Convenio sobre el Trabajo Marítimo (MLC 2006)." },
    { icon: "💬", title_en: "Ongoing Support", title_es: "Apoyo Continuo", desc_en: "We stay in contact with placed candidates throughout their contract to ensure retention and performance.", desc_es: "Mantenemos contacto con los candidatos colocados durante su contrato para garantizar retención y rendimiento." },
  ];

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>

      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, ${navy} 0%, ${ocean} 100%)`, color: "#fff", padding: "80px 20px", textAlign: "center" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: gold, textTransform: "uppercase", marginBottom: 14 }}>
            {es ? "Para Empleadores" : "For Employers"}
          </div>
          <h1 style={{ fontSize: 42, fontWeight: 800, marginBottom: 16, lineHeight: 1.2 }}>
            {es ? "Cómo Trabajamos con Empleadores" : "How We Work with Employers"}
          </h1>
          <p style={{ fontSize: 17, color: "#b8d0f0", lineHeight: 1.8, marginBottom: 32 }}>
            {es
              ? "Conectamos cruceros y concesionarios con talento latinoamericano preseleccionado. Sin complicaciones, sin sorpresas."
              : "We connect cruise lines and concessionaires with pre-screened Latin American talent. No hassle, no surprises."}
          </p>
          <a href="/employers" style={{ display: "inline-block", background: gold, color: navy, borderRadius: 14, padding: "16px 40px", fontSize: 16, fontWeight: 800, textDecoration: "none" }}>
            {es ? "Contáctanos Ahora →" : "Contact Us Now →"}
          </a>
        </div>
      </section>


      {/* PRE-TRAINED CANDIDATES SECTION */}
      <section style={{padding:'72px 20px',background:'#fff',borderBottom:'1px solid #e8eef8'}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:48}}>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:2,color:'#0d9488',textTransform:'uppercase',marginBottom:10}}>{es?'Ventaja Exclusiva':'Exclusive Advantage'}</div>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(24px,3vw,34px)',fontWeight:700,color:navy,marginBottom:16,lineHeight:1.3}}>{es?'Sus Candidatos Llegan Pre-Entrenados':'Your Candidates Arrive Pre-Trained'}</h2>
            <p style={{fontSize:16,color:'#64748b',maxWidth:600,margin:'0 auto',lineHeight:1.8}}>{es?'Selective Crew es la unica agencia de reclutamiento maritimo en Latinoamerica que ofrece formacion gratuita en ventas duty-free antes del embarque.':'Selective Crew is the only maritime recruitment agency in Latin America that offers free duty-free sales training before embarkation.'}</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:24,marginBottom:48}}>
            {[
              {icon:'🎓',title:es?'Certificados Antes de Embarcar':'Certified Before Boarding',desc:es?'Cada candidato completa nuestro curso de Excelencia en Ventas Duty-Free y recibe un certificado verificable antes de su primera entrevista.':'Every candidate completes our Duty-Free Sales Excellence course and receives a verifiable certificate before their first interview.'},
              {icon:'📊',title:es?'Conocimiento del Producto':'Product Knowledge',desc:es?'Nuestro curso cubre licores, perfumes, cosmeticos, relojes y joyeria — exactamente lo que venden en los barcos de Starboard y NCL.':'Our course covers spirits, perfumes, cosmetics, watches and jewelry — exactly what they sell on Starboard and NCL ships.'},
              {icon:'💬',title:es?'Tecnicas de Venta Reales':'Real Sales Techniques',desc:es?'Los candidatos aprenden el metodo ACES, manejo de objeciones, tecnicas de cierre y como relacionarse con huespedes internacionales.':'Candidates learn the ACES method, objection handling, closing techniques, and how to connect with international guests.'},
              {icon:'✅',title:es?'Solo los Mejores Pasan':'Only the Best Pass',desc:es?'Se requiere una puntuacion minima del 80% para obtener el certificado. Los candidatos que no alcanzan el umbral son filtrados automaticamente.':'A minimum score of 80% is required to earn the certificate. Candidates who do not reach the threshold are automatically filtered out.'},
            ].map((item,i)=>(
              <div key={i} style={{background:'#f8faff',border:'1px solid #e2e8f0',borderRadius:16,padding:'28px 24px'}}>
                <div style={{fontSize:32,marginBottom:14}}>{item.icon}</div>
                <h3 style={{fontSize:17,fontWeight:700,color:navy,marginBottom:8,lineHeight:1.35}}>{item.title}</h3>
                <p style={{fontSize:14,color:'#475569',lineHeight:1.75}}>{item.desc}</p>
              </div>
            ))}
          </div>
          <div style={{background:'linear-gradient(135deg,#0a1628,#0d2240)',borderRadius:20,padding:'36px 40px',display:'flex',flexWrap:'wrap',gap:32,alignItems:'center',justifyContent:'space-between'}}>
            <div>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:2,color:'#c9a84c',textTransform:'uppercase',marginBottom:8}}>{es?'Resultados Comprobados':'Proven Results'}</div>
              <h3 style={{fontSize:22,fontWeight:700,color:'#f8f4ec',marginBottom:8,lineHeight:1.3}}>{es?'Candidatos mas preparados. Menos tiempo de ramp-up.':'Better prepared candidates. Less ramp-up time.'}</h3>
              <p style={{fontSize:14,color:'rgba(248,244,236,0.65)',lineHeight:1.7,maxWidth:480}}>{es?'Los candidatos certificados por Selective Crew conocen los productos, entienden las dinamicas de ventas a bordo y estan mentalmente preparados para el entorno del crucero antes del dia 1.':'Selective Crew certified candidates know the products, understand onboard sales dynamics, and are mentally prepared for the cruise environment before day 1.'}</p>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:16,flexShrink:0}}>
              {[{num:'80%+',label:es?'Puntuacion minima requerida':'Min. score required'},{num:'25 min',label:es?'Duracion del curso':'Course duration'},{num:'100%',label:es?'Gratis para candidatos':'Free for candidates'}].map((stat,i)=>(
                <div key={i} style={{textAlign:'center',background:'rgba(255,255,255,0.06)',borderRadius:12,padding:'14px 24px',border:'1px solid rgba(255,255,255,0.08)'}}>
                  <div style={{fontSize:24,fontWeight:800,color:'#c9a84c'}}>{stat.num}</div>
                  <div style={{fontSize:11,color:'rgba(248,244,236,0.55)',fontWeight:600,textTransform:'uppercase',letterSpacing:1,marginTop:4}}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* How it works */}
      <section style={{ padding: "80px 20px", background: "#f8faff" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: navy, textAlign: "center", marginBottom: 8 }}>
            {es ? "El Proceso en 4 Pasos" : "The Process in 4 Steps"}
          </h2>
          <p style={{ color: "#888", textAlign: "center", marginBottom: 56 }}>
            {es ? "Simple, rápido y sin costo inicial." : "Simple, fast, and no upfront cost."}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 32, alignItems: "flex-start", marginBottom: 48 }}>
                <div style={{ flexShrink: 0, width: 64, height: 64, background: `linear-gradient(135deg, ${navy}, ${ocean})`, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: gold }}>{step.number}</span>
                </div>
                <div style={{ paddingTop: 8 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: navy, marginBottom: 8 }}>
                    {es ? step.title_es : step.title_en}
                  </h3>
                  <p style={{ fontSize: 15, color: "#666", lineHeight: 1.8 }}>
                    {es ? step.desc_es : step.desc_en}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section style={{ padding: "80px 20px", background: "#fff" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: navy, textAlign: "center", marginBottom: 8 }}>
            {es ? "Por Qué Elegirnos" : "Why Choose Us"}
          </h2>
          <p style={{ color: "#888", textAlign: "center", marginBottom: 48 }}>
            {es ? "15 años colocando talento latinoamericano en cruceros de todo el mundo." : "15 years placing Latin American talent on cruise ships worldwide."}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {benefits.map((b, i) => (
              <div key={i} style={{ background: "#f8faff", borderRadius: 20, padding: 28, border: "1px solid #e8eef8" }}>
                <div style={{ fontSize: 36, marginBottom: 14 }}>{b.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: navy, marginBottom: 8 }}>
                  {es ? b.title_es : b.title_en}
                </h3>
                <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7 }}>
                  {es ? b.desc_es : b.desc_en}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section style={{ padding: "60px 20px", background: "#f8faff", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#aaa", letterSpacing: 2, textTransform: "uppercase", marginBottom: 24 }}>
            {es ? "Trabajamos Con" : "We Work With"}
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
            <div style={{ background: "#fff", borderRadius: 14, padding: "16px 32px", boxShadow: "0 2px 12px rgba(14,77,138,0.08)", fontSize: 15, fontWeight: 700, color: navy }}>
              Starboard Retail Group
            </div>
            <div style={{ background: "#fff", borderRadius: 14, padding: "16px 32px", boxShadow: "0 2px 12px rgba(14,77,138,0.08)", fontSize: 15, fontWeight: 700, color: navy }}>
              Norwegian Cruise Line (Photography Department)
            </div>
            <div style={{ background: "#fff", borderRadius: 14, padding: "16px 32px", boxShadow: "0 2px 12px rgba(14,77,138,0.08)", fontSize: 15, fontWeight: 700, color: navy }}>
              Grand Circle Cruise Line
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 20px", background: `linear-gradient(135deg, ${navy} 0%, ${ocean} 100%)`, textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 12 }}>
            {es ? "¿Listo para Contratar?" : "Ready to Hire?"}
          </h2>
          <p style={{ color: "#b8d0f0", fontSize: 16, marginBottom: 32, lineHeight: 1.7 }}>
            {es
              ? "Contáctanos hoy y te enviaremos candidatos preseleccionados en 2 semanas."
              : "Contact us today and we will send you pre-screened candidates within 2 weeks."}
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
            <a href="#contact-form" style={{ display: "inline-block", background: gold, color: navy, borderRadius: 14, padding: "16px 36px", fontSize: 15, fontWeight: 800, textDecoration: "none" }}>
              {es ? "Enviar Consulta →" : "Send Inquiry →"}
            </a>
          </div>
          <p style={{ fontSize: 13, color: "#b8d0f0" }}>
            {es
              ? "¿Tiene preguntas? Use el botón de WhatsApp en la esquina inferior izquierda de esta página."
              : "Have questions? Use the WhatsApp button in the bottom left corner of this page."}
          </p>
        </div>
      </section>

      {/* Pipeline Portal Benefits */}
      <section style={{ padding: "80px 20px", background: navy }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: gold, textTransform: "uppercase", marginBottom: 10 }}>
              {es ? "Portal de Clientes" : "Client Portal"}
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 12 }}>
              {es ? "Su Propio Pipeline de Talento en Tiempo Real" : "Your Own Real-Time Talent Pipeline"}
            </h2>
            <p style={{ fontSize: 15, color: "#b8d0f0", maxWidth: 600, margin: "0 auto", lineHeight: 1.7 }}>
              {es
                ? "No más hojas de cálculo ni actualizaciones por correo — vea exactamente en qué etapa está cada candidato, las 24 horas."
                : "No more spreadsheets or email updates — see exactly where every candidate stands, 24/7"}
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 20, marginBottom: 40 }}>
            {[
              { icon: "\u{1F4CA}", title_en: "Live candidate tracking", title_es: "Seguimiento de candidatos en vivo", desc_en: "See all your candidates and their current stage in real time.", desc_es: "Vea todos sus candidatos y su etapa actual en tiempo real." },
              { icon: "✅", title_en: "Interview confirmation tracking", title_es: "Seguimiento de confirmación de entrevistas", desc_en: "Know instantly when a candidate watches the mandatory video or completes the Omnia assessment.", desc_es: "Sepa al instante cuando un candidato ve el video obligatorio o completa la evaluación Omnia." },
              { icon: "\u{1F4CB}", title_en: "Document status", title_es: "Estado de documentos", desc_en: "Track passport, police clearance, medical and STCW status per candidate.", desc_es: "Rastree el estado de pasaporte, antecedentes, médico y STCW por candidato." },
              { icon: "⚓", title_en: "Cruise line assignment", title_es: "Asignación de línea de cruceros", desc_en: "See which ship and cruise line each candidate is assigned to.", desc_es: "Vea a qué barco y línea de cruceros está asignado cada candidato." },
              { icon: "\u{1F4F1}", title_en: "Mobile friendly", title_es: "Compatible con móviles", desc_en: "Access your pipeline from anywhere on any device.", desc_es: "Acceda a su pipeline desde cualquier lugar y dispositivo." },
              { icon: "\u{1F512}", title_en: "Secure and private", title_es: "Seguro y privado", desc_en: "Your candidates are only visible to you.", desc_es: "Sus candidatos solo son visibles para usted." },
            ].map((b, i) => (
              <div key={i} style={{ display: "flex", gap: 14, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,168,76,0.25)", borderRadius: 14, padding: "20px 22px" }}>
                <span style={{ fontSize: 26, flexShrink: 0 }}>{b.icon}</span>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: gold, marginBottom: 4 }}>
                    {es ? b.title_es : b.title_en}
                  </h3>
                  <p style={{ fontSize: 13, color: "#b8d0f0", lineHeight: 1.65, margin: 0 }}>
                    {es ? b.desc_es : b.desc_en}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center" }}>
            <a href="#contact-form"
              onClick={(e) => { e.preventDefault(); const el = document.getElementById('contact-form'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
              style={{ display: "inline-block", background: gold, color: navy, borderRadius: 14, padding: "16px 36px", fontSize: 15, fontWeight: 800, textDecoration: "none", cursor: "pointer" }}>
              {es ? "Solicitar Acceso al Portal →" : "Request Portal Access →"}
            </a>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" style={{ padding: "80px 20px", background: "#fff" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: navy, marginBottom: 12 }}>
              {es ? "Enviar Consulta" : "Send an Inquiry"}
            </h2>
            <p style={{ fontSize: 15, color: "#888" }}>
              {es ? "Respondemos en menos de 24 horas." : "We respond in less than 24 hours."}
            </p>
          </div>

          {submitted ? (
            <div style={{ background: "#f0fff4", border: "2px solid #22c55e", borderRadius: 16, padding: 48, textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: navy, marginBottom: 8 }}>
                {es ? "¡Solicitud Recibida!" : "Request Received!"}
              </h3>
              <p style={{ fontSize: 14, color: "#555", margin: 0 }}>
                {es
                  ? "Su solicitud de acceso al portal ha sido recibida. Nuestro equipo la revisará y le enviará sus datos de acceso por correo en breve."
                  : "Your portal access request has been received. Our team will review it and email you your login instructions shortly."}
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
                  {es ? "Línea de Cruceros *" : "Cruise Line *"}
                </label>
                <select value={form.cruiseLine} onChange={(e) => setForm({ ...form, cruiseLine: e.target.value })}
                  onFocus={() => setFocused('cruiseLine')} onBlur={() => setFocused('')}
                  style={{ ...inputStyle('cruiseLine'), cursor: "pointer" }}>
                  <option value="">{es ? "Seleccione una línea de cruceros" : "Select a cruise line"}</option>
                  {CRUISE_LINE_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
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
              {error && <p style={{ fontSize: 13, color: "#dc2626", marginBottom: 16 }}>{error}</p>}
              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{ width: "100%", background: ocean, color: "#fff", border: "none", borderRadius: 12, padding: "15px", fontSize: 15, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1 }}>
                {submitting ? (es ? "Enviando..." : "Sending...") : (es ? "Enviar Consulta →" : "Send Inquiry →")}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
