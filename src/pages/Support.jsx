import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supportAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  MessageSquare,
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Paperclip,
  Send,
  Star,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Download
} from 'lucide-react';

const Support = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: ''
  });
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [loadingTicket, setLoadingTicket] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [editFormData, setEditFormData] = useState({
    subject: '',
    description: '',
    priority: 'Medium',
    status: 'Open'
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchTickets();
  }, [filters]);

  const fetchTicketDetails = async (ticketId) => {
    setLoadingTicket(true);
    try {
      const response = await supportAPI.getTicket(ticketId);
      setSelectedTicket(response.data);
    } catch (error) {
      console.error('Failed to fetch ticket details:', error);
      toast.error('Failed to load ticket details');
    } finally {
      setLoadingTicket(false);
    }
  };

  const fetchTickets = async () => {
    try {
      const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
      const response = isAdmin
        ? await supportAPI.getAllTickets(filters)
        : await supportAPI.getAgentTickets(filters);
      setTickets(response.data);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (ticketData) => {
    try {
      const formData = new FormData();
      formData.append('subject', ticketData.subject);
      formData.append('description', ticketData.description);
      formData.append('priority', ticketData.priority);

      attachments.forEach(file => {
        formData.append('attachments', file);
      });

      await supportAPI.createTicket(formData);
      toast.success('Ticket created successfully');
      setShowCreateModal(false);
      setAttachments([]);
      fetchTickets();
    } catch (error) {
      console.error('Failed to create ticket:', error);
      toast.error('Failed to create ticket');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && attachments.length === 0) return;

    try {
      const formData = new FormData();
      formData.append('message', newMessage);

      attachments.forEach(file => {
        formData.append('attachments', file);
      });

      await supportAPI.addMessage(selectedTicket._id, formData);
      setNewMessage('');
      setAttachments([]);
      // Refresh ticket data
      const updatedTicket = await supportAPI.getTicket(selectedTicket._id);
      setSelectedTicket(updatedTicket.data);
      fetchTickets();
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleRateTicket = async (ticketId, stars, feedback) => {
    try {
      await supportAPI.rateTicket(ticketId, { stars, feedback });
      toast.success('Thank you for your feedback!');
      fetchTickets();
    } catch (error) {
      console.error('Failed to rate ticket:', error);
      toast.error('Failed to submit rating');
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
      case 'Open': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const EditTicketModal = () => {
    const handleSubmit = (e) => {
      e.preventDefault();
      handleEditTicket(editFormData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Edit Support Ticket</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Subject</label>
              <select
                value={editFormData.subject}
                onChange={(e) => setEditFormData({...editFormData, subject: e.target.value})}
                className="w-full p-2 border rounded-lg"
                required
              >
                <option value="">Select Subject</option>
                <option value="Payment">Payment</option>
                <option value="WhatsApp Issue">WhatsApp Issue</option>
                <option value="API Error">API Error</option>
                <option value="Renewal">Renewal</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={editFormData.status}
                onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                className="w-full p-2 border rounded-lg"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Priority</label>
              <select
                value={editFormData.priority}
                onChange={(e) => setEditFormData({...editFormData, priority: e.target.value})}
                className="w-full p-2 border rounded-lg"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={editFormData.description}
                onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                className="w-full p-2 border rounded-lg h-32"
                placeholder="Describe your issue..."
                required
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-100"
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
    );
  };

  const CreateTicketModal = () => {
    const [formData, setFormData] = useState({
      subject: '',
      description: '',
      priority: 'Medium'
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      handleCreateTicket(formData);
    };

    const handleFileChange = (e) => {
      const files = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...files]);
    };

    const removeAttachment = (index) => {
      setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Create Support Ticket</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Subject</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full p-2 border rounded-lg"
                required
              >
                <option value="">Select Subject</option>
                <option value="Payment">Payment</option>
                <option value="WhatsApp Issue">WhatsApp Issue</option>
                <option value="API Error">API Error</option>
                <option value="Renewal">Renewal</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full p-2 border rounded-lg"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-2 border rounded-lg h-32"
                placeholder="Describe your issue..."
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Attachments</label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="w-full p-2 border rounded-lg"
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
              {attachments.length > 0 && (
                <div className="mt-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded mb-1">
                      <span className="text-sm">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Ticket
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const TicketDetailModal = () => {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');

    const handleFileChange = (e) => {
      const files = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...files]);
    };

    const removeAttachment = (index) => {
      setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const submitRating = () => {
      handleRateTicket(selectedTicket._id, rating, feedback);
      setRating(0);
      setFeedback('');
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="flex">
            {/* Ticket Messages */}
            <div className="flex-1 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Ticket #{selectedTicket.ticketNumber}</h2>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle size={24} />
                </button>
              </div>

              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTicket.status)}`}>
                    {selectedTicket.status}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                    {selectedTicket.priority}
                  </span>
                </div>
                <h3 className="font-medium">{selectedTicket.subject}</h3>
                <p className="text-gray-600 text-sm">{selectedTicket.description}</p>
              </div>

              {/* Messages */}
              <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                {selectedTicket.messages && selectedTicket.messages.length > 0 ? selectedTicket.messages.map((message, index) => (
                  <div key={index} className={`flex ${message.senderRole === 'agent' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.senderRole === 'agent'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}>
                      <p className="text-sm">{message.message}</p>
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {message.attachments.map((attachment, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                              <a
                                href={attachment.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-xs underline"
                              >
                                <Paperclip size={12} className="mr-1" />
                                {attachment.originalName}
                              </a>
                              <button
                                onClick={() => {
                                  const link = document.createElement('a');
                                  link.href = attachment.url;
                                  link.download = attachment.originalName;
                                  link.click();
                                }}
                                className="ml-2 text-gray-500 hover:text-gray-700"
                                title="Download"
                              >
                                <Download size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(message.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-gray-500">
                    No messages yet.
                  </div>
                )}
              </div>

              {/* Message Input */}
              {selectedTicket.status !== 'Closed' && (
                <div className="border-t pt-4">
                  <div className="flex space-x-2">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      ref={fileInputRef}
                      accept="image/*,.pdf,.doc,.docx,.txt"
                    />
                    <button
                      onClick={() => fileInputRef.current.click()}
                      className="p-2 text-gray-500 hover:text-gray-700"
                    >
                      <Paperclip size={20} />
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 p-2 border rounded-lg"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                  {attachments.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center bg-gray-100 p-1 rounded">
                          <span className="text-xs mr-1">{file.name}</span>
                          <button
                            onClick={() => removeAttachment(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <XCircle size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Rating Section */}
              {selectedTicket.status === 'Resolved' && !selectedTicket.rating && (
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-medium mb-2">Rate this support</h4>
                  <div className="flex items-center space-x-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Additional feedback (optional)"
                    className="w-full p-2 border rounded-lg mb-2"
                    rows={3}
                  />
                  <button
                    onClick={submitRating}
                    disabled={rating === 0}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                  >
                    Submit Rating
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} className="mr-2" />
          New Ticket
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search tickets..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
        </div>
        <select
          value={filters.status}
          onChange={(e) => setFilters({...filters, status: e.target.value})}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="">All Status</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>
        <select
          value={filters.priority}
          onChange={(e) => setFilters({...filters, priority: e.target.value})}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="">All Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Urgent">Urgent</option>
        </select>
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
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
              {Array.isArray(tickets) && tickets.length > 0 ? tickets.map((ticket) => (
                <tr key={ticket._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      #{ticket.ticketNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{ticket.subject}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {ticket.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => fetchTicketDetails(ticket._id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      {((user?.role === 'admin' || user?.role === 'super_admin') || ticket.createdBy._id === user._id) && (
                        <>
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
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )) : null}
            </tbody>
          </table>
        </div>
        {Array.isArray(tickets) && tickets.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new support ticket.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && <CreateTicketModal />}
      {selectedTicket && <TicketDetailModal />}
      {showEditModal && <EditTicketModal />}
    </div>
  );
};

export default Support;
