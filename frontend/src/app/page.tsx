'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { 
  Wallet, 
  Zap, 
  Shield, 
  TrendingUp, 
  ArrowRight, 
  Lock, 
  CheckCircle,
  Star,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Github,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CreditCard
} from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  const features = [
    {
      icon: Wallet,
      title: 'Wallet Management',
      description: 'Seamlessly manage your digital wallet with real-time balance updates and transaction tracking.'
    },
    {
      icon: Zap,
      title: 'Instant Transfers',
      description: 'Send and receive money instantly with our lightning-fast payment processing system.'
    },
    {
      icon: Shield,
      title: 'Secure Authentication',
      description: 'Bank-grade security with JWT authentication and encrypted data transmission.'
    },
    {
      icon: TrendingUp,
      title: 'Transaction Analytics',
      description: 'Track your spending patterns with detailed analytics and insights.'
    }
  ];

  const steps = [
    {
      step: '01',
      title: 'Create Account',
      description: 'Sign up in seconds with just your email and create your digital wallet.'
    },
    {
      step: '02',
      title: 'Add Money',
      description: 'Easily add funds to your wallet using secure payment methods.'
    },
    {
      step: '03',
      title: 'Send & Receive',
      description: 'Transfer money to anyone instantly or receive payments from friends and family.'
    }
  ];

  const securityFeatures = [
    {
      icon: Lock,
      title: 'End-to-End Encryption',
      description: 'All transactions are encrypted using industry-standard AES-256 encryption.'
    },
    {
      icon: Shield,
      title: 'Secure Authentication',
      description: 'JWT-based authentication with automatic token refresh for enhanced security.'
    },
    {
      icon: CheckCircle,
      title: 'Fraud Detection',
      description: 'Advanced algorithms monitor transactions to detect and prevent fraudulent activity.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Small Business Owner',
      content: 'QuickPayX has transformed how I handle payments. The instant transfers are a game-changer for my business.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Freelance Developer',
      content: 'The clean interface and security features give me peace of mind. Best digital wallet I\'ve used.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Marketing Manager',
      content: 'Love the transaction analytics! It helps me track my expenses and manage my budget effectively.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0e27]">
      {/* Navigation */}
      <nav className="bg-[#0a0e27] border-b border-gray-800/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">QuickPayX</span>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <button
                  onClick={() => router.push('/dashboard')}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-xl font-semibold transition-all"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => router.push('/login')}
                    className="text-gray-400 hover:text-white transition-colors font-medium"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => router.push('/register')}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-xl font-semibold transition-all"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative overflow-hidden py-24 lg:py-32"
      >
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 text-center">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-gray-800/50 rounded-full px-4 py-2 mb-8 border border-gray-700/50">
            <Zap className="w-4 h-4 text-emerald-500" />
            <span className="text-gray-300 text-sm font-medium">Fast, Secure Digital Payments</span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            The Future of<br />
            <span className="text-emerald-500">
              Digital Payments
            </span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Experience seamless money transfers with QuickPayX. Send, receive, and manage your finances with bank-grade security.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/register')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => router.push('/login')}
              className="bg-gray-800/50 hover:bg-gray-700/50 text-white px-8 py-4 rounded-xl font-semibold transition-all border border-gray-700/50 flex items-center justify-center gap-2"
            >
              Login to Account
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="py-24 lg:py-32 relative"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to manage your digital finances in one place
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-[#1a1f2e] rounded-2xl p-8 border border-gray-800/50 hover:border-gray-700/50 transition-all group"
              >
                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="py-24 lg:py-32 relative bg-[#0f1429]"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Get started in just three simple steps
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div key={index} variants={itemVariants} className="relative">
                <div className="bg-[#1a1f2e] rounded-2xl p-8 border border-gray-800/50 h-full">
                  <div className="text-5xl font-bold text-emerald-500 mb-6">{step.step}</div>
                  <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-gray-600" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Security Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="py-24 lg:py-32 relative"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Bank-Grade Security
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Your money and data are protected with the highest security standards
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-[#1a1f2e] rounded-2xl p-8 border border-gray-800/50"
              >
                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="py-24 lg:py-32 relative bg-[#0f1429]"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              See what our users have to say about QuickPayX
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-[#1a1f2e] rounded-2xl p-8 border border-gray-800/50"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-emerald-500 fill-emerald-500" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6">"{testimonial.content}"</p>
                <div>
                  <p className="text-white font-semibold">{testimonial.name}</p>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={itemVariants}
        className="py-24 lg:py-32 relative"
      >
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-8">
          <div className="bg-[#1a1f2e] rounded-2xl p-12 text-center border border-gray-800/50">
            <div className="relative">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                Join thousands of users who trust QuickPayX for their digital payments
              </p>
              <button
                onClick={() => router.push('/register')}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 mx-auto"
              >
                Create Free Account
                <ArrowUpRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={itemVariants}
        className="bg-[#0f1429] border-t border-gray-800/50 py-16"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">QuickPayX</span>
              </div>
              <p className="text-gray-400">
                Fast, secure, and simple digital payments for everyone.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-3">
                <li>
                  <button onClick={() => router.push('/about')} className="text-gray-400 hover:text-white transition-colors">
                    About Us
                  </button>
                </li>
                <li>
                  <button onClick={() => router.push('/contact')} className="text-gray-400 hover:text-white transition-colors">
                    Contact
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-3">
                <li>
                  <button onClick={() => router.push('/privacy-policy')} className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => router.push('/terms-and-conditions')} className="text-gray-400 hover:text-white transition-colors">
                    Terms & Conditions
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-400">
                  <Mail className="w-5 h-5" />
                  <span>support@quickpayx.com</span>
                </li>
                <li className="flex items-center gap-3 text-gray-400">
                  <Phone className="w-5 h-5" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center gap-3 text-gray-400">
                  <MapPin className="w-5 h-5" />
                  <span>San Francisco, CA</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800/50 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © 2024 QuickPayX. All rights reserved.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-gray-800/50 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800/50 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800/50 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800/50 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}