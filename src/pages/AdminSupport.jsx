import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import toast from 'react-hot-toast';
import { LifeBuoy, User, Clock, Tag, Shield, MessageSquare, Send } from 'lucide-react';

const AdminSupport = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllTickets();
      const data = response.data || {};
      setTickets(data.data || []);
    } catch (error) {
      toast.error('Failed to load support tickets.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTicket = async (ticketId) => {
    try {
      const response = await adminAPI.getTicketDetails(ticketId);
      setSelectedTicket(response.data.data);
    } catch (error) {
      toast.error('Failed to load ticket details.');
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    try {
      const response = await adminAPI.addAdminReply(selectedTicket._id, { message: replyMessage });
      setSelectedTicket(response.data.data);
      setReplyMessage('');
      toast.success('Reply sent!');
      fetchTickets(); // Refresh list to show updated timestamp
    } catch (error) {
      toast.error('Failed to send reply.');
    }
  };

  const handleUpdateStatus = async (status) => {
    try {
      const response = await adminAPI.updateTicket(selectedTicket._id, { status });
      setSelectedTicket(prev => ({ ...prev, status: response.data.data.status }));
      toast.success(`Ticket status updated to ${status}`);
      fetchTickets(); // Refresh list
    } catch (error) {
      toast.error('Failed to update status.');
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
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Ticket List */}
      <div className="w-1/3 border-r overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold flex items-center"><LifeBuoy className="mr-2" /> Support Tickets</h2>
        </div>
        {loading ? <p className="p-4">Loading tickets...</p> : (
          <ul>
            {tickets.map(ticket => (
              <li key={ticket._id} onClick={() => handleSelectTicket(ticket._id)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${selectedTicket?._id === ticket._id ? 'bg-blue-50' : ''}`}>
                <div className="flex justify-between items-center">
                  <p className="font-semibold truncate">{ticket.subject}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(ticket.status)}`}>{ticket.status}</span>
                </div>
                <p className="text-sm text-gray-600">From: {ticket.agent.name}</p>
                <p className="text-xs text-gray-400 mt-1">Last updated: {new Date(ticket.updatedAt).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Ticket Details */}
      <div className="w-2/3 flex flex-col">
        {selectedTicket ? (
          <>
            <div className="p-4 border-b">
              <h3 className="text-xl font-bold">{selectedTicket.subject}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                <span className="flex items-center"><User className="mr-1 h-4 w-4" /> {selectedTicket.agent.name}</span>
                <span className="flex items-center"><Clock className="mr-1 h-4 w-4" /> {new Date(selectedTicket.createdAt).toLocaleString()}</span>
                <span className="flex items-center"><Tag className="mr-1 h-4 w-4" /> {selectedTicket.category}</span>
                <span className="flex items-center"><Shield className="mr-1 h-4 w-4" /> {selectedTicket.priority}</span>
              </div>
              <div className="mt-2">
                Status:
                <select value={selectedTicket.status} onChange={(e) => handleUpdateStatus(e.target.value)}
                  className="ml-2 p-1 border rounded-md text-sm">
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
              {selectedTicket.messages.map(msg => (
                <div key={msg._id} className={`flex ${msg.sender._id === selectedTicket.agent._id ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-lg p-3 rounded-lg ${msg.sender._id === selectedTicket.agent._id ? 'bg-white border' : 'bg-blue-500 text-white'}`}>
                    <p className="font-bold text-sm">{msg.sender.name}</p>
                    <p>{msg.message}</p>
                    <p className="text-xs text-right mt-1 opacity-70">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t">
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
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageSquare className="mx-auto h-12 w-12" />
              <p>Select a ticket to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSupport;