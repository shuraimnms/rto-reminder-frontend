import React, { useState, useEffect } from 'react';
import { supportAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  User,
  AlertCircle,
  Search,
  Filter,
  Eye,
  MessageCircle,
  Send,
  Edit,
  Trash2
} from 'lucide-react';

const AdminSupport = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    subject: '',
    description: '',
    priority: 'Medium',
    status: 'Open'
  });
  const [filters, setFilters] = useState({
    status: 'all',
    search: ''
  });
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchTickets();
    fetchAnalytics();
  }, [filters]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.status !== 'all') params.status = filters.status;
      if (filters.search) params.search = filters.search;

      const response = await supportAPI.getAllTickets(params);
      setTickets(response.data || []);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
      toast.error('Failed to load support tickets');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await supportAPI.getAnalytics();
      // Transform backend data to match frontend expectations
      const backendData = response.data;
      setAnalytics({
        totalTickets: backendData.overview?.totalTickets || 0,
        openTickets: backendData.overview?.openTickets || 0,
        resolvedToday: backendData.overview?.resolvedTickets || 0, // Using resolvedTickets as resolvedToday
        avgResponseTime: Math.round((backendData.overview?.avgResolutionTime || 0) / 60) // Convert minutes to hours
      });
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await supportAPI.updateTicketStatus(ticketId, { status: newStatus });
      toast.success('Ticket status updated successfully');
      fetchTickets();
    } catch (error) {
      console.error('Failed to update ticket status:', error);
      toast.error('Failed to update ticket status');
    }
  };

  const handleAssignTicket = async (ticketId, agentId) => {
    try {
      await supportAPI.assignTicket(ticketId, { assignedTo: agentId });
      toast.success('Ticket assigned successfully');
      fetchTickets();
    } catch (error) {
      console.error('Failed to assign ticket:', error);
      toast.error('Failed to assign ticket');
    }
  };

  const handleEditTicket = async (ticketData) => {
    try {
      await supportAPI.updateTicket(editingTicket._id, ticketData);
      toast.success('Ticket updated successfully');
      setShowEditModal(false);
      setEditingTicket(null);
      fetchTickets();
    } catch (error) {
      console.error('Failed to update ticket:', error);
      toast.error('Failed to update ticket');
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) return;

    try {
      await supportAPI.deleteTicket(ticketId);
      toast.success('Ticket deleted successfully');
      fetchTickets();
    } catch (error) {
      console.error('Failed to delete ticket:', error);
      toast.error('Failed to delete ticket');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'bg-red-100 text-red-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      case 'Urgent': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    if (filters.status !== 'all' && ticket.status !== filters.status) return false;
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return ticket.subject.toLowerCase().includes(searchTerm) ||
             ticket.description.toLowerCase().includes(searchTerm) ||
             ticket.createdBy?.name?.toLowerCase().includes(searchTerm) ||
             ticket.createdBy?.company_name?.toLowerCase().includes(searchTerm);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Support Management</h1>
        <button
          onClick={async () => {
            if (!window.confirm('Are you sure you want to delete ALL tickets? This action cannot be undone.')) return;

            try {
              await supportAPI.deleteAllTickets();
              toast.success('All tickets deleted successfully');
              fetchTickets();
              fetchAnalytics();
            } catch (error) {
              console.error('Failed to delete all tickets:', error);
              toast.error('Failed to delete all tickets');
            }
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete All Tickets</span>
        </button>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tickets</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalTickets}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Open Tickets</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.openTickets}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resolved Today</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.resolvedToday}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.avgResponseTime}h</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tickets..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="all">All Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading tickets...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{ticket.subject}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{ticket.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">{ticket.createdBy?.name || ticket.createdBy?.company_name || 'Unknown'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ticket.assignedTo?.name || 'Unassigned'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedTicket(ticket);
                            setShowModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingTicket(ticket);
                            setEditFormData({
                              subject: ticket.subject,
                              description: ticket.description,
                              priority: ticket.priority,
                              status: ticket.status
                            });
                            setShowEditModal(true);
                          }}
                          className="text-green-600 hover:text-green-900"
                          title="Edit Ticket"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteTicket(ticket._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Ticket"
                        >
                          <Trash2 size={16} />
                        </button>
                        <select
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                          value={ticket.status}
                          onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
                        >
                          <option value="Open">Open</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ticket Detail Modal */}
      {showModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedTicket.subject}</h2>
                  <p className="text-sm text-gray-600">Ticket #{selectedTicket._id}</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Agent Information</h3>
                  <p><strong>Name:</strong> {selectedTicket.createdBy?.name || 'Unknown'}</p>
                  <p><strong>Email:</strong> {selectedTicket.createdBy?.email || 'N/A'}</p>
                  <p><strong>Company:</strong> {selectedTicket.createdBy?.company_name || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Ticket Details</h3>
                  <p><strong>Status:</strong> <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedTicket.status)}`}>{selectedTicket.status}</span></p>
                  <p><strong>Priority:</strong> <span className={`font-medium ${getPriorityColor(selectedTicket.priority)}`}>{selectedTicket.priority}</span></p>
                  <p><strong>Created:</strong> {new Date(selectedTicket.createdAt).toLocaleString()}</p>
                  <p><strong>Assigned To:</strong> {selectedTicket.assignedTo?.name || 'Unassigned'}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded">{selectedTicket.description}</p>
              </div>

              {/* Messages Section */}
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Messages</h3>
                <div className="space-y-4">
                  {selectedTicket.messages?.map((message, index) => (
                    <div key={index} className={`p-3 rounded-lg ${message.senderRole === 'admin' ? 'bg-blue-50 ml-8' : 'bg-gray-50 mr-8'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-sm">{message.sender?.name || 'Unknown'}</span>
                        <span className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-sm">{message.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Ticket Modal */}
      {showEditModal && editingTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">Edit Ticket</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingTicket(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                handleEditTicket(editFormData);
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={editFormData.subject}
                      onChange={(e) => setEditFormData({ ...editFormData, subject: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={editFormData.description}
                      onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <select
                        value={editFormData.priority}
                        onChange={(e) => setEditFormData({ ...editFormData, priority: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={editFormData.status}
                        onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingTicket(null);
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Update Ticket
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSupport;
