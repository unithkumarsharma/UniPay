'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function DashboardLayout({ children, requiredRole }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true); // collapsed by default on mobile
  const { user, isLoading, getRolePath } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // On desktop, default open
    if (window.innerWidth > 768) {
      setSidebarCollapsed(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
    // If user is logged in but on wrong panel, redirect to their correct panel
    if (!isLoading && user && requiredRole && user.role !== requiredRole) {
      router.push(getRolePath(user.role));
    }
  }, [user, isLoading, requiredRole, router, getRolePath]);

  if (isLoading || !user) {
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
            width: 48,
            height: 48,
            border: '3px solid var(--border-color)',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 12px',
          }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Loading...</p>
        </div>
      </div>
    );
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      <Navbar onMenuToggle={toggleSidebar} sidebarCollapsed={sidebarCollapsed} />
      <main className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="page-container animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
