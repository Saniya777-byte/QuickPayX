'use client';

import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

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
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">{showAllUsers ? 'All Users' : 'Recent Contacts'}</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-400 text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  const usersToShow = showAllUsers ? allUsers : recentUsers;

  if (usersToShow.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">{showAllUsers ? 'All Users' : 'Recent Contacts'}</h2>
        </div>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-gray-400">{showAllUsers ? 'No users found' : 'No recent contacts yet'}</p>
          <p className="text-gray-500 text-sm mt-2">{showAllUsers ? 'Be the first user!' : 'Your recent transfers will appear here'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white">{showAllUsers ? 'All Users' : 'Recent Contacts'}</h2>
      </div>
      <div className="space-y-3">
        {usersToShow.map((user) => (
          <button
            key={user._id}
            type="button"
            onClick={() => handleUserClick(user)}
            className="w-full flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-white/10 hover:border-white/20 group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg group-hover:shadow-xl transition-shadow">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 text-left">
              <p className="text-white font-semibold group-hover:text-violet-300 transition-colors">{user.name}</p>
              <p className="text-gray-400 text-sm">{user.email}</p>
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
