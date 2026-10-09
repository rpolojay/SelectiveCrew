export const metadata = {
  title: 'Trabajo en Cruceros para Colombianos',
  description: 'Vacantes abiertas en cruceros para colombianos con Starboard y NCL. Aplicar es gratis y te guiamos con pasaporte, antecedentes y visa C1/D. Requiere inglés intermedio.',
  alternates: { canonical: 'https://selectivecrew.com/cruise-jobs-colombia' },
  openGraph: {
    type: 'website',
    url: 'https://selectivecrew.com/cruise-jobs-colombia',
    siteName: 'Selective Crew',
    locale: 'es_CO',
    title: 'Trabajo en Cruceros para Colombianos | Selective Crew',
    description: 'Trabaja en cruceros desde Colombia. Aplicar es gratis y te acompañamos en todo el proceso.',
    images: [{ url: 'https://res.cloudinary.com/dr9xpsjmb/image/upload/v1767023146/SC_Enhanced_ssyr8a.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trabajo en Cruceros para Colombianos | Selective Crew',
    description: 'Trabaja en cruceros desde Colombia. Aplicar es gratis y te acompañamos en todo el proceso.',
  },
};

export default function CruiseJobsColombiaLayout({ children }) {
  return children;
}
