import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { payAPI } from '../services/api';
import { useWallet } from '../contexts/WalletContext';

const PayButton = ({ onBalanceUpdate }) => {
  const [amount, setAmount] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const [paymentEnabled, setPaymentEnabled] = useState(false);
  const [quickAmounts, setQuickAmounts] = useState([100, 500, 1000, 2000, 5000]);
  const { refreshBalance } = useWallet();

  // 🔹 Detect environment
  const isProduction = window.location.hostname !== 'localhost';
  const cashfreeMode = isProduction ? 'production' : 'sandbox';

  useEffect(() => {
    checkPaymentSettings();
    ensureSDKInjected();
  }, []);

  const checkPaymentSettings = async () => {
    try {
      const response = await payAPI.getBalance();
      const data = response.data;
      setPaymentEnabled(data?.paymentEnabled || false);
      if (data?.settings?.topup_amounts) {
        setQuickAmounts(data.settings.topup_amounts);
      }
    } catch (error) {
      console.error('Failed to fetch payment settings:', error);
    }
  };

  // ✅ Inject Cashfree SDK if missing
  const ensureSDKInjected = () => {
    if (document.querySelector('script[src*="cashfree"]')) return;
    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/ui/2.0.0/cashfree.prod.js';
    script.async = true;
    script.defer = true;
    script.onload = () => console.log('✅ Cashfree SDK script loaded');
    script.onerror = (err) => console.error('❌ Failed to load Cashfree SDK.', err);
    document.body.appendChild(script);
  };

  // ✅ Wait until Cashfree SDK is ready
  const waitForCashfree = async (maxTries = 40, delay = 500) => {
    for (let i = 1; i <= maxTries; i++) {
      if (window.Cashfree) return window.Cashfree;
      await new Promise((res) => setTimeout(res, delay));
    }
    throw new Error('⚠️ Cashfree SDK failed to load. Please refresh.');
  };

  const handleTopup = async (e) => {
    e.preventDefault();
    const topupAmount = parseFloat(amount);
    if (isNaN(topupAmount) || topupAmount < 1) {
      toast.error('Please enter a valid amount (minimum ₹1.00).');
      return;
    }

    setIsPaying(true);
    try {
      if (paymentEnabled) {
        // 🔹 Step 1: Create payment session from backend
        const response = await payAPI.initiateTopup({ amount: topupAmount });

        if (response.data && response.data.paymentSessionId) {
          const Cashfree = await waitForCashfree();
          if (Cashfree && typeof Cashfree.checkout === 'function') {
            const checkoutOptions = {
              paymentSessionId: response.data.paymentSessionId,
              redirectTarget: '_modal',
            };

            console.log(`🚀 Launching Cashfree Checkout in ${cashfreeMode} mode`);
            Cashfree.checkout(checkoutOptions, { mode: cashfreeMode }).then((result) => {
              if (result.error) {
                console.error('❌ Payment failed:', result.error);
                toast.error('Payment failed. Please try again.');
                window.location.href = '/payment-failed';
              } else {
                console.log('✅ Payment successful:', result);
                toast.success('Payment successful!');
                window.location.href = `/payment-success?order_id=${response.data.orderId}`;
              }
            });
          } else {
            throw new Error('Cashfree SDK not initialized properly.');
          }
        } else {
          throw new Error('Failed to initiate payment session.');
        }
      } else {
        // 💰 Direct wallet top-up without payment gateway
        const response = await payAPI.addBalance({ amount: topupAmount });
        if (response.success) {
          toast.success(response.message || `₹${topupAmount} added successfully!`);
          setAmount('');
          if (onBalanceUpdate) onBalanceUpdate();
          refreshBalance();
        } else {
          throw new Error(response.message || 'Failed to add balance');
        }
      }
    } catch (error) {
      console.error('❌ Failed to add balance:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to add balance. Please try again.');
    } finally {
      setIsPaying(false);
    }
  };

  const handleQuickAmount = (quickAmount) => {
    setAmount(quickAmount.toString());
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Credits</h3>

      {/* Quick Amount Buttons */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Quick amounts:</p>
        <div className="flex flex-wrap gap-2">
          {quickAmounts.map((quickAmount) => (
            <button
              key={quickAmount}
              type="button"
              onClick={() => handleQuickAmount(quickAmount)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              ₹{quickAmount}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleTopup} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount (INR)
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter amount"
            min="1"
            step="any"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isPaying}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
        >
          {isPaying ? 'Processing...' : paymentEnabled ? 'Top Up Now' : 'Add Credits'}
        </button>
        <p className="text-xs text-gray-500 text-center">
          {paymentEnabled
            ? 'You will be redirected to the payment gateway.'
            : 'Minimum top-up amount: ₹1.00'}
        </p>
      </form>
    </div>
  );
};

export default PayButton;
