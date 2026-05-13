import Link from 'next/link';
import JobsClient from './JobsClient';

export const metadata = {
  title: 'Cruise Ship Jobs | Selective Crew',
  description: 'Browse all current cruise ship job opportunities from Selective Crew. 100% free to apply.',
};

export default function JobsPage() {
  return <JobsClient />;
}
