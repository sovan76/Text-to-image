import userModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import transactionModel from '../models/transactionModel.js';

// Keep pricing in one place so the client cannot choose an arbitrary amount/credit value.
export const PLANS = {
  Basic: { credits: 100, amount: 10 },
  Advanced: { credits: 500, amount: 50 },
  Business: { credits: 5000, amount: 250 },
};

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await userModel.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email, creditBalance: user.creditBalance },
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, creditBalance: user.creditBalance },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const userCredits = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select('name email creditBalance');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      creditBalance: user.creditBalance,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create a Razorpay order. Credits are NOT added here.
const paymentRazorpay = async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.user.id;
    const selectedPlan = PLANS[planId];

    if (!selectedPlan) {
      return res.status(400).json({ success: false, message: 'Invalid plan ID' });
    }

    const user = await userModel.findById(userId).select('_id name email');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const currency = process.env.CURRENCY || 'INR';
    const transaction = await transactionModel.create({
      userId,
      plan: planId,
      amount: selectedPlan.amount,
      credits: selectedPlan.credits,
      payment: false,
      status: 'created',
    });

    try {
      const order = await razorpayInstance.orders.create({
        amount: Math.round(selectedPlan.amount * 100),
        currency,
        receipt: `receipt_${transaction._id}`,
        notes: {
          transactionId: transaction._id.toString(),
          userId: userId.toString(),
          planId,
        },
      });

      transaction.razorpayOrderId = order.id;
      await transaction.save();

      return res.status(200).json({
        success: true,
        message: 'Razorpay order created successfully',
        order: {
          id: order.id,
          amount: order.amount,
          currency: order.currency,
        },
        transactionId: transaction._id,
        plan: { id: planId, credits: selectedPlan.credits, amount: selectedPlan.amount },
      });
    } catch (error) {
      transaction.status = 'failed';
      await transaction.save();
      throw error;
    }
  } catch (error) {
    console.error('Create Payment Error:', error);
    res.status(500).json({ success: false, message: 'Unable to create payment order' });
  }
};

// Verify Razorpay's signature and atomically credit the user's account.
const verifyPayment = async (req, res) => {
  try {
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature, transactionId } = req.body;
    const userId = req.user.id;

    if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature || !transactionId) {
      return res.status(400).json({ success: false, message: 'Incomplete payment verification data' });
    }

    const transaction = await transactionModel.findOne({
      _id: transactionId,
      userId,
      razorpayOrderId,
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    // Idempotency: refreshing/replaying the success callback must never add credits twice.
    if (transaction.status === 'paid' || transaction.payment === true) {
      const user = await userModel.findById(userId).select('creditBalance');
      return res.json({
        success: true,
        message: 'Payment was already verified',
        creditBalance: user.creditBalance,
      });
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
    const receivedBuffer = Buffer.from(razorpaySignature, 'utf8');
    const signaturesMatch =
      expectedBuffer.length === receivedBuffer.length &&
      crypto.timingSafeEqual(expectedBuffer, receivedBuffer);

    if (!signaturesMatch) {
      transaction.status = 'failed';
      await transaction.save();
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    const updatedUser = await userModel.findOneAndUpdate(
      { _id: userId },
      { $inc: { creditBalance: transaction.credits } },
      { new: true }
    ).select('creditBalance');

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    transaction.payment = true;
    transaction.status = 'paid';
    transaction.razorpayPaymentId = razorpayPaymentId;
    transaction.razorpaySignature = razorpaySignature;
    transaction.paidAt = new Date();
    await transaction.save();

    return res.json({
      success: true,
      message: 'Payment verified and credits added successfully',
      creditBalance: updatedUser.creditBalance,
    });
  } catch (error) {
    console.error('Verify Payment Error:', error);
    res.status(500).json({ success: false, message: 'Unable to verify payment' });
  }
};

export {
  registerUser,
  loginUser,
  userCredits,
  paymentRazorpay,
  verifyPayment,
};
