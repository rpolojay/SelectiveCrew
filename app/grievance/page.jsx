import GrievanceClient from './GrievanceClient';

export const metadata = {
  title: 'Grievance Policy | Selective Crew',
  description: 'Submit a formal grievance or complaint to Selective Crew. All reports are handled confidentially.',
};

export default function GrievancePage() {
  return <GrievanceClient />;
}
