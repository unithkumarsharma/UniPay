'use client';
import PublicLayout from '@/components/PublicLayout';

export default function TermsPage() {
  return (
    <PublicLayout>
      <div className="page-header">
        <h1>Terms &amp; Conditions</h1>
        <p>Service Usage Agreement for Retailers, Distributors &amp; Partners</p>
      </div>

      <div style={{ background: 'var(--bg-card)', padding: '36px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
        <p style={{ marginBottom: '20px' }}>
          Welcome to <strong>UniPay</strong>. By accessing our platform, registering as a merchant/distributor, or performing digital transactions, you agree to be bound by the following Terms and Conditions.
        </p>

        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '24px', marginBottom: '12px' }}>1. Account Registration &amp; KYC</h3>
        <p style={{ marginBottom: '20px' }}>
          All merchants (Master Distributors, Distributors, Retailers) must complete full KYC verification (Aadhaar/PAN) before performing transaction operations. You are solely responsible for maintaining the confidentiality of your account credentials and passwords.
        </p>

        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '24px', marginBottom: '12px' }}>2. Wallet Loading &amp; Transfers</h3>
        <p style={{ marginBottom: '20px' }}>
          Funds added to the UniPay wallet via bank transfer or online gateway are strictly non-transferable to unauthorized bank accounts except through approved DMT or settlement channels. Fund top-up requests require valid UTR reference submission.
        </p>

        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '24px', marginBottom: '12px' }}>3. Prohibited Conduct</h3>
        <p style={{ marginBottom: '20px' }}>
          Users are strictly prohibited from engaging in fraudulent transactions, processing unauthorized biometric withdrawals, attempting SQL injection or API tampering, or utilizing the platform for illegal money laundering activities. Accounts violating these rules will be immediately blocked and reported to law enforcement.
        </p>

        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '24px', marginBottom: '12px' }}>4. System Uptime &amp; Service Availability</h3>
        <p>
          While UniPay endeavors to maintain 99.9% system availability, service disruptions caused by telecom operator failures, bank server maintenance, or force majeure events do not constitute platform liability.
        </p>
      </div>
    </PublicLayout>
  );
}
