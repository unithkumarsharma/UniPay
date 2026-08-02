'use client';
import { useState } from 'react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('company'); // 'company' | 'wallet' | 'api' | 'security'
  const [toastMessage, setToastMessage] = useState('');

  // Form States
  const [companyForm, setCompanyForm] = useState({
    name: 'UniPay Fintech Private Limited',
    email: 'support@unipay.in',
    phone: '+91 9876543210',
    gstin: '07AAAAA0000A1Z5',
    address: 'Connaught Place, New Delhi 110001, India',
  });

  const [walletForm, setWalletForm] = useState({
    minBalanceAlert: '500',
    maxSingleTransfer: '100000',
    dailyLimit: '500000',
    autoSettlementTime: '23:30',
    escrowRatio: '15',
  });

  const [apiForm, setApiForm] = useState({
    primaryProvider: 'Paysprint',
    backupProvider: 'Eko',
    apiKey: 'sk_live_99812489127498127498',
    callbackUrl: 'https://api.unipay.in/callback/v2/webhook',
  });

  const [securityForm, setSecurityForm] = useState({
    enforce2FA: true,
    sessionTimeout: '30',
    ipWhitelisting: false,
  });

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSaveCompany = (e) => {
    e.preventDefault();
    triggerToast('Company Information & Support Profile updated successfully!');
  };

  const handleSaveWallet = (e) => {
    e.preventDefault();
    triggerToast('Wallet Financial Controls & Transfer Limits saved!');
  };

  const handleSaveApi = (e) => {
    e.preventDefault();
    triggerToast('API Switch Configuration & Webhooks updated!');
  };

  const handleSaveSecurity = (e) => {
    e.preventDefault();
    triggerToast('Platform Security & Authentication Rules updated!');
  };

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '24px',
          zIndex: 999,
          background: '#10B981',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          fontSize: '0.88rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'slideDown 0.3s ease',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            SYSTEM CONFIGURATION &amp; SECURITY PREFERENCES
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Platform Settings &amp; System Controls
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Manage corporate information, financial wallet ceilings, API gateway webhooks, and security authentication rules.
          </p>
        </div>
      </div>

      {/* Navigation Settings Tabs */}
      <div style={{ background: 'var(--bg-card)', padding: '8px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', marginBottom: '28px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {[
          {
            id: 'company',
            label: 'Company Profile',
            icon: (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                <line x1="9" y1="6" x2="9.01" y2="6" />
                <line x1="15" y1="6" x2="15.01" y2="6" />
                <line x1="9" y1="10" x2="9.01" y2="10" />
                <line x1="15" y1="10" x2="15.01" y2="10" />
                <line x1="9" y1="14" x2="9.01" y2="14" />
                <line x1="15" y1="14" x2="15.01" y2="14" />
              </svg>
            ),
          },
          {
            id: 'wallet',
            label: 'Wallet & Limits',
            icon: (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            ),
          },
          {
            id: 'api',
            label: 'API Switch Config',
            icon: (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            ),
          },
          {
            id: 'security',
            label: 'Security & 2FA',
            icon: (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            ),
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 18px',
              fontSize: '0.85rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-lg)',
              border: 'none',
              background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
              color: activeTab === tab.id ? '#FFFFFF' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Form Body */}
      <div style={{ maxWidth: '800px' }}>
        
        {/* 1. COMPANY INFORMATION */}
        {activeTab === 'company' && (
          <div className="card" style={{ padding: '28px', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21h18" />
                  <path d="M5 21V7l8-4v18" />
                  <path d="M19 21V11l-6-3" />
                  <path d="M9 9v.01" />
                  <path d="M9 12v.01" />
                  <path d="M9 15v.01" />
                  <path d="M9 18v.01" />
                </svg>
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>Corporate &amp; Legal Entity Information</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Update business registration details shown on merchant invoices.</p>
              </div>
            </div>

            <form onSubmit={handleSaveCompany}>
              <div className="form-group">
                <label className="form-label">Registered Company Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={companyForm.name}
                  onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Customer Support Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={companyForm.email}
                    onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Helpline Support Phone</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={companyForm.phone}
                    onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">GSTIN Tax Registration Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={companyForm.gstin}
                  onChange={(e) => setCompanyForm({ ...companyForm, gstin: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Head Office Address</label>
                <textarea
                  className="form-input"
                  rows="3"
                  value={companyForm.address}
                  onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  Save Company Profile
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 2. WALLET SETTINGS */}
        {activeTab === 'wallet' && (
          <div className="card" style={{ padding: '28px', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>Wallet Financial Controls &amp; Limits</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Configure transfer thresholds, minimum balance alerts, and automated cutoff rules.</p>
              </div>
            </div>

            <form onSubmit={handleSaveWallet}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Minimum Balance Alert Threshold (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={walletForm.minBalanceAlert}
                    onChange={(e) => setWalletForm({ ...walletForm, minBalanceAlert: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Maximum Single Transfer Limit (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={walletForm.maxSingleTransfer}
                    onChange={(e) => setWalletForm({ ...walletForm, maxSingleTransfer: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Daily Transaction Ceiling (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={walletForm.dailyLimit}
                    onChange={(e) => setWalletForm({ ...walletForm, dailyLimit: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Auto-Settlement Cutoff Time (24h IST)</label>
                  <input
                    type="time"
                    className="form-input"
                    value={walletForm.autoSettlementTime}
                    onChange={(e) => setWalletForm({ ...walletForm, autoSettlementTime: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Escrow Liquidity Reserve Ratio (%)</label>
                <input
                  type="number"
                  className="form-input"
                  value={walletForm.escrowRatio}
                  onChange={(e) => setWalletForm({ ...walletForm, escrowRatio: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  Save Wallet Rules
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 3. API CONFIGURATION */}
        {activeTab === 'api' && (
          <div className="card" style={{ padding: '28px', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>API Switch &amp; Webhook Gateway</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Configure primary NPCI aggregator switches, encrypted API keys, and callback endpoints.</p>
              </div>
            </div>

            <form onSubmit={handleSaveApi}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Primary API Switch Provider</label>
                  <select
                    className="form-select"
                    value={apiForm.primaryProvider}
                    onChange={(e) => setApiForm({ ...apiForm, primaryProvider: e.target.value })}
                  >
                    <option value="Paysprint">Paysprint NPCI Switch</option>
                    <option value="Eko">Eko Financial Switch</option>
                    <option value="Instantpay">Instantpay Bank Switch</option>
                    <option value="Roundpay">Roundpay Aggregator</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Backup Fallback Switch</label>
                  <select
                    className="form-select"
                    value={apiForm.backupProvider}
                    onChange={(e) => setApiForm({ ...apiForm, backupProvider: e.target.value })}
                  >
                    <option value="Eko">Eko Financial Switch</option>
                    <option value="Paysprint">Paysprint NPCI Switch</option>
                    <option value="Instantpay">Instantpay Bank Switch</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Live API Secret Key</label>
                <input
                  type="password"
                  className="form-input"
                  value={apiForm.apiKey}
                  onChange={(e) => setApiForm({ ...apiForm, apiKey: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Encrypted Callback / Webhook URL</label>
                <input
                  type="url"
                  className="form-input"
                  value={apiForm.callbackUrl}
                  onChange={(e) => setApiForm({ ...apiForm, callbackUrl: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  Save API Config
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 4. SECURITY & AUTHENTICATION */}
        {activeTab === 'security' && (
          <div className="card" style={{ padding: '28px', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>Security &amp; Authentication Controls</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Enforce two-factor authentication, IP restrictions, and session timeouts.</p>
              </div>
            </div>

            <form onSubmit={handleSaveSecurity}>
              <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-lg)', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Require Mandatory 2FA for Admin Operations</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>SMS / TOTP verification required for fund top-ups.</div>
                </div>
                <input
                  type="checkbox"
                  checked={securityForm.enforce2FA}
                  onChange={(e) => setSecurityForm({ ...securityForm, enforce2FA: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Inactivity Session Timeout (Minutes)</label>
                <input
                  type="number"
                  className="form-input"
                  value={securityForm.sessionTimeout}
                  onChange={(e) => setSecurityForm({ ...securityForm, sessionTimeout: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  Save Security Rules
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </>
  );
}
