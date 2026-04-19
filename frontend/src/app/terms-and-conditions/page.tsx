'use client';

import { useRouter } from 'next/navigation';
import { FileText, AlertTriangle, Ban, Scale, ArrowLeft } from 'lucide-react';

export default function TermsAndConditions() {
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
              <FileText className="w-7 h-7 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Terms & Conditions</h1>
              <p className="text-gray-400 text-sm">Last Updated: January 2024</p>
            </div>
          </div>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
              <p className="leading-relaxed">
                Welcome to QuickPayX. By accessing or using our digital wallet services, you agree to be bound by these Terms & Conditions. If you disagree with any part of these terms, you may not access our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-emerald-500" />
                Acceptance of Terms
              </h2>
              <p className="leading-relaxed">
                By creating an account and using QuickPayX, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions and our Privacy Policy. You also represent that you are of legal age to form a binding contract with QuickPayX.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Account Registration</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You must provide accurate, current, and complete information during registration</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                <li>You must notify us immediately of any unauthorized use of your account</li>
                <li>You are responsible for all activities that occur under your account</li>
                <li>You may not create an account on behalf of another person without their consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Ban className="w-6 h-6 text-emerald-500" />
                Prohibited Activities
              </h2>
              <p className="leading-relaxed mb-4">
                You agree not to engage in any of the following prohibited activities:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Using QuickPayX for illegal purposes or fraudulent activities</li>
                <li>Transferring funds to or from prohibited jurisdictions</li>
                <li>Money laundering or financing terrorism</li>
                <li>Impersonating any person or entity</li>
                <li>Interfering with or disrupting our services</li>
                <li>Attempting to gain unauthorized access to our systems</li>
                <li>Using automated tools to access our services excessively</li>
                <li>Violating any applicable laws or regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Transactions</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Transactions are final and cannot be reversed once processed</li>
                <li>You are responsible for ensuring the accuracy of recipient information</li>
                <li>We reserve the right to limit, suspend, or terminate transactions</li>
                <li>Transaction fees may apply and will be disclosed before processing</li>
                <li>We are not responsible for losses due to incorrect recipient information</li>
                <li>Refunds are only available in specific circumstances at our discretion</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Scale className="w-6 h-6 text-emerald-500" />
                Liability Limitations
              </h2>
              <p className="leading-relaxed mb-4">
                To the maximum extent permitted by law:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>QuickPayX shall not be liable for indirect, incidental, or consequential damages</li>
                <li>Our total liability is limited to the amount of fees paid by you in the past 12 months</li>
                <li>We are not responsible for third-party services integrated with our platform</li>
                <li>We do not guarantee uninterrupted or error-free service</li>
                <li>We are not liable for losses due to unauthorized account access if you failed to secure your credentials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Privacy</h2>
              <p className="leading-relaxed">
                Your use of QuickPayX is also governed by our Privacy Policy, which explains how we collect, use, and protect your personal information. By using our services, you consent to our data practices as described in the Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Intellectual Property</h2>
              <p className="leading-relaxed">
                All content, features, and functionality of QuickPayX, including but not limited to text, graphics, logos, and software, are the exclusive property of QuickPayX and are protected by international copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Account Termination</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You may terminate your account at any time by contacting us or using the account deletion feature</li>
                <li>We reserve the right to suspend or terminate your account for violation of these terms</li>
                <li>Upon termination, your right to use the service will immediately cease</li>
                <li>We may retain certain data as required by law or for legitimate business purposes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Dispute Resolution</h2>
              <p className="leading-relaxed mb-4">
                Any disputes arising from these terms or your use of QuickPayX shall be resolved as follows:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>We encourage you to contact us first to resolve any issues informally</li>
                <li>If informal resolution fails, disputes shall be resolved through binding arbitration</li>
                <li>Arbitration shall be conducted in San Francisco, California</li>
                <li>These terms shall be governed by the laws of the State of California</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Modification of Terms</h2>
              <p className="leading-relaxed">
                We reserve the right to modify these Terms & Conditions at any time. We will notify users of significant changes via email or through our platform. Continued use of our services after such modifications constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Indemnification</h2>
              <p className="leading-relaxed">
                You agree to indemnify and hold QuickPayX, its officers, directors, employees, and agents harmless from any claims, damages, or expenses arising from your use of our services or violation of these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Severability</h2>
              <p className="leading-relaxed">
                If any provision of these Terms & Conditions is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect. The invalid provision shall be replaced with a valid provision that most closely reflects the original intent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Governing Law</h2>
              <p className="leading-relaxed">
                These Terms & Conditions shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
              <p className="leading-relaxed mb-4">
                If you have any questions about these Terms & Conditions, please contact us:
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
