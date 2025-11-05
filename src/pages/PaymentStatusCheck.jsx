import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { payAPI } from '../services/api';
import { toast } from 'react-hot-toast';

const PaymentStatusCheck = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Verifying payment status...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      const params = new URLSearchParams(location.search);
      const orderId = params.get('order_id');

      if (!orderId) {
        setMessage('Invalid payment URL: Order ID missing. Redirecting to failure page.');
        toast.error('Invalid payment URL: Order ID missing.');
        setLoading(false);
        navigate('/payment-failed', { replace: true });
        return;
      }

      try {
        const response = await payAPI.verifyPayment(orderId);
        if (response.success) {
          if (response.data.status === 'success') {
            setMessage('Payment successful! Redirecting...');
            // Only show toast here, as PaymentSuccess will show its own
            navigate('/payment-success', { replace: true, state: { paymentDetails: response.data } });
          } else if (response.data.status === 'failed') {
            setMessage('Payment failed. Redirecting to failure page.');
            toast.error('Payment failed. Please try again.');
            navigate('/payment-failed', { replace: true });
          } else { // pending or other statuses
            setMessage('Payment status is pending or unknown. Redirecting to failure page.');
            toast.error('Payment status is pending or unknown. Please check your transaction history.');
            navigate('/payment-failed', { replace: true });
          }
        } else {
          // API call was successful, but backend reported an error (e.g., transaction not found)
          setMessage(`Payment verification failed: ${response.message || 'Unknown error'}. Redirecting...`);
          toast.error(response.message || 'Payment verification failed.');
          navigate('/payment-failed', { replace: true });
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred during payment verification.';
        setMessage(`An error occurred: ${errorMessage}. Redirecting...`);
        toast.error(errorMessage);
        navigate('/payment-failed', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        {loading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin h-8 w-8 text-indigo-600 mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg text-gray-700">{message}</p>
          </div>
        ) : (
          <p className="text-lg text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
};

export default PaymentStatusCheck;
