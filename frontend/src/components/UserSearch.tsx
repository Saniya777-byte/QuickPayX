'use client';

import { useState, useEffect, useRef } from 'react';
import { apiService } from '../services/api';

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
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string } | null>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (selectedUserId) {
      // If a user is already selected, we don't need to do anything
      // The parent component will handle displaying the selected user
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUserId]);

  useEffect(() => {
    if (selectedUser) {
      onUserSelect(selectedUser.id, selectedUser.name);
    }
  }, [selectedUser, onUserSelect]);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    setSelectedUser(null);

    if (searchQuery.length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    try {
      const users = await apiService.searchUsers(searchQuery);
      setResults(users);
      setShowDropdown(true);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = (value: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      handleSearch(value);
    }, 400);
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
    setResults([]);
    setShowDropdown(false);
    onUserSelect('', '');
  };

  return (
    <div className="relative">
      <label htmlFor="user-search" className="block text-sm font-medium text-gray-300 mb-2">
        Search User
      </label>
      <div className="relative">
        <input
          type="text"
          id="user-search"
          value={query}
          onChange={handleInputChange}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
          placeholder="Search by name or email..."
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
        />
        {query && (
          <button
            type="button"
            onClick={clearSelection}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {loading && (
        <div className="absolute z-10 w-full mt-2 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-300 text-sm">Searching...</span>
          </div>
        </div>
      )}

      {showDropdown && results.length > 0 && !loading && (
        <div className="absolute z-10 w-full mt-2 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl overflow-hidden">
          <div className="max-h-64 overflow-y-auto">
            {results.map((user) => (
              <button
                key={user._id}
                type="button"
                onClick={() => handleUserClick(user)}
                className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors border-b border-white/10 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white font-semibold">
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

      {showDropdown && results.length === 0 && !loading && query.length >= 2 && (
        <div className="absolute z-10 w-full mt-2 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4">
          <p className="text-gray-400 text-sm text-center">No users found</p>
        </div>
      )}
    </div>
  );
}
