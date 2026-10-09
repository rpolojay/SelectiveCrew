import { Inter } from 'next/font/google';

export const metadata = {
  title: 'Free Cruise Ship Retail Sales Training',
  description: 'Take our free online training course and learn how to get hired as a retail sales associate on cruise ships. Earn a certificate and get fast-tracked by SelectiveCrew recruiters.',
  keywords: 'cruise ship retail training, duty free sales course, cruise ship jobs training, how to get cruise ship job, onboard retail sales, starboard cruise services training, free cruise ship training certificate',
  openGraph: {
    title: 'Free Cruise Ship Retail Sales Training — SelectiveCrew',
    description: 'Free 25-minute course. Learn duty-free sales, earn a certificate, and get fast-tracked into cruise ship retail jobs with Starboard and NCL.',
    url: 'https://selectivecrew.com/training',
    siteName: 'SelectiveCrew',
    type: 'website',
    images: [{ url: 'https://selectivecrew.com/og-training.jpg', width: 1200, height: 630, alt: 'SelectiveCrew Free Retail Training Course' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Cruise Ship Retail Training | SelectiveCrew',
    description: 'Free 25-minute course. Earn a certificate and get fast-tracked into cruise ship retail jobs.',
  },
  alternates: {
    canonical: 'https://selectivecrew.com/training',
  },
};

export default function TrainingLayout({ children }) {
  return children;
}
