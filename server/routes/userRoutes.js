import express from 'express';
import userAuth from '../middlewares/auth.js';
import {
  registerUser,
  loginUser,
  userCredits,
  paymentRazorpay,
  verifyPayment,
} from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/credits', userAuth, userCredits);
userRouter.post('/pay-razor', userAuth, paymentRazorpay);
userRouter.post('/verify-payment', userAuth, verifyPayment);

export default userRouter;
