import React from 'react';
import { X, AlertTriangle, CreditCard } from 'lucide-react';

const InsufficientBalancePopup = ({ isOpen, onClose, currentBalance, requiredBalance, onTopUp }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900">Insufficient Balance</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Your wallet balance is insufficient to complete this action.
            </p>

            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Current Balance:</span>
                <span className="font-semibold text-gray-900">₹{currentBalance || 0}</span>
              </div>
              {requiredBalance && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Required Balance:</span>
                  <span className="font-semibold text-red-600">₹{requiredBalance}</span>
                </div>
              )}
              {requiredBalance && (
                <div className="flex justify-between border-t pt-2">
                  <span className="text-sm text-gray-600">Amount Needed:</span>
                  <span className="font-semibold text-red-600">
                    ₹{Math.max(0, requiredBalance - (currentBalance || 0))}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 btn btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={onTopUp}
              className="flex-1 btn btn-primary flex items-center justify-center space-x-2"
            >
              <CreditCard className="h-4 w-4" />
              <span>Top Up Wallet</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsufficientBalancePopup;
