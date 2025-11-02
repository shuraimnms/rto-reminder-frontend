// Demo data for development when backend is not available
export const demoStats = {
  overview: {
    total_customers: 45,
    total_reminders: 128,
    wallet_balance: 1250,
    per_message_cost: 1.0
  },
  upcoming_reminders: [
    {
      _id: '1',
      customer: {
        name: 'Ravi Kumar',
        vehicle_number: 'TS09AB1234'
      },
      reminder_type: 'vehicle_insurance_reminder',
      next_send_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: '2',
      customer: {
        name: 'Priya Sharma',
        vehicle_number: 'AP07CD5678'
      },
      reminder_type: 'puc_certificate_reminder',
      next_send_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: '3',
      customer: {
        name: 'Amit Patel',
        vehicle_number: 'MH12EF9012'
      },
      reminder_type: 'fitness_certificate_reminder',
      next_send_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  recent_messages: [
    {
      _id: '1',
      reminder: {
        customer: {
          name: 'Ravi Kumar'
        }
      },
      template_name: 'vehicle_insurance_reminder',
      status: 'DELIVERED',
      sent_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: '2',
      reminder: {
        customer: {
          name: 'Priya Sharma'
        }
      },
      template_name: 'puc_certificate_reminder',
      status: 'SENT',
      sent_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: '3',
      reminder: {
        customer: {
          name: 'Amit Patel'
        }
      },
      template_name: 'fitness_certificate_reminder',
      status: 'FAILED',
      sent_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
    }
  ]
};

export const demoUser = {
  _id: 'demo-user-123',
  name: 'Demo User',
  email: 'demo@shuraim.com',
  role: 'agent_admin',
  wallet_balance: 1250,
  company_name: 'Shuraim RTO Services'
};
