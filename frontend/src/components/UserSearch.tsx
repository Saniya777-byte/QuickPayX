'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { apiService } from '../services/api';
import { Search, X, User } from 'lucide-react';

interface SearchResult {
  _id: string;
  name: string;
  email: string;
}

interface UserSearchProps {
  onUserSelect: (userId: string, userName: string) => void;
  selectedUserId?: string;
}

export default function UserSearch({ onUserSelect, selectedUserId }: UserSearchProps) {
  const [query, setQuery] = useState('');
  const [allUsers, setAllUsers] = useState<SearchResult[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load all users once on mount
  useEffect(() => {
    const loadAllUsers = async () => {
      try {
        const users = await apiService.getAllUsers();
        setAllUsers(users);
        setResults(users);
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        setInitialLoading(false);
      }
    };
    loadAllUsers();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      setResults(allUsers);
    } else {
      const filtered = allUsers.filter(u =>
        u.name.toLowerCase().includes(value.toLowerCase()) ||
        u.email.toLowerCase().includes(value.toLowerCase())
      );
      setResults(filtered);
    }
    setShowDropdown(true);
  };

  const handleUserClick = (user: SearchResult) => {
    setQuery(user.name);
    setShowDropdown(false);
    // Call directly — no useEffect needed, avoids infinite re-render
    onUserSelect(user._id, user.name);
  };

  const clearSearch = () => {
    setQuery('');
    setResults(allUsers);
    setShowDropdown(false);
    onUserSelect('', '');
  };

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        <input
          type="text"
          id="user-search"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowDropdown(true)}
          placeholder="Search by name or email..."
          autoComplete="off"
          className="w-full pl-10 pr-10 py-3 bg-gray-900/60 border border-gray-700/60 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
        />
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute z-50 w-full mt-2 bg-[#1a1f2e] rounded-xl border border-gray-800/60 shadow-2xl overflow-hidden">
          {initialLoading ? (
            <div className="flex items-center gap-3 p-4">
              <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
              <span className="text-gray-400 text-sm">Loading users...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="max-h-56 overflow-y-auto">
              <p className="text-gray-600 text-xs px-4 pt-3 pb-1">{results.length} user{results.length !== 1 ? 's' : ''} found</p>
              {results.map((user) => (
                <button
                  key={user._id}
                  type="button"
                  onClick={() => handleUserClick(user)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-800/60 transition-colors flex items-center gap-3 ${
                    selectedUserId === user._id ? 'bg-emerald-500/5' : ''
                  }`}
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-emerald-400/80 to-emerald-600/80 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-medium text-sm truncate">{user.name}</p>
                    <p className="text-gray-500 text-xs truncate">{user.email}</p>
                  </div>
                  {selectedUserId === user._id && (
                    <span className="ml-auto text-emerald-400 text-xs flex-shrink-0">Selected</span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 p-6 text-center">
              <User className="w-8 h-8 text-gray-700" />
              <p className="text-gray-500 text-sm">No users found{query ? ` for "${query}"` : ''}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
