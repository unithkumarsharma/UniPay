// ===== ADMIN MOCK DATA =====
export const adminStats = {
  totalUsers: 6,
  todayTransactions: 0,
  todayRevenue: 0,
  activeServices: 18,
  totalMDs: 1,
  totalDistributors: 1,
  totalRetailers: 2,
  pendingComplaints: 0,
};

// ===== RECENT TRANSACTIONS =====
export const recentTransactions = [];

// ===== USERS LIST =====
export const masterDistributors = [
  { id: 'MD001', name: 'Ajay', phone: '9876543212', city: 'Delhi', balance: 100000, status: 'active', distributors: 1, joined: '2024-01-15' },
];

export const distributors = [
  { id: 'DST001', name: 'Ram', phone: '9876543213', city: 'Noida', balance: 50000, status: 'active', retailers: 2, parentMD: 'MD001', joined: '2024-02-01' },
];

export const retailers = [
  { id: 'RTL001', name: 'Rohan', phone: '9876543214', shopName: 'Rohan Mobile Point', city: 'Noida', balance: 20000, status: 'active', parentDist: 'DST001', joined: '2024-03-01' },
  { id: 'RTL002', name: 'Mohan', phone: '9876543215', shopName: 'Mohan Digital Seva', city: 'Noida', balance: 20000, status: 'active', parentDist: 'DST001', joined: '2024-03-10' },
];

// ===== FUND REQUESTS =====
export const fundRequests = [];

// ===== COMPLAINTS =====
export const complaints = [];

// ===== LEDGER ENTRIES (for Accountant) =====
export const ledgerEntries = [];

// ===== COMMISSION SLABS =====
export const commissionSlabs = [
  { service: 'Mobile Prepaid', adminProfit: '₹0.50', mdMargin: '₹0.50', distMargin: '₹0.50', retailerComm: '₹1.50', total: '₹3.00' },
  { service: 'DTH Recharge', adminProfit: '₹1.00', mdMargin: '₹0.75', distMargin: '₹0.75', retailerComm: '₹2.50', total: '₹5.00' },
  { service: 'Electricity Bill', adminProfit: '₹0.30', mdMargin: '₹0.20', distMargin: '₹0.20', retailerComm: '₹0.30', total: '₹1.00 (per ₹100)' },
  { service: 'Money Transfer', adminProfit: '₹2.00', mdMargin: '₹1.50', distMargin: '₹1.50', retailerComm: '₹5.00', total: '₹10.00 (per ₹1000)' },
  { service: 'AEPS Withdrawal', adminProfit: '₹1.00', mdMargin: '₹1.00', distMargin: '₹1.00', retailerComm: '₹3.00', total: '₹6.00 (per txn)' },
  { service: 'PAN Card', adminProfit: '₹5.00', mdMargin: '₹3.00', distMargin: '₹3.00', retailerComm: '₹15.00', total: '₹26.00' },
];
