import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema({
  referralCode: {
    type: String,
    unique: true,
    required: true,
  },
  referrer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceProvider',
    required: true,
  },
  referred: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceProvider',
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'expired'],
    default: 'pending'
  },
  commission: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Referral = mongoose.models.Referral || mongoose.model('Referral', referralSchema);
export default Referral;
