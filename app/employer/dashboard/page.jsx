'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EmployerDashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/employers');
  }, [router]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif" }}>
      <p style={{ color: "#888", fontSize: 14 }}>Redirecting...</p>
    </div>
  );
}
