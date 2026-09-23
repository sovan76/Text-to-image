import React, { useContext, useEffect, useState } from 'react';
import { assets, plans } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import { motion } from 'motion/react';
import axios from 'axios';

const BuyCredit = () => {
  const { user, backendUrl, setIsLoginOpen, token, loadCreditsData } = useContext(AppContext);
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [paymentError, setPaymentError] = useState('');

  useEffect(() => {
    // Razorpay Checkout is loaded only when the pricing page is mounted.
    if (window.Razorpay) return;
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const paymentRazorpay = async (plan) => {
    if (!user) {
      setIsLoginOpen(true);
      return;
    }

    setPaymentError('');
    setLoadingPlan(plan.id);

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/pay-razor`,
        { planId: plan.id },
        { headers: { token } }
      );

      if (!data.success) throw new Error(data.message || 'Payment initiation failed');
      if (!window.Razorpay) throw new Error('Payment gateway is still loading. Please try again.');

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'TextToImage',
        description: `Purchase ${plan.credits} credits`,
        order_id: data.order.id,
        handler: async (response) => {
          try {
            const verifyResponse = await axios.post(
              `${backendUrl}/api/user/verify-payment`,
              {
                transactionId: data.transactionId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              },
              { headers: { token } }
            );

            if (!verifyResponse.data.success) {
              throw new Error(verifyResponse.data.message || 'Payment verification failed');
            }

            await loadCreditsData();
            alert('Payment successful! Credits have been added to your account.');
          } catch (error) {
            console.error('Payment Verification Error:', error);
            setPaymentError(error.response?.data?.message || error.message || 'Payment verification failed.');
          } finally {
            setLoadingPlan(null);
          }
        },
        modal: {
          ondismiss: () => setLoadingPlan(null),
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: { color: '#000000' },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', (response) => {
        console.error('Razorpay Payment Failed:', response.error);
        setPaymentError(response.error?.description || 'Payment failed. Please try again.');
        setLoadingPlan(null);
      });
      razorpay.open();
    } catch (error) {
      console.error('Payment Error:', error);
      setPaymentError(error.response?.data?.message || error.message || 'Unable to start payment.');
      setLoadingPlan(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="min-h-[80vh] flex flex-col items-center justify-center py-10"
    >
      <div className="px-6 py-2 rounded-full bg-white/60 backdrop-blur-lg border border-white/40 shadow-md text-sm font-medium text-gray-700">
        OUR PLANS
      </div>

      <h1 className="mt-6 text-4xl sm:text-5xl font-bold text-gray-900 text-center">
        Choose the plan
      </h1>

      {paymentError && (
        <div className="mt-6 w-full max-w-2xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 text-center">
          {paymentError}
        </div>
      )}

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="group bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-lg shadow-black/5 hover:-translate-y-2 hover:shadow-2xl transition-all duration-500"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-300/30">
              <img src={assets.lock_icon} alt="plan" className="w-7" />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-gray-900">{plan.name}</h2>
            <p className="mt-2 text-gray-500 leading-relaxed">{plan.desc}</p>

            <div className="mt-8 flex items-end gap-2">
              <h1 className="text-5xl font-bold text-gray-900">₹{plan.price}</h1>
              <p className="text-gray-500 mb-2">/ {plan.credits} credits</p>
            </div>

            <button
              onClick={() => paymentRazorpay(plan)}
              disabled={loadingPlan !== null}
              className="mt-10 w-full py-4 rounded-2xl bg-black text-white font-semibold cursor-pointer hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300"
            >
              {loadingPlan === plan.id ? 'Processing...' : user ? 'Purchase' : 'Get Started'}
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default BuyCredit;
