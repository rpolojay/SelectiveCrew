'use client';
import { useLang } from '../../lib/LanguageContext';

const navy = "#0a1628";
const ocean = "#0e4d8a";
const gold = "#f0a500";

export default function PricingPage() {
  const { lang } = useLang();
  const es = lang === 'es';

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
    { icon: "🌎", title_en: "Latin American Specialists", title_es: "Especialistas Latinoamericanos", desc_en: "We exclusively recruit from Latin America — Colombia, Venezuela, Peru, Chile, and 6 other countries.", desc_es: "Reclutamos exclusivamente de América Latina — Colombia, Venezuela, Perú, Chile y 6 países más." },
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
          <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap", marginBottom: 16 }}>
            <div style={{ background: "#fff", borderRadius: 14, padding: "16px 32px", boxShadow: "0 2px 12px rgba(14,77,138,0.08)", fontSize: 15, fontWeight: 700, color: navy }}>
              Starboard Cruise Services
            </div>
            <div style={{ background: "#fff", borderRadius: 14, padding: "16px 32px", boxShadow: "0 2px 12px rgba(14,77,138,0.08)", fontSize: 15, fontWeight: 700, color: navy }}>
              Norwegian Cruise Line
            </div>
          </div>
          <p style={{ fontSize: 13, color: "#aaa" }}>
            {es ? "+ otros concesionarios y líneas de cruceros" : "+ other concessionaires and cruise lines"}
          </p>
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
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/employers" style={{ display: "inline-block", background: gold, color: navy, borderRadius: 14, padding: "16px 36px", fontSize: 15, fontWeight: 800, textDecoration: "none" }}>
              {es ? "Enviar Consulta →" : "Send Inquiry →"}
            </a>
            <a href="https://wa.me/573188474058" target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#25d366", color: "#fff", borderRadius: 14, padding: "16px 32px", fontSize: 15, fontWeight: 800, textDecoration: "none" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
