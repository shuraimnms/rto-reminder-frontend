
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { messagesAPI } from '../services/api';
import {
  MessageSquare,
  Search,
  Filter,
  RefreshCw,
  Download,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  BarChart3,
  TrendingUp,
  Users,
  Send
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext'; // Import useTheme
import moment from 'moment'; // For date calculations

const MessageLogs = () => {
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  // Filters
  const [filters, setFilters] = useState({
    status: '',
    message_type: '',
    date_from: '',
    date_to: '',
    search: '',
    time_range: 'all' // Added time_range filter
  });

  const [showFilters, setShowFilters] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const { currentTheme } = useTheme();
  const isNeuralTheme = currentTheme === 'neural';

  useEffect(() => {
    fetchMessageStats();
    fetchMessages();
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [pagination.page, filters]);

  const applyTimeRangeFilter = (range) => {
    const today = moment().format('YYYY-MM-DD');
    let dateFrom = '';
    let dateTo = today;

    if (range === 'today') {
      dateFrom = today;
    } else if (range === 'weekly') {
      dateFrom = moment().subtract(7, 'days').format('YYYY-MM-DD');
    } else if (range === 'monthly') {
      dateFrom = moment().subtract(30, 'days').format('YYYY-MM-DD');
    } else { // 'all'
      dateFrom = '';
      dateTo = '';
    }

    setFilters(prev => ({
      ...prev,
      time_range: range,
      date_from: dateFrom,
      date_to: dateTo
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit
      };

      // Only include filters that have values
      if (filters.status) params.status = filters.status;
      if (filters.message_type) params.message_type = filters.message_type;
      if (filters.date_from) params.date_from = filters.date_from;
      if (filters.date_to) params.date_to = filters.date_to;
      if (filters.search) params.search = filters.search;

      const response = await messagesAPI.getAll(params); // Corrected API call
      const data = response.data || {};
      setMessages(data.messageLogs || []);
      setPagination(prev => ({ ...prev, ...(data.pagination || {}) }));
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };
  const fetchMessageStats = async () => {
    try {
      setStatsLoading(true);
      const response = await messagesAPI.getMessageStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleExportCSV = async () => {
    try {
      const response = await messagesAPI.exportMessages({
        status: filters.status || undefined,
        message_type: filters.message_type || undefined,
        date_from: filters.date_from || undefined,
        date_to: filters.date_to || undefined,
        search: filters.search || undefined
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'message_logs.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Messages exported successfully');
    } catch (error) {
      console.error('Failed to export messages:', error);
      toast.error('Failed to export messages');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'DELIVERED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'FAILED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'SENT':
        return <Send className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      DELIVERED: { bg: 'bg-green-100', text: 'text-green-800', label: 'Delivered' },
      FAILED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Failed' },
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      SENT: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Sent' },
      READ: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Read' }
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className={`space-y-6 ${isNeuralTheme ? 'text-neural-text-color' : ''}`}>
      <div className="flex justify-between items-center">
        <h1 className={`text-2xl font-bold ${isNeuralTheme ? 'text-neural-electric-blue' : 'text-gray-900 themed-heading'}`}>Message Logs</h1>
        <div className="flex space-x-2">
          <button
            onClick={handleExportCSV}
            className={isNeuralTheme ? "neural-button flex items-center" : "btn btn-secondary flex items-center"}
          >
            <Download className={`h-4 w-4 mr-2 ${isNeuralTheme ? 'neural-icon' : ''}`} />
            Export CSV
          </button>
          <button
            onClick={() => {
              fetchMessages();
              fetchMessageStats();
            }}
            className={isNeuralTheme ? "neural-button flex items-center" : "btn btn-secondary flex items-center"}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isNeuralTheme ? 'neural-icon' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className={isNeuralTheme ? "neural-card p-6" : "card p-6"}>
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${isNeuralTheme ? 'bg-transparent' : 'bg-blue-100'}`}>
                <MessageSquare className={`h-6 w-6 ${isNeuralTheme ? 'neural-icon' : 'text-blue-600'}`} />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-600'}`}>Total Messages</p>
                <p className={`text-2xl font-bold ${isNeuralTheme ? 'text-neural-electric-blue' : 'text-gray-900'}`}>{stats.total || 0}</p>
              </div>
            </div>
          </div>

          <div className={isNeuralTheme ? "neural-card p-6" : "card p-6"}>
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${isNeuralTheme ? 'bg-transparent' : 'bg-green-100'}`}>
                <CheckCircle className={`h-6 w-6 ${isNeuralTheme ? 'neural-icon' : 'text-green-600'}`} />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-600'}`}>Delivered</p>
                <p className={`text-2xl font-bold ${isNeuralTheme ? 'text-neural-electric-blue' : 'text-gray-900'}`}>{stats.delivered || 0}</p>
                <p className={`text-xs ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-500'}`}>
                  {stats.total ? Math.round((stats.delivered / stats.total) * 100) : 0}% success rate
                </p>
              </div>
            </div>
          </div>

          <div className={isNeuralTheme ? "neural-card p-6" : "card p-6"}>
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${isNeuralTheme ? 'bg-transparent' : 'bg-red-100'}`}>
                <XCircle className={`h-6 w-6 ${isNeuralTheme ? 'neural-icon' : 'text-red-600'}`} />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-600'}`}>Failed</p>
                <p className={`text-2xl font-bold ${isNeuralTheme ? 'text-neural-electric-blue' : 'text-gray-900'}`}>{stats.failed || 0}</p>
              </div>
            </div>
          </div>

          <div className={isNeuralTheme ? "neural-card p-6" : "card p-6"}>
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${isNeuralTheme ? 'bg-transparent' : 'bg-yellow-100'}`}>
                <Clock className={`h-6 w-6 ${isNeuralTheme ? 'neural-icon' : 'text-yellow-600'}`} />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-600'}`}>Pending</p>
                <p className={`text-2xl font-bold ${isNeuralTheme ? 'text-neural-electric-blue' : 'text-gray-900'}`}>{stats.pending || 0}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className={isNeuralTheme ? "neural-card p-4" : "card p-4"}>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <button
            onClick={() => applyTimeRangeFilter('today')}
            className={`${isNeuralTheme && filters.time_range === 'today' ? 'neural-button' : isNeuralTheme ? 'neural-button-secondary' : 'btn btn-secondary'} flex-1`}
          >
            Today
          </button>
          <button
            onClick={() => applyTimeRangeFilter('weekly')}
            className={`${isNeuralTheme && filters.time_range === 'weekly' ? 'neural-button' : isNeuralTheme ? 'neural-button-secondary' : 'btn btn-secondary'} flex-1`}
          >
            Weekly
          </button>
          <button
            onClick={() => applyTimeRangeFilter('monthly')}
            className={`${isNeuralTheme && filters.time_range === 'monthly' ? 'neural-button' : isNeuralTheme ? 'neural-button-secondary' : 'btn btn-secondary'} flex-1`}
          >
            Monthly
          </button>
          <button
            onClick={() => applyTimeRangeFilter('all')}
            className={`${isNeuralTheme && filters.time_range === 'all' ? 'neural-button' : isNeuralTheme ? 'neural-button-secondary' : 'btn btn-secondary'} flex-1`}
          >
            All Time
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by customer name, phone, or message content..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className={`pl-10 w-full ${isNeuralTheme ? 'neural-input' : 'input'}`}
            />
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${isNeuralTheme ? 'neural-icon' : 'text-gray-400'}`} />
          </div>

          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className={isNeuralTheme ? 'neural-input' : 'input'}
          >
            <option value="">All Status</option>
            <option value="DELIVERED">Delivered</option>
            <option value="FAILED">Failed</option>
            <option value="PENDING">Pending</option>
            <option value="SENT">Sent</option>
          </select>

          <select
            value={filters.message_type}
            onChange={(e) => handleFilterChange('message_type', e.target.value)}
            className={isNeuralTheme ? 'neural-input' : 'input'}
          >
            <option value="">All Types</option>
            <option value="SMS">SMS</option>
            <option value="WHATSAPP">WhatsApp</option>
          </select>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={isNeuralTheme ? "neural-button flex items-center" : "btn btn-secondary flex items-center"}
          >
            <Filter className={`h-4 w-4 mr-2 ${isNeuralTheme ? 'neural-icon' : ''}`} />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-700'}`}>Date From</label>
              <input
                type="date"
                value={filters.date_from}
                onChange={(e) => handleFilterChange('date_from', e.target.value)}
                className={`w-full ${isNeuralTheme ? 'neural-input' : 'input'}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-700'}`}>Date To</label>
              <input
                type="date"
                value={filters.date_to}
                onChange={(e) => handleFilterChange('date_to', e.target.value)}
                className={`w-full ${isNeuralTheme ? 'neural-input' : 'input'}`}
              />
            </div>
          </div>
        )}
      </div>

      {/* Messages Table */}
      <div className={isNeuralTheme ? "neural-card" : "card"}>
        <div className={`px-6 py-4 border-b ${isNeuralTheme ? 'border-neural-border-color' : 'border-gray-200'}`}>
          <h3 className={`text-lg font-medium ${isNeuralTheme ? 'text-neural-electric-blue' : 'text-gray-900 themed-heading'}`}>
            Message Logs ({pagination.total})
          </h3>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className={`animate-spin rounded-full h-8 w-8 border-b-2 mx-auto ${isNeuralTheme ? 'border-neural-electric-blue' : 'border-blue-600'}`}></div>
            <p className={`mt-2 ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-600'}`}>Loading messages...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className={`min-w-full divide-y ${isNeuralTheme ? 'divide-neural-border-color' : 'divide-gray-200'}`}>
                <thead className={isNeuralTheme ? 'bg-neural-card-background' : 'bg-gray-50'}>
                  <tr>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-500'}`}>
                      Customer
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-500'}`}>
                      Message
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-500'}`}>
                      Status
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-500'}`}>
                      Sent At
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-500'}`}>
                      Delivered At
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-500'}`}>
                      Error Message
                    </th>
                  </tr>
                </thead>
                <tbody className={`${isNeuralTheme ? 'bg-neural-card-background divide-neural-border-color' : 'bg-white divide-gray-200'}`}>
                  {messages.map((message) => (
                    <tr key={message._id} className={isNeuralTheme ? 'hover:bg-neural-background-light' : 'hover:bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isNeuralTheme ? 'bg-neural-electric-blue' : 'bg-blue-500'}`}>
                              <span className={`text-sm font-medium ${isNeuralTheme ? 'text-white' : 'text-white'}`}>
                                {message.customer_name ? message.customer_name.charAt(0).toUpperCase() : '?'}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className={`text-sm font-medium ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-900'}`}>
                              {message.customer_name || 'Unknown Customer'}
                            </div>
                            <div className={`text-sm ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-500'}`}>
                              {message.customer_mobile || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`text-sm max-w-xs truncate ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-900'}`} title={message.content}>
                          {message.template_name || 'N/A'}
                        </div>
                        <div className={`text-sm ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-500'}`}>
                          Type: {message.message_type || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(message.status)}
                          <span className="ml-2">{getStatusBadge(message.status)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-900'}`}>
                          {message.sent_at ? new Date(message.sent_at).toLocaleString() : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-900'}`}>
                          {message.delivered_at ? new Date(message.delivered_at).toLocaleString() : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm max-w-xs truncate ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-900'}`} title={message.error_message}>
                          {message.error_message || 'N/A'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className={`px-6 py-4 border-t flex items-center justify-between ${isNeuralTheme ? 'border-neural-border-color' : 'border-gray-200'}`}>
                <div className={`text-sm ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-700'}`}>
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                  {pagination.total} messages
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                    className={isNeuralTheme ? "neural-button disabled:opacity-50" : "btn btn-secondary disabled:opacity-50"}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.pages}
                    className={isNeuralTheme ? "neural-button disabled:opacity-50" : "btn btn-secondary disabled:opacity-50"}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MessageLogs;
