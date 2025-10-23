import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, ArrowUpRight, ArrowDownLeft, Download, RefreshCw, Wallet, TrendingUp, TrendingDown, FileText, Eye } from 'lucide-react';
import { billingAPI, settingsAPI } from '../services/api';

import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { initializeCashfree, createCashfreeCheckout } from '../utils/cashfree';

const Billing = () => {
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [invoicePagination, setInvoicePagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [topUpDetails, setTopUpDetails] = useState(null);
  const [topUpLoading, setTopUpLoading] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState('razorpay');
  const [perMessageCost, setPerMessageCost] = useState(1.00);
  const [messagesSentToday, setMessagesSentToday] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchWalletBalance();
    fetchTransactions();
    fetchInvoices();
    fetchSettings();
  }, [pagination.page]);

  useEffect(() => {
    // Calculate stats from transactions
    const today = new Date().toDateString();
    const todayMessages = transactions.filter(t => t.type === 'message_deduction' && new Date(t.createdAt).toDateString() === today).length;
    const credits = transactions.filter(t => t.type === 'topup').reduce((sum, t) => sum + t.amount, 0);
    const spent = transactions.filter(t => t.type === 'message_deduction').reduce((sum, t) => sum + t.amount, 0);

    setMessagesSentToday(todayMessages);
    setTotalCredits(credits);
    setTotalSpent(spent);
  }, [transactions]);

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.get();
      const data = response.data || {};
      setPerMessageCost(data.per_message_cost || 1.00);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const fetchWalletBalance = async () => {
    try {
      const response = await billingAPI.getWalletBalance();
      const data = response.data || {};
      setWalletBalance(data.balance || 0);
    } catch (error) {
      console.error('Failed to fetch wallet balance:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await billingAPI.getTransactions({
        page: pagination.page,
        limit: pagination.limit
      });
      const data = response.data || {};
      setTransactions(data.data?.transactions || []);
      setPagination(data.pagination || pagination);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoices = async (page = 1) => {
    try {
      const response = await billingAPI.getInvoices({ page, limit: 5 });
      const data = response.data || {};
      setInvoices(data.data?.invoices || []);
      setInvoicePagination(data.pagination || null);
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
      toast.error('Failed to load invoices');
    }
  };

  const handleTopUpAmountChange = (e) => {
    const amount = e.target.value;
    setTopUpAmount(amount);
    if (amount && parseFloat(amount) >= 99) {
      const baseAmount = parseFloat(amount);
      const transactionFee = baseAmount * 0.02;
      const gstAmount = transactionFee * 0.18;
      const totalAmount = baseAmount + transactionFee + gstAmount;
      setTopUpDetails({ baseAmount, transactionFee, gstAmount, totalAmount });
    } else {
      setTopUpDetails(null);
    }
  };

  const handleTopUp = async (e) => {
    e.preventDefault();
    if (!topUpDetails) {
      toast.error('Please enter a valid amount (min ₹99)');
      return;
    }

    setTopUpLoading(true);
    try {
      const response = await billingAPI.createTopupOrder({
        amount: topUpDetails.baseAmount, // Send amount in INR
        gateway: selectedGateway
      });

      if (selectedGateway === 'razorpay') {
        const { order, base_amount, transaction_fee, gst_amount } = response.data.data;

        const options = {
          key: response.data.data.key_id,
          amount: order.amount,
          currency: order.currency,
          name: 'RTO Reminder System',
          description: 'Wallet Top-up',
          order_id: order.id,
          handler: async function (response) {
            try {
              const verificationData = {
                gateway: 'razorpay',
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                base_amount,
                transaction_fee,
                gst_amount
              };
              const verifyResponse = await billingAPI.verifyTopupPayment(verificationData);
              toast.success(verifyResponse.data.message);
              setShowTopUpModal(false);
              setTopUpAmount('');
              setTopUpDetails(null);
              fetchWalletBalance();
              fetchTransactions();
              fetchInvoices();
            } catch (verifyError) {
              toast.error(verifyError.response?.data?.message || 'Payment verification failed.');
            }
          },
          prefill: {
            name: user?.name || '',
            email: user?.email || '',
          },
          theme: {
            color: '#3B82F6',
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else if (selectedGateway === 'cashfree') {
        const { order } = response.data.data;

        try {
          const cashfree = await initializeCashfree();

          const checkoutOptions = {
            paymentSessionId: order.payment_session_id, // This should now be correct
            redirectTarget: "_modal",
          };

          cashfree.checkout(checkoutOptions).then(async (result) => {
            if (result.error) {
              toast.error(result.error.message || 'Payment failed or was cancelled.');
              return;
            }
            if (result.paymentDetails) {
              try {
                const verificationData = {
                  gateway: 'cashfree',
                  cashfree_order_id: result.paymentDetails.orderId,
                  cashfree_payment_id: result.paymentDetails.paymentId,
                  base_amount: topUpDetails.baseAmount,
                  transaction_fee: topUpDetails.transactionFee,
                  gst_amount: topUpDetails.gstAmount,
                };
                const verifyResponse = await billingAPI.verifyTopupPayment(verificationData);
                toast.success(verifyResponse.data.message || 'Payment successful!');
                setShowTopUpModal(false);
                fetchWalletBalance();
                fetchTransactions();
              } catch (verifyError) {
                toast.error(verifyError.response?.data?.message || 'Payment verification failed.');
              }
            }
          });
        } catch (cashfreeError) {
          console.error('Cashfree initialization error:', cashfreeError);
          toast.error('Failed to initialize payment gateway. Please try again.');
        }
      }
    } catch (error) {
      console.log('Topup error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to top up wallet';
      toast.error(errorMessage);
    } finally {
      setTopUpLoading(false);
    }
  };

  const getTransactionIcon = (type) => {
    const typeMap = {
      'topup': <ArrowDownLeft className="h-5 w-5 text-green-600" />,
      'message_deduction': <ArrowUpRight className="h-5 w-5 text-red-600" />,
      'refund': <ArrowDownLeft className="h-5 w-5 text-blue-600" />,
      'transaction_fee': <ArrowUpRight className="h-5 w-5 text-orange-600" />,
      'gst': <ArrowUpRight className="h-5 w-5 text-orange-600" />,
    };
    return typeMap[type] || <CreditCard className="h-5 w-5 text-gray-600" />;
  };

  const getTransactionBadge = (type) => {
    const typeMap = {
      'topup': { label: 'Top-up', bg: 'bg-green-100', text: 'text-green-800' },
      'message_deduction': { label: 'Message Cost', bg: 'bg-red-100', text: 'text-red-800' },
      'refund': { label: 'Refund', bg: 'bg-blue-100', text: 'text-blue-800' },
      'transaction_fee': { label: 'Fee', bg: 'bg-orange-100', text: 'text-orange-800' },
      'gst': { label: 'GST', bg: 'bg-orange-100', text: 'text-orange-800' },
    };
    const config = typeMap[type] || { label: type, bg: 'bg-gray-100', text: 'text-gray-800' };
    return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>{config.label}</span>;
  };

  const formatAmount = (amount, type) => {
    const sign = type === 'topup' || type === 'refund' ? '+' : '-';
    return `${sign} ₹${Math.abs(amount).toFixed(2)}`;
  };

  const handleViewInvoice = async (invoiceId) => {
    setInvoiceLoading(true);
    try {
      const response = await billingAPI.getInvoiceById(invoiceId);
      setSelectedInvoice(response.data.data.invoice);
      setShowInvoiceModal(true);
    } catch (error) {
      console.error('Failed to fetch invoice:', error);
      toast.error('Failed to load invoice details');
    } finally {
      setInvoiceLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Billing & Wallet</h1>
        <button
          onClick={() => setShowTopUpModal(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Top Up Wallet
        </button>
      </div>

      {/* Wallet Balance Card */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Wallet className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Wallet Balance</h3>
              <p className="text-3xl font-bold text-gray-900">₹{walletBalance.toFixed(2)}</p>
              <p className="text-sm text-gray-600">Available for messaging</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Per Message Cost</p>
            <p className="text-lg font-semibold text-gray-900">₹{user?.settings?.per_message_cost?.toFixed(2) || '1.00'}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Messages Sent Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {messagesSentToday}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Wallet className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Credits</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{transactions.filter(t => t.type === 'topup').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{transactions.filter(t => t.type === 'message_deduction').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Invoices
          </h3>
        </div>
        {loading ? (
          <div className="p-8 text-center"><p>Loading invoices...</p></div>
        ) : invoices.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No invoices yet</h3>
            <p className="mt-2 text-gray-600">Your invoices for wallet top-ups will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.invoiceNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(invoice.issueDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{invoice.totalAmount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewInvoice(invoice._id)}
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-1" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {invoicePagination && invoicePagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end">
            <button
              onClick={() => fetchInvoices(invoicePagination.page - 1)}
              disabled={invoicePagination.page === 1}
              className="btn btn-secondary disabled:opacity-50 mr-2"
            >Previous</button>
            <button
              onClick={() => fetchInvoices(invoicePagination.page + 1)}
              disabled={invoicePagination.page === invoicePagination.pages}
              className="btn btn-secondary disabled:opacity-50"
            >Next</button>
          </div>
        )}
      </div>
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Transaction History ({pagination.total})
          </h3>
          <button
            onClick={fetchTransactions}
            className="btn btn-secondary flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center">
            <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No transactions yet</h3>
            <p className="mt-2 text-gray-600">Your transaction history will appear here.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getTransactionIcon(transaction.type)}
                          <div className="ml-3 text-sm font-medium text-gray-900">
                            {transaction.reference || 'Transaction'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getTransactionBadge(transaction.type)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${
                          transaction.type === 'topup' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatAmount(transaction.amount, transaction.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{transaction.balance_after.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(transaction.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.description || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                  {pagination.total} transactions
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                    className="btn btn-secondary disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.pages}
                    className="btn btn-secondary disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Top Up Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Top Up Wallet</h3>
              <button
                onClick={() => setShowTopUpModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleTopUp} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Gateway
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gateway"
                      value="razorpay"
                      checked={selectedGateway === 'razorpay'}
                      onChange={(e) => setSelectedGateway(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm">Razorpay</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gateway"
                      value="cashfree"
                      checked={selectedGateway === 'cashfree'}
                      onChange={(e) => setSelectedGateway(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm">Cashfree</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  min="99"
                  step="0.01"
                  value={topUpAmount}
                  onChange={handleTopUpAmountChange}
                  className="input w-full"
                  placeholder="Enter amount (min ₹99)"
                  required
                />
              </div>
              {topUpDetails && (
                <div className="p-4 bg-gray-50 rounded-lg text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Top-up Amount:</span>
                    <span>₹{topUpDetails.baseAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transaction Fee (2%):</span>
                    <span>₹{topUpDetails.transactionFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18% on fee):</span>
                    <span>₹{topUpDetails.gstAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-2 mt-2">
                    <span>Total Payable:</span>
                    <span>₹{topUpDetails.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowTopUpModal(false)}
                  className="btn btn-secondary"
                  disabled={topUpLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={topUpLoading || !topUpDetails}
                >
                  {topUpLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    'Proceed to Pay'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;
