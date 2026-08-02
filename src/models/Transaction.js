import mongoose from 'mongoose';
import { getNextSequence } from './Counter';

const transactionSchema = new mongoose.Schema({
  txnId: { type: String, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    required: true,
    enum: ['recharge', 'bill_payment', 'money_transfer', 'aeps', 'pan_card', 'dth', 'other'],
  },
  amount: { type: Number, required: true },
  commission: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['success', 'pending', 'failed', 'refunded'],
    default: 'pending',
  },
  serviceDetails: {
    operator: String,
    mobile: String,
    accountNo: String,
    planAmount: Number,
    apiTxnId: String,
    serviceName: String,
  },
  balanceBefore: { type: Number },
  balanceAfter: { type: Number },
  commissionBreakup: {
    retailer: { type: Number, default: 0 },
    distributor: { type: Number, default: 0 },
    masterDistributor: { type: Number, default: 0 },
    admin: { type: Number, default: 0 },
  },
}, {
  timestamps: true,
});

transactionSchema.pre('save', async function () {
  if (!this.txnId) {
    const seq = await getNextSequence('transaction');
    this.txnId = `TXN${String(seq).padStart(6, '0')}`;
  }
});

const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);

export default Transaction;
