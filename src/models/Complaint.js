import mongoose from 'mongoose';
import { getNextSequence } from './Counter';

const complaintSchema = new mongoose.Schema({
  complaintId: { type: String, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  txnId: { type: String },
  type: { type: String, required: true },
  message: { type: String, required: true },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved'],
    default: 'open',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  resolution: { type: String },
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true,
});

complaintSchema.pre('save', async function () {
  if (!this.complaintId) {
    const seq = await getNextSequence('complaint');
    this.complaintId = `CMP${String(seq).padStart(6, '0')}`;
  }
});

const Complaint = mongoose.models.Complaint || mongoose.model('Complaint', complaintSchema);

export default Complaint;
