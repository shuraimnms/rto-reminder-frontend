import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { useWallet } from '../contexts/WalletContext';
import { useAuth } from '../contexts/AuthContext';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasVerified, setHasVerified] = useState(false); // New state to prevent multiple verifications
  const { refreshBalance, setWalletBalance } = useWallet(); // Import setWalletBalance
  const { refreshUser } = useAuth();

  useEffect(() => {
    const verifyPayment = async () => {
      const orderId = searchParams.get('order_id') || searchParams.get('orderId');

      if (hasVerified) { // Prevent re-verification if already done
        console.log('ℹ️ Payment already verified or verification in progress for this session.');
        setLoading(false);
        return;
      }

      if (!orderId) {
        console.error('❌ No order_id found in URL parameters');
        toast.error('Invalid payment URL — order ID missing.');
        setLoading(false);
        return;
      }

      console.log('🔍 Verifying payment for order:', orderId);

      // ✅ Restore user token after redirect
      const token = localStorage.getItem('authToken');

      if (!token) {
        console.warn('⚠️ No token found — user must log in again.');
        toast.error('Please log in again to verify your payment.');
        setLoading(false);
        return;
      }

      try {
        // 🔥 Verify payment with backend
        const response = await fetch(`${api}/api/v1/pay/verify-payment/${orderId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();

        if (!responseData.success) {
          throw new Error(responseData.message || 'Payment verification failed');
        }

        const data = responseData.data;
        console.log('✅ Payment verification successful:', data);

        setPaymentDetails(data);
        toast.success('Payment successful! Credits have been added to your wallet.');

        // 🔄 Update wallet balance directly and refresh user info
        setWalletBalance(data.balance_after); // Directly update wallet balance
        await refreshUser(); // Refresh user info
        console.log('🔁 Wallet and user data refreshed after payment.');
        setHasVerified(true); // Mark as verified after successful payment
      } catch (error) {
        console.error('❌ Payment verification error:', {
          message: error.message,
          stack: error.stack,
          response: error.response?.data,
          status: error.response?.status,
        });

        toast.error(
          error.response?.data?.message ||
            'Payment verification failed. Please contact support if balance not added.'
        );
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, refreshBalance, refreshUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Verifying payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Payment Successful!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your credits have been added to your wallet successfully.
            </p>
          </div>

          {paymentDetails && (
            <div className="mt-8 border-t border-gray-200 pt-6">
              <dl className="space-y-4">
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Amount Added</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    ₹{Number(paymentDetails.amount || 0).toFixed(2)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Order ID</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {paymentDetails.orderId || searchParams.get('order_id')}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="text-sm font-medium text-green-600">Success</dd>
                </div>
              </dl>
            </div>
          )}

          <div className="mt-8 space-y-4">
            <Link
              to="/billing"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View Billing Details
            </Link>
            <Link
              to="/dashboard"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
