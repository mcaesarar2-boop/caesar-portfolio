import React from 'react';
import { TRIP_PRESETS } from '../utils/presets';
import { useTripContext } from '../context/TripContext';
import { Sparkles, X, MapPin, Calendar, Check, Compass } from 'lucide-react';

interface PresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PresetsModal: React.FC<PresetsModalProps> = ({ isOpen, onClose }) => {
  const { loadPreset } = useTripContext();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Pilih Template Rencana Perjalanan</h2>
              <p className="text-xs text-slate-500">Mulai cepat dengan konfigurasi biaya yang realistis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-3.5">
          {TRIP_PRESETS.map((preset) => (
            <div
              key={preset.id}
              className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              onClick={() => {
                loadPreset(preset.id);
                onClose();
              }}
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-blue-600 transition-colors">
                    {preset.name}
                  </h3>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      preset.style === 'backpacker'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : preset.style === 'luxury'
                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}
                  >
                    {preset.style}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{preset.tagline}</p>
                <div className="flex items-center space-x-4 text-xs text-slate-500 pt-1">
                  <span className="inline-flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{preset.destination}</span>
                  </span>
                  <span className="inline-flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{preset.days} Hari {preset.nights} Malam</span>
                  </span>
                </div>
              </div>

              <button className="shrink-0 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white group-hover:bg-blue-700 transition-colors shadow-sm">
                Gunakan Template
              </button>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
