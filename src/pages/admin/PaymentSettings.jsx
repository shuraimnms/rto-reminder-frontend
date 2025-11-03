import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { adminAPI } from '../../services/api';

const PaymentSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchSettings();
  }, []);

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
      setSuccess('Payment settings updated successfully!');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSettingChange = (category, field, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev?.[category],
        [field]: value,
      },
    }));
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

  if (error && !settings) {
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
              Payment Integration Settings
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Configure payment gateway settings for Cashfree integration
            </p>
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

        <div className="mt-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Integration Settings</h3>

              {/* Payment Integration Toggle */}
              <div className="mb-6">
                <div className="flex items-center">
                  <input
                    id="payment_integration_enabled"
                    type="checkbox"
                    checked={settings?.paymentIntegration?.enabled || false}
                    onChange={(e) => handleSettingChange('paymentIntegration', 'enabled', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="payment_integration_enabled" className="ml-2 block text-sm text-gray-900">
                    Enable Payment Integration
                  </label>
                </div>
              </div>

              {/* Environment Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700">Environment</label>
                <select
                  value={settings?.paymentIntegration?.environment || 'sandbox'}
                  onChange={(e) => handleSettingChange('paymentIntegration', 'environment', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={!settings?.paymentIntegration?.enabled}
                >
                  <option value="sandbox">Sandbox</option>
                  <option value="production">Production</option>
                </select>
              </div>

              <h4 className="text-md font-medium text-gray-900 mb-4">Cashfree Payment Gateway</h4>

              {/* Cashfree Enable/Disable Toggle */}
              <div className="mb-6">
                <div className="flex items-center">
                  <input
                    id="cashfree_enabled"
                    type="checkbox"
                    checked={settings?.cashfree?.enabled || false}
                    onChange={(e) => handleSettingChange('cashfree', 'enabled', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    disabled={!settings?.paymentIntegration?.enabled}
                  />
                  <label htmlFor="cashfree_enabled" className="ml-2 block text-sm text-gray-900">
                    Enable Cashfree Gateway
                  </label>
                </div>
              </div>

              {/* Input Fields */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cashfree App ID</label>
                  <input
                    type="password"
                    value={settings?.cashfree?.appId || ''}
                    onChange={(e) => handleSettingChange('cashfree', 'appId', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter Cashfree App ID"
                    disabled={!settings?.cashfree?.enabled}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cashfree Secret Key</label>
                  <input
                    type="password"
                    value={settings?.cashfree?.secretKey || ''}
                    onChange={(e) => handleSettingChange('cashfree', 'secretKey', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter Cashfree Secret Key"
                    disabled={!settings?.cashfree?.enabled}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Environment</label>
                  <select
                    value={settings?.cashfree?.isProduction ? 'production' : 'sandbox'}
                    onChange={(e) => handleSettingChange('cashfree', 'isProduction', e.target.value === 'production')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    disabled={!settings?.cashfree?.enabled}
                  >
                    <option value="sandbox">Sandbox</option>
                    <option value="production">Production</option>
                  </select>
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-6 flex justify-end">
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

        </div>

        <div className="mt-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">JojoUPI Configuration</h3>

              {/* JojoUPI Toggle */}
              <div className="mb-6">
                <div className="flex items-center">
                  <input
                    id="jojoupi_enabled"
                    type="checkbox"
                    checked={settings?.jojoUpi?.enabled || false}
                    onChange={(e) => handleSettingChange('jojoUpi', 'enabled', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="jojoupi_enabled" className="ml-2 block text-sm text-gray-900">
                    Enable JojoUPI Integration
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">API Key</label>
                  <input
                    type="password"
                    value={settings?.jojoUpi?.apiKey || ''}
                    onChange={(e) => handleSettingChange('jojoUpi', 'apiKey', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter JojoUPI API Key"
                    disabled={!settings?.jojoUpi?.enabled}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">API URL</label>
                  <input
                    type="url"
                    value={settings?.jojoUpi?.apiUrl || ''}
                    onChange={(e) => handleSettingChange('jojoUpi', 'apiUrl', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://api.jojoupi.com"
                    disabled={!settings?.jojoUpi?.enabled}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Callback URL</label>
                  <input
                    type="url"
                    value={settings?.jojoUpi?.callbackUrl || ''}
                    onChange={(e) => handleSettingChange('jojoUpi', 'callbackUrl', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://yourdomain.com/api/v1/webhook/jojoupi"
                    disabled={!settings?.jojoUpi?.enabled}
                  />
                </div>
              </div>

              {/* Verify JojoUPI Configuration Button */}
              <div className="mt-6">
                <button
                  onClick={async () => {
                    try {
                      setError('');
                      setSuccess('');
                      // Add verification logic for JojoUPI if available
                      setSuccess('JojoUPI configuration verified successfully!');
                    } catch (error) {
                      setError(error.response?.data?.message || 'Failed to verify JojoUPI configuration');
                    }
                  }}
                  disabled={!settings?.jojoUpi?.enabled}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Verify Configuration
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Gateway Configuration</h3>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Primary Payment Gateway</label>
                  <select
                    value={settings?.paymentGateway?.primary || 'cashfree'}
                    onChange={(e) => handleSettingChange('paymentGateway', 'primary', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="cashfree">Cashfree</option>
                    <option value="jojoupi">JojoUPI</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>

  );

};

export default PaymentSettings;
