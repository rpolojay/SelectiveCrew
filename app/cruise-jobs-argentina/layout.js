export const metadata = {
  title: 'Trabajo en Cruceros para Argentinos',
  description: 'Vacantes abiertas en cruceros para argentinos con Starboard y NCL. Aplicar es gratis, con respuesta en 48 horas por WhatsApp. Requiere pasaporte vigente e inglés intermedio.',
  alternates: { canonical: 'https://selectivecrew.com/cruise-jobs-argentina' },
  openGraph: {
    type: 'website',
    url: 'https://selectivecrew.com/cruise-jobs-argentina',
    siteName: 'Selective Crew',
    locale: 'es_CO',
    title: 'Trabajo en Cruceros para Argentinos | Selective Crew',
    description: 'Trabaja en cruceros desde Argentina. Aplicar es gratis y te acompañamos en todo el proceso.',
    images: [{ url: 'https://res.cloudinary.com/dr9xpsjmb/image/upload/v1767023146/SC_Enhanced_ssyr8a.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trabajo en Cruceros para Argentinos | Selective Crew',
    description: 'Trabaja en cruceros desde Argentina. Aplicar es gratis y te acompañamos en todo el proceso.',
  },
};

export default function CruiseJobsArgentinaLayout({ children }) {
  return children;
}
