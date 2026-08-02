'use client';
import DashboardLayout from '@/components/DashboardLayout';

export default function AdminLayout({ children }) {
  return <DashboardLayout requiredRole="admin">{children}</DashboardLayout>;
}
