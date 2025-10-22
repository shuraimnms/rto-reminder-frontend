import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { adminAPI } from '../../services/api';
import {
  Users,
  MessageSquare,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  UserCog,
  BarChart3,
  PieChart,
  LineChart,
  AreaChart,
  RotateCcw,
  Download,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line,
  AreaChart as RechartsAreaChart,
  Area
} from 'recharts';
import toast from 'react-hot-toast';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const StatCard = ({ title, value, icon: Icon, color, subtitle, trend }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
      {trend && (
        <div className={`flex items-center ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
          <TrendingUp className={`h-4 w-4 ${trend < 0 ? 'rotate-180' : ''}`} />
          <span className="text-sm font-medium ml-1">{Math.abs(trend)}%</span>
        </div>
      )}
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [walletAnalytics, setWalletAnalytics] = useState(null);
  const [revenueAnalytics, setRevenueAnalytics] = useState(null);
  const [showWalletDetails, setShowWalletDetails] = useState(false);
  const [showRevenueDetails, setShowRevenueDetails] = useState(false);
  const { user } = useAuth();

  const loadDashboardData = async () => {
    try {
      const response = await adminAPI.getDashboardStats();
      setStats(response.data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Dashboard error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const loadWalletAnalytics = async () => {
    try {
      const response = await adminAPI.getWalletUsageAnalytics();
      setWalletAnalytics(response.data);
    } catch (error) {
      console.error('Wallet analytics error:', error);
    }
  };

  const loadRevenueAnalytics = async () => {
    try {
      const response = await adminAPI.getRevenueAnalytics();
      setRevenueAnalytics(response.data);
    } catch (error) {
      console.error('Revenue analytics error:', error);
    }
  };

  const handleResetWalletUsage = async () => {
    if (window.confirm('Are you sure you want to reset all wallet usage data? This action cannot be undone.')) {
      try {
        await adminAPI.resetWalletUsage();
        toast.success('Wallet usage data has been reset successfully');
        loadDashboardData();
        setWalletAnalytics(null);
        setShowWalletDetails(false);
      } catch (error) {
        console.error('Reset wallet usage error:', error);
        toast.error('Failed to reset wallet usage data');
      }
    }
  };

  const handleResetTotalRevenue = async () => {
    if (window.confirm('Are you sure you want to reset all revenue data? This action cannot be undone.')) {
      try {
        await adminAPI.resetTotalRevenue();
        toast.success('Total revenue data has been reset successfully');
        loadDashboardData();
        setRevenueAnalytics(null);
        setShowRevenueDetails(false);
      } catch (error) {
        console.error('Reset revenue error:', error);
        toast.error('Failed to reset revenue data');
      }
    }
  };

  const handleExportWalletUsage = async () => {
    try {
      const response = await fetch(adminAPI.exportWalletUsage());
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'wallet_usage_export.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Wallet usage data exported successfully');
    } catch (error) {
      console.error('Export wallet usage error:', error);
      toast.error('Failed to export wallet usage data');
    }
  };

  const handleExportRevenue = async () => {
    try {
      const response = await fetch(adminAPI.exportRevenue());
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'revenue_export.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Revenue data exported successfully');
    } catch (error) {
      console.error('Export revenue error:', error);
      toast.error('Failed to export revenue data');
    }
  };

  const toggleWalletDetails = () => {
    setShowWalletDetails(!showWalletDetails);
    if (!showWalletDetails && !walletAnalytics) {
      loadWalletAnalytics();
    }
  };

  const toggleRevenueDetails = () => {
    setShowRevenueDetails(!showRevenueDetails);
    if (!showRevenueDetails && !revenueAnalytics) {
      loadRevenueAnalytics();
    }
  };

  useEffect(() => {
    loadDashboardData();

    // Set up polling for real-time updates
    const interval = setInterval(loadDashboardData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    loadDashboardData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const messageStatusData = stats?.messageStats ? Object.entries(stats.messageStats).map(([status, count]) => ({
    name: status,
    value: count
  })) : [];

  const messagesPerDayData = stats?.messagesPerDay || [];
  const successRateData = stats?.successRateTrend || [];
  const walletUsageData = stats?.walletUsageData || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, Super Admin</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Agents"
          value={stats?.overview?.totalAgents || 0}
          icon={UserCog}
          color="bg-blue-600"
          subtitle="Active agents"
        />
        <StatCard
          title="Total Customers"
          value={stats?.overview?.totalCustomers || 0}
          icon={Users}
          color="bg-green-600"
          subtitle="Across all agents"
        />
        <StatCard
          title="Total Messages"
          value={stats?.overview?.totalMessages || 0}
          icon={MessageSquare}
          color="bg-purple-600"
          subtitle="All time"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats?.overview?.totalRevenue || 0}`}
          icon={DollarSign}
          color="bg-yellow-600"
          subtitle="From message charges"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Message Status Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Message Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={messageStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {messageStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>

        {/* Messages Per Day */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Messages Per Day</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={messagesPerDayData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Success Rate Trend */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Success Rate Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsLineChart data={successRateData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="rate" stroke="#8884d8" strokeWidth={2} />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>

        {/* Wallet Usage */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Wallet Usage</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsAreaChart data={walletUsageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="usage" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            </RechartsAreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {stats?.activityData?.length > 0 ? (
              stats.activityData.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Activity className="h-4 w-4 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No recent activity</p>
            )}
          </div>
        </div>

        {/* New Agents */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">New Agents</h3>
          <div className="space-y-3">
            {stats?.recentAgents?.length > 0 ? (
              stats.recentAgents.slice(0, 5).map((agent) => (
                <div key={agent._id} className="flex items-center space-x-3">
                  <UserCog className="h-4 w-4 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{agent.name}</p>
                    <p className="text-xs text-gray-500">{new Date(agent.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No recent agents</p>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {stats?.recentTransactions?.length > 0 ? (
              stats.recentTransactions.slice(0, 5).map((transaction) => (
                <div key={transaction._id} className="flex items-center space-x-3">
                  <DollarSign className="h-4 w-4 text-yellow-600" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">₹{transaction.amount}</p>
                    <p className="text-xs text-gray-500">{new Date(transaction.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No recent transactions</p>
            )}
          </div>
        </div>
      </div>

      {/* System Health & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Health */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Status</span>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">Good</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Services</span>
              <span className="text-sm text-gray-900">All services running</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Reminders</span>
              <span className="text-sm text-gray-900">{stats?.overview?.totalReminders || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Pending Tasks</span>
              <span className="text-sm text-gray-900">0</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/admin/agents"
              className="flex items-center p-3 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <UserCog className="h-5 w-5 mx-auto text-gray-600" />
              <span className="text-xs mt-1 block">Manage Agents</span>
            </Link>
            <Link
              to="/admin/customers"
              className="flex items-center p-3 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <Users className="h-5 w-5 mx-auto text-gray-600" />
              <span className="text-xs mt-1 block">View Customers</span>
            </Link>
            <Link
              to="/admin/messages"
              className="flex items-center p-3 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-purple-500 hover:bg-purple-50 transition-colors"
            >
              <MessageSquare className="h-5 w-5 mx-auto text-gray-600" />
              <span className="text-xs mt-1 block">Monitor Messages</span>
            </Link>
            <Link
              to="/admin/settings"
              className="flex items-center p-3 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-yellow-500 hover:bg-yellow-50 transition-colors"
            >
              <Activity className="h-5 w-5 mx-auto text-gray-600" />
              <span className="text-xs mt-1 block">System Settings</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wallet Usage Analytics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Wallet Usage Analytics</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleWalletDetails}
                className="flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {showWalletDetails ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                {showWalletDetails ? 'Hide' : 'View'} Details
              </button>
              <button
                onClick={handleExportWalletUsage}
                className="flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </button>
              <button
                onClick={handleResetWalletUsage}
                className="flex items-center px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </button>
            </div>
          </div>
          {showWalletDetails && (
            <div className="space-y-4">
              {walletAnalytics ? (
                <div className="text-sm text-gray-600">
                  <p>Total Wallet Usage: ₹{walletAnalytics.totalUsage || 0}</p>
                  <p>Average Daily Usage: ₹{walletAnalytics.averageDaily || 0}</p>
                  <p>Peak Usage Day: {walletAnalytics.peakDay || 'N/A'}</p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Loading analytics...</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Revenue Analytics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Analytics</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleRevenueDetails}
                className="flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {showRevenueDetails ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                {showRevenueDetails ? 'Hide' : 'View'} Details
              </button>
              <button
                onClick={handleExportRevenue}
                className="flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </button>
              <button
                onClick={handleResetTotalRevenue}
                className="flex items-center px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </button>
            </div>
          </div>
          {showRevenueDetails && (
            <div className="space-y-4">
              {revenueAnalytics ? (
                <div className="text-sm text-gray-600">
                  <p>Total Revenue: ₹{revenueAnalytics.totalRevenue || 0}</p>
                  <p>Average Daily Revenue: ₹{revenueAnalytics.averageDaily || 0}</p>
                  <p>Peak Revenue Day: {revenueAnalytics.peakDay || 'N/A'}</p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Loading analytics...</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
