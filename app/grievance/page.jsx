import GrievanceClient from './GrievanceClient';

export const metadata = {
  title: 'Formulario de Queja Formal',
  description: 'Presenta una queja o reclamo formal a Selective Crew. Todos los reportes se tratan de forma confidencial.',
  alternates: { canonical: 'https://selectivecrew.com/grievance' },
};

export default function GrievancePage() {
  return <GrievanceClient />;
}
