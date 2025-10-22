import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, X, AlertTriangle, Info, Mail } from 'lucide-react';

const NotificationBell = ({ notifications, onMarkAllRead, onClearAll }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'admin':
        return <Mail className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-5 w-5 transform -translate-y-1/2 translate-x-1/2 rounded-full ring-2 ring-white bg-red-500 text-white text-xs flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-64 sm:w-80 md:w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="p-4 border-b border-gray-200" style={{ borderColor: 'var(--color-border)' }}>
            <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>Notifications</h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center py-8 text-sm" style={{ color: 'var(--color-text-secondary)' }}>No new notifications</p>
            ) : (
              notifications.map(notification => (
                <div key={notification.id} className={`p-4 border-b border-gray-100 flex items-start space-x-3 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`} style={{ borderColor: 'var(--color-border)' }}>
                  <div className="flex-shrink-0 pt-1">
                    {getIcon(notification.type)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>{notification.title}</p>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{notification.message}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>{notification.timestamp}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-2 bg-gray-50 border-t border-gray-200 flex justify-between items-center" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
              <button
                onClick={onMarkAllRead}
                className="flex items-center text-xs font-medium text-blue-600 hover:text-blue-800 disabled:opacity-50"
                disabled={unreadCount === 0}
              >
                <Check className="h-4 w-4 mr-1" />
                Mark all as read
              </button>
              <button
                onClick={onClearAll}
                className="flex items-center text-xs font-medium text-red-600 hover:text-red-800"
              >
                <X className="h-4 w-4 mr-1" />
                Clear all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
