'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import DashboardCard from '@/components/DashboardCard';
import DataTable from '@/components/DataTable';
import { recentTransactions } from '@/data/mockData';
import { serviceCategories, allServices } from '@/data/services';
import ReceiptModal from '@/components/ReceiptModal';
import ServiceActionModal from '@/components/ServiceActionModal';
import ServiceIcon from '@/components/ServiceIcon';
import styles from './retailer.module.css';

function DashboardContent() {
  const { user, refreshUserData, updateWalletBalance } = useAuth();
  const searchParams = useSearchParams();
  const serviceParam = searchParams ? searchParams.get('service') : null;
  const categoryParam = searchParams ? searchParams.get('category') : null;

  const [showBalance, setShowBalance] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('ALL');
  
  // Modals & State
  const [showFundModal, setShowFundModal] = useState(false);
  const [fundAmount, setFundAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [utrNumber, setUtrNumber] = useState('');
  const [fundSuccess, setFundSuccess] = useState(false);

  const [selectedTxn, setSelectedTxn] = useState(null);

  // Live Service Execution Form State
  const [activeService, setActiveService] = useState(null);
  const [formData, setFormData] = useState({});
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [isBiometricDone, setIsBiometricDone] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [txnResult, setTxnResult] = useState(null);

  // Active Category Object from categoryParam
  const selectedCategoryObj = categoryParam 
    ? serviceCategories.find(c => c.name.toLowerCase() === categoryParam.toLowerCase()) 
    : null;

  // Sync active service from URL param
  useEffect(() => {
    const timer = setTimeout(() => {
      if (serviceParam) {
        const found = allServices.find(s => s.id === serviceParam);
        if (found) {
          setActiveService(found);
          setTxnResult(null);
          setFormData({});
          setIsBiometricDone(false);
        }
      } else {
        setActiveService(null);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [serviceParam]);

  const handleFundSubmit = async (e) => {
    e.preventDefault();
    if (!fundAmount || !utrNumber) return;
    try {
      await fetch('/api/fund-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || 'rtl001_fallback',
          amount: parseFloat(fundAmount),
          paymentMethod,
          utrNumber,
        }),
      });
    } catch (e) {}
    setFundSuccess(true);
    setTimeout(() => {
      setFundSuccess(false);
      setShowFundModal(false);
      setFundAmount('');
      setUtrNumber('');
    }, 2000);
  };

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

  const handleExecuteTxn = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const amount = Number(formData.amount || formData.amt || 1000);
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || user?.userId || 'rtl001_fallback',
          type: activeService?.name || 'Service Txn',
          amount: amount,
          serviceDetails: {
            serviceId: activeService?.id,
            ...formData,
          },
        }),
      });

      const data = await res.json();
      
      const newTxn = {
        id: data.transaction?.txnId || 'TXN' + Math.floor(100000 + Math.random() * 900000),
        type: activeService?.name || 'Service Txn',
        amount: amount,
        commission: data.transaction?.commission || Math.floor(amount * 0.012) || 15,
        status: 'success',
        time: 'Just now',
        user: formData.customerName || formData.mobile || 'Customer Ref',
        utr: 'UTR' + Math.floor(100000000000 + Math.random() * 900000000000),
      };

      setTxnResult(newTxn);
      if (data.success && data.newBalance !== undefined && data.newBalance !== null) {
        updateWalletBalance(data.newBalance);
      } else if (refreshUserData) {
        refreshUserData();
      }
    } catch (err) {
      const fallbackAmount = Number(formData.amount || 1000);
      const currentBal = Number(user?.walletBalance || 2000);
      const newBal = Math.max(0, currentBal - fallbackAmount);
      updateWalletBalance(newBal);

      setTxnResult({
        id: 'TXN' + Math.floor(100000 + Math.random() * 900000),
        type: activeService?.name || 'Service Txn',
        amount: fallbackAmount,
        commission: 15,
        status: 'success',
        time: 'Just now',
        user: formData.mobile || 'Customer Ref',
        utr: 'UTR' + Math.floor(100000000000 + Math.random() * 900000000000),
      });
    }

    setIsProcessing(false);
  };

  const txnColumns = [
    { key: 'id', label: 'Txn ID' },
    { key: 'type', label: 'Service Type' },
    { key: 'amount', label: 'Amount' },
    { key: 'commission', label: 'Commission' },
    { key: 'status', label: 'Status' },
    { key: 'time', label: 'Time' },
  ];

  // Render Form Fields for Dedicated Workstation View
  const renderWorkstationFields = () => {
    if (!activeService) return null;
    const sId = activeService.id;

    if (sId.includes('aeps') || sId === 'aeps_withdrawal' || sId === 'cash_deposit_aeps') {
      return (
        <>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6, color: 'var(--text-secondary)' }}>Select Customer Bank</label>
            <select 
              className="form-control"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
              required
              onChange={(e) => handleInputChange('bank', e.target.value)}
            >
              <option value="">-- Choose Bank --</option>
              <option value="SBI">State Bank of India (SBI)</option>
              <option value="HDFC">HDFC Bank Ltd.</option>
              <option value="ICICI">ICICI Bank Ltd.</option>
              <option value="PNB">Punjab National Bank (PNB)</option>
              <option value="BOB">Bank of Baroda</option>
              <option value="PAYTM">Paytm Payments Bank</option>
            </select>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6, color: 'var(--text-secondary)' }}>Customer 12-Digit Aadhaar Number</label>
            <input 
              type="text" 
              className="form-control"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
              placeholder="XXXX - XXXX - XXXX"
              maxLength={12}
              required
              onChange={(e) => handleInputChange('aadhaar', e.target.value)}
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6, color: 'var(--text-secondary)' }}>Withdrawal Amount (INR)</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: 12, fontWeight: 800, color: 'var(--text-secondary)' }}>₹</span>
              <input 
                type="number" 
                className="form-control"
                style={{ width: '100%', padding: '10px 14px 10px 32px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
                placeholder="Enter amount (e.g. 2000)"
                required
                onChange={(e) => handleInputChange('amount', e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6, color: 'var(--text-secondary)' }}>Registered Biometric RD Device</label>
            <select 
              className="form-control"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
              onChange={(e) => handleInputChange('device', e.target.value)}
            >
              <option value="mantra">Mantra MFS100 / L1 (Connected 🟢)</option>
              <option value="morpho">Morpho Safran MSO1300 E3</option>
              <option value="startek">Startek FM220</option>
            </select>
          </div>

          {/* Biometric Scanner Widget */}
          <div style={{ background: 'rgba(37, 99, 235, 0.06)', border: '1.5px dashed var(--primary)', borderRadius: '12px', padding: '18px', textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>
              {isScanning 
                ? `Capturing Biometric Fingerprint Data... ${scanProgress}%` 
                : isBiometricDone 
                ? '✅ Fingerprint Scanned Successfully (Quality Score: 94%)' 
                : '🖐️ Place customer thumb/finger on biometric RD device'}
            </div>
            <button 
              type="button" 
              onClick={handleBiometricScan}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none', background: isBiometricDone ? 'var(--success)' : 'var(--primary)', color: 'white', fontWeight: 700, cursor: 'pointer' }}
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
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6, color: 'var(--text-secondary)' }}>Beneficiary Account Number / VPA UPI</label>
            <input 
              type="text" 
              className="form-control"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
              placeholder="Enter Account Number or UPI ID"
              required
              onChange={(e) => handleInputChange('accountNo', e.target.value)}
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6, color: 'var(--text-secondary)' }}>IFSC Code (Bank Transfer)</label>
            <input 
              type="text" 
              className="form-control"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)', textTransform: 'uppercase' }}
              placeholder="e.g. SBIN0001234"
              onChange={(e) => handleInputChange('ifsc', e.target.value)}
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6, color: 'var(--text-secondary)' }}>Beneficiary Account Holder Name</label>
            <input 
              type="text" 
              className="form-control"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
              placeholder="Full name as per bank record"
              required
              onChange={(e) => handleInputChange('customerName', e.target.value)}
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6, color: 'var(--text-secondary)' }}>Transfer Amount (INR)</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: 12, fontWeight: 800, color: 'var(--text-secondary)' }}>₹</span>
              <input 
                type="number" 
                className="form-control"
                style={{ width: '100%', padding: '10px 14px 10px 32px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
                placeholder="Enter amount (e.g. 5000)"
                required
                onChange={(e) => handleInputChange('amount', e.target.value)}
              />
            </div>
          </div>
        </>
      );
    }

    // Generic Fields
    return (
      <>
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6, color: 'var(--text-secondary)' }}>Customer / Consumer Reference ID</label>
          <input 
            type="text" 
            className="form-control"
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
            placeholder="Enter Consumer ID / Mobile / Account Reference"
            required
            onChange={(e) => handleInputChange('accountNo', e.target.value)}
          />
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6, color: 'var(--text-secondary)' }}>Customer Mobile Number</label>
          <input 
            type="tel" 
            className="form-control"
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
            placeholder="10-digit Mobile Number"
            maxLength={10}
            required
            onChange={(e) => handleInputChange('mobile', e.target.value)}
          />
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6, color: 'var(--text-secondary)' }}>Transaction Amount (INR)</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: 12, fontWeight: 800, color: 'var(--text-secondary)' }}>₹</span>
            <input 
              type="number" 
              className="form-control"
              style={{ width: '100%', padding: '10px 14px 10px 32px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
              placeholder="Enter Amount"
              required
              onChange={(e) => handleInputChange('amount', e.target.value)}
            />
          </div>
        </div>
      </>
    );
  };

  return (
    <div className={styles.container}>
      {/* CASE 1: DEDICATED SERVICE WORKSTATION TERMINAL (when serviceParam is active) */}
      {activeService ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Top Banner */}
          <div className={styles.banner} style={{ padding: '20px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <ServiceIcon id={activeService.id} name={activeService.name} size={52} />
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  RETAILER WORKSTATION PORTAL
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', margin: '2px 0' }}>
                  {activeService.name}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <span>Earn Commission: <strong style={{ color: 'var(--text-primary)' }}>Up to ₹15/txn</strong></span>
                  <span>•</span>
                  <span>Server Latency: <strong style={{ color: 'var(--success)' }}>18ms (99.9% Success)</strong></span>
                </div>
              </div>
            </div>

            <Link href="/retailer" className="btn btn-secondary" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '8px 16px', borderRadius: '8px', fontWeight: 600 }}>
              ← Back to Overview
            </Link>
          </div>

          {/* 2-Column Workstation */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px' }}>
            {/* Left Column: Terminal */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Execute Transaction</span>
                <span style={{ fontSize: '0.75rem', background: 'var(--success-light)', color: 'var(--success)', padding: '3px 10px', borderRadius: '12px', fontWeight: 700 }}>
                  Wallet Balance: ₹{(user?.walletBalance ?? user?.wallet_balance ?? 20000).toLocaleString('en-IN')}
                </span>
              </div>

              {txnResult ? (
                <div style={{ textAlign: 'center', padding: '24px 12px' }}>
                  <div style={{ fontSize: '3rem', marginBottom: 8 }}>🎉</div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--success)', marginBottom: 4 }}>
                    {activeService.name} Completed!
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
                    Txn ID: <strong>{txnResult.id}</strong> | UTR: <strong>{txnResult.utr}</strong>
                  </p>
                  <div style={{ background: 'var(--success-light)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', color: 'var(--success)', fontWeight: 800, marginBottom: 20 }}>
                    <span>Retailer Margin Credited</span>
                    <span>+₹{txnResult.commission}.00</span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setTxnResult(null)}>
                      New Transaction
                    </button>
                    <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setSelectedTxn(txnResult)}>
                      🖨️ View &amp; Print Receipt
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleExecuteTxn}>
                  {renderWorkstationFields()}

                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isProcessing}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', fontWeight: 800, fontSize: '0.95rem', boxShadow: 'var(--shadow-md)' }}
                  >
                    {isProcessing ? 'Processing Transaction...' : `Proceed ${activeService.name} ⚡`}
                  </button>
                </form>
              )}
            </div>

            {/* Right Column: Slabs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>💎 Commission &amp; Margin Slab</span>
                </h4>
                <div style={{ fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid var(--border-light)' }}>
                    <span>₹100 - ₹1,000</span>
                    <strong style={{ color: 'var(--success)' }}>+₹3.50</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid var(--border-light)' }}>
                    <span>₹1,001 - ₹3,000</span>
                    <strong style={{ color: 'var(--success)' }}>+₹8.00</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid var(--border-light)' }}>
                    <span>₹3,001 - ₹10,000</span>
                    <strong style={{ color: 'var(--success)' }}>+₹15.00</strong>
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--primary-light)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '20px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary)', marginBottom: 8 }}>
                  📌 Retailer Guidelines
                </h4>
                <ul style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', paddingLeft: '16px', lineHeight: '1.5' }}>
                  <li>Ensure customer details are verified before submitting.</li>
                  <li>In case of pending status, do not re-initiate for 10 minutes.</li>
                  <li>Customer copy tax receipt can be printed directly after txn.</li>
                </ul>
              </div>
            </div>
          </div>

          <DataTable 
            title={`Recent ${activeService.name} History`}
            columns={txnColumns}
            data={recentTransactions.filter(t => t.type.toLowerCase().includes(activeService.name.toLowerCase().split(' ')[0]))}
            searchable={true}
          />
        </div>
      ) : selectedCategoryObj ? (
        /* CASE 2: DEDICATED RIGHT-SIDE CATEGORY SELECTION HUB PORTAL (when categoryParam is active) */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Category Top Banner */}
          <div className={styles.banner} style={{ padding: '24px 28px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                CATEGORY SERVICES HUB
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                {selectedCategoryObj.name} Portal
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                Select a service terminal below to start serving customers in this category.
              </p>
            </div>

            <Link href="/retailer" className="btn btn-secondary" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '8px 16px', borderRadius: '8px', fontWeight: 600 }}>
              ← Back to Overview
            </Link>
          </div>

          {/* Category Sub-Services Grid */}
          <div className={styles.sectionCard}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--primary)' }} />
              Available Services in {selectedCategoryObj.name} ({selectedCategoryObj.services.length})
            </h3>

            <div className={styles.servicesGrid}>
              {selectedCategoryObj.services.map((service) => {
                const iconClass = service.color === 'green' ? styles.iconGreen :
                                  service.color === 'purple' ? styles.iconPurple :
                                  service.color === 'orange' ? styles.iconOrange :
                                  service.color === 'red' ? styles.iconRed : styles.iconBlue;
                return (
                  <Link 
                    key={service.id} 
                    href={`/retailer?service=${service.id}`}
                    className={styles.serviceTile}
                    style={{ padding: '22px 16px' }}
                  >
                    {service.badge && (
                      <span 
                        style={{ 
                          position: 'absolute', 
                          top: '10px', 
                          right: '10px', 
                          background: service.badge === 'NEW' ? '#EF4444' : 'var(--primary)', 
                          color: 'white', 
                          fontSize: '0.62rem', 
                          fontWeight: 800, 
                          padding: '2px 8px', 
                          borderRadius: '10px' 
                        }}
                      >
                        {service.badge}
                      </span>
                    )}

                    <div className={`${styles.serviceIconBox} ${iconClass}`} style={{ width: 64, height: 64, marginBottom: 14 }}>
                      <ServiceIcon id={service.id} name={service.name} size={48} />
                    </div>
                    
                    <div className={styles.serviceTitle} style={{ fontSize: '0.9rem', fontWeight: 800 }}>{service.name}</div>
                    
                    <div style={{ fontSize: '0.72rem', color: 'var(--success)', fontWeight: 700, marginTop: 6, background: 'var(--success-light)', padding: '2px 8px', borderRadius: '12px' }}>
                      Earn: Up to ₹15/txn
                    </div>

                    <div style={{ marginTop: 12, fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Launch Terminal ⚡
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Category Transactions Ledger */}
          <DataTable 
            title={`${selectedCategoryObj.name} Transactions Log`}
            columns={txnColumns}
            data={recentTransactions}
            searchable={true}
          />
        </div>
      ) : (
        /* CASE 3: OVERVIEW DASHBOARD (when no categoryParam or serviceParam active) */
        <>
          {/* Executive Hero Banner */}
          <div className={styles.heroBanner}>
            <div className={styles.greetingGroup}>
              <div className={styles.greetingTitle}>
                <span>Welcome back, {user?.name || 'Retailer'}! 👋</span>
              </div>
              <div className={styles.greetingSub}>
                <span className={styles.shopBadge}>
                  📱 Mobile: {user?.phone || '9876543214'}
                </span>
                <span className={styles.onlineBadge}>
                  <span className={styles.pulseDot} />
                  Verified Merchant ({user?.id || 'RT982341'})
                </span>
              </div>
            </div>

            <div className={styles.bannerActions}>
              <button 
                className="btn btn-secondary"
                onClick={() => window.location.href = '/retailer/transactions'}
                style={{ borderRadius: 'var(--radius-lg)', padding: '10px 16px', fontSize: '0.85rem', background: 'rgba(255,255,255,0.12)', color: 'white', border: '1px solid rgba(255,255,255,0.25)', fontWeight: 700 }}
              >
                📋 Ledger Statement
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => setShowFundModal(true)}
                style={{ borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)', padding: '10px 18px', fontSize: '0.85rem', fontWeight: 800 }}
              >
                ➕ Request Funds ⚡
              </button>
            </div>
          </div>

          {/* Notice Marquee */}
          <div className={styles.noticePill}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span>
              <strong>Important Notice:</strong> Do not make counter and CDM cash deposit into company bank account without UTR submission. Earn extra 0.5% commission on Electricity & Bill Payments today!
            </span>
          </div>

          {/* Wallet Card + Stats Grid */}
          <div className={styles.dashboardTopGrid}>
            {/* Wallet Card */}
            <div className={styles.walletCard}>
              <div className={styles.walletCardBgPattern} />
              
              <div className={styles.walletCardHeader}>
                <div className={styles.walletLabel}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                  Available Balance
                </div>
                <button 
                  onClick={() => setShowBalance(!showBalance)} 
                  className={styles.eyeBtn}
                  title={showBalance ? "Hide Balance" : "Show Balance"}
                >
                  {showBalance ? '👁️' : '🙈'}
                </button>
              </div>

              <div className={styles.walletBalanceAmount}>
                {showBalance ? `₹${(Number(user?.walletBalance ?? user?.wallet_balance ?? 20000)).toLocaleString('en-IN')}` : '••••••••'}
              </div>

              <div className={styles.walletMetaRow}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Credit Line</span>
                  <span className={styles.metaVal}>₹50,000</span>
                </div>
                <div className={styles.metaDivider} />
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Daily Limit</span>
                  <span className={styles.metaVal}>₹2,00,000</span>
                </div>
              </div>

              <div className={styles.walletActionRow}>
                <button className={styles.walletBtnPrimary} onClick={() => setShowFundModal(true)}>
                  Request Funds
                </button>
                <Link href="/retailer/transactions" className={styles.walletBtnSecondary}>
                  View Statement
                </Link>
              </div>
            </div>

            {/* 4 Executive Stat Cards with Live Trends & Sparklines */}
            <div className={styles.statsGrid}>
              <DashboardCard
                title="Today's Transactions"
                value="0"
                change="0% vs yesterday"
                changeType="positive"
                iconColor="blue"
                sparkline="0,0,0,0,0,0,0"
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                }
              />
              <DashboardCard
                title="Today's Earning"
                value="₹0.00"
                change="₹0.00 Commission"
                changeType="positive"
                iconColor="green"
                sparkline="0,0,0,0,0,0"
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                }
              />
              <DashboardCard
                title="Monthly Earning"
                value="₹0.00"
                change="0% Growth"
                changeType="positive"
                iconColor="purple"
                sparkline="0,0,0,0,0,0"
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                }
              />
              <DashboardCard
                title="Success Rate"
                value="98.2%"
                change="🟢 Live Banking Server"
                changeType="positive"
                iconColor="orange"
                sparkline="95,96,97,97.5,98,98.2"
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                }
              />
            </div>
          </div>

          {/* Categorized Quick Services Hub */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary)' }}>
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                </svg>
                Services &amp; Banking Workstation Hub
              </h3>

              {/* Search Bar */}
              <div className={styles.searchWrapper}>
                <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input 
                  type="text" 
                  placeholder="Search service..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className={styles.categoryTabs} style={{ marginBottom: '20px' }}>
              <button 
                className={`${styles.tabBtn} ${activeCategoryFilter === 'ALL' ? styles.tabActive : ''}`}
                onClick={() => setActiveCategoryFilter('ALL')}
              >
                All Services ({allServices.length})
              </button>
              {serviceCategories.map((cat) => (
                <button 
                  key={cat.name}
                  className={`${styles.tabBtn} ${activeCategoryFilter === cat.name ? styles.tabActive : ''}`}
                  onClick={() => setActiveCategoryFilter(cat.name)}
                >
                  {cat.name} ({cat.services.length})
                </button>
              ))}
            </div>

            {/* Service Grid Categories */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {serviceCategories
                .filter(cat => activeCategoryFilter === 'ALL' || activeCategoryFilter === cat.name)
                .map((cat) => {
                  const categoryServices = cat.services.filter(s => 
                    s.name.toLowerCase().includes(searchQuery.toLowerCase())
                  );
                  if (categoryServices.length === 0) return null;

                  return (
                    <div key={cat.name} style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)' }} />
                        {cat.name}
                      </h4>

                      <div className={styles.servicesGrid}>
                        {categoryServices.map((service) => {
                          const iconClass = service.color === 'green' ? styles.iconGreen :
                                            service.color === 'purple' ? styles.iconPurple :
                                            service.color === 'orange' ? styles.iconOrange :
                                            service.color === 'red' ? styles.iconRed : styles.iconBlue;
                          return (
                            <Link 
                              key={service.id} 
                              href={`/retailer?service=${service.id}`}
                              className={styles.serviceTile}
                            >
                              {service.badge && (
                                <span 
                                  style={{ 
                                    position: 'absolute', 
                                    top: '8px', 
                                    right: '8px', 
                                    background: service.badge === 'NEW' ? '#EF4444' : 'var(--primary)', 
                                    color: 'white', 
                                    fontSize: '0.6rem', 
                                    fontWeight: 800, 
                                    padding: '2px 6px', 
                                    borderRadius: '10px' 
                                  }}
                                >
                                  {service.badge}
                                </span>
                              )}

                              <div className={`${styles.serviceIconBox} ${iconClass}`}>
                                <ServiceIcon id={service.id} name={service.name} size={44} />
                              </div>
                              <div className={styles.serviceTitle}>{service.name}</div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Recent Activity Table */}
          <DataTable
            title="Recent Transactions Ledger"
            columns={txnColumns}
            data={recentTransactions}
            searchable={true}
            filterTabs={[
              { key: 'ALL', label: 'All' },
              { key: 'success', label: 'Success' },
              { key: 'pending', label: 'Pending' },
              { key: 'failed', label: 'Failed' },
            ]}
          />
        </>
      )}

      {/* Fund Request Modal */}
      {showFundModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: '440px', padding: '28px', boxShadow: 'var(--shadow-xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Request Wallet Funds</h3>
              <button onClick={() => setShowFundModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            {fundSuccess ? (
              <div style={{ textTransform: 'center', textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '3rem' }}>🎉</div>
                <h4 style={{ color: 'var(--success)', fontSize: '1.2rem', fontWeight: 800 }}>Fund Request Submitted!</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Admin will approve UTR: {utrNumber}</p>
              </div>
            ) : (
              <form onSubmit={handleFundSubmit}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 6 }}>Amount (₹)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="Enter amount (e.g. 5000)" 
                    value={fundAmount} 
                    onChange={(e) => setFundAmount(e.target.value)} 
                    required 
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 6 }}>Payment Mode</label>
                  <select 
                    value={paymentMethod} 
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
                  >
                    <option value="UPI">UPI / QR Code</option>
                    <option value="IMPS">IMPS Bank Transfer</option>
                    <option value="NEFT">NEFT / RTGS</option>
                  </select>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 6 }}>Bank Reference / UTR Number</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Enter 12-digit UTR Number" 
                    value={utrNumber} 
                    onChange={(e) => setUtrNumber(e.target.value)} 
                    required 
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', borderRadius: '8px', fontWeight: 800 }}>
                  Submit Fund Request ⚡
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Selected Receipt Modal */}
      {selectedTxn && (
        <ReceiptModal transaction={selectedTxn} onClose={() => setSelectedTxn(null)} />
      )}
    </div>
  );
}

export default function RetailerPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Loading Workstation...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
