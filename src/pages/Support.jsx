import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { supportAPI } from '../services/api';
import { LifeBuoy, Ticket, Plus, Send, List, MessageSquare, X, Shield, Tag, Clock, User } from 'lucide-react';

const Support = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await supportAPI.getAgentTickets();
      const data = response.data || {};
      setTickets(data.data || []);
    } catch (error) {
      toast.error('Failed to fetch support tickets.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (data) => {
    try {
      await supportAPI.createTicket(data);
      toast.success('Support ticket created successfully!');
      reset();
      setShowCreateModal(false);
      fetchTickets();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create ticket.');
    }
  };

  const handleSelectTicket = async (ticketId) => {
    if (selectedTicket?._id === ticketId) {
      setSelectedTicket(null);
      return;
    }
    try {
      const response = await supportAPI.getTicketById(ticketId);
      setSelectedTicket(response.data.data);
    } catch (error) {
      toast.error('Failed to load ticket details.');
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    try {
      const response = await supportAPI.addMessage(selectedTicket._id, { message: replyMessage });
      setSelectedTicket(response.data.data);
      setReplyMessage('');
      toast.success('Reply sent!');
      fetchTickets(); // Refresh list to show updated timestamp
    } catch (error) {
      toast.error('Failed to send reply.');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      open: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      closed: 'bg-gray-100 text-gray-800',
      resolved: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center"><LifeBuoy className="mr-2" /> Help Center</h1>
        <button onClick={() => setShowCreateModal(true)} className="btn btn-primary flex items-center">
          <Plus className="h-4 w-4 mr-2" /> Create Ticket
        </button>
      </div>

      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center"><List className="mr-2" /> Your Tickets</h3>
        </div>
        {loading ? <p className="p-6">Loading your tickets...</p> : (
          <div className="divide-y divide-gray-200">
            {tickets.length === 0 ? (
              <p className="p-6 text-center text-gray-500">You have not created any support tickets yet.</p>
            ) : (
              tickets.map(ticket => (
                <div key={ticket._id}>
                  <div onClick={() => handleSelectTicket(ticket._id)} className="p-6 cursor-pointer hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800">{ticket.subject}</p>
                        <p className="text-sm text-gray-500">Ticket ID: {ticket.ticketId}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(ticket.status)}`}>{ticket.status}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-gray-400 mt-2">
                      <span>Priority: {ticket.priority}</span>
                      <span>Category: {ticket.category}</span>
                      <span>Last updated: {new Date(ticket.updatedAt).toLocaleString()}</span>
                    </div>
                  </div>
                  {selectedTicket?._id === ticket._id && (
                    <div className="bg-gray-50 p-4 border-t">
                      <div className="space-y-4 max-h-60 overflow-y-auto mb-4 pr-2">
                        {selectedTicket.messages.map(msg => (
                          <div key={msg._id} className={`flex ${msg.sender.role === 'super_admin' ? 'justify-start' : 'justify-end'}`}>
                            <div className={`max-w-lg p-3 rounded-lg ${msg.sender.role === 'super_admin' ? 'bg-white border' : 'bg-blue-500 text-white'}`}>
                              <p className="font-bold text-sm">{msg.sender.name} <span className="text-xs font-normal opacity-70">({msg.sender.role === 'super_admin' ? 'Support' : 'You'})</span></p>
                              <p>{msg.message}</p>
                              <p className="text-xs text-right mt-1 opacity-70">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <form onSubmit={handleReply} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                          className="input flex-1"
                          placeholder="Type your reply..."
                        />
                        <button type="submit" className="btn btn-primary p-2"><Send /></button>
                      </form>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold flex items-center"><Ticket className="mr-2" /> Create a New Support Ticket</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
            </div>
            <form onSubmit={handleSubmit(handleCreateTicket)} className="p-6 space-y-4">
              <div>
                <label className="label">Subject *</label>
                <input {...register('subject', { required: 'Subject is required' })} className="input" />
                {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Category *</label>
                  <select {...register('category', { required: 'Category is required' })} className="input">
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Issue</option>
                    <option value="billing">Billing Question</option>
                    <option value="feedback">Feedback</option>
                  </select>
                  {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                </div>
                <div>
                  <label className="label">Priority *</label>
                  <select {...register('priority', { required: 'Priority is required' })} className="input">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                  {errors.priority && <p className="text-red-500 text-sm mt-1">{errors.priority.message}</p>}
                </div>
              </div>
              <div>
                <label className="label">Message *</label>
                <textarea {...register('message', { required: 'Message is required' })} className="input" rows="4"></textarea>
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
              </div>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Support;