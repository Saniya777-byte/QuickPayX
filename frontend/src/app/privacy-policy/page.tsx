'use client';

import { useRouter } from 'next/navigation';
import { Shield, Lock, Eye, Database, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  const router = useRouter();

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

      <main className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-8 py-16">
        <div className="bg-[#1a1f2e] rounded-2xl p-8 md:p-12 shadow-lg border border-gray-800/50">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
              <p className="text-gray-400 text-sm">Last Updated: January 2024</p>
            </div>
          </div>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
              <p className="leading-relaxed">
                QuickPayX ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our digital wallet services. Please read this policy carefully.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Database className="w-6 h-6 text-emerald-500" />
                Information We Collect
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Personal Information</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Name and email address</li>
                    <li>Phone number (optional)</li>
                    <li>Profile information</li>
                    <li>Authentication credentials</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Financial Information</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Wallet balance</li>
                    <li>Transaction history</li>
                    <li>Payment methods</li>
                    <li>Transfer records</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Technical Information</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>IP address</li>
                    <li>Device information</li>
                    <li>Browser type</li>
                    <li>Usage data</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Eye className="w-6 h-6 text-emerald-500" />
                How We Use Your Information
              </h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>To provide and maintain our digital wallet services</li>
                <li>To process transactions and send money</li>
                <li>To verify your identity and secure your account</li>
                <li>To communicate with you about your account</li>
                <li>To improve our services and develop new features</li>
                <li>To comply with legal obligations</li>
                <li>To detect and prevent fraud</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Lock className="w-6 h-6 text-emerald-500" />
                Data Security
              </h2>
              <p className="leading-relaxed mb-4">
                We implement industry-standard security measures to protect your information:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>AES-256 encryption for data in transit and at rest</li>
                <li>JWT-based authentication with token refresh</li>
                <li>Secure socket layer (SSL) technology</li>
                <li>Regular security audits and penetration testing</li>
                <li>Two-factor authentication (optional)</li>
                <li>Secure password hashing using bcrypt</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Information Sharing</h2>
              <p className="leading-relaxed mb-4">
                We do not sell your personal information. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>With your explicit consent</li>
                <li>With service providers who assist our operations</li>
                <li>To comply with legal requirements</li>
                <li>To protect our rights and prevent fraud</li>
                <li>In connection with a business transfer</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Your Rights</h2>
              <p className="leading-relaxed mb-4">
                You have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access to your personal data</li>
                <li>Correction of inaccurate data</li>
                <li>Deletion of your account and data</li>
                <li>Opt-out of marketing communications</li>
                <li>Data portability</li>
                <li>Right to file a complaint</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Cookies and Tracking</h2>
              <p className="leading-relaxed">
                We use cookies and similar technologies to improve your experience, analyze usage, and personalize content. You can manage cookie preferences through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Third-Party Services</h2>
              <p className="leading-relaxed">
                Our service may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to read their privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Children's Privacy</h2>
              <p className="leading-relaxed">
                Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children. If we become aware of such collection, we will take immediate steps to delete it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Changes to This Policy</h2>
              <p className="leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
              <p className="leading-relaxed mb-4">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-center gap-2">
                  <span className="text-violet-400">Email:</span>
                  <span>support@quickpayx.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-violet-400">Phone:</span>
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-violet-400">Address:</span>
                  <span>San Francisco, CA</span>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
