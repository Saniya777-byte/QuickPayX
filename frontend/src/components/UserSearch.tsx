'use client';

import { useState, useEffect, useRef } from 'react';
import { apiService } from '../services/api';
import { X, Search } from 'lucide-react';

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
  const [results, setResults] = useState<SearchResult[]>([]);
  const [allUsers, setAllUsers] = useState<SearchResult[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string } | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Load all users on mount
  useEffect(() => {
    const loadAllUsers = async () => {
      setInitialLoading(true);
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

  useEffect(() => {
    if (selectedUser) {
      onUserSelect(selectedUser.id, selectedUser.name);
    }
  }, [selectedUser, onUserSelect]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setSelectedUser(null);

    if (!searchQuery || searchQuery.length === 0) {
      setResults(allUsers);
      setShowDropdown(true);
      return;
    }

    // Filter from all users locally
    const filtered = allUsers.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setResults(filtered);
    setShowDropdown(true);
  };

  const debouncedSearch = (value: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      handleSearch(value);
    }, 300);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    debouncedSearch(value);
  };

  const handleUserClick = (user: SearchResult) => {
    setSelectedUser({ id: user._id, name: user.name });
    setQuery(user.name);
    setShowDropdown(false);
  };

  const clearSelection = () => {
    setSelectedUser(null);
    setQuery('');
    setResults(allUsers);
    setShowDropdown(false);
    onUserSelect('', '');
  };

  return (
    <div className="relative">
      <label htmlFor="user-search" className="block text-sm font-medium text-gray-400 mb-2">
        Search User
      </label>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          id="user-search"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowDropdown(true)}
          placeholder="Search by name or email..."
          className="w-full pl-12 pr-12 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
        />
        {query && (
          <button
            type="button"
            onClick={clearSelection}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {initialLoading && (
        <div className="absolute z-10 w-full mt-2 bg-[#1a1f2e] rounded-xl border border-gray-800/50 p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-400 text-sm">Loading users...</span>
          </div>
        </div>
      )}

      {showDropdown && results.length > 0 && !initialLoading && (
        <div className="absolute z-10 w-full mt-2 bg-[#1a1f2e] rounded-xl border border-gray-800/50 shadow-lg overflow-hidden">
          <div className="max-h-64 overflow-y-auto">
            {results.map((user) => (
              <button
                key={user._id}
                type="button"
                onClick={() => handleUserClick(user)}
                className="w-full px-4 py-3 text-left hover:bg-gray-800/50 transition-colors border-b border-gray-800/50 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-medium">{user.name}</p>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {showDropdown && results.length === 0 && !initialLoading && query && (
        <div className="absolute z-10 w-full mt-2 bg-[#1a1f2e] rounded-xl border border-gray-800/50 p-4 shadow-lg">
          <p className="text-gray-400 text-sm text-center">No users found</p>
        </div>
      )}
    </div>
  );
}
