import { Suspense } from 'react';
import SBInterestedClient from './SBInterestedClient';

export default function SBInterested() {
  return (
    <Suspense fallback={<div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}><p>Loading...</p></div>}>
      <SBInterestedClient />
    </Suspense>
  );
}
