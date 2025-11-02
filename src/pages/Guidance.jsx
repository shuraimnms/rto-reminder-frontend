import React from 'react';
import {
  BookOpen,
  Users,
  Bell,
  MessageSquare,
  CreditCard,
  Settings,
  ArrowRight,
  CheckCircle,
  UploadCloud,
  Calendar,
  BarChart2,
  Shield,
} from 'lucide-react';

const featureCards = [
  {
    title: 'Managing Customers',
    description: 'Learn how to add, import, and manage your customer database efficiently.',
    icon: Users,
    href: '#customers',
  },
  {
    title: 'Creating Reminders',
    description: 'Set up automated WhatsApp reminders for various RTO deadlines.',
    icon: Bell,
    href: '#reminders',
  },
  {
    title: 'Message History',
    description: 'Track the status of all sent messages and view analytics.',
    icon: MessageSquare,
    href: '#messages',
  },
  {
    title: 'Billing & Wallet',
    description: 'Manage your wallet balance, view transactions, and top up.',
    icon: CreditCard,
    href: '#billing',
  },
  {
    title: 'Account Settings',
    description: 'Configure your profile, notifications, and security settings.',
    icon: Settings,
    href: '#settings',
  },
];

const guidanceSections = [
  {
    id: 'customers',
    title: 'Managing Customers',
    icon: Users,
    steps: [
      {
        title: 'Adding a New Customer',
        description:
          'Navigate to the "Customers" page and click the "Add Customer" button. Fill in the required details like name, mobile number, and vehicle number.',
        icon: Users,
      },
      {
        title: 'Importing Customers via CSV',
        description:
          'For bulk additions, use the "Import CSV" feature. Download the sample CSV file to ensure your data is in the correct format before uploading.',
        icon: UploadCloud,
      },
      {
        title: 'Searching and Filtering',
        description:
          'Use the search bar to quickly find customers by name, mobile, or vehicle number. You can also filter the list to view active or inactive customers.',
        icon: CheckCircle,
      },
    ],
  },
  {
    id: 'reminders',
    title: 'Creating & Managing Reminders',
    icon: Bell,
    steps: [
      {
        title: 'Creating a Single Reminder',
        description:
          'Go to the "Reminders" page and click "Create Reminder". Select a customer, choose the reminder type (e.g., Insurance, PUC), and set the expiry date.',
        icon: Calendar,
      },
      {
        title: 'How Reminders Work',
        description:
          'The system automatically schedules messages to be sent at predefined intervals (e.g., 30, 7, and 3 days) before the expiry date.',
        icon: CheckCircle,
      },
      {
        title: 'Sending a Test Message',
        description:
          'Before activating a reminder campaign, you can send a test message to your own number to see how it looks. This does not affect the customer.',
        icon: MessageSquare,
      },
    ],
  },
  {
    id: 'messages',
    title: 'Message History & Analytics',
    icon: MessageSquare,
    steps: [
      {
        title: 'Viewing Message Logs',
        description:
          'The "Messages" page shows a complete history of all sent messages. You can see the customer, message content, status (Sent, Delivered, Failed), and cost.',
        icon: BarChart2,
      },
      {
        title: 'Understanding Statuses',
        description:
          '"Sent" means the message has left our system. "Delivered" confirms it reached the customer\'s device. "Failed" indicates a problem with delivery.',
        icon: CheckCircle,
      },
      {
        title: 'Exporting Data',
        description:
          'You can export your message history as a CSV file for your records or for further analysis. Use the filters to select the data you need.',
        icon: UploadCloud,
      },
    ],
  },
  {
    id: 'billing',
    title: 'Billing & Wallet Management',
    icon: CreditCard,
    steps: [
      {
        title: 'Checking Your Balance',
        description:
          'Your current wallet balance is always visible in the sidebar and on the "Billing" page. Messages cannot be sent if your balance is too low.',
        icon: CreditCard,
      },
      {
        title: 'Topping Up Your Wallet',
        description:
          'Click "Top Up Wallet" on the Billing page. Enter the desired amount and complete the payment through our secure payment gateway.',
        icon: CheckCircle,
      },
      {
        title: 'Transaction History',
        description:
          'All wallet activities, including top-ups (credits) and message costs (debits), are logged in the transaction history for full transparency.',
        icon: BarChart2,
      },
    ],
  },
  {
    id: 'settings',
    title: 'Account Settings',
    icon: Settings,
    steps: [
      {
        title: 'Profile Information',
        description:
          'Update your name, email, and mobile number in the "Profile Settings" section on the "Settings" page.',
        icon: Users,
      },
      {
        title: 'Notification Preferences',
        description:
          'Configure how you receive system alerts, such as low balance warnings. You can also customize the lead times for reminders.',
        icon: Bell,
      },
      {
        title: 'Security',
        description:
          'Change your password regularly for security. You can also enable Two-Factor Authentication (2FA) for an extra layer of protection.',
        icon: Shield,
      },
    ],
  },
];

const Guidance = () => {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center p-8 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-xl">
        <BookOpen className="mx-auto h-16 w-16 text-blue-600" />
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Agent Guidance Center
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Your complete guide to mastering the RTO Reminder System.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featureCards.map((card) => (
          <a
            key={card.title}
            href={card.href}
            className="card p-6 flex flex-col items-start hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className="p-3 bg-blue-100 rounded-lg">
              <card.icon className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">{card.title}</h3>
            <p className="mt-2 text-sm text-gray-600 flex-grow">{card.description}</p>
            <div className="mt-4 inline-flex items-center text-blue-600 font-medium">
              Learn More <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </a>
        ))}
      </div>

      {/* Detailed Sections */}
      <div className="space-y-16">
        {guidanceSections.map((section) => (
          <div key={section.id} id={section.id} className="card p-8 scroll-mt-20">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <section.icon className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">{section.title}</h2>
            </div>
            <div className="space-y-6">
              {section.steps.map((step, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-blue-600">
                      <step.icon className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">{step.title}</h4>
                    <p className="mt-1 text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Guidance;