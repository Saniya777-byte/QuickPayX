'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import AppLayout from '../../components/AppLayout';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PieChart as PieChartIcon, TrendingUp, TrendingDown, DollarSign, Briefcase } from 'lucide-react';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

interface PortfolioItem {
  symbol: string;
  name: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
}

interface PortfolioSummary {
  virtualBalance: number;
  totalInvested: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercent: number;
  portfolio: PortfolioItem[];
}

export default function PortfolioPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push('/');
      return;
    }
    loadPortfolio();
  }, [user, authLoading, router]);

  const loadPortfolio = async () => {
    try {
      setError(null);
      const data = await apiService.getPortfolioSummary() as PortfolioSummary;
      setSummary(data);
    } catch (error: any) {
      console.error('Error loading portfolio:', error);
      setError(error.message || 'Failed to load portfolio data');
      setSummary(null);
    } finally {
      setLoading(false);
    }
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

  if (error) {
    return (
      <AppLayout>
        <div className="bg-[#1a1f2e] rounded-2xl p-12 shadow-lg border border-gray-800/50 text-center">
          <p className="text-red-400 text-lg mb-4">Error loading portfolio</p>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <button
            onClick={loadPortfolio}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-xl transition-all"
          >
            Retry
          </button>
        </div>
      </AppLayout>
    );
  }

  const pieData = summary?.portfolio.map(item => ({
    name: item.symbol,
    value: item.quantity * (item.currentPrice || 0)
  })) || [];

  const barData = summary?.portfolio.map(item => {
    const currPrice = item.currentPrice || 0;
    const avgPrice = item.averagePrice || 0;
    const currentValue = item.quantity * currPrice;
    const investedValue = item.quantity * avgPrice;
    const profitLoss = currentValue - investedValue;
    return {
      name: item.symbol,
      profit: isNaN(profitLoss) ? 0 : profitLoss,
      percent: investedValue > 0 && !isNaN(profitLoss) ? (profitLoss / investedValue) * 100 : 0
    };
  }).filter(item => !isNaN(item.profit)) || [];

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Portfolio</h1>
          <p className="text-gray-400">Track your investment performance</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-[#1a1f2e] rounded-2xl p-6 shadow-lg border border-gray-800/50">
            <div className="flex items-center gap-3 mb-3">
              <DollarSign className="w-5 h-5 text-emerald-500" />
              <p className="text-gray-400 text-sm">Virtual Balance</p>
            </div>
            <p className="text-2xl font-bold text-white">${summary?.virtualBalance?.toFixed(2) || '0.00'}</p>
          </div>

          <div className="bg-[#1a1f2e] rounded-2xl p-6 shadow-lg border border-gray-800/50">
            <div className="flex items-center gap-3 mb-3">
              <Briefcase className="w-5 h-5 text-blue-500" />
              <p className="text-gray-400 text-sm">Total Invested</p>
            </div>
            <p className="text-2xl font-bold text-white">${summary?.totalInvested?.toFixed(2) || '0.00'}</p>
          </div>

          <div className="bg-[#1a1f2e] rounded-2xl p-6 shadow-lg border border-gray-800/50">
            <div className="flex items-center gap-3 mb-3">
              <PieChartIcon className="w-5 h-5 text-purple-500" />
              <p className="text-gray-400 text-sm">Current Value</p>
            </div>
            <p className="text-2xl font-bold text-white">${summary?.currentValue?.toFixed(2) || '0.00'}</p>
          </div>

          <div className="bg-[#1a1f2e] rounded-2xl p-6 shadow-lg border border-gray-800/50">
            <div className="flex items-center gap-3 mb-3">
              {(summary?.profitLoss || 0) >= 0 ? <TrendingUp className="w-5 h-5 text-emerald-500" /> : <TrendingDown className="w-5 h-5 text-red-500" />}
              <p className="text-gray-400 text-sm">Profit/Loss</p>
            </div>
            <p className={`text-2xl font-bold ${(summary?.profitLoss || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {(summary?.profitLoss || 0) >= 0 ? '+' : ''}${summary?.profitLoss?.toFixed(2) || '0.00'}
            </p>
            <p className={`text-sm ${(summary?.profitLossPercent || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {(summary?.profitLossPercent || 0) >= 0 ? '+' : ''}{summary?.profitLossPercent?.toFixed(2) || '0.00'}%
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Portfolio Allocation */}
          <div className="bg-[#1a1f2e] rounded-2xl p-6 shadow-lg border border-gray-800/50">
            <h2 className="text-xl font-bold text-white mb-6">Portfolio Allocation</h2>
            {pieData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1f2e',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                      formatter={(value: any) => {
                        if (isNaN(value)) return '$0.00';
                        if (typeof value === 'number') return `$${value.toFixed(2)}`;
                        return value;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No portfolio data
              </div>
            )}
          </div>

          {/* Profit/Loss by Stock */}
          <div className="bg-[#1a1f2e] rounded-2xl p-6 shadow-lg border border-gray-800/50">
            <h2 className="text-xl font-bold text-white mb-6">Profit/Loss by Stock</h2>
            {barData && barData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1f2e',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                      formatter={(value: any) => {
                        if (isNaN(value)) return '$0.00';
                        if (typeof value === 'number') return `$${value.toFixed(2)}`;
                        return value;
                      }}
                    />
                    <Bar dataKey="profit" name="Profit/Loss" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No portfolio data
              </div>
            )}
          </div>
        </div>

        {/* Holdings Table */}
        <div className="bg-[#1a1f2e] rounded-2xl p-6 shadow-lg border border-gray-800/50">
          <h2 className="text-xl font-bold text-white mb-6">Holdings</h2>
          {summary?.portfolio && summary.portfolio.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800/50">
                    <th className="text-left text-gray-400 font-medium pb-4">Symbol</th>
                    <th className="text-left text-gray-400 font-medium pb-4">Name</th>
                    <th className="text-right text-gray-400 font-medium pb-4">Quantity</th>
                    <th className="text-right text-gray-400 font-medium pb-4">Avg Price</th>
                    <th className="text-right text-gray-400 font-medium pb-4">Current Price</th>
                    <th className="text-right text-gray-400 font-medium pb-4">Value</th>
                    <th className="text-right text-gray-400 font-medium pb-4">Profit/Loss</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.portfolio.map((item) => {
                    const avgPrice = item.averagePrice || 0;
                    const currPrice = item.currentPrice || 0;
                    const currentValue = item.quantity * currPrice;
                    const investedValue = item.quantity * avgPrice;
                    const profitLoss = currentValue - investedValue;
                    const profitLossPercent = investedValue > 0 ? (profitLoss / investedValue) * 100 : 0;

                    return (
                      <tr key={item.symbol} className="border-b border-gray-800/30 hover:bg-gray-900/30">
                        <td className="py-4 text-white font-semibold">{item.symbol}</td>
                        <td className="py-4 text-gray-400">{item.name}</td>
                        <td className="py-4 text-right text-white">{item.quantity}</td>
                        <td className="py-4 text-right text-white">${avgPrice.toFixed(2)}</td>
                        <td className="py-4 text-right text-white">${currPrice.toFixed(2)}</td>
                        <td className="py-4 text-right text-white font-semibold">${currentValue.toFixed(2)}</td>
                        <td className={`py-4 text-right font-semibold ${profitLoss >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {profitLoss >= 0 ? '+' : ''}${profitLoss.toFixed(2)} ({profitLossPercent >= 0 ? '+' : ''}{profitLossPercent.toFixed(2)}%)
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500">No holdings yet</p>
              <p className="text-gray-600 text-sm mt-2">Start trading to build your portfolio</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
