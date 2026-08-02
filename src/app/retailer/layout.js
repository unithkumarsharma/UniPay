'use client';
import DashboardLayout from '@/components/DashboardLayout';

export default function RetailerLayout({ children }) {
  return <DashboardLayout requiredRole="retailer">{children}</DashboardLayout>;
}
