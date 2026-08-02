'use client';
import DashboardLayout from '@/components/DashboardLayout';

export default function MDLayout({ children }) {
  return <DashboardLayout requiredRole="master_distributor">{children}</DashboardLayout>;
}
