'use client';
import { useLang } from '../../../lib/LanguageContext';
import { useParams } from 'next/navigation';

const navy = "#0a1628";
const ocean = "#0e4d8a";
const gold = "#f0a500";

const JOBS = {
  'retail-sales-associate': {
    title_en: 'Retail Sales Associate',
    title_es: 'Asociado de Ventas al por Menor',
    company: 'Starboard Cruise Services',
    salary: '$900/month + commission',
    contract: '6 months',
    location: 'Worldwide',
    category_en: 'Retail',
    category_es: 'Ventas',
    applyLink: '/apply',
    description_en: 'As a Retail Sales Associate with Starboard Cruise Services, you will work in onboard shops selling duty-free products including liquor, perfume, cosmetics, and accessories to cruise ship guests from around the world.',
    description_es: 'Como Asociado de Ventas con Starboard Cruise Services, trabajaras en tiendas a bordo vendiendo productos duty-free a huespedes de cruceros de todo el mundo.',
    responsibilities_en: ['Actively approach and engage guests on the shop floor', 'Present and demonstrate duty-free products', 'Meet and exceed daily and weekly sales targets', 'Maintain attractive product displays and clean counters', 'Process sales transactions accurately', 'Build rapport with returning guests'],
    responsibilities_es: ['Acercarse activamente e involucrar a los huespedes en la tienda', 'Presentar y demostrar productos duty-free', 'Cumplir y superar metas de ventas diarias y semanales', 'Mantener exhibiciones de productos atractivas', 'Procesar transacciones de ventas con precision', 'Construir relacion con huespedes recurrentes'],
    requirements_en: ['Age 21 or older', 'Intermediate to advanced English', 'Previous retail or sales experience preferred', 'Clean criminal record', 'Valid passport', 'No visible tattoos on face, neck, or hands', 'Outgoing personality'],
    requirements_es: ['21 anos o mas', 'Ingles intermedio a avanzado', 'Experiencia previa en retail o ventas preferida', 'Antecedentes penales limpios', 'Pasaporte vigente', 'Sin tatuajes visibles en cara, cuello o manos', 'Personalidad extrovertida'],
    benefits_en: ['Base salary $900/month guaranteed', 'Commission on all personal sales', 'Free round-trip flights to ship', 'Free accommodation on board', 'Free meals', 'Full medical insurance', 'Travel worldwide'],
    benefits_es: ['Salario base $900/mes garantizado', 'Comision en todas las ventas personales', 'Vuelos de ida y vuelta gratis', 'Alojamiento a bordo gratis', 'Comidas gratis', 'Seguro medico completo', 'Viaje por todo el mundo'],
  },
  'fine-jewelry-specialist': {
    title_en: 'Fine Jewelry Specialist',
    title_es: 'Especialista en Joyeria Fina',
    company: 'Starboard Cruise Services',
    salary: '$900/month + commission',
    contract: '6 months',
    location: 'Worldwide',
    category_en: 'Retail',
    category_es: 'Ventas',
    applyLink: '/apply',
    description_en: 'As a Fine Jewelry Specialist with Starboard Cruise Services, you will sell luxury jewelry including gold, diamonds, tanzanite, and gemstones to guests in the onboard jewelry boutique.',
    description_es: 'Como Especialista en Joyeria Fina con Starboard Cruise Services, vendereras joyeria de lujo incluyendo oro, diamantes, tanzanita y gemas a huespedes en la boutique de joyeria a bordo.',
    responsibilities_en: ['Present and sell fine jewelry to cruise ship guests', 'Educate guests on gemstones and jewelry craftsmanship', 'Build high-value client relationships', 'Achieve high-ticket sales targets', 'Maintain jewelry display cases to luxury standards'],
    responsibilities_es: ['Presentar y vender joyeria fina a huespedes de cruceros', 'Educar a los huespedes sobre gemas y artesania de joyeria', 'Construir relaciones de alto valor con clientes', 'Alcanzar metas de ventas de alto valor', 'Mantener las vitrinas de joyeria segun estandares de lujo'],
    requirements_en: ['Age 21 or older', 'Advanced English required', 'Previous luxury retail experience preferred', 'Polished professional presentation', 'Clean criminal record', 'Valid passport', 'No visible tattoos on face, neck, or hands'],
    requirements_es: ['21 anos o mas', 'Ingles avanzado requerido', 'Experiencia previa en retail de lujo preferida', 'Presentacion impecable y profesional', 'Antecedentes penales limpios', 'Pasaporte vigente', 'Sin tatuajes visibles en cara, cuello o manos'],
    benefits_en: ['Base salary $900/month guaranteed', 'High commission potential on luxury sales', 'Free round-trip flights', 'Free accommodation on board', 'Free meals', 'Full medical insurance', 'Travel worldwide'],
    benefits_es: ['Salario base $900/mes garantizado', 'Alto potencial de comision en ventas de lujo', 'Vuelos de ida y vuelta gratis', 'Alojamiento a bordo gratis', 'Comidas gratis', 'Seguro medico completo', 'Viaje por todo el mundo'],
  },
  'assistant-retail-sales-manager': {
    title_en: 'Assistant Retail Sales Manager',
    title_es: 'Asistente de Gerente de Ventas',
    company: 'Starboard Cruise Services',
    salary: '$900/month + commission',
    contract: '6 months',
    location: 'Worldwide',
    category_en: 'Management',
    category_es: 'Gerencia',
    applyLink: '/apply',
    description_en: 'As an Assistant Retail Sales Manager with Starboard Cruise Services, you will support the Retail Manager in leading the onboard sales team and driving performance across all retail outlets.',
    description_es: 'Como Asistente de Gerente de Ventas con Starboard Cruise Services, apoyaras al Gerente de Ventas en liderar el equipo de ventas a bordo.',
    responsibilities_en: ['Support the Retail Manager in daily operations', 'Coach and motivate the sales team', 'Monitor individual and team sales performance', 'Handle guest complaints professionally', 'Manage inventory and product replenishment'],
    responsibilities_es: ['Apoyar al Gerente de Ventas en las operaciones diarias', 'Entrenar y motivar al equipo de ventas', 'Monitorear el rendimiento de ventas', 'Manejar quejas de huespedes profesionalmente', 'Gestionar inventario y reabastecimiento de productos'],
    requirements_en: ['Age 21 or older', 'Advanced English required', 'Previous retail management experience preferred', 'Strong leadership skills', 'Clean criminal record', 'Valid passport', 'No visible tattoos on face, neck, or hands'],
    requirements_es: ['21 anos o mas', 'Ingles avanzado requerido', 'Experiencia previa en gestion de retail preferida', 'Fuertes habilidades de liderazgo', 'Antecedentes penales limpios', 'Pasaporte vigente', 'Sin tatuajes visibles en cara, cuello o manos'],
    benefits_en: ['Base salary $900/month guaranteed', 'Commission on team and personal sales', 'Free round-trip flights', 'Free accommodation on board', 'Free meals', 'Full medical insurance', 'Career path to Retail Manager'],
    benefits_es: ['Salario base $900/mes garantizado', 'Comision en ventas del equipo y personales', 'Vuelos de ida y vuelta gratis', 'Alojamiento a bordo gratis', 'Comidas gratis', 'Seguro medico completo', 'Trayectoria a Gerente de Ventas'],
  },
  'photographer-ncl': {
    title_en: 'Photographer',
    title_es: 'Fotografo',
    company: 'Norwegian Cruise Line (NCL)',
    salary: '$1,000/month + commission',
    contract: '6-8 months',
    location: 'Worldwide',
    category_en: 'Photography',
    category_es: 'Fotografia',
    applyLink: '/apply-photographer',
    description_en: 'As a Photographer with Norwegian Cruise Line, you will capture memorable moments for guests throughout their cruise and sell photo packages in the Photo Gallery.',
    description_es: 'Como Fotografo con Norwegian Cruise Line, capturaras momentos memorables para los huespedes durante su crucero y vendereras paquetes de fotos en la Galeria de Fotos.',
    responsibilities_en: ['Photograph guests at embarkation and ports', 'Cover formal night portrait sessions', 'Photograph entertainment and onboard events', 'Edit and process photos for the Photo Gallery', 'Sell photo packages to guests'],
    responsibilities_es: ['Fotografiar huespedes en embarque y puertos', 'Cubrir sesiones de retratos en noches formales', 'Fotografiar entretenimiento y eventos a bordo', 'Editar y procesar fotos para la Galeria de Fotos', 'Vender paquetes de fotos a huespedes'],
    requirements_en: ['Age 21 or older', 'Intermediate to advanced English', 'Portfolio of portrait or event photography required', 'Sales-oriented personality', 'Clean criminal record', 'Valid passport', 'No visible tattoos on face, neck, or hands'],
    requirements_es: ['21 anos o mas', 'Ingles intermedio a avanzado', 'Portafolio de fotografia de retratos o eventos requerido', 'Personalidad orientada a las ventas', 'Antecedentes penales limpios', 'Pasaporte vigente', 'Sin tatuajes visibles en cara, cuello o manos'],
    benefits_en: ['Base salary $1,000/month guaranteed', 'Commission on photo package sales', 'All photography equipment provided', 'Free round-trip flights', 'Free accommodation on board', 'Free meals', 'Full medical insurance'],
    benefits_es: ['Salario base $1,000/mes garantizado', 'Comision en ventas de paquetes de fotos', 'Todo el equipo de fotografia proporcionado', 'Vuelos de ida y vuelta gratis', 'Alojamiento a bordo gratis', 'Comidas gratis', 'Seguro medico completo'],
  },
};

export default function JobDetailPage() {
  const { lang } = useLang();
  const params = useParams();
  const es = lang === 'es';
  const slug = params?.slug;
  const job = JOBS[slug];

  if (!job) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: navy, marginBottom: 12 }}>{es ? 'Posicion no encontrada' : 'Position not found'}</h1>
          <a href="/jobs" style={{ color: ocean, textDecoration: 'none', fontWeight: 600 }}>{es ? 'Ver todas las posiciones' : 'View all positions'}</a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <section style={{ background: `linear-gradient(135deg, ${navy} 0%, ${ocean} 100%)`, color: '#fff', padding: '80px 20px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <a href="/jobs" style={{ color: '#b8d0f0', textDecoration: 'none', fontSize: 13, fontWeight: 600, display: 'inline-block', marginBottom: 24 }}>
            {es ? '← Ver todas las posiciones' : '← View all positions'}
          </a>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: gold, textTransform: 'uppercase', marginBottom: 12 }}>{es ? job.category_es : job.category_en}</div>
              <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 8 }}>{es ? job.title_es : job.title_en}</h1>
              <p style={{ color: '#b8d0f0', fontSize: 16 }}>{job.company}</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: '20px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: gold }}>{job.salary}</div>
              <div style={{ fontSize: 12, color: '#b8d0f0', marginTop: 4 }}>{job.contract} · {job.location}</div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '60px 20px', background: '#f8faff' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 300px', gap: 32, alignItems: 'start' }}>
          <div>
            <div style={{ background: '#fff', borderRadius: 20, padding: 32, boxShadow: '0 2px 16px rgba(14,77,138,0.06)', marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: navy, marginBottom: 16 }}>{es ? 'Sobre el Puesto' : 'About the Role'}</h2>
              <p style={{ fontSize: 15, color: '#555', lineHeight: 1.8 }}>{es ? job.description_es : job.description_en}</p>
            </div>
            <div style={{ background: '#fff', borderRadius: 20, padding: 32, boxShadow: '0 2px 16px rgba(14,77,138,0.06)', marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: navy, marginBottom: 16 }}>{es ? 'Responsabilidades' : 'Responsibilities'}</h2>
              {(es ? job.responsibilities_es : job.responsibilities_en).map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                  <span style={{ color: ocean, fontWeight: 700, flexShrink: 0 }}>→</span>
                  <p style={{ fontSize: 14, color: '#555', lineHeight: 1.7 }}>{r}</p>
                </div>
              ))}
            </div>
            <div style={{ background: '#fff', borderRadius: 20, padding: 32, boxShadow: '0 2px 16px rgba(14,77,138,0.06)' }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: navy, marginBottom: 16 }}>{es ? 'Requisitos' : 'Requirements'}</h2>
              {(es ? job.requirements_es : job.requirements_en).map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                  <span style={{ color: '#16a34a', fontWeight: 700, flexShrink: 0 }}>✓</span>
                  <p style={{ fontSize: 14, color: '#555', lineHeight: 1.7 }}>{r}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ position: 'sticky', top: 24 }}>
            <div style={{ background: `linear-gradient(135deg, ${navy} 0%, ${ocean} 100%)`, borderRadius: 20, padding: 28, color: '#fff', marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>{es ? 'Beneficios' : 'Benefits'}</h3>
              {(es ? job.benefits_es : job.benefits_en).map((b, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <span style={{ color: gold, flexShrink: 0 }}>★</span>
                  <p style={{ fontSize: 13, color: '#b8d0f0', lineHeight: 1.6 }}>{b}</p>
                </div>
              ))}
              <a href={job.applyLink} style={{ display: 'block', background: gold, color: navy, borderRadius: 12, padding: '14px', fontSize: 15, fontWeight: 800, textDecoration: 'none', textAlign: 'center', marginTop: 24 }}>
                {es ? 'Aplicar Ahora →' : 'Apply Now →'}
              </a>
            </div>
            <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 12px rgba(14,77,138,0.06)', textAlign: 'center' }}>
              <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>{es ? 'Preguntas? Hablanos por WhatsApp' : 'Questions? Chat with us on WhatsApp'}</p>
              <a href="https://wa.me/573188474058" target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#25d366', color: '#fff', borderRadius: 10, padding: '10px 20px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
