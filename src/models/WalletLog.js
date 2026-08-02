import mongoose from 'mongoose';

const walletLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['credit', 'debit'], required: true },
  amount: { type: Number, required: true },
  balanceBefore: { type: Number, required: true },
  balanceAfter: { type: Number, required: true },
  description: { type: String, required: true },
  referenceId: { type: String },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true,
});

const WalletLog = mongoose.models.WalletLog || mongoose.model('WalletLog', walletLogSchema);

export default WalletLog;
