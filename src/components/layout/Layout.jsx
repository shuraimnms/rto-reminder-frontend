import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeSelector from '../ThemeSelector';
import NotificationBell from '../NotificationBell';
import Chatbot from '../Chatbot';
import { format } from 'date-fns';

import { notificationAPI } from '../../services/api';
import {
  Home,
  Users,
  Bell,
  MessageSquare,
  CreditCard,
  Settings,
  Menu,
  X,
  LogOut,
  Wallet,
  Shield,
  UserCog,
  BookOpen,
  Mail,
  FileText,
  AlertTriangle,
  LifeBuoy
} from 'lucide-react';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { user, logout, isAdmin, authChecked } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await notificationAPI.getNotifications();
        const apiNotifications = response.data?.notifications.map(notification => ({
          id: notification._id,
          title: notification.title,
          message: notification.message,
          timestamp: format(new Date(notification.createdAt), 'PPpp'), // Consistent date formatting
          read: notification.isRead,
          type: notification.type || 'info'
        }));

        // Add low balance notification if wallet is low
        if (user?.wallet_balance < 50) {
          const lowBalanceNotification = {
            id: 'low-balance',
            title: 'Low Wallet Balance Alert',
            message: `Your current balance is ₹${user.wallet_balance}. Consider topping up to avoid service interruption.`,
            timestamp: 'Just now',
            read: false,
            type: 'warning'
          };
          apiNotifications.unshift(lowBalanceNotification);
        }

        setNotifications(apiNotifications);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        // Don't show fallback notifications on auth errors
        if (error.message !== 'Unauthorized') {
          // Only show fallback notifications for non-auth errors
          const fallbackNotifications = [];

          // Add low balance notification if wallet is low
          if (user?.wallet_balance < 50) {
            const lowBalanceNotification = {
              id: 'low-balance',
              title: 'Low Wallet Balance Alert',
              message: `Your current balance is ₹${user.wallet_balance}. Consider topping up to avoid service interruption.`,
              timestamp: 'Just now',
              read: false,
              type: 'warning'
            };
            fallbackNotifications.unshift(lowBalanceNotification);
          }

          setNotifications(fallbackNotifications);
        }
      }
    };

    if (authChecked && user && user.name) { // Only fetch if auth is checked and user is properly authenticated
      fetchNotifications();
    }
  }, [user?.wallet_balance, user?.name, authChecked]);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleClearAll = async () => {
    try {
      await notificationAPI.clearAll();
      setNotifications([]);
      toast.success('All notifications cleared successfully');
    } catch (error) {
      toast.error('Failed to clear notifications');
      console.error('Error clearing notifications:', error);
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Customers', href: '/customers', icon: Users },
    { name: 'Reminders', href: '/reminders', icon: Bell },

    { name: 'Billing', href: '/billing', icon: CreditCard },
    { name: 'Message Logs', href: '/message-logs', icon: MessageSquare },
    { name: 'Guidance', href: '/guidance', icon: BookOpen },
    { name: 'Support', href: '/support', icon: LifeBuoy },

    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const adminNavigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
    { name: 'Manage Agents', href: '/admin/agents', icon: UserCog },
    { name: 'All Customers', href: '/admin/customers', icon: Users },
    { name: 'All Messages', href: '/admin/messages', icon: MessageSquare },
    { name: 'Notifications', href: '/admin/notifications', icon: Mail },
    { name: 'Support', href: '/admin/support', icon: LifeBuoy },

    { name: 'Audit Logs', href: '/admin/audit-logs', icon: FileText },
    { name: 'Fraud Alerts', href: '/admin/fraud-alerts', icon: AlertTriangle },
    { name: 'Global Settings', href: '/admin/settings', icon: Shield },
  ];

  const currentNavigation = isAdmin ? adminNavigation : navigation;

  const isActive = (path) => {
    // Use startsWith for parent routes, but exact match for dashboard
    if (path.endsWith('dashboard')) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen theme-transition" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0 transition duration-200 ease-in-out`}
           style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <div className="flex items-center justify-between h-16 px-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)' }}>
              <Bell className="h-5 w-5 text-white" />
            </div>
            <span className="ml-2 text-xl font-bold" style={{ color: 'var(--color-text)' }}>RTO Reminder</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {currentNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`sidebar-link flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Info & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4" style={{ borderTop: '1px solid var(--color-border)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Wallet className="h-4 w-4" style={{ color: 'var(--color-success)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                ₹{user?.wallet_balance || 0}
              </span>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                  style={{ backgroundColor: 'rgba(var(--color-primary), 0.1)', color: 'var(--color-primary)' }}>
              {user?.role?.replace('_', ' ') ?? 'Agent'}
            </span>
          </div>
          <button
            onClick={logout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors"
            style={{
              color: 'var(--color-text)',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(var(--color-border), 0.5)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="shadow-sm" style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex-1 flex justify-between items-center">
              <h1 className="text-2xl font-semibold" style={{ color: 'var(--color-text)' }}>
                {currentNavigation.find(item => isActive(item.href))?.name || 'Dashboard'}
              </h1>

              <div className="flex items-center space-x-4">
                <NotificationBell
                  notifications={notifications}
                  onMarkAllRead={handleMarkAllRead}
                  onClearAll={handleClearAll}
                />
                <ThemeSelector />
                <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Welcome, <span className="font-medium" style={{ color: 'var(--color-text)' }}>{user?.name}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto" style={{ backgroundColor: 'var(--color-background)' }}>
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Chatbot />

    </div>
  );
};

export default Layout;
