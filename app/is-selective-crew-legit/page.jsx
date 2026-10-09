'use client';
import { useLang } from '../../lib/LanguageContext';

const navy = "#0a1628";
const ocean = "#0e4d8a";
const gold = "#f0a500";
const green = "#16a34a";

export default function LegitPage() {
  const { lang } = useLang();
  const es = lang === 'es';

  const redFlags = [
    { flag_en: 'They ask you to pay upfront fees to apply', flag_es: 'Te piden pagar tarifas por adelantado para aplicar' },
    { flag_en: 'They have no verifiable physical address or registration', flag_es: 'No tienen direccion fisica verificable ni registro' },
    { flag_en: 'They guarantee a job without any interview', flag_es: 'Garantizan trabajo sin ninguna entrevista' },
    { flag_en: 'They ask for your passport or ID before a formal offer', flag_es: 'Piden tu pasaporte o ID antes de una oferta formal' },
    { flag_en: 'They have no reviews or social media presence', flag_es: 'No tienen resenas ni presencia en redes sociales' },
    { flag_en: 'They contact you unsolicited with a job offer', flag_es: 'Te contactan sin solicitud con una oferta de trabajo' },
  ];

  const proofs = [
    { icon: '📅', title_en: 'Founded in 2009', title_es: 'Fundada en 2009', desc_en: 'Over 15 years placing Latin American crew on cruise ships worldwide.', desc_es: 'Mas de 15 anos colocando tripulacion latinoamericana en cruceros de todo el mundo.' },
    { icon: '👥', title_en: '2,000+ Candidates Placed', title_es: 'Mas de 2,000 Candidatos Colocados', desc_en: 'Real people with real careers at sea. Many have returned for 2nd and 3rd contracts.', desc_es: 'Personas reales con carreras reales en el mar. Muchos han regresado para 2do y 3er contrato.' },
    { icon: '🚢', title_en: 'Official Recruitment Partner', title_es: 'Socio Oficial de Reclutamiento', desc_en: 'We work directly with Starboard Cruise Services and Norwegian Cruise Line and Grand Circle Cruise Line — two of the largest cruise concessionaires in the world.', desc_es: 'Trabajamos directamente con Starboard Cruise Services y Norwegian Cruise Line and Grand Circle Cruise Line — dos de los concesionarios de cruceros mas grandes del mundo.' },
    { icon: '💰', title_en: 'We Never Charge Candidates', title_es: 'Nunca Cobramos a los Candidatos', desc_en: 'Our recruitment service is 100% free for candidates. We are paid by the employer, not you.', desc_es: 'Nuestro servicio de reclutamiento es 100% gratuito para candidatos. Nos paga el empleador, no tu.' },
    { icon: '📱', title_en: 'Verifiable Social Proof', title_es: 'Prueba Social Verificable', desc_en: 'Hundreds of reviews on Facebook from real placed candidates. Check our page yourself.', desc_es: 'Cientos de resenas en Facebook de candidatos reales colocados. Consulta nuestra pagina tu mismo.' },
    { icon: '🌍', title_en: 'Based in Colombia', title_es: 'Con sede en Colombia', desc_en: 'Selective Crew is a Colombian company founded by Raul Polo Jay, a maritime industry professional with over 15 years of experience.', desc_es: 'Selective Crew es una empresa colombiana fundada por Raul Polo Jay, profesional de la industria maritima con mas de 15 anos de experiencia.' },
  ];

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, ${navy} 0%, ${ocean} 100%)`, color: '#fff', padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(22,163,74,0.2)', border: '1px solid rgba(22,163,74,0.4)', borderRadius: 50, padding: '8px 20px', marginBottom: 20 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#4ade80' }}>{es ? 'Verificado y Legitimo' : 'Verified & Legitimate'}</span>
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16 }}>
            {es ? 'Es Selective Crew Legítimo?' : 'Is Selective Crew Legit?'}
          </h1>
          <p style={{ fontSize: 18, color: '#b8d0f0', lineHeight: 1.8, fontWeight: 600 }}>
            {es ? 'Si. Y aqui esta la prueba.' : 'Yes. And here is the proof.'}
          </p>
          <p style={{ fontSize: 15, color: '#8fb8e8', lineHeight: 1.8, marginTop: 12 }}>
            {es
              ? 'Entendemos el escepticismo. Hay muchas estafas de trabajo en cruceros en linea. Aqui esta exactamente por que Selective Crew es diferente.'
              : 'We understand the skepticism. There are many cruise ship job scams online. Here is exactly why Selective Crew is different.'}
          </p>
        </div>
      </section>

      {/* Proof points */}
      <section style={{ padding: '60px 20px', background: '#f8faff' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: navy, textAlign: 'center', marginBottom: 8 }}>
            {es ? '6 Razones por las que Somos Legitimos' : '6 Reasons We Are Legitimate'}
          </h2>
          <p style={{ color: '#888', textAlign: 'center', marginBottom: 40 }}>
            {es ? 'Hechos verificables, no promesas vacias.' : 'Verifiable facts, not empty promises.'}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            {proofs.map((p, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 20, padding: '28px 28px', boxShadow: '0 2px 16px rgba(14,77,138,0.06)', border: '1px solid #e8eef8', display: 'flex', gap: 16 }}>
                <div style={{ fontSize: 36, flexShrink: 0 }}>{p.icon}</div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: navy, marginBottom: 8 }}>{es ? p.title_es : p.title_en}</h3>
                  <p style={{ fontSize: 14, color: '#666', lineHeight: 1.7 }}>{es ? p.desc_es : p.desc_en}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Red flags section */}
      <section style={{ padding: '60px 20px', background: '#fff' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ background: '#fff5f5', border: '1.5px solid #fecaca', borderRadius: 20, padding: '40px' }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#991b1b', marginBottom: 8 }}>
              {es ? 'Banderas Rojas de Estafas de Cruceros' : 'Red Flags of Cruise Ship Scams'}
            </h2>
            <p style={{ color: '#b91c1c', fontSize: 14, marginBottom: 24 }}>
              {es ? 'Protegete. Estas son las senales de advertencia a tener en cuenta:' : 'Protect yourself. These are the warning signs to watch out for:'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {redFlags.map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ color: '#dc2626', fontWeight: 800, fontSize: 18, flexShrink: 0, marginTop: 1 }}>✗</span>
                  <p style={{ fontSize: 14, color: '#7f1d1d', lineHeight: 1.6 }}>{es ? r.flag_es : r.flag_en}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24, padding: '16px 20px', background: '#fef2f2', borderRadius: 12, border: '1px solid #fca5a5' }}>
              <p style={{ fontSize: 13, color: '#991b1b', fontWeight: 600 }}>
                {es
                  ? 'Selective Crew NUNCA hace ninguna de estas cosas. Nuestro servicio es 100% gratuito para candidatos.'
                  : 'Selective Crew NEVER does any of these things. Our service is 100% free for candidates.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Facebook reviews */}
      <section style={{ padding: '60px 20px', background: '#f8faff' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: navy, marginBottom: 12 }}>
            {es ? 'No Nos Creas a Nosotros — Lee las Resenas' : "Don't Take Our Word For It — Read the Reviews"}
          </h2>
          <p style={{ color: '#666', marginBottom: 32 }}>
            {es
              ? 'Cientos de candidatos reales han compartido sus experiencias en nuestra pagina de Facebook.'
              : 'Hundreds of real candidates have shared their experiences on our Facebook page.'}
          </p>
          <a
            href="https://www.facebook.com/selectivecrew/reviews"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#1877f2', color: '#fff', borderRadius: 14, padding: '16px 32px', fontSize: 15, fontWeight: 700, textDecoration: 'none', marginBottom: 40 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            {es ? 'Ver Resenas en Facebook' : 'View Facebook Reviews'}
          </a>

          <div style={{ background: `linear-gradient(135deg, ${navy} 0%, ${ocean} 100%)`, borderRadius: 20, padding: '40px', color: '#fff' }}>
            <p style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
              {es ? 'Listo para Aplicar?' : 'Ready to Apply?'}
            </p>
            <p style={{ color: '#b8d0f0', fontSize: 14, marginBottom: 24 }}>
              {es ? 'Nuestro servicio es 100% gratuito. Nunca te cobraremos nada.' : 'Our service is 100% free. We will never charge you anything.'}
            </p>
            <a href="/apply" style={{ display: 'inline-block', background: gold, color: navy, borderRadius: 12, padding: '14px 32px', fontSize: 15, fontWeight: 800, textDecoration: 'none' }}>
              {es ? 'Aplicar Gratis Ahora →' : 'Apply for Free Now →'}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
