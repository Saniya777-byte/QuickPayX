'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { Wallet, User as UserType, SearchResult } from '../../types';
import AppLayout from '../../components/AppLayout';
import UserSearch from '../../components/UserSearch';
import RecentUsers from '../../components/RecentUsers';
import Toast from '../../components/Toast';
import FraudWarningModal from '../../components/FraudWarningModal';
import { Send, AlertCircle, User as UserIcon, CreditCard, X, ArrowRight } from 'lucide-react';

export default function TransferPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState<SearchResult[]>([]);

  const [receiverId, setReceiverId] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [description, setDescription] = useState('');
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferError, setTransferError] = useState('');
  // Fix: only show validation after user has touched both fields
  const [amountTouched, setAmountTouched] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [fraudWarning, setFraudWarning] = useState<{
    isOpen: boolean; reason: string; amount: number; receiverName: string;
  }>({ isOpen: false, reason: '', amount: 0, receiverName: '' });

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/'); return; }
    loadData();
  }, [user, authLoading, router]);

  const loadData = async () => {
    try {
      const [walletData, usersData] = await Promise.all([
        apiService.getWallet(),
        apiService.getRecentUsers()
      ]);
      setWallet(walletData);
      setRecentUsers(usersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Computed validation — only used when amountTouched is true
  const getAmountError = (): string => {
    if (!transferAmount) return '';
    const amount = parseFloat(transferAmount);
    if (isNaN(amount) || amount <= 0) return 'Amount must be greater than $0';
    if (wallet && amount > wallet.balance) return `Exceeds wallet balance ($${wallet.balance.toFixed(2)})`;
    return '';
  };

  const amountError = amountTouched ? getAmountError() : '';
  const canSubmit = receiverId && transferAmount && !getAmountError() && !transferLoading;

  const handleUserSelect = (userId: string, userName: string) => {
    setReceiverId(userId);
    setReceiverName(userName);
    setTransferError('');
  };

  const clearRecipient = () => {
    setReceiverId('');
    setReceiverName('');
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setTransferError('');
    setAmountTouched(true);
    const err = getAmountError();
    if (!receiverId) { setTransferError('Please select a recipient first'); return; }
    if (err) return;

    setTransferLoading(true);
    try {
      const amount = parseFloat(transferAmount);
      await apiService.transfer({ receiverId, amount });
      setTransferAmount('');
      setReceiverId('');
      setReceiverName('');
      setDescription('');
      setAmountTouched(false);
      setToast({ message: `✅ Successfully sent $${amount.toFixed(2)} to ${receiverName}`, type: 'success' });
      loadData();
    } catch (err: any) {
      if (err.message && err.message.includes('suspicious')) {
        setFraudWarning({
          isOpen: true, reason: err.message,
          amount: parseFloat(transferAmount), receiverName
        });
      } else {
        const msg = err.message || 'Transfer failed';
        setTransferError(msg);
        setToast({ message: msg, type: 'error' });
      }
    } finally {
      setTransferLoading(false);
    }
  };

  const handleFraudConfirm = async () => {
    setFraudWarning({ isOpen: false, reason: '', amount: 0, receiverName: '' });
    setTransferLoading(true);
    try {
      await apiService.transfer({ receiverId, amount: parseFloat(transferAmount), skipFraudCheck: true });
      const amount = parseFloat(transferAmount);
      setTransferAmount('');
      setReceiverId('');
      setReceiverName('');
      setDescription('');
      setAmountTouched(false);
      setToast({ message: `✅ Transfer of $${amount.toFixed(2)} completed`, type: 'success' });
      loadData();
    } catch (err: any) {
      const msg = err.message || 'Transfer failed';
      setTransferError(msg);
      setToast({ message: msg, type: 'error' });
    } finally {
      setTransferLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </AppLayout>
    );
  }

  const parsedAmount = parseFloat(transferAmount);
  const validAmount = !isNaN(parsedAmount) && parsedAmount > 0;

  return (
    <AppLayout>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {fraudWarning.isOpen && (
        <FraudWarningModal
          isOpen={fraudWarning.isOpen}
          reason={fraudWarning.reason}
          amount={fraudWarning.amount}
          receiverName={fraudWarning.receiverName}
          onConfirm={handleFraudConfirm}
          onClose={() => setFraudWarning({ isOpen: false, reason: '', amount: 0, receiverName: '' })}
        />
      )}

      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Transfer Money</h1>
          <p className="text-gray-400">Send money to other users instantly</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Form */}
          <div className="lg:col-span-2 space-y-5">
            {/* Wallet Balance */}
            <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-2xl p-5 border border-emerald-500/20 flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Available Wallet Balance</p>
                <p className="text-2xl font-bold text-white">${wallet?.balance?.toFixed(2) || '0.00'}</p>
              </div>
            </div>

            {/* Transfer Form */}
            <div className="bg-[#1a1f2e] rounded-2xl p-7 border border-gray-800/60">
              <div className="flex items-center gap-3 mb-7">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <Send className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Send Money</h2>
                  <p className="text-gray-500 text-xs">Instant transfer to any user</p>
                </div>
              </div>

              {transferError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl flex items-center gap-2 mb-5 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {transferError}
                </div>
              )}

              <form onSubmit={handleTransfer} className="space-y-5">
                {/* Recipient Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Recipient <span className="text-red-400">*</span>
                  </label>
                  {receiverName ? (
                    <div className="flex items-center justify-between p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/20">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 font-bold text-sm">
                          {receiverName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">{receiverName}</p>
                          <p className="text-gray-500 text-xs">Recipient selected ✓</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={clearRecipient}
                        className="text-gray-500 hover:text-white p-1 rounded-lg hover:bg-gray-800/50 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <UserSearch onUserSelect={handleUserSelect} selectedUserId={receiverId} />
                  )}
                </div>

                {/* Amount */}
                <div>
                  <label htmlFor="transferAmount" className="block text-sm font-medium text-gray-400 mb-2">
                    Amount <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
                    <input
                      type="number"
                      id="transferAmount"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      onBlur={() => setAmountTouched(true)}
                      className={`w-full pl-9 pr-4 py-3 bg-gray-900/50 border rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm ${
                        amountError ? 'border-red-500/50' : 'border-gray-700/60'
                      }`}
                      placeholder="0.00"
                      step="0.01"
                      min="0.01"
                    />
                  </div>
                  {amountError && (
                    <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {amountError}
                    </p>
                  )}
                </div>

                {/* Summary preview */}
                {receiverName && validAmount && !amountError && (
                  <div className="bg-gray-900/40 rounded-xl p-4 border border-gray-800/40">
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3">Transfer Summary</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">To</span>
                        <span className="text-white font-medium">{receiverName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Amount</span>
                        <span className="text-white font-medium">${parsedAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-800/40 pt-2">
                        <span className="text-gray-500">Remaining Balance</span>
                        <span className="text-emerald-400 font-semibold">
                          ${((wallet?.balance ?? 0) - parsedAmount).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3.5 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/15 text-sm"
                >
                  {transferLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send ${validAmount ? parsedAmount.toFixed(2) : '0.00'}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right: Recent Contacts */}
          <div>
            <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800/60 sticky top-24">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-gray-400" />
                Recent Contacts
              </h3>
              <RecentUsers onUserSelect={handleUserSelect} />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
