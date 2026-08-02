'use client';
import PublicLayout from '@/components/PublicLayout';

export default function PrivacyPolicyPage() {
  return (
    <PublicLayout>
      <div className="page-header">
        <h1>Privacy Policy</h1>
        <p>Last Updated: August 2026 | RBI &amp; IT Act 2000 Compliant</p>
      </div>

      <div style={{ background: 'var(--bg-card)', padding: '36px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
        <p style={{ marginBottom: '20px' }}>
          <strong>UniPay Technologies Private Limited</strong> (&quot;UniPay&quot;, &quot;We&quot;, &quot;Our&quot;) respects your privacy and is committed to protecting your personal &amp; financial information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you visit or use our web platform and digital payment services.
        </p>

        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '24px', marginBottom: '12px' }}>1. Information We Collect</h3>
        <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
          <li><strong>Personal Details:</strong> Name, mobile number, email address, shop address, and government-issued KYC IDs (Aadhaar, PAN).</li>
          <li><strong>Financial Details:</strong> Bank account numbers, IFSC codes, UTR transaction reference numbers for fund top-ups.</li>
          <li><strong>Transaction Logs:</strong> Time, amount, service type, operator details, IP address, and device headers for security audit trails.</li>
        </ul>

        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '24px', marginBottom: '12px' }}>2. How We Use Your Data</h3>
        <p style={{ marginBottom: '20px' }}>
          We use collected data exclusively to process transaction requests (Mobile Recharges, BBPS Bills, DMT Transfers), verify merchant identity (KYC), update wallet balances, calculate commissions, and comply with anti-money laundering (AML) regulatory standards.
        </p>

        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '24px', marginBottom: '12px' }}>3. Data Protection &amp; Security</h3>
        <p style={{ marginBottom: '20px' }}>
          We implement 256-bit SSL encryption for data in transit and AES encryption for data at rest. Passwords are cryptographically hashed using <code>bcrypt</code> algorithms. We do not sell, rent, or trade user data to third parties.
        </p>

        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '24px', marginBottom: '12px' }}>4. Grievance Redressal</h3>
        <p>
          If you have any questions or concerns regarding data privacy, contact our Nodal Grievance Officer at <code>privacy@unipay.in</code> or phone <code>+91 98765 43210</code>.
        </p>
      </div>
    </PublicLayout>
  );
}
