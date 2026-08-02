export const serviceCategories = [
  {
    name: 'Recharge',
    services: [
      { id: 'mobile_prepaid', name: 'Mobile Prepaid', icon: '📱', color: 'blue' },
      { id: 'mobile_postpaid', name: 'Mobile Postpaid', icon: '📲', color: 'blue' },
      { id: 'dth', name: 'DTH Recharge', icon: '📡', color: 'purple' },
      { id: 'data_card', name: 'Data Card', icon: '💻', color: 'green' },
      { id: 'google_play', name: 'Google Play', icon: '🎮', color: 'green' },
    ],
  },
  {
    name: 'Bill Payment',
    services: [
      { id: 'electricity', name: 'Electricity', icon: '💡', color: 'orange' },
      { id: 'gas', name: 'Gas Bill', icon: '🔥', color: 'red' },
      { id: 'water', name: 'Water Bill', icon: '💧', color: 'blue' },
      { id: 'broadband', name: 'Broadband', icon: '🌐', color: 'purple' },
      { id: 'landline', name: 'Landline', icon: '☎️', color: 'green' },
      { id: 'insurance', name: 'Insurance', icon: '🛡️', color: 'blue' },
      { id: 'loan_emi', name: 'Loan EMI', icon: '🏦', color: 'red' },
      { id: 'fastag', name: 'Fastag', icon: '🚗', color: 'green' },
      { id: 'credit_card', name: 'Credit Card', icon: '💳', color: 'purple' },
      { id: 'municipal_tax', name: 'Municipal Tax', icon: '🏛️', color: 'orange' },
      { id: 'education', name: 'Education Fee', icon: '🎓', color: 'blue' },
    ],
  },
  {
    name: 'Money Transfer',
    services: [
      { id: 'dmt', name: 'Bank Transfer', icon: '🏧', color: 'green' },
      { id: 'upi', name: 'UPI Transfer', icon: '📲', color: 'purple' },
    ],
  },
  {
    name: 'Banking',
    services: [
      { id: 'aeps', name: 'AEPS', icon: '🔐', color: 'blue' },
      { id: 'micro_atm', name: 'Micro ATM', icon: '🏧', color: 'green' },
      { id: 'account_opening', name: 'Account Opening', icon: '📝', color: 'purple' },
    ],
  },
  {
    name: 'Travel',
    services: [
      { id: 'bus', name: 'Bus Booking', icon: '🚌', color: 'orange' },
      { id: 'flight', name: 'Flight Booking', icon: '✈️', color: 'blue' },
      { id: 'train', name: 'Train Booking', icon: '🚂', color: 'red' },
      { id: 'hotel', name: 'Hotel Booking', icon: '🏨', color: 'purple' },
    ],
  },
  {
    name: 'Other Services',
    services: [
      { id: 'pan_card', name: 'PAN Card', icon: '🪪', color: 'blue' },
      { id: 'insurance_new', name: 'New Insurance', icon: '🛡️', color: 'green' },
      { id: 'e_shram', name: 'e-Shram Card', icon: '👷', color: 'orange' },
      { id: 'ayushman', name: 'Ayushman Card', icon: '🏥', color: 'red' },
    ],
  },
];

export const allServices = serviceCategories.flatMap(cat => cat.services);
