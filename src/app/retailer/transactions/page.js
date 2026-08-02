'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import DataTable from '@/components/DataTable';

export default function RetailerTransactionsPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTxns = async () => {
    if (!user?._id) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/transactions?userId=${user._id}`);
      const data = await res.json();
      if (data.success) {
        setTransactions(data.transactions);
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTxns();
  }, [user]);

  const columns = [
    { key: 'txnId', label: 'Txn ID' },
    { key: 'type', label: 'Service', render: (r) => (r.type || 'recharge').toUpperCase() },
    { key: 'amount', label: 'Amount', render: (r) => `₹${r.amount}` },
    { key: 'commission', label: 'Commission Earned', render: (r) => `+₹${r.commission || 0}` },
    { key: 'status', label: 'Status' },
    { key: 'createdAt', label: 'Date & Time', render: (r) => new Date(r.createdAt).toLocaleString('en-IN') },
  ];

  return (
    <>
      <div className="page-header">
        <h1>Transaction History</h1>
        <p>Real-time log of all your transactions and earned commissions from MongoDB</p>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading transactions from database...</div>
      ) : (
        <DataTable title="All Transactions" columns={columns} data={transactions} />
      )}
    </>
  );
}
