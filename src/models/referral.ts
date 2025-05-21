import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true,
    uppercase: true
  },
  referrer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceProvider',
    required: true
  },
  referred: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceProvider',
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'registered', 'completed', 'revoked'],
    default: 'pending'
  },
  progress: {
    type: Number,
    enum: [0, 50, 100],
    default: 0
  },
  registeredUser: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceProvider' },
    name: String,
    registeredAt: Date,
    firstServiceAt: Date
  },
  createdAt: { type: Date, default: Date.now },
  revokedAt: Date,
  completedAt: Date
});

// Remove any pre-save hooks if they exist
// Add compound index for better querying
referralSchema.index({ referrer: 1, code: 1 });

const Referral = mongoose.models.Referral || mongoose.model('Referral', referralSchema);
export default Referral;
