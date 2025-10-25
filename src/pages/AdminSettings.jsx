import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

const AdminSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
      setSuccess('Settings updated successfully!');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const updateMSG91Settings = (field, value) => {
    setSettings(prev => ({
      ...prev,
      msg91: {
        ...prev.msg91,
        [field]: value
      }
    }));
  };

  const updateMSG91Flow = (flowType, value) => {
    setSettings(prev => ({
      ...prev,
      msg91: {
        ...prev.msg91,
        flows: {
          ...prev.msg91.flows,
          [flowType]: value
        }
      }
    }));
  };

  const updatePricing = (field, value) => {
    setSettings(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [field]: value
      }
    }));
  };

  const updateSystem = (field, value) => {
    setSettings(prev => ({
      ...prev,
      system: {
        ...prev.system,
        [field]: value
      }
    }));
  };

  const updateRazorpay = (field, value) => {
    setSettings(prev => ({
      ...prev,
      razorpay: {
        ...prev.razorpay,
        [field]: value
      }
    }));
  };

  const updateCashfree = (field, value) => {
    setSettings(prev => ({
      ...prev,
      cashfree: {
        ...prev.cashfree,
        [field]: value
      }
    }));
  };

  const updateJojoUpi = (field, value) => {
    setSettings(prev => ({
      ...prev,
      jojoUpi: {
        ...prev.jojoUpi,
        [field]: value
      }
    }));
  };

  const updatePaymentGateway = (field, value) => {
    setSettings(prev => ({
      ...prev,
      paymentGateway: {
        ...prev.paymentGateway,
        [field]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Global Settings</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage system-wide settings including MSG91 configuration and pricing
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {success}
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
                  onChange={(e) => updateMSG91Settings('authKey', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter MSG91 Auth Key"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sender ID</label>
                <input
                  type="text"
                  value={settings?.msg91?.senderId || ''}
                  onChange={(e) => updateMSG91Settings('senderId', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter Sender ID"
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
                    onChange={(e) => updateMSG91Flow('drivingLicense', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Flow ID for Driving License"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fitness Certificate</label>
                  <input
                    type="text"
                    value={settings?.msg91?.flows?.fitnessCertificate || ''}
                    onChange={(e) => updateMSG91Flow('fitnessCertificate', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Flow ID for Fitness Certificate"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">NOC/Hypothecation</label>
                  <input
                    type="text"
                    value={settings?.msg91?.flows?.nocHypothecation || ''}
                    onChange={(e) => updateMSG91Flow('nocHypothecation', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Flow ID for NOC/Hypothecation"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">PUC Certificate</label>
                  <input
                    type="text"
                    value={settings?.msg91?.flows?.pucCertificate || ''}
                    onChange={(e) => updateMSG91Flow('pucCertificate', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Flow ID for PUC Certificate"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Road Tax</label>
                  <input
                    type="text"
                    value={settings?.msg91?.flows?.roadTax || ''}
                    onChange={(e) => updateMSG91Flow('roadTax', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Flow ID for Road Tax"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Vehicle Insurance</label>
                  <input
                    type="text"
                    value={settings?.msg91?.flows?.vehicleInsurance || ''}
                    onChange={(e) => updateMSG91Flow('vehicleInsurance', e.target.value)}
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
                  onChange={(e) => updatePricing('perMessageCost', parseFloat(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="1.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Currency</label>
                <select
                  value={settings?.pricing?.currency || 'INR'}
                  onChange={(e) => updatePricing('currency', e.target.value)}
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
                  onChange={(e) => updateSystem('maxRetries', parseInt(e.target.value))}
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
                  onChange={(e) => updateSystem('schedulerInterval', parseInt(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="5"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Gateway Settings */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Gateway Configuration</h3>

            {/* Primary Gateway Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Payment Gateway</label>
              <select
                value={settings?.paymentGateway?.primary || 'jojoupi'}
                onChange={(e) => updatePaymentGateway('primary', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="razorpay">Razorpay</option>
                <option value="cashfree">Cashfree</option>
                <option value="jojoupi">JojoUPI</option>
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Select the primary payment gateway for processing transactions.
              </p>
            </div>

            {/* Razorpay Settings */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-medium text-gray-900">Razorpay</h4>
                <div className="flex items-center">
                  <input
                    id="razorpayEnabled"
                    type="checkbox"
                    checked={settings?.razorpay?.enabled !== false}
                    onChange={(e) => updateRazorpay('enabled', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="razorpayEnabled" className="ml-2 block text-sm text-gray-900">
                    Enable Razorpay
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Key ID</label>
                  <input
                    type="text"
                    value={settings?.razorpay?.keyId || ''}
                    onChange={(e) => updateRazorpay('keyId', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter Razorpay Key ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Key Secret</label>
                  <input
                    type="password"
                    value={settings?.razorpay?.keySecret || ''}
                    onChange={(e) => updateRazorpay('keySecret', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter Razorpay Key Secret"
                  />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center">
                  <input
                    id="razorpayProduction"
                    type="checkbox"
                    checked={settings?.razorpay?.isProduction || false}
                    onChange={(e) => updateRazorpay('isProduction', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="razorpayProduction" className="ml-2 block text-sm text-gray-900">
                    Production Mode
                  </label>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Enable this for live payments. Keep disabled for testing.
                </p>
              </div>
            </div>

            {/* Cashfree Settings */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-medium text-gray-900">Cashfree</h4>
                <div className="flex items-center">
                  <input
                    id="cashfreeEnabled"
                    type="checkbox"
                    checked={settings?.cashfree?.enabled || false}
                    onChange={(e) => updateCashfree('enabled', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="cashfreeEnabled" className="ml-2 block text-sm text-gray-900">
                    Enable Cashfree
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">App ID</label>
                  <input
                    type="text"
                    value={settings?.cashfree?.appId || ''}
                    onChange={(e) => updateCashfree('appId', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter Cashfree App ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Secret Key</label>
                  <input
                    type="password"
                    value={settings?.cashfree?.secretKey || ''}
                    onChange={(e) => updateCashfree('secretKey', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter Cashfree Secret Key"
                  />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center">
                  <input
                    id="cashfreeProduction"
                    type="checkbox"
                    checked={settings?.cashfree?.isProduction || false}
                    onChange={(e) => updateCashfree('isProduction', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="cashfreeProduction" className="ml-2 block text-sm text-gray-900">
                    Production Mode
                  </label>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Enable this for live payments. Keep disabled for testing.
                </p>
              </div>
            </div>

            {/* JojoUPI Settings */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-medium text-gray-900">JojoUPI</h4>
                <div className="flex items-center">
                  <input
                    id="jojoupiEnabled"
                    type="checkbox"
                    checked={settings?.jojoUpi?.enabled !== false}
                    onChange={(e) => updateJojoUpi('enabled', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="jojoupiEnabled" className="ml-2 block text-sm text-gray-900">
                    Enable JojoUPI
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">API Key</label>
                  <input
                    type="password"
                    value={settings?.jojoUpi?.apiKey || ''}
                    onChange={(e) => updateJojoUpi('apiKey', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter JojoUPI API Key"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">API URL</label>
                  <input
                    type="text"
                    value={settings?.jojoUpi?.apiUrl || ''}
                    onChange={(e) => updateJojoUpi('apiUrl', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter JojoUPI API URL"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Callback URL</label>
                  <input
                    type="text"
                    value={settings?.jojoUpi?.callbackUrl || ''}
                    onChange={(e) => updateJojoUpi('callbackUrl', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter Callback URL"
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
