import React, { useState, useEffect } from 'react';
import { Bell, Plus, Search, Edit, Trash2, Play, Pause, Send, Calendar, Car, User } from 'lucide-react';
import { remindersAPI, customersAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import CreateReminderModal from '../components/modals/CreateReminderModal';
import toast from 'react-hot-toast';

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [filter, setFilter] = useState('all'); // all, pending, sent, completed, failed
  const { user } = useAuth();
  const { currentTheme } = useTheme();
  const isAiTheme = currentTheme === 'ai';

  useEffect(() => {
    fetchReminders();
  }, [pagination.page, filter, searchTerm]);

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit
      };

      if (filter !== 'all') {
        params.status = filter;
      }

      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      const response = await remindersAPI.getAll(params);
      const data = response.data || {};
      setReminders(data.reminders || []);
      setPagination(prev => ({ ...prev, ...(data.pagination || {}) }));
    } catch (error) {
      console.error('Failed to fetch reminders:', error);
      toast.error('Failed to load reminders');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchReminders();
  };

  const handleDeleteReminder = async (reminderId) => {
    if (!window.confirm('Are you sure you want to delete this reminder?')) return;

    try {
      await remindersAPI.delete(reminderId);
      toast.success('Reminder deleted successfully');
      fetchReminders();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete reminder';
      toast.error(errorMessage);
    }
  };

  const handleSendNow = async (reminderId) => {
    try {
      await remindersAPI.sendNow(reminderId);
      toast.success('Reminder sent successfully');
      fetchReminders();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send reminder';
      toast.error(errorMessage);
    }
  };

  const handleCancelReminder = async (reminderId) => {
    if (!window.confirm('Are you sure you want to cancel this reminder?')) return;

    try {
      await remindersAPI.cancel(reminderId);
      toast.success('Reminder cancelled successfully');
      fetchReminders();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to cancel reminder';
      toast.error(errorMessage);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      ENQUEUED: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Enqueued' },
      SENT: { bg: 'bg-green-100', text: 'text-green-800', label: 'Sent' },
      DELIVERED: { bg: 'bg-green-100', text: 'text-green-800', label: 'Delivered' },
      READ: { bg: 'bg-green-100', text: 'text-green-800', label: 'Read' },
      FAILED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Failed' },
      CANCELLED: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Cancelled' },
      COMPLETED: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Completed' }
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getReminderTypeLabel = (type) => {
    const types = {
      vehicle_insurance_reminder: 'Vehicle Insurance',
      puc_certificate_reminder: 'PUC Certificate',
      fitness_certificate_reminder: 'Fitness Certificate',
      driving_license_reminder: 'Driving License',
      road_tax_reminder: 'Road Tax',
      noc_hypothecation_reminder: 'NOC/Hypothecation'
    };
    return types[type] || type;
  };

  const onReminderCreated = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchReminders();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={isAiTheme ? "text-2xl font-bold text-ai-text-bright" : "text-2xl font-bold text-gray-900"}>Reminders</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className={isAiTheme ? "btn-ai-primary flex items-center" : "btn btn-primary flex items-center"}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Reminder
        </button>
      </div>

      {/* Filters and Search */}
      <div className={isAiTheme ? "card-ai p-4" : "card p-4"}>
        <div className="flex flex-col sm:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by customer name, vehicle, or reminder type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={isAiTheme ? "input-ai pl-10 w-full" : "input pl-10 w-full"}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <button type="submit" className={isAiTheme ? "btn-ai-secondary" : "btn btn-secondary"}>
              Search
            </button>
          </form>

          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className={isAiTheme ? "input-ai" : "input"}
          >
            <option value="all">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="ENQUEUED">Enqueued</option>
            <option value="SENT">Sent</option>
            <option value="DELIVERED">Delivered</option>
            <option value="FAILED">Failed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Reminders Table */}
      <div className={isAiTheme ? "card-ai" : "card"}>
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Reminders List ({pagination.total})
          </h3>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading reminders...</p>
          </div>
        ) : reminders.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No reminders found</h3>
            <p className="mt-2 text-gray-600">
              {searchTerm || filter !== 'all' ? 'Try adjusting your search or filter criteria.' : 'Get started by creating your first reminder.'}
            </p>
            {!searchTerm && filter === 'all' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 btn btn-primary"
              >
                Create Reminder
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className={isAiTheme ? "bg-ai-graphite" : "bg-gray-50"}>
                  <tr>
                    <th className={isAiTheme ? "px-6 py-3 text-left text-xs font-medium text-ai-text-dim uppercase tracking-wider" : "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"}>
                      Customer
                    </th>
                    <th className={isAiTheme ? "px-6 py-3 text-left text-xs font-medium text-ai-text-dim uppercase tracking-wider" : "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"}>
                      Reminder Type
                    </th>
                    <th className={isAiTheme ? "px-6 py-3 text-left text-xs font-medium text-ai-text-dim uppercase tracking-wider" : "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"}>
                      Expiry Date
                    </th>
                    <th className={isAiTheme ? "px-6 py-3 text-left text-xs font-medium text-ai-text-dim uppercase tracking-wider" : "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"}>
                      Next Send
                    </th>
                    <th className={isAiTheme ? "px-6 py-3 text-left text-xs font-medium text-ai-text-dim uppercase tracking-wider" : "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"}>
                      Status
                    </th>
                    <th className={isAiTheme ? "px-6 py-3 text-left text-xs font-medium text-ai-text-dim uppercase tracking-wider" : "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={isAiTheme ? "bg-ai-carbon divide-y divide-ai-graphite" : "bg-white divide-y divide-gray-200"}>
                  {reminders.map((reminder) => (
                    <tr key={reminder._id} className={isAiTheme ? "hover:bg-ai-graphite" : "hover:bg-gray-50"}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                              <span className="text-sm font-medium text-white">
                                {reminder.customer && reminder.customer.name ? reminder.customer.name.charAt(0).toUpperCase() : '?'}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {reminder.customer && reminder.customer.name ? reminder.customer.name : 'Unknown Customer'}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Car className="h-3 w-3 mr-1" />
                              {reminder.vehicle_number || (reminder.customer && reminder.customer.vehicle_number) || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {getReminderTypeLabel(reminder.reminder_type)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Sent: {reminder.sent_count} times
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          {new Date(reminder.expiry_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {reminder.next_send_date
                            ? new Date(reminder.next_send_date).toLocaleDateString()
                            : 'N/A'
                          }
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(reminder.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {reminder.status === 'PENDING' && (
                            <button
                              onClick={() => handleSendNow(reminder._id)}
                              className="text-green-600 hover:text-green-900"
                              title="Send now"
                            >
                              <Send className="h-4 w-4" />
                            </button>
                          )}
                          {reminder.status === 'PENDING' && (
                            <button
                              onClick={() => handleCancelReminder(reminder._id)}
                              className="text-orange-600 hover:text-orange-900"
                              title="Cancel reminder"
                            >
                              <Pause className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit reminder"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteReminder(reminder._id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete reminder"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
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
                  {pagination.total} reminders
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

      {/* Create Reminder Modal */}
      <CreateReminderModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={onReminderCreated}
      />
    </div>
  );
};

export default Reminders;
