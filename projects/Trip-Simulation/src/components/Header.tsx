import React from 'react';
import { useTripContext } from '../context/TripContext';
import { CURRENCIES } from '../utils/currency';
import { CurrencyCode } from '../types';
import { Compass, RotateCcw, BookmarkCheck, Sparkles, Search, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  onOpenPresets: () => void;
  onOpenSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenPresets, onOpenSearch }) => {
  const { state, setCurrency, resetAll } = useTripContext();
  const isDist = typeof window !== 'undefined' && window.location.pathname.includes('/dist');
  const portfolioUrl = isDist ? '../../../index.html' : '../../index.html';

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value as CurrencyCode);
  };

  const handleReset = () => {
    if (window.confirm('Reset seluruh kalkulasi dan formulir ke pengaturan awal?')) {
      resetAll();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Back Button, Logo & Title */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <a
              href={portfolioUrl}
              className="group inline-flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white border border-slate-200 hover:border-blue-600 transition-all shadow-2xs flex-shrink-0"
              title="Kembali ke Portofolio Utama"
              aria-label="Kembali ke Portofolio Utama"
            >
              <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">Portofolio</span>
            </a>
            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 shrink-0">
              <Compass className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <h1 className="text-sm sm:text-lg lg:text-xl font-bold text-slate-900 tracking-tight">
                  Simulasi Perjalanan
                </h1>
                <span className="hidden lg:inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  Ekstensif
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden md:block">
                Perencanaan finansial menyeluruh: Persiapan, Harian, hingga Skenario Darurat
              </p>
            </div>
          </div>

          {/* Right controls: Currency & Presets & Reset */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Currency selector */}
            <div className="flex items-center space-x-1.5 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700">
              <span className="text-slate-400 font-semibold">Mata Uang:</span>
              <select
                aria-label="Pilih Mata Uang"
                value={state.profile.currency}
                onChange={handleCurrencyChange}
                className="bg-transparent font-semibold text-slate-900 focus:outline-none cursor-pointer"
              >
                {Object.values(CURRENCIES).map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.code} ({curr.symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Search Engine price helper button */}
            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                className="inline-flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors shadow-2xs"
                title="Cek Harga Tiket & Hotel di Search Engine"
              >
                <Search className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">Cek Harga</span>
              </button>
            )}

            {/* Presets Button */}
            <button
              onClick={onOpenPresets}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors"
              title="Pilih Template Rencana Perjalanan"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden md:inline">Contoh Template</span>
              <span className="md:hidden">Preset</span>
            </button>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-medium rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 inline-flex items-center space-x-1"
              title="Reset ke nilai awal"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Reset</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
