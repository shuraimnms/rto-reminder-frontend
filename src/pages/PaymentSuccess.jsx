import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Receipt } from 'lucide-react';
import { billingAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const { user } = useAuth();

  const orderId = searchParams.get('order_id');

  useEffect(() => {
    if (orderId) {
      // For Cashfree, we might want to verify the payment status
      // For now, just show success message
      setPaymentDetails({
        orderId,
        status: 'success',
        message: 'Payment completed successfully!'
      });
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Payment Successful ✅
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your wallet has been topped up successfully
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-lg rounded-lg sm:px-10">
          {paymentDetails && (
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-mono text-gray-900">{paymentDetails.order_id || orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium text-gray-900">₹{paymentDetails.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="text-green-600 font-medium">Success</span>
                  </div>
                </div>
              </div>

              <div className="text-center text-sm text-gray-600">
                Your new wallet balance is ₹{user?.wallet_balance?.toFixed(2)}.
              </div>
            </div>
          )}

          <div className="mt-8 space-y-4">
            <Link
              to="/billing"
              className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Receipt className="h-4 w-4 mr-2" />
              View Billing & Transactions
            </Link>

            <Link
              to="/dashboard"
              className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500">
          <p>If you have any issues, please contact support.</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
