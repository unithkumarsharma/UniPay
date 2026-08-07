// ===== ADMIN MOCK DATA =====
export const adminStats = {
  totalUsers: 1247,
  todayTransactions: 3856,
  todayRevenue: 284500,
  activeServices: 18,
  totalMDs: 12,
  totalDistributors: 85,
  totalRetailers: 1150,
  pendingComplaints: 23,
};

// ===== RECENT TRANSACTIONS =====
export const recentTransactions = [
  { id: 'TXN001', type: 'Mobile Recharge', user: 'Rohan (RTL001)', amount: 299, status: 'success', time: '2 min ago', commission: 4.5 },
  { id: 'TXN002', type: 'Electricity Bill', user: 'Mohan (RTL002)', amount: 1850, status: 'success', time: '5 min ago', commission: 12 },
  { id: 'TXN003', type: 'DTH Recharge', user: 'Rohan (RTL001)', amount: 449, status: 'pending', time: '8 min ago', commission: 6 },
  { id: 'TXN004', type: 'Money Transfer', user: 'Mohan (RTL002)', amount: 5000, status: 'success', time: '12 min ago', commission: 25 },
  { id: 'TXN005', type: 'Mobile Recharge', user: 'Rohan (RTL001)', amount: 199, status: 'failed', time: '15 min ago', commission: 0 },
  { id: 'TXN006', type: 'Gas Bill', user: 'Mohan (RTL002)', amount: 956, status: 'success', time: '18 min ago', commission: 8 },
  { id: 'TXN007', type: 'Water Bill', user: 'Rohan (RTL001)', amount: 450, status: 'success', time: '22 min ago', commission: 5 },
  { id: 'TXN008', type: 'PAN Card', user: 'Mohan (RTL002)', amount: 107, status: 'success', time: '28 min ago', commission: 15 },
];

// ===== USERS LIST =====
export const masterDistributors = [
  { id: 'MD001', name: 'Ajay', phone: '9876543212', city: 'Delhi', balance: 10000, status: 'active', distributors: 8, joined: '2024-01-15' },
  { id: 'MD002', name: 'Raj Patel', phone: '9876543220', city: 'Mumbai', balance: 8000, status: 'active', distributors: 12, joined: '2024-02-20' },
  { id: 'MD003', name: 'Ajay Chauhan', phone: '9876543225', city: 'Lucknow', balance: 5000, status: 'active', distributors: 6, joined: '2024-03-10' },
  { id: 'MD004', name: 'Manish Tiwari', phone: '9876543230', city: 'Jaipur', balance: 12000, status: 'active', distributors: 15, joined: '2024-01-28' },
  { id: 'MD005', name: 'Sunil Gupta', phone: '9876543235', city: 'Bhopal', balance: 0, status: 'blocked', distributors: 3, joined: '2024-04-05' },
];

export const distributors = [
  { id: 'DST001', name: 'Ram', phone: '9876543213', city: 'Noida', balance: 5000, status: 'active', retailers: 2, parentMD: 'MD001', joined: '2024-02-01' },
  { id: 'DST002', name: 'Rohit Sharma', phone: '9876543240', city: 'Gurgaon', balance: 4500, status: 'active', retailers: 0, parentMD: 'MD001', joined: '2024-02-15' },
  { id: 'DST003', name: 'Gaurav Mishra', phone: '9876543245', city: 'Pune', balance: 6000, status: 'active', retailers: 0, parentMD: 'MD002', joined: '2024-03-01' },
  { id: 'DST004', name: 'Vikas Yadav', phone: '9876543250', city: 'Kanpur', balance: 1800, status: 'active', retailers: 0, parentMD: 'MD003', joined: '2024-03-20' },
  { id: 'DST005', name: 'Pradeep Singh', phone: '9876543255', city: 'Ahmedabad', balance: 0, status: 'blocked', retailers: 0, parentMD: 'MD002', joined: '2024-04-10' },
];

export const retailers = [
  { id: 'RTL001', name: 'Rohan', phone: '9876543214', shopName: 'Rohan Mobile Point', city: 'Noida', balance: 2000, status: 'active', parentDist: 'DST001', joined: '2024-03-01' },
  { id: 'RTL002', name: 'Mohan', phone: '9876543215', shopName: 'Mohan Digital Seva', city: 'Noida', balance: 1500, status: 'active', parentDist: 'DST001', joined: '2024-03-10' },
];

// ===== FUND REQUESTS =====
export const fundRequests = [
  { id: 'FR001', user: 'Ajay (MD001)', amount: 50000, method: 'Bank Transfer', utr: 'UTR123456789', status: 'pending', date: '2024-08-01', time: '10:30 AM' },
  { id: 'FR002', user: 'Ram (DST001)', amount: 20000, method: 'UPI', utr: 'UPI987654321', status: 'pending', date: '2024-08-01', time: '11:15 AM' },
  { id: 'FR003', user: 'Raj Patel (MD002)', amount: 100000, method: 'Bank Transfer', utr: 'UTR456789123', status: 'approved', date: '2024-07-31', time: '09:00 AM' },
  { id: 'FR004', user: 'Rohan (RTL001)', amount: 5000, method: 'UPI', utr: 'UPI321654987', status: 'rejected', date: '2024-07-31', time: '02:30 PM' },
  { id: 'FR005', user: 'Mohan (RTL002)', amount: 30000, method: 'Bank Transfer', utr: 'UTR789123456', status: 'pending', date: '2024-08-02', time: '08:45 AM' },
];

// ===== COMPLAINTS =====
export const complaints = [
  { id: 'CMP001', user: 'Rohan (RTL001)', txnId: 'TXN005', type: 'Recharge Failed', message: 'Recharge amount deducted but not received on mobile', status: 'open', date: '2024-08-01', priority: 'high' },
  { id: 'CMP002', user: 'Mohan (RTL002)', txnId: 'TXN003', type: 'DTH Pending', message: 'DTH recharge showing pending from 2 hours', status: 'in_progress', date: '2024-08-01', priority: 'medium' },
  { id: 'CMP003', user: 'Rohan (RTL001)', txnId: 'TXN010', type: 'Money Transfer Failed', message: 'Amount debited from wallet but not credited to beneficiary', status: 'open', date: '2024-08-02', priority: 'high' },
  { id: 'CMP004', user: 'Mohan (RTL002)', txnId: 'TXN008', type: 'Wrong Amount', message: 'Charged ₹299 instead of ₹199 for recharge', status: 'resolved', date: '2024-07-30', priority: 'low' },
];

// ===== LEDGER ENTRIES (for Accountant) =====
export const ledgerEntries = [
  { id: 'LED001', date: '2024-08-02', type: 'credit', description: 'Fund added to MD001 - Ajay', amount: 50000, balance: 5050000 },
  { id: 'LED002', date: '2024-08-02', type: 'debit', description: 'API recharge payment - Paysprint', amount: 28450, balance: 5021550 },
  { id: 'LED003', date: '2024-08-01', type: 'credit', description: 'Fund added to MD002 - Raj Patel', amount: 100000, balance: 5121550 },
  { id: 'LED004', date: '2024-08-01', type: 'debit', description: 'Commission payout - July 2024', amount: 45000, balance: 5076550 },
  { id: 'LED005', date: '2024-07-31', type: 'credit', description: 'Fund added to MD004 - Manish Tiwari', amount: 75000, balance: 5151550 },
  { id: 'LED006', date: '2024-07-31', type: 'debit', description: 'API bill payment - BBPS', amount: 18500, balance: 5133050 },
];

// ===== COMMISSION SLABS =====
export const commissionSlabs = [
  { service: 'Mobile Prepaid', adminProfit: '₹0.50', mdMargin: '₹0.50', distMargin: '₹0.50', retailerComm: '₹1.50', total: '₹3.00' },
  { service: 'DTH Recharge', adminProfit: '₹1.00', mdMargin: '₹0.75', distMargin: '₹0.75', retailerComm: '₹2.50', total: '₹5.00' },
  { service: 'Electricity Bill', adminProfit: '₹0.30', mdMargin: '₹0.20', distMargin: '₹0.20', retailerComm: '₹0.30', total: '₹1.00 (per ₹100)' },
  { service: 'Money Transfer', adminProfit: '₹2.00', mdMargin: '₹1.50', distMargin: '₹1.50', retailerComm: '₹5.00', total: '₹10.00 (per ₹1000)' },
  { service: 'AEPS Withdrawal', adminProfit: '₹1.00', mdMargin: '₹1.00', distMargin: '₹1.00', retailerComm: '₹3.00', total: '₹6.00 (per txn)' },
  { service: 'PAN Card', adminProfit: '₹5.00', mdMargin: '₹3.00', distMargin: '₹3.00', retailerComm: '₹15.00', total: '₹26.00' },
];
