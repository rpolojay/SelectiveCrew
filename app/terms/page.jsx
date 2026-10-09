'use client';
import { useLang } from '../../lib/LanguageContext';

export default function TermsPage() {
  const { lang } = useLang();
  const es = lang === 'es';

  const navy = "#0a1628";
  const ocean = "#0e4d8a";
  const gold = "#f0a500";

  const sections = es ? [
    {
      title: "1. Aceptación de los Términos",
      content: `Al acceder y utilizar selectivecrew.com, usted acepta estar legalmente vinculado por estos Términos de Servicio. Si no está de acuerdo con alguno de estos términos, por favor no utilice nuestros servicios.

Estos términos se aplican a todos los visitantes, candidatos y empleadores que acceden o utilizan los servicios de Selective Crew.`
    },
    {
      title: "2. Descripción del Servicio",
      content: `Selective Crew es una agencia de reclutamiento marítimo que conecta candidatos latinoamericanos con oportunidades de empleo en líneas de cruceros. Nuestros servicios incluyen:

• Publicación de ofertas de empleo en líneas de cruceros.
• Evaluación y selección de candidatos.
• Facilitación del proceso de entrevistas.
• Orientación durante el proceso de incorporación.
• Recursos e información para candidatos.

Selective Crew actúa estrictamente como intermediario entre candidatos y empleadores. No somos empleadores directos de los candidatos colocados.`
    },
    {
      title: "3. Servicio Gratuito para Candidatos",
      content: `En cumplimiento con el Convenio sobre el Trabajo Marítimo (MLC 2006), Selective Crew NUNCA cobra tarifas de colocación, registro o cualquier otro tipo de tarifa a los candidatos.

• El registro y la aplicación son completamente gratuitos.
• No cobramos por entrevistas, evaluaciones ni orientación.
• No cobramos comisiones sobre salarios.

Si alguien le solicita un pago en nombre de Selective Crew, por favor repórtelo inmediatamente a: info@selectivecrew.com`
    },
    {
      title: "4. Elegibilidad",
      content: `Para utilizar nuestros servicios como candidato, usted debe:

• Tener al menos 21 años de edad.
• Proporcionar información veraz, precisa y completa en su solicitud.
• Tener documentación legal válida para trabajar (pasaporte vigente).
• Cumplir con los requisitos específicos de cada posición.
• Ser residente de uno de los países latinoamericanos en los que operamos.

Nos reservamos el derecho de rechazar solicitudes que no cumplan con estos criterios.`
    },
    {
      title: "5. Responsabilidades del Candidato",
      content: `Como candidato, usted se compromete a:

• Proporcionar únicamente información veraz y actualizada en su solicitud.
• No suplantar la identidad de otra persona.
• Mantener la confidencialidad de su cuenta y contraseña.
• Notificarnos de inmediato cualquier cambio en su información de contacto.
• Comportarse de manera profesional en todas las interacciones con nuestro equipo y con los empleadores.
• No utilizar nuestros servicios para fines ilegales o no autorizados.
• Respetar los derechos de propiedad intelectual de Selective Crew.`
    },
    {
      title: "6. Proceso de Selección",
      content: `Selective Crew se reserva el derecho de:

• Seleccionar a los candidatos que consideremos más adecuados para cada posición.
• Rechazar solicitudes sin necesidad de justificación.
• Descalificar candidatos que proporcionen información falsa o engañosa.
• Finalizar el proceso de un candidato en cualquier etapa si se detecta conducta inapropiada.

La inclusión en nuestra base de datos no garantiza colocación laboral. La decisión final de contratación recae en el empleador.`
    },
    {
      title: "7. Propiedad Intelectual",
      content: `Todo el contenido de selectivecrew.com, incluyendo pero no limitado a:

• Textos, artículos y descripciones de empleo.
• Logotipos, imágenes y gráficos.
• Código fuente y diseño del sitio web.
• Materiales de capacitación y recursos.

Es propiedad exclusiva de Selective Crew y está protegido por las leyes de propiedad intelectual aplicables. Queda prohibida su reproducción, distribución o uso sin autorización expresa por escrito.`
    },
    {
      title: "8. Limitación de Responsabilidad",
      content: `Selective Crew no será responsable por:

• Decisiones de contratación tomadas por los empleadores.
• Condiciones laborales a bordo de los buques.
• Pérdidas o daños derivados del uso de nuestros servicios.
• Interrupciones temporales del servicio por mantenimiento o causas técnicas.
• Información proporcionada por terceros empleadores.

Nuestra responsabilidad máxima en cualquier circunstancia está limitada al valor de los servicios prestados, que para candidatos es cero dado que nuestro servicio es gratuito.`
    },
    {
      title: "9. Modificaciones al Servicio",
      content: `Selective Crew se reserva el derecho de:

• Modificar, suspender o discontinuar cualquier parte del servicio en cualquier momento.
• Actualizar estos Términos de Servicio con previo aviso de 30 días.
• Cambiar los requisitos de elegibilidad para candidatos.

Le notificaremos sobre cambios significativos a través de nuestro sitio web o por correo electrónico. El uso continuado de nuestros servicios después de dichos cambios constituye su aceptación.`
    },
    {
      title: "10. Ley Aplicable",
      content: `Estos Términos de Servicio se rigen por las leyes de la República de Colombia. Cualquier disputa relacionada con estos términos será resuelta mediante arbitraje en Colombia, de conformidad con las leyes colombianas vigentes.

Además, Selective Crew se acoge voluntariamente a los estandares de:
• Convenio sobre el Trabajo Marítimo MLC 2006.
• Ley 1581 de 2010 (Protección de Datos Personales de Colombia).
• Reglamentaciones internacionales de reclutamiento marítimo.`
    },
    {
      title: "11. Contacto",
      content: `Para preguntas sobre estos Términos de Servicio, contáctenos:

📧 Email: legal@selectivecrew.com
🌐 Sitio web: selectivecrew.com/contact
📍 Ubicación: Colombia

Responderemos a todas las consultas dentro de 10 días hábiles.`
    },
  ] : [
    {
      title: "1. Acceptance of Terms",
      content: `By accessing and using selectivecrew.com, you agree to be legally bound by these Terms of Service. If you do not agree with any of these terms, please do not use our services.

These terms apply to all visitors, candidates, and employers who access or use Selective Crew's services.`
    },
    {
      title: "2. Description of Service",
      content: `Selective Crew is a maritime recruitment agency that connects Latin American candidates with employment opportunities at cruise lines. Our services include:

• Posting cruise line job openings.
• Evaluating and selecting candidates.
• Facilitating the interview process.
• Guidance during the onboarding process.
• Resources and information for candidates.

Selective Crew acts strictly as an intermediary between candidates and employers. We are not direct employers of placed candidates.`
    },
    {
      title: "3. Free Service for Candidates",
      content: `Voluntarily upholding the Maritime Labour Convention (MLC 2006), Selective Crew NEVER charges placement fees, registration fees, or any other type of fee to candidates.

• Registration and application are completely free.
• We do not charge for interviews, assessments, or guidance.
• We do not charge commissions on salaries.

If anyone requests payment on behalf of Selective Crew, please report it immediately to: info@selectivecrew.com`
    },
    {
      title: "4. Eligibility",
      content: `To use our services as a candidate, you must:

• Be at least 21 years of age.
• Provide truthful, accurate, and complete information in your application.
• Have valid legal documentation to work (valid passport).
• Meet the specific requirements of each position.
• Be a resident of one of the Latin American countries in which we operate.

We reserve the right to reject applications that do not meet these criteria.`
    },
    {
      title: "5. Candidate Responsibilities",
      content: `As a candidate, you agree to:

• Provide only truthful and up-to-date information in your application.
• Not impersonate another person.
• Maintain the confidentiality of your account and password.
• Notify us immediately of any changes to your contact information.
• Behave professionally in all interactions with our team and employers.
• Not use our services for illegal or unauthorized purposes.
• Respect Selective Crew's intellectual property rights.`
    },
    {
      title: "6. Selection Process",
      content: `Selective Crew reserves the right to:

• Select the candidates we consider most suitable for each position.
• Reject applications without needing to provide justification.
• Disqualify candidates who provide false or misleading information.
• End a candidate's process at any stage if inappropriate conduct is detected.

Inclusion in our database does not guarantee job placement. The final hiring decision rests with the employer.`
    },
    {
      title: "7. Intellectual Property",
      content: `All content on selectivecrew.com, including but not limited to:

• Texts, articles, and job descriptions.
• Logos, images, and graphics.
• Source code and website design.
• Training materials and resources.

Is the exclusive property of Selective Crew and is protected by applicable intellectual property laws. Reproduction, distribution, or use without express written authorization is prohibited.`
    },
    {
      title: "8. Limitation of Liability",
      content: `Selective Crew shall not be liable for:

• Hiring decisions made by employers.
• Working conditions aboard vessels.
• Losses or damages arising from the use of our services.
• Temporary service interruptions due to maintenance or technical causes.
• Information provided by third-party employers.

Our maximum liability under any circumstances is limited to the value of services rendered, which for candidates is zero given that our service is free.`
    },
    {
      title: "9. Modifications to Service",
      content: `Selective Crew reserves the right to:

• Modify, suspend, or discontinue any part of the service at any time.
• Update these Terms of Service with 30 days prior notice.
• Change eligibility requirements for candidates.

We will notify you of significant changes through our website or by email. Continued use of our services after such changes constitutes your acceptance.`
    },
    {
      title: "10. Governing Law",
      content: `These Terms of Service are governed by the laws of the Republic of Colombia. Any dispute related to these terms will be resolved through arbitration in Colombia, in accordance with applicable Colombian laws.

Additionally, Selective Crew operates in compliance with:
• Maritime Labour Convention MLC 2006.
• Law 1581 of 2010 (Colombian Personal Data Protection Law).
• International maritime recruitment regulations.`
    },
    {
      title: "11. Contact",
      content: `For questions about these Terms of Service, contact us:

📧 Email: legal@selectivecrew.com
🌐 Website: selectivecrew.com/contact
📍 Location: Colombia

We will respond to all inquiries within 10 business days.`
    },
  ];

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", color: navy, background: "#f8faff", minHeight: "100vh" }}>

      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, ${navy}, ${ocean})`, color: "#fff", padding: "64px 20px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: gold, textTransform: "uppercase", marginBottom: 12 }}>Legal</div>
          <h1 style={{ fontSize: 38, fontWeight: 800, marginBottom: 16 }}>
            {es ? "Términos de Servicio" : "Terms of Service"}
          </h1>
          <p style={{ fontSize: 14, color: "#b8d0f0" }}>
            {es ? "Última actualización: Enero 2026" : "Last updated: January 2026"}
          </p>
          <div style={{ background: "rgba(240,165,0,0.15)", border: "1px solid rgba(240,165,0,0.3)", borderRadius: 12, padding: "14px 24px", marginTop: 24, display: "inline-block" }}>
            <p style={{ fontSize: 13, color: gold, margin: 0 }}>
              {es
                ? "⚓ Nos acogemos voluntariamente al Convenio MLC 2006 — Nunca cobramos a los candidatos."
                : "⚓ We operate under MLC 2006 Convention — We never charge candidates."}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: "60px 20px", maxWidth: 800, margin: "0 auto" }}>

        {/* Intro */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 32, marginBottom: 24, border: "1px solid #e0e8f5", boxShadow: "0 2px 16px rgba(14,77,138,0.06)" }}>
          <p style={{ fontSize: 15, color: "#555", lineHeight: 1.9 }}>
            {es
              ? `Bienvenido a Selective Crew. Estos Términos de Servicio regulan su uso de nuestro sitio web selectivecrew.com y todos los servicios relacionados. Por favor léalos detenidamente antes de utilizar nuestros servicios.`
              : `Welcome to Selective Crew. These Terms of Service govern your use of our website selectivecrew.com and all related services. Please read them carefully before using our services.`}
          </p>
        </div>

        {/* Sections */}
        {sections.map((section, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 16, padding: 32, marginBottom: 16, border: "1px solid #e0e8f5", boxShadow: "0 2px 16px rgba(14,77,138,0.04)" }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: navy, marginBottom: 16, paddingBottom: 12, borderBottom: `2px solid ${gold}`, display: "inline-block" }}>
              {section.title}
            </h2>
            <div style={{ fontSize: 14, color: "#555", lineHeight: 1.9, whiteSpace: "pre-line" }}>
              {section.content}
            </div>
          </div>
        ))}

        {/* Bottom badge */}
        <div style={{ background: `linear-gradient(135deg, ${navy}, ${ocean})`, borderRadius: 16, padding: 32, textAlign: "center", color: "#fff", marginTop: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⚓</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: gold, marginBottom: 8 }}>
            {es ? "Agencia 100% Licenciada y MLC 2006 Standards" : "100% Licensed & MLC 2006 Standards Agency"}
          </h3>
          <p style={{ fontSize: 13, color: "#b8d0f0", lineHeight: 1.8 }}>
            {es
              ? "Selective Crew opera bajo el Convenio sobre el Trabajo Marítimo (MLC 2006). Nunca cobramos a los candidatos. Siempre."
              : "Selective Crew operates under the Maritime Labour Convention (MLC 2006). We never charge candidates. Ever."}
          </p>
        </div>
      </section>
    </div>
  );
}
