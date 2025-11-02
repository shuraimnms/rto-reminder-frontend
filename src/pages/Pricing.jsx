import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Check,
  Star,
  ArrowRight,
  Users,
  MessageSquare,
  BarChart3,
  Shield,
  Zap
} from 'lucide-react';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      name: 'Starter',
      price: billingCycle === 'monthly' ? 29 : 290,
      description: 'Perfect for small RTO agents just getting started',
      features: [
        'Up to 100 customers',
        'Basic reminder automation',
        'WhatsApp notifications',
        'Customer management',
        'Basic reporting',
        'Email support'
      ],
      limitations: [
        'Limited to 500 messages/month',
        'Basic analytics only'
      ],
      popular: false,
      buttonText: 'Start Free Trial'
    },
    {
      name: 'Professional',
      price: billingCycle === 'monthly' ? 79 : 790,
      description: 'Ideal for growing RTO businesses with advanced needs',
      features: [
        'Up to 500 customers',
        'Advanced reminder automation',
        'WhatsApp & SMS notifications',
        'Advanced customer management',
        'Detailed analytics & reports',
        'Priority email support',
        'Custom message templates',
        'API access'
      ],
      limitations: [
        'Up to 2,500 messages/month'
      ],
      popular: true,
      buttonText: 'Start Free Trial'
    },
    {
      name: 'Enterprise',
      price: billingCycle === 'monthly' ? 199 : 1990,
      description: 'Complete solution for large RTO operations',
      features: [
        'Unlimited customers',
        'Full automation suite',
        'All notification channels',
        'Complete CRM integration',
        'Advanced analytics & BI',
        'Dedicated account manager',
        'Phone & priority support',
        'Custom integrations',
        'White-label options',
        'Advanced security features'
      ],
      limitations: [],
      popular: false,
      buttonText: 'Contact Sales'
    }
  ];

  const faqs = [
    {
      question: 'Can I change my plan anytime?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the next billing cycle.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes! We offer a 14-day free trial for all plans. No credit card required to get started.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers for annual plans.'
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Absolutely. You can cancel your subscription at any time with no cancellation fees.'
    },
    {
      question: 'Do you offer discounts for annual billing?',
      answer: 'Yes! Save 20% when you choose annual billing for any plan.'
    },
    {
      question: 'What kind of support do you provide?',
      answer: 'We offer email support for all plans, with priority support and phone support for Professional and Enterprise plans.'
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
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Simple, Transparent
            <span className="text-blue-600"> Pricing</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Choose the perfect plan for your RTO business. All plans include our core features with no hidden fees.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors focus:outline-none"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Yearly
              </span>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                Save 20%
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`card p-8 relative ${
                  plan.popular ? 'border-2 border-blue-500 shadow-xl' : 'hover:shadow-lg'
                } transition-shadow`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-1">
                      <Star className="h-4 w-4" />
                      <span>Most Popular</span>
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-600">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                  </div>

                  <Link
                    to={plan.buttonText === 'Contact Sales' ? '/contact' : '/register'}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                      plan.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    <span>{plan.buttonText}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">What's included:</h4>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}

                  {plan.limitations.length > 0 && (
                    <>
                      <h4 className="font-semibold text-gray-900 mt-6">Limitations:</h4>
                      {plan.limitations.map((limitation, idx) => (
                        <div key={idx} className="flex items-center space-x-3">
                          <div className="h-5 w-5 rounded-full bg-gray-200 flex-shrink-0" />
                          <span className="text-gray-500 text-sm">{limitation}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Compare All Features
            </h2>
            <p className="text-lg text-gray-600">
              See exactly what's included in each plan
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-6 font-semibold text-gray-900">Features</th>
                  <th className="text-center p-6 font-semibold text-gray-900">Starter</th>
                  <th className="text-center p-6 font-semibold text-gray-900">Professional</th>
                  <th className="text-center p-6 font-semibold text-gray-900">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="p-6 font-medium text-gray-900">Customers</td>
                  <td className="p-6 text-center text-gray-700">100</td>
                  <td className="p-6 text-center text-gray-700">500</td>
                  <td className="p-6 text-center text-gray-700">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-6 font-medium text-gray-900">Messages/Month</td>
                  <td className="p-6 text-center text-gray-700">500</td>
                  <td className="p-6 text-center text-gray-700">2,500</td>
                  <td className="p-6 text-center text-gray-700">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-6 font-medium text-gray-900">WhatsApp Integration</td>
                  <td className="p-6 text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                  <td className="p-6 text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                  <td className="p-6 text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-6 font-medium text-gray-900">SMS Integration</td>
                  <td className="p-6 text-center"><div className="h-5 w-5 rounded-full bg-gray-200 mx-auto" /></td>
                  <td className="p-6 text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                  <td className="p-6 text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-6 font-medium text-gray-900">Advanced Analytics</td>
                  <td className="p-6 text-center"><div className="h-5 w-5 rounded-full bg-gray-200 mx-auto" /></td>
                  <td className="p-6 text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                  <td className="p-6 text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-6 font-medium text-gray-900">API Access</td>
                  <td className="p-6 text-center"><div className="h-5 w-5 rounded-full bg-gray-200 mx-auto" /></td>
                  <td className="p-6 text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                  <td className="p-6 text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-6 font-medium text-gray-900">Priority Support</td>
                  <td className="p-6 text-center"><div className="h-5 w-5 rounded-full bg-gray-200 mx-auto" /></td>
                  <td className="p-6 text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                  <td className="p-6 text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about our pricing and plans
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of RTO agents who trust our system. Start your free trial today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Start Free Trial</span>
              <Zap className="h-5 w-5" />
            </Link>
            <Link
              to="/contact"
              className="border border-white text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Contact Sales
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

export default Pricing;
