import React from 'react';
import { Plane, CheckCircle2, X } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import { CurrencyCode } from '../types';

export interface ToastData {
  airline: string;
  price: number;
  tripType: 'roundTrip' | 'oneWay';
  departureDate?: string;
  returnDate?: string;
  currency: CurrencyCode;
}

interface ToastNotificationProps {
  toast: ToastData | null;
  onClose: () => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ toast, onClose }) => {
  if (!toast) return null;

  return (
    <div className="fixed top-5 right-5 z-[9999] animate-bounce-in max-w-sm w-full bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-slate-700/80 flex items-start space-x-3.5">
      <div className="w-10 h-10 rounded-xl bg-blue-600/30 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
        <Plane className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            Data Google Flights Diterima!
          </h4>
        </div>

        <p className="text-sm font-bold text-white mt-1 truncate">
          {toast.airline}
        </p>

        <div className="flex items-center space-x-2 mt-1">
          <span className="text-xs font-extrabold text-blue-400">
            {formatCurrency(toast.price, toast.currency)}
          </span>
          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
            {toast.tripType === 'roundTrip' ? 'Pulang-Pergi' : 'Satu Arah'}
          </span>
        </div>

        {toast.departureDate && (
          <p className="text-[11px] text-slate-400 mt-1">
            Jadwal: {toast.departureDate} {toast.returnDate ? `➔ ${toast.returnDate}` : ''}
          </p>
        )}
      </div>

      <button
        onClick={onClose}
        className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

