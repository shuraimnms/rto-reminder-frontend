import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { payAPI } from '../services/api';

const PayButton = ({ onBalanceUpdate }) => {
  const [amount, setAmount] = useState('');
  const [isPaying, setIsPaying] = useState(false);

  const handleTopup = async (e) => {
    e.preventDefault();
    const topupAmount = parseFloat(amount);
    if (isNaN(topupAmount) || topupAmount < 1) {
      toast.error('Please enter a valid amount (minimum ₹1.00).');
      return;
    }

    setIsPaying(true);
    try {
      const response = await payAPI.addBalance({ amount: topupAmount });

      if (response.success) {
        toast.success(response.message || `₹${topupAmount} added to your wallet successfully!`);
        setAmount('');
        if (onBalanceUpdate) {
          onBalanceUpdate();
        }
      } else {
        throw new Error(response.message || 'Failed to add balance');
      }
    } catch (error) {
      console.error('Failed to add balance:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to add balance. Please try again.');
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Credits</h3>
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
          {isPaying ? 'Processing...' : 'Add Credits'}
        </button>
        <p className="text-xs text-gray-500 text-center">Minimum top-up amount: ₹1.00</p>
      </form>
    </div>
  );
};

export default PayButton;
