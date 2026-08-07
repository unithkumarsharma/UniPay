'use client';
import { useState, useEffect } from 'react';
import DataTable from '@/components/DataTable';
import Modal from '@/components/Modal';

const columns = [
  { key: 'userId', label: 'ID', render: (d) => <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)' }}>{d.userId || d.user_id || d.id}</span> },
  { key: 'name', label: 'Name', render: (d) => <strong>{d.name}</strong> },
  { key: 'phone', label: 'Phone' },
  { key: 'city', label: 'City', render: (d) => d.city || 'Delhi' },
  { key: 'walletBalance', label: 'Balance', render: (d) => <strong style={{ color: 'var(--success)' }}>₹{Number(d.walletBalance ?? d.wallet_balance ?? 0).toLocaleString('en-IN')}</strong> },
  { key: 'status', label: 'Status', render: (d) => <span style={{ background: 'var(--success-light)', color: 'var(--success)', padding: '2px 8px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700 }}>ACTIVE</span> },
  {
    key: 'actions', label: 'Actions',
    render: (d) => (
      <div className="flex gap-sm">
        <button className="btn btn-sm btn-primary" onClick={() => window.location.href = '/master-distributor/wallet'}>Transfer Funds</button>
      </div>
    ),
  },
];

export default function MDDistributorsPage() {
  const [distributorsList, setDistributorsList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [balance, setBalance] = useState('50000');
  const [toastMsg, setToastMsg] = useState('');

  const fetchDistributors = async () => {
    try {
      const res = await fetch('/api/users?role=distributor');
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        setDistributorsList(data.users);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchDistributors();
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
          role: 'distributor',
          city: city || 'Noida',
          initialBalance: parseFloat(balance) || 50000,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setToastMsg('Distributor created successfully in Supabase DB!');
        setShowModal(false);
        setName('');
        setPhone('');
        fetchDistributors();
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
        <h1>My Distributors Network</h1>
        <p>Real-time distributor roster from Supabase Database</p>
      </div>

      <DataTable
        title="Distributors Roster"
        columns={columns}
        data={distributorsList}
        actions={<button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ Add Distributor</button>}
      />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Distributor">
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-input" required placeholder="Enter full name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Mobile Number</label>
            <input type="tel" className="form-input" required placeholder="Enter 10-digit mobile" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">City</label>
            <input type="text" className="form-input" placeholder="Enter city" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Initial Balance (₹)</label>
            <input type="number" className="form-input" placeholder="50000" value={balance} onChange={(e) => setBalance(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary w-full mt-md">Create Distributor</button>
        </form>
      </Modal>
    </>
  );
}
