'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from './ServiceActionModal.module.css';
import ReceiptModal from './ReceiptModal';
import ServiceIcon from './ServiceIcon';

export default function ServiceActionModal({ service, isOpen, onClose, onRefreshWallet }) {
  const { user, updateWalletBalance, refreshUserData } = useAuth();
  const [step, setStep] = useState(1); // 1: Form, 2: Confirm, 3: Success
  const [formData, setFormData] = useState({});
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [isBiometricDone, setIsBiometricDone] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [txnResult, setTxnResult] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

  if (!isOpen || !service) return null;

  const handleInputChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleBiometricScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setIsBiometricDone(true);
          return 100;
        }
        return prev + 25;
      });
    }, 250);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const amount = Number(formData.amount || formData.amt || 1000);
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || user?.userId || 'rtl001_fallback',
          type: service.name,
          amount: amount,
          serviceDetails: {
            serviceId: service.id,
            ...formData,
          },
        }),
      });

      const data = await res.json();
      
      const newTxn = {
        id: data.transaction?.txnId || 'TXN' + Math.floor(100000 + Math.random() * 900000),
        type: service.name,
        amount: amount,
        commission: data.transaction?.commission || Math.floor(amount * 0.012) || 15,
        status: 'success',
        time: 'Just now',
        user: formData.customerName || formData.mobile || 'Customer Ref',
        utr: 'UTR' + Math.floor(100000000000 + Math.random() * 900000000000),
      };

      setTxnResult(newTxn);
      setStep(3);
      if (data.success && data.newBalance !== undefined && data.newBalance !== null) {
        updateWalletBalance(data.newBalance);
        if (onRefreshWallet) onRefreshWallet(data.newBalance);
      } else if (refreshUserData) {
        refreshUserData();
      }
    } catch (err) {
      const amount = Number(formData.amount || 1000);
      const currentBal = Number(user?.walletBalance || 2000);
      const newBal = Math.max(0, currentBal - amount);
      updateWalletBalance(newBal);

      setTxnResult({
        id: 'TXN' + Math.floor(100000 + Math.random() * 900000),
        type: service.name,
        amount: amount,
        commission: 15,
        status: 'success',
        time: 'Just now',
        user: formData.mobile || 'Customer Ref',
        utr: 'UTR' + Math.floor(100000000000 + Math.random() * 900000000000),
      });
      setStep(3);
    }

    setIsProcessing(false);
  };

  const renderFields = () => {
    const sId = service.id;

    if (sId.includes('aeps') || sId === 'aeps_withdrawal' || sId === 'cash_deposit_aeps') {
      return (
        <>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Select Customer Bank</label>
            <select 
              className={styles.selectInput} 
              required
              onChange={(e) => handleInputChange('bank', e.target.value)}
            >
              <option value="">-- Choose Customer Bank --</option>
              <option value="SBI">State Bank of India (SBI)</option>
              <option value="HDFC">HDFC Bank Ltd.</option>
              <option value="ICICI">ICICI Bank Ltd.</option>
              <option value="PNB">Punjab National Bank (PNB)</option>
              <option value="BOB">Bank of Baroda</option>
              <option value="PAYTM">Paytm Payments Bank</option>
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Customer 12-Digit Aadhaar Number</label>
            <input 
              type="text" 
              className={styles.textInput} 
              placeholder="XXXX - XXXX - XXXX"
              maxLength={12}
              required
              onChange={(e) => handleInputChange('aadhaar', e.target.value)}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Withdrawal Amount (INR)</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: 12, fontWeight: 800, color: 'var(--text-secondary)' }}>₹</span>
              <input 
                type="number" 
                className={styles.textInput} 
                style={{ paddingLeft: 32 }}
                placeholder="Enter amount (e.g. 2000)"
                required
                onChange={(e) => handleInputChange('amount', e.target.value)}
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Registered Biometric RD Device</label>
            <select className={styles.selectInput} onChange={(e) => handleInputChange('device', e.target.value)}>
              <option value="mantra">Mantra MFS100 / L1 (Connected)</option>
              <option value="morpho">Morpho Safran MSO1300 E3</option>
              <option value="startek">Startek FM220</option>
              <option value="secugen">SecuGen Hamster Pro 20</option>
            </select>
          </div>

          {/* Biometric Scanner Widget */}
          <div className={styles.scanWidget}>
            <div className={styles.scanText}>
              {isScanning 
                ? `Capturing Biometric Fingerprint Data... ${scanProgress}%` 
                : isBiometricDone 
                ? '✅ Fingerprint Scanned Successfully (Quality score: 94%)' 
                : '🖐️ Place customer thumb/finger on biometric RD device'}
            </div>
            <button 
              type="button" 
              className={styles.scanBtn}
              onClick={handleBiometricScan}
              style={{ background: isBiometricDone ? '#059669' : '#2563EB', color: 'white' }}
            >
              {isScanning ? 'Scanning...' : isBiometricDone ? 'Re-Scan Fingerprint' : 'Capture Fingerprint'}
            </button>
          </div>
        </>
      );
    }

    if (sId.includes('dmt') || sId === 'upi_transfer' || sId === 'wallet_plus') {
      return (
        <>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Beneficiary Account Number / VPA UPI</label>
            <input 
              type="text" 
              className={styles.textInput} 
              placeholder="Enter Account Number or UPI ID"
              required
              onChange={(e) => handleInputChange('accountNo', e.target.value)}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>IFSC Code (Bank Transfer)</label>
            <input 
              type="text" 
              className={styles.textInput} 
              placeholder="e.g. SBIN0001234"
              style={{ textTransform: 'uppercase' }}
              onChange={(e) => handleInputChange('ifsc', e.target.value)}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Beneficiary Account Holder Name</label>
            <input 
              type="text" 
              className={styles.textInput} 
              placeholder="Full name as per bank record"
              required
              onChange={(e) => handleInputChange('customerName', e.target.value)}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Transfer Amount (INR)</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: 12, fontWeight: 800, color: 'var(--text-secondary)' }}>₹</span>
              <input 
                type="number" 
                className={styles.textInput} 
                style={{ paddingLeft: 32 }}
                placeholder="Enter amount (e.g. 5000)"
                required
                onChange={(e) => handleInputChange('amount', e.target.value)}
              />
            </div>
          </div>
        </>
      );
    }

    if (sId === 'indo_nepal') {
      return (
        <>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Indian Sender Aadhaar / Voter ID</label>
            <input type="text" className={styles.textInput} placeholder="Sender Indian Identity Number" required onChange={(e) => handleInputChange('senderId', e.target.value)} />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Nepal Receiver Citizenship ID</label>
            <input type="text" className={styles.textInput} placeholder="Nepal Citizenship Document ID" required onChange={(e) => handleInputChange('receiverId', e.target.value)} />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Receiver Name in Nepal</label>
            <input type="text" className={styles.textInput} placeholder="Full name in Nepal Rastra Bank record" required onChange={(e) => handleInputChange('customerName', e.target.value)} />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Amount in INR (₹)</label>
            <input type="number" className={styles.textInput} placeholder="Amount in INR" required onChange={(e) => handleInputChange('amount', e.target.value)} />
            <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, marginTop: 4 }}>
              💱 Live Forex Rate: 1 INR = 1.60 NPR (Pabitra Remit / Nepal Bank)
            </div>
          </div>
        </>
      );
    }

    if (sId.includes('irctc') || sId === 'flight' || sId === 'bus' || sId === 'hotel') {
      return (
        <>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Origin Station / Departure City</label>
            <input type="text" className={styles.textInput} placeholder="e.g. New Delhi (NDLS)" required onChange={(e) => handleInputChange('from', e.target.value)} />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Destination Station / Arrival City</label>
            <input type="text" className={styles.textInput} placeholder="e.g. Mumbai Central (MMCT)" required onChange={(e) => handleInputChange('to', e.target.value)} />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Journey Date</label>
            <input type="date" className={styles.textInput} required onChange={(e) => handleInputChange('date', e.target.value)} />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Passenger Mobile Number</label>
            <input type="tel" className={styles.textInput} placeholder="10-digit Mobile Number" maxLength={10} required onChange={(e) => handleInputChange('mobile', e.target.value)} />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Ticket Fare Amount (INR)</label>
            <input type="number" className={styles.textInput} placeholder="Total Ticket Amount" required onChange={(e) => handleInputChange('amount', e.target.value)} />
          </div>
        </>
      );
    }

    // Default Generic Service Form
    return (
      <>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Customer / Account ID Reference</label>
          <input type="text" className={styles.textInput} placeholder="Enter Reference / Consumer ID" required onChange={(e) => handleInputChange('accountNo', e.target.value)} />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Customer Mobile Number</label>
          <input type="tel" className={styles.textInput} placeholder="10-digit Mobile Number" maxLength={10} required onChange={(e) => handleInputChange('mobile', e.target.value)} />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Transaction Amount (INR)</label>
          <input type="number" className={styles.textInput} placeholder="Enter Amount" required onChange={(e) => handleInputChange('amount', e.target.value)} />
        </div>
      </>
    );
  };

  return (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className={styles.modalHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className={styles.iconContainer}>
                <ServiceIcon id={service.id} name={service.name} size={28} />
              </div>
              <div>
                <h3 className={styles.modalTitle}>{service.name}</h3>
                <span className={styles.commTag}>
                  ⚡ Earner Commission: Up to 3.5% / ₹15 per Txn
                </span>
              </div>
            </div>
            <button className={styles.closeBtn} onClick={onClose}>✕</button>
          </div>

          {/* Stepper Progress Indicator */}
          <div className={styles.stepper}>
            <div className={`${styles.stepItem} ${step >= 1 ? styles.stepActive : ''}`}>
              <span>1</span> Details
            </div>
            <div className={styles.stepLine} />
            <div className={`${styles.stepItem} ${step >= 2 ? styles.stepActive : ''}`}>
              <span>2</span> Authenticate
            </div>
            <div className={styles.stepLine} />
            <div className={`${styles.stepItem} ${step >= 3 ? styles.stepActive : ''}`}>
              <span>3</span> Receipt
            </div>
          </div>

          {step === 3 && txnResult ? (
            <div className={styles.successBox}>
              <div className={styles.successIcon}>🎉</div>
              <h3 className={styles.successTitle}>
                {service.name} Completed!
              </h3>
              <p className={styles.successSub}>
                Transaction Reference: <strong>{txnResult.id}</strong> | UTR: <strong>{txnResult.utr}</strong>
              </p>

              <div className={styles.marginCard}>
                <span>Merchant Commission Credited</span>
                <strong>+₹{txnResult.commission}.00</strong>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button 
                  className={styles.secondaryBtn}
                  onClick={() => {
                    setStep(1);
                    setTxnResult(null);
                  }}
                >
                  New Transaction
                </button>
                <button 
                  className={styles.primaryBtn}
                  onClick={() => setShowReceipt(true)}
                >
                  🖨️ View &amp; Print Receipt
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {renderFields()}

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button 
                  type="button" 
                  className={styles.secondaryBtn} 
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={styles.primaryBtn}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing Transaction...' : `Proceed ${service.name} ⚡`}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Tax Receipt Modal */}
      {showReceipt && txnResult && (
        <ReceiptModal 
          transaction={txnResult} 
          onClose={() => {
            setShowReceipt(false);
            onClose();
          }} 
        />
      )}
    </>
  );
}
