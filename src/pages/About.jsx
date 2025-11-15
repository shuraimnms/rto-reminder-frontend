import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Users,
  Target,
  Award,
  Heart,
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  Shield
} from 'lucide-react';

const About = () => {
  const stats = [
    { number: '500+', label: 'RTO Agents Served' },
    { number: '10,000+', label: 'Reminders Sent Monthly' },
    { number: '99.9%', label: 'Uptime Guarantee' },
    { number: '24/7', label: 'Customer Support' }
  ];

  const values = [
    {
      icon: Target,
      title: 'Mission-Driven',
      description: 'We exist to simplify RTO compliance and help agents focus on growing their business.'
    },
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'Your data security is our top priority with enterprise-grade protection and compliance.'
    },
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Every feature we build is designed with our customers\' needs and success in mind.'
    },
    {
      icon: TrendingUp,
      title: 'Innovation',
      description: 'We continuously improve our platform with the latest technology and best practices.'
    }
  ];

  // UPDATED TEAM SECTION — ALL ROLES ASSIGNED TO SHURAIM
  const team = [
    {
      name: 'Shuraim',
      role: 'CEO & Founder',
      bio: 'Founder of the RTO Reminder System, passionate about AI, technology, and building smart applications.',
      image: '/api/placeholder/150/150'
    },
    {
      name: 'Shuraim',
      role: 'CTO',
      bio: 'Oversees the technical development of the platform, including automation, AI integration, and modern app design.',
      image: '/api/placeholder/150/150'
    },
    {
      name: 'Shuraim',
      role: 'Head of Customer Success',
      bio: 'Ensures users get maximum value from the platform and focuses on helping agents work smarter.',
      image: '/api/placeholder/150/150'
    }
  ];

  const milestones = [
    {
      year: '2020',
      title: 'Company Founded',
      description: 'Started with a simple idea to solve RTO reminder challenges'
    },
    {
      year: '2021',
      title: 'First 100 Customers',
      description: 'Reached our first major milestone with growing adoption'
    },
    {
      year: '2022',
      title: 'WhatsApp Integration',
      description: 'Launched WhatsApp Business API integration for better reach'
    },
    {
      year: '2023',
      title: '500+ Agents',
      description: 'Expanded to serve over 500 RTO agents across India'
    },
    {
      year: '2024',
      title: 'Advanced Analytics',
      description: 'Released comprehensive analytics and reporting features'
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
            Empowering RTO Agents
            <span className="text-blue-600"> Across India</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            We're on a mission to revolutionize how RTO agents manage vehicle registrations and customer communications through intelligent automation and seamless WhatsApp integration.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Founded in 2020, RTO Reminder System was born from the frustration of manual RTO processes and missed renewal deadlines. Our founder, Shuraim, envisioned a smarter way to manage vehicle registrations using cutting-edge technology.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                What started as a simple solution to send timely reminders has evolved into a comprehensive platform that serves over 500 RTO agents across India, helping them automate their operations and focus on growing their business.
              </p>
              <p className="text-lg text-gray-600">
                Today, we're proud to be the trusted partner for RTO agents who want to modernize their operations with cutting-edge technology while maintaining the personal touch their customers value.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="text-center">
                <div className="bg-green-100 rounded-full p-4 w-fit mx-auto mb-4">
                  <Award className="h-12 w-12 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Our Vision</h3>
                <p className="text-gray-600 mb-6">
                  To be the leading platform that empowers RTO agents nationwide with intelligent automation, ensuring no vehicle registration deadline is ever missed.
                </p>
                <div className="flex justify-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-6 w-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">Trusted by 500+ agents</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-100 rounded-lg p-4 w-fit mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-gray-600">
              Key milestones in our growth and evolution
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-blue-200"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <div className="text-blue-600 font-bold text-lg mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow"></div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600">The passionate people behind RTO Reminder System</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="bg-gray-200 rounded-lg w-32 h-32 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-16 w-16 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Join Our Growing Community
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Be part of the RTO revolution. Start your free trial today and see how we can transform your business.
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
              to="/contact"
              className="border border-white text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Contact Us
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

export default About;