export const metadata = {
  title: { absolute: 'LATAM Recruiting as a Service for U.S. Employers | Selective Crew' },
  description: 'Hire qualified talent in Latin America with managed sourcing, candidate screening, recruiting coordination, and visibility into your candidate pipeline.',
  alternates: { canonical: 'https://selectivecrew.com/employers' },
  openGraph: {
    type: 'website',
    url: 'https://selectivecrew.com/employers',
    siteName: 'Selective Crew',
    title: 'LATAM Recruiting as a Service | Selective Crew',
    description: 'Qualified Latin American talent, managed through our proprietary candidate pipeline.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LATAM Recruiting as a Service | Selective Crew',
    description: 'Qualified Latin American talent, managed through our proprietary candidate pipeline.',
  },
};

export default function EmployersLayout({ children }) {
  return children;
}
