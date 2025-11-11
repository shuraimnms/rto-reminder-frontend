import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Key, Save, RefreshCw, Palette } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { settingsAPI } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import ThemeSelector from '../components/ThemeSelector';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const { currentTheme } = useTheme();
  const isAiTheme = currentTheme === 'ai';
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    profile: {
      name: user?.name || '',
      email: user?.email || '',
      mobile: user?.mobile || '',
      company_name: user?.company_name || ''
    },
    notifications: {
      email_reminders: true,
      sms_reminders: true,
      reminder_lead_times: [30, 7, 3, 1],
      low_balance_alert: true,
      low_balance_threshold: 100
    },
    security: {
      two_factor_enabled: false,
      session_timeout: 24
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.get();
      setSettings(prev => ({
        ...prev,
        ...response.data.data
      }));
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await settingsAPI.update({ profile: settings.profile });
      // The API returns the updated agent data, let's use that to update the context
      if (response.data.success) {
        updateUser(response.data.data);
      }
      toast.success('Profile updated successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await settingsAPI.updateNotifications(settings.notifications);
      toast.success('Notification settings updated successfully');
      fetchSettings(); // Refresh settings after successful update
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update notification settings';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSecurityUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await settingsAPI.updateSecurity(settings.security);
      toast.success('Security settings updated successfully');
      fetchSettings(); // Refresh settings after successful update
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update security settings';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const currentPassword = e.target.currentPassword.value;
    const newPassword = e.target.newPassword.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      await settingsAPI.changePassword({ currentPassword, newPassword });
      toast.success('Password changed successfully');
      e.target.reset();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to change password';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={isAiTheme ? "text-2xl font-bold text-ai-text-bright" : "text-2xl font-bold text-gray-900 themed-heading"}>Settings</h1>
        <button
          onClick={fetchSettings}
          className={isAiTheme ? "btn-ai-secondary flex items-center" : "btn btn-secondary flex items-center"}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Profile Settings */}
      <div className={isAiTheme ? "card-ai" : "card"}>
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <User className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900 themed-heading">Profile Settings</h3>
          </div>
        </div>

        <form onSubmit={handleProfileUpdate} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={settings.profile.name}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  profile: { ...prev.profile, name: e.target.value }
                }))}
                className={isAiTheme ? "input-ai w-full" : "input w-full"}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={settings.profile.email}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  profile: { ...prev.profile, email: e.target.value }
                }))}
                className={isAiTheme ? "input-ai w-full" : "input w-full"}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                value={settings.profile.mobile}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  profile: { ...prev.profile, mobile: e.target.value }
                }))}
                className={isAiTheme ? "input-ai w-full" : "input w-full"}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={settings.profile.company_name}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  profile: { ...prev.profile, company_name: e.target.value }
                }))}
                className={isAiTheme ? "input-ai w-full" : "input w-full"}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className={isAiTheme ? "btn-ai-primary flex items-center" : "btn btn-primary flex items-center"}
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Profile
            </button>
          </div>
        </form>
      </div>

      {/* Notification Settings */}
      <div className={isAiTheme ? "card-ai" : "card"}>
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <Bell className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900 themed-heading">Notification Settings</h3>
          </div>
        </div>

        <form onSubmit={handleNotificationUpdate} className="p-6 space-y-4">
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="email_reminders"
                checked={settings.notifications.email_reminders}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, email_reminders: e.target.checked }
                }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="email_reminders" className="ml-2 text-sm text-gray-700">
                Send email reminders
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="sms_reminders"
                checked={settings.notifications.sms_reminders}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, sms_reminders: e.target.checked }
                }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="sms_reminders" className="ml-2 text-sm text-gray-700">
                Send SMS reminders
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="low_balance_alert"
                checked={settings.notifications.low_balance_alert}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, low_balance_alert: e.target.checked }
                }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="low_balance_alert" className="ml-2 text-sm text-gray-700">
                Low balance alerts
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Low Balance Threshold (₹)
              </label>
              <input
                type="number"
                min="0"
                value={settings.notifications.low_balance_threshold}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, low_balance_threshold: parseFloat(e.target.value) || 0 }
                }))}
                className={isAiTheme ? "input-ai w-full max-w-xs" : "input w-full max-w-xs"}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reminder Lead Times (days before expiry)
              </label>
              <div className="flex space-x-2">
                {[30, 7, 3, 1].map(days => (
                  <label key={days} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.notifications.reminder_lead_times.includes(days)}
                      onChange={(e) => {
                        const leadTimes = e.target.checked
                          ? [...settings.notifications.reminder_lead_times, days]
                          : settings.notifications.reminder_lead_times.filter(t => t !== days);
                        setSettings(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, reminder_lead_times: leadTimes }
                        }));
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{days} days</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className={isAiTheme ? "btn-ai-primary flex items-center" : "btn btn-primary flex items-center"}
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Notifications
            </button>
          </div>
        </form>
      </div>

      {/* Appearance Settings */}
      <div className={isAiTheme ? "card-ai" : "card"}>
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <Palette className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900 themed-heading">Appearance Settings</h3>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-md font-medium text-gray-900">Theme</h4>
              <p className="text-sm text-gray-600">Choose your preferred theme for the application</p>
            </div>
            <ThemeSelector />
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className={isAiTheme ? "card-ai" : "card"}>
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900 themed-heading">Security Settings</h3>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Change Password */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center themed-heading">
              <Key className="h-4 w-4 mr-2" />
              Change Password
            </h4>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    className={isAiTheme ? "input-ai w-full" : "input w-full"}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    className={isAiTheme ? "input-ai w-full" : "input w-full"}
                    required
                    minLength="6"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className={isAiTheme ? "input-ai w-full" : "input w-full"}
                    required
                    minLength="6"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className={isAiTheme ? "btn-ai-primary flex items-center" : "btn btn-primary flex items-center"}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Key className="h-4 w-4 mr-2" />
                  )}
                  Change Password
                </button>
              </div>
            </form>
          </div>

          {/* Two Factor Authentication */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-md font-medium text-gray-900 themed-heading">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
              </div>
              <button
                onClick={() => {
                  setSettings(prev => ({
                    ...prev,
                    security: { ...prev.security, two_factor_enabled: !prev.security.two_factor_enabled }
                  }));
                  handleSecurityUpdate({ preventDefault: () => {} });
                }}
                className={isAiTheme ? `btn ${settings.security.two_factor_enabled ? 'btn-ai-secondary' : 'btn-ai-primary'}` : `btn ${settings.security.two_factor_enabled ? 'btn-secondary' : 'btn-primary'}`}
                disabled={loading}
              >
                {settings.security.two_factor_enabled ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>

          {/* Session Timeout */}
          <div className="border-t border-gray-200 pt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 themed-heading">
                Session Timeout (hours)
              </label>
              <select
                value={settings.security.session_timeout}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  security: { ...prev.security, session_timeout: parseInt(e.target.value) }
                }))}
                className={isAiTheme ? "input-ai w-full max-w-xs" : "input w-full max-w-xs"}
              >
                <option value={1}>1 hour</option>
                <option value={4}>4 hours</option>
                <option value={8}>8 hours</option>
                <option value={24}>24 hours</option>
                <option value={168}>1 week</option>
              </select>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSecurityUpdate}
                className={isAiTheme ? "btn-ai-primary flex items-center" : "btn btn-primary flex items-center"}
                disabled={loading}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Security Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
