'use client';

import { AlertTriangle, X, Shield } from 'lucide-react';

interface FraudWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  reason: string;
  amount: number;
  receiverName: string;
}

export default function FraudWarningModal({
  isOpen,
  onClose,
  onConfirm,
  reason,
  amount,
  receiverName,
}: FraudWarningModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1f2e] rounded-2xl max-w-md w-full shadow-2xl border border-amber-500/30">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-white">Security Warning</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Warning Content */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-amber-400 font-semibold mb-2">Suspicious Transaction Detected</p>
                <p className="text-gray-300 text-sm">{reason}</p>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="bg-gray-900/30 rounded-xl p-4 mb-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Amount</span>
              <span className="text-white font-semibold">${amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Recipient</span>
              <span className="text-white font-semibold">{receiverName}</span>
            </div>
          </div>

          {/* Warning Message */}
          <p className="text-gray-400 text-sm mb-6">
            This transaction appears unusual based on your spending patterns. Please verify this is legitimate before proceeding.
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-800/50 hover:bg-gray-700/50 text-white py-3 px-4 rounded-xl font-semibold transition-all border border-gray-700/50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-3 px-4 rounded-xl font-semibold transition-all"
            >
              Confirm Transfer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
