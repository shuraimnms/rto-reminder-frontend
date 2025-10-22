import { load } from '@cashfreepayments/cashfree-js';

let cashfreeInstance = null;

/**
 * Initialize Cashfree SDK
 * @returns {Promise} Cashfree instance
 */
export const initializeCashfree = async () => {
  if (cashfreeInstance) {
    return cashfreeInstance;
  }

  try {
    cashfreeInstance = await load({
      mode: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
    });
    return cashfreeInstance;
  } catch (error) {
    console.error('Error initializing Cashfree:', error);
    throw error;
  }
};

/**
 * Create Cashfree checkout session
 * @param {Object} orderData - Order data from backend
 * @returns {Promise} Checkout session
 */
export const createCashfreeCheckout = async (orderData) => {
  try {
    const cashfree = await initializeCashfree();

    const checkoutOptions = {
      paymentSessionId: orderData.payment_session_id,
      redirectTarget: "_modal",
    };

    const result = await cashfree.checkout(checkoutOptions);
    return result;
  } catch (error) {
    console.error('Error creating Cashfree checkout:', error);
    throw error;
  }
};

/**
 * Verify Cashfree payment
 * @param {string} orderId - Order ID
 * @returns {Promise} Payment verification result
 */
export const verifyCashfreePayment = async (orderId) => {
  try {
    // This would typically be handled by webhook or backend verification
    // For frontend, we can poll the backend for payment status
    const response = await fetch(`/api/v1/billing/wallet/topup/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        gateway: 'cashfree',
        cashfree_order_id: orderId
      })
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error verifying Cashfree payment:', error);
    throw error;
  }
};
