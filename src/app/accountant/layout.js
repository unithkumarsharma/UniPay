'use client';
import DashboardLayout from '@/components/DashboardLayout';

export default function AccountantLayout({ children }) {
  return <DashboardLayout requiredRole="accountant">{children}</DashboardLayout>;
}
