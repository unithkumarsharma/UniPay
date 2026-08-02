'use client';
import DashboardLayout from '@/components/DashboardLayout';

export default function DistributorLayout({ children }) {
  return <DashboardLayout requiredRole="distributor">{children}</DashboardLayout>;
}
