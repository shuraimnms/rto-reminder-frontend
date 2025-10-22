import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, User as UserIcon, Loader2, Calendar, Car, ArrowUpCircle, ArrowDownCircle, CheckCircle, XCircle, Phone, Mail } from 'lucide-react';
import { assistantAPI } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hello! I'm your RTO Assistant. How can I help you today?", renderType: 'talk' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState(null);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { from: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await assistantAPI.query({ query: inputValue, context });
      const botResponse = response.data.data;
      setContext(response.data.context); // Update context for next message

      if (botResponse.action === 'navigate') {
        setMessages(prev => [...prev, { from: 'bot', text: botResponse.message }]);
        toast.success("Navigating...");
        navigate(botResponse.payload.path);
        setIsOpen(false);
      } else if (botResponse.action === 'login_prompt') {
        const botMessage = {
          from: 'bot',
          text: botResponse.message,
          renderType: 'login_prompt'
        };
        setMessages(prev => [...prev, botMessage]);
      } else if (botResponse.action === 'login_success') {
        setMessages(prev => [...prev, { from: 'bot', text: botResponse.message }]);
        // Store the token and refresh auth state
        if (botResponse.data && botResponse.data.token) {
          localStorage.setItem('authToken', botResponse.data.token);
          window.location.reload(); // Simple way to refresh auth state
        }
      } else if (botResponse.action === 'create_customer_prompt') {
        const botMessage = {
          from: 'bot',
          text: botResponse.message,
          renderType: 'customer_prompt'
        };
        setMessages(prev => [...prev, botMessage]);
      } else if (botResponse.action === 'show_expiring_reminders') {
        const { reminders, days } = botResponse.data;
        const botMessage = {
          from: 'bot',
          text: botResponse.message,
          data: reminders,
          renderType: 'expiring_reminders'
        };
        setMessages(prev => [...prev, botMessage]);
      } else if (botResponse.action === 'show_transactions') {
        const { transactions } = botResponse.data;
        const botMessage = {
          from: 'bot',
          text: botResponse.message,
          data: transactions,
          renderType: 'transactions'
        };
        setMessages(prev => [...prev, botMessage]);
      } else if (botResponse.action === 'show_message_logs') {
        const { logs } = botResponse.data;
        const botMessage = {
          from: 'bot',
          text: botResponse.message,
          data: logs,
          renderType: 'message_logs'
        };
        setMessages(prev => [...prev, botMessage]);
      } else if (botResponse.action === 'show_customer_details') {
        const { customer } = botResponse.data;
        const botMessage = {
          from: 'bot',
          text: botResponse.message,
          data: customer,
          renderType: 'customer_details'
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        setMessages(prev => [...prev, { from: 'bot', text: botResponse.message }]);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.data?.message || error.response?.data?.message || "Sorry, I couldn't connect to my brain. Please try again.";
      setMessages(prev => [...prev, { from: 'bot', text: errorMessage }]);
      setContext(null); // Reset context on error
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessageContent = (msg) => {
    if (msg.renderType === 'expiring_reminders') {
      return (
        <div>
          <p>{msg.text}</p>
          <div className="mt-2 space-y-2 text-sm">
            {msg.data.length > 0 ? msg.data.map(reminder => (
              <div key={reminder._id} className="p-3 bg-gray-100 rounded-lg">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-gray-800">{reminder.customer.name}</p>
                  <Link to={`/reminders/${reminder._id}`} className="text-xs bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600">
                    Details
                  </Link>
                </div>
                <div className="flex items-center text-gray-600 mt-1">
                  <Car size={14} className="mr-2" />
                  <span>{reminder.customer.vehicle_number}</span>
                </div>
                <div className="flex items-center text-red-600 mt-1">
                  <Calendar size={14} className="mr-2" />
                  <span className="font-semibold">Expires: {new Date(reminder.expiry_date).toLocaleDateString()}</span>
                </div>
              </div>
            )) : (
              <p className="text-gray-500">No reminders found for this period.</p>
            )}
          </div>
        </div>
      );
    }
    if (msg.renderType === 'transactions') {
      return (
        <div>
          <p>{msg.text}</p>
          <div className="mt-2 space-y-2 text-sm">
            {msg.data.length > 0 ? msg.data.map(tx => (
              <div key={tx._id} className="p-3 bg-gray-100 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {tx.amount > 0 ? (
                      <ArrowDownCircle size={16} className="mr-2 text-green-500" />
                    ) : (
                      <ArrowUpCircle size={16} className="mr-2 text-red-500" />
                    )}
                    <span className="font-semibold text-gray-800">{tx.description}</span>
                  </div>
                  <span className={`font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{tx.amount.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 text-right mt-1">{new Date(tx.createdAt).toLocaleDateString()}</p>
              </div>
            )) : <p className="text-gray-500">No recent transactions found.</p>}
          </div>
        </div>
      )
    }
    if (msg.renderType === 'message_logs') {
      return (
        <div>
          <p>{msg.text}</p>
          <div className="mt-2 space-y-2 text-sm">
            {msg.data.length > 0 ? msg.data.map(log => (
              <div key={log._id} className="p-3 bg-gray-100 rounded-lg">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-800">
                    To: {log.reminder?.customer?.name || log.customer_mobile}
                  </p>
                  <div className={`flex items-center text-xs font-bold ${log.status === 'FAILED' ? 'text-red-600' : 'text-green-600'}`}>
                    {log.status === 'FAILED' ? <XCircle size={14} className="mr-1" /> : <CheckCircle size={14} className="mr-1" />}
                    {log.status}
                  </div>
                </div>
                <p className="text-gray-600 text-xs mt-1">Template: {log.template_name}</p>
                <p className="text-gray-500 text-xs text-right mt-1">{new Date(log.createdAt).toLocaleDateString()}</p>
              </div>
            )) : <p className="text-gray-500">No matching messages found.</p>}
          </div>
        </div>
      );
    }
    if (msg.renderType === 'customer_details') {
      const customer = msg.data;
      return (
        <div>
          <p>{msg.text}</p>
          <div className="mt-2 space-y-2 text-sm">
            <div className="p-3 bg-gray-100 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="font-bold text-gray-800">{customer.name}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${customer.is_active ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                  {customer.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex items-center text-gray-600 mt-2">
                <Phone size={14} className="mr-2" />
                <span>{customer.mobile}</span>
              </div>
              {customer.email && <div className="flex items-center text-gray-600 mt-1">
                <Mail size={14} className="mr-2" />
                <span>{customer.email}</span>
              </div>}
              <div className="flex items-center text-gray-600 mt-1">
                <Car size={14} className="mr-2" />
                <span>{customer.vehicle_number}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return msg.text;
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-transform transform hover:scale-110 z-50"
        aria-label="Open Chatbot"
      >
        <Bot className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-full max-w-sm h-[60vh] bg-white rounded-lg shadow-2xl flex flex-col z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-blue-600 text-white rounded-t-lg">
            <h3 className="font-semibold text-lg">RTO Assistant</h3>
            <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded-full">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex items-start gap-3 ${msg.from === 'user' ? 'justify-end' : ''}`}>
                  {msg.from === 'bot' && <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white"><Bot size={20} /></div>}
                  <div className={`p-3 rounded-lg max-w-xs ${msg.from === 'bot' ? 'bg-gray-200 text-gray-800' : 'bg-blue-500 text-white'}`}>
                    {renderMessageContent(msg)}
                  </div>
                  {msg.from === 'user' && <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600"><UserIcon size={20} /></div>}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white"><Bot size={20} /></div>
                  <div className="p-3 rounded-lg bg-gray-200 text-gray-800">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="input flex-1"
                placeholder="Ask something..."
                disabled={isLoading}
              />
              <button type="submit" className="btn btn-primary p-2" disabled={isLoading || !inputValue.trim()}>
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;