'use client';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import DataTable from '@/components/DataTable';
import RazorpayCheckoutButton from '@/components/RazorpayCheckoutButton';

export default function RetailerFundRequestPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('CASH');
  const [utr, setUtr] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [razorpayAmount, setRazorpayAmount] = useState('500');
  const [activeTab, setActiveTab] = useState('cash'); // 'cash' | 'online' | 'razorpay'

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

  const handleSubmit = async (e, payModeOverride) => {
    e.preventDefault();
    if (!amount) return;
    if (!userId) {
      showToast('Error: User session not found. Please log in again.');
      return;
    }

    const payMode = payModeOverride || method || 'CASH';

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/fund-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          userRole: user?.role || 'retailer',
          amount: Number(amount),
          paymentMethod: payMode,
          utrNumber: utr || (payMode === 'CASH' ? 'CASH_HANDOVER' : `UTR${Date.now()}`),
          bankName: payMode === 'CASH' ? 'Distributor Cash Handover' : 'HDFC Escrow',
          remarks: payMode === 'CASH' ? 'Retailer Cash Handover to Distributor' : 'Retailer Online Bank Deposit',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAmount('');
        setUtr('');
        showToast(
          payMode === 'CASH'
            ? `Cash Top-Up request of ₹${Number(amount).toLocaleString('en-IN')} sent to Distributor successfully!`
            : `Online UTR request of ₹${Number(amount).toLocaleString('en-IN')} submitted to Accountant successfully!`
        );
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
    {
      key: 'method',
      label: 'Mode',
      render: (r) => {
        const isCash = String(r.method).toUpperCase() === 'CASH';
        return (
          <span style={{ fontWeight: 700, color: isCash ? '#D97706' : '#2563EB' }}>
            {isCash ? '💵 Cash Top-Up' : '🏦 Online Bank'}
          </span>
        );
      },
    },
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
          Select your preferred top-up mode: Cash Handover to Distributor, Online Bank Transfer to Company, or Instant Gateway.
        </p>
      </div>

      {/* 3 Prominent Mode Selection Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button
          onClick={() => { setActiveTab('cash'); setMethod('CASH'); }}
          className={`btn ${activeTab === 'cash' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 800, padding: '12px 18px', background: activeTab === 'cash' ? '#059669' : undefined, borderColor: activeTab === 'cash' ? '#059669' : undefined }}
        >
          <span>💵</span> Mode 1: Cash Top-Up (Distributor Wallet Transfer)
        </button>

        <button
          onClick={() => { setActiveTab('online'); setMethod('ONLINE'); }}
          className={`btn ${activeTab === 'online' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 800, padding: '12px 18px' }}
        >
          <span>🏦</span> Mode 2: Online Company Bank Transfer (Accountant UTR Approval)
        </button>

        <button
          onClick={() => setActiveTab('razorpay')}
          className={`btn ${activeTab === 'razorpay' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 800, padding: '12px 18px' }}
        >
          <span>⚡</span> Mode 3: Razorpay Instant Gateway
        </button>
      </div>

      {/* 1. CASH TOP-UP FORM (Handover to Distributor) */}
      {activeTab === 'cash' && (
        <div className="card" style={{ maxWidth: '600px', padding: '24px', borderRadius: 'var(--radius-xl)', marginBottom: '28px', border: '1px solid #10B981', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.12)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.12)', color: '#059669', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '12px' }}>
            <span>💵</span> CASH TOP-UP WORKFLOW (DISTRIBUTOR WALLET DEBIT)
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '12px', color: 'var(--text-primary)' }}>
            Submit Cash Top-Up Request to Distributor
          </h3>

          <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '12px 14px', borderRadius: '8px', fontSize: '0.84rem', color: 'var(--text-primary)', marginBottom: '18px', lineHeight: 1.5 }}>
            <strong>📌 Rule &amp; Instructions:</strong> Give cash directly to your Upline Distributor. Enter the cash amount below and submit. <strong>Distributor will verify cash and approve this request. Amount will be deducted from Distributor Wallet and credited to your Retailer Wallet instantly.</strong>
          </div>

          <form onSubmit={(e) => handleSubmit(e, 'CASH')}>
            <div className="form-group" style={{ marginBottom: '18px' }}>
              <label className="form-label">Cash Amount Handed to Distributor (₹)</label>
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

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label">Cash Receipt / Reference Note</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Cash given at Noida Shop counter"
                value={utr}
                onChange={(e) => setUtr(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary w-full" style={{ padding: '14px', fontSize: '0.95rem', fontWeight: 800, background: '#059669', borderColor: '#059669' }} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting Cash Request...' : '💵 Submit Cash Top-Up Request to Distributor'}
            </button>
          </form>
        </div>
      )}

      {/* 2. ONLINE COMPANY BANK TRANSFER FORM */}
      {activeTab === 'online' && (
        <div className="card" style={{ maxWidth: '600px', padding: '24px', borderRadius: 'var(--radius-xl)', marginBottom: '28px', border: '1px solid #2563EB', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.12)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(37, 99, 235, 0.12)', color: '#2563EB', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '12px' }}>
            <span>🏦</span> ONLINE COMPANY BANK TRANSFER (ACCOUNTANT VERIFICATION)
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '12px', color: 'var(--text-primary)' }}>
            Submit Online Company Bank UTR Request
          </h3>

          <div style={{ background: 'rgba(37, 99, 235, 0.08)', border: '1px solid rgba(37, 99, 235, 0.2)', padding: '12px 14px', borderRadius: '8px', fontSize: '0.84rem', color: 'var(--text-primary)', marginBottom: '18px', lineHeight: 1.5 }}>
            <strong>📌 Rule &amp; Instructions:</strong> Transfer money ONLY to Company Bank Account (HDFC A/c: 50200012345678, IFSC: HDFC0001234). Enter the UTR Number below. <strong>Accountant will verify from bank statement. Upon verification, your wallet will be credited.</strong>
          </div>

          <form onSubmit={(e) => handleSubmit(e, 'ONLINE')}>
            <div className="form-group" style={{ marginBottom: '18px' }}>
              <label className="form-label">Transferred Amount (₹)</label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g. 20000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="1"
              />
            </div>

            <div className="form-group" style={{ marginBottom: '18px' }}>
              <label className="form-label">UTR / Payment Reference Number</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. UTR99812488123"
                value={utr}
                onChange={(e) => setUtr(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-full" style={{ padding: '14px', fontSize: '0.95rem', fontWeight: 800 }} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting UTR...' : '🏦 Submit Online UTR to Accountant'}
            </button>
          </form>
        </div>
      )}

      {/* 3. RAZORPAY INSTANT PAYMENT CARD */}
      {activeTab === 'razorpay' && (
        <div className="card" style={{ maxWidth: '600px', padding: '24px', borderRadius: 'var(--radius-xl)', marginBottom: '28px', border: '1px solid #7C3AED', boxShadow: '0 4px 14px rgba(124, 58, 237, 0.12)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(124, 58, 237, 0.12)', color: '#7C3AED', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '12px' }}>
            <span>⚡</span> INSTANT AUTO-CREDIT (RAZORPAY)
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '12px', color: 'var(--text-primary)' }}>
            Instant Razorpay Payment Gateway
          </h3>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '18px', lineHeight: 1.5 }}>
            Pay via UPI (GPay/PhonePe/Paytm), Cards, Netbanking. Balance credited automatically upon payment.
          </p>

          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label className="form-label">Enter Top-Up Amount (₹)</label>
            <input
              type="number"
              className="form-input"
              style={{ fontSize: '1.1rem', fontWeight: 800 }}
              placeholder="e.g. 500"
              value={razorpayAmount}
              onChange={(e) => setRazorpayAmount(e.target.value)}
              min="1"
            />
          </div>

          <RazorpayCheckoutButton
            amountInRupees={razorpayAmount || 100}
            buttonText={`Proceed to Pay ₹${Number(razorpayAmount || 0).toLocaleString('en-IN')} with Razorpay`}
            className="btn btn-primary w-full"
            buttonStyle={{ padding: '14px', fontSize: '0.95rem', fontWeight: 800, background: '#7C3AED', borderColor: '#7C3AED' }}
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
