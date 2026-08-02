'use client';
import PublicLayout from '@/components/PublicLayout';

export default function SecurityPage() {
  return (
    <PublicLayout>
      <div className="page-header">
        <h1>Security &amp; Compliance</h1>
        <p>Bank-Grade Protection, Encryption &amp; Regulatory Safeguards</p>
      </div>

      <div style={{ background: 'var(--bg-card)', padding: '36px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
        <p style={{ marginBottom: '24px' }}>
          Security is built into every layer of <strong>UniPay</strong>. We employ cutting-edge cybersecurity protocols, encrypted communication channels, and real-time fraud monitoring to protect every merchant and end-customer transaction.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🔒</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>256-Bit SSL Encryption</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>All data transmissions between your browser and our servers are protected using TLS 1.3 encryption.</p>
          </div>
          <div style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🔑</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>Cryptographic Hashing</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Passwords and sensitive tokens are stored using salted <code>bcrypt</code> algorithms and JWT tokens.</p>
          </div>
          <div style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🏛️</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>RBI &amp; BBPS Compliance</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Fully aligned with Reserve Bank of India (RBI) payment security directives and Bharat BillPay guidelines.</p>
          </div>
          <div style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⚡</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>Real-time Fraud Shield</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Automated anomaly detection monitors velocity limits and blocks unauthorized multi-login attempts.</p>
          </div>
        </div>

        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>Merchant Security Guidelines</h3>
        <ul style={{ paddingLeft: '20px' }}>
          <li>Never share your UniPay login password or OTP with anyone, including support staff.</li>
          <li>Always lock your shop desktop terminal when leaving the counter.</li>
          <li>Verify UTR receipt details carefully before accepting cash for wallet transfers.</li>
        </ul>
      </div>
    </PublicLayout>
  );
}
