'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function RazorpayCheckoutButton({
  amountInRupees = 100,
  onSuccess,
  onFailure,
  buttonText = 'Pay with Razorpay Instant Gateway',
  buttonStyle = {},
  className = 'btn btn-primary',
}) {
  const { user, refreshUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    setError('');

    try {
      const numRupees = Number(amountInRupees);
      if (isNaN(numRupees) || numRupees < 1) {
        setError('Amount must be at least ₹1');
        setLoading(false);
        return;
      }

      // 1. Load Razorpay SDK Script
      const resScript = await loadRazorpayScript();
      if (!resScript) {
        setError('Razorpay SDK failed to load. Are you connected to the internet?');
        setLoading(false);
        return;
      }

      // 2. Call /api/create-order (amount in paise)
      const amountPaise = Math.round(numRupees * 100);
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountPaise,
          currency: 'INR',
          receipt: `rcpt_${Date.now()}`,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to initialize payment order');
      }

      const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_TLLq1zKnc5QaTx';

      // 3. Configure Razorpay Options
      const options = {
        key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'UniPay Payment Platform',
        description: `Instant Wallet Load (₹${numRupees.toLocaleString('en-IN')})`,
        image: '/logo.png',
        order_id: orderData.order_id,
        handler: async function (response) {
          setLoading(true);
          try {
            // 4. Call /api/verify-payment
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId: user?.id || user?._id,
                amount: numRupees,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              if (refreshUserData) await refreshUserData();
              if (onSuccess) {
                onSuccess({
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  newBalance: verifyData.newBalance,
                  amount: numRupees,
                });
              }
            } else {
              const errStr = verifyData.error || 'Payment verification failed';
              setError(errStr);
              if (onFailure) onFailure(new Error(errStr));
            }
          } catch (vErr) {
            console.error('Verification error:', vErr);
            setError(vErr.message || 'Payment verification error');
            if (onFailure) onFailure(vErr);
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: user?.name || 'UniPay Merchant',
          email: user?.email || 'retailer@unipay.in',
          contact: user?.phone || '9999900005',
        },
        notes: {
          platform: 'UniPay Standard Checkout',
        },
        theme: {
          color: '#2563EB',
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            console.log('Payment modal dismissed by user');
            if (onFailure) onFailure(new Error('Payment process cancelled by user'));
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);

      razorpayInstance.on('payment.failed', function (response) {
        setLoading(false);
        const failMsg = response.error?.description || 'Payment Failed';
        setError(failMsg);
        if (onFailure) onFailure(new Error(failMsg));
      });

      razorpayInstance.open();
    } catch (err) {
      console.error('Razorpay Checkout error:', err);
      setError(err.message || 'Failed to launch payment gateway');
      setLoading(false);
      if (onFailure) onFailure(err);
    }
  };

  return (
    <div>
      {error && (
        <div
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            background: 'var(--danger-light, #FEE2E2)',
            color: 'var(--danger, #DC2626)',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: '10px',
            textAlign: 'center',
          }}
        >
          ⚠️ {error}
        </div>
      )}

      <button
        type="button"
        onClick={handlePayment}
        disabled={loading}
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          ...buttonStyle,
        }}
      >
        {loading ? (
          <>
            <span
              style={{
                width: 14,
                height: 14,
                border: '2px solid currentColor',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            Initializing Gateway...
          </>
        ) : (
          <>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
            {buttonText}
          </>
        )}
      </button>
    </div>
  );
}
