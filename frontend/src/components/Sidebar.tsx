'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Home, 
  Wallet, 
  Send, 
  Receipt, 
  TrendingUp, 
  PieChart, 
  BookOpen, 
  User, 
  LogOut,
  CreditCard,
  Newspaper,
  Target
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

// Fix: Dashboard points directly to /dashboard/overview to avoid redirect loop
const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard/overview', icon: <Home className="w-5 h-5" /> },
  { name: 'Wallet', href: '/wallet', icon: <Wallet className="w-5 h-5" /> },
  { name: 'Transfer', href: '/transfer', icon: <Send className="w-5 h-5" /> },
  { name: 'Transactions', href: '/transactions', icon: <Receipt className="w-5 h-5" /> },
  { name: 'Invest', href: '/invest', icon: <TrendingUp className="w-5 h-5" /> },
  { name: 'Portfolio', href: '/portfolio', icon: <PieChart className="w-5 h-5" /> },
  { name: 'News', href: '/news', icon: <Newspaper className="w-5 h-5" /> },
  { name: 'Learn', href: '/learn', icon: <BookOpen className="w-5 h-5" /> },
  { name: 'Profile', href: '/profile', icon: <User className="w-5 h-5" /> },
];

interface SidebarProps {
  onLogout: () => void;
}

export default function Sidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname();

  // Check if a nav item is active — treat /dashboard and /dashboard/overview as same
  const isActive = (href: string) => {
    if (href === '/dashboard/overview') {
      return pathname === '/dashboard/overview' || pathname === '/dashboard';
    }
    return pathname === href;
  };

  return (
    <aside className="w-64 bg-[#0f141f] border-r border-gray-800/60 flex flex-col h-screen fixed left-0 top-0 z-50">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800/60">
        <Link href="/dashboard/overview" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-white">QuickPayX</span>
            <p className="text-xs text-emerald-400 font-medium">Finance + Invest</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider px-3 py-2">Main Menu</p>
        {navItems.slice(0, 4).map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm ${
                active
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 shadow-sm shadow-emerald-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              <span className={active ? 'text-emerald-400' : ''}>{item.icon}</span>
              <span>{item.name}</span>
              {active && <span className="ml-auto w-1.5 h-1.5 bg-emerald-400 rounded-full" />}
            </Link>
          );
        })}

        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider px-3 py-2 pt-4">Investments</p>
        {navItems.slice(4, 8).map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm ${
                active
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 shadow-sm shadow-emerald-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              <span className={active ? 'text-emerald-400' : ''}>{item.icon}</span>
              <span>{item.name}</span>
              {active && <span className="ml-auto w-1.5 h-1.5 bg-emerald-400 rounded-full" />}
            </Link>
          );
        })}

        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider px-3 py-2 pt-4">Account</p>
        {navItems.slice(8).map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm ${
                active
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 shadow-sm shadow-emerald-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              <span className={active ? 'text-emerald-400' : ''}>{item.icon}</span>
              <span>{item.name}</span>
              {active && <span className="ml-auto w-1.5 h-1.5 bg-emerald-400 rounded-full" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-800/60">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all font-medium text-sm"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
