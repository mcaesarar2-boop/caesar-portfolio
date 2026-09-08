import React from 'react';
import { Compass, ArrowLeft, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const isDist = typeof window !== 'undefined' && window.location.pathname.includes('/dist');
  const portfolioUrl = isDist ? '../../../index.html' : '../../index.html';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-slate-900 text-slate-300 border-t border-slate-800 mt-16 pt-12 pb-36 sm:pb-32 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-8 border-b border-slate-800">
          {/* Brand & App Info */}
          <div className="max-w-md">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Simulasi Perjalanan
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-900/60 text-blue-300 border border-blue-700/50">
                Project 08
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Aplikasi simulasi dan kalkulator biaya perjalanan ekstensif — perencanaan biaya tetap, estimasi variabel harian, mitigasi skenario darurat, dan dashboard finansial interaktif.
            </p>
          </div>

          {/* Navigation Links & Back to Portfolio */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs">
            <a
              href={portfolioUrl}
              className="group inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-sm"
              title="Kembali ke Portofolio Utama"
            >
              <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-0.5 transition-transform" />
              <span>Kembali ke Portofolio</span>
            </a>
            <a
              href={`${portfolioUrl}#work`}
              className="text-slate-400 hover:text-white transition-colors"
            >
              Selected Work
            </a>
            <a
              href={`${portfolioUrl}#about`}
              className="text-slate-400 hover:text-white transition-colors"
            >
              About
            </a>
            <a
              href={`${portfolioUrl}#contact`}
              className="text-slate-400 hover:text-white transition-colors"
            >
              Contact
            </a>
            <a
              href="https://github.com/mcaesarar2-boop/Trip-Simulation"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
            >
              GitHub ↗
            </a>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all ml-auto md:ml-0 cursor-pointer"
              title="Kembali ke Atas"
              aria-label="Kembali ke Atas"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Copyright & Meta */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-400">
          <p>
            &copy; 2026 <span className="text-slate-200 font-semibold">Muhammad Caesar Afian Rahman</span>. All rights reserved.
          </p>
          <div className="flex items-center space-x-2 text-[11px] text-slate-500">
            <span>Built with React, Next.js / Vite, TypeScript &amp; Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
