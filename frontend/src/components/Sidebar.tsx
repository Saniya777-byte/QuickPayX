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
  Newspaper
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: <Home className="w-5 h-5" /> },
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

  return (
    <aside className="w-64 bg-[#0f141f] border-r border-gray-800/50 flex flex-col h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800/50">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white">QuickPayX</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-800/50">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-red-500/10 hover:border hover:border-red-500/30 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
