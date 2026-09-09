import React from 'react';
import { useTripContext } from '../context/TripContext';
import { getSearchQueryLinks, getOfflineBenchmarks } from '../utils/searchEngine';
import { formatCurrency } from '../utils/currency';
import { 
  Search, 
  ExternalLink, 
  Sparkles, 
  X, 
  Plane, 
  Hotel, 
  Utensils, 
  Compass, 
  Check, 
  Info,
  Layers,
  AppWindow,
  ClipboardPaste,
  ArrowRight
} from 'lucide-react';

interface SearchPriceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchPriceModal: React.FC<SearchPriceModalProps> = ({ isOpen, onClose }) => {
  const { state, updateMainTransport, updateAccommodation, updateMeals, importFlightData } = useTripContext();
  const [smartPasteText, setSmartPasteText] = React.useState('');
  const [smartPasteStatus, setSmartPasteStatus] = React.useState<string | null>(null);
  const { profile } = state;
  const currency = profile.currency;

  if (!isOpen) return null;

  const searchLinks = getSearchQueryLinks(profile.origin, profile.destination, profile.type);
  const benchmark = getOfflineBenchmarks(profile.type, profile.travelStyle, currency);

  const applyBenchmarkTicket = (isRoundTrip: boolean) => {
    const val = isRoundTrip ? benchmark.suggestedTicketRoundTrip : benchmark.suggestedTicketOneWay;
    updateMainTransport({
      tripType: isRoundTrip ? 'roundTrip' : 'oneWay',
      ticketPricePerPerson: val,
      departureTicketPerPerson: Math.round(val / (isRoundTrip ? 2 : 1)),
      returnTicketPerPerson: isRoundTrip ? Math.round(val / 2) : 0,
    });
  };

  const applyBenchmarkHotel = () => {
    updateAccommodation({
      pricePerNight: benchmark.suggestedHotelPerNight,
    });
  };

  const applyBenchmarkMeals = () => {
    const totalDaily = benchmark.suggestedMealDailyPerAdult;
    updateMeals({
      breakfastPerAdult: Math.round(totalDaily * 0.18),
      lunchPerAdult: Math.round(totalDaily * 0.35),
      dinnerPerAdult: Math.round(totalDaily * 0.35),
      snacksAndCoffeePerAdult: Math.round(totalDaily * 0.12),
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'flight':
        return <Plane className="w-4 h-4 text-blue-600" />;
      case 'hotel':
        return <Hotel className="w-4 h-4 text-teal-600" />;
      case 'food':
        return <Utensils className="w-4 h-4 text-amber-600" />;
      default:
        return <Compass className="w-4 h-4 text-indigo-600" />;
    }
  };

  const openMiniWindow = (url: string) => {
    const width = 1040;
    const height = 760;
    const left = Math.max(0, Math.round((window.screen.width - width) / 2));
    const top = Math.max(0, Math.round((window.screen.height - height) / 2));
    window.open(
      url,
      'GoogleFlightsMiniWindow',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=no,toolbar=no`
    );
  };

  const handleApplySmartPaste = () => {
    if (!smartPasteText.trim()) return;
    const cleanDigits = smartPasteText.replace(/[^\d]/g, '');
    const parsedPrice = parseInt(cleanDigits, 10);
    if (!parsedPrice || isNaN(parsedPrice)) {
      setSmartPasteStatus('error');
      setTimeout(() => setSmartPasteStatus(null), 3000);
      return;
    }
    const isRoundTrip = !/satu arah|one[- ]way/i.test(smartPasteText);
    importFlightData({
      airline: 'Penerbangan Pilihan',
      price: parsedPrice,
      tripType: isRoundTrip ? 'roundTrip' : 'oneWay',
    });
    setSmartPasteStatus('success');
    setSmartPasteText('');
    setTimeout(() => setSmartPasteStatus(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Bantuan Cek Harga & Search Engine</h2>
              <p className="text-xs text-slate-500">
                Rute: <strong>{profile.origin} ➔ {profile.destination}</strong> ({profile.type})
              </p>
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
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Offline Notice Banner */}
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start space-x-2.5">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              Kalkulator ini bekerja <strong>murni secara offline</strong> tanpa database eksternal. Anda bebas mengisi harga tiket manual (baik <strong>Satu Arah</strong> maupun <strong>Pulang-Pergi</strong>). Tautan di bawah membuka mesin pencari langsung untuk mengecek harga pasar terkini jika diperlukan.
            </div>
          </div>

          {/* Opsi 1: Cek via Search Engine Resmi */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Telusuri Harga Riil (Dukungan Mini Window & Ekstensi Companion)
              </h3>
            </div>

            <div className="space-y-2.5">
              {searchLinks.map((link) => {
                const isFlight = link.id === 'google-flights';

                return (
                  <div
                    key={link.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isFlight
                        ? 'border-blue-300 bg-blue-50/40 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start space-x-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isFlight ? 'bg-blue-600 text-white' : 'bg-slate-100'
                          }`}
                        >
                          {getCategoryIcon(link.category)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-900 text-xs sm:text-sm">
                              {link.title}
                            </span>
                            <span
                              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                                isFlight
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {link.badge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{link.description}</p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center space-x-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => openMiniWindow(link.url)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all shadow-2xs ${
                            isFlight
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                          title="Buka di Mini Window agar bisa berdampingan dengan Simulasi Perjalanan"
                        >
                          <AppWindow className="w-3.5 h-3.5" />
                          <span>Mini Window</span>
                        </button>

                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                          title="Buka di Tab Baru Biasa"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>

                    {isFlight && (
                      <div className="mt-2.5 pt-2.5 border-t border-blue-200/60 flex items-center justify-between text-[11px] text-blue-900">
                        <div className="flex items-center space-x-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span>
                            <strong>Fitur Serok Otomatis:</strong> Di mini window, klik tombol hijau <em>[✈️ Masukkan ke Simulasi]</em> untuk sinkronisasi harga & tanggal instan!
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Opsi Ekstra: Smart Paste Cepat */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ClipboardPaste className="w-4 h-4 text-blue-600" />
                Smart Paste Cadangan (Jika Tidak Menggunakan Ekstensi)
              </span>
              {smartPasteStatus === 'success' && (
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Tiket berhasil diterapkan!
                </span>
              )}
              {smartPasteStatus === 'error' && (
                <span className="text-[11px] font-bold text-red-600">
                  Angka harga tidak terdeteksi!
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Salin teks apa pun dari Google Flights (contoh: <code>AirAsia Rp 2.664.300 pulang pergi</code>) dan tempel di sini:
            </p>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={smartPasteText}
                onChange={(e) => setSmartPasteText(e.target.value)}
                placeholder="Contoh: Rp 2.664.300 pulang pergi atau 2850000"
                className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500"
                onKeyDown={(e) => e.key === 'Enter' && handleApplySmartPaste()}
              />
              <button
                type="button"
                onClick={handleApplySmartPaste}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shrink-0"
              >
                <span>Terapkan</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Opsi 2: Acuan Cepat Murni Offline (1-Klik Terapkan) */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Acuan Cepat Offline ({profile.travelStyle.toUpperCase()})
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Jika tidak ingin membuka tab lain, klik tombol di bawah untuk mengisi estimasi acuan pasar:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Tiket PP */}
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <span className="text-[11px] font-bold text-slate-600 block">Tiket Pulang-Pergi</span>
                <div className="text-sm font-extrabold text-blue-700">
                  {formatCurrency(benchmark.suggestedTicketRoundTrip, currency)}
                </div>
                <button
                  type="button"
                  onClick={() => applyBenchmarkTicket(true)}
                  className="w-full py-1 text-xs font-semibold rounded-lg bg-white border border-slate-300 hover:border-blue-500 hover:text-blue-600 transition-all text-slate-700 shadow-2xs"
                >
                  Gunakan Angka PP
                </button>
              </div>

              {/* Tiket One Way */}
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <span className="text-[11px] font-bold text-slate-600 block">Tiket Satu Arah</span>
                <div className="text-sm font-extrabold text-blue-700">
                  {formatCurrency(benchmark.suggestedTicketOneWay, currency)}
                </div>
                <button
                  type="button"
                  onClick={() => applyBenchmarkTicket(false)}
                  className="w-full py-1 text-xs font-semibold rounded-lg bg-white border border-slate-300 hover:border-blue-500 hover:text-blue-600 transition-all text-slate-700 shadow-2xs"
                >
                  Gunakan Angka 1-Way
                </button>
              </div>

              {/* Hotel per malam */}
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <span className="text-[11px] font-bold text-slate-600 block">Hotel / Malam</span>
                <div className="text-sm font-extrabold text-teal-700">
                  {formatCurrency(benchmark.suggestedHotelPerNight, currency)}
                </div>
                <button
                  type="button"
                  onClick={applyBenchmarkHotel}
                  className="w-full py-1 text-xs font-semibold rounded-lg bg-white border border-slate-300 hover:border-teal-500 hover:text-teal-600 transition-all text-slate-700 shadow-2xs"
                >
                  Gunakan Angka Hotel
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Angka dapat Anda edit manual kapan saja di form.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition-colors shadow-xs"
          >
            Selesai & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
