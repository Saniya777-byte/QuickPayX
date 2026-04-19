'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import AppLayout from '../../components/AppLayout';
import Toast from '../../components/Toast';
import { User, Mail, Calendar, Settings, CreditCard, Wallet, LogOut, Shield, Bell } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push('/');
      return;
    }
  }, [user, authLoading, router]);

  const handleLogout = () => {
    logout();
    setToast({ message: 'Logged out successfully', type: 'success' });
    setTimeout(() => {
      router.push('/');
    }, 1000);
  };

  if (authLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
          <p className="text-gray-400">Manage your account settings</p>
        </div>

        {/* Profile Card */}
        <div className="bg-[#1a1f2e] rounded-2xl p-8 shadow-lg border border-gray-800/50">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
              <User className="w-12 h-12 text-emerald-500" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-1">{user?.name}</h2>
              <p className="text-gray-400 mb-4">{user?.email}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Joined {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-[#1a1f2e] rounded-2xl p-6 shadow-lg border border-gray-800/50">
          <h3 className="text-xl font-bold text-white mb-6">Account Information</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-900/30 rounded-xl border border-gray-800/50">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="text-gray-400 text-sm">Full Name</p>
                <p className="text-white font-medium">{user?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-900/30 rounded-xl border border-gray-800/50">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="flex-1">
                <p className="text-gray-400 text-sm">Email Address</p>
                <p className="text-white font-medium">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-900/30 rounded-xl border border-gray-800/50">
              <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-purple-500" />
              </div>
              <div className="flex-1">
                <p className="text-gray-400 text-sm">Account Type</p>
                <p className="text-white font-medium">Standard</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#1a1f2e] rounded-2xl p-6 shadow-lg border border-gray-800/50">
          <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/wallet')}
              className="flex items-center gap-4 p-4 bg-gray-900/30 rounded-xl border border-gray-800/50 hover:border-gray-700/50 transition-all text-left"
            >
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                <Wallet className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-white font-medium">Manage Wallet</p>
                <p className="text-gray-500 text-sm">View balances</p>
              </div>
            </button>

            <button
              onClick={() => router.push('/transactions')}
              className="flex items-center gap-4 p-4 bg-gray-900/30 rounded-xl border border-gray-800/50 hover:border-gray-700/50 transition-all text-left"
            >
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Settings className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-white font-medium">Transaction History</p>
                <p className="text-gray-500 text-sm">View past transactions</p>
              </div>
            </button>

            <button
              onClick={() => router.push('/portfolio')}
              className="flex items-center gap-4 p-4 bg-gray-900/30 rounded-xl border border-gray-800/50 hover:border-gray-700/50 transition-all text-left"
            >
              <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-white font-medium">Investment Portfolio</p>
                <p className="text-gray-500 text-sm">View your holdings</p>
              </div>
            </button>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-[#1a1f2e] rounded-2xl p-6 shadow-lg border border-gray-800/50">
          <h3 className="text-xl font-bold text-white mb-6">Security</h3>
          <div className="space-y-4">
            <button className="flex items-center gap-4 p-4 bg-gray-900/30 rounded-xl border border-gray-800/50 hover:border-gray-700/50 transition-all text-left w-full">
              <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Change Password</p>
                <p className="text-gray-500 text-sm">Update your password</p>
              </div>
            </button>

            <button className="flex items-center gap-4 p-4 bg-gray-900/30 rounded-xl border border-gray-800/50 hover:border-gray-700/50 transition-all text-left w-full">
              <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-amber-500" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Notification Settings</p>
                <p className="text-gray-500 text-sm">Manage your preferences</p>
              </div>
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <div className="bg-[#1a1f2e] rounded-2xl p-6 shadow-lg border border-gray-800/50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 w-full p-4 bg-red-500/10 rounded-xl border border-red-500/30 hover:bg-red-500/20 transition-all"
          >
            <LogOut className="w-5 h-5 text-red-500" />
            <span className="text-red-400 font-medium">Logout</span>
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
