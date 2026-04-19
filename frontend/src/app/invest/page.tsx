'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import AppLayout from '../../components/AppLayout';
import Toast from '../../components/Toast';
import { 
  TrendingUp, TrendingDown, DollarSign, AlertCircle, Search,
  BarChart2, Zap, RefreshCw
} from 'lucide-react';

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

// Initial static prices — these are the same across invest + portfolio for consistency
const STOCK_LIST: Stock[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 178.50, change: 2.3 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 141.25, change: -1.2 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.90, change: 1.8 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.75, change: 0.9 },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.50, change: -3.4 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.30, change: 4.5 },
  { symbol: 'META', name: 'Meta Platforms', price: 505.75, change: 2.1 },
  { symbol: 'JPM', name: 'JPMorgan Chase', price: 198.40, change: 0.5 },
];

export default function InvestPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [virtualBalance, setVirtualBalance] = useState(0);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [stocks] = useState<Stock[]>(STOCK_LIST);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [quantity, setQuantity] = useState('');
  const [action, setAction] = useState<'buy' | 'sell'>('buy');
  const [error, setError] = useState('');
  const [tradeLoading, setTradeLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/'); return; }
    loadInvestmentData();
  }, [user, authLoading, router]);

  const loadInvestmentData = async () => {
    try {
      const data = await apiService.getInvestment() as any;
      // Fix: use actual balance from API (default 0, not hardcoded 10000)
      setVirtualBalance(typeof data.virtualBalance === 'number' ? data.virtualBalance : 0);
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
    if (isNaN(qty) || qty <= 0 || !Number.isInteger(qty)) {
      setError('Please enter a valid whole number quantity');
      return;
    }

    const totalCost = qty * selectedStock.price;

    if (action === 'buy' && totalCost > virtualBalance) {
      setError(`Insufficient balance. Need $${totalCost.toFixed(2)}, have $${virtualBalance.toFixed(2)}`);
      return;
    }

    if (action === 'sell') {
      const portfolioItem = portfolio.find(p => p.symbol === selectedStock.symbol);
      if (!portfolioItem) {
        setError(`You don't own any ${selectedStock.symbol} shares`);
        return;
      }
      if (portfolioItem.quantity < qty) {
        setError(`You only have ${portfolioItem.quantity} shares of ${selectedStock.symbol}`);
        return;
      }
    }

    setTradeLoading(true);
    try {
      if (action === 'buy') {
        await apiService.buyStock(selectedStock.symbol, selectedStock.name, qty, selectedStock.price);
        setToast({ message: `✅ Bought ${qty} share${qty > 1 ? 's' : ''} of ${selectedStock.symbol} for $${totalCost.toFixed(2)}`, type: 'success' });
      } else {
        await apiService.sellStock(selectedStock.symbol, qty, selectedStock.price);
        const proceeds = qty * selectedStock.price;
        setToast({ message: `✅ Sold ${qty} share${qty > 1 ? 's' : ''} of ${selectedStock.symbol} for $${proceeds.toFixed(2)}`, type: 'success' });
      }
      setQuantity('');
      setSelectedStock(null);
      loadInvestmentData();
    } catch (err: any) {
      const msg = err.message || 'Trade failed';
      setError(msg);
      setToast({ message: msg, type: 'error' });
    } finally {
      setTradeLoading(false);
    }
  };

  const filteredStocks = searchQuery
    ? stocks.filter(s =>
        s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : stocks;

  const portfolioValue = portfolio.reduce((sum, item) => {
    const stockPrice = stocks.find(s => s.symbol === item.symbol)?.price ?? item.currentPrice;
    return sum + item.quantity * stockPrice;
  }, 0);

  const totalBalance = virtualBalance + portfolioValue;

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
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Paper Trading</h1>
            <p className="text-gray-400">Practice investing with virtual money — no real money at risk</p>
          </div>
          <button
            onClick={loadInvestmentData}
            className="flex items-center gap-2 text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700/50 px-3 py-2 rounded-xl border border-gray-700/50 text-sm transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Balance Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-gradient-to-br from-emerald-500/15 to-emerald-600/5 rounded-2xl p-6 border border-emerald-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-gray-400 text-sm">Virtual Cash</p>
            </div>
            <p className="text-3xl font-bold text-emerald-400">${virtualBalance.toFixed(2)}</p>
            <p className="text-emerald-500/60 text-xs mt-1">Available to invest</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/15 to-blue-600/5 rounded-2xl p-6 border border-blue-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <BarChart2 className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-gray-400 text-sm">Portfolio Value</p>
            </div>
            <p className="text-3xl font-bold text-blue-300">${portfolioValue.toFixed(2)}</p>
            <p className="text-blue-500/60 text-xs mt-1">{portfolio.length} stock{portfolio.length !== 1 ? 's' : ''} held</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/15 to-purple-600/5 rounded-2xl p-6 border border-purple-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-gray-400 text-sm">Total Assets</p>
            </div>
            <p className="text-3xl font-bold text-purple-300">${totalBalance.toFixed(2)}</p>
            <p className="text-purple-500/60 text-xs mt-1">Cash + portfolio</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stock List */}
          <div className="lg:col-span-2">
            <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800/60">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-white">Available Stocks</h2>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search stocks..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-44"
                  />
                </div>
              </div>
              <div className="space-y-2">
                {filteredStocks.map((stock) => {
                  const isSelected = selectedStock?.symbol === stock.symbol;
                  const owned = portfolio.find(p => p.symbol === stock.symbol);
                  return (
                    <div
                      key={stock.symbol}
                      onClick={() => { setSelectedStock(stock); setError(''); }}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-emerald-500/10 border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                          : 'bg-gray-900/30 border-gray-800/40 hover:border-gray-700/50 hover:bg-gray-800/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                            isSelected ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-300'
                          }`}>
                            {stock.symbol.slice(0, 2)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-white font-semibold">{stock.symbol}</p>
                              {owned && (
                                <span className="text-xs bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded-md border border-emerald-500/20">
                                  {owned.quantity} owned
                                </span>
                              )}
                            </div>
                            <p className="text-gray-400 text-sm">{stock.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold">${stock.price.toFixed(2)}</p>
                          <div className={`flex items-center justify-end gap-1 text-sm ${stock.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {stock.change >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                            <span className="font-medium">{stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {filteredStocks.length === 0 && (
                  <div className="text-center py-8 text-gray-500">No stocks match your search</div>
                )}
              </div>
            </div>
          </div>

          {/* Trade Panel */}
          <div className="lg:col-span-1">
            <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800/60 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-5">Execute Trade</h2>

              {selectedStock ? (
                <form onSubmit={handleTrade} className="space-y-4">
                  {/* Selected stock info */}
                  <div className="bg-gray-900/40 rounded-xl p-4 border border-gray-800/40">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 font-bold text-sm">
                        {selectedStock.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{selectedStock.symbol}</p>
                        <p className="text-gray-400 text-xs">{selectedStock.name}</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-white">${selectedStock.price.toFixed(2)}</p>
                    <p className={`text-xs mt-1 ${selectedStock.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {selectedStock.change >= 0 ? '▲' : '▼'} {Math.abs(selectedStock.change).toFixed(2)}% today
                    </p>
                  </div>

                  {/* Buy/Sell toggle */}
                  <div className="flex bg-gray-900/50 p-1 rounded-xl border border-gray-800/40 gap-1">
                    <button
                      type="button"
                      onClick={() => setAction('buy')}
                      className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                        action === 'buy'
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Buy
                    </button>
                    <button
                      type="button"
                      onClick={() => setAction('sell')}
                      className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                        action === 'sell'
                          ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Sell
                    </button>
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-2.5 rounded-xl flex items-start gap-2 text-sm">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-400 mb-2">
                      Number of Shares
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      placeholder="Enter quantity"
                      min="1"
                      step="1"
                      required
                    />
                  </div>

                  {quantity && parseFloat(quantity) > 0 && (
                    <div className="bg-gray-900/40 rounded-xl p-3 border border-gray-800/40 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Price per share</span>
                        <span className="text-white">${selectedStock.price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-800/40 pt-2">
                        <span className="text-gray-400 font-medium">
                          {action === 'buy' ? 'Total Cost' : 'Total Proceeds'}
                        </span>
                        <span className="text-white font-bold">
                          ${(parseFloat(quantity) * selectedStock.price).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={tradeLoading}
                    className={`w-full py-3 px-4 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      action === 'buy'
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                        : 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20'
                    }`}
                  >
                    {tradeLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      `${action === 'buy' ? 'Buy' : 'Sell'} ${selectedStock.symbol}`
                    )}
                  </button>
                </form>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-600" />
                  </div>
                  <p className="text-gray-400 font-medium">Select a stock</p>
                  <p className="text-gray-600 text-sm mt-1">Click any stock to start trading</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Portfolio Overview */}
        {portfolio.length > 0 && (
          <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800/60">
            <h2 className="text-xl font-bold text-white mb-5">Your Holdings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {portfolio.map((item) => {
                const livePrice = stocks.find(s => s.symbol === item.symbol)?.price ?? item.currentPrice;
                const currentValue = item.quantity * livePrice;
                const investedValue = item.quantity * item.averagePrice;
                const profitLoss = currentValue - investedValue;
                const profitLossPercent = investedValue > 0 ? (profitLoss / investedValue) * 100 : 0;
                const isProfit = profitLoss >= 0;

                return (
                  <div key={item.symbol} className="bg-gray-900/40 rounded-xl p-4 border border-gray-800/40 hover:border-gray-700/50 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-gray-300 font-bold text-xs">
                          {item.symbol.slice(0, 2)}
                        </div>
                        <p className="text-white font-semibold text-sm">{item.symbol}</p>
                      </div>
                      <span className={`text-xs font-semibold ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isProfit ? '+' : ''}{profitLossPercent.toFixed(2)}%
                      </span>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Qty</span>
                        <span className="text-white font-medium">{item.quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Avg Price</span>
                        <span className="text-white">${item.averagePrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-800/40 pt-1.5">
                        <span className="text-gray-500">Value</span>
                        <span className="text-white font-semibold">${currentValue.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">P&L</span>
                        <span className={`font-semibold ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
                          {isProfit ? '+' : ''}${profitLoss.toFixed(2)}
                        </span>
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
