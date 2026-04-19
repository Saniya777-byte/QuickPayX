'use client';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'violet' | 'emerald' | 'blue' | 'rose';
}

const bgClasses = {
  violet: 'bg-gray-800/50',
  emerald: 'bg-emerald-500/10',
  blue: 'bg-gray-800/50',
  rose: 'bg-red-500/10',
};

const textClasses = {
  violet: 'text-gray-400',
  emerald: 'text-emerald-500',
  blue: 'text-gray-400',
  rose: 'text-red-400',
};

export default function AnalyticsCard({ title, value, icon, color }: AnalyticsCardProps) {
  return (
    <div className="bg-[#1a1f2e] rounded-2xl p-6 shadow-lg border border-gray-800/50 hover:border-gray-700/50 transition-all">
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
