import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const transactionId = searchParams.get('transaction_id');
        const paymentId = searchParams.get('payment_id');

        if (transactionId) {
          // Verify payment with backend
          const response = await api.get(`/api/v1/pay/verify-payment/${transactionId}`);
          setPaymentDetails(response.data.data);
        } else if (paymentId) {
          // Handle direct payment gateway callback
          setPaymentDetails({
            amount: searchParams.get('amount'),
            currency: 'INR',
            status: 'success'
          });
        }

        toast.success('Payment successful! Credits have been added to your wallet.');
      } catch (error) {
        toast.error('Payment verification failed. Please contact support if credits were not added.');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

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
                    ₹{paymentDetails.amount?.toFixed(2)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Transaction ID</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {paymentDetails.transaction_id || searchParams.get('transaction_id') || 'N/A'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Payment ID</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {paymentDetails.payment_id || searchParams.get('payment_id') || 'N/A'}
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

