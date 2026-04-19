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
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-[#1a1f2e] border-emerald-500/30 text-emerald-400' : 'bg-[#1a1f2e] border-red-500/30 text-red-400';
  const icon = type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />;

  return (
    <div className={`fixed top-4 right-4 ${bgColor} border px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 z-50`}>
      {icon}
      <p className="font-medium">{message}</p>
      <button
        onClick={onClose}
        className="ml-4 hover:opacity-70 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
