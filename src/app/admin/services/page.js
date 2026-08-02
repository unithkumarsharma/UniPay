'use client';
import { useState } from 'react';
import { serviceCategories } from '@/data/services';

// Realistic Multi-Color SVGs for All 28 Platform Services
const multiColorServiceIcons = {
  mobile_prepaid: (
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
      <rect x="8" y="3" width="20" height="30" rx="4" fill="#2563EB" />
      <rect x="10" y="6" width="16" height="20" rx="1.5" fill="#38BDF8" />
      <circle cx="18" cy="29" r="1.5" fill="#FFFFFF" />
      <path d="M14 11l3 3 5-5" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 20h8" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  mobile_postpaid: (
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
      <rect x="6" y="4" width="18" height="28" rx="3.5" fill="#4F46E5" />
      <rect x="8" y="7" width="14" height="18" rx="1" fill="#818CF8" />
      <path d="M22 14h10v14H22z" fill="#F59E0B" rx="1.5" />
      <path d="M24 18h6M24 22h4" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="15" cy="28" r="1" fill="#FFFFFF" />
    </svg>
  ),
  dth: (
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
      <path d="M6 26c0-11 9-20 20-20" stroke="#9333EA" strokeWidth="3" strokeLinecap="round" />
      <path d="M10 26c0-8.8 7.2-16 16-16" stroke="#A855F7" strokeWidth="3" strokeLinecap="round" />
      <path d="M14 26c0-6.6 5.4-12 12-12" stroke="#C084FC" strokeWidth="3" strokeLinecap="round" />
      <circle cx="26" cy="26" r="4" fill="#F59E0B" />
      <path d="M6 30l8-8" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  data_card: (
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
      <rect x="4" y="10" width="28" height="16" rx="3" fill="#06B6D4" />
      <rect x="8" y="14" width="8" height="8" rx="1.5" fill="#164E63" />
      <circle cx="22" cy="18" r="2" fill="#10B981" />
      <circle cx="27" cy="18" r="2" fill="#F59E0B" />
      <path d="M14 4c4 0 8 4 8 4" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M11 7c2.5 0 5 2.5 5 2.5" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  google_play: (
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
      <path d="M6 4.5l15.5 13.5L6 31.5V4.5z" fill="#4285F4" />
      <path d="M21.5 18L6 4.5l17 9.8L21.5 18z" fill="#EA4335" />
      <path d="M21.5 18l1.5-3.7 7 4-7 4-1.5-4.3z" fill="#FBBC05" />
      <path d="M6 31.5L21.5 18l1.5 4.3-17 9.2z" fill="#34A853" />
    </svg>
  ),
  electricity: (
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
      <path d="M18 3C11.4 3 6 8.4 6 15c0 4.5 2.5 8.4 6.2 10.4V28c0 1.1.9 2 2 2h7.6c1.1 0 2-.9 2-2v-2.6C27.5 23.4 30 19.5 30 15c0-6.6-5.4-12-12-12z" fill="#F59E0B" />
      <path d="M14 28h8v3h-8vz" fill="#D97706" />
      <path d="M16 31h4v2h-4vz" fill="#92400E" />
      <path d="M19 8l-5 8h4.5L16 23l6.5-8H18l2-7z" fill="#FFFFFF" />
    </svg>
  ),
  gas: (
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
      <rect x="10" y="10" width="16" height="22" rx="4" fill="#EF4444" />
      <rect x="13" y="5" width="10" height="5" rx="1.5" fill="#991B1B" />
      <path d="M16 10v4M20 10v4" stroke="#7F1D1D" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 16c-3 4-1 7 0 9 1-2 3-5 0-9z" fill="#F59E0B" />
      <path d="M18 19c-1.5 2-.5 3.5 0 4.5.5-1 1.5-2.5 0-4.5z" fill="#F97316" />
    </svg>
  ),
  water: (
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
      <path d="M18 3S7 16.5 7 23.5a11 11 0 0 0 22 0C29 16.5 18 3 18 3z" fill="#0EA5E9" />
      <path d="M18 7.5s-7.5 9-7.5 14.5a7.5 7.5 0 0 0 11.5 6.3C18.7 26.5 18 24 18 21.5c0-4.5 4-8 4-8s-4-6-4-6z" fill="#38BDF8" opacity="0.6" />
      <path d="M14 22a4 4 0 0 0 4 4" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  broadband: (
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="18" r="14" fill="#2563EB" />
      <ellipse cx="18" cy="18" rx="14" ry="6" stroke="#38BDF8" strokeWidth="2" fill="none" />
      <line x1="18" y1="4" x2="18" y2="32" stroke="#60A5FA" strokeWidth="2" />
      <line x1="4" y1="18" x2="32" y2="18" stroke="#60A5FA" strokeWidth="2" />
    </svg>
  ),
  landline: (
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
      <path d="M6 14c0-4 3-7 7-7h10c4 0 7 3 7 7v10c0 4-3 7-7 7H13c-4 0-7-3-7-7V14z" fill="#14B8A6" />
      <path d="M10 4h16c1.5 0 2.5 1 2.5 2.5S27.5 9 26 9H10C8.5 9 7.5 8 7.5 6.5S8.5 4 10 4z" fill="#EF4444" />
      <circle cx="18" cy="20" r="4" fill="#0F766E" />
      <circle cx="18" cy="20" r="1.5" fill="#FFFFFF" />
    </svg>
  ),
  insurance: (
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
      <path d="M18 3L5 8v10c0 8.5 6 14.5 13 16 7-1.5 13-7.5 13-16V8L18 3z" fill="#10B981" />
      <path d="M18 6.5L8 10.5v8c0 6.5 4.5 11 10 12.2V6.5z" fill="#059669" opacity="0.4" />
      <path d="M13 18l3.5 3.5L24 14" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  insurance_new: (
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
      <path d="M18 3L5 8v10c0 8.5 6 14.5 13 16 7-1.5 13-7.5 13-16V8L18 3z" fill="#10B981" />
      <path d="M18 12v12M12 18h12" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  ),
  loan_emi: (
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
      <path d="M18 3L4 10h28L18 3z" fill="#F59E0B" />
      <rect x="6" y="12" width="4" height="14" fill="#2563EB" rx="1" />
      <rect x="13" y="12" width="4" height="14" fill="#2563EB" rx="1" />
      <rect x="20" y="12" width="4" height="14" fill="#2563EB" rx="1" />
      <rect x="27" y="12" width="4" height="14" fill="#2563EB" rx="1" />
      <rect x="3" y="28" width="30" height="4" fill="#1E3A8A" rx="1" />
    </svg>
  ),
  fastag: (
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
      <rect x="4" y="12" width="22" height="14" rx="3" fill="#EAB308" />
      <path d="M8 12l3-6h14l3 6H8z" fill="#38BDF8" />
      <circle cx="9" cy="26" r="3" fill="#1F2937" />
      <circle cx="21" cy="26" r="3" fill="#1F2937" />
      <rect x="24" y="4" width="8" height="12" rx="2" fill="#10B981" />
      <path d="M26 8h4" stroke="#FFFFFF" strokeWidth="2" />
    </svg>
  ),
  credit_card: (
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
      <rect x="3" y="7" width="30" height="22" rx="4" fill="#6366F1" />
      <rect x="3" y="13" width="30" height="5" fill="#1E1B4B" />
      <rect x="7" y="21" width="6" height="5" rx="1" fill="#F59E0B" />
      <circle cx="25" cy="23" r="3" fill="#EF4444" opacity="0.8" />
      <circle cx="28" cy="23" r="3" fill="#F59E0B" opacity="0.8" />
    </svg>
  ),
  municipal_tax: (
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
      <path d="M5 32h26V14L18 5 5 14v18z" fill="#D97706" />
      <rect x="13" y="20" width="10" height="12" rx="1" fill="#2563EB" />
      <polygon points="18 8 9 15 27 15" fill="#B45309" />
      <circle cx="18" cy="12" r="1.5" fill="#FFFFFF" />
    </svg>
  ),
  education: (
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
      <polygon points="18 4 33 12 18 20 3 12" fill="#1E3A8A" />
      <polygon points="18 7 30 13 18 19 6 13" fill="#2563EB" />
      <path d="M9 16.5v8c0 3.5 9 4.5 9 4.5s9-1 9-4.5v-8" fill="none" stroke="#1E3A8A" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M30 13v12" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="30" cy="26" r="2" fill="#F59E0B" />
    </svg>
  ),
  dmt: (
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
      <rect x="4" y="8" width="28" height="20" rx="3" fill="#10B981" />
      <circle cx="18" cy="18" r="5" fill="#047857" />
      <path d="M18 15v6M16 16.5h4M16 19.5h4" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 4l6 4H2L8 4z" fill="#2563EB" />
      <path d="M28 32l-6-4h12l-6 4z" fill="#F59E0B" />
    </svg>
  ),
  upi: (
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
      <rect x="4" y="4" width="28" height="28" rx="6" fill="#8B5CF6" />
      <path d="M12 12h5v5h-5zM20 12h4v4h-4zM12 20h4v4h-4zM20 20h4v4h-4z" fill="#FFFFFF" />
      <circle cx="26" cy="10" r="3" fill="#10B981" />
      <path d="M24.5 10l1 1 2-2" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  aeps: (
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="18" r="14" fill="#06B6D4" />
      <path d="M18 10a7 7 0 0 0-7 7c0 3 1.5 5.5 3.5 7" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M18 14a3 3 0 0 0-3 3c0 2 1 3.5 2 4.5" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M22 17c0 3-1 5-2.5 7.5" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="26" cy="10" r="3.5" fill="#10B981" />
      <path d="M24.5 10l1 1 2-2" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  micro_atm: (
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
      <rect x="6" y="6" width="24" height="26" rx="4" fill="#111827" />
      <rect x="9" y="9" width="18" height="8" rx="1.5" fill="#10B981" />
      <circle cx="11" cy="21" r="1.5" fill="#9CA3AF" />
      <circle cx="18" cy="21" r="1.5" fill="#9CA3AF" />
      <circle cx="25" cy="21" r="1.5" fill="#9CA3AF" />
      <circle cx="11" cy="26" r="1.5" fill="#9CA3AF" />
      <circle cx="18" cy="26" r="1.5" fill="#9CA3AF" />
      <circle cx="25" cy="26" r="1.5" fill="#EF4444" />
      <rect x="10" y="2" width="16" height="6" rx="1" fill="#2563EB" />
    </svg>
  ),
  account_opening: (
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
      <rect x="4" y="6" width="22" height="26" rx="3" fill="#4F46E5" />
      <circle cx="15" cy="15" r="4" fill="#F59E0B" />
      <path d="M9 25c0-3 3-5 6-5s6 2 6 5" fill="#F59E0B" />
      <circle cx="27" cy="23" r="5" fill="#10B981" />
      <path d="M27 20v6M24 23h6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  bus: (
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
      <rect x="5" y="6" width="26" height="22" rx="4" fill="#F97316" />
      <rect x="8" y="10" width="20" height="7" rx="1.5" fill="#38BDF8" />
      <circle cx="10" cy="24" r="2.5" fill="#1E293B" />
      <circle cx="26" cy="24" r="2.5" fill="#1E293B" />
      <rect x="13" y="21" width="10" height="3" fill="#FED7AA" rx="1" />
    </svg>
  ),
  flight: (
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="18" r="14" fill="#0EA5E9" />
      <path d="M28 16l-8-3-4-8-3 1 3 8-7 3-3-2-2 1 3 4 3 2 12-6z" fill="#FFFFFF" />
    </svg>
  ),
  train: (
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
      <rect x="7" y="4" width="22" height="24" rx="5" fill="#EF4444" />
      <rect x="10" y="8" width="16" height="8" rx="2" fill="#38BDF8" />
      <circle cx="12" cy="21" r="2" fill="#F59E0B" />
      <circle cx="24" cy="21" r="2" fill="#F59E0B" />
      <path d="M12 31l-4 3M24 31l4 3" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  hotel: (
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
      <rect x="6" y="6" width="24" height="26" rx="3" fill="#A855F7" />
      <rect x="10" y="10" width="5" height="5" fill="#FDE047" rx="1" />
      <rect x="21" y="10" width="5" height="5" fill="#FDE047" rx="1" />
      <rect x="10" y="18" width="5" height="5" fill="#FDE047" rx="1" />
      <rect x="21" y="18" width="5" height="5" fill="#FDE047" rx="1" />
      <rect x="14" y="25" width="8" height="7" fill="#F59E0B" rx="1" />
    </svg>
  ),
  pan_card: (
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
      <rect x="3" y="6" width="30" height="24" rx="4" fill="#1E3A8A" />
      <rect x="6" y="10" width="24" height="4" fill="#F59E0B" rx="1" />
      <circle cx="11" cy="21" r="3.5" fill="#3B82F6" />
      <rect x="17" y="18" width="12" height="2" fill="#93C5FD" rx="1" />
      <rect x="17" y="22" width="8" height="2" fill="#93C5FD" rx="1" />
    </svg>
  ),
  e_shram: (
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
      <rect x="4" y="6" width="28" height="24" rx="4" fill="#D97706" />
      <rect x="8" y="10" width="20" height="4" fill="#FEF3C7" rx="1" />
      <path d="M12 18h12M12 22h8" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  ayushman: (
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
      <rect x="4" y="6" width="28" height="24" rx="4" fill="#DC2626" />
      <rect x="8" y="10" width="20" height="4" fill="#FDE8E8" rx="1" />
      <path d="M18 16v10M13 21h10" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  ),
};

export default function AdminServicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceStatus, setServiceStatus] = useState(() => {
    const status = {};
    serviceCategories.forEach(cat => {
      cat.services.forEach(s => { status[s.id] = true; });
    });
    return status;
  });

  const toggleService = (id) => {
    setServiceStatus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const setAllStatus = (targetState) => {
    const newStatus = {};
    serviceCategories.forEach(cat => {
      cat.services.forEach(s => { newStatus[s.id] = targetState; });
    });
    setServiceStatus(newStatus);
  };

  const totalActiveCount = Object.values(serviceStatus).filter(Boolean).length;
  const totalCount = Object.keys(serviceStatus).length;

  return (
    <>
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            SERVICE SWITCH CONTROL MATRIX
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Platform Service Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Instantly enable or disable BBPS, recharge switches, and banking APIs across all network accounts.
          </p>
        </div>

        {/* Master Controls */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setAllStatus(true)}
            style={{ fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} />
            Enable All ({totalCount})
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setAllStatus(false)}
            style={{ fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444' }} />
            Disable All
          </button>
        </div>
      </div>

      {/* Summary Control Bar */}
      <div style={{ background: 'var(--bg-card)', padding: '16px 20px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            System Status: <span style={{ color: '#10B981' }}>{totalActiveCount} Active</span> / {totalCount} Total Services
          </div>
          <span style={{ fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', color: '#059669', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
            {Math.round((totalActiveCount / totalCount) * 100)}% Operational
          </span>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', width: '280px' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search service name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '7px 12px 7px 34px',
              fontSize: '0.82rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-input)',
              color: 'var(--text-primary)',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Service Categories */}
      {serviceCategories.map((category) => {
        const filteredServices = category.services.filter(s =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (filteredServices.length === 0) return null;

        const activeCatCount = filteredServices.filter(s => serviceStatus[s.id]).length;

        return (
          <div key={category.name} style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563EB' }} />
                {category.name}
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                {activeCatCount} / {filteredServices.length} Active
              </span>
            </div>

            <div className="services-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
              {filteredServices.map((service) => {
                const isActive = serviceStatus[service.id];
                const realIcon = multiColorServiceIcons[service.id] || (
                  <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
                    <circle cx="18" cy="18" r="14" fill="#2563EB" />
                  </svg>
                );

                return (
                  <div
                    key={service.id}
                    className="service-card glow-card"
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid',
                      borderColor: isActive ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-color)',
                      borderRadius: 'var(--radius-xl)',
                      padding: '20px 16px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      opacity: isActive ? 1 : 0.5,
                      transition: 'all 0.25s ease',
                      position: 'relative',
                    }}
                    onClick={() => toggleService(service.id)}
                  >
                    {/* Realistic Multi-Color Icon Badge */}
                    <div style={{
                      width: 56,
                      height: 56,
                      borderRadius: '16px',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 12px',
                      transition: 'transform 0.2s ease',
                    }}>
                      {realIcon}
                    </div>

                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                      {service.name}
                    </div>

                    {/* Status Pill */}
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      background: isActive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                      color: isActive ? '#059669' : '#DC2626',
                      letterSpacing: '0.02em',
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: isActive ? '#10B981' : '#EF4444' }} />
                      {isActive ? 'ACTIVE' : 'DISABLED'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}
