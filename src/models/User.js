import mongoose from 'mongoose';
import { getNextSequence } from './Counter';

const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'accountant', 'master_distributor', 'distributor', 'retailer'],
  },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  walletBalance: { type: Number, default: 0, min: 0 },
  status: { type: String, enum: ['active', 'blocked'], default: 'active' },
  shopName: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  address: { type: String, trim: true },
  bankDetails: {
    accountNo: { type: String },
    ifsc: { type: String },
    bankName: { type: String },
    accountHolder: { type: String },
  },
}, {
  timestamps: true,
});

// Generate userId before saving
userSchema.pre('save', async function () {
  if (!this.userId) {
    const prefixes = {
      admin: 'ADM',
      accountant: 'ACC',
      master_distributor: 'MD',
      distributor: 'DST',
      retailer: 'RTL',
    };
    const prefix = prefixes[this.role] || 'USR';
    const seq = await getNextSequence(`user_${this.role}`);
    this.userId = `${prefix}${String(seq).padStart(3, '0')}`;
  }
});

// Don't return password in JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
