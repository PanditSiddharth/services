import mongoose from 'mongoose';

const referralHistorySchema = new mongoose.Schema({
  referrer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceProvider',
    required: true
  },
  referralCode: {
    type: String,
    required: true
  },
  referred: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceProvider'
  },
  status: {
    type: String,
    enum: ['completed', 'revoked'],
    required: true
  },
  commission: {
    type: Number,
    default: 100
  },
  completedAt: Date,
  revokedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ReferralHistory = mongoose.models.ReferralHistory || mongoose.model('ReferralHistory', referralHistorySchema);
export default ReferralHistory;
