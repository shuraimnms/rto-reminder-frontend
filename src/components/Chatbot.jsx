import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Bot, User, X, MessageCircle } from 'lucide-react';
import { chatbotAPI } from '../services/api';
import toast from 'react-hot-toast';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: `Hello! I'm your AI-powered RTO Assistant 🤖

I'm here to help you manage your RTO business effortlessly. I can:

🔔 Handle reminders and notifications
👥 Manage customers and vehicles
📊 Generate reports and analytics
💰 Check wallet balance
💬 Send messages and follow-ups

Try asking me:
• "What can you do?"
• "Show vehicles expiring this week"
• "Check wallet balance"
• "How reminders work"

How can I help you today?`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentFollowUp, setCurrentFollowUp] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await chatbotAPI.sendQuery(userMessage.content, currentFollowUp);

      // Handle navigation actions from the bot
      if (response.type === 'navigation' && response.data?.path) {
        navigate(response.data.path);
        setIsOpen(false); // Close chatbot on navigation
      }

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.response,
        timestamp: new Date(),
        data: response.data,
        followUpAction: response.followUpAction
      };

      setMessages(prev => [...prev, botMessage]);

      // Set the follow-up context for the next message
      setCurrentFollowUp(response.followUpAction || null);

    } catch (error) {
      console.error('Chatbot error:', error);
      toast.error('Failed to get response from chatbot');

      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      setCurrentFollowUp(null); // Reset follow-up on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const formatMessage = (content) => {
    // Split by newlines and wrap each line
    return content.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg transition-all duration-200 ${
          isOpen
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
        style={{ backgroundColor: isOpen ? 'var(--color-error)' : 'var(--color-primary)' }}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <Bot className="h-6 w-6 text-white" />
        )}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-40 w-96 h-[500px] rounded-lg shadow-2xl flex flex-col overflow-hidden"
             style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>

          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b"
               style={{ borderBottom: '1px solid var(--color-border)' }}>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center"
                   style={{ backgroundColor: 'var(--color-primary)' }}>
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>
                  AI RTO Assistant
                </h3>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  Always here to help
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                  style={{
                    backgroundColor: message.type === 'user' ? 'var(--color-primary)' : 'var(--color-background)',
                    color: message.type === 'user' ? 'white' : 'var(--color-text)'
                  }}
                >
                  <div className="flex items-start space-x-2">
                    {message.type === 'bot' && (
                      <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    )}
                    {message.type === 'user' && (
                      <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="text-sm whitespace-pre-wrap">
                      {formatMessage(message.content)}
                    </div>
                  </div>
                  <div className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-3 py-2 max-w-[80%]"
                     style={{ backgroundColor: 'var(--color-background)' }}>
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t" style={{ borderTop: '1px solid var(--color-border)' }}>
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-background)',
                  color: 'var(--color-text)'
                }}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
