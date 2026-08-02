'use client';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from './ThemeToggle';
import styles from './Navbar.module.css';

export default function Navbar({ onMenuToggle, sidebarCollapsed }) {
  const { user, getRoleLabel } = useAuth();

  if (!user) return null;

  const formatBalance = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <header className={`${styles.navbar} ${sidebarCollapsed ? styles.expanded : ''}`}>
      <div className={styles.left}>
        <button className={styles.menuBtn} onClick={onMenuToggle} aria-label="Toggle menu">
          <span className={styles.menuIcon}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search transactions, users..."
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.right}>
        {user.role !== 'accountant' && (
          <div className={styles.walletBadge}>
            <span className={styles.walletIcon}>💰</span>
            <span className={styles.walletAmount}>{formatBalance(user.walletBalance)}</span>
          </div>
        )}

        <button className={styles.notifBtn} aria-label="Notifications">
          🔔
          <span className={styles.notifDot}></span>
        </button>

        <ThemeToggle />

        <div className={styles.profile}>
          <div className={styles.profileAvatar}>
            {user.name.charAt(0)}
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
