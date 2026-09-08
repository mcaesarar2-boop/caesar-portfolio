import { TripState, TravelStyle, CurrencyCode } from '../types';

export interface TripPreset {
  id: string;
  name: string;
  tagline: string;
  destination: string;
  style: TravelStyle;
  days: number;
  nights: number;
  state: TripState;
}

export const DEFAULT_INITIAL_STATE: TripState = {
  profile: {
    origin: '',
    destination: '',
    type: 'domestic',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    durationDays: 0,
    durationNights: 0,
    adults: 0,
    children: 0,
    travelStyle: 'standard',
    currency: 'IDR',
  },
  mainTransport: {
    tripType: 'roundTrip',
    departureTicketPerPerson: 0,
    returnTicketPerPerson: 0,
    isSplitTicket: false,
    ticketPricePerPerson: 0,
    baggageCostPerPerson: 0,
    transportMode: 'pesawat',
    flightClass: 'economy',
    carOwnership: 'pribadi',
    carType: 'mpv_suv',
    carFuelCost: 0,
    carTollCost: 0,
    carParkingCost: 0,
    carMaintenanceCost: 0,
    rentalType: 'lepas_kunci',
    rentalCarModel: '',
    rentalDailyRate: 0,
    rentalDays: 0,
    rentalDriverAllowanceDaily: 0,
    rentalFuelCost: 0,
    rentalTollAndParking: 0,
    rentalDeposit: 0,
    addons: [],
  },
  accommodation: {
    name: '',
    location: '',
    followTripDuration: true,
    checkInDate: '',
    checkOutDate: '',
    pricePerNight: 0,
    totalNights: 0,
    roomCount: 0,
    taxPercentage: 0,
    depositAmount: 0,
  },
  fixedItems: [],
  dailyCosts: {
    meals: {
      breakfastPerAdult: 0,
      lunchPerAdult: 0,
      dinnerPerAdult: 0,
      snacksAndCoffeePerAdult: 0,
    },
    localTransport: {
      vehicleRentalDaily: 0,
      fuelOrTransitDaily: 0,
    },
    activities: {
      followTripDuration: true,
      ticketsDailyPerAdult: 0,
      ticketsDailyPerChild: 0,
      tourGuideDaily: 0,
      items: [],
    },
    telecom: {
      roamingOrWifiDaily: 0,
      devicesCount: 0,
    },
  },
  contingency: {
    souvenirBudget: 0,
    contingencyPercent: 0,
    missedFlight: {
      enabled: false,
      cost: 0,
      description: 'Tiket pengganti darurat jika terlambat tiba di bandara',
    },
    lostBaggage: {
      enabled: false,
      cost: 0,
      description: 'Beli pakaian ganti & perlengkapan esensial darurat',
    },
    badWeather: {
      enabled: false,
      additionalNights: 0,
      costPerNight: 0,
      description: 'Ekstra 1 malam hotel & makan darurat akibat cuaca buruk',
    },
    medicalEmergency: {
      enabled: false,
      cost: 0,
      description: 'Kunjungan klinik lokal & resep obat mendadak',
    },
    postTripAirportToHome: 0,
    postTripLaundry: 0,
  },
  notes: {
    mainTransport: '',
    accommodation: '',
    documentsAndPrep: '',
    fixedCosts: '',
    meals: '',
    localTransport: '',
    activities: '',
    telecom: '',
    souvenirs: '',
    contingency: '',
    unforeseen: '',
    postTrip: '',
  },
};

export const TRIP_PRESETS: TripPreset[] = [
  {
    id: 'bali-standard',
    name: 'Liburan Keluarga Bali',
    tagline: 'Standar & Nyaman • 4 Hari 3 Malam',
    destination: 'Bali, Indonesia',
    style: 'standard',
    days: 4,
    nights: 3,
    state: {
      profile: {
        origin: 'Jakarta (CGK)',
        destination: 'Bali (DPS)',
        type: 'domestic',
        startDate: new Date().toISOString().split('T')[0],
        durationDays: 4,
        durationNights: 3,
        adults: 2,
        children: 1,
        travelStyle: 'standard',
        currency: 'IDR',
      },
      mainTransport: {
        tripType: 'roundTrip',
        departureTicketPerPerson: 925000,
        returnTicketPerPerson: 925000,
        isSplitTicket: false,
        ticketPricePerPerson: 1850000,
        baggageCostPerPerson: 0,
        transportMode: 'pesawat',
        flightClass: 'economy',
        carOwnership: 'pribadi',
        carType: 'mpv_suv',
        carFuelCost: 450000,
        carTollCost: 250000,
        carParkingCost: 75000,
        carMaintenanceCost: 150000,
        rentalType: 'lepas_kunci',
        rentalCarModel: 'Avanza / Xpander',
        rentalDailyRate: 350000,
        rentalDays: 4,
        rentalDriverAllowanceDaily: 150000,
        rentalFuelCost: 350000,
        rentalTollAndParking: 150000,
        rentalDeposit: 500000,
        addons: [],
      },
      accommodation: {
        pricePerNight: 750000,
        totalNights: 3,
        roomCount: 1,
        taxPercentage: 11,
        depositAmount: 500000,
      },
      fixedItems: [
        {
          id: 'fix-1',
          category: 'gear',
          name: 'Perlengkapan Liburan / Obat Pribadi',
          cost: 350000,
          isPerPerson: false,
          notes: 'P3K, sunblock, charger adaptor',
        },
        {
          id: 'fix-2',
          category: 'document',
          name: 'Asuransi Perjalanan Domestik',
          cost: 120000,
          isPerPerson: true,
          notes: 'Cover bagasi & keterlambatan',
        },
      ],
      dailyCosts: {
        meals: {
          breakfastPerAdult: 45000,
          lunchPerAdult: 75000,
          dinnerPerAdult: 95000,
          snacksAndCoffeePerAdult: 35000,
        },
        localTransport: {
          vehicleRentalDaily: 350000,
          fuelOrTransitDaily: 150000,
        },
        activities: {
          ticketsDailyPerAdult: 120000,
          ticketsDailyPerChild: 60000,
          tourGuideDaily: 0,
        },
        telecom: {
          roamingOrWifiDaily: 25000,
          devicesCount: 2,
        },
      },
      contingency: {
        souvenirBudget: 1500000,
        contingencyPercent: 10,
        missedFlight: {
          enabled: false,
          cost: 2500000,
          description: 'Tiket pengganti darurat jika terlambat tiba di bandara',
        },
        lostBaggage: {
          enabled: false,
          cost: 800000,
          description: 'Beli pakaian ganti & perlengkapan esensial darurat',
        },
        badWeather: {
          enabled: false,
          additionalNights: 1,
          costPerNight: 850000,
          description: 'Ekstra 1 malam hotel & makan darurat akibat cuaca buruk',
        },
        medicalEmergency: {
          enabled: false,
          cost: 750000,
          description: 'Kunjungan klinik lokal & resep obat mendadak',
        },
        postTripAirportToHome: 250000,
        postTripLaundry: 150000,
      },
      notes: {
        mainTransport: '',
        accommodation: '',
        documentsAndPrep: '',
        fixedCosts: '',
        meals: '',
        localTransport: '',
        activities: '',
        telecom: '',
        souvenirs: '',
        contingency: '',
        unforeseen: '',
        postTrip: '',
      },
    },
  },
  {
    id: 'bali-backpacker',
    name: 'Backpacker Hemat Bali',
    tagline: 'Budget Petualang • 4 Hari 3 Malam',
    destination: 'Bali, Indonesia',
    style: 'backpacker',
    days: 4,
    nights: 3,
    state: {
      profile: {
        origin: 'Surabaya (SUB)',
        destination: 'Bali (DPS)',
        type: 'domestic',
        startDate: new Date().toISOString().split('T')[0],
        durationDays: 4,
        durationNights: 3,
        adults: 2,
        children: 0,
        travelStyle: 'backpacker',
        currency: 'IDR',
      },
      mainTransport: {
        tripType: 'roundTrip',
        departureTicketPerPerson: 375000,
        returnTicketPerPerson: 375000,
        isSplitTicket: false,
        ticketPricePerPerson: 750000,
        baggageCostPerPerson: 0,
        transportMode: 'pesawat',
      },
      accommodation: {
        pricePerNight: 250000, // Hostel / Guesthouse
        totalNights: 3,
        roomCount: 1,
        taxPercentage: 10,
        depositAmount: 100000,
      },
      fixedItems: [
        {
          id: 'bp-1',
          category: 'gear',
          name: 'Dry bag & Sandal Outdoor',
          cost: 150000,
          isPerPerson: false,
        },
      ],
      dailyCosts: {
        meals: {
          breakfastPerAdult: 25000,
          lunchPerAdult: 35000,
          dinnerPerAdult: 40000,
          snacksAndCoffeePerAdult: 15000,
        },
        localTransport: {
          vehicleRentalDaily: 80000, // Sewa motor
          fuelOrTransitDaily: 35000,
        },
        activities: {
          ticketsDailyPerAdult: 50000,
          ticketsDailyPerChild: 25000,
          tourGuideDaily: 0,
        },
        telecom: {
          roamingOrWifiDaily: 15000,
          devicesCount: 2,
        },
      },
      contingency: {
        souvenirBudget: 500000,
        contingencyPercent: 10,
        missedFlight: {
          enabled: false,
          cost: 1200000,
          description: 'Tiket cadangan darurat',
        },
        lostBaggage: {
          enabled: false,
          cost: 350000,
          description: 'Perlengkapan darurat',
        },
        badWeather: {
          enabled: false,
          additionalNights: 1,
          costPerNight: 300000,
          description: 'Ekstra 1 malam guesthouse',
        },
        medicalEmergency: {
          enabled: false,
          cost: 300000,
          description: 'Obat & apotek lokal',
        },
        postTripAirportToHome: 120000,
        postTripLaundry: 60000,
      },
    },
  },
  {
    id: 'japan-family',
    name: 'Liburan Impian Jepang',
    tagline: 'Tokyo & Kyoto • 7 Hari 6 Malam',
    destination: 'Tokyo - Kyoto, Jepang',
    style: 'standard',
    days: 7,
    nights: 6,
    state: {
      profile: {
        origin: 'Jakarta (CGK)',
        destination: 'Tokyo (NRT/HND)',
        type: 'international',
        startDate: new Date().toISOString().split('T')[0],
        durationDays: 7,
        durationNights: 6,
        adults: 2,
        children: 1,
        travelStyle: 'standard',
        currency: 'IDR',
      },
      mainTransport: {
        tripType: 'roundTrip',
        departureTicketPerPerson: 4250000,
        returnTicketPerPerson: 4250000,
        isSplitTicket: false,
        ticketPricePerPerson: 8500000, // Tiket PP
        baggageCostPerPerson: 600000,
        transportMode: 'pesawat',
      },
      accommodation: {
        pricePerNight: 2200000, // Hotel bintang 3-4 di Tokyo/Kyoto
        totalNights: 6,
        roomCount: 1,
        taxPercentage: 10,
        depositAmount: 1500000,
      },
      fixedItems: [
        {
          id: 'jp-1',
          category: 'document',
          name: 'E-Visa Jepang (WNI)',
          cost: 450000,
          isPerPerson: true,
        },
        {
          id: 'jp-2',
          category: 'document',
          name: 'Asuransi Perjalanan Internasional Cover Medis',
          cost: 480000,
          isPerPerson: true,
        },
        {
          id: 'jp-3',
          category: 'transport',
          name: 'Shinkansen Tokyo-Kyoto (JR Pass/Individual)',
          cost: 1650000,
          isPerPerson: true,
        },
      ],
      dailyCosts: {
        meals: {
          breakfastPerAdult: 90000, // Konbini / breakfast
          lunchPerAdult: 180000, // Ramen / Set meal
          dinnerPerAdult: 260000, // Izakaya / Restaurant
          snacksAndCoffeePerAdult: 60000, // Matcha, crepe
        },
        localTransport: {
          vehicleRentalDaily: 0,
          fuelOrTransitDaily: 140000, // Tokyo Metro / Suica card per hari
        },
        activities: {
          ticketsDailyPerAdult: 320000, // Disneyland/Universal/Museums rata-rata
          ticketsDailyPerChild: 180000,
          tourGuideDaily: 0,
        },
        telecom: {
          roamingOrWifiDaily: 65000, // eSIM / Pocket WiFi
          devicesCount: 2,
        },
      },
      contingency: {
        souvenirBudget: 4000000,
        contingencyPercent: 12,
        missedFlight: {
          enabled: false,
          cost: 7000000,
          description: 'Biaya tiket darurat rebooking rute internasional',
        },
        lostBaggage: {
          enabled: false,
          cost: 2000000,
          description: 'Pakaian ganti & mantel dingin darurat di Tokyo',
        },
        badWeather: {
          enabled: false,
          additionalNights: 1,
          costPerNight: 2400000,
          description: 'Keterlambatan badai taifun / salju, ekstra 1 malam',
        },
        medicalEmergency: {
          enabled: false,
          cost: 3000000,
          description: 'Konsultasi klinik internasional Tokyo',
        },
        postTripAirportToHome: 300000,
        postTripLaundry: 250000,
      },
    },
  },
  {
    id: 'europe-luxury',
    name: 'Wisata Mewah Eropa (Swiss & Paris)',
    tagline: 'Luxury Experience • 10 Hari 9 Malam',
    destination: 'Zurich & Paris',
    style: 'luxury',
    days: 10,
    nights: 9,
    state: {
      profile: {
        origin: 'Jakarta (CGK)',
        destination: 'Zurich (ZRH) / Paris (CDG)',
        type: 'international',
        startDate: new Date().toISOString().split('T')[0],
        durationDays: 10,
        durationNights: 9,
        adults: 2,
        children: 0,
        travelStyle: 'luxury',
        currency: 'IDR',
      },
      mainTransport: {
        tripType: 'roundTrip',
        departureTicketPerPerson: 11000000,
        returnTicketPerPerson: 11000000,
        isSplitTicket: false,
        ticketPricePerPerson: 22000000, // Business class / Premium Eco
        baggageCostPerPerson: 0,
        transportMode: 'pesawat',
      },
      accommodation: {
        pricePerNight: 6500000, // 5-Star Boutique Hotel
        totalNights: 9,
        roomCount: 1,
        taxPercentage: 12,
        depositAmount: 5000000,
      },
      fixedItems: [
        {
          id: 'eu-1',
          category: 'document',
          name: 'Visa Schengen & Biometrik',
          cost: 1850000,
          isPerPerson: true,
        },
        {
          id: 'eu-2',
          category: 'document',
          name: 'Asuransi Schengen Comprehensive €50.000',
          cost: 850000,
          isPerPerson: true,
        },
        {
          id: 'eu-3',
          category: 'transport',
          name: 'Swiss Travel Pass 1st Class',
          cost: 8200000,
          isPerPerson: true,
        },
      ],
      dailyCosts: {
        meals: {
          breakfastPerAdult: 350000,
          lunchPerAdult: 650000, // Fine bistro
          dinnerPerAdult: 1200000, // Michelin guide / Gourmet
          snacksAndCoffeePerAdult: 180000,
        },
        localTransport: {
          vehicleRentalDaily: 1500000, // Chauffeur / Luxury rental
          fuelOrTransitDaily: 350000,
        },
        activities: {
          ticketsDailyPerAdult: 850000, // Jungfraujoch, Louvre VIP, private cruise
          ticketsDailyPerChild: 450000,
          tourGuideDaily: 1800000, // Private English/Indonesian guide
        },
        telecom: {
          roamingOrWifiDaily: 90000,
          devicesCount: 2,
        },
      },
      contingency: {
        souvenirBudget: 15000000,
        contingencyPercent: 15,
        missedFlight: {
          enabled: false,
          cost: 15000000,
          description: 'Rebooking tiket first/business class darurat',
        },
        lostBaggage: {
          enabled: false,
          cost: 5000000,
          description: 'Perlengkapan musim dingin desainer esensial',
        },
        badWeather: {
          enabled: false,
          additionalNights: 1,
          costPerNight: 7000000,
          description: '1 malam darurat chalet pegunungan',
        },
        medicalEmergency: {
          enabled: false,
          cost: 6000000,
          description: 'Pelayanan dokter privat Eropa',
        },
        postTripAirportToHome: 650000,
        postTripLaundry: 400000,
      },
    },
  },
];

/**
 * Returns recommended baseline figures when the user changes travel style.
 */
export function getStyleRecommendations(style: TravelStyle, isInternational: boolean, currency: CurrencyCode) {
  // Baseline values in IDR, can be scaled if needed
  if (style === 'backpacker') {
    return {
      hotelPerNight: isInternational ? 600000 : 250000,
      breakfast: isInternational ? 50000 : 25000,
      lunch: isInternational ? 80000 : 35000,
      dinner: isInternational ? 100000 : 40000,
      snacks: isInternational ? 35000 : 15000,
      contingencyPercent: 10,
    };
  } else if (style === 'luxury') {
    return {
      hotelPerNight: isInternational ? 5500000 : 2500000,
      breakfast: isInternational ? 300000 : 150000,
      lunch: isInternational ? 550000 : 280000,
      dinner: isInternational ? 950000 : 450000,
      snacks: isInternational ? 150000 : 80000,
      contingencyPercent: 15,
    };
  }
  // Standard
  return {
    hotelPerNight: isInternational ? 1800000 : 750000,
    breakfast: isInternational ? 90000 : 45000,
    lunch: isInternational ? 150000 : 75000,
    dinner: isInternational ? 220000 : 110000,
    snacks: isInternational ? 50000 : 35000,
    contingencyPercent: 10,
  };
}
