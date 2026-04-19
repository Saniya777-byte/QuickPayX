'use client';

import { useRouter } from 'next/navigation';
import { 
  Users, 
  Target, 
  Eye, 
  Heart, 
  Award, 
  Globe,
  ArrowLeft,
  Zap,
  Shield
} from 'lucide-react';

export default function About() {
  const router = useRouter();

  const values = [
    {
      icon: Shield,
      title: 'Security First',
      description: 'We prioritize the security of your funds and personal information above everything else.'
    },
    {
      icon: Zap,
      title: 'Speed & Efficiency',
      description: 'Instant transfers and real-time processing to keep your finances moving.'
    },
    {
      icon: Users,
      title: 'User-Centric',
      description: 'Every feature is designed with the user experience in mind.'
    },
    {
      icon: Heart,
      title: 'Trust & Transparency',
      description: 'Clear policies, honest communication, and reliable service.'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '$5M+', label: 'Transactions Processed' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Support' }
  ];

  return (
    <div className="min-h-screen bg-[#0a0e27]">
      {/* Header */}
      <header className="bg-[#0a0e27] border-b border-gray-800/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </button>
            <h1 className="text-xl font-bold text-white">QuickPayX</h1>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 lg:py-32">
          <div className="relative max-w-4xl mx-auto px-6 sm:px-8 lg:px-8 text-center">
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              About <span className="text-emerald-500">QuickPayX</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              We're on a mission to make digital payments simple, secure, and accessible for everyone.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 relative bg-[#0f1429]">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 lg:py-32">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-violet-500/20 rounded-2xl flex items-center justify-center">
                  <Globe className="w-7 h-7 text-violet-400" />
                </div>
                <h2 className="text-3xl font-bold text-white">Our Story</h2>
              </div>
              <div className="space-y-6 text-gray-300">
                <p className="leading-relaxed">
                  QuickPayX was founded with a simple vision: to make digital payments as easy as sending a message. We believe that managing your finances should be intuitive, secure, and accessible to everyone, regardless of technical expertise.
                </p>
                <p className="leading-relaxed">
                  Born from the frustration with complex banking apps and expensive transfer fees, our team set out to build a platform that puts the user first. We combined cutting-edge technology with a clean, intuitive design to create a digital wallet that anyone can use.
                </p>
                <p className="leading-relaxed">
                  Today, QuickPayX serves thousands of users who trust us with their daily transactions. From freelancers getting paid to families sending money to loved ones, we're proud to be the financial companion for people from all walks of life.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-24 lg:py-32">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-8">
            <div className="bg-[#1a1f2e] rounded-2xl p-8 md:p-12 shadow-lg border border-gray-800/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                  <Target className="w-7 h-7 text-emerald-500" />
                </div>
                <h2 className="text-3xl font-bold text-white">Our Mission</h2>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">
                To democratize digital payments by providing a secure, user-friendly platform that empowers individuals and businesses to manage their finances with confidence. We believe that financial tools should be accessible to everyone, regardless of their technical expertise or financial background.
              </p>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="py-24 lg:py-32 relative bg-[#0f1429]">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-8">
            <div className="bg-[#1a1f2e] rounded-2xl p-8 md:p-12 shadow-lg border border-gray-800/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                  <Eye className="w-7 h-7 text-emerald-500" />
                </div>
                <h2 className="text-3xl font-bold text-white">Our Vision</h2>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">
                To become the world's most trusted digital wallet platform, setting the standard for security, simplicity, and customer satisfaction. We envision a future where digital payments are seamless, instant, and accessible to everyone, everywhere.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
            <h2 className="text-4xl font-bold text-white text-center mb-16">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <div key={index} className="bg-[#1a1f2e] rounded-2xl p-8 border border-gray-800/50 hover:border-gray-700/50 transition-all group">
                  <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <value.icon className="w-7 h-7 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                  <p className="text-gray-400">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Commitment */}
        <section className="py-24 lg:py-32">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-8">
            <div className="bg-[#1a1f2e] rounded-2xl p-12 text-center shadow-lg border border-gray-800/50">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Our Commitment to You
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                We're committed to providing you with a secure, reliable, and user-friendly digital wallet experience. Your trust is our most valuable asset, and we work every day to earn and keep it.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
