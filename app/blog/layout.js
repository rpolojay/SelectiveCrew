export const metadata = {
  title: 'Cruise Ship Career Blog',
  description: 'Guides, salary breakdowns, interview tips, and honest insights about working on cruise ships. Written by the Selective Crew recruitment team.',
  keywords: 'cruise ship jobs blog, cruise ship career guide, cruise ship salary, cruise ship interview tips, selective crew blog',
  alternates: { canonical: 'https://selectivecrew.com/blog' },
  openGraph: {
    title: 'Cruise Ship Career Blog | Selective Crew',
    description: 'Guides and honest insights about cruise ship careers from the Selective Crew team.',
    url: 'https://selectivecrew.com/blog',
    type: 'website',
  },
};

export default function BlogLayout({ children }) {
  return children;
}
