'use client';

import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { UserPlus, ChevronRight } from 'lucide-react';

interface SearchResult {
  _id: string;
  name: string;
  email: string;
}

interface RecentUsersProps {
  onUserSelect: (userId: string, userName: string) => void;
}

export default function RecentUsers({ onUserSelect }: RecentUsersProps) {
  const [users, setUsers] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // Try recent first, fall back to all users
        const recent = await apiService.getRecentUsers();
        if (recent && recent.length > 0) {
          setUsers(recent);
        } else {
          const all = await apiService.getAllUsers();
          setUsers(all || []);
        }
      } catch {
        try {
          const all = await apiService.getAllUsers();
          setUsers(all || []);
        } catch {
          setUsers([]);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-4">
        <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
        <span className="text-gray-500 text-sm">Loading contacts...</span>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-3">
          <UserPlus className="w-6 h-6 text-gray-600" />
        </div>
        <p className="text-gray-500 text-sm">No contacts yet</p>
        <p className="text-gray-600 text-xs mt-1">Make a transfer to see contacts here</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {users.map((user) => (
        <button
          key={user._id}
          type="button"
          onClick={() => onUserSelect(user._id, user.name)}
          className="w-full flex items-center gap-3 p-3 bg-gray-900/40 hover:bg-gray-800/60 rounded-xl border border-gray-800/40 hover:border-emerald-500/20 transition-all group text-left"
        >
          <div className="w-9 h-9 bg-gradient-to-br from-emerald-400/80 to-emerald-600/80 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-sm truncate">{user.name}</p>
            <p className="text-gray-500 text-xs truncate">{user.email}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
        </button>
      ))}
    </div>
  );
}
