'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import AppLayout from '../../components/AppLayout';
import { Newspaper, Clock, ArrowUpRight, TrendingUp, Bitcoin, Globe, BarChart2 } from 'lucide-react';

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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const CATEGORY_META: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  all:     { label: 'All News',  color: 'bg-gray-500/15 text-gray-300 border-gray-500/30',    icon: <Newspaper className="w-3.5 h-3.5" /> },
  market:  { label: 'Market',   color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', icon: <BarChart2 className="w-3.5 h-3.5" /> },
  trading: { label: 'Trading',  color: 'bg-blue-500/15 text-blue-400 border-blue-500/30',    icon: <TrendingUp className="w-3.5 h-3.5" /> },
  crypto:  { label: 'Crypto',   color: 'bg-purple-500/15 text-purple-400 border-purple-500/30', icon: <Bitcoin className="w-3.5 h-3.5" /> },
  forex:   { label: 'Forex',    color: 'bg-orange-500/15 text-orange-400 border-orange-500/30', icon: <Globe className="w-3.5 h-3.5" /> },
};

export default function NewsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/'); return; }
    loadNews();
  }, [user, authLoading, router]);

  // Fix: use API_URL from env instead of hardcoded localhost
  const loadNews = async () => {
    try {
      const response = await fetch(`${API_URL}/news`);
      if (!response.ok) throw new Error('Failed to fetch news');
      const newsData = await response.json();
      setNews(Array.isArray(newsData) ? newsData : []);
    } catch (error) {
      console.error('Error loading news:', error);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredNews = selectedCategory === 'all'
    ? news
    : news.filter(item => item.category === selectedCategory);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffH = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffH < 1) return 'Just now';
    if (diffH < 24) return `${diffH}h ago`;
    const diffD = Math.floor(diffH / 24);
    if (diffD < 7) return `${diffD}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Market News</h1>
          <p className="text-gray-400">Stay updated with the latest investment and trading news</p>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 flex-wrap">
          {Object.entries(CATEGORY_META).map(([key, meta]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                selectedCategory === key
                  ? meta.color + ' shadow-sm'
                  : 'bg-[#1a1f2e] text-gray-400 border-gray-800/50 hover:text-white hover:border-gray-700/50'
              }`}
            >
              {meta.icon}
              {meta.label}
            </button>
          ))}
        </div>

        {/* News Grid */}
        {filteredNews.length === 0 ? (
          <div className="bg-[#1a1f2e] rounded-2xl p-16 border border-gray-800/60 text-center">
            <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Newspaper className="w-10 h-10 text-gray-600" />
            </div>
            <p className="text-gray-400 text-lg font-medium">No news available</p>
            <p className="text-gray-600 text-sm mt-1">Check back later for the latest updates</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredNews.map((item) => {
              const catMeta = CATEGORY_META[item.category] || CATEGORY_META.all;
              return (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#1a1f2e] rounded-2xl overflow-hidden border border-gray-800/60 hover:border-emerald-500/40 transition-all group flex flex-col"
                >
                  {item.imageUrl ? (
                    <div className="h-44 overflow-hidden relative">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1f2e]/80 to-transparent" />
                    </div>
                  ) : (
                    <div className="h-32 bg-gradient-to-br from-gray-800/50 to-gray-900/50 flex items-center justify-center">
                      <Newspaper className="w-10 h-10 text-gray-700" />
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${catMeta.color}`}>
                        {catMeta.icon}
                        {item.category}
                      </span>
                      <div className="flex items-center gap-1 text-gray-500 text-xs">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(item.publishedAt)}
                      </div>
                    </div>

                    <h3 className="text-white font-bold mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">{item.description}</p>

                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-800/40">
                      <span className="text-gray-500 text-xs font-medium">{item.source}</span>
                      <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Read more
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
