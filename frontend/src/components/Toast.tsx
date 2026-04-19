'use client';

import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === 'success';

  return (
    <div
      className={`fixed top-5 right-5 z-[9999] flex items-start gap-3 px-4 py-3.5 rounded-xl border shadow-2xl backdrop-blur-sm max-w-sm animate-fadeInUp ${
        isSuccess
          ? 'bg-[#1a1f2e]/95 border-emerald-500/40'
          : 'bg-[#1a1f2e]/95 border-red-500/40'
      }`}
    >
      <div className={`flex-shrink-0 mt-0.5 ${isSuccess ? 'text-emerald-400' : 'text-red-400'}`}>
        {isSuccess
          ? <CheckCircle className="w-5 h-5" />
          : <XCircle className="w-5 h-5" />
        }
      </div>
      <p className={`text-sm font-medium flex-1 ${isSuccess ? 'text-emerald-300' : 'text-red-300'}`}>
        {message}
      </p>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-gray-500 hover:text-white transition-colors mt-0.5"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
