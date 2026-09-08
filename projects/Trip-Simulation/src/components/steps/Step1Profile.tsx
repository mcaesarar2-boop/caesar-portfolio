import React, { useState } from 'react';
import { useTripContext } from '../../context/TripContext';
import { TravelStyle, DestinationType, CurrencyCode } from '../../types';
import { CURRENCIES, formatCurrency } from '../../utils/currency';
import { SearchPriceModal } from '../SearchPriceModal';
import { TransportCard } from '../TransportCard';
import { 
  Compass, 
  Users, 
  Calendar, 
  MapPin, 
  Globe2, 
  Luggage, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Crown,
  HeartHandshake,
  Plane,
  Train,
  Bus,
  Car,
  Ship,
  ArrowRightLeft,
  ArrowRight,
  Search,
  CheckCircle2,
  Info
} from 'lucide-react';

export const Step1Profile: React.FC = () => {
  const { 
    state, 
    updateProfile, 
    updateMainTransport, 
    applyTravelStyle, 
    setCurrency,
    calculations 
  } = useTripContext();
  
  const { profile, mainTransport } = state;
  const currency = profile.currency;
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const handleStyleSelect = (style: TravelStyle) => {
    applyTravelStyle(style);
  };

  const handleDestinationTypeChange = (type: DestinationType) => {
    updateProfile({ type });
  };

  const effectiveTicket = mainTransport.isSplitTicket
    ? (mainTransport.departureTicketPerPerson || 0) +
      (mainTransport.tripType === 'roundTrip' ? mainTransport.returnTicketPerPerson || 0 : 0)
    : mainTransport.ticketPricePerPerson || 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Step Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center space-x-2 text-blue-600 font-semibold text-xs tracking-wider uppercase mb-1">
          <Compass className="w-4 h-4" />
          <span>Tahap 1 dari 5 • Pre-Trip Foundation</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Profil, Rute & Parameter Dasar Perjalanan
        </h2>
        <p className="text-slate-600 text-sm mt-1">
          Kalkulator ini bekerja <strong>murni secara offline tanpa database eksternal</strong>. Isi rute tujuan, durasi, komposisi rombongan, serta estimasi manual harga tiket per orang (opsi Pulang-Pergi atau Satu Arah).
        </p>
      </div>

      {/* Grid: Destinasi & Durasi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Asal & Tujuan */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Rute & Destinasi</span>
            </h3>

            {/* Domestik vs Internasional Toggle */}
            <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => handleDestinationTypeChange('domestic')}
                className={`px-3 py-1 rounded-md transition-all ${
                  profile.type === 'domestic'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Domestik
              </button>
              <button
                type="button"
                onClick={() => handleDestinationTypeChange('international')}
                className={`px-3 py-1 rounded-md transition-all ${
                  profile.type === 'international'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Internasional
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kota / Bandara Asal
              </label>
              <input
                type="text"
                value={profile.origin}
                onChange={(e) => updateProfile({ origin: e.target.value })}
                placeholder="Contoh: Jakarta (CGK)"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kota / Negara Tujuan
              </label>
              <input
                type="text"
                value={profile.destination}
                onChange={(e) => updateProfile({ destination: e.target.value })}
                placeholder="Contoh: Tokyo, Jepang"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
          </div>

          <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="w-full sm:w-1/2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tanggal Estimasi Keberangkatan
              </label>
              <input
                type="date"
                value={profile.startDate}
                onChange={(e) => updateProfile({ startDate: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-700"
              />
            </div>

            {/* Tombol Cek di Search Engine */}
            <div className="w-full sm:w-1/2 flex items-end">
              <button
                type="button"
                onClick={() => setIsSearchModalOpen(true)}
                className="w-full py-2.5 px-3 text-xs font-bold rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-700 transition-all flex items-center justify-center space-x-1.5 shadow-2xs"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Cek Harga di Search Engine</span>
              </button>
            </div>
          </div>
        </div>

        {/* Durasi & Waktu */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span>Durasi Perjalanan</span>
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Jumlah Hari (Daytime)
              </label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => updateProfile({ durationDays: Math.max(0, profile.durationDays - 1) })}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={profile.durationDays}
                  onChange={(e) =>
                    updateProfile({ durationDays: Math.max(0, parseInt(e.target.value) || 0) })
                  }
                  className="w-14 text-center font-bold text-lg text-slate-900 bg-transparent focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => updateProfile({ durationDays: profile.durationDays + 1 })}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  +
                </button>
                <span className="text-xs font-medium text-slate-500">Hari</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Jumlah Malam (Menginap)
              </label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => updateProfile({ durationNights: Math.max(0, profile.durationNights - 1) })}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={profile.durationNights}
                  onChange={(e) =>
                    updateProfile({ durationNights: Math.max(0, parseInt(e.target.value) || 0) })
                  }
                  className="w-14 text-center font-bold text-lg text-slate-900 bg-transparent focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => updateProfile({ durationNights: profile.durationNights + 1 })}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  +
                </button>
                <span className="text-xs font-medium text-slate-500">Malam</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-500 bg-blue-50/60 p-2.5 rounded-lg border border-blue-100">
            💡 <strong>Info Akomodasi:</strong> Durasi malam ({profile.durationNights} malam) akan otomatis disinkronkan ke perhitungan total sewa hotel.
          </div>
        </div>
      </div>

      {/* KARTU KHUSUS: KONFIGURASI TIKET & RUTE DENGAN PILIHAN KELAS, MOBIL, DAN ADD-ON */}
      <TransportCard onOpenSearch={() => setIsSearchModalOpen(true)} />

      {/* Jumlah Peserta & Aturan Pembobotan Anak */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>Komposisi Peserta Perjalanan</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Pemisahan kategori menentukan bobot konsumsi, porsi makan, dan tiket atraksi
            </p>
          </div>

          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-50 text-amber-800 rounded-full border border-amber-200 text-xs font-medium">
            <HeartHandshake className="w-3.5 h-3.5 text-amber-600" />
            <span>Aturan: Anak = 50% porsi makan dewasa</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
          {/* Dewasa */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50">
            <div>
              <div className="font-bold text-slate-900 text-sm">Peserta Dewasa</div>
              <p className="text-xs text-slate-500">Usia 12+ tahun (100% biaya konsumsi)</p>
            </div>
            <div className="flex items-center space-x-2.5">
              <button
                type="button"
                onClick={() => updateProfile({ adults: Math.max(0, profile.adults - 1) })}
                className="w-9 h-9 rounded-lg bg-white border border-slate-200 font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                -
              </button>
              <span className="w-8 text-center font-extrabold text-lg text-slate-900">
                {profile.adults}
              </span>
              <button
                type="button"
                onClick={() => updateProfile({ adults: profile.adults + 1 })}
                className="w-9 h-9 rounded-lg bg-white border border-slate-200 font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Anak-anak */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50">
            <div>
              <div className="font-bold text-slate-900 text-sm">Anak-anak</div>
              <p className="text-xs text-slate-500">Usia 2–11 tahun (Dihitung 50% konsumsi)</p>
            </div>
            <div className="flex items-center space-x-2.5">
              <button
                type="button"
                onClick={() => updateProfile({ children: Math.max(0, profile.children - 1) })}
                className="w-9 h-9 rounded-lg bg-white border border-slate-200 font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                -
              </button>
              <span className="w-8 text-center font-extrabold text-lg text-slate-900">
                {profile.children}
              </span>
              <button
                type="button"
                onClick={() => updateProfile({ children: profile.children + 1 })}
                className="w-9 h-9 rounded-lg bg-white border border-slate-200 font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-600 bg-slate-100/70 p-3 rounded-xl flex items-center justify-between">
          <span>
            Total Peserta: <strong>{profile.adults + profile.children} Orang</strong> ({profile.adults} Dewasa, {profile.children} Anak)
          </span>
          <span className="text-blue-700 font-medium">
            Bobot Konsumsi Makanan Efektif: <strong>{profile.adults + profile.children * 0.5} porsi dewasa</strong>
          </span>
        </div>
      </div>

      {/* Gaya Perjalanan (Travel Style) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Gaya Perjalanan (Travel Style)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Memilih gaya perjalanan akan otomatis menyesuaikan modifier harga hotel, makan, dan rekomendasi cadangan dana darurat
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Backpacker */}
          <div
            onClick={() => handleStyleSelect('backpacker')}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
              profile.travelStyle === 'backpacker'
                ? 'border-amber-500 bg-amber-50/40 shadow-md ring-2 ring-amber-400/20'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {profile.travelStyle === 'backpacker' && (
              <span className="absolute top-3 right-3 text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                Dipilih
              </span>
            )}
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Backpacker / Budget</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Fokus efisiensi biaya. Penginapan hostel/guesthouse, kuliner lokal kaki lima/street food, dan transportasi umum/sewa motor.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-amber-800 font-medium">
              ✓ Cadangan darurat: 10% • Hotel ekonomis
            </div>
          </div>

          {/* Standar / Keluarga */}
          <div
            onClick={() => handleStyleSelect('standard')}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
              profile.travelStyle === 'standard'
                ? 'border-blue-600 bg-blue-50/40 shadow-md ring-2 ring-blue-500/20'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {profile.travelStyle === 'standard' && (
              <span className="absolute top-3 right-3 text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                Dipilih
              </span>
            )}
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Standar / Keluarga</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Keseimbangan kenyamanan & nilai. Hotel bintang 3–4, restoran keluarga, rental mobil nyaman, dan tur berpemandu pilihan.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-blue-800 font-medium">
              ✓ Cadangan darurat: 10%–12% • Hotel bintang 3-4
            </div>
          </div>

          {/* Mewah / Luxury */}
          <div
            onClick={() => handleStyleSelect('luxury')}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
              profile.travelStyle === 'luxury'
                ? 'border-purple-600 bg-purple-50/40 shadow-md ring-2 ring-purple-500/20'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {profile.travelStyle === 'luxury' && (
              <span className="absolute top-3 right-3 text-[10px] font-bold bg-purple-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                Dipilih
              </span>
            )}
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
                <Crown className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Mewah / Luxury</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Pengalaman premium tanpa kompromi. Hotel resor bintang 5, santapan fine dining & restoran ternama, penerbangan kelas atas, dan private tour.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-purple-800 font-medium">
              ✓ Cadangan darurat: 15% • Resor 5-Star & Private Guide
            </div>
          </div>
        </div>
      </div>

      {/* Modal Bantuan Cek Harga Search Engine */}
      <SearchPriceModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </div>
  );
};
