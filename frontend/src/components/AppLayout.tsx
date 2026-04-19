'use client';

import { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import { User, Bell, Settings } from 'lucide-react';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#0a0e27]">
      {/* Sidebar */}
      <Sidebar onLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* Top Navbar */}
        <header className="bg-[#0f141f]/95 backdrop-blur-sm border-b border-gray-800/60 px-8 py-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-base font-semibold text-white">
                Welcome back, <span className="text-emerald-400">{user.name}</span> 👋
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Notification bell */}
              <button
                className="relative p-2.5 text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700/60 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-400 rounded-full border-2 border-[#0f141f]" />
              </button>
              {/* Settings */}
              <button
                onClick={() => router.push('/profile')}
                className="p-2.5 text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700/60 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
              {/* User avatar */}
              <button
                onClick={() => router.push('/profile')}
                className="flex items-center gap-3 pl-3 border-l border-gray-800/60 hover:opacity-80 transition-opacity"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-md shadow-emerald-500/20">
                  <span className="text-white text-sm font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-white font-medium text-sm leading-tight">{user.name}</p>
                  <p className="text-gray-500 text-xs">{user.email}</p>
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
