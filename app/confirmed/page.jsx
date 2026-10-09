import { Suspense } from 'react';
import ConfirmedClient from './ConfirmedClient';
export default function Confirmed() {
  return (
    <Suspense fallback={<div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}><p>Processing...</p></div>}>
      <ConfirmedClient />
    </Suspense>
  );
}
