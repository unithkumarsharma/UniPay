'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { allServices } from '@/data/services';
import ThemeToggle from './ThemeToggle';
import ServiceIcon from './ServiceIcon';
import styles from './Navbar.module.css';

export default function Navbar({ onMenuToggle, sidebarCollapsed }) {
  const { user, getRoleLabel, refreshUserData } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!user) return null;

  const formatBalance = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount || 12500);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (refreshUserData) await refreshUserData();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const matchedServices = searchTerm.trim() 
    ? allServices.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  return (
    <header className={`${styles.navbar} ${sidebarCollapsed ? styles.expanded : ''}`}>
      {/* Left Navigation Section */}
      <div className={styles.left}>
        <button className={styles.menuBtn} onClick={onMenuToggle} aria-label="Toggle sidebar menu">
          <span className={styles.menuIcon}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        {/* Global Search Bar */}
        <div style={{ position: 'relative', width: '320px' }}>
          <div className={styles.searchBox}>
            <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search service (e.g. AEPS, DMT, Bill)..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
            />
          </div>

          {/* Search Dropdown Results */}
          {showSearchResults && matchedServices.length > 0 && (
            <div className={styles.searchDropdown}>
              {matchedServices.map((service) => (
                <div
                  key={service.id}
                  onClick={() => {
                    window.location.href = `/retailer?service=${service.id}`;
                  }}
                  className={styles.searchItem}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <ServiceIcon id={service.id} name={service.name} size={22} />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.84rem' }}>{service.name}</span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--success)', fontWeight: 700 }}>Launch Workstation Terminal ⚡</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Header Status Section */}
      <div className={styles.right}>
        {/* Helpline Badge */}
        <div className={styles.helpBadge}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span className="hide-mobile">1800-123-8647</span>
        </div>

        {/* Live Wallet Balance Pill with Refresh Icon */}
        {user.role !== 'accountant' && (
          <div className={styles.walletBadge}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '0.72rem', opacity: 0.85, fontWeight: 800 }}>W:</span>
              <span className={styles.walletAmount}>{formatBalance(user.walletBalance ?? user.wallet_balance ?? 20000)}</span>
            </div>
            <button
              onClick={handleRefresh}
              className={styles.refreshBtn}
              title="Sync Balance with Core Bank"
            >
              <svg 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                style={{
                  animation: isRefreshing ? 'spin 0.8s linear infinite' : 'none',
                }}
              >
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
            </button>
          </div>
        )}

        {/* Voice Soundbox Test Button */}
        <button 
          className={styles.notifBtn} 
          aria-label="Soundbox Audio Alert" 
          title="Test UniPay Voice Soundbox"
          onClick={async () => {
            try {
              const { announceCreditSoundbox } = await import('@/lib/soundbox');
              announceCreditSoundbox(user.walletBalance || user.wallet_balance || 20000, user.name);
            } catch (e) {}
          }}
          style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#059669', border: '1px solid rgba(16, 185, 129, 0.3)' }}
        >
          🔊
        </button>

        {/* Notification Bell Button */}
        <button className={styles.notifBtn} aria-label="Notifications" title="System Alerts & Logs">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className={styles.notifDot}></span>
        </button>

        {/* Theme Switcher */}
        <ThemeToggle />

        {/* User Profile Card */}
        <div className={styles.profile} title={`Signed in as ${user.name}`}>
          <div className={styles.profileAvatar}>
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className={styles.profileInfo}>
            <span className={styles.profileName}>{user.name}</span>
            <span className={styles.profileRole}>{getRoleLabel(user.role)}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
