'use client';

import { useState } from 'react';
import { apiService } from '../services/api';
import { MessageSquare, Send, Bot, User, Sparkles } from 'lucide-react';

interface ChatMessage {
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export default function FinancialChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      type: 'bot',
      content: 'Hi! I\'m your AI financial assistant. Ask me questions like "How much did I spend this month?" or "What\'s my top expense category?"',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const processQuery = async (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    try {
      // Get analytics data
      const analytics: any = await apiService.getAnalyticsSummary();
      const spendingByCategory: any = await apiService.getSpendingByCategory();
      const insights: any = await apiService.getInsights();
      
      // Ensure data is arrays
      const spendingArray = Array.isArray(spendingByCategory) ? spendingByCategory : [];
      const insightsArray = Array.isArray(insights) ? insights : [];
      
      // Process the query
      if (lowerQuery.includes('spent') && (lowerQuery.includes('month') || lowerQuery.includes('this month'))) {
        const monthlyTrends: any = await apiService.getMonthlyTrends(1);
        const trendsArray = Array.isArray(monthlyTrends) ? monthlyTrends : [];
        if (trendsArray.length > 0) {
          const currentMonth = trendsArray[trendsArray.length - 1];
          return `You spent $${currentMonth.spent.toFixed(2)} this month and received $${currentMonth.received.toFixed(2)}.`;
        }
        return 'No monthly data available yet.';
      }
      
      if (lowerQuery.includes('balance') || lowerQuery.includes('total')) {
        if (analytics && analytics.totalSent !== undefined) {
          const balance = analytics.totalReceived - analytics.totalSent;
          return `Your current balance is $${balance.toFixed(2)}. You've sent $${analytics.totalSent.toFixed(2)} and received $${analytics.totalReceived.toFixed(2)} in total.`;
        }
        return 'Unable to fetch balance information.';
      }
      
      if (lowerQuery.includes('top expense') || lowerQuery.includes('top category') || lowerQuery.includes('most spent')) {
        if (spendingArray.length > 0) {
          const top = spendingArray[0];
          const totalSpent = spendingArray.reduce((sum: number, cat: any) => sum + cat.amount, 0);
          const percent = totalSpent > 0 ? ((top.amount / totalSpent) * 100).toFixed(1) : '0';
          return `Your top expense category is ${top.category} with $${top.amount.toFixed(2)} (${percent}% of your spending).`;
        }
        return 'You don\'t have any spending data yet.';
      }
      
      if (lowerQuery.includes('transaction') || lowerQuery.includes('how many')) {
        if (analytics && analytics.transactionCount !== undefined) {
          return `You've made ${analytics.transactionCount} transactions in total.`;
        }
        return 'Unable to fetch transaction count.';
      }
      
      if (lowerQuery.includes('insight') || lowerQuery.includes('advice') || lowerQuery.includes('tip')) {
        if (insightsArray.length > 0) {
          return insightsArray[0].message;
        }
        return 'Start making transactions to get personalized insights!';
      }
      
      // Default response
      return 'I can help you with questions about your spending, balance, transactions, and insights. Try asking "How much did I spend this month?" or "What\'s my top expense?"';
    } catch (error) {
      console.error('Error processing query:', error);
      return 'Sorry, I couldn\'t fetch your financial data right now. Please try again.';
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate processing delay for natural feel
    await new Promise(resolve => setTimeout(resolve, 500));

    const botResponse = await processQuery(input);
    
    const botMessage: ChatMessage = {
      type: 'bot',
      content: botResponse,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMessage]);
    setLoading(false);
  };

  return (
    <div className="bg-[#1a1f2e] rounded-2xl p-6 shadow-lg border border-gray-800/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-emerald-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">AI Assistant</h2>
          <p className="text-gray-500 text-xs">Ask about your finances</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="h-80 overflow-y-auto mb-4 space-y-4 pr-2 scrollbar-thin">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
              msg.type === 'user' ? 'bg-emerald-500' : 'bg-gray-800/50'
            }`}>
              {msg.type === 'user' ? (
                <User className="w-4 h-4 text-white" />
              ) : (
                <Bot className="w-4 h-4 text-emerald-500" />
              )}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.type === 'user'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-800/50 text-gray-300 border border-gray-700/50'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <p className={`text-[10px] mt-1 ${msg.type === 'user' ? 'text-emerald-100' : 'text-gray-500'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-800/50 rounded-lg flex items-center justify-center">
              <Bot className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your finances..."
          className="flex-1 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>

      {/* Quick Questions */}
      <div className="mt-4 flex flex-wrap gap-2">
        {[
          'How much did I spend this month?',
          'What\'s my balance?',
          'Top expense category?',
          'Transaction count?'
        ].map((question, index) => (
          <button
            key={index}
            onClick={() => setInput(question)}
            className="text-xs bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white px-3 py-2 rounded-lg transition-all border border-gray-700/50"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}
