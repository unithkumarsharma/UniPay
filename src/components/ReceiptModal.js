'use client';

import { useState } from 'react';
import styles from './ReceiptModal.module.css';

export default function ReceiptModal({ transaction, onClose }) {
  const [copyType, setCopyType] = useState('customer'); // 'customer' | 'merchant' | 'both'

  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const getStatusColor = (status) => {
    const s = String(status).toLowerCase();
    if (s === 'success' || s === 'approved' || s === 'active') return '#059669';
    if (s === 'pending' || s === 'in_progress') return '#D97706';
    return '#DC2626';
  };

  const statusColor = getStatusColor(transaction.status);

  // Helper to convert number to words for INR
  const amountToWords = (amount) => {
    const num = Math.floor(Number(amount) || 0);
    if (num === 0) return 'Zero Rupees Only';
    const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    if (num < 20) return `Rupees ${units[num]} Only`;
    if (num < 100) return `Rupees ${tens[Math.floor(num / 10)]} ${units[num % 10]}`.trim() + ' Only';
    if (num < 1000) return `Rupees ${units[Math.floor(num / 100)]} Hundred ${amountToWords(num % 100).replace('Rupees ', '')}`;
    if (num < 100000) return `Rupees ${amountToWords(Math.floor(num / 1000)).replace('Rupees ', '').replace(' Only', '')} Thousand ${amountToWords(num % 1000).replace('Rupees ', '')}`;
    return `Rupees ${num} Only`;
  };

  const renderReceiptBlock = (type) => {
    const isCustomer = type === 'customer';
    return (
      <div className={styles.receiptBlock}>
        {/* Top Header Row */}
        <div className={styles.receiptTop}>
          <div className={styles.brandBox}>
            <img src="/logo.png" alt="UniPay" className={styles.logoImg} onError={(e) => { e.target.style.display = 'none'; }} />
            <div className={styles.brandText}>
              <span className={styles.brandTitle}>UniPay</span>
              <span className={styles.brandSubtitle}>Multi-Service Payment Network</span>
            </div>
          </div>

          <div className={styles.invoiceMeta}>
            <div className={`${styles.copyTypeBadge} ${isCustomer ? styles.badgeCustomer : styles.badgeMerchant}`}>
              {isCustomer ? '👤 CUSTOMER COPY (Grahak Prati)' : '🏪 MERCHANT COPY (Dukandar Prati)'}
            </div>
            <div className={styles.metaNo}>Txn No: <strong>{transaction.id || 'TXN-90283'}</strong></div>
            <div className={styles.metaDate}>Date: {transaction.date || transaction.time || new Date().toLocaleDateString('en-IN')}</div>
            <div className={styles.gstNo}>GSTIN: 07AAACU1234F1Z9</div>
          </div>
        </div>

        <div className={styles.divider} />

        {/* Status Seal Banner */}
        <div className={styles.statusBanner} style={{ borderColor: statusColor, background: `${statusColor}10`, color: statusColor }}>
          <div className={styles.statusBadge} style={{ background: statusColor }}>
            {transaction.status?.toLowerCase() === 'success' || transaction.status?.toLowerCase() === 'approved' ? '✓' : '•'}
          </div>
          <div>
            <div className={styles.statusText}>TRANSACTION {transaction.status?.toUpperCase() || 'SUCCESSFUL'}</div>
            <div className={styles.statusDesc}>Payment verified and processed securely by UniPay Payment Gateway.</div>
          </div>
        </div>

        {/* Details Grid */}
        <div className={styles.detailsGrid}>
          {/* Txn Details */}
          <div className={styles.detailsBox}>
            <div className={styles.boxTitle}>Payment & Service Details</div>
            <div className={styles.rowItem}>
              <span>Txn ID:</span>
              <strong>{transaction.id || 'TXN001'}</strong>
            </div>
            <div className={styles.rowItem}>
              <span>Service Type:</span>
              <strong>{transaction.type || transaction.service || 'Service Payment'}</strong>
            </div>
            <div className={styles.rowItem}>
              <span>Consumer / Account:</span>
              <strong>{transaction.user?.split(' ')[0] || transaction.consumerNo || '+91 98765 43210'}</strong>
            </div>
            <div className={styles.rowItem}>
              <span>Operator Ref / UTR:</span>
              <strong>{transaction.utr || 'UTR' + Math.floor(100000000000 + Math.random() * 900000000000)}</strong>
            </div>
          </div>

          {/* Merchant & Outlet Details */}
          <div className={styles.detailsBox}>
            <div className={styles.boxTitle}>{isCustomer ? 'Served By Outlet' : 'Merchant Outlet Details'}</div>
            <div className={styles.rowItem}>
              <span>Outlet Name:</span>
              <strong>{transaction.shopName || 'Suresh Mobile Point'}</strong>
            </div>
            <div className={styles.rowItem}>
              <span>Agent Name:</span>
              <strong>{transaction.user || 'Suresh Yadav (RTL001)'}</strong>
            </div>
            <div className={styles.rowItem}>
              <span>Location:</span>
              <strong>{transaction.city || 'Noida, Uttar Pradesh'}</strong>
            </div>
            <div className={styles.rowItem}>
              <span>Terminal ID:</span>
              <strong>UNIPAY-MER-9942</strong>
            </div>
          </div>
        </div>

        {/* Financial Breakdown Table */}
        <table className={styles.amountTable}>
          <thead>
            <tr>
              <th>Description</th>
              <th style={{ textAlign: 'right' }}>Amount (INR)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Base Service Charges ({transaction.type || 'Transaction'})</td>
              <td style={{ textAlign: 'right' }}>₹{Number(transaction.amount || 0).toFixed(2)}</td>
            </tr>
            <tr>
              <td>Convenience Fee & Taxes</td>
              <td style={{ textAlign: 'right' }}>₹0.00</td>
            </tr>
            <tr className={styles.totalRow}>
              <td>TOTAL AMOUNT PAID</td>
              <td style={{ textAlign: 'right' }}>₹{Number(transaction.amount || 0).toLocaleString('en-IN')}.00</td>
            </tr>
          </tbody>
        </table>

        {/* Amount In Words & Commission (Only on Merchant Copy) */}
        <div className={styles.wordsBox}>
          <div>
            <span style={{ color: '#64748B', fontSize: '0.78rem' }}>Amount in Words:</span>
            <div style={{ fontWeight: 700, color: '#1E293B' }}>{amountToWords(transaction.amount || 0)}</div>
          </div>

          {/* SHOW COMMISSION ONLY ON MERCHANT COPY */}
          {!isCustomer && transaction.commission !== undefined && (
            <div className={styles.commissionBadge}>
              Merchant Commission Earned: <strong>+₹{transaction.commission}</strong>
            </div>
          )}
        </div>

        {/* Footer Disclaimer & Verification QR */}
        <div className={styles.receiptFooter}>
          <div className={styles.footerLeft}>
            <div className={styles.supportLine}>
              📞 Helpline: 1800-123-UNIPAY (864729) | ✉️ support@unipay.in | 🌐 www.unipay.in
            </div>
            <div className={styles.disclaimer}>
              {isCustomer 
                ? 'Note: Thank you for transacting with us. This is your official payment receipt slip.' 
                : 'Note: Merchant copy for store accounts & audit reconciliation. Do not distribute to customer.'}
            </div>
          </div>

          {/* Verification Stamp / Seal */}
          <div className={styles.stampSeal}>
            <div className={styles.stampInner}>
              <span>UNIPAY</span>
              <strong>{isCustomer ? 'PAID' : 'AUDITED'}</strong>
              <small>{isCustomer ? 'CUSTOMER SLIP' : 'STORE COPY'}</small>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleWhatsAppShare = () => {
    const text = `*UniPay Payment Receipt*\n*Txn ID:* ${transaction.id || 'TXN-90283'}\n*Service:* ${transaction.type || 'Service Payment'}\n*Amount:* ₹${Number(transaction.amount || 0).toLocaleString('en-IN')}\n*Status:* SUCCESSFUL ✅\n*UTR / Ref:* ${transaction.utr || 'UTR' + Math.floor(100000000000 + Math.random() * 900000000000)}\n*Date:* ${transaction.date || transaction.time || new Date().toLocaleDateString('en-IN')}\n\n_Thank you for choosing UniPay Multi-Service Network!_`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Top Control Bar */}
        <div className={styles.actionHeader}>
          {/* Selector Tabs */}
          <div className={styles.copyTabs}>
            <button 
              className={`${styles.tabBtn} ${copyType === 'customer' ? styles.tabActive : ''}`}
              onClick={() => setCopyType('customer')}
            >
              👤 Customer Copy
            </button>
            <button 
              className={`${styles.tabBtn} ${copyType === 'merchant' ? styles.tabActive : ''}`}
              onClick={() => setCopyType('merchant')}
            >
              🏪 Merchant Copy
            </button>
            <button 
              className={`${styles.tabBtn} ${copyType === 'both' ? styles.tabActive : ''}`}
              onClick={() => setCopyType('both')}
            >
              ✂️ Dual Copy (Both)
            </button>
          </div>

          <div className={styles.actionBtns}>
            <button 
              className={styles.printBtn} 
              onClick={handleWhatsAppShare}
              style={{ background: '#25D366', borderColor: '#25D366', color: '#FFFFFF' }}
              title="Share receipt instantly to customer WhatsApp"
            >
              📱 Share WhatsApp
            </button>
            <button className={styles.printBtn} onClick={handlePrint}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              Print Receipt
            </button>
            <button className={styles.closeBtn} onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className={`printable-receipt ${styles.receiptCard}`}>
          {copyType === 'customer' && renderReceiptBlock('customer')}
          {copyType === 'merchant' && renderReceiptBlock('merchant')}
          {copyType === 'both' && (
            <>
              {renderReceiptBlock('customer')}
              
              {/* Dotted Perforation Line for Cutting */}
              <div className={styles.tearLine}>
                <span>✂️ TEAR / CUT ALONG DOTTED LINE ✂️</span>
              </div>

              {renderReceiptBlock('merchant')}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
