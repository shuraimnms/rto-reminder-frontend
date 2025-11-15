import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useWallet } from '../contexts/WalletContext';
import { payAPI } from '../services/api';
import PayButton from '../components/PayButton';
import { CreditCard, History, Wallet, Download, AlertTriangle } from 'lucide-react'; // Added Download icon, AlertTriangle
import { useTheme } from '../contexts/ThemeContext'; // Import useTheme

const Billing = () => {
  const { balance, loading: balanceLoading, refreshBalance } = useWallet();
  const { currentTheme } = useTheme();
  const isNeuralTheme = currentTheme === 'neural';

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactionHistory();
  }, []);

  const fetchTransactionHistory = async () => {
    try {
      setLoading(true);
      const response = await payAPI.getTransactionHistory();
      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error('Failed to fetch transaction history:', error);
      toast.error('Failed to load transaction history');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${isNeuralTheme ? 'text-neural-text-color' : ''}`}>
      <div className="mb-8">
        <h1 className={`text-3xl font-bold flex items-center ${isNeuralTheme ? 'text-neural-electric-blue' : 'text-gray-900'}`}>
          <CreditCard className={`mr-3 h-8 w-8 ${isNeuralTheme ? 'neural-icon' : 'text-blue-600'}`} />
          Billing & Wallet
        </h1>
        <p className={`mt-2 ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-600'}`}>
          Manage your wallet balance and view transaction history
        </p>
      </div>

      {/* Wallet Balance Card */}
      <div className={`rounded-lg shadow-lg p-6 mb-8 ${isNeuralTheme ? 'neural-card neural-glowing-border' : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-xl font-semibold mb-2 ${isNeuralTheme ? 'text-neural-text-color' : 'text-white'}`}>Current Balance</h2>
            {balanceLoading ? (
              <div className="animate-pulse">
                <div className={`h-8 rounded w-32 ${isNeuralTheme ? 'bg-neural-border-color' : 'bg-white/20'}`}></div>
              </div>
            ) : (
              <p className={`text-3xl font-bold ${isNeuralTheme ? 'text-neural-electric-blue' : 'text-white'}`}>{formatCurrency(balance)}</p>
            )}
          </div>
          <Wallet className={`h-12 w-12 opacity-80 ${isNeuralTheme ? 'neural-icon' : ''}`} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Up Section */}
        <div className={isNeuralTheme ? "neural-card p-6" : "bg-white rounded-lg shadow-md p-6"}>
          <h3 className={`text-xl font-semibold mb-4 ${isNeuralTheme ? 'text-neural-electric-blue' : 'text-gray-900'}`}>Top Up Wallet</h3>
          <PayButton onBalanceUpdate={refreshBalance} isNeuralTheme={isNeuralTheme} />
        </div>

        {/* Transaction History */}
        <div className={isNeuralTheme ? "neural-card p-6" : "bg-white rounded-lg shadow-md p-6"}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-xl font-semibold flex items-center ${isNeuralTheme ? 'text-neural-electric-blue' : 'text-gray-900'}`}>
              <History className={`mr-2 h-5 w-5 ${isNeuralTheme ? 'neural-icon' : ''}`} />
              Recent Transactions
            </h3>
            <button
              onClick={fetchTransactionHistory}
              disabled={loading}
              className={isNeuralTheme ? "neural-button text-sm" : "text-blue-600 hover:text-blue-800 text-sm font-medium"}
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className={`h-4 rounded w-full mb-2 ${isNeuralTheme ? 'bg-neural-border-color' : 'bg-gray-200'}`}></div>
                  <div className={`h-3 rounded w-3/4 ${isNeuralTheme ? 'bg-neural-border-color' : 'bg-gray-200'}`}></div>
                </div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <p className={`text-center py-8 ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-500'}`}>No transactions found</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {transactions.slice(0, 10).map((transaction) => (
                <div
                  key={transaction.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${isNeuralTheme ? 'bg-neural-card-background border border-neural-border-color' : 'bg-gray-50'}`}
                >
                  <div className="flex-1">
                    <p className={`font-medium ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-900'}`}>
                      {transaction.description || 'Wallet Top-up'}
                    </p>
                    <p className={`text-sm ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-500'}`}>
                      {formatDate(transaction.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    {(() => {
                      const isCreditOrTopUp = transaction.type === 'credit' || transaction.description.includes('Wallet Top-up');
                      const displayAmount = isCreditOrTopUp ? Math.abs(transaction.amount) : transaction.amount;
                      const amountPrefix = isCreditOrTopUp ? '+' : '-';
                      const amountColorClass = isCreditOrTopUp ? 'text-green-600' : 'text-red-600';

                      return (
                        <p className={`font-semibold ${amountColorClass}`}>
                          {amountPrefix}{formatCurrency(displayAmount)}
                        </p>
                      );
                    })()}
                    <p className={`text-xs capitalize font-medium ${
                      transaction.status === 'failed'
                        ? 'text-red-600' // Red for failed
                        : (isNeuralTheme ? 'text-neural-text-color' : 'text-gray-500') // Original styling for others
                    }`}>
                      {transaction.status === 'failed' ? 'Failed' : transaction.status}
                    </p>
                    {/* Download Invoice Button */}
                    <button
                      onClick={() => {
                        if (transaction.invoiceUrl) {
                          window.open(transaction.invoiceUrl, '_blank');
                        } else {
                          toast.error('Invoice URL not available.');
                        }
                      }}
                      disabled={loading}
                      className={`mt-1 text-xs ${isNeuralTheme ? 'text-neural-aqua-gradient-start hover:text-neural-electric-blue' : 'text-blue-500 hover:text-blue-700'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Download className="inline-block h-3 w-3 mr-1" /> Invoice
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Usage Warning */}
      {balance < 10 && !balanceLoading && (
        <div className={`mt-8 p-4 rounded-lg ${isNeuralTheme ? 'neural-card neural-glowing-border' : 'bg-yellow-50 border border-yellow-200'}`}>
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className={`h-5 w-5 ${isNeuralTheme ? 'neural-icon' : 'text-yellow-400'}`} />
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${isNeuralTheme ? 'text-neural-electric-blue' : 'text-yellow-800'}`}>
                Low Balance Warning
              </h3>
              <div className={`mt-2 text-sm ${isNeuralTheme ? 'text-neural-text-color' : 'text-yellow-700'}`}>
                <p>
                  Your wallet balance is low. Please top up to continue sending messages without interruption.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;
