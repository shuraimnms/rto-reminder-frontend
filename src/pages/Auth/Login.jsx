import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeSelector from '../../components/ThemeSelector';
import NotificationBell from   '../../components/NotificationBell'; // Keep for structure, though might not be functional on login
import Chatbot from '../../components/Chatbot';
import AnimatedBackground from '../../components/AnimatedBackground';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

// Icons for sidebar and header
import {
  Home, Users, Bell, MessageSquare, CreditCard, Settings, Menu, X, LogOut, Wallet, Shield, UserCog, BookOpen, FileText, AlertTriangle, LifeBuoy
} from 'lucide-react';

// Icons for login form
import { Mail as MailIcon, Lock, Eye, EyeOff } from 'lucide-react'; // Renamed Mail to avoid conflict

// Mock API service for notifications (if needed, or remove if not applicable to login)
// const notificationAPI = { getNotifications: async () => ({ data: { notifications: [] } }), clearAll: async () => {} };

const Login = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]); // Placeholder
  const [showPassword, setShowPassword] = useState(false);
  const { user, logout, isAdmin, authChecked, login } = useAuth();
  const { currentTheme } = useTheme();
  const isAiTheme = currentTheme === 'ai';
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  // --- Notification fetching logic (adapted from Layout.jsx, simplified for login context) ---
  useEffect(() => {
    // For login page, notifications are generally not fetched or displayed.
    // If user is null, we don't fetch notifications.
    if (!user) return;

    // Placeholder for notification fetching if needed in future
    const fetchNotifications = async () => {
      // Mock API call or actual if available
      // const response = await notificationAPI.getNotifications();
      // const apiNotifications = response.data?.notifications.map(notification => ({ ... }));
      const apiNotifications = []; // Placeholder
      setNotifications(apiNotifications);
    };

    if (authChecked && user && user.name) {
      fetchNotifications();
    }
  }, [user?.wallet_balance, user?.name, authChecked, user]); // Added user to dependency array

  const handleMarkAllRead = () => { /* ... */ };
  const handleClearAll = async () => { /* ... */ };
  // --- End Notification logic ---

  // --- Navigation ---
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
    { name: 'Notifications', href: '/admin/notifications', icon: MailIcon }, // Using Mail icon from lucide-react
    { name: 'Support', href: '/admin/support', icon: LifeBuoy },
    { name: 'Audit Logs', href: '/admin/audit-logs', icon: FileText },
    { name: 'Fraud Alerts', href: '/admin/fraud-alerts', icon: AlertTriangle },
    { name: 'Payment Integration Settings', href: '/admin/payment-settings', icon: CreditCard },
    { name: 'Global Settings', href: '/admin/settings', icon: Shield },
  ];

  // For login page, we show admin navigation as requested by "admin login" context.
  const currentNavigation = adminNavigation;

  const isActive = (path) => {
    if (path.endsWith('dashboard')) return location.pathname === path;
    return location.pathname.startsWith(path);
  };
  // --- End Navigation ---

  // --- Login Form Logic ---
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await login(data.email, data.password);
      if (result.success) {
        // Navigate to dashboard or admin dashboard based on role
        // If user is admin, navigate to admin dashboard, otherwise to general dashboard
        if (isAdmin) { // Assuming isAdmin is updated after login
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        // Error is likely handled by toast in AuthContext
        console.error("Login failed:", result.error);
      }
    } catch (error) {
      console.error('An unexpected error occurred during login:', error);
    } finally {
      setLoading(false);
    }
  };
  // --- End Login Form Logic ---

  return (
    <div className={`flex h-screen theme-transition ${isAiTheme ? 'theme-ai' : ''}`} style={{ backgroundColor: 'var(--color-background)' }}>
      {isAiTheme && <AnimatedBackground />}
      {/* Sidebar - Only show if user is logged in */}
      {user && (
        <div className={`fixed inset-y-0 left-0 z-50 w-64 shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0 transition duration-200 ease-in-out ${isAiTheme ? 'card-ai' : ''}`}
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <div className="flex items-center justify-between h-16 px-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)' }}>
              <Bell className="h-5 w-5 text-white" />
            </div>
            <span className="ml-2 text-xl font-bold" style={{ color: 'var(--color-text)' }}>RTO Reminder</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 rounded-md" style={{ color: 'var(--color-text-secondary)' }}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-8 px-4 mb-24">
          <div className="space-y-2">
            {currentNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`sidebar-link flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive(item.href)
                    ? (isAiTheme ? 'bg-ai-neural-blue/20 text-ai-text-bright lightning-border' : 'bg-blue-600 text-white shadow-md')
                    : (isAiTheme ? 'text-ai-text-dim hover:bg-ai-mist' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900')
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

        {/* User Info & Logout - Conditionally rendered if user is logged in */}
        {user && (
          <div className="absolute bottom-0 left-0 right-0 p-4" style={{ borderTop: '1px solid var(--color-border)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Wallet className="h-4 w-4" style={{ color: 'var(--color-success)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                  ₹{(user?.wallet_balance || 0).toFixed(2)}
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
              style={{ color: 'var(--color-text)', backgroundColor: 'transparent' }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = 'rgba(var(--color-border), 0.5)')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        )}
      </div>
      )}

      {/* Main Content */}
      <div className={`${user ? 'flex-1' : 'w-full'} flex flex-col overflow-hidden`}>
        {/* Header */}
        <header className={isAiTheme ? "card-ai" : "shadow-sm"} style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-md" style={{ color: 'var(--color-text-secondary)' }}>
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex-1 flex justify-between items-center">
              <h1 className="text-2xl font-semibold" style={{ color: 'var(--color-text)' }}>
                Sign In {/* Changed title for login page */}
              </h1>

              <div className="flex items-center space-x-4">
                {/* NotificationBell might not be relevant for login page */}
                {/* <NotificationBell notifications={notifications} onMarkAllRead={handleMarkAllRead} onClearAll={handleClearAll} /> */}
                <ThemeSelector />
                {/* Welcome message shown if user is null */}
                {!user && (
                  <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    Welcome, <span className="font-medium" style={{ color: 'var(--color-text)' }}>Guest</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content - This is where the login form will be rendered */}
        <main className="flex-1 overflow-auto" style={{ backgroundColor: 'var(--color-background)' }}>
          {/* Original Login Form Content */}
          <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"> {/* Removed bg-gray-50 to use theme background */}
            <div className="max-w-md w-full space-y-8">
              <div>
                <div className="mx-auto h-12 w-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)' }}> {/* Use theme primary color */}
                  <Lock className="h-6 w-6 text-white" />
                </div>
                <h2 className="mt-6 text-center text-2xl font-extrabold" style={{ color: 'var(--color-text)' }}> {/* Adjusted text size and color */}
                  Sign in to your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 mb-4"> {/* Added mb-4 for margin */}
                  Or{' '}
                  <Link
                    to="/register"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    create a new account
                  </Link>
                </p>
              </div>

              <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700" style={{ color: 'var(--color-text-secondary)' }}> {/* Adjusted color */}
                      Email address
                    </label>
                    <div className="mt-1 relative">
                      <input
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^\S+@\S+$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        type="email"
                        className="input pl-10" // Assuming 'input' class is defined elsewhere or needs to be styled
                        placeholder="Enter your email"
                        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }} // Basic styling
                      />
                      <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700" style={{ color: 'var(--color-text-secondary)' }}> {/* Adjusted color */}
                      Password
                    </label>
                    <div className="mt-1 relative">
                      <input
                        {...register('password', {
                          required: 'Password is required',
                          minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters'
                          }
                        })}
                        type={showPassword ? 'text' : 'password'}
                        className="input pl-10 pr-10" // Assuming 'input' class is defined elsewhere or needs to be styled
                        placeholder="Enter your password"
                        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }} // Basic styling
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    style={{ backgroundColor: 'var(--color-primary)' }} // Use theme primary color
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      'Sign in'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <Chatbot />
    </div>
  );
};

export default Login;
