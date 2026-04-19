'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import AppLayout from '../../components/AppLayout';
import Toast from '../../components/Toast';
import { 
  User, Mail, Calendar, CreditCard, Receipt,
  LogOut, Shield, TrendingUp, PieChart, Copy, CheckCircle
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/'); return; }
  }, [user, authLoading, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const copyUserId = () => {
    if (user?._id) {
      navigator.clipboard.writeText(user._id).then(() => {
        setCopiedId(true);
        setTimeout(() => setCopiedId(false), 2000);
      });
    }
  };

  if (authLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </AppLayout>
    );
  }

  const quickActions = [
    { label: 'Wallet',        desc: 'View balances',           icon: <CreditCard className="w-5 h-5" />,   href: '/wallet',       color: 'emerald' },
    { label: 'Transactions',  desc: 'View payment history',    icon: <Receipt className="w-5 h-5" />,      href: '/transactions', color: 'blue' },
    { label: 'Paper Trading', desc: 'Practice investing',      icon: <TrendingUp className="w-5 h-5" />,   href: '/invest',       color: 'purple' },
    { label: 'Portfolio',     desc: 'View your holdings',      icon: <PieChart className="w-5 h-5" />,     href: '/portfolio',    color: 'amber' },
  ];

  const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20',
    blue:    'bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20',
    purple:  'bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20',
    amber:   'bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20',
  };

  return (
    <AppLayout>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Profile</h1>
          <p className="text-gray-400">Manage your account and preferences</p>
        </div>

        {/* Profile hero card */}
        <div className="bg-gradient-to-br from-emerald-500/10 via-[#1a1f2e] to-blue-500/8 rounded-2xl p-8 border border-emerald-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full -translate-y-16 translate-x-16" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/20 flex-shrink-0">
              <span className="text-4xl font-black text-white">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            {/* Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-1">{user?.name}</h2>
              <p className="text-gray-400 mb-3">{user?.email}</p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-gray-900/50 px-3 py-1.5 rounded-lg border border-gray-800/50">
                  <Calendar className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-gray-400 text-xs">
                    Member since {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 text-xs font-medium">Active Account</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Account Information */}
          <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800/60">
            <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              Account Information
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Full Name',     value: user?.name,  icon: <User className="w-4 h-4 text-blue-400" />,    bg: 'bg-blue-500/10' },
                { label: 'Email Address', value: user?.email, icon: <Mail className="w-4 h-4 text-emerald-400" />, bg: 'bg-emerald-500/10' },
                { label: 'Account Type',  value: 'Standard User', icon: <CreditCard className="w-4 h-4 text-purple-400" />, bg: 'bg-purple-500/10' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-gray-900/30 rounded-xl border border-gray-800/40">
                  <div className={`w-9 h-9 ${item.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-500 text-xs">{item.label}</p>
                    <p className="text-white font-medium text-sm truncate">{item.value}</p>
                  </div>
                </div>
              ))}

              {/* User ID with copy */}
              <div className="flex items-center gap-4 p-4 bg-gray-900/30 rounded-xl border border-gray-800/40">
                <div className="w-9 h-9 bg-amber-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-500 text-xs">User ID</p>
                  <p className="text-white font-mono text-xs truncate">{user?._id}</p>
                </div>
                <button
                  onClick={copyUserId}
                  className="text-gray-500 hover:text-white transition-colors flex-shrink-0"
                  title="Copy user ID"
                >
                  {copiedId ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800/60">
            <h3 className="text-lg font-bold text-white mb-5">Quick Navigation</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => router.push(action.href)}
                  className="flex flex-col items-start gap-3 p-4 bg-gray-900/30 rounded-xl border border-gray-800/40 hover:border-gray-700/60 transition-all group text-left"
                >
                  <div className={`w-9 h-9 ${colorMap[action.color]} rounded-xl flex items-center justify-center transition-colors`}>
                    {action.icon}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{action.label}</p>
                    <p className="text-gray-500 text-xs">{action.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Security section */}
        <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800/60">
          <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
            <Shield className="w-4 h-4 text-gray-400" />
            Security &amp; Account
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
            <div className="flex items-center gap-3 p-4 bg-gray-900/30 rounded-xl border border-gray-800/40">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-white font-medium text-sm">JWT Authentication</p>
                <p className="text-gray-500 text-xs">Secure session management</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-900/30 rounded-xl border border-gray-800/40">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-white font-medium text-sm">Fraud Detection</p>
                <p className="text-gray-500 text-xs">AI-powered transaction monitoring</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-900/30 rounded-xl border border-gray-800/40">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-white font-medium text-sm">Encrypted Storage</p>
                <p className="text-gray-500 text-xs">Data secured at rest and in transit</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-900/30 rounded-xl border border-gray-800/40">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-white font-medium text-sm">Password Protected</p>
                <p className="text-gray-500 text-xs">Bcrypt hashed credentials</p>
              </div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-4 bg-red-500/8 hover:bg-red-500/15 rounded-xl border border-red-500/20 hover:border-red-500/40 transition-all group"
          >
            <div className="w-9 h-9 bg-red-500/10 rounded-xl flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
              <LogOut className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-left">
              <p className="text-red-400 font-semibold text-sm">Sign Out</p>
              <p className="text-red-400/50 text-xs">You will be redirected to the home page</p>
            </div>
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
