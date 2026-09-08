import { CurrencyCode, DestinationType, TravelStyle } from '../types';
import { convertCurrency, formatCurrency } from './currency';

export interface SearchQueryLink {
  id: string;
  title: string;
  category: 'flight' | 'hotel' | 'food' | 'activities';
  description: string;
  url: string;
  badge: string;
}

/**
 * Generate direct search engine queries for real-world price checks.
 * Works without API keys by launching direct search queries in Google Flights, Google Search, and travel aggregators.
 */
export function getSearchQueryLinks(
  origin: string,
  destination: string,
  type: DestinationType
): SearchQueryLink[] {
  const cleanOrigin = encodeURIComponent(origin || 'Jakarta');
  const cleanDest = encodeURIComponent(destination || 'Bali');
  const cleanDestRaw = destination || 'Bali';

  return [
    {
      id: 'google-flights',
      title: 'Cek Tiket di Google Flights',
      category: 'flight',
      description: `Bandingkan jadwal & harga tiket resmi dari ${origin || 'Asal'} ke ${destination || 'Tujuan'}`,
      url: `https://www.google.com/travel/flights?q=flights+from+${cleanOrigin}+to+${cleanDest}`,
      badge: 'Google Flights',
    },
    {
      id: 'google-search-tickets',
      title: 'Cari Promo Tiket di Google Search',
      category: 'flight',
      description: `Telusuri kisaran harga tiket pesawat/kereta terbaru`,
      url: `https://www.google.com/search?q=${encodeURIComponent(
        `harga tiket pesawat atau kereta dari ${cleanDestRaw} promo terbaru`
      )}`,
      badge: 'Google Search',
    },
    {
      id: 'google-hotels',
      title: 'Cek Tarif Hotel di Google Hotels',
      category: 'hotel',
      description: `Lihat harga per malam kamar hotel & penginapan di ${cleanDestRaw}`,
      url: `https://www.google.com/travel/hotels/${cleanDest}`,
      badge: 'Google Hotels',
    },
    {
      id: 'google-food-cost',
      title: 'Cek Biaya Makan & Hidup Harian',
      category: 'food',
      description: `Rata-rata harga makanan, kuliner lokal, & biaya hidup turis di ${cleanDestRaw}`,
      url: `https://www.google.com/search?q=${encodeURIComponent(
        `biaya makan harian budget wisata di ${cleanDestRaw}`
      )}`,
      badge: 'Google Search',
    },
    {
      id: 'google-activities-cost',
      title: 'Cek Harga Tiket Wisata & Atraksi',
      category: 'activities',
      description: `Harga tiket masuk destinasi wisata populer & paket tour di ${cleanDestRaw}`,
      url: `https://www.google.com/search?q=${encodeURIComponent(
        `harga tiket masuk wisata populer di ${cleanDestRaw}`
      )}`,
      badge: 'Google Search',
    },
  ];
}

export interface OfflineBenchmark {
  label: string;
  category: string;
  suggestedTicketOneWay: number; // in IDR
  suggestedTicketRoundTrip: number; // in IDR
  suggestedHotelPerNight: number; // in IDR
  suggestedMealDailyPerAdult: number; // in IDR
}

/**
 * Offline Quick Benchmarks (Estimasi Acuan Cepat Murni Offline)
 * Berdasarkan gaya liburan dan rute domestik/internasional.
 */
export function getOfflineBenchmarks(
  type: DestinationType,
  style: TravelStyle,
  currency: CurrencyCode
): OfflineBenchmark {
  const isDomestic = type === 'domestic';

  let ticketOneWay = 0;
  let hotelPerNight = 0;
  let mealDaily = 0;

  if (isDomestic) {
    if (style === 'backpacker') {
      ticketOneWay = 450000;
      hotelPerNight = 250000;
      mealDaily = 110000;
    } else if (style === 'luxury') {
      ticketOneWay = 2500000;
      hotelPerNight = 2500000;
      mealDaily = 650000;
    } else {
      ticketOneWay = 950000;
      hotelPerNight = 750000;
      mealDaily = 250000;
    }
  } else {
    // International
    if (style === 'backpacker') {
      ticketOneWay = 1800000;
      hotelPerNight = 600000;
      mealDaily = 250000;
    } else if (style === 'luxury') {
      ticketOneWay = 12000000;
      hotelPerNight = 5000000;
      mealDaily = 1800000;
    } else {
      ticketOneWay = 4500000;
      hotelPerNight = 1800000;
      mealDaily = 600000;
    }
  }

  const conv = (idr: number) => Math.round(convertCurrency(idr, 'IDR', currency));

  return {
    label: `${isDomestic ? 'Domestik' : 'Internasional'} - ${style.toUpperCase()}`,
    category: style,
    suggestedTicketOneWay: conv(ticketOneWay),
    suggestedTicketRoundTrip: conv(ticketOneWay * 2),
    suggestedHotelPerNight: conv(hotelPerNight),
    suggestedMealDailyPerAdult: conv(mealDaily),
  };
}
