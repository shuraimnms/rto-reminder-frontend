import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Send, Users, User } from 'lucide-react';

const AdminNotifications = () => {
  const [target, setTarget] = useState('all');
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await adminAPI.getAllAgents({ limit: 1000 }); // Fetch all agents
        setAgents(response.data.agents);
      } catch (error) {
        toast.error('Failed to fetch agents.');
        console.error('Error fetching agents:', error);
      }
    };

    fetchAgents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !message) {
      toast.error('Title and message are required.');
      return;
    }
    if (target === 'specific' && !selectedAgent) {
      toast.error('Please select a specific agent.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title,
        message,
        target,
        agentId: target === 'specific' ? selectedAgent : undefined,
      };
      await adminAPI.sendNotification(payload);

      toast.success('Notification sent successfully!');
      setTitle('');
      setMessage('');
      setSelectedAgent('');
      setTarget('all');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send notification.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Send Notification</h1>
        <p className="mt-2 text-gray-600">Compose and send notifications to agents.</p>
      </div>

      <div className="card p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
            <div className="flex space-x-4">
              <button type="button" onClick={() => setTarget('all')} className={`flex items-center px-4 py-2 rounded-lg border ${target === 'all' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'hover:bg-gray-50'}`}>
                <Users className="h-5 w-5 mr-2" /> All Agents
              </button>
              <button type="button" onClick={() => setTarget('specific')} className={`flex items-center px-4 py-2 rounded-lg border ${target === 'specific' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'hover:bg-gray-50'}`}>
                <User className="h-5 w-5 mr-2" /> Specific Agent
              </button>
            </div>
          </div>

          {target === 'specific' && (
            <div>
              <label htmlFor="agent" className="block text-sm font-medium text-gray-700 mb-2">Select Agent</label>
              <select id="agent" value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)} className="input w-full" required>
                <option value="">-- Select an agent --</option>
                {agents.map(agent => (
                  <option key={agent._id} value={agent._id}>{agent.name} ({agent.email})</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Notification Title</label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="input w-full" placeholder="e.g., System Maintenance Alert" required />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} rows="5" className="input w-full" placeholder="Enter your notification message here..." required />
          </div>

          <div className="flex justify-end">
            <button type="submit" className="btn btn-primary flex items-center" disabled={isSubmitting}>
              {isSubmitting ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div> : <Send className="h-5 w-5 mr-2" />}
              {isSubmitting ? 'Sending...' : 'Send Notification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminNotifications;
