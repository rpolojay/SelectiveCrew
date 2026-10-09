import Link from 'next/link';
import JobsClient from './JobsClient';

export const metadata = {
  title: 'Vacantes en Cruceros: Posiciones Abiertas',
  description: 'Explora las vacantes actuales en cruceros con Selective Crew: ventas, joyería, gerencia y fotografía a bordo. Aplicar es 100% gratis.',
  alternates: { canonical: 'https://selectivecrew.com/jobs' },
  openGraph: {
    type: 'website',
    url: 'https://selectivecrew.com/jobs',
    siteName: 'Selective Crew',
    locale: 'es_CO',
    title: 'Vacantes en Cruceros: Posiciones Abiertas | Selective Crew',
    description: 'Vacantes actuales en cruceros. Aplicar es 100% gratis.',
    images: [{ url: 'https://res.cloudinary.com/dr9xpsjmb/image/upload/v1767023146/SC_Enhanced_ssyr8a.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vacantes en Cruceros: Posiciones Abiertas | Selective Crew',
    description: 'Vacantes actuales en cruceros. Aplicar es 100% gratis.',
  },
};

export default function JobsPage() {
  return <JobsClient />;
}
