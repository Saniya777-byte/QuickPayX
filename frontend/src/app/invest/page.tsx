'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import AppLayout from '../../components/AppLayout';
import Toast from '../../components/Toast';
import { TrendingUp, TrendingDown, DollarSign, AlertCircle, Search } from 'lucide-react';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
}

interface PortfolioItem {
  symbol: string;
  name: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
}

export default function InvestPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [virtualBalance, setVirtualBalance] = useState(10000);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Mock stock data (in real app, this would come from an API)
  const [stocks] = useState<Stock[]>([
    { symbol: 'AAPL', name: 'Apple Inc.', price: 178.50, change: 2.3 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 141.25, change: -1.2 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.90, change: 1.8 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.75, change: 0.9 },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.50, change: -3.4 },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.30, change: 4.5 },
    { symbol: 'META', name: 'Meta Platforms', price: 505.75, change: 2.1 },
    { symbol: 'JPM', name: 'JPMorgan Chase', price: 198.40, change: 0.5 },
  ]);

  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [quantity, setQuantity] = useState('');
  const [action, setAction] = useState<'buy' | 'sell'>('buy');
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push('/');
      return;
    }
    loadInvestmentData();
  }, [user, authLoading, router]);

  const loadInvestmentData = async () => {
    try {
      const data = await apiService.getInvestment() as any;
      setVirtualBalance(data.virtualBalance || 10000);
      setPortfolio(data.portfolio || []);
    } catch (error) {
      console.error('Error loading investment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedStock || !quantity) {
      setError('Please select a stock and enter quantity');
      return;
    }

    const qty = parseFloat(quantity);
    if (isNaN(qty) || qty <= 0) {
      setError('Please enter a valid quantity');
      return;
    }

    const totalCost = qty * selectedStock.price;

    if (action === 'buy' && totalCost > virtualBalance) {
      setError('Insufficient virtual balance');
      return;
    }

    if (action === 'sell') {
      const portfolioItem = portfolio.find(p => p.symbol === selectedStock.symbol);
      if (!portfolioItem || portfolioItem.quantity < qty) {
        setError('Insufficient stock quantity');
        return;
      }
    }

    try {
      if (action === 'buy') {
        await apiService.buyStock(selectedStock.symbol, selectedStock.name, qty, selectedStock.price);
        setToast({ message: `Bought ${qty} shares of ${selectedStock.symbol}`, type: 'success' });
      } else {
        await apiService.sellStock(selectedStock.symbol, qty, selectedStock.price);
        setToast({ message: `Sold ${qty} shares of ${selectedStock.symbol}`, type: 'success' });
      }
      setQuantity('');
      setSelectedStock(null);
      loadInvestmentData();
    } catch (error: any) {
      setError(error.message || 'Trade failed');
      setToast({ message: error.message || 'Trade failed', type: 'error' });
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

  return (
    <AppLayout>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Paper Trading</h1>
          <p className="text-gray-400">Practice investing with virtual money</p>
        </div>

        {/* Virtual Balance Card */}
        <div className="bg-[#1a1f2e] rounded-2xl p-6 shadow-lg border border-gray-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-emerald-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Virtual Balance</p>
                <p className="text-4xl font-bold text-emerald-400">${virtualBalance.toFixed(2)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">Portfolio Value</p>
              <p className="text-2xl font-bold text-white">
                ${portfolio.reduce((sum, item) => sum + (item.quantity * item.currentPrice), 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stock List */}
          <div className="lg:col-span-2">
            <div className="bg-[#1a1f2e] rounded-2xl p-6 shadow-lg border border-gray-800/50">
              <h2 className="text-xl font-bold text-white mb-6">Available Stocks</h2>
              <div className="space-y-3">
                {stocks.map((stock) => (
                  <div
                    key={stock.symbol}
                    onClick={() => setSelectedStock(stock)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedStock?.symbol === stock.symbol
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : 'bg-gray-900/30 border-gray-800/50 hover:border-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <p className="text-white font-semibold">{stock.symbol}</p>
                          <p className="text-gray-400 text-sm">{stock.name}</p>
                        </div>
                        <p className="text-2xl font-bold text-white mt-2">${stock.price.toFixed(2)}</p>
                      </div>
                      <div className={`flex items-center gap-2 ${stock.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {stock.change >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                        <span className="font-semibold">{stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trade Panel */}
          <div className="lg:col-span-1">
            <div className="bg-[#1a1f2e] rounded-2xl p-6 shadow-lg border border-gray-800/50 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6">Trade</h2>
              
              {selectedStock ? (
                <form onSubmit={handleTrade} className="space-y-4">
                  <div className="bg-gray-900/30 rounded-xl p-4 border border-gray-800/50">
                    <p className="text-white font-semibold">{selectedStock.symbol}</p>
                    <p className="text-gray-400 text-sm">{selectedStock.name}</p>
                    <p className="text-2xl font-bold text-white mt-2">${selectedStock.price.toFixed(2)}</p>
                  </div>

                  {/* Action Toggle */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setAction('buy')}
                      className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                        action === 'buy' ? 'bg-emerald-500 text-white' : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                      }`}
                    >
                      Buy
                    </button>
                    <button
                      type="button"
                      onClick={() => setAction('sell')}
                      className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                        action === 'sell' ? 'bg-red-500 text-white' : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                      }`}
                    >
                      Sell
                    </button>
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      {error}
                    </div>
                  )}

                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-400 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      placeholder="0"
                      min="0"
                      required
                    />
                  </div>

                  {quantity && selectedStock && (
                    <div className="bg-gray-900/30 rounded-xl p-4 border border-gray-800/50">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Total Cost</span>
                        <span className="text-white font-semibold">${(parseFloat(quantity) * selectedStock.price).toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-[#1a1f2e] transition-all"
                  >
                    {action === 'buy' ? 'Buy Stock' : 'Sell Stock'}
                  </button>
                </form>
              ) : (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500">Select a stock to trade</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Portfolio Overview */}
        {portfolio.length > 0 && (
          <div className="bg-[#1a1f2e] rounded-2xl p-6 shadow-lg border border-gray-800/50">
            <h2 className="text-xl font-bold text-white mb-6">Your Portfolio</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {portfolio.map((item) => {
                const currentValue = item.quantity * item.currentPrice;
                const investedValue = item.quantity * item.averagePrice;
                const profitLoss = currentValue - investedValue;
                const profitLossPercent = (profitLoss / investedValue) * 100;

                return (
                  <div key={item.symbol} className="bg-gray-900/30 rounded-xl p-4 border border-gray-800/50">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-white font-semibold">{item.symbol}</p>
                      <span className={`text-sm ${profitLoss >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {profitLoss >= 0 ? '+' : ''}{profitLossPercent.toFixed(2)}%
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Quantity</span>
                        <span className="text-white">{item.quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Avg Price</span>
                        <span className="text-white">${item.averagePrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Current Value</span>
                        <span className="text-white font-semibold">${currentValue.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
