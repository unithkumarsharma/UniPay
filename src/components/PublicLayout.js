'use client';
import { useState } from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import styles from '@/app/landing.module.css';

export default function PublicLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className={styles.landingWrapper}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <Link href="/" className={styles.brand}>
            <img src="/logo.png" alt="UniPay Logo" className={styles.brandLogo} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className={styles.brandName}>UniPay</span>
              <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--accent)', marginTop: -2 }}>
                Smart Payment, Seamless Suvidha
              </span>
            </div>
          </Link>

          <nav className={styles.navDesktop}>
            <Link href="/" className={styles.navLink}>Home</Link>
            <Link href="/about" className={styles.navLink}>About Us</Link>
            <Link href="/security" className={styles.navLink}>Security</Link>
            <Link href="/contact" className={styles.navLink}>Contact</Link>
          </nav>

          <div className={styles.headerActions}>
            <ThemeToggle />
            <Link href="/auth/login" className={styles.loginBtn}>🔐 Login</Link>
            <Link href="/auth/login" className={styles.registerBtn}>🚀 Join as Partner</Link>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main style={{ minHeight: 'calc(100vh - 350px)', padding: '60px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          {children}
        </div>
      </main>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerColMain}>
            <div className={styles.footerBrand}>
              <img src="/logo.png" alt="UniPay" className={styles.footerLogo} />
              <span className={styles.footerBrandName}>UniPay</span>
            </div>
            <p className={styles.footerDesc}>
              UniPay - Smart Payment, Seamless Suvidha. Empowering over 100,000+ local retailers and distributors across India.
            </p>
          </div>

          <div className={styles.footerCol}>
            <h4>Company</h4>
            <ul>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/security">Security &amp; Trust</Link></li>
              <li><Link href="/contact">Contact &amp; Grievance</Link></li>
              <li><Link href="/auth/login">Partner Login</Link></li>
            </ul>
          </div>

          <div className={styles.footerCol}>
            <h4>Legal &amp; Policies</h4>
            <ul>
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms &amp; Conditions</Link></li>
              <li><Link href="/refund-policy">Refund &amp; Cancellation</Link></li>
              <li><Link href="/security">PCI-DSS &amp; RBI Compliance</Link></li>
            </ul>
          </div>

          <div className={styles.footerCol}>
            <h4>Contact Support</h4>
            <ul>
              <li>📧 support@unipay.in</li>
              <li>📞 +91 98765 43210</li>
              <li>📍 Corporate Tower, Sector 62, Noida, UP</li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>© {new Date().getFullYear()} UniPay Technologies Private Limited. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
