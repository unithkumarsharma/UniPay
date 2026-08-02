'use client';
import { useState } from 'react';
import PublicLayout from '@/components/PublicLayout';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PublicLayout>
      <div className="page-header">
        <h1>Contact Us &amp; Support</h1>
        <p>We are here 24x7 to assist merchants, distributors &amp; partners</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        {/* Contact Form */}
        <div style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>Send Us a Message</h3>

          {submitted ? (
            <div style={{ padding: '20px', background: 'var(--success-light)', color: 'var(--success)', borderRadius: 'var(--radius-md)', fontWeight: 600 }}>
              ✅ Thank you! Your message has been received. Our merchant support team will call you back within 2 hours.
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-input" placeholder="Enter full name" required />
              </div>
              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <input type="tel" className="form-input" placeholder="Enter mobile number" required />
              </div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <select className="form-select">
                  <option>Merchant Partnership Inquiry</option>
                  <option>Distributor Registration</option>
                  <option>Transaction Dispute</option>
                  <option>Wallet Load Assistance</option>
                  <option>Other Query</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea className="form-input" rows={4} placeholder="Describe your query..." style={{ resize: 'vertical' }} required></textarea>
              </div>
              <button type="submit" className="btn btn-primary w-full">Submit Query</button>
            </form>
          )}
        </div>

        {/* Info & Nodal Officer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '12px' }}>📞 Helpline Support</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Phone: <strong>+91 98765 43210</strong> (Toll Free)</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Email: <strong>support@unipay.in</strong></p>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '12px' }}>📍 Corporate Head Office</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              UniPay Technologies Private Limited<br />
              Corporate Tower, 5th Floor, Sector 62,<br />
              Noida, Uttar Pradesh - 201309, India
            </p>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '12px' }}>⚖️ Grievance Nodal Officer</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Nodal Officer: Mr. Rajesh Verma<br />
              Email: <code>nodalofficer@unipay.in</code><br />
              Response Time: Within 24 Business Hours
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
