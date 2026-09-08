import React from 'react';
import { useTripContext } from '../context/TripContext';
import { formatCurrency } from '../utils/currency';
import { ChevronRight, ChevronLeft, ArrowRight, ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

export const FloatingSummaryBar: React.FC = () => {
  const { activeStep, setActiveStep, calculations, state } = useTripContext();
  const currency = state.profile.currency;

  const handleNext = () => {
    if (activeStep < 5) {
      setActiveStep(activeStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Safety indicator icon
  const getSafetyIcon = () => {
    switch (calculations.safetyScore.status) {
      case 'safe':
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case 'vulnerable':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'risky':
        return <ShieldAlert className="w-4 h-4 text-rose-600" />;
    }
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-xl py-3 px-4 sm:px-6 lg:px-8 print:hidden">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* Left: Running Total Breakdown */}
        <div className="flex items-center justify-between w-full sm:w-auto space-x-4 sm:space-x-6">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Running Total Estimasi
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {formatCurrency(calculations.grandTotalWithScenarios, currency)}
              </span>
              {calculations.refundableDepositTotal > 0 && (
                <span className="text-xs text-teal-700 bg-teal-50 border border-teal-200 px-1.5 py-0.5 rounded font-medium">
                  + {formatCurrency(calculations.refundableDepositTotal, currency)} deposit
                </span>
              )}
            </div>
          </div>

          <div className="border-l border-slate-200 pl-4 hidden md:block">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Estimasi / Orang
            </span>
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
              <span>Dewasa: {formatCurrency(calculations.costPerAdult, currency)}</span>
              {state.profile.children > 0 && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-blue-700">
                    Anak (50% F&B): {formatCurrency(calculations.costPerChild, currency)}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Quick Safety Badge */}
          <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full border text-xs font-medium bg-slate-50 border-slate-200">
            {getSafetyIcon()}
            <span className="text-slate-700 font-semibold">
              Dana Darurat: {calculations.safetyScore.contingencyRatio}%
            </span>
          </div>
        </div>

        {/* Right: Step Navigation */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          {activeStep > 1 && (
            <button
              onClick={handlePrev}
              className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors inline-flex items-center space-x-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>
          )}

          {activeStep < 5 ? (
            <button
              onClick={handleNext}
              className="flex-1 sm:flex-none px-5 py-2 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-500/20 inline-flex items-center justify-center space-x-1.5"
            >
              <span>{activeStep === 4 ? 'Lihat Dashboard Hasil' : 'Lanjut Tahap Berikutnya'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                setActiveStep(1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors inline-flex items-center space-x-1.5"
            >
              <span>Edit Parameter Awal</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
