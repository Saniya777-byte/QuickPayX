'use client';

import { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, DollarSign, CreditCard } from 'lucide-react';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

interface SpendingByCategory {
  category: string;
  amount: number;
  count: number;
}

interface MonthlyTrend {
  month: string;
  spent: number;
  received: number;
}

export default function AnalyticsDashboard() {
  const [spendingByCategory, setSpendingByCategory] = useState<SpendingByCategory[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setError('');
      const [spendingData, trendsData] = await Promise.all([
        apiService.getSpendingByCategory(),
        apiService.getMonthlyTrends(6)
      ]);
      
      // Ensure data is an array
      const spendingArray = Array.isArray(spendingData) ? spendingData : [];
      const trendsArray = Array.isArray(trendsData) ? trendsData : [];
      
      setSpendingByCategory(spendingArray as SpendingByCategory[]);
      setMonthlyTrends(trendsArray as MonthlyTrend[]);
    } catch (error) {
      console.error('Error loading analytics:', error);
      setError('Failed to load analytics data');
      // Set empty arrays as fallback
      setSpendingByCategory([]);
      setMonthlyTrends([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#1a1f2e] rounded-2xl p-6 shadow-lg border border-gray-800/50">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-emerald-500" />
          <h2 className="text-xl font-bold text-white">Analytics Dashboard</h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#1a1f2e] rounded-2xl p-6 shadow-lg border border-gray-800/50">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-emerald-500" />
          <h2 className="text-xl font-bold text-white">Analytics Dashboard</h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={loadAnalytics}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl transition-all"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const pieData = spendingByCategory.map(item => ({
    name: item.category.charAt(0).toUpperCase() + item.category.slice(1),
    value: item.amount
  }));

  const totalSpent = spendingByCategory.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="bg-[#1a1f2e] rounded-2xl p-6 shadow-lg border border-gray-800/50">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-6 h-6 text-emerald-500" />
        <h2 className="text-xl font-bold text-white">Analytics Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Spending by Category Pie Chart */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-500" />
            Spending by Category
          </h3>
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
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-700 rounded-xl">
              <DollarSign className="w-12 h-12 mb-3 opacity-50" />
              <p className="text-sm">No spending data available yet</p>
              <p className="text-xs mt-1">Make transactions to see your spending breakdown</p>
            </div>
          )}
          <div className="mt-4 text-center">
            <p className="text-gray-400 text-sm">Total Spent: <span className="text-emerald-400 font-semibold">${totalSpent.toFixed(2)}</span></p>
          </div>
        </div>

        {/* Monthly Trends Bar Chart */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-500" />
            Monthly Trends
          </h3>
          {monthlyTrends.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#9ca3af"
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1f2e',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ color: '#9ca3af' }}
                  />
                  <Bar dataKey="spent" name="Spent" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="received" name="Received" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-700 rounded-xl">
              <CreditCard className="w-12 h-12 mb-3 opacity-50" />
              <p className="text-sm">No trend data available yet</p>
              <p className="text-xs mt-1">Your monthly spending trends will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
