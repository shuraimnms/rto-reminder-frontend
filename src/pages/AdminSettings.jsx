  import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { adminAPI } from '../services/api';

const AdminSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [agentRole, setAgentRole] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    const fetchAgentRole = async () => {
      try {
        const response = await adminAPI.getAgentRoleByEmail(user.email);
        setAgentRole(response.data.role);
      } catch (error) {
        console.error('Failed to fetch agent role:', error);
        setError('Failed to fetch agent role');
      }
    };

    if (user?.email) {
      fetchAgentRole();
    }
  }, [user]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getGlobalSettings();
      setSettings(response.data);
    } catch (error) {
      setError('Failed to fetch settings');
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      await adminAPI.updateGlobalSettings(settings);
      setSuccess('Settings updated successfully!');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSettingChange = (category, field, value, subCategory = null) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      if (subCategory) {
        newSettings[category] = {
          ...newSettings[category],
          [subCategory]: {
            ...newSettings[category]?.[subCategory],
            [field]: value,
          },
        };
      } else {
        newSettings[category] = {
          ...newSettings[category],
          [field]: value,
        };
      }
      return newSettings;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="sm:flex sm:items-center mb-8">
          <div className="sm:flex-auto">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Global Settings
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage system-wide settings including MSG91 configuration, pricing, and wallet controls
            </p>
            {agentRole && (
              <p className="mt-2 text-sm text-gray-600">
                Logged in as: <span className="font-semibold">{user.email}</span> (<span className="font-semibold">{agentRole}</span>)
              </p>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {success && (
          <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg shadow-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {success}
            </div>
          </div>
        )}

        <div className="mt-8 space-y-8">
        {/* MSG91 Settings */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">MSG91 Configuration</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Auth Key</label>
                <input
                  type="password"
                  value={settings?.msg91?.authKey || ''}
                  onChange={(e) => handleSettingChange('msg91', 'authKey', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter MSG91 Auth Key"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sender ID</label>
                <input
                  type="text"
                  value={settings?.msg91?.senderId || ''}
                  onChange={(e) => handleSettingChange('msg91', 'senderId', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter Sender ID"
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-900 mb-3">Flow IDs</h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Driving License</label>
                  <input
                    type="text"
                    value={settings?.msg91?.flows?.drivingLicense || ''}
                    onChange={(e) => handleSettingChange('msg91', 'drivingLicense', e.target.value, 'flows')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Flow ID for Driving License"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fitness Certificate</label>
                  <input
                    type="text"
                    value={settings?.msg91?.flows?.fitnessCertificate || ''}
                    onChange={(e) => handleSettingChange('msg91', 'fitnessCertificate', e.target.value, 'flows')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Flow ID for Fitness Certificate"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">NOC/Hypothecation</label>
                  <input
                    type="text"
                    value={settings?.msg91?.flows?.nocHypothecation || ''}
                    onChange={(e) => handleSettingChange('msg91', 'nocHypothecation', e.target.value, 'flows')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Flow ID for NOC/Hypothecation"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">PUC Certificate</label>
                  <input
                    type="text"
                    value={settings?.msg91?.flows?.pucCertificate || ''}
                    onChange={(e) => handleSettingChange('msg91', 'pucCertificate', e.target.value, 'flows')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Flow ID for PUC Certificate"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Road Tax</label>
                  <input
                    type="text"
                    value={settings?.msg91?.flows?.roadTax || ''}
                    onChange={(e) => handleSettingChange('msg91', 'roadTax', e.target.value, 'flows')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Flow ID for Road Tax"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Vehicle Insurance</label>
                  <input
                    type="text"
                    value={settings?.msg91?.flows?.vehicleInsurance || ''}
                    onChange={(e) => handleSettingChange('msg91', 'vehicleInsurance', e.target.value, 'flows')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Flow ID for Vehicle Insurance"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Settings */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing Configuration</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Per Message Cost (INR)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={settings?.pricing?.perMessageCost || ''}
                  onChange={(e) => handleSettingChange('pricing', 'perMessageCost', parseFloat(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="1.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Currency</label>
                <select
                  value={settings?.pricing?.currency || 'INR'}
                  onChange={(e) => handleSettingChange('pricing', 'currency', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="INR">INR (Indian Rupee)</option>
                  <option value="USD">USD (US Dollar)</option>
                  <option value="EUR">EUR (Euro)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Settings */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Wallet Configuration</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Minimum Top-up Amount (INR)</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={settings?.wallet?.min_topup_amount || ''}
                  onChange={(e) => handleSettingChange('wallet', 'min_topup_amount', parseInt(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Maximum Top-up Amount (INR)</label>
                <input
                  type="number"
                  min="100"
                  max="50000"
                  value={settings?.wallet?.max_topup_amount || ''}
                  onChange={(e) => handleSettingChange('wallet', 'max_topup_amount', parseInt(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="10000"
                />
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-900 mb-3">Quick Top-up Amounts</h4>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                {[100, 500, 1000, 2000, 5000].map((amount) => (
                  <div key={amount}>
                    <label className="block text-sm font-medium text-gray-700">₹{amount}</label>
                    <input
                      type="checkbox"
                      checked={settings?.wallet?.topup_amounts?.includes(amount) || false}
                      onChange={(e) => {
                        const currentAmounts = settings?.wallet?.topup_amounts || [];
                        const newAmounts = e.target.checked
                          ? [...currentAmounts, amount].sort((a, b) => a - b)
                          : currentAmounts.filter(a => a !== amount);
                        handleSettingChange('wallet', 'topup_amounts', newAmounts);
                      }}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-900 mb-3">Top-up Limits</h4>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Daily Top-up Limit (INR)</label>
                  <input
                    type="number"
                    min="100"
                    max="100000"
                    value={settings?.wallet?.daily_topup_limit || ''}
                    onChange={(e) => handleSettingChange('wallet', 'daily_topup_limit', parseInt(e.target.value))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="5000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Monthly Top-up Limit (INR)</label>
                  <input
                    type="number"
                    min="1000"
                    max="500000"
                    value={settings?.wallet?.monthly_topup_limit || ''}
                    onChange={(e) => handleSettingChange('wallet', 'monthly_topup_limit', parseInt(e.target.value))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="25000"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-900 mb-3">Auto Top-up Settings</h4>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="flex items-center">
                  <input
                    id="auto_topup_enabled"
                    type="checkbox"
                    checked={settings?.wallet?.auto_topup_enabled || false}
                    onChange={(e) => handleSettingChange('wallet', 'auto_topup_enabled', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="auto_topup_enabled" className="ml-2 block text-sm text-gray-900">
                    Enable Auto Top-up
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Threshold Amount (INR)</label>
                  <input
                    type="number"
                    min="10"
                    max="1000"
                    value={settings?.wallet?.auto_topup_threshold || ''}
                    onChange={(e) => handleSettingChange('wallet', 'auto_topup_threshold', parseInt(e.target.value))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="50"
                    disabled={!settings?.wallet?.auto_topup_enabled}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Auto Top-up Amount (INR)</label>
                  <input
                    type="number"
                    min="100"
                    max="5000"
                    value={settings?.wallet?.auto_topup_amount || ''}
                    onChange={(e) => handleSettingChange('wallet', 'auto_topup_amount', parseInt(e.target.value))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="500"
                    disabled={!settings?.wallet?.auto_topup_enabled}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* System Settings */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">System Configuration</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Max Retries</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={settings?.system?.maxRetries || ''}
                  onChange={(e) => handleSettingChange('system', 'maxRetries', parseInt(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Scheduler Interval (minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings?.system?.schedulerInterval || ''}
                  onChange={(e) => handleSettingChange('system', 'schedulerInterval', parseInt(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="5"
                />
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default AdminSettings;
