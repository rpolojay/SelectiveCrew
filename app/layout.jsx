import './globals.css';
import Script from 'next/script';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import { LanguageProvider } from '../lib/LanguageContext';

export const metadata = {
  metadataBase: new URL('https://selectivecrew.com'),
  title: {
    default: 'Selective Crew | Trabajos en Cruceros para Latinoamericanos',
    template: '%s | Selective Crew',
  },
  description: 'Agencia con sede en Colombia que conecta a latinoamericanos con trabajos en cruceros. Aplicar es 100% gratis: nunca cobramos a los candidatos. Desde 2009, más de 2,000 candidatos ubicados.',
  keywords: ['cruise ship jobs', 'trabajos en cruceros', 'cruise ship recruitment', 'empleo en cruceros', 'retail sales cruise ship', 'photographer cruise ship', 'Starboard Cruise Services', 'Norwegian Cruise Line jobs', 'cruceros Colombia', 'selective crew'],
  openGraph: {
    type: 'website',
    siteName: 'Selective Crew',
    locale: 'es_CO',
    title: 'Selective Crew | Trabajos en Cruceros para Latinoamericanos',
    description: 'Gana $900-$1,000/mes + comisiones trabajando en un crucero. Reclutamiento 100% gratis. Más de 2,000 candidatos ubicados desde 2009.',
    images: [{ url: 'https://res.cloudinary.com/dr9xpsjmb/image/upload/v1767023146/SC_Enhanced_ssyr8a.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Selective Crew | Trabajos en Cruceros para Latinoamericanos',
    description: 'Gana $900-$1,000/mes + comisiones. Reclutamiento 100% gratis. Más de 2,000 ubicados desde 2009.',
  },
  robots: { index: true, follow: true },
};

const schemaOrg = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Selective Crew',
  url: 'https://selectivecrew.com',
  logo: 'https://res.cloudinary.com/dr9xpsjmb/image/upload/v1767023146/SC_Enhanced_ssyr8a.jpg',
  description: 'Cruise ship recruitment agency for Latin American professionals. Founded in 2009.',
  foundingDate: '2009',
  founder: { '@type': 'Person', name: 'Raul Polo Jay' },
  address: { '@type': 'PostalAddress', addressCountry: 'CO' },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+57-318-847-4058',
    contactType: 'recruitment',
    availableLanguage: ['English', 'Spanish'],
  },
  sameAs: [
    'https://www.facebook.com/selectivecrew',
    'https://www.instagram.com/selectivecrew',
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }} />
      </head>
      <body>
        <LanguageProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton />
        </LanguageProvider>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-DK3E89Y05W" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-DK3E89Y05W');
        `}</Script>
      </body>
    </html>
  );
}
