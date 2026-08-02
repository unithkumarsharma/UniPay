'use client';
import { useState } from 'react';
import { serviceCategories } from '@/data/services';

// Fintech Vector SVG Icon Map with Bolder Lines & Micro-Details
const serviceSvgIcons = {
  mobile_prepaid: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2.5" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
      <path d="M10 6h4" />
    </svg>
  ),
  mobile_postpaid: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2.5" />
      <path d="M16 8a4 4 0 0 1-4 4" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  ),
  dth: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
      <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
      <path d="M19.1 4.9c3.9 3.9 3.9 10.3 0 14.2" />
    </svg>
  ),
  data_card: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="8" rx="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  ),
  google_play: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="12" x2="10" y2="12" />
      <line x1="8" y1="10" x2="8" y2="14" />
      <circle cx="15" cy="13" r="1" />
      <circle cx="18" cy="11" r="1" />
      <rect x="2" y="6" width="20" height="12" rx="4" />
    </svg>
  ),
  electricity: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  gas: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5z" />
    </svg>
  ),
  water: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  ),
  broadband: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  landline: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  insurance: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  insurance_new: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <line x1="12" y1="8" x2="12" y2="14" />
      <line x1="9" y1="11" x2="15" y2="11" />
    </svg>
  ),
  loan_emi: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="21" x2="21" y2="21" />
      <line x1="6" y1="18" x2="6" y2="11" />
      <line x1="10" y1="18" x2="10" y2="11" />
      <line x1="14" y1="18" x2="14" y2="11" />
      <line x1="18" y1="18" x2="18" y2="11" />
      <polygon points="12 2 20 7 4 7 12 2" />
    </svg>
  ),
  fastag: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="2" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  ),
  credit_card: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  ),
  municipal_tax: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18" />
      <path d="M9 8h6" />
      <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
    </svg>
  ),
  education: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  ),
  dmt: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  ),
  upi: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  aeps: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a10 10 0 0 0-10 10c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
    </svg>
  ),
  micro_atm: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
      <line x1="6" y1="15" x2="6.01" y2="15" />
      <line x1="10" y1="15" x2="10.01" y2="15" />
    </svg>
  ),
  account_opening: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <line x1="20" y1="8" x2="20" y2="14" />
      <line x1="17" y1="11" x2="23" y2="11" />
    </svg>
  ),
  bus: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="14" rx="2" />
      <path d="M4 17v2a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-2M17 17v2a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-2" />
      <circle cx="7.5" cy="13.5" r="1.5" />
      <circle cx="16.5" cy="13.5" r="1.5" />
    </svg>
  ),
  flight: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.7 5.2c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z" />
    </svg>
  ),
  train: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="16" height="14" rx="2" />
      <path d="M4 11h16M12 3v8M8 19l-3 3M16 19l3 3M8 15h.01M16 15h.01" />
    </svg>
  ),
  hotel: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9" />
      <circle cx="9" cy="11" r="2" />
    </svg>
  ),
  pan_card: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <circle cx="8" cy="10" r="2" />
      <path d="M12 16v-1a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v1" />
      <line x1="14" y1="9" x2="18" y2="9" />
      <line x1="14" y1="13" x2="18" y2="13" />
    </svg>
  ),
  e_shram: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="18" x2="12" y2="12" />
      <line x1="9" y1="15" x2="15" y2="15" />
    </svg>
  ),
  ayushman: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  ),
};

// Rich Vibrant Gradient Themes for Every Service Category & ID
const realServiceThemeMap = {
  mobile_prepaid: { bg: 'linear-gradient(135deg, rgba(37,99,235,0.18), rgba(29,78,216,0.3))', color: '#2563EB', glow: 'rgba(37,99,235,0.25)' },
  mobile_postpaid: { bg: 'linear-gradient(135deg, rgba(79,70,229,0.18), rgba(67,56,202,0.3))', color: '#4F46E5', glow: 'rgba(79,70,229,0.25)' },
  dth: { bg: 'linear-gradient(135deg, rgba(147,51,234,0.18), rgba(126,34,206,0.3))', color: '#9333EA', glow: 'rgba(147,51,234,0.25)' },
  data_card: { bg: 'linear-gradient(135deg, rgba(6,182,212,0.18), rgba(14,116,144,0.3))', color: '#06B6D4', glow: 'rgba(6,182,212,0.25)' },
  google_play: { bg: 'linear-gradient(135deg, rgba(16,185,129,0.18), rgba(4,120,87,0.3))', color: '#10B981', glow: 'rgba(16,185,129,0.25)' },
  electricity: { bg: 'linear-gradient(135deg, rgba(245,158,11,0.22), rgba(217,119,6,0.35))', color: '#F59E0B', glow: 'rgba(245,158,11,0.3)' },
  gas: { bg: 'linear-gradient(135deg, rgba(239,68,68,0.22), rgba(185,28,28,0.35))', color: '#EF4444', glow: 'rgba(239,68,68,0.3)' },
  water: { bg: 'linear-gradient(135deg, rgba(14,165,233,0.22), rgba(3,105,161,0.35))', color: '#0EA5E9', glow: 'rgba(14,165,233,0.3)' },
  broadband: { bg: 'linear-gradient(135deg, rgba(168,85,247,0.22), rgba(126,34,206,0.35))', color: '#A855F7', glow: 'rgba(168,85,247,0.3)' },
  landline: { bg: 'linear-gradient(135deg, rgba(20,184,166,0.22), rgba(15,118,110,0.35))', color: '#14B8A6', glow: 'rgba(20,184,166,0.3)' },
  insurance: { bg: 'linear-gradient(135deg, rgba(16,185,129,0.22), rgba(6,95,70,0.35))', color: '#10B981', glow: 'rgba(16,185,129,0.3)' },
  loan_emi: { bg: 'linear-gradient(135deg, rgba(225,29,72,0.22), rgba(159,18,57,0.35))', color: '#E11D48', glow: 'rgba(225,29,72,0.3)' },
  fastag: { bg: 'linear-gradient(135deg, rgba(234,179,8,0.22), rgba(161,98,7,0.35))', color: '#EAB308', glow: 'rgba(234,179,8,0.3)' },
  credit_card: { bg: 'linear-gradient(135deg, rgba(99,102,241,0.22), rgba(67,56,202,0.35))', color: '#6366F1', glow: 'rgba(99,102,241,0.3)' },
  municipal_tax: { bg: 'linear-gradient(135deg, rgba(217,119,6,0.22), rgba(146,64,14,0.35))', color: '#D97706', glow: 'rgba(217,119,6,0.3)' },
  education: { bg: 'linear-gradient(135deg, rgba(37,99,235,0.22), rgba(30,58,138,0.35))', color: '#2563EB', glow: 'rgba(37,99,235,0.3)' },
  dmt: { bg: 'linear-gradient(135deg, rgba(16,185,129,0.22), rgba(4,120,87,0.35))', color: '#10B981', glow: 'rgba(16,185,129,0.3)' },
  upi: { bg: 'linear-gradient(135deg, rgba(139,92,246,0.25), rgba(109,40,217,0.4))', color: '#8B5CF6', glow: 'rgba(139,92,246,0.35)' },
  aeps: { bg: 'linear-gradient(135deg, rgba(6,182,212,0.25), rgba(14,116,144,0.4))', color: '#06B6D4', glow: 'rgba(6,182,212,0.35)' },
  micro_atm: { bg: 'linear-gradient(135deg, rgba(34,197,94,0.25), rgba(21,128,61,0.4))', color: '#22C55E', glow: 'rgba(34,197,94,0.35)' },
  account_opening: { bg: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(67,56,202,0.4))', color: '#6366F1', glow: 'rgba(99,102,241,0.35)' },
  bus: { bg: 'linear-gradient(135deg, rgba(249,115,22,0.25), rgba(194,65,12,0.4))', color: '#F97316', glow: 'rgba(249,115,22,0.35)' },
  flight: { bg: 'linear-gradient(135deg, rgba(14,165,233,0.25), rgba(3,105,161,0.4))', color: '#0EA5E9', glow: 'rgba(14,165,233,0.35)' },
  train: { bg: 'linear-gradient(135deg, rgba(239,68,68,0.25), rgba(185,28,28,0.4))', color: '#EF4444', glow: 'rgba(239,68,68,0.35)' },
  hotel: { bg: 'linear-gradient(135deg, rgba(168,85,247,0.25), rgba(126,34,206,0.4))', color: '#A855F7', glow: 'rgba(168,85,247,0.35)' },
  pan_card: { bg: 'linear-gradient(135deg, rgba(37,99,235,0.25), rgba(30,58,138,0.4))', color: '#2563EB', glow: 'rgba(37,99,235,0.35)' },
  insurance_new: { bg: 'linear-gradient(135deg, rgba(16,185,129,0.25), rgba(4,120,87,0.4))', color: '#10B981', glow: 'rgba(16,185,129,0.35)' },
  e_shram: { bg: 'linear-gradient(135deg, rgba(245,158,11,0.25), rgba(180,83,9,0.4))', color: '#D97706', glow: 'rgba(245,158,11,0.35)' },
  ayushman: { bg: 'linear-gradient(135deg, rgba(225,29,72,0.25), rgba(159,18,57,0.4))', color: '#E11D48', glow: 'rgba(225,29,72,0.35)' },
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
                const theme = realServiceThemeMap[service.id] || {
                  bg: 'linear-gradient(135deg, rgba(37,99,235,0.18), rgba(29,78,216,0.3))',
                  color: '#2563EB',
                  glow: 'rgba(37,99,235,0.25)',
                };

                const iconSvg = serviceSvgIcons[service.id] || (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
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
                      padding: '22px 16px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      opacity: isActive ? 1 : 0.55,
                      boxShadow: isActive ? `0 6px 20px -4px ${theme.glow}` : 'none',
                      transition: 'all 0.25s ease',
                      position: 'relative',
                    }}
                    onClick={() => toggleService(service.id)}
                  >
                    {/* Vibrant Gradient Vector SVG Icon Badge */}
                    <div style={{
                      width: 52,
                      height: 52,
                      borderRadius: '14px',
                      background: theme.bg,
                      color: theme.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 14px',
                      boxShadow: `0 4px 14px ${theme.glow}`,
                      transition: 'transform 0.2s ease',
                    }}>
                      {iconSvg}
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
