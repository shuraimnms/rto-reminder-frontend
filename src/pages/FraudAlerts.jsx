import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  AlertTriangle,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Activity,
  Search,
  Filter
} from 'lucide-react';

const FraudAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    status: 'active',
    severity: ''
  });

  useEffect(() => {
    fetchFraudAlerts();
  }, [filters]);

  const fetchFraudAlerts = async () => {
    try {
      const response = await adminAPI.getFraudAlerts(filters);
      setAlerts(response.data.alerts);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Failed to load fraud alerts');
      console.error('Fraud alerts error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resolveAlert = async (alertId) => {
    try {
      const resolutionNotes = prompt('Enter resolution notes:');
      if (!resolutionNotes) return;

      await adminAPI.resolveFraudAlert(alertId, { resolutionNotes });
      toast.success('Alert resolved successfully');
      fetchFraudAlerts();
    } catch (error) {
      toast.error('Failed to resolve alert');
      console.error('Resolve alert error:', error);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-700 bg-red-100 border-red-200';
      case 'high': return 'text-orange-700 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-blue-700 bg-blue-100 border-blue-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-red-700 bg-red-100';
      case 'investigated': return 'text-yellow-700 bg-yellow-100';
      case 'resolved': return 'text-green-700 bg-green-100';
      case 'dismissed': return 'text-gray-700 bg-gray-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getAlertTypeIcon = (alertType) => {
    switch (alertType) {
      case 'HIGH_MESSAGE_VOLUME':
        return <Activity className="h-4 w-4" />;
      case 'UNUSUAL_ACTIVITY':
        return <AlertTriangle className="h-4 w-4" />;
      case 'SUSPICIOUS_LOGIN':
        return <User className="h-4 w-4" />;
      case 'WALLET_ANOMALY':
        return <Shield className="h-4 w-4" />;
      case 'BULK_OPERATION':
        return <Activity className="h-4 w-4" />;
      case 'FAILED_ATTEMPTS':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const formatAlertType = (type) => {
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key === 'page' ? value : 1
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Fraud Alerts</h1>
          <p className="mt-2 text-gray-600">Monitor suspicious activities and security threats</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Active Alerts</h3>
                <p className="text-2xl font-bold text-red-600">
                  {alerts.filter(a => a.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">High Severity</h3>
                <p className="text-2xl font-bold text-orange-600">
                  {alerts.filter(a => a.severity === 'high' || a.severity === 'critical').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Resolved</h3>
                <p className="text-2xl font-bold text-green-600">
                  {alerts.filter(a => a.status === 'resolved').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">This Week</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {alerts.filter(a => {
                    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                    return new Date(a.triggeredAt) > weekAgo;
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="investigated">Investigated</option>
                <option value="resolved">Resolved</option>
                <option value="dismissed">Dismissed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
              <select
                value={filters.severity}
                onChange={(e) => handleFilterChange('severity', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Limit</label>
              <select
                value={filters.limit}
                onChange={(e) => handleFilterChange('limit', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="10">10 per page</option>
                <option value="20">20 per page</option>
                <option value="50">50 per page</option>
              </select>
            </div>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert._id} className="bg-white rounded-lg shadow border-l-4 border-red-500 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-full ${getSeverityColor(alert.severity)}`}>
                    {getAlertTypeIcon(alert.alertType)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {formatAlertType(alert.alertType)}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(alert.severity)}`}>
                        {alert.severity.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(alert.status)}`}>
                        {alert.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-3">{alert.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                      <div>
                        <strong>Agent:</strong> {alert.agent?.name || 'Unknown'}
                      </div>
                      <div>
                        <strong>Triggered:</strong> {new Date(alert.triggeredAt).toLocaleString()}
                      </div>
                      {alert.resolvedAt && (
                        <>
                          <div>
                            <strong>Resolved:</strong> {new Date(alert.resolvedAt).toLocaleString()}
                          </div>
                          <div>
                            <strong>Resolved By:</strong> {alert.resolvedBy?.name || 'Unknown'}
                          </div>
                        </>
                      )}
                    </div>

                    {alert.details && Object.keys(alert.details).length > 0 && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-md">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Details:</h4>
                        <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                          {JSON.stringify(alert.details, null, 2)}
                        </pre>
                      </div>
                    )}

                    {alert.resolutionNotes && (
                      <div className="mt-3 p-3 bg-green-50 rounded-md">
                        <h4 className="text-sm font-medium text-green-700 mb-2">Resolution Notes:</h4>
                        <p className="text-sm text-green-600">{alert.resolutionNotes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {alert.status === 'active' && (
                  <button
                    onClick={() => resolveAlert(alert._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Resolve
                  </button>
                )}
              </div>
            </div>
          ))}

          {alerts.length === 0 && (
            <div className="text-center py-12">
              <Shield className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No fraud alerts found</h3>
              <p className="mt-1 text-sm text-gray-500">All systems appear normal.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleFilterChange('page', pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => handleFilterChange('page', pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FraudAlerts;
