'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { menuItems } from '@/data/menuItems';
import styles from './Sidebar.module.css';

export default function Sidebar({ collapsed, onToggle }) {
  const pathname = usePathname();
  const { user, logout, getRoleLabel } = useAuth();

  if (!user) return null;

  const items = menuItems[user.role] || [];

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div className={styles.overlay} onClick={onToggle} />
      )}

      <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
        {/* Logo */}
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <img src="/logo.png" alt="UniPay" width={36} height={36} />
          </div>
          {!collapsed && <span className={styles.logoText}>UniPay</span>}
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          {items.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                title={item.label}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                {!collapsed && <span className={styles.navLabel}>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        {!collapsed && (
          <div className={styles.userSection}>
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>
                {user.name.charAt(0)}
              </div>
              <div className={styles.userDetails}>
                <span className={styles.userName}>{user.name}</span>
                <span className={styles.userRole}>{getRoleLabel(user.role)}</span>
              </div>
            </div>
            <button className={styles.logoutBtn} onClick={logout} title="Logout">
              🚪
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
