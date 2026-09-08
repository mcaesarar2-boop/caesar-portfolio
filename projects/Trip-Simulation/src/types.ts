export type CurrencyCode = 'IDR' | 'USD' | 'EUR' | 'JPY' | 'SGD' | 'MYR' | 'AUD' | 'GBP';

export type TravelStyle = 'backpacker' | 'standard' | 'luxury';

export type DestinationType = 'domestic' | 'international';

export interface FixedCostItem {
  id: string;
  category: 'document' | 'transport' | 'gear' | 'other';
  name: string;
  cost: number;
  isPerPerson: boolean;
  notes?: string;
}

export interface TripProfile {
  origin: string;
  destination: string;
  type: DestinationType;
  startDate: string;
  durationDays: number;
  durationNights: number;
  adults: number;
  children: number; // Children counted as 50% of adult food consumption
  travelStyle: TravelStyle;
  currency: CurrencyCode;
}

export interface AccommodationCost {
  pricePerNight: number;
  totalNights: number;
  roomCount: number;
  taxPercentage: number;
  depositAmount: number; // Marked as refundable
}

export interface TransportAddon {
  id: string;
  name: string;
  cost: number;
  isPerPerson: boolean; // true = dikalikan per orang, false = lump sum / per rombongan
  category?: string;
}

export type FlightClass = 'economy' | 'premium_economy' | 'business' | 'first_class';
export type TrainClass = 'ekonomi' | 'bisnis' | 'eksekutif' | 'luxury_sleeper';
export type BusClass = 'ekonomi' | 'vip_executive' | 'super_executive' | 'sleeper' | 'shuttle_travel';
export type ShipClass = 'ekonomi' | 'tatami' | 'kabin_2' | 'kabin_1' | 'vip' | 'kendaraan';
export type CarOwnership = 'pribadi' | 'sewa';
export type CarType = 'city_car' | 'mpv_suv' | 'ev' | 'diesel' | 'lainnya';
export type CarRentalType = 'lepas_kunci' | 'dengan_supir';

export interface MainTransportCost {
  tripType: 'roundTrip' | 'oneWay'; // Opsi Pulang-Pergi atau Satu Arah
  transportMode: 'pesawat' | 'kereta' | 'bus' | 'mobil_pribadi' | 'kapal' | 'lainnya';
  departureTicketPerPerson: number; // Harga tiket berangkat per orang
  returnTicketPerPerson: number; // Harga tiket pulang per orang (jika pulang-pergi)
  isSplitTicket: boolean; // True jika input tiket berangkat & pulang dipisah
  ticketPricePerPerson: number; // Total harga tiket per orang
  baggageCostPerPerson: number;

  // Kelas Transportasi
  flightClass?: FlightClass;
  trainClass?: TrainClass;
  busClass?: BusClass;
  shipClass?: ShipClass;

  // Konfigurasi Mobil (Pribadi vs Sewa)
  carOwnership?: CarOwnership;
  carType?: CarType;
  // Mobil Pribadi
  carFuelCost?: number; // Biaya Bensin / BBM
  carTollCost?: number; // Biaya Tol
  carParkingCost?: number; // Biaya Parkir & Retribusi Destinasi
  carMaintenanceCost?: number; // Servis pra-jalan / ganti oli / cek ban
  // Mobil Sewa / Rental
  rentalType?: CarRentalType; // Lepas kunci vs Dengan supir
  rentalCarModel?: string; // e.g. Avanza / Innova / HiAce
  rentalDailyRate?: number; // Tarif sewa per hari
  rentalDays?: number; // Jumlah hari sewa
  rentalDriverAllowanceDaily?: number; // Uang makan & tips supir per hari
  rentalFuelCost?: number; // Estimasi Bensin selama sewa
  rentalTollAndParking?: number; // Biaya Tol & Parkir selama sewa
  rentalDeposit?: number; // Uang jaminan sewa (refundable)

  // Add-on Tambahan Dinamis (Nama & Harga Manual)
  addons?: TransportAddon[];
}

export interface DailyVariableCosts {
  meals: {
    breakfastPerAdult: number;
    lunchPerAdult: number;
    dinnerPerAdult: number;
    snacksAndCoffeePerAdult: number;
  };
  localTransport: {
    vehicleRentalDaily: number;
    fuelOrTransitDaily: number;
  };
  activities: {
    ticketsDailyPerAdult: number;
    ticketsDailyPerChild: number;
    tourGuideDaily: number;
  };
  telecom: {
    roamingOrWifiDaily: number;
    devicesCount: number;
  };
}

export interface UnforeseenScenario {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  cost: number;
  iconName: string;
}

export interface ContingencyAndRisks {
  souvenirBudget: number;
  contingencyPercent: number; // 5% - 25%
  // Skenario "Sial"
  missedFlight: {
    enabled: boolean;
    cost: number;
    description: string;
  };
  lostBaggage: {
    enabled: boolean;
    cost: number;
    description: string;
  };
  badWeather: {
    enabled: boolean;
    additionalNights: number;
    costPerNight: number;
    description: string;
  };
  medicalEmergency: {
    enabled: boolean;
    cost: number;
    description: string;
  };
  // Post trip
  postTripAirportToHome: number;
  postTripLaundry: number;
}

export interface SectionNotes {
  mainTransport?: string;
  accommodation?: string;
  documentsAndPrep?: string;
  fixedCosts?: string;
  meals?: string;
  localTransport?: string;
  activities?: string;
  telecom?: string;
  souvenirs?: string;
  contingency?: string;
  unforeseen?: string;
  postTrip?: string;
}

export interface TripState {
  profile: TripProfile;
  mainTransport: MainTransportCost;
  accommodation: AccommodationCost;
  fixedItems: FixedCostItem[];
  dailyCosts: DailyVariableCosts;
  contingency: ContingencyAndRisks;
  notes?: SectionNotes;
}

export interface CategoryBreakdownItem {
  id: string;
  name: string;
  amount: number;
  color: string;
  percentage: number;
  icon: string;
}

export interface SafetyScore {
  status: 'safe' | 'vulnerable' | 'risky';
  label: string;
  badgeClass: string;
  description: string;
  contingencyRatio: number; // % of contingency vs core expenses
  recommendations: string[];
}

export interface CalculationResults {
  // Pre-Trip Phase
  documentsAndPrepCost: number;
  mainTransportTotal: number;
  preTripTotal: number;

  // On-Trip Phase
  accommodationRentTotal: number;
  accommodationTaxTotal: number;
  accommodationTotal: number;
  refundableDepositTotal: number;
  
  // Daily variable aggregates
  dailyMealsTotal: number;
  dailyLocalTransportTotal: number;
  dailyActivitiesTotal: number;
  dailyTelecomTotal: number;
  dailyExpensesGrandTotal: number;

  // Contingency & Extras
  souvenirBudgetTotal: number;
  contingencyFundAmount: number;
  unforeseenScenarioTotal: number;
  onTripTotal: number;

  // Post-Trip Phase
  postTripTotal: number;

  // Core & Totals
  totalCoreExpense: number; // Pre + On (without deposit, contingency, scenarios) + Post
  totalWithoutScenarios: number;
  grandTotalWithScenarios: number;
  netEffectiveExpense: number; // Total spending excluding refundable deposits

  // Per Person Breakdown
  effectiveParticipantsWeight: number; // adults + (children * 0.5) for meals
  costPerAdult: number;
  costPerChild: number;

  // Visual Breakdowns
  categoryBreakdown: CategoryBreakdownItem[];
  timelineBreakdown: {
    phase: string;
    amount: number;
    percentage: number;
    items: { label: string; amount: number }[];
  }[];

  safetyScore: SafetyScore;
}
