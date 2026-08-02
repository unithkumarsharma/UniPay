import mongoose from 'mongoose';

const commissionSlabSchema = new mongoose.Schema({
  serviceType: { type: String, required: true, unique: true },
  retailerCommission: { type: Number, default: 0 },
  distributorMargin: { type: Number, default: 0 },
  mdMargin: { type: Number, default: 0 },
  adminProfit: { type: Number, default: 0 },
  isPercentage: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});

const CommissionSlab = mongoose.models.CommissionSlab || mongoose.model('CommissionSlab', commissionSlabSchema);

export default CommissionSlab;
