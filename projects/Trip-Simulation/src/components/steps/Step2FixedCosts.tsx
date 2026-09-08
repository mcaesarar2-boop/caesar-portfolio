import React, { useState } from 'react';
import { useTripContext } from '../../context/TripContext';
import { formatCurrency } from '../../utils/currency';
import { SearchPriceModal } from '../SearchPriceModal';
import { TransportCard } from '../TransportCard';
import { FormattedNumberInput } from '../FormattedNumberInput';
import { SectionNotesInput } from '../SectionNotesInput';
import { 
  Plane, 
  Hotel, 
  FileCheck, 
  Plus, 
  Trash2, 
  Shield, 
  Info, 
  Layers, 
  Building, 
  Luggage,
  Sparkles,
  ArrowRightLeft,
  ArrowRight,
  Train,
  Bus,
  Car,
  Ship,
  Compass,
  Search,
  CheckCircle2
} from 'lucide-react';

export const Step2FixedCosts: React.FC = () => {
  const { 
    state, 
    updateMainTransport, 
    updateAccommodation, 
    addFixedItem, 
    removeFixedItem, 
    updateFixedItem,
    updateSectionNote,
    calculations 
  } = useTripContext();

  const { mainTransport, accommodation, fixedItems, profile } = state;
  const currency = profile.currency;
  const totalPeople = profile.adults + profile.children;

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // State for new custom fixed item modal / inline form
  const [newItemName, setNewItemName] = useState('');
  const [newItemCost, setNewItemCost] = useState<number | ''>('');
  const [newItemCategory, setNewItemCategory] = useState<'document' | 'transport' | 'gear' | 'other'>('document');
  const [newItemIsPerPerson, setNewItemIsPerPerson] = useState(true);
  const [isAddingItem, setIsAddingItem] = useState(false);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemCost || newItemCost <= 0) return;

    addFixedItem({
      name: newItemName.trim(),
      cost: Number(newItemCost),
      category: newItemCategory,
      isPerPerson: newItemIsPerPerson,
    });

    setNewItemName('');
    setNewItemCost('');
    setIsAddingItem(false);
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
          <Layers className="w-4 h-4" />
          <span>Tahap 2 dari 5 • Fixed Costs Planning</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Perencanaan Biaya Inti & Akomodasi
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Semua harga diisi manual secara offline. Anda dapat memilih tiket <strong>Pulang-Pergi (PP)</strong> atau <strong>Satu Arah (One-Way)</strong>, serta cek acuan via search engine jika diperlukan.
            </p>
          </div>

          {/* Tombol Search Engine Price Modal */}
          <button
            type="button"
            onClick={() => setIsSearchModalOpen(true)}
            className="px-4 py-2 text-xs font-bold rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all flex items-center space-x-1.5 self-start sm:self-auto shrink-0 shadow-2xs"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Cek Harga di Search Engine</span>
          </button>
        </div>
      </div>

      {/* Bagian 1: Transportasi Utama & Tiket */}
      <TransportCard onOpenSearch={() => setIsSearchModalOpen(true)} />

      {/* Bagian 2: Akomodasi & Hotel */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <Hotel className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Akomodasi (Hotel / Villa / Resort)</h3>
              <p className="text-xs text-slate-500">Tarif harian per kamar, durasi malam, pajak lokal, & jaminan deposit</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-500 font-medium block">Total Sewa & Pajak</span>
            <span className="text-base font-extrabold text-teal-700">
              {formatCurrency(calculations.accommodationTotal, currency)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tarif Sewa per Malam */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Harga per Malam / Kamar
            </label>
            <div className="relative">
              <FormattedNumberInput
                value={accommodation.pricePerNight}
                onChange={(val) =>
                  updateAccommodation({ pricePerNight: val })
                }
                className="w-full pl-3.5 pr-14 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all font-semibold"
              />
              <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-medium">
                {currency}
              </span>
            </div>
          </div>

          {/* Durasi Menginap */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Durasi Menginap (Malam)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="0"
                value={accommodation.totalNights}
                onChange={(e) =>
                  updateAccommodation({ totalNights: Math.max(0, Number(e.target.value) || 0) })
                }
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-teal-500 font-semibold"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Sesuai Tahap 1: {profile.durationNights} malam</p>
          </div>

          {/* Jumlah Kamar */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Jumlah Kamar
            </label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() =>
                  updateAccommodation({ roomCount: Math.max(0, accommodation.roomCount - 1) })
                }
                className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 font-bold text-slate-700 hover:bg-slate-200 transition-colors shrink-0"
              >
                -
              </button>
              <input
                type="number"
                min="0"
                value={accommodation.roomCount}
                onChange={(e) =>
                  updateAccommodation({ roomCount: Math.max(0, Number(e.target.value) || 0) })
                }
                className="w-full text-center py-2 text-sm font-bold rounded-xl border border-slate-200"
              />
              <button
                type="button"
                onClick={() => updateAccommodation({ roomCount: accommodation.roomCount + 1 })}
                className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 font-bold text-slate-700 hover:bg-slate-200 transition-colors shrink-0"
              >
                +
              </button>
            </div>
          </div>

          {/* Pajak Hotel */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Pajak & Layanan Hotel (%)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="50"
                value={accommodation.taxPercentage}
                onChange={(e) =>
                  updateAccommodation({ taxPercentage: Math.max(0, Number(e.target.value) || 0) })
                }
                className="w-full pl-3.5 pr-10 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-teal-500 font-semibold"
              />
              <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-medium">
                %
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Standar PB1/PPN: 10% - 11%</p>
          </div>
        </div>

        {/* Deposit Hotel (Refundable Notice) */}
        <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200/80 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-start space-x-2.5">
              <Shield className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-teal-900 block">
                  Jaminan Deposit Hotel (Ditandai Khusus: Refundable)
                </span>
                <p className="text-[11px] text-teal-700">
                  Uang deposit wajib disiapkan saat check-in, tetapi <strong>akan dikembalikan utuh</strong> saat check-out jika tidak ada kerusakan.
                </p>
              </div>
            </div>

            <div className="relative w-full sm:w-48">
              <FormattedNumberInput
                value={accommodation.depositAmount}
                onChange={(val) =>
                  updateAccommodation({ depositAmount: val })
                }
                className="w-full pl-3 pr-12 py-2 text-xs rounded-xl border border-teal-300 bg-white font-bold text-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-200"
              />
              <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-medium">
                {currency}
              </span>
            </div>
          </div>
        </div>

        {/* Catatan Akomodasi */}
        <SectionNotesInput
          value={state.notes?.accommodation || ''}
          onChange={(val) => updateSectionNote('accommodation', val)}
          placeholder="Contoh: Booking hotel via OTA tanpa sarapan, deposit 500rb cash saat check-in, request connecting door..."
        />
      </div>

      {/* Bagian 3: Persiapan & Dokumen (Input Dinamis: Tambah / Hapus Baris) */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Persiapan, Dokumen & Perlengkapan</h3>
              <p className="text-xs text-slate-500">
                Paspor, visa, asuransi medis perjalanan, vaksinasi, & perlengkapan awal
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-500 font-medium block">Total Dokumen & Pra-Trip</span>
            <span className="text-base font-extrabold text-indigo-700">
              {formatCurrency(calculations.documentsAndPrepCost, currency)}
            </span>
          </div>
        </div>

        {/* List of Dynamic Fixed Items */}
        <div className="space-y-2.5">
          {fixedItems.map((item) => {
            const itemSubtotal = item.isPerPerson ? item.cost * totalPeople : item.cost;
            return (
              <div
                key={item.id}
                className="p-3 sm:p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-800">{item.name}</span>
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                      {item.category}
                    </span>
                    {item.isPerPerson ? (
                      <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-medium border border-blue-200">
                        x{totalPeople} Peserta
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-medium">
                        Lump sum (Rombongan)
                      </span>
                    )}
                  </div>
                  {item.notes && <p className="text-[11px] text-slate-500">{item.notes}</p>}
                </div>

                <div className="flex items-center justify-between sm:justify-end space-x-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-900">
                      {formatCurrency(itemSubtotal, currency)}
                    </div>
                    {item.isPerPerson && (
                      <span className="text-[10px] text-slate-400 block">
                        ({formatCurrency(item.cost, currency)} / orang)
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFixedItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Hapus baris ini"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Inline Form to Add New Fixed Item */}
        {isAddingItem ? (
          <form
            onSubmit={handleAddItem}
            className="p-4 rounded-xl border-2 border-dashed border-indigo-300 bg-indigo-50/30 space-y-3 animate-fade-in"
          >
            <div className="font-bold text-xs text-indigo-900">Tambah Pos Biaya Persiapan Baru</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Nama Pos Biaya
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Paspor / Visa / P3K"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Nominal Biaya ({currency})
                </label>
                <FormattedNumberInput
                  value={typeof newItemCost === 'number' ? newItemCost : 0}
                  onChange={(val) => setNewItemCost(val)}
                  placeholder="Nominal"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:border-indigo-500 outline-none font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Kategori
                </label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value as any)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:border-indigo-500 outline-none"
                >
                  <option value="document">Dokumen / Visa</option>
                  <option value="gear">Perlengkapan / Obat</option>
                  <option value="transport">Transportasi Awal</option>
                  <option value="other">Lain-lain</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newItemIsPerPerson}
                  onChange={(e) => setNewItemIsPerPerson(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Dikalikan per jumlah orang ({totalPeople} peserta)</span>
              </label>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddingItem(false)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-xs"
                >
                  Simpan Pos Biaya
                </button>
              </div>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setIsAddingItem(true)}
            className="w-full py-2.5 border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/20 rounded-xl text-xs font-bold text-slate-600 hover:text-indigo-700 transition-all flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Baris Biaya Persiapan / Dokumen</span>
          </button>
        )}

        {/* Catatan Dokumen & Persiapan */}
        <SectionNotesInput
          value={state.notes?.documentsAndPrep || ''}
          onChange={(val) => updateSectionNote('documentsAndPrep', val)}
          placeholder="Contoh: Paspor sudah jadi tinggal ambil, asuransi mengcover baggage delay dan rawat inap..."
        />
      </div>

      {/* Modal Bantuan Cek Harga Search Engine */}
      <SearchPriceModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </div>
  );
};
