import { useMemo } from 'react';
import { TripState, CalculationResults, CategoryBreakdownItem, SafetyScore } from '../types';

/**
 * Custom Hook: useTripCalculator
 * 
 * Memisahkan seluruh logika kalkulasi matematika, pembobotan peserta (dewasa & anak),
 * agregasi biaya tetap & dinamis, simulasi skenario darurat ("Sial"),
 * serta penilaian rapor kesehatan anggaran (Budget Health Scorecard).
 */
export function useTripCalculator(state: TripState): CalculationResults {
  return useMemo(() => {
    const { profile, mainTransport, accommodation, fixedItems, dailyCosts, contingency } = state;

    const days = Math.max(0, profile.durationDays || 0);
    const nights = Math.max(0, profile.durationNights || 0);
    const adults = Math.max(0, profile.adults || 0);
    const children = Math.max(0, profile.children || 0);
    const totalPeople = adults + children;

    // --- TAHAP 1 & 2: PERSIAPAN, DOKUMEN & BIAYA TETAP (PRE-TRIP) ---
    // Item biaya tetap (paspor, visa, vaksin, perlengkapan, asuransi)
    let documentsAndPrepCost = 0;
    fixedItems.forEach((item) => {
      const itemCost = Number(item.cost) || 0;
      if (item.isPerPerson) {
        documentsAndPrepCost += itemCost * totalPeople;
      } else {
        documentsAndPrepCost += itemCost;
      }
    });

    // Transportasi Utama: Pesawat / Kereta / Bus / Mobil / Kapal / Lainnya
    let effectiveTicketPerPerson = 0;
    let ticketTotal = 0;
    let baggageTotal = 0;
    let carTotal = 0;
    let rentalDeposit = 0;

    // Add-on Tambahan Transportasi
    const addonsTotal = (mainTransport.addons || []).reduce((sum, addon) => {
      const cost = Number(addon.cost) || 0;
      return sum + (addon.isPerPerson ? cost * totalPeople : cost);
    }, 0);

    const isCar = mainTransport.transportMode === 'mobil_pribadi';

    if (isCar) {
      const isRental = mainTransport.carOwnership === 'sewa';
      if (isRental) {
        const rate = Number(mainTransport.rentalDailyRate) || 0;
        const rentalDuration = Math.max(0, Number(mainTransport.rentalDays) || days || 0);
        const rentCost = rate * rentalDuration;
        const driverCost =
          mainTransport.rentalType === 'dengan_supir'
            ? (Number(mainTransport.rentalDriverAllowanceDaily) || 0) * rentalDuration
            : 0;
        const fuel = Number(mainTransport.rentalFuelCost) || 0;
        const tollParking = Number(mainTransport.rentalTollAndParking) || 0;
        rentalDeposit = Number(mainTransport.rentalDeposit) || 0;
        carTotal = rentCost + driverCost + fuel + tollParking;
      } else {
        // Mobil Pribadi
        const fuel = Number(mainTransport.carFuelCost) || 0;
        const toll = Number(mainTransport.carTollCost) || 0;
        const parking = Number(mainTransport.carParkingCost) || 0;
        const maintenance = Number(mainTransport.carMaintenanceCost) || 0;
        carTotal = fuel + toll + parking + maintenance;
      }
    } else {
      // Moda Tiket (Pesawat, Kereta, Bus, Kapal, Lainnya)
      if (mainTransport.isSplitTicket) {
        const dep = Number(mainTransport.departureTicketPerPerson) || 0;
        const ret =
          mainTransport.tripType === 'roundTrip'
            ? Number(mainTransport.returnTicketPerPerson) || 0
            : 0;
        effectiveTicketPerPerson = dep + ret;
      } else {
        effectiveTicketPerPerson = Number(mainTransport.ticketPricePerPerson) || 0;
      }
      ticketTotal = effectiveTicketPerPerson * totalPeople;
      baggageTotal = (Number(mainTransport.baggageCostPerPerson) || 0) * totalPeople;
    }

    const mainTransportTotal = (isCar ? carTotal : ticketTotal + baggageTotal) + addonsTotal;

    const preTripTotal = documentsAndPrepCost + mainTransportTotal;

    // --- TAHAP 2: AKOMODASI (ON-TRIP FIXED) ---
    const roomCount = Math.max(0, accommodation.roomCount || 0);
    const pricePerNight = Number(accommodation.pricePerNight) || 0;
    const taxRate = (Number(accommodation.taxPercentage) || 0) / 100;
    const depositAmount = Number(accommodation.depositAmount) || 0;

    // Menghormati opsi apakah mengikuti durasi malam trip atau kustom input
    const effectiveNights =
      accommodation.followTripDuration !== false
        ? nights
        : Math.max(0, accommodation.totalNights || 0);

    const accommodationRentTotal = pricePerNight * effectiveNights * roomCount;
    const accommodationTaxTotal = accommodationRentTotal * taxRate;
    const accommodationTotal = accommodationRentTotal + accommodationTaxTotal;
    // Deposit ditandai terpisah karena uang akan dikembalikan (refundable)
    const refundableDepositTotal = depositAmount + rentalDeposit;

    // --- TAHAP 3: BIAYA HARIAN & ITINERARY (ON-TRIP VARIABLE) ---
    // Konsumsi (F&B): Sarapan, Siang, Malam, Ekstra
    // *ATURAN KHUSUS*: Anak-anak dihitung 50% dari budget makan orang dewasa
    const effectiveFoodWeight = adults + children * 0.5;

    const adultDailyMealSum =
      (Number(dailyCosts.meals.breakfastPerAdult) || 0) +
      (Number(dailyCosts.meals.lunchPerAdult) || 0) +
      (Number(dailyCosts.meals.dinnerPerAdult) || 0) +
      (Number(dailyCosts.meals.snacksAndCoffeePerAdult) || 0);

    const dailyMealsTotal = adultDailyMealSum * effectiveFoodWeight * days;

    // Transportasi Lokal (Sewa kendaraan harian + Bensin/Transport umum)
    const dailyLocalTransSum =
      (Number(dailyCosts.localTransport.vehicleRentalDaily) || 0) +
      (Number(dailyCosts.localTransport.fuelOrTransitDaily) || 0);
    const dailyLocalTransportTotal = dailyLocalTransSum * days;

    // Aktivitas & Wisata (Tiket harian umum + Tour Guide harian + Tiket Spesifik)
    const followActDays = dailyCosts.activities.followTripDuration !== false ? days : 1;
    const dailyTicketsAdult = (Number(dailyCosts.activities.ticketsDailyPerAdult) || 0) * adults * followActDays;
    const dailyTicketsChild = (Number(dailyCosts.activities.ticketsDailyPerChild) || 0) * children * followActDays;
    const dailyGuide = (Number(dailyCosts.activities.tourGuideDaily) || 0) * followActDays;
    const generalActivitiesTotal = dailyTicketsAdult + dailyTicketsChild + dailyGuide;

    // Tambahan tiket & aktivitas kustom / spesifik
    let customActivitiesTotal = 0;
    let customActAdultTotal = 0;
    let customActChildTotal = 0;
    let customActSharedTotal = 0;

    (dailyCosts.activities.items || []).forEach((item) => {
      const cost = Number(item.cost) || 0;
      const multiplier = item.followTripDuration ? days : Math.max(1, item.daysCount || 1);

      if (item.target === 'per_person') {
        customActivitiesTotal += cost * totalPeople * multiplier;
        if (adults > 0) customActAdultTotal += cost * multiplier;
        if (children > 0) customActChildTotal += cost * multiplier;
      } else if (item.target === 'adult_only') {
        customActivitiesTotal += cost * adults * multiplier;
        if (adults > 0) customActAdultTotal += cost * multiplier;
      } else if (item.target === 'child_only') {
        customActivitiesTotal += cost * children * multiplier;
        if (children > 0) customActChildTotal += cost * multiplier;
      } else {
        // group / lump sum
        customActivitiesTotal += cost * multiplier;
        customActSharedTotal += cost * multiplier;
      }
    });

    const dailyActivitiesTotal = generalActivitiesTotal + customActivitiesTotal;

    // Telekomunikasi (Roaming / Sewa Wi-Fi harian x jumlah perangkat x durasi)
    const deviceCount = Math.max(0, dailyCosts.telecom.devicesCount || 0);
    const dailyTelecomTotal =
      (Number(dailyCosts.telecom.roamingOrWifiDaily) || 0) * deviceCount * days;

    const dailyExpensesGrandTotal =
      dailyMealsTotal + dailyLocalTransportTotal + dailyActivitiesTotal + dailyTelecomTotal;

    // --- TAHAP 4: HAL TAK TERDUGA, DANA DARURAT & PASCA-PERJALANAN ---
    const souvenirBudgetTotal = Number(contingency.souvenirBudget) || 0;

    // Biaya Inti Dasar Sebelum Dana Darurat (Pre-trip + Akomodasi + Pengeluaran Harian + Souvenir)
    const totalCoreExpense =
      preTripTotal + accommodationTotal + dailyExpensesGrandTotal + souvenirBudgetTotal;

    // Dana Darurat (Contingency Fund): % slider dari total biaya inti perjalanan
    const contingencyPercent = Number(contingency.contingencyPercent) || 10;
    const contingencyFundAmount = (totalCoreExpense * contingencyPercent) / 100;

    /**
     * KALKULASI SKENARIO TAK TERDUGA ("SKENARIO SIAL"):
     * Setiap skenario merepresentasikan peristiwa darurat nyata dalam perjalanan.
     * Biaya dihitung hanya jika toggle switch skenario diaktifkan oleh pengguna.
     */
    let unforeseenScenarioTotal = 0;

    // 1. Ketinggalan pesawat (Emergency rebooking / tiket pengganti darurat)
    if (contingency.missedFlight.enabled) {
      unforeseenScenarioTotal += Number(contingency.missedFlight.cost) || 0;
    }

    // 2. Bagasi hilang atau tertunda (Emergency toiletries & pakaian esensial)
    if (contingency.lostBaggage.enabled) {
      unforeseenScenarioTotal += Number(contingency.lostBaggage.cost) || 0;
    }

    // 3. Cuaca buruk (Keterlambatan badai/erupsi/delay, penambahan menginap 1 malam + makan ekstra)
    if (contingency.badWeather.enabled) {
      const extraNights = contingency.badWeather.additionalNights || 1;
      const extraCostPerNight = Number(contingency.badWeather.costPerNight) || 0;
      unforeseenScenarioTotal += extraNights * extraCostPerNight;
    }

    // 4. Kunjungan medis darurat (Klinik / obat mendadak)
    if (contingency.medicalEmergency.enabled) {
      unforeseenScenarioTotal += Number(contingency.medicalEmergency.cost) || 0;
    }

    // Biaya Pasca-Perjalanan (Kepulangan)
    const postTripAirportToHome = Number(contingency.postTripAirportToHome) || 0;
    const postTripLaundry = Number(contingency.postTripLaundry) || 0;
    const postTripTotal = postTripAirportToHome + postTripLaundry;

    // Total fase On-Trip mencakup: Akomodasi, Harian, Belanja, Dana Darurat, & Skenario
    const onTripTotal =
      accommodationTotal +
      dailyExpensesGrandTotal +
      souvenirBudgetTotal +
      contingencyFundAmount +
      unforeseenScenarioTotal;

    // Total Keseluruhan (Grand Total)
    const totalWithoutScenarios =
      preTripTotal +
      accommodationTotal +
      dailyExpensesGrandTotal +
      souvenirBudgetTotal +
      contingencyFundAmount +
      postTripTotal;

    const grandTotalWithScenarios = totalWithoutScenarios + unforeseenScenarioTotal;

    // Pengeluaran Efektif Bersih (Tidak termasuk deposit yang akan dikembalikan)
    const netEffectiveExpense = grandTotalWithScenarios;

    // --- KALKULASI BIAYA PER ORANG (DEWASA & ANAK) ---
    // Biaya umum (akomodasi, sewa mobil, post-trip) dibagi rata per kepala.
    // Biaya tiket & dokumen per orang dihitung sesuai status.
    // Biaya makan anak dihitung 50% dari orang dewasa.
    const sharedExpenses =
      accommodationTotal +
      dailyLocalTransportTotal +
      dailyTelecomTotal +
      souvenirBudgetTotal +
      contingencyFundAmount +
      unforeseenScenarioTotal +
      postTripTotal;
    const sharedPerPerson = totalPeople > 0 ? sharedExpenses / totalPeople : 0;

    // Rata-rata makan per hari untuk dewasa & anak
    const mealAdultTotal = adultDailyMealSum * days;
    const mealChildTotal = mealAdultTotal * 0.5;

    // Tiket & aktivitas
    const transportPerPerson = effectiveTicketPerPerson + (Number(mainTransport.baggageCostPerPerson) || 0);
    const sharedCustomActPerPerson = totalPeople > 0 ? customActSharedTotal / totalPeople : 0;
    const activitiesPerAdultTotal =
      (Number(dailyCosts.activities.ticketsDailyPerAdult) || 0) * followActDays +
      (totalPeople > 0 ? (dailyGuide / totalPeople) : 0) +
      customActAdultTotal +
      sharedCustomActPerPerson;
    const activitiesPerChildTotal =
      (Number(dailyCosts.activities.ticketsDailyPerChild) || 0) * followActDays +
      (totalPeople > 0 ? (dailyGuide / totalPeople) : 0) +
      customActChildTotal +
      sharedCustomActPerPerson;

    const costPerAdult = adults > 0 ? Math.round(sharedPerPerson + mealAdultTotal + transportPerPerson + activitiesPerAdultTotal) : 0;
    const costPerChild = children > 0 
      ? Math.round(sharedPerPerson + mealChildTotal + transportPerPerson + activitiesPerChildTotal)
      : 0;

    // --- VISUALISASI DATA: BREAKDOWN KATEGORI UNTUK DONUT CHART ---
    const categoryBreakdown: CategoryBreakdownItem[] = [
      {
        id: 'transport',
        name: 'Transportasi Utama & Lokal',
        amount: mainTransportTotal + dailyLocalTransportTotal,
        color: '#2563eb', // Indigo / Blue
        percentage: 0,
        icon: 'Plane',
      },
      {
        id: 'accommodation',
        name: 'Akomodasi & Pajak',
        amount: accommodationTotal,
        color: '#0d9488', // Teal
        percentage: 0,
        icon: 'Hotel',
      },
      {
        id: 'meals',
        name: 'Konsumsi (F&B)',
        amount: dailyMealsTotal,
        color: '#f59e0b', // Amber
        percentage: 0,
        icon: 'Utensils',
      },
      {
        id: 'activities',
        name: 'Wisata & Komunikasi',
        amount: dailyActivitiesTotal + dailyTelecomTotal,
        color: '#8b5cf6', // Violet
        percentage: 0,
        icon: 'Compass',
      },
      {
        id: 'documents',
        name: 'Persiapan & Belanja',
        amount: documentsAndPrepCost + souvenirBudgetTotal,
        color: '#ec4899', // Pink
        percentage: 0,
        icon: 'FileCheck',
      },
      {
        id: 'contingency',
        name: 'Dana Darurat & Kontingensi',
        amount: contingencyFundAmount,
        color: '#10b981', // Emerald
        percentage: 0,
        icon: 'ShieldCheck',
      },
    ];

    if (unforeseenScenarioTotal > 0) {
      categoryBreakdown.push({
        id: 'scenarios',
        name: 'Simulasi Skenario Tak Terduga',
        amount: unforeseenScenarioTotal,
        color: '#ef4444', // Red
        percentage: 0,
        icon: 'AlertTriangle',
      });
    }

    if (postTripTotal > 0) {
      categoryBreakdown.push({
        id: 'posttrip',
        name: 'Pasca-Perjalanan (Kepulangan)',
        amount: postTripTotal,
        color: '#64748b', // Slate
        percentage: 0,
        icon: 'Home',
      });
    }

    const grandSum = categoryBreakdown.reduce((acc, c) => acc + c.amount, 0);
    categoryBreakdown.forEach((item) => {
      item.percentage = grandSum > 0 ? Math.round((item.amount / grandSum) * 100) : 0;
    });

    // --- TIMELINE ANGGARAN (PRE-TRIP, ON-TRIP, POST-TRIP) ---
    const timelineBreakdown = [
      {
        phase: 'Fase Pra-Perjalanan (Pre-Trip)',
        amount: preTripTotal,
        percentage: grandTotalWithScenarios > 0 ? Math.round((preTripTotal / grandTotalWithScenarios) * 100) : 0,
        items: [
          { label: 'Tiket Transportasi Utama', amount: mainTransportTotal },
          { label: 'Dokumen, Asuransi & Perlengkapan', amount: documentsAndPrepCost },
        ],
      },
      {
        phase: 'Fase Selama Liburan (On-Trip)',
        amount: onTripTotal,
        percentage: grandTotalWithScenarios > 0 ? Math.round((onTripTotal / grandTotalWithScenarios) * 100) : 0,
        items: [
          { label: 'Penginapan & Pajak', amount: accommodationTotal },
          { label: 'Makan & Kuliner (F&B)', amount: dailyMealsTotal },
          { label: 'Transportasi Lokal & Bensin', amount: dailyLocalTransportTotal },
          { label: 'Aktivitas Wisata & Tour', amount: dailyActivitiesTotal },
          { label: 'Telekomunikasi & Roaming', amount: dailyTelecomTotal },
          { label: 'Oleh-oleh & Belanja', amount: souvenirBudgetTotal },
          { label: 'Alokasi Dana Darurat', amount: contingencyFundAmount },
          ...(unforeseenScenarioTotal > 0
            ? [{ label: 'Cadangan Skenario Sial', amount: unforeseenScenarioTotal }]
            : []),
        ],
      },
      {
        phase: 'Fase Kepulangan (Post-Trip)',
        amount: postTripTotal,
        percentage: grandTotalWithScenarios > 0 ? Math.round((postTripTotal / grandTotalWithScenarios) * 100) : 0,
        items: [
          { label: 'Taksi / Travel Bandara ke Rumah', amount: postTripAirportToHome },
          { label: 'Laundry Pakaian Pasca-Liburan', amount: postTripLaundry },
        ],
      },
    ];

    // --- RAPOR KEAMANAN ANGGARAN (BUDGET HEALTH SCORECARD) ---
    // Dihitung berdasarkan rasio dana darurat vs total biaya inti & proteksi skenario
    const contingencyRatio = totalCoreExpense > 0 ? (contingencyFundAmount / totalCoreExpense) * 100 : 0;
    let safetyScore: SafetyScore;

    const recommendations: string[] = [];

    // Evaluasi faktor risiko
    const hasActiveRisk = unforeseenScenarioTotal > 0;
    const coversActiveRisk = contingencyFundAmount >= unforeseenScenarioTotal;
    const isHighContingency = contingencyRatio >= 12;
    const isMediumContingency = contingencyRatio >= 7 && contingencyRatio < 12;

    if (totalCoreExpense === 0) {
      safetyScore = {
        status: 'safe',
        label: 'Belum Ada Input Biaya (Rp 0)',
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
        description:
          'Semua pos pengeluaran saat ini bernilai 0. Silakan isi rincian rencana perjalanan Anda untuk melihat simulasi dan analisis kesehatan anggaran.',
        contingencyRatio: 0,
        recommendations: [
          'Mulai dengan memasukkan rute, moda transportasi, akomodasi, dan durasi.',
          'Atur alokasi dana darurat (5%–25%) sesuai tingkat kenyamanan perjalanan Anda.',
        ],
      };
    } else if (contingencyRatio >= 10 && (!hasActiveRisk || coversActiveRisk)) {
      safetyScore = {
        status: 'safe',
        label: 'Anggaran Aman & Terproteksi (Safe)',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        description:
          'Komposisi dana darurat Anda sangat sehat (≥10%). Risiko perjalanan dapat dimitigasi dengan baik tanpa mengganggu pos pengeluaran utama.',
        contingencyRatio: Math.round(contingencyRatio),
        recommendations: [
          'Alokasi dana darurat mencukupi untuk menghadapi potensi keterlambatan atau kebutuhan mendadak.',
          'Pisahkan dana darurat di rekening terpisah atau kartu kredit darurat.',
          'Pastikan nomor polis asuransi perjalanan disimpan di smartphone secara offline.',
        ],
      };
    } else if (isMediumContingency) {
      safetyScore = {
        status: 'vulnerable',
        label: 'Anggaran Rentan (Moderate / Vulnerable)',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
        description:
          'Alokasi dana darurat berada pada batas moderat (7% - 10%). Jika terjadi kendala signifikan seperti tiket rebooking darurat, saldo cadangan mungkin menipis.',
        contingencyRatio: Math.round(contingencyRatio),
        recommendations: [
          'Disarankan menaikkan dana darurat menjadi minimal 12% terutama untuk perjalanan jarak jauh / internasional.',
          'Cek kembali asuransi perjalanan untuk meng-cover skenario bagasi hilang atau delay.',
          'Siapkan cadangan limit kartu kredit darurat sebagai penyangga tambahan.',
        ],
      };
    } else {
      safetyScore = {
        status: 'risky',
        label: 'Anggaran Berisiko (High Risk)',
        badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
        description:
          'Dana darurat kurang dari 7% atau tidak cukup menutup skenario darurat aktif. Setiap kendala mendadak berpotensi memicu defisit anggaran.',
        contingencyRatio: Math.round(contingencyRatio),
        recommendations: [
          'Tingkatkan slider dana darurat ke angka minimal 10% - 15%.',
          'Kurangi alokasi belanja oleh-oleh atau sesuaikan gaya akomodasi untuk membebaskan ruang dana darurat.',
          'Wajib miliki asuransi perjalanan komprehensif sebelum keberangkatan.',
        ],
      };
    }

    return {
      documentsAndPrepCost,
      mainTransportTotal,
      preTripTotal,

      accommodationRentTotal,
      accommodationTaxTotal,
      accommodationTotal,
      refundableDepositTotal,

      dailyMealsTotal,
      dailyLocalTransportTotal,
      dailyActivitiesTotal,
      dailyTelecomTotal,
      dailyExpensesGrandTotal,

      souvenirBudgetTotal,
      contingencyFundAmount,
      unforeseenScenarioTotal,
      onTripTotal,

      postTripTotal,

      totalCoreExpense,
      totalWithoutScenarios,
      grandTotalWithScenarios,
      netEffectiveExpense,

      effectiveParticipantsWeight: effectiveFoodWeight,
      costPerAdult,
      costPerChild,

      categoryBreakdown,
      timelineBreakdown,
      safetyScore,
    };
  }, [state]);
}
