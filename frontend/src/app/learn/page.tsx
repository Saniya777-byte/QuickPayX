'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import AppLayout from '../../components/AppLayout';
import { BookOpen, TrendingUp, Shield, PieChart, Target, Lightbulb, ArrowRight } from 'lucide-react';

interface LearningCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  topics: string[];
}

export default function LearnPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push('/');
      return;
    }
  }, [user, authLoading, router]);

  const learningCards: LearningCard[] = [
    {
      id: 'stock-basics',
      title: 'Stock Market Basics',
      description: 'Learn what stocks are, how they work, and why companies issue them.',
      icon: <TrendingUp className="w-8 h-8" />,
      color: 'emerald',
      topics: ['What are stocks?', 'How stock prices work', 'Market participants', 'Reading stock charts']
    },
    {
      id: 'risk-management',
      title: 'Risk Management',
      description: 'Understand investment risks and how to protect your portfolio.',
      icon: <Shield className="w-8 h-8" />,
      color: 'blue',
      topics: ['Types of investment risk', 'Diversification strategies', 'Stop-loss orders', 'Position sizing']
    },
    {
      id: 'diversification',
      title: 'Diversification',
      description: 'Learn why spreading your investments across different assets is crucial.',
      icon: <PieChart className="w-8 h-8" />,
      color: 'purple',
      topics: ['Asset allocation', 'Sector diversification', 'Geographic diversification', 'Rebalancing']
    },
    {
      id: 'goal-setting',
      title: 'Investment Goals',
      description: 'Set clear financial goals and create a strategy to achieve them.',
      icon: <Target className="w-8 h-8" />,
      color: 'amber',
      topics: ['Short-term vs long-term', 'Risk tolerance', 'Time horizon', 'Goal-based investing']
    },
    {
      id: 'analysis',
      title: 'Fundamental Analysis',
      description: 'Learn to analyze companies using financial statements and ratios.',
      icon: <BookOpen className="w-8 h-8" />,
      color: 'rose',
      topics: ['Financial statements', 'Key ratios', 'Valuation methods', 'Industry analysis']
    },
    {
      id: 'strategies',
      title: 'Investment Strategies',
      description: 'Explore different investment approaches and find what suits you.',
      icon: <Lightbulb className="w-8 h-8" />,
      color: 'cyan',
      topics: ['Value investing', 'Growth investing', 'Index investing', 'Dollar-cost averaging']
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      blue: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
      purple: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
      amber: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      rose: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
      cyan: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
    };
    return colors[color as keyof typeof colors] || colors.emerald;
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Investment Learning</h1>
          <p className="text-gray-400">Master the fundamentals of investing</p>
        </div>

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-2xl p-8 border border-emerald-500/20">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome to Investment Learning</h2>
              <p className="text-gray-400 max-w-2xl">
                Start your journey to becoming a smart investor. Learn the fundamentals of stock market investing, risk management, and portfolio strategies. Each topic is designed to help you make informed decisions.
              </p>
            </div>
          </div>
        </div>

        {/* Learning Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {learningCards.map((card) => (
            <div
              key={card.id}
              className="bg-[#1a1f2e] rounded-2xl p-6 shadow-lg border border-gray-800/50 hover:border-gray-700/50 transition-all cursor-pointer group"
            >
              <div className={`w-14 h-14 ${getColorClasses(card.color)} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                {card.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{card.description}</p>
              <div className="space-y-2">
                {card.topics.map((topic, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                    <span className="text-gray-400">{topic}</span>
                  </div>
                ))}
              </div>
              <button className="mt-4 flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors">
                Start Learning
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Quick Tips */}
        <div className="bg-[#1a1f2e] rounded-2xl p-6 shadow-lg border border-gray-800/50">
          <h2 className="text-xl font-bold text-white mb-6">Quick Tips for Beginners</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-4 p-4 bg-gray-900/30 rounded-xl border border-gray-800/50">
              <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-emerald-400 font-bold">1</span>
              </div>
              <div>
                <p className="text-white font-medium mb-1">Start Small</p>
                <p className="text-gray-500 text-sm">Begin with investments you can afford to lose as you learn.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gray-900/30 rounded-xl border border-gray-800/50">
              <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-emerald-400 font-bold">2</span>
              </div>
              <div>
                <p className="text-white font-medium mb-1">Diversify</p>
                <p className="text-gray-500 text-sm">Don't put all your eggs in one basket. Spread your investments.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gray-900/30 rounded-xl border border-gray-800/50">
              <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-emerald-400 font-bold">3</span>
              </div>
              <div>
                <p className="text-white font-medium mb-1">Think Long-term</p>
                <p className="text-gray-500 text-sm">Investing is a marathon, not a sprint. Patience pays off.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gray-900/30 rounded-xl border border-gray-800/50">
              <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-emerald-400 font-bold">4</span>
              </div>
              <div>
                <p className="text-white font-medium mb-1">Keep Learning</p>
                <p className="text-gray-500 text-sm">The market is always changing. Stay informed and educated.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Practice Trading CTA */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-8 border border-blue-500/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Ready to Practice?</h2>
              <p className="text-gray-400">Try paper trading with virtual money to test your strategies.</p>
            </div>
            <button
              onClick={() => router.push('/invest')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold transition-all"
            >
              Start Paper Trading
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
