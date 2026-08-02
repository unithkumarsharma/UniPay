'use client';
import PublicLayout from '@/components/PublicLayout';

export default function AboutPage() {
  return (
    <PublicLayout>
      <div className="page-header">
        <h1>About UniPay</h1>
        <p>Smart Payment, Seamless Suvidha - Empowering Digital India</p>
      </div>

      <div style={{ background: 'var(--bg-card)', padding: '36px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '16px' }}>Our Mission</h2>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '24px' }}>
          At <strong>UniPay</strong>, our mission is to democratize digital financial services across Tier 1, Tier 2, Tier 3 cities and rural India. By bridging the gap between digital banking and local retail shop owners, we empower over 100,000+ merchants to deliver instant mobile recharges, BBPS bill payments, Aadhaar-enabled ATM withdrawals (AEPS), and domestic money transfers directly to walk-in customers.
        </p>

        <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '16px' }}>Empowering Local Merchants</h2>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '24px' }}>
          UniPay provides an all-in-one digital wallet platform designed for high earnings, instant bank settlements, and complete transaction transparency for merchants and financial partners across the nation.
        </p>

        <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '16px' }}>Core Pillars</h2>
        <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1rem' }}>
          <li><strong>99.9% Uptime:</strong> High-speed redundant servers with zero transaction lag.</li>
          <li><strong>Bank-Grade Security:</strong> 256-bit SSL encryption, 2FA, and strict RBI &amp; NPCI guidelines.</li>
          <li><strong>24/7 Support:</strong> Dedicated merchant support &amp; grievance resolution.</li>
        </ul>
      </div>
    </PublicLayout>
  );
}
