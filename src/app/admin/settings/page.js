'use client';

export default function AdminSettingsPage() {
  return (
    <>
      <div className="page-header">
        <h1>Settings</h1>
        <p>Configure platform settings and preferences</p>
      </div>

      <div style={{ display: 'grid', gap: 20, maxWidth: 700 }}>
        {/* Company Info */}
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>
            🏢 Company Information
          </h3>
          <div className="form-group">
            <label className="form-label">Company Name</label>
            <input type="text" className="form-input" defaultValue="UniPay" />
          </div>
          <div className="form-group">
            <label className="form-label">Support Email</label>
            <input type="email" className="form-input" defaultValue="support@unipay.in" />
          </div>
          <div className="form-group">
            <label className="form-label">Support Phone</label>
            <input type="tel" className="form-input" defaultValue="+91 9876543210" />
          </div>
          <button className="btn btn-primary btn-sm">Save Changes</button>
        </div>

        {/* Wallet Settings */}
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>
            💰 Wallet Settings
          </h3>
          <div className="form-group">
            <label className="form-label">Minimum Balance Alert (₹)</label>
            <input type="number" className="form-input" defaultValue="500" />
          </div>
          <div className="form-group">
            <label className="form-label">Maximum Single Transfer (₹)</label>
            <input type="number" className="form-input" defaultValue="100000" />
          </div>
          <div className="form-group">
            <label className="form-label">Daily Transaction Limit (₹)</label>
            <input type="number" className="form-input" defaultValue="500000" />
          </div>
          <button className="btn btn-primary btn-sm">Save Changes</button>
        </div>

        {/* API Settings */}
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>
            ⚡ API Configuration
          </h3>
          <div className="form-group">
            <label className="form-label">Primary API Provider</label>
            <select className="form-select">
              <option>Paysprint</option>
              <option>Eko</option>
              <option>Roundpay</option>
              <option>Instantpay</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">API Key</label>
            <input type="password" className="form-input" defaultValue="sk_live_xxxxx" />
          </div>
          <div className="form-group">
            <label className="form-label">Callback URL</label>
            <input type="url" className="form-input" defaultValue="https://api.unipay.in/callback" />
          </div>
          <button className="btn btn-primary btn-sm">Save Changes</button>
        </div>
      </div>
    </>
  );
}
