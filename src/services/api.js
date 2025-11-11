const api = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// ✅ Helper function for authenticated fetch
const authenticatedFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('authToken');
  const headers = {
    ...options.headers,
  };

  // Only set Content-Type if body isn’t FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  // Add auth token except for login/register
  if (token && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${api}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401 → logout and redirect
  if (response.status === 401) {
    localStorage.removeItem('authToken');
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    try {
      const errorData = await response.json();
      const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
      error.response = { data: errorData, status: response.status };
      throw error;
    } catch {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return response.blob(); // for files or other non-JSON responses
};

// ✅ Auth API
export const authAPI = {
  login: (email, password) =>
    authenticatedFetch('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (userData) =>
    authenticatedFetch('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  getMe: () => authenticatedFetch('/api/v1/auth/me'),
};

// ✅ Customers API
export const customersAPI = {
  getAll: (params) =>
    authenticatedFetch(`/api/v1/customers?${new URLSearchParams(params).toString()}`),
  getById: (id) => authenticatedFetch(`/api/v1/customers/${id}`),
  create: (data) =>
    authenticatedFetch('/api/v1/customers', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) =>
    authenticatedFetch(`/api/v1/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => authenticatedFetch(`/api/v1/customers/${id}`, { method: 'DELETE' }),
  importCSV: (formData) =>
    authenticatedFetch('/api/v1/import/csv', { method: 'POST', body: formData }),
};

// ✅ Reminders API
export const remindersAPI = {
  getAll: (params) =>
    authenticatedFetch(`/api/v1/reminders?${new URLSearchParams(params).toString()}`),
  getById: (id) => authenticatedFetch(`/api/v1/reminders/${id}`),
  create: (data) =>
    authenticatedFetch('/api/v1/reminders', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) =>
    authenticatedFetch(`/api/v1/reminders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => authenticatedFetch(`/api/v1/reminders/${id}`, { method: 'DELETE' }),
  bulkCreate: (data) =>
    authenticatedFetch('/api/v1/reminders/bulk', { method: 'POST', body: JSON.stringify(data) }),
  sendTestMessage: (data) =>
    authenticatedFetch('/api/v1/reminders/test-message', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  sendNow: (id) => authenticatedFetch(`/api/v1/reminders/${id}/send-now`, { method: 'POST' }),
  cancel: (id) => authenticatedFetch(`/api/v1/reminders/${id}/cancel`, { method: 'POST' }),
  reschedule: (id, data) =>
    authenticatedFetch(`/api/v1/reminders/${id}/reschedule`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getDashboardStats: () => authenticatedFetch('/api/v1/reminders/stats/dashboard'),
  getExpiringSoon: (days) =>
    authenticatedFetch(`/api/v1/reminders/expiring-soon?days=${days}`),
  getReminderMessages: (id, params) =>
    authenticatedFetch(`/api/v1/reminders/${id}/messages?${new URLSearchParams(params).toString()}`),
};

// ✅ Payment API
export const payAPI = {
  addBalance: (data) =>
    authenticatedFetch('/api/v1/pay/add-balance', { method: 'POST', body: JSON.stringify(data) }),
  getBalance: () => authenticatedFetch('/api/v1/pay/balance'),
  getTransactionHistory: () => authenticatedFetch('/api/v1/pay/history'),
  initiateTopup: (data) =>
    authenticatedFetch('/api/v1/pay/topup', { method: 'POST', body: JSON.stringify(data) }),
  verifyPayment: (transactionId) =>
    authenticatedFetch(`/api/v1/pay/verify-payment/${transactionId}`),
};

// ✅ Settings API
export const settingsAPI = {
  get: () => authenticatedFetch('/api/v1/settings'),
  update: (data) =>
    authenticatedFetch('/api/v1/settings', { method: 'PUT', body: JSON.stringify(data) }),
  updateNotifications: (data) =>
    authenticatedFetch('/api/v1/settings', {
      method: 'PUT',
      body: JSON.stringify({ settings: { notifications: data } }), // This is correct as per backend controller's merge logic
    }),
  updateSecurity: (data) =>
    authenticatedFetch('/api/v1/settings', {
      method: 'PUT',
      body: JSON.stringify({ settings: { security: data } }), // This is correct as per backend controller's merge logic
    }),
  changePassword: (data) =>
    authenticatedFetch('/api/v1/settings/password', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// ✅ Admin API
export const adminAPI = {
  // Dashboard
  getDashboardStats: () => authenticatedFetch('/api/v1/admin/dashboard'),

  // Settings
  getGlobalSettings: () => authenticatedFetch('/api/v1/admin/settings'),
  updateGlobalSettings: (data) =>
    authenticatedFetch('/api/v1/admin/settings', { method: 'PUT', body: JSON.stringify(data) }),

  // Agents
  getAllAgents: (params) =>
    authenticatedFetch(`/api/v1/admin/agents?${new URLSearchParams(params).toString()}`),
  getAgentDetails: (id) => authenticatedFetch(`/api/v1/admin/agents/${id}`),
  createAgent: (data) =>
    authenticatedFetch('/api/v1/admin/agents', { method: 'POST', body: JSON.stringify(data) }),
  updateAgent: (id, data) =>
    authenticatedFetch(`/api/v1/admin/agents/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAgent: (id) => authenticatedFetch(`/api/v1/admin/agents/${id}`, { method: 'DELETE' }),
  updateAgentWallet: (id, data) =>
    authenticatedFetch(`/api/v1/admin/agents/${id}/wallet`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Global data
  getAllCustomers: (params) =>
    authenticatedFetch(`/api/v1/admin/customers?${new URLSearchParams(params).toString()}`),
  getAllReminders: (params) =>
    authenticatedFetch(`/api/v1/admin/reminders?${new URLSearchParams(params).toString()}`),
  getAllMessages: (params) =>
    authenticatedFetch(`/api/v1/admin/messages?${new URLSearchParams(params).toString()}`),
  getAllTransactions: (params) =>
    authenticatedFetch(`/api/v1/admin/transactions?${new URLSearchParams(params).toString()}`),
  updateCustomer: (id, data) =>
    authenticatedFetch(`/api/v1/admin/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteCustomer: (id) => authenticatedFetch(`/api/v1/admin/customers/${id}`, { method: 'DELETE' }),
  exportMessages: (params) =>
    authenticatedFetch(`/api/v1/admin/messages/export?${new URLSearchParams(params).toString()}`),

  // Reset & Analytics
  resetWalletUsage: () =>
    authenticatedFetch('/api/v1/admin/reset/wallet-usage', { method: 'POST' }),
  resetTotalRevenue: () =>
    authenticatedFetch('/api/v1/admin/reset/total-revenue', { method: 'POST' }),
  getWalletUsageAnalytics: () => authenticatedFetch('/api/v1/admin/analytics/wallet-usage'),
  getRevenueAnalytics: () => authenticatedFetch('/api/v1/admin/analytics/revenue'),
  exportWalletUsage: () => authenticatedFetch('/api/v1/admin/export/wallet-usage'),
  exportRevenue: () => authenticatedFetch('/api/v1/admin/export/revenue'),

  // Additional
  getAgentRoleByEmail: (email) =>
    authenticatedFetch(`/api/v1/admin/agent-role/${email}`),
};

// ✅ MSG91 API
export const msg91API = {
  getStatus: () => authenticatedFetch('/api/v1/msg91/status'),
  getTemplates: () => authenticatedFetch('/api/v1/msg91/templates'),
};

// ✅ Notifications API
export const notificationAPI = {
  getNotifications: (params = {}) =>
    authenticatedFetch(`/api/v1/notifications?${new URLSearchParams(params).toString()}`),
  markAsRead: (id) =>
    authenticatedFetch(`/api/v1/notifications/${id}/read`, { method: 'PUT' }),
  markAllAsRead: () =>
    authenticatedFetch('/api/v1/notifications/mark-all-read', { method: 'PUT' }),
  clearAll: () => authenticatedFetch('/api/v1/notifications/clear-all', { method: 'DELETE' }),
};

// ✅ Chatbot API
export const chatbotAPI = {
  sendQuery: (message, followUp) =>
    authenticatedFetch('/api/v1/chatbot/query', {
      method: 'POST',
      body: JSON.stringify({ message, followUp }),
    }),
};

// ✅ Messages API
export const messagesAPI = {
  getAll: (params) =>
    authenticatedFetch(`/api/v1/messages?${new URLSearchParams(params).toString()}`),
  export: (params) =>
    authenticatedFetch(`/api/v1/messages/export?${new URLSearchParams(params).toString()}`),
  getMessageStats: () => authenticatedFetch('/api/v1/messages/stats'),
};

// ✅ Support API
export const supportAPI = {
  getAllTickets: (params) =>
    authenticatedFetch(`/api/v1/admin/support/tickets?${new URLSearchParams(params).toString()}`),
  getAgentTickets: (params) =>
    authenticatedFetch(`/api/v1/support/tickets?${new URLSearchParams(params).toString()}`),
  getTicket: (id) => authenticatedFetch(`/api/v1/support/tickets/${id}`),
  createTicket: (formData) =>
    authenticatedFetch('/api/v1/support/tickets', { method: 'POST', body: formData }),
  updateTicket: (id, data) =>
    authenticatedFetch(`/api/v1/support/tickets/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTicket: (id) => authenticatedFetch(`/api/v1/support/tickets/${id}`, { method: 'DELETE' }),
  addMessage: (id, formData) =>
    authenticatedFetch(`/api/v1/support/tickets/${id}/messages`, { method: 'POST', body: formData }),
  rateTicket: (id, data) =>
    authenticatedFetch(`/api/v1/support/tickets/${id}/rate`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ✅ Export base
export { api };
export default api;
