import mongoose from 'mongoose';
import { getNextSequence } from './Counter';

const fundRequestSchema = new mongoose.Schema({
  requestId: { type: String, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true, min: 1 },
  paymentMethod: {
    type: String,
    enum: ['bank_transfer', 'upi', 'cash'],
    required: true,
  },
  utrNumber: { type: String, trim: true },
  remarks: { type: String, trim: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  processedAt: { type: Date },
  rejectionReason: { type: String },
}, {
  timestamps: true,
});

fundRequestSchema.pre('save', async function () {
  if (!this.requestId) {
    const seq = await getNextSequence('fund_request');
    this.requestId = `FR${String(seq).padStart(6, '0')}`;
  }
});

const FundRequest = mongoose.models.FundRequest || mongoose.model('FundRequest', fundRequestSchema);

export default FundRequest;
