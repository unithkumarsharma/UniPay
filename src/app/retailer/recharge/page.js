'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const operators = [
  { id: 'Jio', name: 'Jio', icon: '📱' },
  { id: 'Airtel', name: 'Airtel', icon: '📱' },
  { id: 'Vi', name: 'Vi', icon: '📱' },
  { id: 'BSNL', name: 'BSNL', icon: '📱' },
];

const plans = [
  { amount: 149, validity: '24 days', data: '1GB/day', description: 'Unlimited calls + 1GB/day' },
  { amount: 199, validity: '28 days', data: '1.5GB/day', description: 'Unlimited calls + 1.5GB/day' },
  { amount: 299, validity: '28 days', data: '2GB/day', description: 'Unlimited calls + 2GB/day + OTT' },
  { amount: 449, validity: '56 days', data: '2GB/day', description: 'Unlimited calls + 2GB/day' },
  { amount: 599, validity: '84 days', data: '1.5GB/day', description: 'Unlimited calls + 1.5GB/day' },
  { amount: 999, validity: '84 days', data: '2.5GB/day', description: 'Unlimited calls + 2.5GB/day + OTT' },
];

export default function RechargePage() {
  const { user, refreshUserData, updateWalletBalance } = useAuth();
  const [selectedOp, setSelectedOp] = useState(null);
  const [mobile, setMobile] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [rechargeType, setRechargeType] = useState('prepaid');

  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState(null);

  const amountToCharge = selectedPlan ? selectedPlan.amount : parseFloat(customAmount);

  const handleRecharge = async (e) => {
    e.preventDefault();
    if (!user || !mobile || !selectedOp || !amountToCharge) return;

    setIsProcessing(true);
    setMessage(null);

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id || user._id || user.userId,
          type: 'recharge',
          amount: amountToCharge,
          serviceDetails: {
            operator: selectedOp,
            mobile,
            serviceName: 'Mobile Prepaid',
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: `Recharge Successful! Txn ID: ${data.transaction.txnId}. Commission earned: ₹${data.transaction.commission}` });
        if (data.newBalance !== undefined && data.newBalance !== null) {
          updateWalletBalance(data.newBalance);
        } else {
          await refreshUserData();
        }
        setMobile('');
        setSelectedPlan(null);
        setCustomAmount('');
      } else {
        setMessage({ type: 'error', text: `❌ ${data.error || 'Recharge failed'}` });
      }
    } catch (err) {
      setMessage({ type: 'error', text: `❌ ${err.message}` });
    }
    setIsProcessing(false);
  };

  return (
    <>
      <div className="page-header">
        <h1>Mobile Recharge</h1>
        <p>Recharge prepaid or pay postpaid bills with real DB wallet deduction &amp; commission split</p>
      </div>

      {message && (
        <div
          className="card mb-lg"
          style={{
            background: message.type === 'success' ? 'var(--success-light)' : 'var(--danger-light)',
            color: message.type === 'success' ? 'var(--success)' : 'var(--danger)',
            fontWeight: 600,
          }}
        >
          {message.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 900 }}>
        {/* Left - Form */}
        <form onSubmit={handleRecharge} className="card">
          <div className="flex gap-sm mb-md">
            <button
              type="button"
              className={`btn btn-sm ${rechargeType === 'prepaid' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setRechargeType('prepaid')}
            >
              Prepaid
            </button>
            <button
              type="button"
              className={`btn btn-sm ${rechargeType === 'postpaid' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setRechargeType('postpaid')}
            >
              Postpaid
            </button>
          </div>

          <div className="form-group">
            <label className="form-label">Mobile Number</label>
            <input
              type="tel"
              className="form-input"
              placeholder="Enter 10 digit mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              maxLength={10}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Select Operator</label>
            <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
              {operators.map((op) => (
                <button
                  key={op.id}
                  type="button"
                  className={`btn btn-sm ${selectedOp === op.id ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setSelectedOp(op.id)}
                >
                  {op.icon} {op.name}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Amount (₹)</label>
            <input
              type="number"
              className="form-input"
              placeholder="Enter amount or select plan"
              value={selectedPlan ? selectedPlan.amount : customAmount}
              onChange={(e) => {
                setSelectedPlan(null);
                setCustomAmount(e.target.value);
              }}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full btn-lg"
            disabled={!mobile || !selectedOp || !amountToCharge || isProcessing}
          >
            {isProcessing ? 'Processing Transaction...' : `Recharge ₹${amountToCharge || 0} Now ⚡`}
          </button>
        </form>

        {/* Right - Plans */}
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 14 }}>Browse Plans</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {plans.map((plan) => (
              <div
                key={plan.amount}
                className="card"
                style={{
                  padding: '14px 18px',
                  cursor: 'pointer',
                  border: selectedPlan?.amount === plan.amount ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  background: selectedPlan?.amount === plan.amount ? 'var(--primary-light)' : 'var(--bg-card)',
                }}
                onClick={() => {
                  setSelectedPlan(plan);
                  setCustomAmount('');
                }}
              >
                <div className="flex-between">
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-primary)' }}>₹{plan.amount}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 2 }}>{plan.description}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--primary)' }}>{plan.validity}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{plan.data}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
