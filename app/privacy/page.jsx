'use client';
import { useLang } from '../../lib/LanguageContext';

export default function PrivacyPage() {
  const { lang } = useLang();
  const es = lang === 'es';

  const navy = "#0a1628";
  const ocean = "#0e4d8a";
  const gold = "#f0a500";

  const sections = es ? [
    {
      title: "1. Información que Recopilamos",
      content: `Recopilamos la siguiente información cuando usted utiliza nuestros servicios:

• Información personal: nombre completo, dirección de correo electrónico, número de WhatsApp, país de residencia.
• Información profesional: CV/hoja de vida, experiencia laboral, habilidades, portafolio, enlaces a perfiles profesionales.
• Archivos multimedia: videos de entrevista, fotografías de portafolio.
• Información técnica: dirección IP, tipo de navegador, páginas visitadas, tiempo de permanencia en el sitio.
• Comunicaciones: mensajes enviados a través de nuestros formularios de contacto o WhatsApp.`
    },
    {
      title: "2. Cómo Usamos su Información",
      content: `Utilizamos su información para los siguientes propósitos:

• Evaluar su candidatura para posiciones en líneas de cruceros.
• Conectarlo con empleadores y líneas de cruceros asociadas.
• Comunicarnos con usted sobre el estado de su solicitud.
• Enviarle actualizaciones sobre nuevas oportunidades laborales relevantes.
• Mejorar nuestros servicios y experiencia de usuario.
• Cumplir con obligaciones legales y regulatorias.

Nunca vendemos, alquilamos ni compartimos su información personal con terceros no autorizados.`
    },
    {
      title: "3. Compartición de Datos con Terceros",
      content: `Compartimos su información únicamente con:

• Líneas de cruceros y empleadores asociados (Starboard Cruise Services, Norwegian Cruise Line) con el propósito exclusivo de evaluar su candidatura.
• Proveedores de servicios tecnológicos que nos ayudan a operar nuestra plataforma (Firebase/Google), bajo estrictos acuerdos de confidencialidad.
• Autoridades legales cuando sea requerido por ley.

Siempre le notificaremos antes de compartir su información con un empleador específico.`
    },
    {
      title: "4. Almacenamiento y Seguridad de Datos",
      content: `Su información es almacenada de forma segura en servidores de Google Firebase, que cumplen con los estándares internacionales de seguridad (ISO 27001, SOC 2).

Implementamos las siguientes medidas de seguridad:
• Cifrado SSL/TLS en todas las transmisiones de datos.
• Acceso restringido a datos personales solo para personal autorizado.
• Revisiones periódicas de seguridad.

Conservamos sus datos por un máximo de 3 años desde su última interacción con nosotros, o hasta que solicite su eliminación.`
    },
    {
      title: "5. Sus Derechos",
      content: `Usted tiene los siguientes derechos sobre sus datos personales:

• Derecho de acceso: Puede solicitar una copia de todos los datos que tenemos sobre usted.
• Derecho de rectificación: Puede solicitar la corrección de datos incorrectos.
• Derecho de eliminación: Puede solicitar que eliminemos todos sus datos personales.
• Derecho de portabilidad: Puede solicitar sus datos en un formato portable.
• Derecho de oposición: Puede oponerse al procesamiento de sus datos para fines de marketing.

Para ejercer cualquiera de estos derechos, contáctenos en: privacy@selectivecrew.com`
    },
    {
      title: "6. Cookies",
      content: `Utilizamos cookies para mejorar su experiencia en nuestro sitio web. Las cookies que utilizamos incluyen:

• Cookies esenciales: Necesarias para el funcionamiento básico del sitio.
• Cookies de análisis: Nos ayudan a entender cómo los usuarios interactúan con el sitio (Google Analytics).
• Cookies de preferencias: Recuerdan sus preferencias de idioma.

Puede desactivar las cookies en la configuración de su navegador, aunque esto puede afectar la funcionalidad del sitio.`
    },
    {
      title: "7. Menores de Edad",
      content: `Nuestros servicios no están dirigidos a personas menores de 18 años. No recopilamos conscientemente información personal de menores. Si usted es menor de 18 años, por favor no envíe información personal a través de nuestro sitio.

Si creemos haber recopilado información de un menor, la eliminaremos inmediatamente.`
    },
    {
      title: "8. Estandares MLC 2006",
      content: `Selective Crew se acoge voluntariamente a los estandares delmiento con el Convenio sobre el Trabajo Marítimo (MLC 2006) de la Organización Internacional del Trabajo. 

Esto significa:
• Nunca cobramos tarifas de colocación a los candidatos.
• Toda la información del candidato se maneja con confidencialidad.
• Los datos solo se comparten con empleadores legítimos y autorizados.`
    },
    {
      title: "9. Cambios a esta Política",
      content: `Podemos actualizar esta Política de Privacidad ocasionalmente. Le notificaremos sobre cambios significativos mediante un aviso prominente en nuestro sitio web o por correo electrónico.

Le recomendamos revisar esta política periódicamente. El uso continuado de nuestros servicios después de cambios constituye su aceptación de la política actualizada.`
    },
    {
      title: "10. Contacto",
      content: `Si tiene preguntas sobre esta Política de Privacidad o sobre cómo manejamos sus datos personales, puede contactarnos:

📧 Email: privacy@selectivecrew.com
🌐 Sitio web: selectivecrew.com/contact
📍 Ubicación: Colombia

Responderemos a todas las solicitudes dentro de 30 días hábiles.`
    },
  ] : [
    {
      title: "1. Information We Collect",
      content: `We collect the following information when you use our services:

• Personal information: full name, email address, WhatsApp number, country of residence.
• Professional information: CV/resume, work experience, skills, portfolio, links to professional profiles.
• Media files: interview videos, portfolio photographs.
• Technical information: IP address, browser type, pages visited, time spent on site.
• Communications: messages sent through our contact forms or WhatsApp.`
    },
    {
      title: "2. How We Use Your Information",
      content: `We use your information for the following purposes:

• To evaluate your candidacy for positions at cruise lines.
• To connect you with partner employers and cruise lines.
• To communicate with you about the status of your application.
• To send you updates about relevant new job opportunities.
• To improve our services and user experience.
• To comply with legal and regulatory obligations.

We never sell, rent, or share your personal information with unauthorized third parties.`
    },
    {
      title: "3. Data Sharing with Third Parties",
      content: `We share your information only with:

• Partner cruise lines and employers (Starboard Cruise Services, Norwegian Cruise Line) for the exclusive purpose of evaluating your candidacy.
• Technology service providers that help us operate our platform (Firebase/Google), under strict confidentiality agreements.
• Legal authorities when required by law.

We will always notify you before sharing your information with a specific employer.`
    },
    {
      title: "4. Data Storage and Security",
      content: `Your information is stored securely on Google Firebase servers, which comply with international security standards (ISO 27001, SOC 2).

We implement the following security measures:
• SSL/TLS encryption on all data transmissions.
• Restricted access to personal data for authorized personnel only.
• Periodic security reviews.

We retain your data for a maximum of 3 years from your last interaction with us, or until you request its deletion.`
    },
    {
      title: "5. Your Rights",
      content: `You have the following rights over your personal data:

• Right of access: You can request a copy of all data we hold about you.
• Right of rectification: You can request correction of incorrect data.
• Right of erasure: You can request that we delete all your personal data.
• Right of portability: You can request your data in a portable format.
• Right to object: You can object to the processing of your data for marketing purposes.

To exercise any of these rights, contact us at: privacy@selectivecrew.com`
    },
    {
      title: "6. Cookies",
      content: `We use cookies to improve your experience on our website. The cookies we use include:

• Essential cookies: Necessary for basic site functionality.
• Analytics cookies: Help us understand how users interact with the site (Google Analytics).
• Preference cookies: Remember your language preferences.

You can disable cookies in your browser settings, although this may affect site functionality.`
    },
    {
      title: "7. Minors",
      content: `Our services are not directed at persons under 18 years of age. We do not knowingly collect personal information from minors. If you are under 18, please do not submit personal information through our site.

If we believe we have collected information from a minor, we will delete it immediately.`
    },
    {
      title: "8. MLC 2006 Compliance",
      content: `Selective Crew voluntarily upholds the standards of the Maritime Labour Convention (MLC 2006) of the International Labour Organization.

This means:
• We never charge placement fees to candidates.
• All candidate information is handled with confidentiality.
• Data is only shared with legitimate, authorized employers.`
    },
    {
      title: "9. Changes to This Policy",
      content: `We may update this Privacy Policy occasionally. We will notify you of significant changes through a prominent notice on our website or by email.

We recommend reviewing this policy periodically. Continued use of our services after changes constitutes your acceptance of the updated policy.`
    },
    {
      title: "10. Contact",
      content: `If you have questions about this Privacy Policy or how we handle your personal data, you can contact us:

📧 Email: privacy@selectivecrew.com
🌐 Website: selectivecrew.com/contact
📍 Location: Colombia

We will respond to all requests within 30 business days.`
    },
  ];

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", color: navy, background: "#f8faff", minHeight: "100vh" }}>

      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, ${navy}, ${ocean})`, color: "#fff", padding: "64px 20px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: gold, textTransform: "uppercase", marginBottom: 12 }}>
            {es ? "Legal" : "Legal"}
          </div>
          <h1 style={{ fontSize: 38, fontWeight: 800, marginBottom: 16 }}>
            {es ? "Política de Privacidad" : "Privacy Policy"}
          </h1>
          <p style={{ fontSize: 14, color: "#b8d0f0" }}>
            {es ? "Última actualización: Enero 2026" : "Last updated: January 2026"}
          </p>
          <div style={{ background: "rgba(240,165,0,0.15)", border: "1px solid rgba(240,165,0,0.3)", borderRadius: 12, padding: "14px 24px", marginTop: 24, display: "inline-block" }}>
            <p style={{ fontSize: 13, color: gold, margin: 0 }}>
              {es
                ? "🔒 Selective Crew nunca vende ni comparte sus datos personales con terceros no autorizados."
                : "🔒 Selective Crew never sells or shares your personal data with unauthorized third parties."}
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
              ? `En Selective Crew ("nosotros", "nuestro"), nos comprometemos a proteger su privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos y protegemos su información personal cuando utiliza nuestros servicios de reclutamiento en selectivecrew.com. Al utilizar nuestros servicios, usted acepta las prácticas descritas en esta política.`
              : `At Selective Crew ("we", "our"), we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you use our recruitment services at selectivecrew.com. By using our services, you agree to the practices described in this policy.`}
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

        {/* MLC Badge */}
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
