'use client';
import { useState, useEffect } from 'react';
import DataTable from '@/components/DataTable';
import Modal from '@/components/Modal';

const columns = [
  { key: 'userId', label: 'ID', render: (r) => <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)' }}>{r.userId || r.user_id || r.id}</span> },
  { key: 'name', label: 'Name', render: (r) => <strong>{r.name}</strong> },
  { key: 'shopName', label: 'Shop', render: (r) => r.shopName || r.shop_name || 'Retail Counter' },
  { key: 'phone', label: 'Phone' },
  { key: 'city', label: 'City', render: (r) => r.city || 'Noida' },
  { key: 'walletBalance', label: 'Balance', render: (r) => <strong style={{ color: 'var(--success)' }}>₹{Number(r.walletBalance ?? r.wallet_balance ?? 0).toLocaleString('en-IN')}</strong> },
  { key: 'status', label: 'Status', render: (r) => <span style={{ background: 'var(--success-light)', color: 'var(--success)', padding: '2px 8px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700 }}>ACTIVE</span> },
  {
    key: 'actions', label: 'Actions',
    render: (r) => (
      <div className="flex gap-sm">
        <button className="btn btn-sm btn-primary" onClick={() => window.location.href = '/distributor/wallet'}>Transfer Funds</button>
      </div>
    ),
  },
];

export default function DistRetailersPage() {
  const [retailersList, setRetailersList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [shopName, setShopName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [balance, setBalance] = useState('20000');
  const [toastMsg, setToastMsg] = useState('');

  const fetchRetailers = async () => {
    try {
      const res = await fetch('/api/users?role=retailer');
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        setRetailersList(data.users);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchRetailers();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name || !phone) return;
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          shopName,
          role: 'retailer',
          city: city || 'Noida',
          initialBalance: parseFloat(balance) || 20000,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setToastMsg('Retailer account created in Supabase DB!');
        setShowModal(false);
        setName('');
        setPhone('');
        fetchRetailers();
      } else {
        setToastMsg(data.error || 'Failed to create');
      }
    } catch (e) {
      setToastMsg('Network error');
    }
  };

  return (
    <>
      {toastMsg && (
        <div style={{ position: 'fixed', top: 80, right: 24, zIndex: 9999, background: '#10B981', color: 'white', padding: '10px 18px', borderRadius: 8, fontWeight: 700 }}>
          {toastMsg}
        </div>
      )}

      <div className="page-header">
        <h1>My Retailers Network</h1>
        <p>Manage retailers under your network directly in Supabase DB</p>
      </div>

      <DataTable
        title="Retailers Roster"
        columns={columns}
        data={retailersList}
        actions={<button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ Add Retailer</button>}
      />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Retailer">
        <form onSubmit={handleCreate}>
          <div className="form-group"><label className="form-label">Full Name</label><input type="text" className="form-input" required placeholder="Enter full name" value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Shop Name</label><input type="text" className="form-input" placeholder="Enter shop name" value={shopName} onChange={(e) => setShopName(e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Mobile Number</label><input type="tel" className="form-input" required placeholder="Enter 10-digit mobile" value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
          <div className="form-group"><label className="form-label">City</label><input type="text" className="form-input" placeholder="Enter city" value={city} onChange={(e) => setCity(e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Initial Balance (₹)</label><input type="number" className="form-input" placeholder="20000" value={balance} onChange={(e) => setBalance(e.target.value)} /></div>
          <button type="submit" className="btn btn-primary w-full mt-md">Create Retailer</button>
        </form>
      </Modal>
    </>
  );
}
