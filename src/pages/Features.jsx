import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Users,
  MessageSquare,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  Calendar,
  BarChart3,
  Smartphone,
  Clock,
  Target,
  TrendingUp
} from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Bell,
      title: 'Automated Reminders',
      description: 'Never miss important RTO deadlines with our intelligent automated reminder system that sends timely notifications.',
      details: [
        'Customizable reminder schedules',
        'Multiple notification channels',
        'Deadline tracking and alerts',
        'Automated follow-up sequences'
      ]
    },
    {
      icon: Users,
      title: 'Customer Management',
      description: 'Comprehensive customer database with all vehicle information, contact details, and service history in one place.',
      details: [
        'Complete customer profiles',
        'Vehicle registration tracking',
        'Service history logs',
        'Contact information management'
      ]
    },
    {
      icon: MessageSquare,
      title: 'WhatsApp Integration',
      description: 'Send personalized WhatsApp reminders to customers automatically or manually with rich messaging capabilities.',
      details: [
        'Automated WhatsApp notifications',
        'Custom message templates',
        'Bulk messaging capabilities',
        'Delivery status tracking'
      ]
    },
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'Flexible reminder scheduling with customizable intervals, frequencies, and advanced calendar integration.',
      details: [
        'Flexible scheduling options',
        'Recurring reminders',
        'Calendar integration',
        'Holiday and blackout period management'
      ]
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Track reminder performance, customer engagement, and business metrics with comprehensive analytics.',
      details: [
        'Performance dashboards',
        'Customer engagement metrics',
        'Revenue tracking',
        'Compliance reporting'
      ]
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with data encryption, backup systems, and 99.9% uptime guarantee.',
      details: [
        'End-to-end encryption',
        'Automated backups',
        'Multi-factor authentication',
        'GDPR compliance'
      ]
    }
  ];

  const additionalFeatures = [
    {
      icon: Clock,
      title: 'Real-time Notifications',
      description: 'Instant alerts for upcoming deadlines and status changes'
    },
    {
      icon: Target,
      title: 'Compliance Tracking',
      description: 'Ensure all vehicles remain compliant with RTO regulations'
    },
    {
      icon: TrendingUp,
      title: 'Business Intelligence',
      description: 'Data-driven insights to optimize your RTO business operations'
    },
    {
      icon: Smartphone,
      title: 'Mobile Access',
      description: 'Manage everything from your smartphone with our mobile app'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-blue-600 rounded-lg p-2">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">RTO Reminder System</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Powerful Features for
            <span className="text-blue-600"> RTO Success</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover all the tools and capabilities that make our RTO Reminder System the most comprehensive solution for vehicle registration management.
          </p>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card p-8 hover:shadow-xl transition-shadow">
                <div className="bg-blue-100 rounded-lg p-4 w-fit mb-6">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Additional Capabilities
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              More features that enhance your RTO management experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-blue-100 rounded-lg p-3 w-fit mx-auto mb-4">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Experience These Features?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start your free trial today and see how our features can transform your RTO business
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/pricing"
              className="border border-white text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-blue-600 rounded-lg p-2">
                  <Bell className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">RTO Reminder System</span>
              </div>
              <p className="text-gray-400 mb-4">
                Automate your RTO reminder process with our intelligent WhatsApp notification system.
              </p>
              <p className="text-sm text-gray-500">
                © 2024 RTO Reminder System. All rights reserved.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/support" className="hover:text-white transition-colors">Support</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Features;
