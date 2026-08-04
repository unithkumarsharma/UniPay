export const serviceCategories = [
  {
    name: 'Wallet & Remittance',
    services: [
      { id: 'wallet_plus', name: 'UniPay Wallet Plus', icon: '👛', color: 'orange', badge: 'Popular' },
      { id: 'upi_transfer', name: 'UPI Remittance', icon: '📲', color: 'purple' },
      { id: 'indo_nepal', name: 'Indo-Nepal Transfer', icon: '🇳🇵', color: 'red' },
      { id: 'cash_deposit_wallet', name: 'Cash Deposit (Wallet)', icon: '💵', color: 'green' },
      { id: 'cash_deposit_aeps', name: 'Cash Deposit (AEPS)', icon: '🖐️', color: 'blue' },
      { id: 'account_search', name: 'Account Search', icon: '🔍', color: 'purple' },
    ],
  },
  {
    name: 'Money Transfer (DMT)',
    services: [
      { id: 'dmt_1', name: 'DMT 1 (IMPS)', icon: '🏧', color: 'green', badge: 'Instant' },
      { id: 'dmt_2', name: 'DMT 2 (NEFT)', icon: '🏦', color: 'blue' },
    ],
  },
  {
    name: 'Matm & AEPS Banking',
    services: [
      { id: 'aeps_withdrawal', name: 'AEPS Withdrawal', icon: '🖐️', color: 'orange', badge: 'High Comm' },
      { id: 'micro_atm', name: 'Micro ATM (mATM)', icon: '💳', color: 'blue' },
      { id: 'aeps_settlement', name: 'AEPS Settlement', icon: '🔄', color: 'purple', badge: '24x7 Payout' },
      { id: 'upi_atm', name: 'UPI ATM', icon: '📱', color: 'green', badge: 'NEW' },
    ],
  },
  {
    name: 'Recharge & Utilities',
    services: [
      { id: 'mobile_prepaid', name: 'Mobile Prepaid', icon: '📱', color: 'blue' },
      { id: 'mobile_postpaid', name: 'Mobile Postpaid', icon: '📲', color: 'blue' },
      { id: 'dth', name: 'DTH Recharge', icon: '📡', color: 'purple' },
      { id: 'data_card', name: 'Data Card', icon: '💻', color: 'green' },
      { id: 'google_play', name: 'Google Play', icon: '🎮', color: 'green' },
    ],
  },
  {
    name: 'Bill Payment (BBPS)',
    services: [
      { id: 'electricity', name: 'Electricity', icon: '💡', color: 'orange' },
      { id: 'gas', name: 'Gas Bill', icon: '🔥', color: 'red' },
      { id: 'water', name: 'Water Bill', icon: '💧', color: 'blue' },
      { id: 'broadband', name: 'Broadband', icon: '🌐', color: 'purple' },
      { id: 'landline', name: 'Landline', icon: '☎️', color: 'green' },
      { id: 'insurance', name: 'Insurance Premium', icon: '🛡️', color: 'blue' },
      { id: 'loan_emi', name: 'Loan EMI Repayment', icon: '🏦', color: 'red' },
      { id: 'fastag', name: 'Fastag Recharge', icon: '🚗', color: 'green' },
      { id: 'credit_card', name: 'Credit Card Bill', icon: '💳', color: 'purple' },
      { id: 'municipal_tax', name: 'Municipal Tax', icon: '🏛️', color: 'orange' },
      { id: 'education', name: 'Education Fee', icon: '🎓', color: 'blue' },
    ],
  },
  {
    name: 'Travel & IRCTC',
    services: [
      { id: 'irctc_train', name: 'IRCTC Rail Booking', icon: '🚂', color: 'red', badge: 'Authorized' },
      { id: 'flight', name: 'Flight Ticket', icon: '✈️', color: 'blue' },
      { id: 'bus', name: 'Bus Booking', icon: '🚌', color: 'orange' },
      { id: 'hotel', name: 'Hotel Booking', icon: '🏨', color: 'purple' },
    ],
  },
  {
    name: 'Financial & Banking Cards',
    services: [
      { id: 'axis_cdm', name: 'Axis CDM Card', icon: '💳', color: 'blue' },
      { id: 'mutual_fund', name: 'Mutual Funds', icon: '📈', color: 'green', badge: 'NEW' },
      { id: 'pan_card', name: 'PAN Card (UTI/NSDL)', icon: '🪪', color: 'blue' },
      { id: 'whitelist_account', name: 'Whitelist Bank Account', icon: '📋', color: 'purple' },
    ],
  },
];

export const allServices = serviceCategories.flatMap(cat => cat.services);
