'use client';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'violet' | 'emerald' | 'blue' | 'rose';
}

const colorClasses = {
  violet: 'from-violet-500 to-fuchsia-500',
  emerald: 'from-emerald-500 to-teal-500',
  blue: 'from-blue-500 to-cyan-500',
  rose: 'from-rose-500 to-pink-500',
};

const bgClasses = {
  violet: 'bg-violet-500/20',
  emerald: 'bg-emerald-500/20',
  blue: 'bg-blue-500/20',
  rose: 'bg-rose-500/20',
};

const textClasses = {
  violet: 'text-violet-400',
  emerald: 'text-emerald-400',
  blue: 'text-blue-400',
  rose: 'text-rose-400',
};

export default function AnalyticsCard({ title, value, icon, color }: AnalyticsCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 hover:border-white/30 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${bgClasses[color]} rounded-xl flex items-center justify-center`}>
          <div className={textClasses[color]}>
            {icon}
          </div>
        </div>
      </div>
      <p className="text-gray-400 text-sm mb-1">{title}</p>
      <p className="text-white text-2xl font-bold">{value}</p>
    </div>
  );
}
