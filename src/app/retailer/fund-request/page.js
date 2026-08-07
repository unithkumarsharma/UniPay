'use client';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import DataTable from '@/components/DataTable';
import RazorpayCheckoutButton from '@/components/RazorpayCheckoutButton';

export default function RetailerFundRequestPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('UPI');
  const [utr, setUtr] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [razorpayAmount, setRazorpayAmount] = useState('500');
  const [activeTab, setActiveTab] = useState('razorpay'); // 'razorpay' | 'manual'

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const userId = user?.id || user?._id;

  const fetchRequests = useCallback(async () => {
    try {
      const url = userId ? `/api/fund-requests?userId=${userId}` : '/api/fund-requests';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && Array.isArray(data.requests)) {
        const formatted = data.requests.map((r) => ({
          id: r.id || r.requestId,
          requestId: r.request_id || r.requestId || r.id,
          amount: Number(r.amount),
          method: r.payment_mode || r.paymentMethod || r.method,
          utr: r.reference_no || r.utrNumber || r.utr,
          status: r.status,
          date: r.created_at ? new Date(r.created_at).toLocaleString('en-IN') : (r.date || ''),
        }));
        setRequests(formatted);
      }
    } catch (e) {
      console.error('Fetch retailer fund requests error:', e);
    }
  }, [userId]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !utr) return;
    if (!userId) {
      showToast('Error: User session not found. Please log in again.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/fund-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          userRole: user?.role || 'retailer',
          amount: Number(amount),
          paymentMethod: method,
          utrNumber: utr,
          bankName: 'HDFC Bank',
          remarks: 'Retailer Wallet Deposit Request',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAmount('');
        setUtr('');
        showToast(`Fund request of ₹${Number(amount).toLocaleString('en-IN')} submitted successfully!`);
        fetchRequests();
      } else {
        showToast(data.error || 'Failed to submit fund request');
      }
    } catch (err) {
      showToast('Network error while submitting request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      key: 'requestId',
      label: 'Request ID',
      render: (r) => (
        <span style={{
          fontFamily: 'ui-monospace, monospace',
          fontWeight: 700,
          color: '#2563EB',
          background: 'rgba(37, 99, 235, 0.08)',
          padding: '3px 8px',
          borderRadius: 'var(--radius-md)',
        }}>
          {r.requestId || r.id}
        </span>
      ),
    },
    {
      key: 'amount',
      label: 'Amount (₹)',
      render: (r) => (
        <span style={{ fontWeight: 800, color: '#10B981', fontSize: '0.95rem' }}>
          ₹{(r.amount || 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    { key: 'method', label: 'Payment Mode' },
    {
      key: 'utr',
      label: 'UTR / Ref No.',
      render: (r) => (
        <span style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 600, color: 'var(--text-secondary)', background: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: '4px' }}>
          {r.utr || 'N/A'}
        </span>
      ),
    },
    { key: 'date', label: 'Date & Time' },
    {
      key: 'status',
      label: 'Status',
      render: (r) => {
        const isApproved = r.status === 'approved';
        const isPending = r.status === 'pending';
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.72rem',
            fontWeight: 700,
            background: isApproved ? 'rgba(16, 185, 129, 0.12)' : isPending ? 'rgba(245, 158, 11, 0.12)' : 'rgba(239, 68, 68, 0.12)',
            color: isApproved ? '#059669' : isPending ? '#D97706' : '#DC2626',
            textTransform: 'uppercase',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: isApproved ? '#10B981' : isPending ? '#F59E0B' : '#EF4444' }} />
            {r.status}
          </span>
        );
      },
    },
  ];

  return (
    <>
      {/* Toast Notification */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '24px',
          zIndex: 9999,
          background: '#10B981',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          fontSize: '0.88rem',
          fontWeight: 700,
        }}>
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          RETAILER WALLET LOAD PORTAL
        </div>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Wallet Top-Up &amp; Fund Load
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Pay instantly via Razorpay Online Gateway or submit a manual bank wire UTR request.
        </p>
      </div>

      {/* Mode Selection Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('razorpay')}
          className={`btn ${activeTab === 'razorpay' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}
        >
          <span>⚡</span> Razorpay Instant Auto-Credit
        </button>
        <button
          onClick={() => setActiveTab('manual')}
          className={`btn ${activeTab === 'manual' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}
        >
          <span>🏛️</span> Manual UTR Request
        </button>
      </div>

      {/* 1. RAZORPAY INSTANT PAYMENT CARD */}
      {activeTab === 'razorpay' && (
        <div className="card" style={{ maxWidth: '560px', padding: '24px', borderRadius: 'var(--radius-xl)', marginBottom: '28px', border: '1px solid #2563EB', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.12)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.12)', color: '#059669', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '12px' }}>
            <span>✓</span> INSTANT AUTO-CREDIT (NO APPROVAL DELAY)
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '12px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Instant Razorpay Payment Gateway
          </h3>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '18px', lineHeight: 1.5 }}>
            Pay via UPI (GPay/PhonePe/Paytm), Credit/Debit Card, Netbanking or Wallet. Your wallet balance will be credited automatically upon verification.
          </p>

          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label className="form-label">Enter Top-Up Amount (₹)</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontWeight: 800, color: 'var(--text-secondary)' }}>₹</span>
              <input
                type="number"
                className="form-input"
                style={{ paddingLeft: '32px', fontSize: '1.1rem', fontWeight: 800 }}
                placeholder="e.g. 500"
                value={razorpayAmount}
                onChange={(e) => setRazorpayAmount(e.target.value)}
                min="1"
              />
            </div>
          </div>

          {/* Quick Amount Selectors */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            {['100', '500', '1000', '2000', '5000'].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setRazorpayAmount(val)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: razorpayAmount === val ? '2px solid #2563EB' : '1px solid var(--border-color)',
                  background: razorpayAmount === val ? 'rgba(37, 99, 235, 0.1)' : 'var(--bg-secondary)',
                  color: razorpayAmount === val ? '#2563EB' : 'var(--text-primary)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                +₹{val}
              </button>
            ))}
          </div>

          <RazorpayCheckoutButton
            amountInRupees={razorpayAmount || 100}
            buttonText={`Proceed to Pay ₹${Number(razorpayAmount || 0).toLocaleString('en-IN')} with Razorpay`}
            className="btn btn-primary w-full"
            buttonStyle={{ padding: '14px', fontSize: '0.95rem', fontWeight: 800 }}
            onSuccess={(data) => {
              showToast(`🎉 Success! ₹${data.amount} credited to your wallet via Razorpay (${data.paymentId})`);
              fetchRequests();
            }}
            onFailure={(err) => {
              showToast(`Payment failed or cancelled: ${err.message}`);
            }}
          />
        </div>
      )}

      {/* 2. MANUAL UTR SUBMISSION FORM */}
      {activeTab === 'manual' && (
        <div className="card" style={{ maxWidth: '560px', padding: '24px', borderRadius: 'var(--radius-xl)', marginBottom: '28px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '18px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
            Submit New Manual Fund Deposit Request
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Select Top-Up Mode</label>
              <select
                className="form-select"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                style={{ fontWeight: 700 }}
              >
                <option value="ONLINE">🏦 Online Company Bank Transfer (Accountant Approval via UTR)</option>
                <option value="CASH">💵 Cash Top-Up (Distributor Wallet Transfer)</option>
              </select>
            </div>

            {method === 'ONLINE' ? (
              <div style={{ background: 'rgba(37, 99, 235, 0.08)', border: '1px solid rgba(37, 99, 235, 0.2)', padding: '12px 14px', borderRadius: '8px', fontSize: '0.82rem', color: 'var(--text-primary)', marginBottom: '16px' }}>
                <strong style={{ color: '#2563EB' }}>🏦 Company Bank Transfer Instructions:</strong><br />
                Transfer funds to Company Bank Account (HDFC A/c: 50200012345678, IFSC: HDFC0001234). Enter the UTR Number below. <strong>Accountant will verify from bank statement and credit your wallet.</strong>
              </div>
            ) : (
              <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '12px 14px', borderRadius: '8px', fontSize: '0.82rem', color: 'var(--text-primary)', marginBottom: '16px' }}>
                <strong style={{ color: '#059669' }}>💵 Cash Handover to Distributor Instructions:</strong><br />
                Give cash directly to your Upline Distributor. <strong>Distributor will approve and transfer funds from their wallet to your wallet.</strong>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Deposit Amount (₹)</label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g. 10000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="1"
              />
            </div>

            <div className="form-group">
              <label className="form-label">{method === 'CASH' ? 'Receipt / Cash Note Reference' : 'UTR / Payment Reference Number'}</label>
              <input
                type="text"
                className="form-input"
                placeholder={method === 'CASH' ? "e.g. Cash handed to Distributor" : "e.g. UTR99812488123"}
                value={utr}
                onChange={(e) => setUtr(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-full" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '12px', fontSize: '0.9rem', fontWeight: 800 }} disabled={isSubmitting}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              {isSubmitting ? 'Submitting Request...' : method === 'CASH' ? 'Submit Cash Request to Distributor' : 'Submit UTR to Accountant'}
            </button>
          </form>
        </div>
      )}

      {/* History Table */}
      <DataTable
        title="My Fund Request Audit History"
        columns={columns}
        data={requests}
        searchable={true}
      />
    </>
  );
}
