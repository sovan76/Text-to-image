import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  plan: { type: String, required: true, enum: ['Basic', 'Advanced', 'Business'] },
  amount: { type: Number, required: true, min: 0 },
  credits: { type: Number, required: true, min: 0 },
  payment: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['created', 'paid', 'failed'],
    default: 'created',
    index: true,
  },
  razorpayOrderId: { type: String, unique: true, sparse: true },
  razorpayPaymentId: { type: String, unique: true, sparse: true },
  razorpaySignature: { type: String },
  paidAt: { type: Date },
}, {
  timestamps: true,
});

const transactionModel = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);

export default transactionModel;
