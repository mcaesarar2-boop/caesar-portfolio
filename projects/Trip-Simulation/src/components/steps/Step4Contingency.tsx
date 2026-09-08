import React from 'react';
import { useTripContext } from '../../context/TripContext';
import { formatCurrency } from '../../utils/currency';
import { FormattedNumberInput } from '../FormattedNumberInput';
import { SectionNotesInput } from '../SectionNotesInput';
import { 
  ShieldAlert, 
  ShoppingBag, 
  Home, 
  AlertTriangle, 
  PlaneTakeoff, 
  Luggage, 
  CloudRain, 
  HeartPulse, 
  ShieldCheck, 
  Info,
  Sliders,
  CheckCircle2
} from 'lucide-react';

export const Step4Contingency: React.FC = () => {
  const { state, updateContingency, updateSectionNote, calculations } = useTripContext();
  const { contingency, profile } = state;
  const currency = profile.currency;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateContingency({ contingencyPercent: Number(e.target.value) });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Step Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center space-x-2 text-rose-600 font-semibold text-xs tracking-wider uppercase mb-1">
          <ShieldAlert className="w-4 h-4" />
          <span>Tahap 4 dari 5 • Contingency, Risks & Post-Trip</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Hal Tak Terduga, Mitigasi Risiko & Pasca-Trip
        </h2>
        <p className="text-slate-600 text-sm mt-1">
          Simulasikan skenario tak terduga ("Skenario Sial"), atur alokasi dana darurat (5% - 20%), belanja suvenir, serta biaya kepulangan ke rumah.
        </p>
      </div>

      {/* Bagian 1: Oleh-oleh & Dana Darurat Slider */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Belanja Oleh-Oleh */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
            <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Alokasi Belanja & Suvenir</h3>
              <p className="text-xs text-slate-500">Oleh-oleh keluarga, kerabat, & barang kenangan</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Total Budget Belanja / Oleh-oleh
            </label>
            <div className="relative">
              <FormattedNumberInput
                value={contingency.souvenirBudget}
                onChange={(val) =>
                  updateContingency({ souvenirBudget: val })
                }
                className="w-full pl-3.5 pr-14 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 outline-none font-semibold"
              />
              <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-medium">
                {currency}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Rekomendasi: Batasi suvenir maksimal 10%–15% dari total anggaran agar tidak membebani pos penting.
            </p>
          </div>

          {/* Catatan Belanja & Suvenir */}
          <SectionNotesInput
            value={state.notes?.souvenirs || ''}
            onChange={(val) => updateSectionNote('souvenirs', val)}
            placeholder="Contoh: Titipan oleh-oleh kantor, kaos khas daerah, camilan lokal..."
          />
        </div>

        {/* Slider Dana Darurat (Contingency Fund) */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Dana Darurat (Contingency)</h3>
                <p className="text-xs text-slate-500">Buffer likuid pengaman (5% – 25% dari biaya inti)</p>
              </div>
            </div>

            <span className="text-lg font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
              {contingency.contingencyPercent}%
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>5% (Minimal)</span>
              <span>10% (Standar)</span>
              <span>15% (Rekomendasi Internasional)</span>
              <span>25%</span>
            </div>

            <input
              type="range"
              min="5"
              max="25"
              step="1"
              value={contingency.contingencyPercent}
              onChange={handleSliderChange}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />

            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs flex items-center justify-between">
              <span className="text-emerald-900 font-medium">
                Nominal Dana Darurat Disimpan:
              </span>
              <span className="font-bold text-emerald-800 text-sm">
                {formatCurrency(calculations.contingencyFundAmount, currency)}
              </span>
            </div>

            {/* Catatan Dana Darurat */}
            <SectionNotesInput
              value={state.notes?.contingency || ''}
              onChange={(val) => updateSectionNote('contingency', val)}
              placeholder="Contoh: Disimpan dalam rekening terpisah / kartu kredit cadangan limit 5 juta..."
            />
          </div>
        </div>
      </div>

      {/* Bagian 2: Skenario "Sial" (Toggles / Switches dengan Biaya Realistis) */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Simulasi Skenario Tak Terduga ("Skenario Sial")
                </h3>
                <p className="text-xs text-slate-500">
                  Uji ketahanan finansial rencana perjalanan Anda terhadap insiden tak terduga di lapangan
                </p>
              </div>
            </div>

            <div className="text-right hidden sm:block">
              <span className="text-[11px] text-slate-500 font-medium block">Total Beban Risiko Aktif</span>
              <span
                className={`text-base font-extrabold ${
                  calculations.unforeseenScenarioTotal > 0 ? 'text-rose-600' : 'text-slate-400'
                }`}
              >
                {formatCurrency(calculations.unforeseenScenarioTotal, currency)}
              </span>
            </div>
          </div>
        </div>

        {/* 4 Kartu Skenario */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Skenario 1: Ketinggalan Pesawat */}
          <div
            className={`p-4 rounded-xl border-2 transition-all ${
              contingency.missedFlight.enabled
                ? 'border-rose-400 bg-rose-50/40 shadow-xs'
                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start space-x-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    contingency.missedFlight.enabled
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  <PlaneTakeoff className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Ketinggalan Pesawat / Rebooking</h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {contingency.missedFlight.description}
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={contingency.missedFlight.enabled}
                  onChange={(e) =>
                    updateContingency({
                      missedFlight: { ...contingency.missedFlight, enabled: e.target.checked },
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
              </label>
            </div>

            {contingency.missedFlight.enabled && (
              <div className="mt-3 pt-3 border-t border-rose-200 flex items-center justify-between text-xs">
                <span className="font-semibold text-rose-900">Estimasi Biaya Tiket Darurat:</span>
                <div className="relative w-36">
                  <FormattedNumberInput
                    value={contingency.missedFlight.cost}
                    onChange={(val) =>
                      updateContingency({
                        missedFlight: {
                          ...contingency.missedFlight,
                          cost: val,
                        },
                      })
                    }
                    className="w-full pl-2.5 pr-8 py-1 rounded border border-rose-300 bg-white font-bold text-rose-900 text-right focus:outline-none"
                  />
                  <span className="absolute right-2 top-1 text-[10px] text-slate-400">
                    {currency}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Skenario 2: Bagasi Hilang / Delay */}
          <div
            className={`p-4 rounded-xl border-2 transition-all ${
              contingency.lostBaggage.enabled
                ? 'border-rose-400 bg-rose-50/40 shadow-xs'
                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start space-x-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    contingency.lostBaggage.enabled
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  <Luggage className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Bagasi Hilang / Tertunda</h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {contingency.lostBaggage.description}
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={contingency.lostBaggage.enabled}
                  onChange={(e) =>
                    updateContingency({
                      lostBaggage: { ...contingency.lostBaggage, enabled: e.target.checked },
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
              </label>
            </div>

            {contingency.lostBaggage.enabled && (
              <div className="mt-3 pt-3 border-t border-rose-200 flex items-center justify-between text-xs">
                <span className="font-semibold text-rose-900">Perlengkapan Darurat:</span>
                <div className="relative w-36">
                  <FormattedNumberInput
                    value={contingency.lostBaggage.cost}
                    onChange={(val) =>
                      updateContingency({
                        lostBaggage: {
                          ...contingency.lostBaggage,
                          cost: val,
                        },
                      })
                    }
                    className="w-full pl-2.5 pr-8 py-1 rounded border border-rose-300 bg-white font-bold text-rose-900 text-right focus:outline-none"
                  />
                  <span className="absolute right-2 top-1 text-[10px] text-slate-400">
                    {currency}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Skenario 3: Cuaca Buruk / Tambah Malam */}
          <div
            className={`p-4 rounded-xl border-2 transition-all ${
              contingency.badWeather.enabled
                ? 'border-rose-400 bg-rose-50/40 shadow-xs'
                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start space-x-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    contingency.badWeather.enabled
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  <CloudRain className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Cuaca Buruk & Delay Transportasi</h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {contingency.badWeather.description}
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={contingency.badWeather.enabled}
                  onChange={(e) =>
                    updateContingency({
                      badWeather: { ...contingency.badWeather, enabled: e.target.checked },
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
              </label>
            </div>

            {contingency.badWeather.enabled && (
              <div className="mt-3 pt-3 border-t border-rose-200 flex items-center justify-between text-xs">
                <span className="font-semibold text-rose-900">
                  {contingency.badWeather.additionalNights} Malam Tambahan Hotel & Makan:
                </span>
                <div className="relative w-36">
                  <FormattedNumberInput
                    value={contingency.badWeather.costPerNight}
                    onChange={(val) =>
                      updateContingency({
                        badWeather: {
                          ...contingency.badWeather,
                          costPerNight: val,
                        },
                      })
                    }
                    className="w-full pl-2.5 pr-8 py-1 rounded border border-rose-300 bg-white font-bold text-rose-900 text-right focus:outline-none"
                  />
                  <span className="absolute right-2 top-1 text-[10px] text-slate-400">
                    {currency}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Skenario 4: Kunjungan Medis / Darurat Kesehatan */}
          <div
            className={`p-4 rounded-xl border-2 transition-all ${
              contingency.medicalEmergency.enabled
                ? 'border-rose-400 bg-rose-50/40 shadow-xs'
                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start space-x-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    contingency.medicalEmergency.enabled
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Konsultasi Medis / Klinik Lokal</h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {contingency.medicalEmergency.description}
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={contingency.medicalEmergency.enabled}
                  onChange={(e) =>
                    updateContingency({
                      medicalEmergency: { ...contingency.medicalEmergency, enabled: e.target.checked },
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
              </label>
            </div>

            {contingency.medicalEmergency.enabled && (
              <div className="mt-3 pt-3 border-t border-rose-200 flex items-center justify-between text-xs">
                <span className="font-semibold text-rose-900">Biaya Klinik / Obat:</span>
                <div className="relative w-36">
                  <FormattedNumberInput
                    value={contingency.medicalEmergency.cost}
                    onChange={(val) =>
                      updateContingency({
                        medicalEmergency: {
                          ...contingency.medicalEmergency,
                          cost: val,
                        },
                      })
                    }
                    className="w-full pl-2.5 pr-8 py-1 rounded border border-rose-300 bg-white font-bold text-rose-900 text-right focus:outline-none"
                  />
                  <span className="absolute right-2 top-1 text-[10px] text-slate-400">
                    {currency}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Catatan Skenario Tak Terduga */}
        <SectionNotesInput
          value={state.notes?.unforeseen || ''}
          onChange={(val) => updateSectionNote('unforeseen', val)}
          placeholder="Contoh: Asuransi menanggung delay bagasi > 4 jam, simpan bukti struk pembelian darurat..."
        />
      </div>

      {/* Bagian 3: Pasca-Perjalanan (Post-Trip & Kepulangan) */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Pasca-Perjalanan (Fase Kepulangan)</h3>
              <p className="text-xs text-slate-500">Biaya transportasi dari bandara/stasiun ke rumah & laundry kotor</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-500 font-medium block">Total Pasca-Trip</span>
            <span className="text-base font-extrabold text-slate-800">
              {formatCurrency(calculations.postTripTotal, currency)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Taksi / Travel Bandara atau Stasiun ke Rumah
            </label>
            <div className="relative">
              <FormattedNumberInput
                value={contingency.postTripAirportToHome}
                onChange={(val) =>
                  updateContingency({ postTripAirportToHome: val })
                }
                className="w-full pl-3 pr-12 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-semibold"
              />
              <span className="absolute right-3 top-2 text-[11px] text-slate-400 font-medium">{currency}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Biaya Laundry Pakaian Pasca-Liburan (Opsional)
            </label>
            <div className="relative">
              <FormattedNumberInput
                value={contingency.postTripLaundry}
                onChange={(val) =>
                  updateContingency({ postTripLaundry: val })
                }
                className="w-full pl-3 pr-12 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-semibold"
              />
              <span className="absolute right-3 top-2 text-[11px] text-slate-400 font-medium">{currency}</span>
            </div>
          </div>
        </div>

        {/* Catatan Pasca-Perjalanan */}
        <SectionNotesInput
          value={state.notes?.postTrip || ''}
          onChange={(val) => updateSectionNote('postTrip', val)}
          placeholder="Contoh: Naik taksi online bandara ke rumah, laundry kiloan 10kg express..."
        />
      </div>
    </div>
  );
};
