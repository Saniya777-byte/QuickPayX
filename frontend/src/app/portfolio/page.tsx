'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import AppLayout from '../../components/AppLayout';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import {
  PieChart as PieChartIcon, TrendingUp, TrendingDown, DollarSign,
  Briefcase, RefreshCw, ArrowUpRight
} from 'lucide-react';

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

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1f2e] border border-gray-700/60 rounded-xl px-4 py-3 shadow-2xl">
        <p className="text-gray-400 text-xs mb-1">{label}</p>
        <p className="text-white font-bold">
          ${typeof payload[0].value === 'number' ? payload[0].value.toFixed(2) : '0.00'}
        </p>
      </div>
    );
  }
  return null;
};

export default function PortfolioPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/'); return; }
    loadPortfolio();
  }, [user, authLoading, router]);

  const loadPortfolio = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      setError(null);
      const data = await apiService.getPortfolioSummary() as PortfolioSummary;
      setSummary(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load portfolio data');
      setSummary(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
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

  if (error) {
    return (
      <AppLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Portfolio</h1>
            <p className="text-gray-400">Track your investment performance</p>
          </div>
          <div className="bg-[#1a1f2e] rounded-2xl p-16 border border-gray-800/60 text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingDown className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-red-400 text-lg font-semibold mb-2">Error loading portfolio</p>
            <p className="text-gray-500 text-sm mb-6">{error}</p>
            <button
              onClick={() => loadPortfolio()}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const pieData = summary?.portfolio.map(item => ({
    name: item.symbol,
    value: item.quantity * (item.currentPrice || 0)
  })).filter(d => d.value > 0) || [];

  const barData = summary?.portfolio.map(item => {
    const currPrice = item.currentPrice || 0;
    const avgPrice = item.averagePrice || 0;
    const currentValue = item.quantity * currPrice;
    const investedValue = item.quantity * avgPrice;
    const profitLoss = currentValue - investedValue;
    return {
      name: item.symbol,
      profit: isNaN(profitLoss) ? 0 : profitLoss,
    };
  }).filter(d => !isNaN(d.profit)) || [];

  const isProfit = (summary?.profitLoss ?? 0) >= 0;
  const hasPorfolio = (summary?.portfolio?.length ?? 0) > 0;

  const summaryCards = [
    {
      label: 'Virtual Balance',  value: `$${(summary?.virtualBalance ?? 0).toFixed(2)}`,
      icon: <DollarSign className="w-5 h-5" />, color: 'emerald',
      sub: 'Available to invest',
    },
    {
      label: 'Total Invested',   value: `$${(summary?.totalInvested ?? 0).toFixed(2)}`,
      icon: <Briefcase className="w-5 h-5" />, color: 'blue',
      sub: 'Capital deployed',
    },
    {
      label: 'Current Value',    value: `$${(summary?.currentValue ?? 0).toFixed(2)}`,
      icon: <PieChartIcon className="w-5 h-5" />, color: 'purple',
      sub: 'Market value today',
    },
    {
      label: 'Profit / Loss',
      value: `${isProfit ? '+' : ''}$${(summary?.profitLoss ?? 0).toFixed(2)}`,
      icon: isProfit ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />,
      color: isProfit ? 'emerald' : 'red',
      sub: `${isProfit ? '+' : ''}${(summary?.profitLossPercent ?? 0).toFixed(2)}% overall`,
    },
  ];

  const colorVariants: Record<string, string> = {
    emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    blue:    'bg-blue-500/15 text-blue-400 border-blue-500/20',
    purple:  'bg-purple-500/15 text-purple-400 border-purple-500/20',
    red:     'bg-red-500/15 text-red-400 border-red-500/20',
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Portfolio</h1>
            <p className="text-gray-400">Track your paper trading performance</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => loadPortfolio(true)}
              disabled={refreshing}
              className="flex items-center gap-2 text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700/50 px-3 py-2 rounded-xl border border-gray-700/50 text-sm transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => router.push('/invest')}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20"
            >
              <TrendingUp className="w-4 h-4" />
              Trade
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {summaryCards.map((card, i) => (
            <div key={i} className={`bg-[#1a1f2e] rounded-2xl p-6 border ${colorVariants[card.color].split(' ').pop()} transition-all`}>
              <div className={`w-10 h-10 ${colorVariants[card.color]} rounded-xl flex items-center justify-center mb-4 border`}>
                {card.icon}
              </div>
              <p className="text-gray-400 text-sm mb-1">{card.label}</p>
              <p className={`text-2xl font-bold ${card.color === 'red' ? 'text-red-400' : card.color === 'purple' ? 'text-purple-300' : card.color === 'blue' ? 'text-blue-300' : 'text-emerald-400'}`}>
                {card.value}
              </p>
              <p className="text-gray-600 text-xs mt-1">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        {hasPorfolio ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie chart */}
            <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800/60">
              <h2 className="text-lg font-bold text-white mb-5">Portfolio Allocation</h2>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={90}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) =>
                        active && payload?.length ? (
                          <div className="bg-[#1a1f2e] border border-gray-700/60 rounded-xl px-4 py-3 shadow-2xl">
                            <p className="text-gray-400 text-xs mb-1">{payload[0].name}</p>
                            <p className="text-white font-bold">${Number(payload[0].value).toFixed(2)}</p>
                          </div>
                        ) : null
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Legend */}
              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4">
                {pieData.map((entry, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-gray-400">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    {entry.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Bar chart */}
            <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800/60">
              <h2 className="text-lg font-bold text-white mb-5">Profit / Loss by Stock</h2>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                    <XAxis dataKey="name" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="profit"
                      name="P&L"
                      radius={[6, 6, 0, 0]}
                      fill="#10b981"
                    >
                      {barData.map((entry, i) => (
                        <Cell key={i} fill={entry.profit >= 0 ? '#10b981' : '#ef4444'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : (
          /* Empty state */
          <div className="bg-[#1a1f2e] rounded-2xl p-16 border border-gray-800/60 text-center">
            <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-5">
              <PieChartIcon className="w-10 h-10 text-gray-600" />
            </div>
            <p className="text-gray-400 text-lg font-semibold mb-2">No holdings yet</p>
            <p className="text-gray-600 text-sm mb-6">Start paper trading to build your portfolio</p>
            <button
              onClick={() => router.push('/invest')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all inline-flex items-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <TrendingUp className="w-4 h-4" />
              Start Trading
            </button>
          </div>
        )}

        {/* Holdings Table */}
        {hasPorfolio && (
          <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800/60">
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-gray-400" />
              Holdings
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800/60">
                    {['Symbol', 'Name', 'Qty', 'Avg Price', 'Current', 'Value', 'P&L'].map(h => (
                      <th key={h} className={`pb-3 text-gray-500 font-medium text-xs ${h === 'Symbol' || h === 'Name' ? 'text-left' : 'text-right'}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/30">
                  {summary!.portfolio.map((item, index) => {
                    const avg = item.averagePrice || 0;
                    const curr = item.currentPrice || 0;
                    const currentVal = item.quantity * curr;
                    const investedVal = item.quantity * avg;
                    const pl = currentVal - investedVal;
                    const plPct = investedVal > 0 ? (pl / investedVal) * 100 : 0;
                    const isPl = pl >= 0;

                    return (
                      <tr key={`${item.symbol || 'unknown'}-${index}`} className="hover:bg-gray-900/20 transition-colors">
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-gray-800 rounded-lg flex items-center justify-center text-gray-300 font-bold text-xs flex-shrink-0">
                              {(item.symbol || '').slice(0, 2)}
                            </div>
                            <span className="text-white font-semibold">{item.symbol || 'Unknown'}</span>
                          </div>
                        </td>
                        <td className="py-4 text-gray-400 max-w-[120px] truncate">{item.name || 'Unknown Asset'}</td>
                        <td className="py-4 text-right text-white">{item.quantity}</td>
                        <td className="py-4 text-right text-white">${avg.toFixed(2)}</td>
                        <td className="py-4 text-right text-white">${curr.toFixed(2)}</td>
                        <td className="py-4 text-right text-white font-semibold">${currentVal.toFixed(2)}</td>
                        <td className="py-4 text-right">
                          <div className={`inline-flex flex-col items-end ${isPl ? 'text-emerald-400' : 'text-red-400'}`}>
                            <span className="font-bold">{isPl ? '+' : ''}${pl.toFixed(2)}</span>
                            <span className="text-xs opacity-70">{isPl ? '+' : ''}{plPct.toFixed(2)}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
