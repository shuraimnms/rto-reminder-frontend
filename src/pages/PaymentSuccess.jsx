import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const PaymentSuccess = () => {
  const location = useLocation();
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    // Payment details should be passed via navigation state from PaymentStatusCheck
    if (location.state && location.state.paymentDetails) {
      setPaymentDetails(location.state.paymentDetails);
      toast.success('Payment successful! Credits have been added to your wallet.');
    } else {
      // Fallback if no state is passed (e.g., direct access or refresh)
      toast.error('Payment details not found. Please check your billing history.');
    }
  }, [location]);

  // No loading state needed as verification is done by PaymentStatusCheck

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
                    {paymentDetails.orderId}
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
