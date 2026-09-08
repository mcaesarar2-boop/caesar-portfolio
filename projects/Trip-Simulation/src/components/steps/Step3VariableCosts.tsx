import React, { useState } from 'react';
import { useTripContext } from '../../context/TripContext';
import { formatCurrency } from '../../utils/currency';
import { FormattedNumberInput } from '../FormattedNumberInput';
import { SectionNotesInput } from '../SectionNotesInput';
import { ActivityItem } from '../../types';
import { 
  Utensils, 
  Car, 
  Ticket, 
  Wifi, 
  CalendarCheck, 
  Info, 
  Coffee, 
  Compass, 
  Fuel,
  Users,
  Pencil,
  Trash2,
  Plus,
  Check,
  X,
  Calendar,
  Sparkles
} from 'lucide-react';

export const Step3VariableCosts: React.FC = () => {
  const { 
    state, 
    updateMeals, 
    updateLocalTransport, 
    updateActivities, 
    addActivityItem,
    updateActivityItem,
    removeActivityItem,
    updateTelecom,
    updateSectionNote,
    calculations 
  } = useTripContext();

  const { dailyCosts, profile } = state;
  const currency = profile.currency;
  const days = profile.durationDays;
  const adults = profile.adults;
  const children = profile.children;
  const totalPeople = adults + children;
  const effectiveFoodPeople = adults + children * 0.5;

  // New ticket state
  const [isAddingTicket, setIsAddingTicket] = useState(false);
  const [newTicketName, setNewTicketName] = useState('');
  const [newTicketCost, setNewTicketCost] = useState<number | ''>('');
  const [newTicketTarget, setNewTicketTarget] = useState<'per_person' | 'adult_only' | 'child_only' | 'group'>('per_person');
  const [newTicketFollowDuration, setNewTicketFollowDuration] = useState(false);
  const [newTicketDaysCount, setNewTicketDaysCount] = useState<number>(1);

  // Edit ticket state
  const [editingTicketId, setEditingTicketId] = useState<string | null>(null);
  const [editTicketName, setEditTicketName] = useState('');
  const [editTicketCost, setEditTicketCost] = useState<number | ''>('');
  const [editTicketTarget, setEditTicketTarget] = useState<'per_person' | 'adult_only' | 'child_only' | 'group'>('per_person');
  const [editTicketFollowDuration, setEditTicketFollowDuration] = useState(false);
  const [editTicketDaysCount, setEditTicketDaysCount] = useState<number>(1);

  const startEditingTicket = (item: ActivityItem) => {
    setEditingTicketId(item.id);
    setEditTicketName(item.name);
    setEditTicketCost(item.cost);
    setEditTicketTarget(item.target);
    setEditTicketFollowDuration(item.followTripDuration || false);
    setEditTicketDaysCount(item.daysCount || 1);
  };

  const cancelEditingTicket = () => {
    setEditingTicketId(null);
    setEditTicketName('');
    setEditTicketCost('');
  };

  const saveEditingTicket = (id: string) => {
    if (!editTicketName.trim() || !editTicketCost || Number(editTicketCost) <= 0) return;
    updateActivityItem(id, {
      name: editTicketName.trim(),
      cost: Number(editTicketCost),
      target: editTicketTarget,
      followTripDuration: editTicketFollowDuration,
      daysCount: editTicketFollowDuration ? days : Math.max(1, editTicketDaysCount || 1),
    });
    setEditingTicketId(null);
  };

  const handleAddTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketName.trim() || !newTicketCost || Number(newTicketCost) <= 0) return;

    addActivityItem({
      name: newTicketName.trim(),
      cost: Number(newTicketCost),
      target: newTicketTarget,
      followTripDuration: newTicketFollowDuration,
      daysCount: newTicketFollowDuration ? days : Math.max(1, newTicketDaysCount || 1),
    });

    setNewTicketName('');
    setNewTicketCost('');
    setNewTicketTarget('per_person');
    setNewTicketFollowDuration(false);
    setNewTicketDaysCount(1);
    setIsAddingTicket(false);
  };

  const quickTicketSuggestions = [
    { name: 'Tiket Theme Park / Hiburan (1 Hari)', cost: 450000, target: 'per_person' as const, followDuration: false },
    { name: 'Tiket Cagar Budaya / Museum', cost: 85000, target: 'per_person' as const, followDuration: false },
    { name: 'Paket Snorkeling / Wisata Bahari', cost: 250000, target: 'per_person' as const, followDuration: false },
    { name: 'Jasa Tour Guide Lokal Khusus (1 Hari)', cost: 350000, target: 'group' as const, followDuration: false },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Step Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center space-x-2 text-blue-600 font-semibold text-xs tracking-wider uppercase mb-1">
          <CalendarCheck className="w-4 h-4" />
          <span>Tahap 3 dari 5 • Variable & Daily Expenses</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Biaya Harian & Pengeluaran Itinerary
        </h2>
        <p className="text-slate-600 text-sm mt-1">
          Dihitung otomatis: <em>(Tarif Harian × Durasi {days} Hari × Peserta yang Relevan)</em>. Porsi makan anak dihitung 50% dari orang dewasa.
        </p>
      </div>

      {/* Bagian 1: Konsumsi (F&B) */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Konsumsi & Kuliner (F&B) / Dewasa / Hari</h3>
              <p className="text-xs text-slate-500">
                Alokasi per orang dewasa per hari. Anak-anak otomatis dihitung 50% porsi.
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[11px] text-slate-500 font-medium block">Total F&B ({days} Hari)</span>
            <span className="text-base font-extrabold text-amber-600">
              {formatCurrency(calculations.dailyMealsTotal, currency)}
            </span>
          </div>
        </div>

        {/* Input 4 waktu makan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Sarapan (Breakfast)</span>
              <span className="text-[10px] text-slate-400">/org/hari</span>
            </label>
            <div className="relative">
              <FormattedNumberInput
                value={dailyCosts.meals.breakfastPerAdult}
                onChange={(val) =>
                  updateMeals({ breakfastPerAdult: val })
                }
                className="w-full pl-3.5 pr-12 py-2 text-sm rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none font-semibold"
              />
              <span className="absolute right-3 top-2 text-xs text-slate-400 font-medium">
                {currency}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Makan Siang (Lunch)</span>
              <span className="text-[10px] text-slate-400">/org/hari</span>
            </label>
            <div className="relative">
              <FormattedNumberInput
                value={dailyCosts.meals.lunchPerAdult}
                onChange={(val) =>
                  updateMeals({ lunchPerAdult: val })
                }
                className="w-full pl-3.5 pr-12 py-2 text-sm rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none font-semibold"
              />
              <span className="absolute right-3 top-2 text-xs text-slate-400 font-medium">
                {currency}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Makan Malam (Dinner)</span>
              <span className="text-[10px] text-slate-400">/org/hari</span>
            </label>
            <div className="relative">
              <FormattedNumberInput
                value={dailyCosts.meals.dinnerPerAdult}
                onChange={(val) =>
                  updateMeals({ dinnerPerAdult: val })
                }
                className="w-full pl-3.5 pr-12 py-2 text-sm rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none font-semibold"
              />
              <span className="absolute right-3 top-2 text-xs text-slate-400 font-medium">
                {currency}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Ekstra (Kopi / Snack)</span>
              <span className="text-[10px] text-slate-400">/org/hari</span>
            </label>
            <div className="relative">
              <FormattedNumberInput
                value={dailyCosts.meals.snacksAndCoffeePerAdult}
                onChange={(val) =>
                  updateMeals({ snacksAndCoffeePerAdult: val })
                }
                className="w-full pl-3.5 pr-12 py-2 text-sm rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none font-semibold"
              />
              <span className="absolute right-3 top-2 text-xs text-slate-400 font-medium">
                {currency}
              </span>
            </div>
          </div>
        </div>

        {/* Kalkulasi rumus F&B */}
        <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/80 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Coffee className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Kalkulasi: (
              {formatCurrency(
                dailyCosts.meals.breakfastPerAdult +
                  dailyCosts.meals.lunchPerAdult +
                  dailyCosts.meals.dinnerPerAdult +
                  dailyCosts.meals.snacksAndCoffeePerAdult,
                currency
              )}
              /hari) × {effectiveFoodPeople} porsi efektif ({adults} Dewasa + {children} Anak @50%) × {days} Hari
            </span>
          </div>
          <span className="font-bold text-amber-800 shrink-0">
            = {formatCurrency(calculations.dailyMealsTotal, currency)}
          </span>
        </div>

        {/* Catatan Konsumsi / F&B */}
        <SectionNotesInput
          value={state.notes?.meals || ''}
          onChange={(val) => updateSectionNote('meals', val)}
          placeholder="Contoh: Sarapan sudah include di hotel, makan siang kulineran lokal, makan malam budget fleksibel..."
        />
      </div>

      {/* Bagian 2: Transportasi Lokal Harian */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Transportasi Lokal Selama di Destinasi</h3>
              <p className="text-xs text-slate-500">Sewa kendaraan harian (mobil/motor) & bensin/tiket MRT/transum</p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[11px] text-slate-500 font-medium block">Total Transport Lokal ({days} Hari)</span>
            <span className="text-base font-extrabold text-blue-700">
              {formatCurrency(calculations.dailyLocalTransportTotal, currency)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Biaya Sewa Kendaraan / Hari (Mobil / Motor)
            </label>
            <div className="relative">
              <FormattedNumberInput
                value={dailyCosts.localTransport.vehicleRentalDaily}
                onChange={(val) =>
                  updateLocalTransport({ vehicleRentalDaily: val })
                }
                className="w-full pl-3.5 pr-14 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none font-semibold"
              />
              <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-medium">
                {currency}/hari
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Total {days} hari = {formatCurrency(dailyCosts.localTransport.vehicleRentalDaily * days, currency)}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Bensin, Tol, Parkir, atau Tiket Kereta/Metro / Hari
            </label>
            <div className="relative">
              <FormattedNumberInput
                value={dailyCosts.localTransport.fuelOrTransitDaily}
                onChange={(val) =>
                  updateLocalTransport({ fuelOrTransitDaily: val })
                }
                className="w-full pl-3.5 pr-14 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none font-semibold"
              />
              <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-medium">
                {currency}/hari
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Total {days} hari = {formatCurrency(dailyCosts.localTransport.fuelOrTransitDaily * days, currency)}
            </p>
          </div>
        </div>

        {/* Catatan Transportasi Lokal */}
        <SectionNotesInput
          value={state.notes?.localTransport || ''}
          onChange={(val) => updateSectionNote('localTransport', val)}
          placeholder="Contoh: Sewa Avanza lepas kunci 3 hari, bensin pertalite, estimasi tol Trans Jawa..."
        />
      </div>

      {/* Bagian 3: Aktivitas, Tiket Masuk & Objek Wisata */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Aktivitas, Wisata & Tiket Masuk</h3>
              <p className="text-xs text-slate-500">
                Tiket masuk objek wisata (theme park, cagar budaya, museum), atraksi, & tour guide (bisa 1x masuk atau harian)
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[11px] text-slate-500 font-medium block">Total Aktivitas & Wisata</span>
            <span className="text-base font-extrabold text-indigo-700">
              {formatCurrency(calculations.dailyActivitiesTotal, currency)}
            </span>
          </div>
        </div>

        {/* 1. Tiket & Objek Wisata Spesifik Terdaftar (Nama & Harga Manual, Bebas Edit) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Daftar Tiket & Atraksi Wisata Spesifik:</span>
            </h4>
            <span className="text-[11px] text-slate-500">
              {(dailyCosts.activities.items || []).length} atraksi ditambahkan
            </span>
          </div>

          {/* Quick Presets for fast adding */}
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[10px] text-slate-400 font-semibold self-center mr-1">Rekomendasi Cepat:</span>
            {quickTicketSuggestions.map((sug, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  addActivityItem({
                    name: sug.name,
                    cost: sug.cost,
                    target: sug.target,
                    followTripDuration: sug.followDuration,
                    daysCount: 1,
                  });
                }}
                className="text-[11px] font-medium px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-all flex items-center space-x-1 shadow-2xs"
              >
                <Plus className="w-3 h-3 text-indigo-500" />
                <span>{sug.name} ({formatCurrency(sug.cost, currency)})</span>
              </button>
            ))}
          </div>

          {/* List of Custom Ticket Items */}
          {dailyCosts.activities.items && dailyCosts.activities.items.length > 0 && (
            <div className="space-y-2 pt-1">
              {dailyCosts.activities.items.map((item) => {
                const multiplier = item.followTripDuration ? days : Math.max(1, item.daysCount || 1);
                let count = 1;
                let targetLabel = 'Lump Sum (Rombongan)';
                if (item.target === 'per_person') {
                  count = totalPeople;
                  targetLabel = `x${totalPeople} Peserta`;
                } else if (item.target === 'adult_only') {
                  count = adults;
                  targetLabel = `x${adults} Dewasa`;
                } else if (item.target === 'child_only') {
                  count = children;
                  targetLabel = `x${children} Anak`;
                }

                const subtotal = item.cost * count * multiplier;

                if (editingTicketId === item.id) {
                  return (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl border-2 border-indigo-300 bg-indigo-50/50 space-y-3 animate-fade-in"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-indigo-950">
                        <span>Edit Tiket / Objek Wisata</span>
                        <button
                          type="button"
                          onClick={cancelEditingTicket}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-1">
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Nama Tiket / Tempat Wisata
                          </label>
                          <input
                            type="text"
                            value={editTicketName}
                            onChange={(e) => setEditTicketName(e.target.value)}
                            placeholder="Contoh: Tiket Universal Studios"
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:border-indigo-500 outline-none font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Harga Satuan ({currency})
                          </label>
                          <FormattedNumberInput
                            value={typeof editTicketCost === 'number' ? editTicketCost : 0}
                            onChange={(val) => setEditTicketCost(val)}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:border-indigo-500 outline-none font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Target Peserta
                          </label>
                          <select
                            value={editTicketTarget}
                            onChange={(e) => setEditTicketTarget(e.target.value as any)}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:border-indigo-500 outline-none"
                          >
                            <option value="per_person">Semua Peserta ({totalPeople} org)</option>
                            <option value="adult_only">Dewasa Saja ({adults} org)</option>
                            <option value="child_only">Anak-anak Saja ({children} anak)</option>
                            <option value="group">Satu Grup (Lump Sum)</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-indigo-200/60">
                        <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editTicketFollowDuration}
                            onChange={(e) => setEditTicketFollowDuration(e.target.checked)}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                          />
                          <span>Mengikuti durasi penuh perjalanan ({days} hari)</span>
                        </label>

                        <div className="flex items-center space-x-2 self-end sm:self-auto">
                          <button
                            type="button"
                            onClick={cancelEditingTicket}
                            className="px-3 py-1 text-xs font-semibold rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
                          >
                            Batal
                          </button>
                          <button
                            type="button"
                            onClick={() => saveEditingTicket(item.id)}
                            className="px-4 py-1 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-xs flex items-center space-x-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Simpan</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-slate-800">{item.name}</span>
                        <div className="flex items-center space-x-1.5 mt-0.5">
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
                            {targetLabel}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                            {item.followTripDuration ? `Setiap Hari (${days} Hari)` : `${multiplier}x Kunjungan`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end space-x-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-900">
                          {formatCurrency(subtotal, currency)}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          ({formatCurrency(item.cost, currency)} / unit)
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => startEditingTicket(item)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit tiket ini"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => removeActivityItem(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Hapus tiket"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Form Tambah Tiket Baru */}
          {isAddingTicket ? (
            <form
              onSubmit={handleAddTicket}
              className="p-4 rounded-xl border border-indigo-300 bg-indigo-50/40 space-y-3 animate-fade-in"
            >
              <div className="text-xs font-bold text-indigo-950">Input Manual Tiket & Objek Wisata Baru</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Nama Tiket / Tempat Wisata
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Tiket Masuk Candi Borobudur / Universal Studios"
                    value={newTicketName}
                    onChange={(e) => setNewTicketName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Harga per Tiket ({currency})
                  </label>
                  <FormattedNumberInput
                    value={typeof newTicketCost === 'number' ? newTicketCost : 0}
                    onChange={(val) => setNewTicketCost(val)}
                    placeholder="Nominal tiket"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-semibold focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Target Peserta
                  </label>
                  <select
                    value={newTicketTarget}
                    onChange={(e) => setNewTicketTarget(e.target.value as any)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:border-indigo-500 outline-none"
                  >
                    <option value="per_person">Semua Peserta ({totalPeople} org)</option>
                    <option value="adult_only">Dewasa Saja ({adults} org)</option>
                    <option value="child_only">Anak-anak Saja ({children} anak)</option>
                    <option value="group">Satu Grup (Lump Sum / Per Rombongan)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-indigo-200/60">
                <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newTicketFollowDuration}
                    onChange={(e) => setNewTicketFollowDuration(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                  />
                  <span>Tiket berlaku setiap hari selama {days} hari (Harian)</span>
                </label>

                <div className="flex items-center space-x-2 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setIsAddingTicket(false)}
                    className="px-3 py-1 text-xs font-semibold rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-xs"
                  >
                    Simpan Tiket
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setIsAddingTicket(true)}
              className="w-full py-2.5 border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/20 rounded-xl text-xs font-bold text-slate-600 hover:text-indigo-700 transition-all flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Tiket / Objek Wisata Manual Sendiri (Bebas Nama & Harga)</span>
            </button>
          )}
        </div>

        {/* 2. Opsi Tarif Harian Umum (Opsional / Fleksibel) */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-800">
              Alokasi Biaya Harian Wisata Umum & Guide (Opsional)
            </span>
            <label className="flex items-center space-x-2 text-xs text-slate-600 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={dailyCosts.activities.followTripDuration !== false}
                onChange={(e) => updateActivities({ followTripDuration: e.target.checked })}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
              />
              <span>Dikalikan seluruh hari ({days} hari)</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Tiket Masuk Harian / Dewasa ({adults} orang)
              </label>
              <div className="relative">
                <FormattedNumberInput
                  value={dailyCosts.activities.ticketsDailyPerAdult}
                  onChange={(val) =>
                    updateActivities({ ticketsDailyPerAdult: val })
                  }
                  className="w-full pl-3 pr-12 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-indigo-500 font-semibold"
                />
                <span className="absolute right-3 top-1.5 text-[10px] text-slate-400 font-medium">{currency}</span>
              </div>
            </div>

            {children > 0 && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Tiket Masuk Harian / Anak ({children} anak)
                </label>
                <div className="relative">
                  <FormattedNumberInput
                    value={dailyCosts.activities.ticketsDailyPerChild}
                    onChange={(val) =>
                      updateActivities({ ticketsDailyPerChild: val })
                    }
                    className="w-full pl-3 pr-12 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-indigo-500 font-semibold"
                  />
                  <span className="absolute right-3 top-1.5 text-[10px] text-slate-400 font-medium">{currency}</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Jasa Tour Guide Lokal Harian (Grup)
              </label>
              <div className="relative">
                <FormattedNumberInput
                  value={dailyCosts.activities.tourGuideDaily}
                  onChange={(val) =>
                    updateActivities({ tourGuideDaily: val })
                  }
                  className="w-full pl-3 pr-12 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-indigo-500 font-semibold"
                />
                <span className="absolute right-3 top-1.5 text-[10px] text-slate-400 font-medium">{currency}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Catatan Aktivitas & Tiket */}
        <SectionNotesInput
          value={state.notes?.activities || ''}
          onChange={(val) => updateSectionNote('activities', val)}
          placeholder="Contoh: Beli tiket online waterpark, booking guide candi Borobudur, snorkeling spot Manta Point..."
        />
      </div>

        {/* Telekomunikasi & Internet */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Wifi className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Telekomunikasi & Internet</h3>
            </div>
            <span className="text-sm font-extrabold text-purple-700">
              {formatCurrency(calculations.dailyTelecomTotal, currency)}
            </span>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Paket Roaming / Sewa Pocket Wi-Fi / Hari
              </label>
              <div className="relative">
                <FormattedNumberInput
                  value={dailyCosts.telecom.roamingOrWifiDaily}
                  onChange={(val) =>
                    updateTelecom({ roamingOrWifiDaily: val })
                  }
                  className="w-full pl-3 pr-12 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-purple-500 font-semibold"
                />
                <span className="absolute right-3 top-2 text-[11px] text-slate-400 font-medium">{currency}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jumlah Perangkat / eSIM Aktif
              </label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() =>
                    updateTelecom({ devicesCount: Math.max(0, dailyCosts.telecom.devicesCount - 1) })
                  }
                  className="w-8 h-8 rounded-lg bg-slate-100 font-bold text-slate-700 hover:bg-slate-200"
                >
                  -
                </button>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={dailyCosts.telecom.devicesCount}
                  onChange={(e) =>
                    updateTelecom({ devicesCount: Math.max(0, parseInt(e.target.value) || 0) })
                  }
                  className="w-12 text-center font-bold text-sm bg-transparent"
                />
                <button
                  type="button"
                  onClick={() => updateTelecom({ devicesCount: dailyCosts.telecom.devicesCount + 1 })}
                  className="w-8 h-8 rounded-lg bg-slate-100 font-bold text-slate-700 hover:bg-slate-200"
                >
                  +
                </button>
                <span className="text-xs text-slate-500">Perangkat</span>
              </div>
            </div>

            <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              💡 {profile.type === 'international' ? 'Saran: Gunakan eSIM lokal atau Pocket WiFi bersama untuk rombongan lebih dari 2 orang.' : 'Untuk domestik, pulsa kuota internet harian standar sudah mencukupi.'}
            </div>

            {/* Catatan Telekomunikasi */}
            <SectionNotesInput
              value={state.notes?.telecom || ''}
              onChange={(val) => updateSectionNote('telecom', val)}
              placeholder="Contoh: Sewa pocket WiFi pick up di bandara, pakai eSIM operator lokal..."
            />
          </div>
        </div>

      {/* Subtotal Tahap 3 */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
        <div>
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">
            Subtotal Biaya Variabel Harian ({days} Hari)
          </span>
          <p className="text-sm text-slate-300 mt-0.5">
            Konsumsi, transportasi lokal, tiket aktivitas, dan koneksi roaming
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-extrabold tracking-tight text-white">
            {formatCurrency(calculations.dailyExpensesGrandTotal, currency)}
          </span>
          <span className="text-xs text-slate-400 block">
            Rata-rata {days > 0 ? formatCurrency(calculations.dailyExpensesGrandTotal / days, currency) : formatCurrency(0, currency)} / hari
          </span>
        </div>
      </div>
    </div>
  );
};
