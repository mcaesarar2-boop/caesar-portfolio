import React, { useState } from 'react';
import { useTripContext } from '../../context/TripContext';
import { SectionNotes } from '../../types';
import { formatCurrency } from '../../utils/currency';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip as RechartsTooltip, 
  Legend, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import { 
  BarChart3, 
  Printer, 
  Copy, 
  Check, 
  Download, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Users, 
  Clock, 
  CreditCard, 
  FileSpreadsheet, 
  Info, 
  ChevronRight,
  Sparkles,
  Plane,
  Hotel,
  Utensils,
  Wallet,
  Home,
  FileText,
  StickyNote,
  Search,
  ArrowRightLeft,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SearchPriceModal } from '../SearchPriceModal';

const SECTION_NOTE_INFO: Record<keyof SectionNotes, { title: string; category: string; step: number }> = {
  mainTransport: { title: 'Tiket & Transportasi Utama', category: 'Biaya Inti', step: 1 },
  accommodation: { title: 'Akomodasi (Hotel / Penginapan)', category: 'Biaya Inti', step: 2 },
  documentsAndPrep: { title: 'Persiapan & Dokumen', category: 'Biaya Inti', step: 2 },
  fixedCosts: { title: 'Biaya Persiapan Tetap', category: 'Biaya Inti', step: 2 },
  meals: { title: 'Konsumsi & Kuliner (F&B)', category: 'Biaya Harian', step: 3 },
  localTransport: { title: 'Transportasi Lokal Selama di Destinasi', category: 'Biaya Harian', step: 3 },
  activities: { title: 'Aktivitas & Tiket Masuk Objek Wisata', category: 'Biaya Harian', step: 3 },
  telecom: { title: 'Telekomunikasi, SIM & Roaming', category: 'Biaya Harian', step: 3 },
  souvenirs: { title: 'Alokasi Belanja & Suvenir', category: 'Belanja & Darurat', step: 4 },
  contingency: { title: 'Dana Darurat (Contingency Fund)', category: 'Belanja & Darurat', step: 4 },
  unforeseen: { title: 'Mitigasi Skenario Tak Terduga', category: 'Belanja & Darurat', step: 4 },
  postTrip: { title: 'Pasca-Perjalanan (Fase Kepulangan)', category: 'Pasca-Trip', step: 4 },
};

export const Step5Dashboard: React.FC = () => {
  const { state, calculations, setActiveStep } = useTripContext();
  const { profile } = state;
  const currency = profile.currency;

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'donut' | 'bar'>('donut');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Active notes mapping
  const activeNotes = (Object.entries(state.notes || {}) as [keyof SectionNotes, string][])
    .filter(([_, value]) => typeof value === 'string' && value.trim().length > 0)
    .map(([key, value]) => ({
      key,
      title: SECTION_NOTE_INFO[key]?.title || key,
      category: SECTION_NOTE_INFO[key]?.category || 'Umum',
      step: SECTION_NOTE_INFO[key]?.step || 1,
      content: value.trim(),
    }));

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // safe fallback
    }
  };

  // Copy structured summary to clipboard
  const handleCopySummary = () => {
    const notesSummary = activeNotes.length > 0
      ? `\n\n📝 CATATAN KHUSUS TIAP POS ANGGARAN:\n` +
        activeNotes.map((n) => `• [${n.title}]: "${n.content}"`).join('\n')
      : '';

    const textSummary = `
✈️ RINGKASAN SIMULASI BIAYA PERJALANAN EKSTENSIF
------------------------------------------------
📍 Rute: ${profile.origin || 'Kota Asal'} ➔ ${profile.destination || 'Kota Tujuan'} (${profile.type.toUpperCase()})
🎫 Tiket: ${state.mainTransport.tripType === 'roundTrip' ? 'Pulang-Pergi (PP)' : 'Satu Arah (One-Way)'} • Moda: ${state.mainTransport.transportMode.toUpperCase()}
📅 Durasi: ${profile.durationDays} Hari / ${profile.durationNights} Malam
👥 Peserta: ${profile.adults} Dewasa${profile.children > 0 ? `, ${profile.children} Anak (50% F&B)` : ''}
🎒 Gaya Liburan: ${profile.travelStyle.toUpperCase()}

💰 RINGKASAN FINANSIAL:
• Grand Total Estimasi: ${formatCurrency(calculations.grandTotalWithScenarios, currency)}
• Biaya per Dewasa: ${formatCurrency(calculations.costPerAdult, currency)}
${profile.children > 0 ? `• Biaya per Anak (50% F&B): ${formatCurrency(calculations.costPerChild, currency)}\n` : ''}• Deposit Hotel Refundable: ${formatCurrency(calculations.refundableDepositTotal, currency)}

⏱️ TIMELINE ANGGARAN:
1. Pra-Perjalanan (Pre-Trip): ${formatCurrency(calculations.preTripTotal, currency)}
2. Selama Liburan (On-Trip): ${formatCurrency(calculations.onTripTotal, currency)}
3. Pasca-Perjalanan (Post-Trip): ${formatCurrency(calculations.postTripTotal, currency)}

🛡️ RAPOR KESEHATAN ANGGARAN:
Status: ${calculations.safetyScore.label}
Alokasi Dana Darurat: ${calculations.safetyScore.contingencyRatio}% (${formatCurrency(calculations.contingencyFundAmount, currency)})
${calculations.unforeseenScenarioTotal > 0 ? `Risiko Skenario Sial Aktif: ${formatCurrency(calculations.unforeseenScenarioTotal, currency)}` : 'Tidak ada skenario sial aktif.'}${notesSummary}
------------------------------------------------
Dihasilkan oleh Kalkulator & Simulasi Perjalanan Ekstensif (Mode Offline)
    `.trim();

    navigator.clipboard.writeText(textSummary).then(() => {
      setCopied(true);
      triggerConfetti();
      setTimeout(() => setCopied(false), 3000);
    });
  };

  // Print view handler
  const handlePrint = () => {
    window.print();
  };

  // Export JSON backup
  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `simulasi-trip-${profile.destination ? profile.destination.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() : 'rencana_perjalanan'}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Data for Category Donut Chart
  const donutData = calculations.categoryBreakdown.map((item) => ({
    name: item.name,
    value: item.amount,
    color: item.color,
  }));

  // Data for Timeline Comparison Bar Chart
  const timelineBarData = calculations.timelineBreakdown.map((item) => ({
    phase: item.phase.replace('Fase ', '').replace('Perjalanan ', ''),
    nominal: item.amount,
  }));

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header Khusus Print / Ekspor PDF */}
      <div className="hidden print:block pb-4 mb-4 border-b-2 border-slate-800">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">LAPORAN ESTIMASI ANGGARAN PERJALANAN</h1>
            <p className="text-sm font-semibold text-slate-700 mt-0.5">
              {profile.origin || 'Kota Asal'} ➔ {profile.destination || 'Kota Tujuan'} ({profile.type === 'domestic' ? 'Domestik' : 'Internasional'})
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {profile.durationDays} Hari {profile.durationNights} Malam • {profile.adults} Dewasa{profile.children > 0 ? `, ${profile.children} Anak` : ''} • Gaya: {profile.travelStyle} • Tiket: {state.mainTransport.tripType === 'roundTrip' ? 'PP' : 'One-Way'}
            </p>
          </div>
          <div className="text-right text-xs text-slate-500">
            <p className="font-bold text-slate-800">Kalkulator Perjalanan Offline</p>
            <p>Mata Uang: {currency}</p>
          </div>
        </div>
      </div>

      {/* Dashboard Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden print:hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                Tahap 5 • Dashboard Finansial Lengkap
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-slate-200 capitalize">
                {profile.travelStyle}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {profile.origin || 'Kota Asal'} ➔ {profile.destination || 'Kota Tujuan'}
            </h2>
            <p className="text-sm text-slate-300 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>{profile.durationDays} Hari {profile.durationNights} Malam</span>
              <span>•</span>
              <span>{profile.adults} Dewasa{profile.children > 0 ? `, ${profile.children} Anak` : ''}</span>
              <span>•</span>
              <span className="capitalize">{profile.type} Trip</span>
              <span>•</span>
              <span className="inline-flex items-center space-x-1 text-blue-200 bg-white/10 px-2 py-0.5 rounded text-xs font-semibold">
                {state.mainTransport.tripType === 'roundTrip' ? (
                  <>
                    <ArrowRightLeft className="w-3 h-3 text-blue-300" />
                    <span>Pulang-Pergi (PP)</span>
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-3 h-3 text-blue-300" />
                    <span>Satu Arah (One-Way)</span>
                  </>
                )}
              </span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border border-blue-400/30 transition-all inline-flex items-center space-x-1.5 shadow-xs"
              title="Bantuan Cek Harga di Mesin Pencari"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Cek Search Engine</span>
            </button>

            <button
              onClick={handleCopySummary}
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all inline-flex items-center space-x-1.5 shadow-xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Tersalin!' : 'Salin Ringkasan'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all inline-flex items-center space-x-1.5 shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / PDF</span>
            </button>

            <button
              onClick={handleDownloadJSON}
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all inline-flex items-center space-x-1.5 shadow-xs"
              title="Simpan konfigurasi ke file JSON"
            >
              <Download className="w-4 h-4" />
              <span>Ekspor JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* METRIK UTAMA: 4 KARTU FINANCIAL STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Grand Total */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="w-1.5 h-full bg-blue-600 absolute left-0 top-0" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Grand Total Estimasi
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
            {formatCurrency(calculations.grandTotalWithScenarios, currency)}
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Mencakup inti, harian, darurat & risiko aktif
          </p>
        </div>

        {/* Biaya per Dewasa */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="w-1.5 h-full bg-indigo-600 absolute left-0 top-0" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Biaya / Peserta Dewasa
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-900 mt-1 tracking-tight">
            {formatCurrency(calculations.costPerAdult, currency)}
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Total {profile.adults} orang dewasa (100% konsumsi)
          </p>
        </div>

        {/* Biaya per Anak (jika ada) atau Netto Expense */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="w-1.5 h-full bg-amber-500 absolute left-0 top-0" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            {profile.children > 0 ? 'Biaya / Anak (50% F&B)' : 'Pengeluaran Bersih Netto'}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-700 mt-1 tracking-tight">
            {profile.children > 0
              ? formatCurrency(calculations.costPerChild, currency)
              : formatCurrency(calculations.netEffectiveExpense, currency)}
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {profile.children > 0
              ? `Terhitung ${profile.children} anak (50% porsi makan dewasa)`
              : 'Total riil belanja tanpa jaminan deposit'}
          </p>
        </div>

        {/* Jaminan Deposit Hotel Refundable */}
        <div className="bg-white p-5 rounded-2xl border border-teal-200 bg-teal-50/20 shadow-sm relative overflow-hidden">
          <div className="w-1.5 h-full bg-teal-500 absolute left-0 top-0" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
              Deposit (Refundable)
            </span>
            <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded">
              Akan Kembali
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-teal-900 mt-1 tracking-tight">
            {formatCurrency(calculations.refundableDepositTotal, currency)}
          </div>
          <p className="text-[11px] text-teal-700 mt-2">
            Disiapkan di muka, tidak mengurangi kekayaan riil
          </p>
        </div>
      </div>

      {/* RAPOR KEAMANAN ANGGARAN (BUDGET HEALTH SCORECARD) */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                calculations.safetyScore.status === 'safe'
                  ? 'bg-emerald-100 text-emerald-700'
                  : calculations.safetyScore.status === 'vulnerable'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-rose-100 text-rose-700'
              }`}
            >
              {calculations.safetyScore.status === 'safe' ? (
                <ShieldCheck className="w-6 h-6" />
              ) : calculations.safetyScore.status === 'vulnerable' ? (
                <AlertTriangle className="w-6 h-6" />
              ) : (
                <ShieldAlert className="w-6 h-6" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Rapor Keamanan Anggaran (Budget Health Scorecard)</h3>
              <p className="text-xs text-slate-500">
                Analisis rasio cadangan darurat ({calculations.safetyScore.contingencyRatio}%) terhadap total biaya & mitigasi risiko
              </p>
            </div>
          </div>

          <div
            className={`inline-flex items-center px-3.5 py-1.5 rounded-full border text-xs sm:text-sm font-bold self-start sm:self-auto ${calculations.safetyScore.badgeClass}`}
          >
            {calculations.safetyScore.label}
          </div>
        </div>

        {/* Progress bar visual rasio cadangan */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-600">
            <span>Rasio Cadangan Darurat: {calculations.safetyScore.contingencyRatio}%</span>
            <span>Target Ideal: ≥ 10% - 15%</span>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${Math.min(100, calculations.safetyScore.contingencyRatio * 5)}%` }}
              className={`h-full transition-all duration-500 ${
                calculations.safetyScore.status === 'safe'
                  ? 'bg-emerald-500'
                  : calculations.safetyScore.status === 'vulnerable'
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
            />
          </div>
          <p className="text-xs text-slate-600 leading-relaxed pt-1">
            {calculations.safetyScore.description}
          </p>
        </div>

        {/* Actionable Recommendations */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
          <div className="font-bold text-xs text-slate-800 uppercase tracking-wider">
            Rekomendasi Ahli Perencana Finansial Perjalanan:
          </div>
          <ul className="space-y-1.5 text-xs text-slate-600">
            {calculations.safetyScore.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start space-x-2">
                <span className="text-blue-600 font-bold shrink-0">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* VISUALISASI DATA: RECHARTS DONUT & TIMELINE BAR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut Chart: Pembagian Kategori */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Komposisi Pengeluaran Kategori</h3>
              <p className="text-xs text-slate-500">Distribusi alokasi anggaran liburan</p>
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 text-slate-700">
              Donut Chart
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={105}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  formatter={(value: any) => [formatCurrency(Number(value) || 0, currency), 'Nominal']}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend Badges */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
            {calculations.categoryBreakdown.map((item) => (
              <div key={item.id} className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 truncate">{item.name}</span>
                <span className="font-bold text-slate-900 ml-auto">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Anggaran: Pre-Trip, On-Trip, Post-Trip */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Timeline Anggaran Berdasarkan Fase</h3>
              <p className="text-xs text-slate-500">Kapan dana perlu dicairkan & dibelanjakan</p>
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 text-slate-700">
              Fase Waktu
            </span>
          </div>

          {/* Bar Chart Timeline */}
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timelineBarData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="phase" tick={{ fontSize: 11 }} stroke="#64748b" />
                <YAxis
                  tickFormatter={(v) => (v >= 1000000 ? `${v / 1000000}jt` : `${v}`)}
                  tick={{ fontSize: 10 }}
                  stroke="#64748b"
                />
                <RechartsTooltip
                  formatter={(value: any) => [formatCurrency(Number(value) || 0, currency), 'Alokasi']}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="nominal" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* List Fase Timeline */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            {calculations.timelineBreakdown.map((timeline, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{timeline.phase}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-extrabold text-blue-700">
                      {formatCurrency(timeline.amount, currency)}
                    </span>
                    <span className="text-[11px] text-slate-400">({timeline.percentage}%)</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {timeline.items.map((it, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-600"
                    >
                      {it.label}: <strong>{formatCurrency(it.amount, currency)}</strong>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SIMULASI DAMPAK SKENARIO TAK TERDUGA (DIBANDINGKAN BUDGET NORMAL) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Uji Ketahanan: Base Budget vs Skenario Tak Terduga</h3>
              <p className="text-xs text-slate-500">Perbandingan biaya normal dengan potensi beban risiko tambahan</p>
            </div>
          </div>

          <button
            onClick={() => setActiveStep(4)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center space-x-1 print:hidden"
          >
            <span>Ubah Skenario</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
            <span className="text-xs text-slate-500 font-medium">Budget Normal (Tanpa Skenario Sial)</span>
            <div className="text-xl font-bold text-slate-800">
              {formatCurrency(calculations.totalWithoutScenarios, currency)}
            </div>
            <p className="text-[11px] text-slate-500">Rencana jika seluruh perjalanan berjalan mulus</p>
          </div>

          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-1">
            <span className="text-xs text-rose-700 font-medium">Beban Risiko Tak Terduga Aktif</span>
            <div className="text-xl font-bold text-rose-700">
              + {formatCurrency(calculations.unforeseenScenarioTotal, currency)}
            </div>
            <p className="text-[11px] text-rose-600">
              {calculations.unforeseenScenarioTotal > 0
                ? 'Dari skenario darurat yang Anda aktifkan di Tahap 4'
                : 'Belum ada skenario darurat yang diaktifkan'}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-1">
            <span className="text-xs text-blue-700 font-medium">Cadangan Dana Darurat Tersedia</span>
            <div className="text-xl font-bold text-blue-800">
              {formatCurrency(calculations.contingencyFundAmount, currency)}
            </div>
            <p className="text-[11px] text-blue-600">
              {calculations.contingencyFundAmount >= calculations.unforeseenScenarioTotal
                ? '✓ Dana darurat Anda mencukupi untuk menutup risiko aktif ini'
                : '⚠ Defisit! Dana darurat belum cukup menutup skenario sial ini'}
            </p>
          </div>
        </div>
      </div>

      {/* BAGIAN CATATAN KHUSUS TIAP POS ANGGARAN (DITAMPILKAN DI DASHBOARD & EXPORT PDF) */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm space-y-4 print:border-slate-300 print:shadow-none print:p-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <StickyNote className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Catatan Kualitatif Tiap Pos Anggaran</h3>
              <p className="text-xs text-slate-500">
                Spesifikasi, preferensi, dan catatan pengingat yang terekam pada cetak laporan / PDF
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            {activeNotes.length} Catatan Terisi
          </span>
        </div>

        {activeNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {activeNotes.map((item) => (
              <div
                key={item.key}
                className="p-3.5 rounded-xl border border-amber-200/90 bg-amber-50/40 space-y-1.5 print:bg-white print:border-slate-300 print:p-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    <span className="text-xs font-bold text-slate-900">{item.title}</span>
                    <span className="text-[10px] font-medium text-slate-400">({item.category})</span>
                  </div>
                  <button
                    onClick={() => setActiveStep(item.step)}
                    className="text-[10px] text-blue-600 hover:underline font-semibold print:hidden"
                  >
                    Ubah di Tahap {item.step}
                  </button>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic bg-white/80 p-2 rounded-lg border border-amber-100 print:bg-transparent print:border-none print:p-0">
                  "{item.content}"
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-xl border-2 border-dashed border-slate-200 text-center space-y-1 print:border-none print:p-2">
            <p className="text-xs text-slate-500 font-medium">
              Belum ada catatan opsional yang ditambahkan pada pos anggaran.
            </p>
            <p className="text-[11px] text-slate-400 print:hidden">
              Anda dapat mencantumkan catatan spesifik (seperti rencana maskapai, lokasi hotel, titipan oleh-oleh, dsb) di bawah setiap kolom input pada Tahap 1 sampai 4.
            </p>
          </div>
        )}
      </div>

      {/* Modal Bantuan Cek Harga Search Engine */}
      <SearchPriceModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </div>
  );
};
