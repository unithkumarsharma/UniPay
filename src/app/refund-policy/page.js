'use client';
import PublicLayout from '@/components/PublicLayout';

export default function RefundPolicyPage() {
  return (
    <PublicLayout>
      <div className="page-header">
        <h1>Cancellation &amp; Refund Policy</h1>
        <p>Instant Transaction Refunds &amp; Dispute Resolution Guidelines</p>
      </div>

      <div style={{ background: 'var(--bg-card)', padding: '36px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
        <p style={{ marginBottom: '20px' }}>
          At <strong>UniPay</strong>, customer satisfaction and transaction transparency are our top priorities. This Cancellation and Refund Policy outlines the terms governing failed, pending, and disputed transactions on our platform.
        </p>

        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '24px', marginBottom: '12px' }}>1. Failed Transactions &amp; Auto-Refunds</h3>
        <p style={{ marginBottom: '20px' }}>
          If a mobile recharge, BBPS bill payment, or money transfer fails due to operator timeout or bank gateway issues, the debited amount is <strong>automatically credited back to your UniPay wallet within 5 to 30 minutes</strong>.
        </p>

        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '24px', marginBottom: '12px' }}>2. Pending Transactions</h3>
        <p style={{ marginBottom: '20px' }}>
          In rare cases where a transaction remains in &quot;Pending&quot; status due to biller/bank confirmation delay:
        </p>
        <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
          <li>Resolution takes up to <strong>24 hours</strong> for bank settlement confirmation.</li>
          <li>If confirmed successful by the operator, receipt is updated to &quot;Success&quot;.</li>
          <li>If confirmed failed by operator, full amount is auto-refunded to your wallet.</li>
        </ul>

        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '24px', marginBottom: '12px' }}>3. Wrong Input Disclaimer</h3>
        <p style={{ marginBottom: '20px' }}>
          Recharges or bill payments processed for incorrect mobile numbers or wrong consumer IDs provided by the user cannot be cancelled or refunded once confirmed by the operator.
        </p>

        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '24px', marginBottom: '12px' }}>4. Grievance &amp; Dispute Raising</h3>
        <p>
          Merchants can raise a ticket via the <strong>Complaints Tab</strong> in their dashboard or email <code>refunds@unipay.in</code> with the Transaction ID for manual support within 24 hours.
        </p>
      </div>
    </PublicLayout>
  );
}
