export const metadata = {
  title: 'Banco de Talento para Trabajar en Cruceros',
  description: '¿Aún no estás listo para aplicar? Completa tu perfil, sube tu CV y te contactamos cuando haya una vacante en cruceros para ti. Registro gratis.',
  alternates: { canonical: 'https://selectivecrew.com/talent-pool' },
  openGraph: {
    type: 'website',
    url: 'https://selectivecrew.com/talent-pool',
    siteName: 'Selective Crew',
    locale: 'es_CO',
    title: 'Banco de Talento para Trabajar en Cruceros | Selective Crew',
    description: '¿Aún no estás listo? Guardamos tu perfil y te contactamos cuando haya una vacante para ti.',
    images: [{ url: 'https://res.cloudinary.com/dr9xpsjmb/image/upload/v1767023146/SC_Enhanced_ssyr8a.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Banco de Talento para Trabajar en Cruceros | Selective Crew',
    description: '¿Aún no estás listo? Guardamos tu perfil y te contactamos cuando haya una vacante para ti.',
  },
};

export default function TalentPoolLayout({ children }) {
  return children;
}
