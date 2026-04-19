'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import AppLayout from '../../components/AppLayout';
import { 
  BookOpen, TrendingUp, Shield, PieChart, Target, Lightbulb, 
  ArrowRight, CheckCircle, Play
} from 'lucide-react';

interface LearningCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  topics: string[];
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
}

export default function LearnPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/'); return; }
  }, [user, authLoading, router]);

  const learningCards: LearningCard[] = [
    {
      id: 'stock-basics',
      title: 'Stock Market Basics',
      description: 'Learn what stocks are, how they work, and why companies issue them to investors.',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'emerald',
      topics: ['What are stocks?', 'How prices work', 'Market participants', 'Reading charts'],
      level: 'Beginner',
      duration: '15 min',
    },
    {
      id: 'risk-management',
      title: 'Risk Management',
      description: 'Understand investment risks and proven strategies to protect your portfolio.',
      icon: <Shield className="w-6 h-6" />,
      color: 'blue',
      topics: ['Types of risk', 'Diversification', 'Stop-loss orders', 'Position sizing'],
      level: 'Beginner',
      duration: '20 min',
    },
    {
      id: 'diversification',
      title: 'Diversification',
      description: 'Learn why spreading investments across different assets is crucial for long-term success.',
      icon: <PieChart className="w-6 h-6" />,
      color: 'purple',
      topics: ['Asset allocation', 'Sector spread', 'Geographic diversity', 'Rebalancing'],
      level: 'Intermediate',
      duration: '18 min',
    },
    {
      id: 'goal-setting',
      title: 'Investment Goals',
      description: 'Set clear financial goals and build a strategy tailored to your risk tolerance.',
      icon: <Target className="w-6 h-6" />,
      color: 'amber',
      topics: ['Short vs long-term', 'Risk tolerance', 'Time horizon', 'Goal investing'],
      level: 'Beginner',
      duration: '12 min',
    },
    {
      id: 'analysis',
      title: 'Fundamental Analysis',
      description: 'Learn to evaluate companies using financial statements, ratios and industry trends.',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'rose',
      topics: ['Financial statements', 'Key ratios', 'Valuation methods', 'Industry analysis'],
      level: 'Advanced',
      duration: '30 min',
    },
    {
      id: 'strategies',
      title: 'Investment Strategies',
      description: 'Explore proven investment approaches and discover what suits your style.',
      icon: <Lightbulb className="w-6 h-6" />,
      color: 'cyan',
      topics: ['Value investing', 'Growth investing', 'Index funds', 'Dollar-cost avg'],
      level: 'Intermediate',
      duration: '25 min',
    },
  ];

  const colorClasses: Record<string, { icon: string; badge: string; border: string; level?: string }> = {
    emerald: { icon: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', badge: 'bg-emerald-500/10 text-emerald-400', border: 'hover:border-emerald-500/30' },
    blue:    { icon: 'bg-blue-500/10 text-blue-400 border-blue-500/20',    badge: 'bg-blue-500/10 text-blue-400',    border: 'hover:border-blue-500/30' },
    purple:  { icon: 'bg-purple-500/10 text-purple-400 border-purple-500/20', badge: 'bg-purple-500/10 text-purple-400', border: 'hover:border-purple-500/30' },
    amber:   { icon: 'bg-amber-500/10 text-amber-400 border-amber-500/20', badge: 'bg-amber-500/10 text-amber-400', border: 'hover:border-amber-500/30' },
    rose:    { icon: 'bg-rose-500/10 text-rose-400 border-rose-500/20',    badge: 'bg-rose-500/10 text-rose-400',   border: 'hover:border-rose-500/30' },
    cyan:    { icon: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',    badge: 'bg-cyan-500/10 text-cyan-400',   border: 'hover:border-cyan-500/30' },
  };

  const levelColor: Record<string, string> = {
    Beginner:     'bg-emerald-500/10 text-emerald-400',
    Intermediate: 'bg-amber-500/10 text-amber-400',
    Advanced:     'bg-red-500/10 text-red-400',
  };

  const tips = [
    { n: '1', title: 'Start Small',       desc: 'Begin with investments you can afford to lose while you learn the basics.' },
    { n: '2', title: 'Diversify',         desc: "Don't put all your eggs in one basket — spread across sectors and assets." },
    { n: '3', title: 'Think Long-term',   desc: 'Investing is a marathon. Time in the market beats timing the market.' },
    { n: '4', title: 'Keep Learning',     desc: 'Markets evolve constantly. Stay informed and keep updating your knowledge.' },
  ];

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Investment Learning</h1>
          <p className="text-gray-400">Master the fundamentals of smart investing</p>
        </div>

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-emerald-500/10 via-[#1a1f2e] to-blue-500/10 rounded-2xl p-8 border border-emerald-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full -translate-y-16 translate-x-16" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-16 h-16 bg-emerald-500/15 rounded-2xl flex items-center justify-center flex-shrink-0 border border-emerald-500/20">
              <BookOpen className="w-8 h-8 text-emerald-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome to Investment Learning</h2>
              <p className="text-gray-400 max-w-2xl text-sm leading-relaxed">
                Start your journey to becoming a smart investor. Learn stock market fundamentals, risk management, 
                and portfolio strategies. Apply what you learn with paper trading — completely risk-free.
              </p>
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="text-gray-500 text-xs mb-1">6 Modules</p>
              <p className="text-emerald-400 font-bold">~2 hrs total</p>
            </div>
          </div>
        </div>

        {/* Learning Cards */}
        <div>
          <h2 className="text-lg font-bold text-white mb-5">Learning Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {learningCards.map((card) => {
              const c = colorClasses[card.color];
              return (
                <div
                  key={card.id}
                  className={`bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800/60 ${c.border} transition-all group cursor-default flex flex-col`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${c.icon} border rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform`}>
                      {card.icon}
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${levelColor[card.level]}`}>
                        {card.level}
                      </span>
                      <span className="text-gray-600 text-xs">{card.duration}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{card.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 flex-1 leading-relaxed">{card.description}</p>

                  <div className="space-y-1.5 mb-5">
                    {card.topics.map((topic, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                        <CheckCircle className="w-3.5 h-3.5 text-gray-700 flex-shrink-0" />
                        {topic}
                      </div>
                    ))}
                  </div>

                  <button className={`flex items-center gap-2 text-sm font-semibold transition-colors ${c.badge.split(' ')[1]} hover:opacity-80 mt-auto`}>
                    <Play className="w-3.5 h-3.5" />
                    Start Module
                    <ArrowRight className="w-3.5 h-3.5 ml-auto group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800/60">
          <h2 className="text-lg font-bold text-white mb-5">Beginner Tips</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tips.map((tip) => (
              <div key={tip.n} className="flex items-start gap-4 p-4 bg-gray-900/40 rounded-xl border border-gray-800/40">
                <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-emerald-500/20">
                  <span className="text-emerald-400 font-bold text-sm">{tip.n}</span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm mb-1">{tip.title}</p>
                  <p className="text-gray-500 text-xs leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA to paper trading */}
        <div className="bg-gradient-to-r from-blue-500/10 via-[#1a1f2e] to-purple-500/10 rounded-2xl p-8 border border-blue-500/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Ready to Practice?</h2>
              <p className="text-gray-400 text-sm">Apply what you've learned with $20,000 virtual money. No risk, real experience.</p>
            </div>
            <button
              onClick={() => router.push('/invest')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 whitespace-nowrap flex-shrink-0"
            >
              <TrendingUp className="w-4 h-4" />
              Start Paper Trading
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
