import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { payAPI } from '../services/api';
import { useWallet } from '../contexts/WalletContext';

const PayButton = ({ onBalanceUpdate }) => {
  const [amount, setAmount] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const [quickAmounts, setQuickAmounts] = useState([100, 500, 1000, 2000, 5000]);
  const [minAmount, setMinAmount] = useState(100);
  const { refreshBalance } = useWallet();

  useEffect(() => {
    checkPaymentSettings();
  }, []);

  const checkPaymentSettings = async () => {
    try {
      const response = await payAPI.getBalance();
      const data = response.data;
      if (data?.settings?.topup_amounts) {
        setQuickAmounts(data.settings.topup_amounts);
      }
      if (data?.settings?.min_topup_amount) {
        setMinAmount(data.settings.min_topup_amount);
      }
    } catch (error) {
      console.error('Failed to fetch payment settings:', error);
    }
  };

  // ✅ Load & initialise Cashfree SDK (v3)
  const loadCashfreeSDK = async () => {
    if (!window.Cashfree) {
      // wait until the script loads
      await new Promise((resolve, reject) => {
        const interval = setInterval(() => {
          if (window.Cashfree) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
        // optionally add timeout
        setTimeout(() => {
          clearInterval(interval);
          reject(new Error('Cashfree SDK script load timeout'));
        }, 10000);
      });
    }

    // Initialise the SDK instance (sandbox for testing)
    const cashfree = window.Cashfree({ mode: 'production' }); // switch to 'production' when live
    console.log('✅ Cashfree SDK initialised:', cashfree);
    return cashfree;
  };

  const handleTopup = async (e) => {
    e.preventDefault();
    const topupAmount = parseFloat(amount);
    if (isNaN(topupAmount) || topupAmount < minAmount) {
      toast.error(`Please enter a valid amount (minimum ₹${minAmount}).`);
      return;
    }

    setIsPaying(true);

    try {
      // Use Cashfree for all payments
      const response = await payAPI.initiateTopup({ amount: topupAmount });
      if (response.data && response.data.paymentSessionId) {
        const cashfree = await loadCashfreeSDK();

        const checkoutOptions = {
          paymentSessionId: response.data.paymentSessionId,
          redirectTarget: '_self', // or '_blank', depending on flow
          returnUrl: `https://rtoagent.netlify.app/payment-status-check?order_id=${response.data.orderId}`,
          // you can add more options if required
        };

        cashfree
          .checkout(checkoutOptions)
          .then((result) => {
            if (result.error) {
              console.error('Payment failed:', result.error);
              toast.error('Payment failed. Please try again.');
              // Redirection is now handled by PaymentStatusCheck.jsx
            } else if (result.redirect) {
              console.log('Redirecting to checkout...');
              // Flow continues via redirect
            } else {
              // Possibly immediate result (non-redirect payment mode)
              console.log('Payment result:', result);
            }
          })
          .catch((err) => {
            console.error('Checkout error:', err);
            toast.error('Payment initiation failed. Please try again.');
          });
      } else {
        throw new Error('Failed to initiate payment session.');
      }
    } catch (error) {
      console.error('Failed to add balance:', error);
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
            Amount (INR) - Minimum ₹{minAmount}
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
          {isPaying ? 'Processing...' : 'Top Up Now'}
        </button>
        <p className="text-xs text-gray-500 text-center">
          You will be redirected to the payment gateway.
        </p>
      </form>
    </div>
  );
};

export default PayButton;
