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
  Download,
  LifeBuoy, // Added for neural theme
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext'; // Import useTheme

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
  const { currentTheme } = useTheme();
  const isNeuralTheme = currentTheme === 'neural';

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
      <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isNeuralTheme ? 'neural-modal-overlay' : ''}`}>
        <div className={`w-full max-w-md max-h-[90vh] overflow-y-auto ${isNeuralTheme ? 'neural-card neural-modal-content' : 'bg-white rounded-lg p-6'}`}>
          <h2 className={`text-xl font-bold mb-4 ${isNeuralTheme ? 'text-neural-electric-blue' : 'text-gray-900'}`}>Edit Support Ticket</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${isNeuralTheme ? 'text-neural-text-color' : ''}`}>Subject</label>
              <select
                value={editFormData.subject}
                onChange={(e) => setEditFormData({...editFormData, subject: e.target.value})}
                className={`w-full p-2 rounded-lg ${isNeuralTheme ? 'neural-input' : 'border'}`}
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
              <label className={`block text-sm font-medium mb-2 ${isNeuralTheme ? 'text-neural-text-color' : ''}`}>Status</label>
              <select
                value={editFormData.status}
                onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                className={`w-full p-2 rounded-lg ${isNeuralTheme ? 'neural-input' : 'border'}`}
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${isNeuralTheme ? 'text-neural-text-color' : ''}`}>Priority</label>
              <select
                value={editFormData.priority}
                onChange={(e) => setEditFormData({...editFormData, priority: e.target.value})}
                className={`w-full p-2 rounded-lg ${isNeuralTheme ? 'neural-input' : 'border'}`}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${isNeuralTheme ? 'text-neural-text-color' : ''}`}>Description</label>
              <textarea
                value={editFormData.description}
                onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                className={`w-full p-2 rounded-lg h-32 ${isNeuralTheme ? 'neural-input' : 'border'}`}
                placeholder="Describe your issue..."
                required
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className={isNeuralTheme ? "neural-button" : "px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-100"}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={isNeuralTheme ? "neural-button" : "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"}
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
      <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isNeuralTheme ? 'neural-modal-overlay' : ''}`}>
        <div className={`w-full max-w-md max-h-[90vh] overflow-y-auto ${isNeuralTheme ? 'neural-card neural-modal-content' : 'bg-white rounded-lg p-6'}`}>
          <h2 className={`text-xl font-bold mb-4 ${isNeuralTheme ? 'text-neural-electric-blue' : 'text-gray-900'}`}>Create Support Ticket</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${isNeuralTheme ? 'text-neural-text-color' : ''}`}>Subject</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className={`w-full p-2 rounded-lg ${isNeuralTheme ? 'neural-input' : 'border'}`}
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
              <label className={`block text-sm font-medium mb-2 ${isNeuralTheme ? 'text-neural-text-color' : ''}`}>Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className={`w-full p-2 rounded-lg ${isNeuralTheme ? 'neural-input' : 'border'}`}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${isNeuralTheme ? 'text-neural-text-color' : ''}`}>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className={`w-full p-2 rounded-lg h-32 ${isNeuralTheme ? 'neural-input' : 'border'}`}
                placeholder="Describe your issue..."
                required
              />
            </div>

            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${isNeuralTheme ? 'text-neural-text-color' : ''}`}>Attachments</label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className={`w-full p-2 rounded-lg ${isNeuralTheme ? 'neural-input' : 'border'}`}
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
              {attachments.length > 0 && (
                <div className="mt-2">
                  {attachments.map((file, index) => (
                    <div key={index} className={`flex items-center justify-between p-2 rounded mb-1 ${isNeuralTheme ? 'bg-neural-card-background border border-neural-border-color' : 'bg-gray-100'}`}>
                      <span className="text-sm">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className={`hover:text-red-700 ${isNeuralTheme ? 'text-neural-text-color' : 'text-red-500'}`}
                      >
                        <XCircle size={16} className={isNeuralTheme ? 'neural-icon' : ''} />
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
                className={isNeuralTheme ? "neural-button" : "px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-100"}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={isNeuralTheme ? "neural-button" : "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"}
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
      <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isNeuralTheme ? 'neural-modal-overlay' : ''}`}>
        <div className={`w-full max-w-4xl max-h-[90vh] overflow-hidden ${isNeuralTheme ? 'neural-card neural-modal-content' : 'bg-white rounded-lg'}`}>
          <div className="flex">
            {/* Ticket Messages */}
            <div className="flex-1 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-xl font-bold ${isNeuralTheme ? 'text-neural-electric-blue' : 'text-gray-900'}`}>Ticket #{selectedTicket.ticketNumber}</h2>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className={`hover:text-gray-700 ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-500'}`}
                >
                  <XCircle size={24} className={isNeuralTheme ? 'neural-icon' : ''} />
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
                <h3 className={`font-medium ${isNeuralTheme ? 'text-neural-electric-blue' : 'text-gray-900'}`}>{selectedTicket.subject}</h3>
                <p className={`text-sm ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-600'}`}>{selectedTicket.description}</p>
              </div>

              {/* Messages */}
              <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                {selectedTicket.messages && selectedTicket.messages.length > 0 ? selectedTicket.messages.map((message, index) => (
                  <div key={index} className={`flex ${message.senderRole === 'agent' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.senderRole === 'agent'
                        ? (isNeuralTheme ? 'bg-neural-electric-blue text-white' : 'bg-blue-500 text-white')
                        : (isNeuralTheme ? 'bg-neural-card-background text-neural-text-color border border-neural-border-color' : 'bg-gray-200 text-gray-800')
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
                                className={`flex items-center text-xs underline ${isNeuralTheme ? 'text-neural-aqua-gradient-start' : ''}`}
                              >
                                <Paperclip size={12} className={`mr-1 ${isNeuralTheme ? 'neural-icon' : ''}`} />
                                {attachment.originalName}
                              </a>
                              <button
                                onClick={() => {
                                  const link = document.createElement('a');
                                  link.href = attachment.url;
                                  link.download = attachment.originalName;
                                  link.click();
                                }}
                                className={`ml-2 hover:text-gray-700 ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-500'}`}
                                title="Download"
                              >
                                <Download size={12} className={isNeuralTheme ? 'neural-icon' : ''} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <p className={`text-xs mt-1 opacity-70 ${isNeuralTheme ? 'text-neural-text-color' : ''}`}>
                        {new Date(message.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )) : (
                  <div className={`text-center py-8 ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-500'}`}>
                    No messages yet.
                  </div>
                )}
              </div>

              {/* Message Input */}
              {selectedTicket.status !== 'Closed' && (
                <div className={`pt-4 ${isNeuralTheme ? 'border-t border-neural-border-color' : 'border-t'}`}>
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
                      className={`p-2 hover:text-gray-700 ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-500'}`}
                    >
                      <Paperclip size={20} className={isNeuralTheme ? 'neural-icon' : ''} />
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className={`flex-1 p-2 rounded-lg ${isNeuralTheme ? 'neural-input' : 'border'}`}
                    />
                    <button
                      onClick={handleSendMessage}
                      className={isNeuralTheme ? "neural-button" : "p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"}
                    >
                      <Send size={20} className={isNeuralTheme ? 'neural-icon' : ''} />
                    </button>
                  </div>
                  {attachments.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {attachments.map((file, index) => (
                        <div key={index} className={`flex items-center p-1 rounded ${isNeuralTheme ? 'bg-neural-card-background border border-neural-border-color' : 'bg-gray-100'}`}>
                          <span className="text-xs mr-1">{file.name}</span>
                          <button
                            onClick={() => removeAttachment(index)}
                            className={`hover:text-red-700 ${isNeuralTheme ? 'text-neural-text-color' : 'text-red-500'}`}
                          >
                            <XCircle size={12} className={isNeuralTheme ? 'neural-icon' : ''} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Rating Section */}
              {selectedTicket.status === 'Resolved' && !selectedTicket.rating && (
                <div className={`pt-4 mt-4 ${isNeuralTheme ? 'border-t border-neural-border-color' : 'border-t'}`}>
                  <h4 className={`font-medium mb-2 ${isNeuralTheme ? 'text-neural-electric-blue' : 'text-gray-900'}`}>Rate this support</h4>
                  <div className="flex items-center space-x-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className={`text-2xl ${star <= rating ? 'text-yellow-400' : (isNeuralTheme ? 'text-neural-text-color' : 'text-gray-300')}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Additional feedback (optional)"
                    className={`w-full p-2 rounded-lg mb-2 ${isNeuralTheme ? 'neural-input' : 'border'}`}
                    rows={3}
                  />
                  <button
                    onClick={submitRating}
                    disabled={rating === 0}
                    className={isNeuralTheme ? "neural-button disabled:opacity-50" : "px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"}
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
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 mx-auto ${isNeuralTheme ? 'border-neural-electric-blue' : 'border-blue-600'}`}></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isNeuralTheme ? 'text-neural-text-color' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className={`text-2xl font-bold ${isNeuralTheme ? 'text-neural-electric-blue' : 'text-gray-900'}`}>Support Tickets</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className={isNeuralTheme ? "neural-button flex items-center" : "flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"}
        >
          <Plus size={20} className={`mr-2 ${isNeuralTheme ? 'neural-icon' : ''}`} />
          New Ticket
        </button>
      </div>

      {/* Filters */}
      <div className={isNeuralTheme ? "neural-card flex items-center space-x-4 p-4" : "flex items-center space-x-4 bg-white p-4 rounded-lg shadow"}>
        <div className="flex-1">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${isNeuralTheme ? 'neural-icon' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search tickets..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              className={`w-full pl-10 pr-4 py-2 rounded-lg ${isNeuralTheme ? 'neural-input' : 'border'}`}
            />
          </div>
        </div>
        <select
          value={filters.status}
          onChange={(e) => setFilters({...filters, status: e.target.value})}
          className={isNeuralTheme ? "neural-input" : "px-3 py-2 border rounded-lg"}
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
          className={isNeuralTheme ? "neural-input" : "px-3 py-2 border rounded-lg"}
        >
          <option value="">All Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Urgent">Urgent</option>
        </select>
      </div>

      {/* Tickets List */}
      <div className={isNeuralTheme ? "neural-card overflow-hidden" : "bg-white rounded-lg shadow overflow-hidden"}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={isNeuralTheme ? "bg-neural-card-background" : "bg-gray-50"}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-500'}`}>
                  Ticket
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-500'}`}>
                  Subject
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-500'}`}>
                  Status
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-500'}`}>
                  Priority
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-500'}`}>
                  Created
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-500'}`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`${isNeuralTheme ? 'bg-neural-card-background divide-neural-border-color' : 'bg-white divide-y divide-gray-200'}`}>
              {Array.isArray(tickets) && tickets.length > 0 ? tickets.map((ticket) => (
                <tr key={ticket._id} className={isNeuralTheme ? "hover:bg-neural-background-light" : "hover:bg-gray-50"}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${isNeuralTheme ? 'text-neural-electric-blue' : 'text-gray-900'}`}>
                      #{ticket.ticketNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`text-sm ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-900'}`}>{ticket.subject}</div>
                    <div className={`text-sm truncate max-w-xs ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-500'}`}>
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
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-500'}`}>
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => fetchTicketDetails(ticket._id)}
                        className={isNeuralTheme ? "text-neural-aqua-gradient-start hover:text-neural-electric-blue" : "text-blue-600 hover:text-blue-900"}
                        title="View Details"
                      >
                        <Eye size={16} className={isNeuralTheme ? 'neural-icon' : ''} />
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
                            className={isNeuralTheme ? "text-neural-aqua-gradient-start hover:text-neural-electric-blue" : "text-green-600 hover:text-green-900"}
                            title="Edit Ticket"
                          >
                            <Edit size={16} className={isNeuralTheme ? 'neural-icon' : ''} />
                          </button>
                          <button
                            onClick={() => handleDeleteTicket(ticket._id)}
                            className={isNeuralTheme ? "text-neural-neon-purple hover:text-red-500" : "text-red-600 hover:text-red-900"}
                            title="Delete Ticket"
                          >
                            <Trash2 size={16} className={isNeuralTheme ? 'neural-icon' : ''} />
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
          <div className={`text-center py-12 ${isNeuralTheme ? 'text-neural-text-color' : ''}`}>
            <LifeBuoy className={`mx-auto h-12 w-12 ${isNeuralTheme ? 'neural-icon' : 'text-gray-400'}`} />
            <h3 className={`mt-2 text-sm font-medium ${isNeuralTheme ? 'text-neural-electric-blue' : 'text-gray-900'}`}>No tickets</h3>
            <p className={`mt-1 text-sm ${isNeuralTheme ? 'text-neural-text-color' : 'text-gray-500'}`}>Get started by creating a new support ticket.</p>
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
