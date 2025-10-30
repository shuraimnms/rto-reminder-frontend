const api = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper function for authenticated fetch
const authenticatedFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('authToken');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  // Don't add token for login and register endpoints
  if (token && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${api}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Clear invalid token and redirect to login
    localStorage.removeItem('authToken');
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    // Try to parse the error response from the body
    try {
      const errorData = await response.json();
      // Re-throw an error object that mimics an Axios error structure
      const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
      error.response = { data: errorData, status: response.status };
      throw error;
    } catch (e) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  // Handle different response types
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  // For file downloads or other non-JSON responses
  return response.blob();
};

// Auth API
export const authAPI = {
  login: (email, password) => authenticatedFetch('/api/v1/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (userData) => authenticatedFetch('/api/v1/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getMe: () => authenticatedFetch('/api/v1/auth/me'),
};

// Customers API
export const customersAPI = {
  getAll: (params) => authenticatedFetch(`/api/v1/customers?${new URLSearchParams(params).toString()}`),
   getById: (id) => authenticatedFetch(`/api/v1/customers/${id}`),
  create: (data) => authenticatedFetch('/api/v1/customers', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => authenticatedFetch(`/api/v1/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => authenticatedFetch(`/api/v1/customers/${id}`, { method: 'DELETE' }),
  importCSV: (formData) => authenticatedFetch('/api/v1/import/csv', { method: 'POST', body: formData }),
};

// Reminders API
export const remindersAPI = {
  getAll: (params) => authenticatedFetch(`/api/v1/reminders?${new URLSearchParams(params).toString()}`),
  getById: (id) => authenticatedFetch(`/api/v1/reminders/${id}`),
  create: (data) => authenticatedFetch('/api/v1/reminders', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => authenticatedFetch(`/api/v1/reminders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => authenticatedFetch(`/api/v1/reminders/${id}`, { method: 'DELETE' }),
  bulkCreate: (data) => authenticatedFetch('/api/v1/reminders/bulk', { method: 'POST', body: JSON.stringify(data) }),
  sendTestMessage: (data) => authenticatedFetch('/api/v1/reminders/test-message', { method: 'POST', body: JSON.stringify(data) }),
  sendNow: (id) => authenticatedFetch(`/api/v1/reminders/${id}/send-now`, { method: 'POST' }),
  cancel: (id) => authenticatedFetch(`/api/v1/reminders/${id}/cancel`, { method: 'POST' }),
  reschedule: (id, data) => authenticatedFetch(`/api/v1/reminders/${id}/reschedule`, { method: 'POST', body: JSON.stringify(data) }),
  getDashboardStats: () => authenticatedFetch('/api/v1/reminders/stats/dashboard'),
  getExpiringSoon: (days) => authenticatedFetch(`/api/v1/reminders/expiring-soon?days=${days}`),
  getReminderMessages: (id, params) => authenticatedFetch(`/api/v1/reminders/${id}/messages?${new URLSearchParams(params).toString()}`),
};



// Pay API
export const payAPI = {
  addBalance: (data) => authenticatedFetch('/api/v1/pay/add-balance', { method: 'POST', body: JSON.stringify(data) }),
  getBalance: () => authenticatedFetch('/api/v1/pay/balance'),
  getTransactionHistory: () => authenticatedFetch('/api/v1/pay/history'),
  verifyPayment: (transactionId) => authenticatedFetch(`/api/v1/pay/verify-payment/${transactionId}`),
};

// Billing API (removed)

// Settings API
export const settingsAPI = {
  get: () => authenticatedFetch('/api/v1/settings'),
  update: (data) => authenticatedFetch('/api/v1/settings', { method: 'PUT', body: JSON.stringify(data) }),
  updateNotifications: (data) => authenticatedFetch('/api/v1/settings', { method: 'PUT', body: JSON.stringify({ settings: { notifications: data } }) }),
  updateSecurity: (data) => authenticatedFetch('/api/v1/settings', { method: 'PUT', body: JSON.stringify({ settings: { security: data } }) }),
  changePassword: (data) => authenticatedFetch('/api/v1/settings/password', { method: 'PUT', body: JSON.stringify(data) }),
};

// Admin API
export const adminAPI = {
  // Dashboard
  getDashboardStats: () => authenticatedFetch('/api/v1/admin/dashboard'),

  // Settings
  getGlobalSettings: () => authenticatedFetch('/api/v1/admin/settings'),
  updateGlobalSettings: (data) => authenticatedFetch('/api/v1/admin/settings', { method: 'PUT', body: JSON.stringify(data) }),

  // Agents
  getAllAgents: (params) => authenticatedFetch(`/api/v1/admin/agents?${new URLSearchParams(params).toString()}`),
  getAgentDetails: (id) => authenticatedFetch(`/api/v1/admin/agents/${id}`),
  createAgent: (data) => authenticatedFetch('/api/v1/admin/agents', { method: 'POST', body: JSON.stringify(data) }),
  updateAgent: (id, data) => authenticatedFetch(`/api/v1/admin/agents/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAgent: (id) => authenticatedFetch(`/api/v1/admin/agents/${id}`, { method: 'DELETE' }),
  updateAgentWallet: (id, data) => authenticatedFetch(`/api/v1/admin/agents/${id}/wallet`, { method: 'PUT', body: JSON.stringify(data) }),

  // Global data views
  getAllCustomers: (params) => authenticatedFetch(`/api/v1/admin/customers?${new URLSearchParams(params).toString()}`),
  getAllReminders: (params) => authenticatedFetch(`/api/v1/admin/reminders?${new URLSearchParams(params).toString()}`),
  getAllMessages: (params) => authenticatedFetch(`/api/v1/admin/messages?${new URLSearchParams(params).toString()}`),
  getAllTransactions: (params) => authenticatedFetch(`/api/v1/admin/transactions?${new URLSearchParams(params).toString()}`),
  // Admin Support
  getAllTickets: (params) => authenticatedFetch(`/api/v1/admin/support/tickets?${new URLSearchParams(params).toString()}`),
  getTicketDetails: (id) => authenticatedFetch(`/api/v1/admin/support/tickets/${id}`),
  updateTicket: (id, data) => authenticatedFetch(`/api/v1/admin/support/tickets/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  addAdminReply: (id, data) => authenticatedFetch(`/api/v1/support/tickets/${id}/messages`, { method: 'POST', body: JSON.stringify(data) }), // Uses the same endpoint
  updateCustomer: (id, data) => authenticatedFetch(`/api/v1/admin/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCustomer: (id) => authenticatedFetch(`/api/v1/admin/customers/${id}`, { method: 'DELETE' }),
  getAgents: () => authenticatedFetch('/api/v1/admin/agents'),
  getMessages: (params) => authenticatedFetch(`/api/v1/admin/messages?${new URLSearchParams(params).toString()}`),
  exportMessages: (params) => authenticatedFetch(`/api/v1/admin/messages/export?${new URLSearchParams(params).toString()}`),

  // Notifications
  sendNotification: (data) => authenticatedFetch('/api/v1/notifications/send', { method: 'POST', body: JSON.stringify(data) }),
  getNotificationStats: () => authenticatedFetch('/api/v1/notifications/admin/stats'),

  // Audit & Security
  getAuditLogs: (params) => authenticatedFetch(`/api/v1/audit/logs?${new URLSearchParams(params).toString()}`),
  getFraudAlerts: (params) => authenticatedFetch(`/api/v1/audit/alerts?${new URLSearchParams(params).toString()}`),
  resolveFraudAlert: (alertId, data) => authenticatedFetch(`/api/v1/audit/alerts/${alertId}/resolve`, { method: 'PUT', body: JSON.stringify(data) }),
  getAuditStats: () => authenticatedFetch('/api/v1/audit/stats'),

  // Reset functionality
  resetWalletUsage: () => authenticatedFetch('/api/v1/admin/reset/wallet-usage', { method: 'POST' }),
  resetTotalRevenue: () => authenticatedFetch('/api/v1/admin/reset/total-revenue', { method: 'POST' }),

  // Analytics
  getWalletUsageAnalytics: () => authenticatedFetch('/api/v1/admin/analytics/wallet-usage'),
  getRevenueAnalytics: () => authenticatedFetch('/api/v1/admin/analytics/revenue'),

  // Export
  exportWalletUsage: () => authenticatedFetch('/api/v1/admin/export/wallet-usage'),
  exportRevenue: () => authenticatedFetch('/api/v1/admin/export/revenue'),
};

// Support API (for Agents)
export const supportAPI = {
  createTicket: (data) => authenticatedFetch('/api/v1/support/tickets', { method: 'POST', body: JSON.stringify(data) }),
  getAgentTickets: () => authenticatedFetch('/api/v1/support/tickets'),
  getTicketById: (id) => authenticatedFetch(`/api/v1/support/tickets/${id}`),
  addMessage: (id, data) => authenticatedFetch(`/api/v1/support/tickets/${id}/messages`, { method: 'POST', body: JSON.stringify(data) }),
};

// MSG91 API
export const msg91API = {
  getStatus: () => authenticatedFetch('/api/v1/msg91/status'),
  getTemplates: () => authenticatedFetch('/api/v1/msg91/templates'),
};

// Notification API
export const notificationAPI = {
  getNotifications: (params = {}) => authenticatedFetch(`/api/v1/notifications?${new URLSearchParams(params).toString()}`),
  markAsRead: (notificationId) => authenticatedFetch(`/api/v1/notifications/${notificationId}/read`, { method: 'PUT' }),
  markAllAsRead: () => authenticatedFetch('/api/v1/notifications/mark-all-read', { method: 'PUT' }),
};

// RTO API
export const rtoAPI = {
  getAllOffices: (params) => authenticatedFetch(`/api/v1/rto?${new URLSearchParams(params).toString()}`),
  getOfficeById: (id) => authenticatedFetch(`/api/v1/rto/${id}`),
  createOffice: (data) => authenticatedFetch('/api/v1/rto', { method: 'POST', body: JSON.stringify(data) }),
  updateOffice: (id, data) => authenticatedFetch(`/api/v1/rto/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteOffice: (id) => authenticatedFetch(`/api/v1/rto/${id}`, { method: 'DELETE' }),
  findNearestOffices: (params) => authenticatedFetch(`/api/v1/rto/nearest/find?${new URLSearchParams(params).toString()}`),
  getOfficesByState: (state) => authenticatedFetch(`/api/v1/rto/state/${state}`),
  getOfficesByCity: (city) => authenticatedFetch(`/api/v1/rto/city/${city}`),
  bulkImportOffices: (data) => authenticatedFetch('/api/v1/rto/bulk-import', { method: 'POST', body: JSON.stringify(data) }),
};

// Chatbot API
export const chatbotAPI = {
  sendQuery: (message) => authenticatedFetch('/api/v1/chatbot/query', { method: 'POST', body: JSON.stringify({ message }) }),
};

// Export the axios instance as both named and default export
export { api };
export default api;
