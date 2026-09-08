import React, { useState } from 'react';
import { useTripContext } from '../context/TripContext';
import { 
  FlightClass, 
  TrainClass, 
  BusClass, 
  ShipClass, 
  CarOwnership, 
  CarType, 
  CarRentalType,
  TransportAddon 
} from '../types';
import { formatCurrency } from '../utils/currency';
import { FormattedNumberInput } from './FormattedNumberInput';
import { SectionNotesInput } from './SectionNotesInput';
import { 
  Plane, 
  Train, 
  Bus, 
  Car, 
  Ship, 
  Compass, 
  ArrowRightLeft, 
  ArrowRight, 
  Plus, 
  Trash2, 
  Fuel, 
  Key, 
  UserCheck, 
  Wrench, 
  ShieldCheck, 
  Check, 
  Info, 
  Sparkles,
  Luggage,
  Coffee,
  Armchair,
  FileCheck2,
  Navigation
} from 'lucide-react';

interface TransportCardProps {
  onOpenSearch?: () => void;
}

export const TransportCard: React.FC<TransportCardProps> = ({ onOpenSearch }) => {
  const { 
    state, 
    updateMainTransport, 
    addTransportAddon, 
    removeTransportAddon,
    updateSectionNote,
    calculations 
  } = useTripContext();

  const { mainTransport, profile } = state;
  const currency = profile.currency;
  const totalPeople = profile.adults + profile.children;

  // New custom addon inline form state
  const [newAddonName, setNewAddonName] = useState('');
  const [newAddonCost, setNewAddonCost] = useState<number | ''>('');
  const [newAddonIsPerPerson, setNewAddonIsPerPerson] = useState(true);
  const [isAddingCustomAddon, setIsAddingCustomAddon] = useState(false);

  const handleAddCustomAddon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddonName.trim() || !newAddonCost || Number(newAddonCost) <= 0) return;

    addTransportAddon({
      name: newAddonName.trim(),
      cost: Number(newAddonCost),
      isPerPerson: newAddonIsPerPerson,
      category: mainTransport.transportMode,
    });

    setNewAddonName('');
    setNewAddonCost('');
    setIsAddingCustomAddon(false);
  };

  const effectiveTicket = mainTransport.isSplitTicket
    ? (mainTransport.departureTicketPerPerson || 0) +
      (mainTransport.tripType === 'roundTrip' ? mainTransport.returnTicketPerPerson || 0 : 0)
    : mainTransport.ticketPricePerPerson || 0;

  const isCar = mainTransport.transportMode === 'mobil_pribadi';
  const carOwnership = mainTransport.carOwnership || 'pribadi';

  // Quick suggestion templates per mode
  const getSuggestions = () => {
    switch (mainTransport.transportMode) {
      case 'pesawat':
        return [
          { name: 'Pilih Kursi Favorit (Seat Selection)', cost: 65000, isPerPerson: true },
          { name: 'Makanan di Pesawat (In-flight Meal)', cost: 55000, isPerPerson: true },
          { name: 'Asuransi Keterlambatan Penerbangan', cost: 45000, isPerPerson: true },
          { name: 'Akses Airport Lounge', cost: 150000, isPerPerson: true },
        ];
      case 'kereta':
        return [
          { name: 'Makanan & Minuman Restorasi Kereta', cost: 45000, isPerPerson: true },
          { name: 'Sewa Bantal & Selimut Kereta', cost: 25000, isPerPerson: true },
          { name: 'Jasa Porter Angkut Koper di Stasiun', cost: 30000, isPerPerson: false },
        ];
      case 'bus':
        return [
          { name: 'Layanan Antar-Jemput (Shuttle Pick-up / Drop-off)', cost: 40000, isPerPerson: true },
          { name: 'Voucher Makan Rest Area / Prasmanan', cost: 35000, isPerPerson: true },
          { name: 'Biaya Bagasi Ekstra / Muatan Besar', cost: 50000, isPerPerson: false },
        ];
      case 'mobil_pribadi':
        if (carOwnership === 'pribadi') {
          return [
            { name: 'Cuci Mobil & Vacuum Pra-Jalan', cost: 60000, isPerPerson: false },
            { name: 'Kartu E-Toll Cadangan / Top-up Darurat', cost: 100000, isPerPerson: false },
            { name: 'Cairan Wiper & Tambal Tubeless Cadangan', cost: 50000, isPerPerson: false },
          ];
        } else {
          return [
            { name: 'Asuransi Kerusakan Mobil (CDW / All Risk)', cost: 75000, isPerPerson: false },
            { name: 'Biaya Antar-Ambil Mobil ke Bandara / Hotel', cost: 100000, isPerPerson: false },
            { name: 'Sewa Kursi Bayi (Child Seat)', cost: 50000, isPerPerson: false },
          ];
        }
      case 'kapal':
        return [
          { name: 'Sewa Kamar Tidur / Matras VIP di Kapal', cost: 150000, isPerPerson: true },
          { name: 'Voucher Kafetaria & Makan di Kapal', cost: 50000, isPerPerson: true },
          { name: 'Biaya Pas Masuk Terminal / Pelabuhan', cost: 20000, isPerPerson: true },
        ];
      default:
        return [
          { name: 'Biaya Layanan / Jasa Operator', cost: 50000, isPerPerson: false },
        ];
    }
  };

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      {/* Top Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            {mainTransport.transportMode === 'pesawat' && <Plane className="w-5 h-5" />}
            {mainTransport.transportMode === 'kereta' && <Train className="w-5 h-5" />}
            {mainTransport.transportMode === 'bus' && <Bus className="w-5 h-5" />}
            {mainTransport.transportMode === 'mobil_pribadi' && <Car className="w-5 h-5" />}
            {mainTransport.transportMode === 'kapal' && <Ship className="w-5 h-5" />}
            {mainTransport.transportMode === 'lainnya' && <Compass className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-slate-900">
                Input Manual Tiket & Moda Perjalanan
              </h3>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                100% Offline
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Rute: <strong>{profile.origin || 'Kota Asal'}</strong> ➔ <strong>{profile.destination || 'Kota Tujuan'}</strong> ({profile.type})
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-end sm:self-auto">
          {/* Trip Type Selector: PP vs Satu Arah */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => updateMainTransport({ tripType: 'roundTrip' })}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                mainTransport.tripType === 'roundTrip'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Pulang-Pergi (PP)</span>
            </button>
            <button
              type="button"
              onClick={() => updateMainTransport({ tripType: 'oneWay' })}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                mainTransport.tripType === 'oneWay'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>Satu Arah</span>
            </button>
          </div>

          <div className="text-right pl-2 border-l border-slate-200">
            <span className="text-[10px] text-slate-400 font-medium block">Total Transport</span>
            <span className="text-base font-extrabold text-blue-700">
              {formatCurrency(calculations.mainTransportTotal, currency)}
            </span>
          </div>
        </div>
      </div>

      {/* 1. Pemilihan Moda Transportasi */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-700">
          Pilih Moda Transportasi Utama:
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {[
            { id: 'pesawat', label: 'Pesawat', icon: Plane },
            { id: 'kereta', label: 'Kereta Api', icon: Train },
            { id: 'bus', label: 'Bus / Travel', icon: Bus },
            { id: 'mobil_pribadi', label: 'Mobil', icon: Car },
            { id: 'kapal', label: 'Kapal Laut', icon: Ship },
            { id: 'lainnya', label: 'Lainnya', icon: Compass },
          ].map((item) => {
            const IconComp = item.icon;
            const isSelected = mainTransport.transportMode === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => updateMainTransport({ transportMode: item.id as any })}
                className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center space-y-1.5 ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/80 text-blue-700 font-bold shadow-2xs ring-1 ring-blue-500/20'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <IconComp className="w-4 h-4" />
                <span className="text-[11px] truncate w-full">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Form Spesifik Sesuai Moda yang Dipilih */}

      {/* A. PESAWAT */}
      {mainTransport.transportMode === 'pesawat' && (
        <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/90 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-slate-800">
                Pilihan Kelas Kabin Penerbangan:
              </span>
              <p className="text-[11px] text-slate-500">Pilih kelas kursi untuk menandai rencana penerbangan Anda</p>
            </div>

            {/* Selector Kelas Pesawat */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'economy', label: 'Economy' },
                { id: 'premium_economy', label: 'Premium Economy' },
                { id: 'business', label: 'Business Class' },
                { id: 'first_class', label: 'First Class' },
              ].map((cls) => (
                <button
                  key={cls.id}
                  type="button"
                  onClick={() => updateMainTransport({ flightClass: cls.id as FlightClass })}
                  className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all ${
                    (mainTransport.flightClass || 'economy') === cls.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cls.label}
                </button>
              ))}
            </div>
          </div>

          {/* Opsi Pisah Tiket jika PP */}
          {mainTransport.tripType === 'roundTrip' && (
            <div className="flex items-center justify-between pt-1 border-t border-slate-200/70">
              <span className="text-xs text-slate-600 font-medium">Model Input Tiket Pulang-Pergi:</span>
              <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={mainTransport.isSplitTicket}
                  onChange={(e) => updateMainTransport({ isSplitTicket: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                />
                <span>Pisah harga tiket berangkat & tiket pulang (Beda maskapai/promo)</span>
              </label>
            </div>
          )}

          {/* Input Nominal Tiket Pesawat */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mainTransport.tripType === 'roundTrip' && mainTransport.isSplitTicket ? (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Harga Tiket Berangkat / Orang ({profile.origin || 'Asal'} ➔ {profile.destination || 'Tujuan'})
                  </label>
                  <div className="relative">
                    <FormattedNumberInput
                      value={mainTransport.departureTicketPerPerson || 0}
                      onChange={(val) =>
                        updateMainTransport({
                          departureTicketPerPerson: val,
                        })
                      }
                      className="w-full pl-3 pr-14 py-2.5 text-sm rounded-xl border border-slate-200 bg-white font-semibold focus:border-blue-500 outline-none"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">
                      {currency}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Harga Tiket Pulang / Orang ({profile.destination || 'Tujuan'} ➔ {profile.origin || 'Asal'})
                  </label>
                  <div className="relative">
                    <FormattedNumberInput
                      value={mainTransport.returnTicketPerPerson || 0}
                      onChange={(val) =>
                        updateMainTransport({
                          returnTicketPerPerson: val,
                        })
                      }
                      className="w-full pl-3 pr-14 py-2.5 text-sm rounded-xl border border-slate-200 bg-white font-semibold focus:border-blue-500 outline-none"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">
                      {currency}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {mainTransport.tripType === 'roundTrip'
                    ? 'Total Harga Tiket Pulang-Pergi (PP) / Orang'
                    : 'Harga Tiket Satu Arah (One-Way) / Orang'}
                </label>
                <div className="relative">
                  <FormattedNumberInput
                    value={mainTransport.ticketPricePerPerson || 0}
                    onChange={(val) =>
                      updateMainTransport({
                        ticketPricePerPerson: val,
                      })
                    }
                    className="w-full pl-3 pr-16 py-2.5 text-sm rounded-xl border border-slate-200 bg-white font-bold text-slate-900 focus:border-blue-500 outline-none"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-medium">
                    {currency} / org
                  </span>
                </div>
              </div>
            )}

            {/* Bagasi Tambahan / Orang */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alokasi Bagasi Berbayar Ekstra / Orang
              </label>
              <div className="relative">
                <FormattedNumberInput
                  value={mainTransport.baggageCostPerPerson || 0}
                  onChange={(val) =>
                    updateMainTransport({
                      baggageCostPerPerson: val,
                    })
                  }
                  className="w-full pl-3 pr-16 py-2.5 text-sm rounded-xl border border-slate-200 bg-white font-semibold focus:border-blue-500 outline-none"
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-medium">
                  {currency} / org
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Total bagasi rombongan: {formatCurrency(mainTransport.baggageCostPerPerson * totalPeople, currency)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* B. KERETA API */}
      {mainTransport.transportMode === 'kereta' && (
        <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/90 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-slate-800">
                Pilihan Kelas Kursi Kereta Api:
              </span>
              <p className="text-[11px] text-slate-500">Sesuaikan kelas gerbong (Ekonomi, Bisnis, Eksekutif, atau Sleeper)</p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'ekonomi', label: 'Ekonomi (AC / Reguler)' },
                { id: 'bisnis', label: 'Bisnis' },
                { id: 'eksekutif', label: 'Eksekutif' },
                { id: 'luxury_sleeper', label: 'Luxury / Sleeper' },
              ].map((cls) => (
                <button
                  key={cls.id}
                  type="button"
                  onClick={() => updateMainTransport({ trainClass: cls.id as TrainClass })}
                  className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all ${
                    (mainTransport.trainClass || 'eksekutif') === cls.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cls.label}
                </button>
              ))}
            </div>
          </div>

          {/* Opsi Pisah Tiket jika PP */}
          {mainTransport.tripType === 'roundTrip' && (
            <div className="flex items-center justify-between pt-1 border-t border-slate-200/70">
              <span className="text-xs text-slate-600 font-medium">Model Input Tiket Pulang-Pergi:</span>
              <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={mainTransport.isSplitTicket}
                  onChange={(e) => updateMainTransport({ isSplitTicket: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                />
                <span>Pisah harga tiket berangkat & tiket pulang</span>
              </label>
            </div>
          )}

          {/* Input Nominal Tiket Kereta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mainTransport.tripType === 'roundTrip' && mainTransport.isSplitTicket ? (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Harga Tiket Kereta Berangkat / Orang
                  </label>
                  <div className="relative">
                    <FormattedNumberInput
                      value={mainTransport.departureTicketPerPerson || 0}
                      onChange={(val) =>
                        updateMainTransport({
                          departureTicketPerPerson: val,
                        })
                      }
                      className="w-full pl-3 pr-14 py-2.5 text-sm rounded-xl border border-slate-200 bg-white font-semibold focus:border-blue-500 outline-none"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">
                      {currency}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Harga Tiket Kereta Pulang / Orang
                  </label>
                  <div className="relative">
                    <FormattedNumberInput
                      value={mainTransport.returnTicketPerPerson || 0}
                      onChange={(val) =>
                        updateMainTransport({
                          returnTicketPerPerson: val,
                        })
                      }
                      className="w-full pl-3 pr-14 py-2.5 text-sm rounded-xl border border-slate-200 bg-white font-semibold focus:border-blue-500 outline-none"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">
                      {currency}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {mainTransport.tripType === 'roundTrip'
                    ? 'Total Tiket Kereta Pulang-Pergi (PP) / Orang'
                    : 'Tiket Kereta Satu Arah (One-Way) / Orang'}
                </label>
                <div className="relative">
                  <FormattedNumberInput
                    value={mainTransport.ticketPricePerPerson || 0}
                    onChange={(val) =>
                      updateMainTransport({
                        ticketPricePerPerson: val,
                      })
                    }
                    className="w-full pl-3 pr-16 py-2.5 text-sm rounded-xl border border-slate-200 bg-white font-bold text-slate-900 focus:border-blue-500 outline-none"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-medium">
                    {currency} / org
                  </span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Biaya Porter / Bagasi Tambahan Kereta (Opsional)
              </label>
              <div className="relative">
                <FormattedNumberInput
                  value={mainTransport.baggageCostPerPerson || 0}
                  onChange={(val) =>
                    updateMainTransport({
                      baggageCostPerPerson: val,
                    })
                  }
                  className="w-full pl-3 pr-16 py-2.5 text-sm rounded-xl border border-slate-200 bg-white font-semibold focus:border-blue-500 outline-none"
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-medium">
                  {currency} / org
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Dikalikan {totalPeople} peserta = {formatCurrency(mainTransport.baggageCostPerPerson * totalPeople, currency)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* C. BUS / TRAVEL ANTAR-KOTA */}
      {mainTransport.transportMode === 'bus' && (
        <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/90 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-slate-800">
                Pilihan Kelas Armada Bus / Travel:
              </span>
              <p className="text-[11px] text-slate-500">Pilih tipe armada bus malam / shuttle antar-kota</p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'ekonomi', label: 'Ekonomi / Reguler' },
                { id: 'vip_executive', label: 'VIP / Bisnis' },
                { id: 'super_executive', label: 'Super Eksekutif' },
                { id: 'sleeper', label: 'Sleeper Bus' },
                { id: 'shuttle_travel', label: 'Shuttle Door-to-Door' },
              ].map((cls) => (
                <button
                  key={cls.id}
                  type="button"
                  onClick={() => updateMainTransport({ busClass: cls.id as BusClass })}
                  className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all ${
                    (mainTransport.busClass || 'vip_executive') === cls.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cls.label}
                </button>
              ))}
            </div>
          </div>

          {/* Opsi Pisah Tiket jika PP */}
          {mainTransport.tripType === 'roundTrip' && (
            <div className="flex items-center justify-between pt-1 border-t border-slate-200/70">
              <span className="text-xs text-slate-600 font-medium">Model Input Tiket Pulang-Pergi:</span>
              <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={mainTransport.isSplitTicket}
                  onChange={(e) => updateMainTransport({ isSplitTicket: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                />
                <span>Pisah harga tiket berangkat & tiket pulang</span>
              </label>
            </div>
          )}

          {/* Input Nominal Tiket Bus */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mainTransport.tripType === 'roundTrip' && mainTransport.isSplitTicket ? (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Harga Tiket Bus Berangkat / Orang
                  </label>
                  <div className="relative">
                    <FormattedNumberInput
                      value={mainTransport.departureTicketPerPerson || 0}
                      onChange={(val) =>
                        updateMainTransport({
                          departureTicketPerPerson: val,
                        })
                      }
                      className="w-full pl-3 pr-14 py-2.5 text-sm rounded-xl border border-slate-200 bg-white font-semibold focus:border-blue-500 outline-none"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">
                      {currency}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Harga Tiket Bus Pulang / Orang
                  </label>
                  <div className="relative">
                    <FormattedNumberInput
                      value={mainTransport.returnTicketPerPerson || 0}
                      onChange={(val) =>
                        updateMainTransport({
                          returnTicketPerPerson: val,
                        })
                      }
                      className="w-full pl-3 pr-14 py-2.5 text-sm rounded-xl border border-slate-200 bg-white font-semibold focus:border-blue-500 outline-none"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">
                      {currency}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {mainTransport.tripType === 'roundTrip'
                    ? 'Total Tiket Bus Pulang-Pergi (PP) / Orang'
                    : 'Tiket Bus Satu Arah (One-Way) / Orang'}
                </label>
                <div className="relative">
                  <FormattedNumberInput
                    value={mainTransport.ticketPricePerPerson || 0}
                    onChange={(val) =>
                      updateMainTransport({
                        ticketPricePerPerson: val,
                      })
                    }
                    className="w-full pl-3 pr-16 py-2.5 text-sm rounded-xl border border-slate-200 bg-white font-bold text-slate-900 focus:border-blue-500 outline-none"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-medium">
                    {currency} / org
                  </span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Biaya Bagasi Ekstra / Drop-off Point
              </label>
              <div className="relative">
                <FormattedNumberInput
                  value={mainTransport.baggageCostPerPerson || 0}
                  onChange={(val) =>
                    updateMainTransport({
                      baggageCostPerPerson: val,
                    })
                  }
                  className="w-full pl-3 pr-16 py-2.5 text-sm rounded-xl border border-slate-200 bg-white font-semibold focus:border-blue-500 outline-none"
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-medium">
                  {currency} / org
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Dikalikan {totalPeople} peserta = {formatCurrency(mainTransport.baggageCostPerPerson * totalPeople, currency)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* D. MOBIL (PRIBADI VS SEWA) */}
      {mainTransport.transportMode === 'mobil_pribadi' && (
        <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/90 space-y-5">
          {/* Sub-Switch: Mobil Pribadi vs Rental / Sewa */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/70 pb-3">
            <div>
              <span className="text-xs font-bold text-slate-900">
                Pilihan Kepemilikan Mobil:
              </span>
              <p className="text-[11px] text-slate-500">
                Pilih apakah menggunakan kendaraan pribadi keluarga atau merental mobil
              </p>
            </div>

            <div className="flex items-center p-1 bg-white border border-slate-200 rounded-xl text-xs font-bold shadow-2xs">
              <button
                type="button"
                onClick={() => updateMainTransport({ carOwnership: 'pribadi' })}
                className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                  carOwnership === 'pribadi'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                <span>Mobil Pribadi</span>
              </button>
              <button
                type="button"
                onClick={() => updateMainTransport({ carOwnership: 'sewa' })}
                className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                  carOwnership === 'sewa'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Key className="w-3.5 h-3.5" />
                <span>Rental / Sewa Mobil</span>
              </button>
            </div>
          </div>

          {/* D.1 JIKA MOBIL PRIBADI */}
          {carOwnership === 'pribadi' && (
            <div className="space-y-4 animate-fade-in">
              {/* Pilihan Tipe Mobil Pribadi */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Tipe Kendaraan Mobil Pribadi:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'city_car', label: 'City Car / LCGC' },
                    { id: 'mpv_suv', label: 'MPV / SUV Keluarga' },
                    { id: 'ev', label: 'Mobil Listrik (EV)' },
                    { id: 'diesel', label: 'Diesel / Heavy SUV' },
                    { id: 'lainnya', label: 'Lainnya' },
                  ].map((ct) => (
                    <button
                      key={ct.id}
                      type="button"
                      onClick={() => updateMainTransport({ carType: ct.id as CarType })}
                      className={`px-2.5 py-2 text-xs rounded-xl border font-semibold text-center transition-all ${
                        (mainTransport.carType || 'mpv_suv') === ct.id
                          ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-2xs font-bold'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {ct.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rincian Pos Biaya Mobil Pribadi (Input Manual) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
                {/* 1. Bensin / BBM */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                    <Fuel className="w-3.5 h-3.5 text-amber-600" />
                    <span>Estimasi Bensin / BBM</span>
                  </label>
                  <div className="relative">
                    <FormattedNumberInput
                      value={mainTransport.carFuelCost || 0}
                      onChange={(val) =>
                        updateMainTransport({ carFuelCost: val })
                      }
                      className="w-full pl-3 pr-12 py-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold focus:border-blue-500 outline-none"
                    />
                    <span className="absolute right-2.5 top-2 text-[11px] text-slate-400 font-medium">
                      {currency}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Total rute PP/One-way</p>
                </div>

                {/* 2. Biaya Tol */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                    <Navigation className="w-3.5 h-3.5 text-blue-600" />
                    <span>Total Tarif E-Toll</span>
                  </label>
                  <div className="relative">
                    <FormattedNumberInput
                      value={mainTransport.carTollCost || 0}
                      onChange={(val) =>
                        updateMainTransport({ carTollCost: val })
                      }
                      className="w-full pl-3 pr-12 py-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold focus:border-blue-500 outline-none"
                    />
                    <span className="absolute right-2.5 top-2 text-[11px] text-slate-400 font-medium">
                      {currency}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Tol Trans/Luar Kota</p>
                </div>

                {/* 3. Parkir & Retribusi */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                    <span>🅿️ Parkir & Retribusi</span>
                  </label>
                  <div className="relative">
                    <FormattedNumberInput
                      value={mainTransport.carParkingCost || 0}
                      onChange={(val) =>
                        updateMainTransport({ carParkingCost: val })
                      }
                      className="w-full pl-3 pr-12 py-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold focus:border-blue-500 outline-none"
                    />
                    <span className="absolute right-2.5 top-2 text-[11px] text-slate-400 font-medium">
                      {currency}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Destinasi, hotel, & spot</p>
                </div>

                {/* 4. Servis Pra-Jalan */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                    <Wrench className="w-3.5 h-3.5 text-slate-600" />
                    <span>Servis Pra-Jalan / Cek Oli</span>
                  </label>
                  <div className="relative">
                    <FormattedNumberInput
                      value={mainTransport.carMaintenanceCost || 0}
                      onChange={(val) =>
                        updateMainTransport({ carMaintenanceCost: val })
                      }
                      className="w-full pl-3 pr-12 py-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold focus:border-blue-500 outline-none"
                    />
                    <span className="absolute right-2.5 top-2 text-[11px] text-slate-400 font-medium">
                      {currency}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Tune-up, oli, tekanan ban</p>
                </div>
              </div>
            </div>
          )}

          {/* D.2 JIKA RENTAL / SEWA MOBIL */}
          {carOwnership === 'sewa' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Opsi Lepas Kunci vs Dengan Supir */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pilihan Paket Rental:
                  </label>
                  <div className="inline-flex p-1 bg-white border border-slate-200 rounded-xl text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => updateMainTransport({ rentalType: 'lepas_kunci' })}
                      className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                        (mainTransport.rentalType || 'lepas_kunci') === 'lepas_kunci'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Key className="w-3.5 h-3.5" />
                      <span>Lepas Kunci (Self-Drive)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => updateMainTransport({ rentalType: 'dengan_supir' })}
                      className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                        mainTransport.rentalType === 'dengan_supir'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Dengan Supir (Driver)</span>
                    </button>
                  </div>
                </div>

                {/* Model Mobil */}
                <div className="w-full sm:w-60">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Model / Seri Mobil Sewa
                  </label>
                  <input
                    type="text"
                    value={mainTransport.rentalCarModel || ''}
                    onChange={(e) => updateMainTransport({ rentalCarModel: e.target.value })}
                    placeholder="Contoh: Avanza / Innova / HiAce"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Rincian Pos Biaya Rental Mobil (Input Manual) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
                {/* Tarif Sewa per Hari */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tarif Sewa Mobil / Hari
                  </label>
                  <div className="relative">
                    <FormattedNumberInput
                      value={mainTransport.rentalDailyRate || 0}
                      onChange={(val) =>
                        updateMainTransport({ rentalDailyRate: val })
                      }
                      className="w-full pl-3 pr-12 py-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold focus:border-blue-500 outline-none"
                    />
                    <span className="absolute right-2.5 top-2 text-[11px] text-slate-400 font-medium">
                      {currency}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    x {mainTransport.rentalDays ?? profile.durationDays ?? 0} hari = {formatCurrency((mainTransport.rentalDailyRate || 0) * (mainTransport.rentalDays ?? profile.durationDays ?? 0), currency)}
                  </p>
                </div>

                {/* Durasi Hari Sewa */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Durasi Sewa (Hari)
                  </label>
                  <FormattedNumberInput
                    value={mainTransport.rentalDays ?? profile.durationDays ?? 0}
                    onChange={(val) =>
                      updateMainTransport({ rentalDays: Math.max(0, val) })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold focus:border-blue-500 outline-none"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Standar sesuai durasi trip</p>
                </div>

                {/* Uang Makan & Tips Supir (Jika Dengan Supir) */}
                {mainTransport.rentalType === 'dengan_supir' ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Uang Makan & Tips Supir / Hari
                    </label>
                    <div className="relative">
                      <FormattedNumberInput
                        value={mainTransport.rentalDriverAllowanceDaily || 0}
                        onChange={(val) =>
                          updateMainTransport({
                            rentalDriverAllowanceDaily: val,
                          })
                        }
                        className="w-full pl-3 pr-12 py-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold focus:border-blue-500 outline-none"
                      />
                      <span className="absolute right-2.5 top-2 text-[11px] text-slate-400 font-medium">
                        {currency}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Total: {formatCurrency((mainTransport.rentalDriverAllowanceDaily || 0) * (mainTransport.rentalDays ?? profile.durationDays ?? 0), currency)}
                    </p>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Jaminan Deposit Sewa (Refundable)
                    </label>
                    <div className="relative">
                      <FormattedNumberInput
                        value={mainTransport.rentalDeposit || 0}
                        onChange={(val) =>
                          updateMainTransport({
                            rentalDeposit: val,
                          })
                        }
                        className="w-full pl-3 pr-12 py-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold focus:border-blue-500 outline-none"
                      />
                      <span className="absolute right-2.5 top-2 text-[11px] text-slate-400 font-medium">
                        {currency}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">Dikembalikan pasca sewa</p>
                  </div>
                )}

                {/* Estimasi Bensin & Tol Mobil Sewa */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Bensin & Tol Mobil Sewa
                  </label>
                  <div className="relative">
                    <FormattedNumberInput
                      value={mainTransport.rentalFuelCost || 0}
                      onChange={(val) =>
                        updateMainTransport({
                          rentalFuelCost: val,
                        })
                      }
                      className="w-full pl-3 pr-12 py-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold focus:border-blue-500 outline-none"
                    />
                    <span className="absolute right-2.5 top-2 text-[11px] text-slate-400 font-medium">
                      {currency}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Alokasi BBM rute liburan</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* E. KAPAL LAUT */}
      {mainTransport.transportMode === 'kapal' && (
        <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/90 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-slate-800">
                Pilihan Kelas Kursi / Kabin Kapal Laut:
              </span>
              <p className="text-[11px] text-slate-500">Sesuaikan kelas tiket kapal (Ferry penyeberangan / Pelni / Cruise)</p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'ekonomi', label: 'Ekonomi (Duduk / Dek)' },
                { id: 'tatami', label: 'Tatami / Matras' },
                { id: 'kabin_2', label: 'Kabin Kelas 2' },
                { id: 'kabin_1', label: 'Kabin Kelas 1 (Private)' },
                { id: 'vip', label: 'VIP / Suite Stateroom' },
                { id: 'kendaraan', label: 'Tiket Kendaraan' },
              ].map((cls) => (
                <button
                  key={cls.id}
                  type="button"
                  onClick={() => updateMainTransport({ shipClass: cls.id as ShipClass })}
                  className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all ${
                    (mainTransport.shipClass || 'ekonomi') === cls.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cls.label}
                </button>
              ))}
            </div>
          </div>

          {/* Opsi Pisah Tiket jika PP */}
          {mainTransport.tripType === 'roundTrip' && (
            <div className="flex items-center justify-between pt-1 border-t border-slate-200/70">
              <span className="text-xs text-slate-600 font-medium">Model Input Tiket Pulang-Pergi:</span>
              <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={mainTransport.isSplitTicket}
                  onChange={(e) => updateMainTransport({ isSplitTicket: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                />
                <span>Pisah harga tiket berangkat & tiket pulang</span>
              </label>
            </div>
          )}

          {/* Input Nominal Tiket Kapal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mainTransport.tripType === 'roundTrip' && mainTransport.isSplitTicket ? (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Harga Tiket Kapal Berangkat / Orang
                  </label>
                  <div className="relative">
                    <FormattedNumberInput
                      value={mainTransport.departureTicketPerPerson || 0}
                      onChange={(val) =>
                        updateMainTransport({
                          departureTicketPerPerson: val,
                        })
                      }
                      className="w-full pl-3 pr-14 py-2.5 text-sm rounded-xl border border-slate-200 bg-white font-semibold focus:border-blue-500 outline-none"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">
                      {currency}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Harga Tiket Kapal Pulang / Orang
                  </label>
                  <div className="relative">
                    <FormattedNumberInput
                      value={mainTransport.returnTicketPerPerson || 0}
                      onChange={(val) =>
                        updateMainTransport({
                          returnTicketPerPerson: val,
                        })
                      }
                      className="w-full pl-3 pr-14 py-2.5 text-sm rounded-xl border border-slate-200 bg-white font-semibold focus:border-blue-500 outline-none"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">
                      {currency}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {mainTransport.tripType === 'roundTrip'
                    ? 'Total Tiket Kapal Pulang-Pergi (PP) / Orang'
                    : 'Tiket Kapal Satu Arah (One-Way) / Orang'}
                </label>
                <div className="relative">
                  <FormattedNumberInput
                    value={mainTransport.ticketPricePerPerson || 0}
                    onChange={(val) =>
                      updateMainTransport({
                        ticketPricePerPerson: val,
                      })
                    }
                    className="w-full pl-3 pr-16 py-2.5 text-sm rounded-xl border border-slate-200 bg-white font-bold text-slate-900 focus:border-blue-500 outline-none"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-medium">
                    {currency} / org
                  </span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Biaya Pas Pelabuhan / Bagasi Kendaraan
              </label>
              <div className="relative">
                <FormattedNumberInput
                  value={mainTransport.baggageCostPerPerson || 0}
                  onChange={(val) =>
                    updateMainTransport({
                      baggageCostPerPerson: val,
                    })
                  }
                  className="w-full pl-3 pr-16 py-2.5 text-sm rounded-xl border border-slate-200 bg-white font-semibold focus:border-blue-500 outline-none"
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-medium">
                  {currency} / org
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Dikalikan {totalPeople} peserta = {formatCurrency(mainTransport.baggageCostPerPerson * totalPeople, currency)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* F. LAINNYA */}
      {mainTransport.transportMode === 'lainnya' && (
        <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/90 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Biaya Transportasi Kustom Lainnya / Orang
            </label>
            <div className="relative">
              <FormattedNumberInput
                value={mainTransport.ticketPricePerPerson || 0}
                onChange={(val) =>
                  updateMainTransport({
                    ticketPricePerPerson: val,
                  })
                }
                className="w-full pl-3 pr-16 py-2.5 text-sm rounded-xl border border-slate-200 bg-white font-bold text-slate-900 focus:border-blue-500 outline-none"
              />
              <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-medium">
                {currency} / org
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. ADD-ON TRANSPORTASI & LAYANAN TAMBAHAN (INPUT MANUAL NAMA & HARGA) */}
      <div className="border-t border-slate-100 pt-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Add-on & Layanan Tambahan (Input Manual Nama & Harga)</span>
            </h4>
            <p className="text-[11px] text-slate-500">
              Tambahkan layanan ekstra seperti pilih kursi, makanan, asuransi, atau pos biaya kustom Anda
            </p>
          </div>

          {/* Quick suggestions pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] text-slate-400 font-semibold">Saran Cepat:</span>
            {getSuggestions().slice(0, 3).map((sug, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => addTransportAddon(sug)}
                className="text-[11px] bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200/80 transition-colors flex items-center space-x-1"
                title={`Tambah ${sug.name} (${formatCurrency(sug.cost, currency)})`}
              >
                <Plus className="w-2.5 h-2.5" />
                <span className="truncate max-w-[130px]">{sug.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Daftar Add-on yang Sudah Ditambahkan */}
        {mainTransport.addons && mainTransport.addons.length > 0 && (
          <div className="space-y-2 pt-1">
            {mainTransport.addons.map((addon) => {
              const subtotal = addon.isPerPerson ? addon.cost * totalPeople : addon.cost;
              return (
                <div
                  key={addon.id}
                  className="p-2.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-2 shadow-2xs hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                    <span className="text-xs font-semibold text-slate-800">{addon.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                      {addon.isPerPerson ? `x${totalPeople} Peserta` : 'Per Rombongan'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-900">
                        {formatCurrency(subtotal, currency)}
                      </span>
                      {addon.isPerPerson && (
                        <span className="text-[10px] text-slate-400 block">
                          ({formatCurrency(addon.cost, currency)} / org)
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTransportAddon(addon.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Hapus add-on"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Form Input Manual Tambah Add-on Baru */}
        {isAddingCustomAddon ? (
          <form
            onSubmit={handleAddCustomAddon}
            className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-2.5 animate-fade-in"
          >
            <div className="text-xs font-bold text-indigo-950">Input Manual Add-on Baru</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                  Nama Add-on / Layanan
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Seat Selection Baris Depan / Snack Box"
                  value={newAddonName}
                  onChange={(e) => setNewAddonName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                  Nominal Biaya ({currency})
                </label>
                <FormattedNumberInput
                  value={typeof newAddonCost === 'number' ? newAddonCost : 0}
                  onChange={(val) => setNewAddonCost(val)}
                  placeholder="Nominal biaya"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-semibold focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
              <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newAddonIsPerPerson}
                  onChange={(e) => setNewAddonIsPerPerson(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                />
                <span>Dikalikan per jumlah orang ({totalPeople} peserta)</span>
              </label>

              <div className="flex items-center space-x-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => setIsAddingCustomAddon(false)}
                  className="px-3 py-1 text-xs font-semibold rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-xs"
                >
                  Simpan Add-on
                </button>
              </div>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setIsAddingCustomAddon(true)}
            className="w-full py-2 border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/20 rounded-xl text-xs font-bold text-slate-600 hover:text-indigo-700 transition-all flex items-center justify-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Tambah Add-on Manual Sendiri (Bebas Nama & Harga)</span>
          </button>
        )}
      </div>

      {/* 4. Rangkuman Biaya Transportasi */}
      <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="space-y-0.5">
          <span className="font-bold text-slate-900 block">
            Rangkuman Transportasi ({mainTransport.transportMode.toUpperCase()})
          </span>
          <span className="text-slate-600">
            {isCar
              ? carOwnership === 'pribadi'
                ? `Mobil Pribadi (${mainTransport.carType || 'MPV'}) • Bensin, Tol, Parkir & Servis`
                : `Rental Mobil (${mainTransport.rentalCarModel || 'Mobil'}) • ${mainTransport.rentalType === 'dengan_supir' ? 'Dengan Supir' : 'Lepas Kunci'} (${mainTransport.rentalDays ?? profile.durationDays ?? 0} Hari)`
              : `Tiket ${mainTransport.tripType === 'roundTrip' ? 'PP' : 'Satu Arah'} (${totalPeople} Peserta × ${formatCurrency(effectiveTicket, currency)}) + Bagasi & Add-on`}
          </span>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-500 font-medium block">Total Transportasi Utama</span>
          <span className="font-extrabold text-blue-700 text-base">
            {formatCurrency(calculations.mainTransportTotal, currency)}
          </span>
        </div>
      </div>

      {/* Catatan Khusus Section Transportasi */}
      <SectionNotesInput
        value={state.notes?.mainTransport || ''}
        onChange={(val) => updateSectionNote('mainTransport', val)}
        placeholder="Contoh: Tiket promo maskapai Garuda, jatah bagasi 20kg, transit 2 jam di KLIA, sewa mobil diantar ke bandara..."
      />
    </div>
  );
};
