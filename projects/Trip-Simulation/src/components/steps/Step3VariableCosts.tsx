import React from 'react';
import { useTripContext } from '../../context/TripContext';
import { formatCurrency } from '../../utils/currency';
import { FormattedNumberInput } from '../FormattedNumberInput';
import { SectionNotesInput } from '../SectionNotesInput';
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
  Users
} from 'lucide-react';

export const Step3VariableCosts: React.FC = () => {
  const { 
    state, 
    updateMeals, 
    updateLocalTransport, 
    updateActivities, 
    updateTelecom,
    updateSectionNote,
    calculations 
  } = useTripContext();

  const { dailyCosts, profile } = state;
  const currency = profile.currency;
  const days = profile.durationDays;
  const adults = profile.adults;
  const children = profile.children;
  const effectiveFoodPeople = adults + children * 0.5;

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

      {/* Bagian 3: Aktivitas, Wisata & Telekomunikasi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Aktivitas & Wisata */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Ticket className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Aktivitas & Tiket Masuk</h3>
            </div>
            <span className="text-sm font-extrabold text-indigo-700">
              {formatCurrency(calculations.dailyActivitiesTotal, currency)}
            </span>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tiket Masuk / Wisata per Dewasa / Hari ({adults} orang)
              </label>
              <div className="relative">
                <FormattedNumberInput
                  value={dailyCosts.activities.ticketsDailyPerAdult}
                  onChange={(val) =>
                    updateActivities({ ticketsDailyPerAdult: val })
                  }
                  className="w-full pl-3 pr-12 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
                />
                <span className="absolute right-3 top-2 text-[11px] text-slate-400 font-medium">{currency}</span>
              </div>
            </div>

            {children > 0 && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tiket Masuk / Wisata per Anak / Hari ({children} anak)
                </label>
                <div className="relative">
                  <FormattedNumberInput
                    value={dailyCosts.activities.ticketsDailyPerChild}
                    onChange={(val) =>
                      updateActivities({ ticketsDailyPerChild: val })
                    }
                    className="w-full pl-3 pr-12 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
                  />
                  <span className="absolute right-3 top-2 text-[11px] text-slate-400 font-medium">{currency}</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jasa Tour Guide / Pemandu Lokal / Hari (Opsional)
              </label>
              <div className="relative">
                <FormattedNumberInput
                  value={dailyCosts.activities.tourGuideDaily}
                  onChange={(val) =>
                    updateActivities({ tourGuideDaily: val })
                  }
                  className="w-full pl-3 pr-12 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
                />
                <span className="absolute right-3 top-2 text-[11px] text-slate-400 font-medium">{currency}</span>
              </div>
            </div>

            {/* Catatan Aktivitas & Tiket */}
            <SectionNotesInput
              value={state.notes?.activities || ''}
              onChange={(val) => updateSectionNote('activities', val)}
              placeholder="Contoh: Beli tiket online waterpark, booking guide candi Borobudur..."
            />
          </div>
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
