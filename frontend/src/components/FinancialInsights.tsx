'use client';

import { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { AlertTriangle, TrendingUp, TrendingDown, Info, CheckCircle, Sparkles, RefreshCw } from 'lucide-react';

interface Insight {
  type: 'spending' | 'portfolio' | 'warning' | 'opportunity';
  title: string;
  description: string;
  metric?: string;
  trend?: 'up' | 'down' | 'neutral';
  priority: 'high' | 'medium' | 'low';
}

export default function FinancialInsights({ insights: propInsights }: { insights?: Insight[] }) {
  const [insights, setInsights] = useState<Insight[]>(propInsights || []);
  const [loading, setLoading] = useState(!propInsights);
  const [error, setError] = useState('');

  useEffect(() => {
    if (propInsights) {
      setInsights(propInsights);
      setLoading(false);
      return;
    }
    loadInsights();
  }, [propInsights]);

  const loadInsights = async () => {
    try {
      setError('');
      const data = await apiService.getInsights() as { insights: Insight[] };
      setInsights(data.insights || []);
    } catch (error) {
      console.error('Error loading insights:', error);
      setError('Failed to load insights');
      setInsights([]);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'opportunity':
        return <Sparkles className="w-5 h-5 text-emerald-500" />;
      case 'spending':
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      case 'portfolio':
        return <TrendingDown className="w-5 h-5 text-purple-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-amber-500/10 border-amber-500/30';
      case 'opportunity':
        return 'bg-emerald-500/10 border-emerald-500/30';
      case 'spending':
        return 'bg-blue-500/10 border-blue-500/30';
      case 'portfolio':
        return 'bg-purple-500/10 border-purple-500/30';
      default:
        return 'bg-blue-500/10 border-blue-500/30';
    }
  };

  const getTextColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'text-amber-400';
      case 'opportunity':
        return 'text-emerald-400';
      case 'spending':
        return 'text-blue-400';
      case 'portfolio':
        return 'text-purple-400';
      default:
        return 'text-blue-400';
    }
  };

  if (loading) {
    return (
      <div className="bg-[#1a1f2e] rounded-2xl p-6 shadow-lg border border-gray-800/50">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-6 h-6 text-emerald-500" />
          <h2 className="text-xl font-bold text-white">AI Insights</h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1f2e] rounded-2xl p-6 shadow-lg border border-gray-800/50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-emerald-500" />
          <h2 className="text-xl font-bold text-white">AI Insights</h2>
        </div>
        {error && (
          <button
            onClick={loadInsights}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {error ? (
        <div className="text-center py-8">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={loadInsights}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl transition-all"
          >
            Retry
          </button>
        </div>
      ) : insights.length === 0 ? (
        <div className="text-center py-8">
          <Info className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No insights available yet</p>
          <p className="text-gray-600 text-xs mt-1">Start making transactions to see personalized insights</p>
        </div>
      ) : (
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`${getBgColor(insight.type)} border rounded-xl p-4 hover:border-opacity-50 transition-all`}
            >
              <div className="flex items-start gap-3 mb-2">
                <div className="mt-0.5">{getIcon(insight.type)}</div>
                <div className="flex-1">
                  <h3 className={`text-sm font-semibold ${getTextColor(insight.type)}`}>{insight.title}</h3>
                  {insight.metric && (
                    <span className={`text-lg font-bold ${getTextColor(insight.type)}`}>{insight.metric}</span>
                  )}
                </div>
                {insight.trend && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    insight.trend === 'up' ? 'bg-emerald-500/20 text-emerald-400' :
                    insight.trend === 'down' ? 'bg-red-500/20 text-red-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {insight.trend === 'up' ? '↑' : insight.trend === 'down' ? '↓' : '→'}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400 ml-8">{insight.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
