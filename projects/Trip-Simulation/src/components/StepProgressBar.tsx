import React from 'react';
import { useTripContext } from '../context/TripContext';
import { Check, UserCheck, Layers, CalendarCheck, ShieldAlert, BarChart3 } from 'lucide-react';

export const StepProgressBar: React.FC = () => {
  const { activeStep, setActiveStep } = useTripContext();

  const steps = [
    { number: 1, title: 'Profil Perjalanan', sub: 'Destinasi & Gaya', icon: UserCheck },
    { number: 2, title: 'Biaya Inti', sub: 'Transport, Hotel, Dokumen', icon: Layers },
    { number: 3, title: 'Biaya Harian', sub: 'Konsumsi, Wisata, Lokal', icon: CalendarCheck },
    { number: 4, title: 'Hal Tak Terduga', sub: 'Darurat, Skenario & Pulang', icon: ShieldAlert },
    { number: 5, title: 'Dashboard Hasil', sub: 'Analisis & Rapor Anggaran', icon: BarChart3 },
  ];

  return (
    <div className="w-full bg-white border-b border-slate-200 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="grid grid-cols-5 gap-1 sm:gap-2">
          {steps.map((step) => {
            const isCompleted = step.number < activeStep;
            const isCurrent = step.number === activeStep;
            const IconComponent = step.icon;

            return (
              <button
                key={step.number}
                onClick={() => setActiveStep(step.number)}
                className={`flex flex-col items-center sm:items-start p-2 sm:p-3 rounded-xl text-left transition-all relative ${
                  isCurrent
                    ? 'bg-blue-50/80 ring-2 ring-blue-600/30'
                    : isCompleted
                    ? 'hover:bg-slate-50 text-slate-700'
                    : 'opacity-70 hover:opacity-100 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-2 w-full">
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
                      isCurrent
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : step.number}
                  </div>
                  <div className="hidden md:block min-w-0 flex-1">
                    <p
                      className={`text-xs font-bold truncate ${
                        isCurrent ? 'text-blue-900' : 'text-slate-800'
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">{step.sub}</p>
                  </div>
                </div>

                {/* Active bottom indicator bar */}
                <div
                  className={`mt-2 h-1 w-full rounded-full transition-all ${
                    isCurrent
                      ? 'bg-blue-600'
                      : isCompleted
                      ? 'bg-emerald-500'
                      : 'bg-slate-200'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
