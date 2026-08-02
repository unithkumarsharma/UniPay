'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user && user.role) {
        const paths = {
          admin: '/admin',
          accountant: '/accountant',
          master_distributor: '/master-distributor',
          distributor: '/distributor',
          retailer: '/retailer',
        };
        router.replace(paths[user.role] || '/auth/login');
      } else {
        router.replace('/auth/login');
      }
    }
  }, [user, isLoading, router]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'var(--bg-primary)',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 50,
          height: 50,
          border: '3px solid var(--border-color)',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 16px',
        }} />
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Redirecting to UniPay...</p>
      </div>
    </div>
  );
}
