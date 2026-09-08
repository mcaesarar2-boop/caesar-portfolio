import React, { useState } from 'react';
import { TripProvider, useTripContext } from './context/TripContext';
import { Header } from './components/Header';
import { StepProgressBar } from './components/StepProgressBar';
import { FloatingSummaryBar } from './components/FloatingSummaryBar';
import { PresetsModal } from './components/PresetsModal';
import { SearchPriceModal } from './components/SearchPriceModal';
import { Footer } from './components/Footer';

import { Step1Profile } from './components/steps/Step1Profile';
import { Step2FixedCosts } from './components/steps/Step2FixedCosts';
import { Step3VariableCosts } from './components/steps/Step3VariableCosts';
import { Step4Contingency } from './components/steps/Step4Contingency';
import { Step5Dashboard } from './components/steps/Step5Dashboard';

const WizardContent: React.FC = () => {
  const { activeStep } = useTripContext();
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased selection:bg-blue-600 selection:text-white pb-0">
      {/* Header Bar */}
      <Header
        onOpenPresets={() => setIsPresetsOpen(true)}
        onOpenSearch={() => setIsSearchModalOpen(true)}
      />

      {/* 5-Step Progress Bar Wizard */}
      <StepProgressBar />

      {/* Main Wizard Step Content Area */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 flex-1">
        {activeStep === 1 && <Step1Profile />}
        {activeStep === 2 && <Step2FixedCosts />}
        {activeStep === 3 && <Step3VariableCosts />}
        {activeStep === 4 && <Step4Contingency />}
        {activeStep === 5 && <Step5Dashboard />}
      </main>

      {/* Footer with Portfolio Back Link & Copyright */}
      <Footer />

      {/* Running Floating Total Bar at Bottom */}
      <FloatingSummaryBar />

      {/* Presets / Templates Modal */}
      <PresetsModal isOpen={isPresetsOpen} onClose={() => setIsPresetsOpen(false)} />

      {/* Search Price & Benchmark Modal */}
      <SearchPriceModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <TripProvider>
      <WizardContent />
    </TripProvider>
  );
}
