export const metadata = {
  title: 'Quiénes Somos: Reclutamiento para Cruceros desde 2009',
  description: 'Desde 2009 conectamos a profesionales latinoamericanos con trabajos en cruceros. Agencia con sede en Colombia, más de 2,000 candidatos ubicados y reclutamiento 100% gratis.',
  alternates: { canonical: 'https://selectivecrew.com/about' },
  openGraph: {
    type: 'website',
    url: 'https://selectivecrew.com/about',
    siteName: 'Selective Crew',
    locale: 'es_CO',
    title: 'Quiénes Somos | Selective Crew',
    description: 'Desde 2009 conectamos a profesionales latinoamericanos con trabajos en cruceros.',
    images: [{ url: 'https://res.cloudinary.com/dr9xpsjmb/image/upload/v1767023146/SC_Enhanced_ssyr8a.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quiénes Somos | Selective Crew',
    description: 'Desde 2009 conectamos a profesionales latinoamericanos con trabajos en cruceros.',
  },
};

export default function AboutLayout({ children }) {
  return children;
}
