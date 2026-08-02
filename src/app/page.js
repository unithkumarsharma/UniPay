'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import { serviceCategories } from '@/data/services';
import styles from './landing.module.css';

const LEFT_IMAGES = [
  {
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1000&auto=format&fit=crop&q=85',
    title: 'Mobile & DTH 5G Recharge',
    badge: '⚡ Instant Commission',
    detail: 'Jio, Airtel, Vi & Dish TV 24x7',
    status: '✅ ₹299 Recharge Successful'
  },
  {
    image: 'https://images.unsplash.com/photo-1544725121-be3bf52e2dc8?w=1000&auto=format&fit=crop&q=85',
    title: 'BBPS Utility Bill Payments',
    badge: '💡 Electricity & Water',
    detail: 'All India State Electricity Boards',
    status: '⚡ Electricity Bill Paid'
  },
  {
    image: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=1000&auto=format&fit=crop&q=85',
    title: 'DMT Money Transfer',
    badge: '🏦 24x7 IMPS Bank Transfer',
    detail: 'Instant Transfer to Any Bank',
    status: '✅ ₹10,000 Transferred'
  }
];

const RIGHT_IMAGES = [
  {
    image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=1000&auto=format&fit=crop&q=85',
    title: 'AEPS Aadhaar Banking',
    badge: '🖐️ Cash Withdrawal ATM',
    detail: 'Balance Inquiry & Mini Statement',
    status: '✅ ₹5,000 Cash Withdrawal'
  },
  {
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1000&auto=format&fit=crop&q=85',
    title: 'Flight & Travel Booking',
    badge: '✈️ Flight & Bus Tickets',
    detail: 'Lowest Airfare & Instant PNR',
    status: '✅ Flight Ticket Confirmed'
  },
  {
    image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1000&auto=format&fit=crop&q=85',
    title: 'Digital Merchant Network',
    badge: '🛍️ Shop Owner Platform',
    detail: 'Serve Customers & Earn Commission',
    status: '✅ Daily Settlement Active'
  }
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [leftIndex, setLeftIndex] = useState(0);
  const [rightIndex, setRightIndex] = useState(0);
  const [fadeLeft, setFadeLeft] = useState(true);
  const [fadeRight, setFadeRight] = useState(true);

  // Auto-scroll images smoothly every 2 seconds (2000ms) with cross-fade
  useEffect(() => {
    const timer = setInterval(() => {
      setFadeLeft(false);
      setFadeRight(false);

      setTimeout(() => {
        setLeftIndex((prev) => (prev + 1) % LEFT_IMAGES.length);
        setRightIndex((prev) => (prev + 1) % RIGHT_IMAGES.length);
        setFadeLeft(true);
        setFadeRight(true);
      }, 300);
    }, 2400);

    return () => clearInterval(timer);
  }, []);

  const activeLeft = LEFT_IMAGES[leftIndex];
  const activeRight = RIGHT_IMAGES[rightIndex];

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

      {/* ===== HERO SECTION WITH RETOUCHED REAL IMAGE SLIDERS ===== */}
      <section className={styles.heroSection}>
        <div className={styles.heroLayoutGrid}>

          {/* LEFT RETOUCHED REAL IMAGE SLIDER */}
          <div className={styles.heroSideColLeft}>
            <div
              className={`${styles.fullImageBanner} ${fadeLeft ? styles.fadeIn : styles.fadeOut}`}
              style={{ backgroundImage: `url(${activeLeft.image})` }}
            >
              <div className={styles.imageOverlayGradient}></div>
              <div className={styles.bannerContent}>
                <span className={styles.bannerBadge}>{activeLeft.badge}</span>
                <h3 className={styles.bannerTitle}>{activeLeft.title}</h3>
                <p className={styles.bannerDetail}>{activeLeft.detail}</p>
                <div className={styles.bannerStatus}>{activeLeft.status}</div>
                <div className={styles.sliderDots}>
                  {LEFT_IMAGES.map((_, i) => (
                    <span key={i} className={`${styles.dot} ${i === leftIndex ? styles.activeDot : ''}`}></span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CENTER HERO CONTENT */}
          <div className={styles.heroCenterContent}>
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

          {/* RIGHT RETOUCHED REAL IMAGE SLIDER */}
          <div className={styles.heroSideColRight}>
            <div
              className={`${styles.fullImageBanner} ${fadeRight ? styles.fadeIn : styles.fadeOut}`}
              style={{ backgroundImage: `url(${activeRight.image})` }}
            >
              <div className={styles.imageOverlayGradient}></div>
              <div className={styles.bannerContent}>
                <span className={styles.bannerBadge}>{activeRight.badge}</span>
                <h3 className={styles.bannerTitle}>{activeRight.title}</h3>
                <p className={styles.bannerDetail}>{activeRight.detail}</p>
                <div className={styles.bannerStatus}>{activeRight.status}</div>
                <div className={styles.sliderDots}>
                  {RIGHT_IMAGES.map((_, i) => (
                    <span key={i} className={`${styles.dot} ${i === rightIndex ? styles.activeDot : ''}`}></span>
                  ))}
                </div>
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
