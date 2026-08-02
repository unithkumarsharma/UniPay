import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  serviceId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  icon: { type: String, default: '⚡' },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});

const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);

export default Service;
