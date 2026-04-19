'use client';

import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Users, ChevronRight, UserPlus } from 'lucide-react';

interface SearchResult {
  _id: string;
  name: string;
  email: string;
}

interface RecentUsersProps {
  onUserSelect: (userId: string, userName: string) => void;
}

export default function RecentUsers({ onUserSelect }: RecentUsersProps) {
  const [recentUsers, setRecentUsers] = useState<SearchResult[]>([]);
  const [allUsers, setAllUsers] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllUsers, setShowAllUsers] = useState(false);

  useEffect(() => {
    loadRecentUsers();
  }, []);

  const loadRecentUsers = async () => {
    try {
      const [recent, all] = await Promise.all([
        apiService.getRecentUsers(),
        apiService.getAllUsers()
      ]);
      setRecentUsers(recent);
      setAllUsers(all);
      setShowAllUsers(recent.length === 0);
    } catch (error) {
      console.error('Error loading recent users:', error);
      // If recent users fail, try to load all users
      try {
        const all = await apiService.getAllUsers();
        setAllUsers(all);
        setShowAllUsers(true);
      } catch (err) {
        console.error('Error loading all users:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (user: SearchResult) => {
    onUserSelect(user._id, user.name);
  };

  if (loading) {
    return (
      <div className="bg-[#1a1f2e] rounded-2xl p-8 shadow-lg border border-gray-800/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gray-800/50 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-white">{showAllUsers ? 'All Users' : 'Recent Contacts'}</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-400 text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  const usersToShow = showAllUsers ? allUsers : recentUsers;

  if (usersToShow.length === 0) {
    return (
      <div className="bg-[#1a1f2e] rounded-2xl p-8 shadow-lg border border-gray-800/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gray-800/50 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-white">{showAllUsers ? 'All Users' : 'Recent Contacts'}</h2>
        </div>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-gray-500" />
          </div>
          <p className="text-gray-400">{showAllUsers ? 'No users found' : 'No recent contacts yet'}</p>
          <p className="text-gray-500 text-sm mt-2">{showAllUsers ? 'Be the first user!' : 'Your recent transfers will appear here'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1f2e] rounded-2xl p-8 shadow-lg border border-gray-800/50">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-gray-800/50 rounded-xl flex items-center justify-center">
          <Users className="w-6 h-6 text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-white">{showAllUsers ? 'All Users' : 'Recent Contacts'}</h2>
      </div>
      <div className="space-y-3">
        {usersToShow.map((user) => (
          <button
            key={user._id}
            type="button"
            onClick={() => handleUserClick(user)}
            className="w-full flex items-center gap-4 p-4 bg-gray-900/30 rounded-xl hover:bg-gray-800/50 transition-all border border-gray-800/50 hover:border-gray-700/50 group"
          >
            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 text-left">
              <p className="text-white font-medium">{user.name}</p>
              <p className="text-gray-400 text-sm">{user.email}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
          </button>
        ))}
      </div>
    </div>
  );
}
