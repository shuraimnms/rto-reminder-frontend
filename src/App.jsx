import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { WalletProvider } from './contexts/WalletContext';
import Layout from './components/layout/Layout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Landing from './pages/Landing';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Guidance from './pages/Guidance';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAgents from './pages/AdminAgents';
import AdminSettings from './pages/AdminSettings';
import PaymentSettings from './pages/admin/PaymentSettings';
import AdminAgentDetail from './pages/AdminAgentDetail';
import AdminMessages from './pages/AdminMessages';
import AdminNotifications from './pages/AdminNotifications';
import AdminCustomers from './pages/AdminCustomers';
import AuditLogs from './pages/AuditLogs';
import FraudAlerts from './pages/FraudAlerts';
import Customers from './pages/Customers';
import Reminders from './pages/Reminders';
import Support from './pages/Support';
import AdminSupport from './pages/AdminSupport';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';
import Billing from './pages/Billing';
import MessageLogs from './pages/MessageLogs';
import Settings from './pages/Settings';
import ScrollToTop from './components/ScrollToTop';
import './styles/globals.css';
import './styles/themes.css';

// ---------------- Protected Routes ---------------- //

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/dashboard" />;

  return children;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/dashboard" />;
}

function ProtectedLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

function DashboardRoute() {
  const { isAdmin } = useAuth();
  return isAdmin ? <Navigate to="/admin/dashboard" /> : <Layout><Dashboard /></Layout>;
}

// ---------------- Main App ---------------- //

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <WalletProvider>
          <Router>
            <ScrollToTop />
            <div className="App">
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                }}
              />

              <Routes>
                {/* Public Routes */}
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PublicRoute>
                      <Register />
                    </PublicRoute>
                  }
                />
                <Route path="/" element={<Landing />} />
                <Route path="/features" element={<Features />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />

                {/* Dashboard */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardRoute />
                    </ProtectedRoute>
                  }
                />

                {/* Agent Routes */}
                <Route element={<ProtectedRoute><ProtectedLayout /></ProtectedRoute>}>
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/reminders" element={<Reminders />} />
                  <Route path="/billing" element={<Billing />} />
                  <Route path="/message-logs" element={<MessageLogs />} />
                  <Route path="/payment-success" element={<PaymentSuccess />} />
                  <Route path="/payment-failed" element={<PaymentFailed />} />
                  <Route path="/guidance" element={<Guidance />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>

                {/* Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminRoute>
                        <ProtectedLayout />
                      </AdminRoute>
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="agents" element={<AdminAgents />} />
                  <Route path="agents/:id" element={<AdminAgentDetail />} />
                  <Route path="customers" element={<AdminCustomers />} />
                  <Route path="messages" element={<AdminMessages />} />
                  <Route path="notifications" element={<AdminNotifications />} />
                  <Route path="audit-logs" element={<AuditLogs />} />
                  <Route path="fraud-alerts" element={<FraudAlerts />} />
                  <Route path="support" element={<AdminSupport />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="payment-settings" element={<PaymentSettings />} />
                </Route>
              </Routes>
            </div>
          </Router>
        </WalletProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
