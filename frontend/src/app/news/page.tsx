'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import AppLayout from '../../components/AppLayout';
import { Newspaper, TrendingUp, Clock, ArrowUpRight } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  source: string;
  publishedAt: string;
  url: string;
  imageUrl?: string;
  category: 'market' | 'trading' | 'crypto' | 'forex';
}

export default function NewsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push('/');
      return;
    }
    loadNews();
  }, [user, authLoading, router]);

  const loadNews = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/news');
      const newsData = await response.json();
      setNews(newsData);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNews = selectedCategory === 'all' 
    ? news 
    : news.filter(item => item.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'market': return 'bg-emerald-500/10 text-emerald-400';
      case 'trading': return 'bg-blue-500/10 text-blue-400';
      case 'crypto': return 'bg-purple-500/10 text-purple-400';
      case 'forex': return 'bg-orange-500/10 text-orange-400';
      default: return 'bg-gray-500/10 text-gray-400';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
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
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Market News</h1>
          <p className="text-gray-400">Stay updated with the latest investment and trading news</p>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 flex-wrap">
          {['all', 'market', 'trading', 'crypto', 'forex'].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl font-medium capitalize transition-all ${
                selectedCategory === category
                  ? 'bg-emerald-500 text-white'
                  : 'bg-[#1a1f2e] text-gray-400 hover:text-white border border-gray-800/50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredNews.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1a1f2e] rounded-2xl overflow-hidden shadow-lg border border-gray-800/50 hover:border-emerald-500/50 transition-all group"
            >
              {item.imageUrl && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <Clock className="w-4 h-4" />
                    {formatTimeAgo(item.publishedAt)}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                  {item.title}
                </h3>
                
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {item.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">{item.source}</span>
                  <ArrowUpRight className="w-5 h-5 text-gray-500 group-hover:text-emerald-400 transition-colors" />
                </div>
              </div>
            </a>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="bg-[#1a1f2e] rounded-2xl p-12 shadow-lg border border-gray-800/50 text-center">
            <Newspaper className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500">No news available for this category</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
