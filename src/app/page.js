'use client';
import { useState } from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import { serviceCategories } from '@/data/services';
import styles from './landing.module.css';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className={styles.landingWrapper}>
      {/* Background Orbs & Ambient Glow */}
      <div className={styles.bgGlowOrb1}></div>
      <div className={styles.bgGlowOrb2}></div>
      <div className={styles.bgGlowOrb3}></div>

      {/* ===== HEADER / NAVBAR ===== */}
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <Link href="/" className={styles.brand}>
            <img src="/logo.png" alt="UniPay Logo" className={styles.brandLogo} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className={styles.brandName}>UniPay</span>
              <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--accent)', marginTop: -2 }}>Smart Payment, Seamless Suvidha</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className={styles.navDesktop}>
            <a href="#services" className={styles.navLink}>Services</a>
            <Link href="/about" className={styles.navLink}>About Us</Link>
            <Link href="/security" className={styles.navLink}>Security</Link>
            <Link href="/contact" className={styles.navLink}>Contact</Link>
          </nav>

          {/* Header Actions */}
          <div className={styles.headerActions}>
            <ThemeToggle />
            <Link href="/auth/login" className={styles.loginBtn}>
              🔐 Login
            </Link>
            <Link href="/auth/login" className={styles.registerBtn}>
              🚀 Join as Partner
            </Link>
            <button
              className={styles.mobileMenuToggle}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className={styles.mobileNav}>
            <a href="#services" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>Services</a>
            <Link href="/about" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>About Us</Link>
            <Link href="/security" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>Security</Link>
            <Link href="/contact" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            <div className={styles.mobileNavActions}>
              <Link href="/auth/login" className={styles.loginBtn} onClick={() => setMobileMenuOpen(false)}>
                🔐 Login
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ===== HERO SECTION ===== */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <span className={styles.badgePulse}></span>
              India&apos;s #1 Multi-Service B2B &amp; B2C Fintech Platform
            </div>
            <h1 className={styles.heroTitle}>
              Grow Your Business With <span className={styles.gradientText}>UniPay</span> Digital Services
            </h1>
            <p className={styles.heroSubtitle}>
              Empowering over 100,000+ Retailers and Distributors across India with Instant Recharges, BBPS Bill Payments, DMT Money Transfers, AEPS Aadhaar Banking &amp; Financial Services.
            </p>
            <div className={styles.heroButtons}>
              <Link href="/auth/login" className={styles.heroPrimaryBtn}>
                Get Started Now →
              </Link>
              <a href="#services" className={styles.heroSecondaryBtn}>
                Explore All Services
              </a>
            </div>

            {/* Live Stats */}
            <div className={styles.heroStatsGrid}>
              <div className={styles.heroStatCard}>
                <span className={styles.statValue}>100,000+</span>
                <span className={styles.statLabel}>Active Outlets</span>
              </div>
              <div className={styles.heroStatCard}>
                <span className={styles.statValue}>₹500Cr+</span>
                <span className={styles.statLabel}>Monthly Transactions</span>
              </div>
              <div className={styles.heroStatCard}>
                <span className={styles.statValue}>99.9%</span>
                <span className={styles.statLabel}>Success Uptime</span>
              </div>
              <div className={styles.heroStatCard}>
                <span className={styles.statValue}>24/7</span>
                <span className={styles.statLabel}>Instant Settlement</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES SECTION ===== */}
      <section id="services" className={styles.servicesSection}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Everything Your Shop Needs To Succeed</h2>
            <p className={styles.sectionSubtitle}>
              Offer 30+ digital banking, utility, and payment services to your local customers and earn industry-best commissions on every transaction.
            </p>
          </div>

          <div className={styles.servicesCategoryGrid}>
            {serviceCategories.map((category) => (
              <div key={category.name} className={styles.categoryCard}>
                <h3 className={styles.categoryName}>{category.name}</h3>
                <div className={styles.categoryServicesList}>
                  {category.services.map((service) => (
                    <div key={service.id} className={styles.serviceItem}>
                      <span className={styles.serviceIcon}>{service.icon}</span>
                      <span className={styles.serviceName}>{service.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE UNIPAY ===== */}
      <section id="features" className={styles.featuresSection}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Why Choose UniPay?</h2>
            <p className={styles.sectionSubtitle}>Designed for speed, reliability, and maximum retailer earnings.</p>
          </div>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>💎</div>
              <h3 className={styles.featureTitle}>Highest Commission Rates</h3>
              <p className={styles.featureText}>Earn top margin payouts on every recharge, bill payment, and Aadhaar withdrawal directly into your wallet.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>⚡</div>
              <h3 className={styles.featureTitle}>Instant 24x7 Settlement</h3>
              <p className={styles.featureText}>Real-time wallet loading and bank settlement available 365 days a year without delay.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🛡️</div>
              <h3 className={styles.featureTitle}>Bank-Grade Security</h3>
              <p className={styles.featureText}>Encrypted JWT sessions, SSL protection, and secure multi-tier authentication for complete peace of mind.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📱</div>
              <h3 className={styles.featureTitle}>Light &amp; Responsive UI</h3>
              <p className={styles.featureText}>Ultra-fast interface optimized for both mobile smartphones and desktop computers in Light or Dark themes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PARTNER CTA SECTION ===== */}
      <section id="partner" className={styles.networkSection}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Start Growing Your Business Today</h2>
            <p className={styles.sectionSubtitle}>Join thousands of successful merchants earning daily income with UniPay digital services.</p>
          </div>

          <div className={styles.partnerCardsGrid}>
            <div className={styles.partnerCard}>
              <div className={styles.partnerIcon}>⚡</div>
              <h3 className={styles.partnerTitle}>Instant Onboarding</h3>
              <p className={styles.partnerText}>Get registered in less than 2 minutes and start offering financial services to your customers immediately.</p>
            </div>

            <div className={styles.partnerCard}>
              <div className={styles.partnerIcon}>💰</div>
              <h3 className={styles.partnerTitle}>Maximum Earnings</h3>
              <p className={styles.partnerText}>Enjoy industry-best margins on recharges, bill payments, and money transfers directly in your wallet.</p>
            </div>

            <div className={styles.partnerCard}>
              <div className={styles.partnerIcon}>🤝</div>
              <h3 className={styles.partnerTitle}>24x7 Support</h3>
              <p className={styles.partnerText}>Our dedicated support team and account managers are always available to help your shop grow.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer id="contact" className={styles.footer}>
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
              <li><Link href="/security">Security &amp; Compliance</Link></li>
              <li><Link href="/contact">Contact &amp; Support</Link></li>
              <li><Link href="/auth/login">Partner Login</Link></li>
            </ul>
          </div>

          <div className={styles.footerCol}>
            <h4>Legal &amp; Policies</h4>
            <ul>
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms &amp; Conditions</Link></li>
              <li><Link href="/refund-policy">Refund &amp; Cancellation Policy</Link></li>
              <li><Link href="/security">PCI-DSS Security</Link></li>
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
