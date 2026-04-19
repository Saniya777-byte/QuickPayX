'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { 
  Wallet, Zap, Shield, TrendingUp, ArrowRight, Lock, CheckCircle,
  Star, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Github,
  ArrowUpRight, CreditCard, BookOpen, BarChart2, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' }
  })
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) router.push('/dashboard/overview');
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) return null;

  const features = [
    { icon: Wallet, title: 'Smart Wallet',      description: 'Realistic bank-to-wallet transfers with comprehensive balance tracking and transaction history.', color: 'emerald' },
    { icon: TrendingUp, title: 'Paper Trading', description: 'Practice investing with $20,000 virtual money — no risk, full market experience.', color: 'blue' },
    { icon: BookOpen, title: 'Learn Investing', description: 'Master stock market fundamentals with interactive lessons, guides, and investment strategies.', color: 'purple' },
    { icon: Shield, title: 'AI Security',       description: 'Advanced fraud detection and real-time monitoring protects every transaction automatically.', color: 'amber' },
  ];

  const steps = [
    { step: '01', title: 'Create Account',  description: 'Sign up in seconds and receive $20,000 virtual balance to start paper trading immediately.' },
    { step: '02', title: 'Learn & Practice', description: 'Master investment fundamentals through interactive lessons and practice with virtual money safely.' },
    { step: '03', title: 'Build Portfolio', description: 'Track performance, analyze your strategies, and grow your skills as a confident investor.' },
  ];

  const security = [
    { icon: Lock,        title: 'End-to-End Encryption',   description: 'All data encrypted with AES-256 — the same standard used by leading banks.' },
    { icon: Shield,      title: 'JWT Authentication',       description: 'Secure, stateless authentication with automatic token refresh for seamless sessions.' },
    { icon: CheckCircle, title: 'Fraud Detection',          description: 'Real-time algorithms detect and block suspicious transactions before they process.' },
  ];

  const testimonials = [
    { name: 'Sarah Johnson',    role: 'Aspiring Investor', content: 'The paper trading feature helped me learn investing without risking real money. The learning modules are incredibly helpful!', rating: 5 },
    { name: 'Michael Chen',     role: 'Finance Student',   content: 'QuickPayX gives me real-world experience with wallet management and stock trading. Perfect for learning fintech.', rating: 5 },
    { name: 'Emily Rodriguez',  role: 'Young Professional', content: 'The realistic financial flow and investment analytics helped me understand money management better than any textbook.', rating: 5 },
  ];

  const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    blue:    'bg-blue-500/10 text-blue-400 border-blue-500/20',
    purple:  'bg-purple-500/10 text-purple-400 border-purple-500/20',
    amber:   'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };

  return (
    <div className="min-h-screen bg-[#0a0e27] overflow-x-hidden">
      {/* ── NAV ── */}
      <nav className="bg-[#0a0e27]/95 backdrop-blur-sm border-b border-gray-800/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">QuickPayX</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/login')}
                className="text-gray-400 hover:text-white transition-colors font-medium text-sm"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push('/register')}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-xl font-semibold text-sm transition-all shadow-md shadow-emerald-500/20"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden py-28 lg:py-36">
        {/* Background glow effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-blue-500/8 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-[250px] h-[250px] bg-purple-500/8 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 text-center">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 bg-emerald-500/10 rounded-full px-4 py-2 mb-8 border border-emerald-500/20">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300 text-sm font-medium">Fintech + Investment Learning Platform</span>
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1} className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
              Smart Finance &amp;{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                Paper Trading
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Master your finances with realistic wallet management and practice investing with virtual money. 
              <strong className="text-gray-300"> No risk. Real learning.</strong>
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/register')}
                className="group bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25"
              >
                Start for Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => router.push('/login')}
                className="bg-gray-800/60 hover:bg-gray-700/60 text-white px-8 py-4 rounded-xl font-semibold transition-all border border-gray-700/60 hover:border-gray-600/60 flex items-center justify-center gap-2"
              >
                Sign In to Account
              </button>
            </motion.div>

            {/* Stats row */}
            <motion.div variants={fadeUp} custom={4} className="flex flex-wrap items-center justify-center gap-8 mt-14 pt-10 border-t border-gray-800/50">
              {[
                { value: '$20K', label: 'Starting Virtual Balance' },
                { value: '8+', label: 'Stocks to Trade' },
                { value: '6', label: 'Learning Modules' },
                { value: '100%', label: 'Risk-Free Practice' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-3xl font-bold text-emerald-400">{stat.value}</p>
                  <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
        className="py-24 relative"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <p className="text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-3">Platform Features</p>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">Everything You Need</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              A complete fintech ecosystem for learning and practising personal finance
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, i) => (
              <motion.div key={i} variants={fadeUp} custom={i}
                className="bg-[#1a1f2e] rounded-2xl p-7 border border-gray-800/60 hover:border-gray-700/60 transition-all group cursor-default"
              >
                <div className={`w-14 h-14 ${colorMap[feat.color]} rounded-2xl flex items-center justify-center mb-6 border group-hover:scale-110 transition-transform`}>
                  <feat.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feat.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── HOW IT WORKS ── */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
        className="py-24 bg-[#0f1429]"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <p className="text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-3">Getting Started</p>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">Up and running in three simple steps</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} className="relative">
                <div className="bg-[#1a1f2e] rounded-2xl p-8 border border-gray-800/60 h-full">
                  <div className="text-6xl font-black text-emerald-500/30 mb-4 leading-none">{step.step}</div>
                  <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{step.description}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-gray-800 rounded-full items-center justify-center">
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── SECURITY ── */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
        className="py-24"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <p className="text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-3">Security</p>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">Bank-Grade Protection</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Your data and virtual funds are protected with industry-leading security
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {security.map((s, i) => (
              <motion.div key={i} variants={fadeUp} custom={i}
                className="bg-[#1a1f2e] rounded-2xl p-8 border border-gray-800/60 hover:border-emerald-500/20 transition-all group"
              >
                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/15 transition-colors">
                  <s.icon className="w-7 h-7 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
                <p className="text-gray-400 leading-relaxed">{s.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── TESTIMONIALS ── */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
        className="py-24 bg-[#0f1429]"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <p className="text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-3">Testimonials</p>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">Trusted by Learners</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">See what our users say about their learning journey</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={fadeUp} custom={i}
                className="bg-[#1a1f2e] rounded-2xl p-8 border border-gray-800/60 flex flex-col"
              >
                <div className="flex gap-1 mb-5">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed flex-1">"{t.content}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-800/50">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── CTA ── */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
        variants={fadeUp}
        className="py-24"
      >
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <div className="relative bg-gradient-to-br from-emerald-500/15 via-[#1a1f2e] to-blue-500/10 rounded-3xl p-14 text-center border border-emerald-500/20 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
            </div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/15 rounded-2xl mb-6 border border-emerald-500/20">
                <BarChart2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">Ready to Start?</h2>
              <p className="text-xl text-gray-400 mb-8 max-w-xl mx-auto">
                Join thousands of users learning smart finance with QuickPayX. Free, forever.
              </p>
              <button
                onClick={() => router.push('/register')}
                className="group bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-4 rounded-xl font-semibold transition-all inline-flex items-center gap-2 shadow-xl shadow-emerald-500/25 text-lg"
              >
                Create Free Account
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0f1429] border-t border-gray-800/60 py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">QuickPayX</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                A fintech learning platform for smart wallet management and paper trading.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Company</h4>
              <ul className="space-y-3">
                {[['About Us', '/about'], ['Contact', '/contact']].map(([label, href]) => (
                  <li key={href}>
                    <button onClick={() => router.push(href)} className="text-gray-500 hover:text-white transition-colors text-sm">
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Legal</h4>
              <ul className="space-y-3">
                {[['Privacy Policy', '/privacy-policy'], ['Terms & Conditions', '/terms-and-conditions']].map(([label, href]) => (
                  <li key={href}>
                    <button onClick={() => router.push(href)} className="text-gray-500 hover:text-white transition-colors text-sm">
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Contact</h4>
              <ul className="space-y-3">
                {[
                  [<Mail className="w-4 h-4" />, 'support@quickpayx.com'],
                  [<Phone className="w-4 h-4" />, '+1 (555) 123-4567'],
                  [<MapPin className="w-4 h-4" />, 'San Francisco, CA'],
                ].map(([icon, text], i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-500 text-sm">
                    {icon}
                    <span>{text as string}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800/60 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">© {new Date().getFullYear()} QuickPayX. All rights reserved.</p>
            <div className="flex gap-3">
              {[
                [<Facebook className="w-4 h-4" />, '#'],
                [<Twitter className="w-4 h-4" />, '#'],
                [<Linkedin className="w-4 h-4" />, '#'],
                [<Github className="w-4 h-4" />, '#'],
              ].map(([icon, href], i) => (
                <a key={i} href={href as string} className="w-9 h-9 bg-gray-800/60 hover:bg-emerald-500/15 rounded-xl flex items-center justify-center text-gray-500 hover:text-emerald-400 border border-gray-700/50 hover:border-emerald-500/30 transition-all">
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}