import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TripState, FixedCostItem, TravelStyle, CurrencyCode, CalculationResults, TransportAddon, ActivityItem, SectionNotes } from '../types';
import { DEFAULT_INITIAL_STATE, TRIP_PRESETS, getStyleRecommendations } from '../utils/presets';
import { useTripCalculator } from '../hooks/useTripCalculator';
import { convertCurrency } from '../utils/currency';
import { calculateDurationFromDates, addDaysToDateStr, isValidDateStr } from '../utils/dateUtils';
import { ToastData } from '../components/ToastNotification';

interface TripContextType {
  state: TripState;
  activeStep: number;
  setActiveStep: (step: number) => void;
  calculations: CalculationResults;
  updateProfile: (profile: Partial<TripState['profile']>) => void;
  updateMainTransport: (transport: Partial<TripState['mainTransport']>) => void;
  addTransportAddon: (addon: Omit<TransportAddon, 'id'>) => void;
  removeTransportAddon: (addonId: string) => void;
  updateTransportAddon: (addonId: string, update: Partial<TransportAddon>) => void;
  updateAccommodation: (accommodation: Partial<TripState['accommodation']>) => void;
  addFixedItem: (item: Omit<FixedCostItem, 'id'>) => void;
  updateFixedItem: (id: string, item: Partial<FixedCostItem>) => void;
  removeFixedItem: (id: string) => void;
  updateDailyCosts: (daily: Partial<TripState['dailyCosts']>) => void;
  updateMeals: (meals: Partial<TripState['dailyCosts']['meals']>) => void;
  updateLocalTransport: (transport: Partial<TripState['dailyCosts']['localTransport']>) => void;
  updateActivities: (activities: Partial<TripState['dailyCosts']['activities']>) => void;
  addActivityItem: (item: Omit<ActivityItem, 'id'>) => void;
  updateActivityItem: (id: string, update: Partial<ActivityItem>) => void;
  removeActivityItem: (id: string) => void;
  updateTelecom: (telecom: Partial<TripState['dailyCosts']['telecom']>) => void;
  updateContingency: (contingency: Partial<TripState['contingency']>) => void;
  updateSectionNote: (sectionKey: keyof SectionNotes, note: string) => void;
  setCurrency: (currency: CurrencyCode) => void;
  applyTravelStyle: (style: TravelStyle) => void;
  loadPreset: (presetId: string) => void;
  resetAll: () => void;
  lastImportedFlight: ToastData | null;
  clearLastImportedFlight: () => void;
  importFlightData: (data: {
    airline?: string;
    price: number;
    tripType?: 'roundTrip' | 'oneWay';
    departureDate?: string;
    returnDate?: string;
  }) => void;
}

const STORAGE_KEY = 'simulasi_perjalanan_ekstensif_v2';

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<TripState>(() => {
    try {
      // Clean up legacy cache with dummy data
      localStorage.removeItem('simulasi_perjalanan_ekstensif_v1');

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure structure has required keys
        return {
          ...DEFAULT_INITIAL_STATE,
          ...parsed,
          profile: { ...DEFAULT_INITIAL_STATE.profile, ...(parsed.profile || {}) },
          mainTransport: { ...DEFAULT_INITIAL_STATE.mainTransport, ...(parsed.mainTransport || {}) },
          accommodation: { ...DEFAULT_INITIAL_STATE.accommodation, ...(parsed.accommodation || {}) },
          dailyCosts: {
            meals: { ...DEFAULT_INITIAL_STATE.dailyCosts.meals, ...(parsed.dailyCosts?.meals || {}) },
            localTransport: { ...DEFAULT_INITIAL_STATE.dailyCosts.localTransport, ...(parsed.dailyCosts?.localTransport || {}) },
            activities: { ...DEFAULT_INITIAL_STATE.dailyCosts.activities, ...(parsed.dailyCosts?.activities || {}) },
            telecom: { ...DEFAULT_INITIAL_STATE.dailyCosts.telecom, ...(parsed.dailyCosts?.telecom || {}) },
          },
          contingency: {
            ...DEFAULT_INITIAL_STATE.contingency,
            ...(parsed.contingency || {}),
            missedFlight: { ...DEFAULT_INITIAL_STATE.contingency.missedFlight, ...(parsed.contingency?.missedFlight || {}) },
            lostBaggage: { ...DEFAULT_INITIAL_STATE.contingency.lostBaggage, ...(parsed.contingency?.lostBaggage || {}) },
            badWeather: { ...DEFAULT_INITIAL_STATE.contingency.badWeather, ...(parsed.contingency?.badWeather || {}) },
            medicalEmergency: { ...DEFAULT_INITIAL_STATE.contingency.medicalEmergency, ...(parsed.contingency?.medicalEmergency || {}) },
          },
          fixedItems: parsed.fixedItems || DEFAULT_INITIAL_STATE.fixedItems,
          notes: { ...DEFAULT_INITIAL_STATE.notes, ...(parsed.notes || {}) },
        };
      }
    } catch (e) {
      console.error('Failed to restore from localStorage:', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_INITIAL_STATE));
  });

  const [activeStep, setActiveStep] = useState<number>(1);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [state]);

  // Synchronize durationNights with accommodation.totalNights if duration changes and followTripDuration is active
  useEffect(() => {
    if (state.accommodation.followTripDuration !== false) {
      const expectedCheckOut = state.profile.endDate || addDaysToDateStr(state.profile.startDate, state.profile.durationNights);
      if (
        state.accommodation.totalNights !== state.profile.durationNights ||
        state.accommodation.checkInDate !== state.profile.startDate ||
        state.accommodation.checkOutDate !== expectedCheckOut
      ) {
        setState((prev) => ({
          ...prev,
          accommodation: {
            ...prev.accommodation,
            totalNights: prev.profile.durationNights,
            checkInDate: prev.profile.startDate,
            checkOutDate: expectedCheckOut,
          },
        }));
      }
    }
  }, [
    state.profile.durationNights,
    state.profile.startDate,
    state.profile.endDate,
    state.accommodation.followTripDuration,
  ]);

  const calculations = useTripCalculator(state);

  const updateProfile = (profileUpdate: Partial<TripState['profile']>) => {
    setState((prev) => {
      const nextProfile = { ...prev.profile, ...profileUpdate };

      // Case 1: Jika startDate dan endDate keduanya diubah atau salah satu diubah dan keduanya valid
      if (profileUpdate.startDate !== undefined || profileUpdate.endDate !== undefined) {
        const sDate = profileUpdate.startDate !== undefined ? profileUpdate.startDate : nextProfile.startDate;
        const eDate = profileUpdate.endDate !== undefined ? profileUpdate.endDate : nextProfile.endDate;

        if (sDate && eDate && isValidDateStr(sDate) && isValidDateStr(eDate)) {
          // Hanya hitung ulang durasi jika tanggal diubah oleh user
          if (profileUpdate.durationDays === undefined && profileUpdate.durationNights === undefined) {
            const { days, nights } = calculateDurationFromDates(sDate, eDate);
            nextProfile.durationDays = days;
            nextProfile.durationNights = nights;
          }
        } else if (sDate && (!eDate || !isValidDateStr(eDate)) && nextProfile.durationNights > 0) {
          nextProfile.endDate = addDaysToDateStr(sDate, nextProfile.durationNights);
        }
      }

      // Case 2: Jika durationDays atau durationNights diubah secara eksplisit
      if (profileUpdate.durationDays !== undefined && profileUpdate.durationNights === undefined) {
        nextProfile.durationNights = Math.max(0, profileUpdate.durationDays - 1);
        if (nextProfile.startDate) {
          nextProfile.endDate = addDaysToDateStr(nextProfile.startDate, nextProfile.durationNights);
        }
      } else if (profileUpdate.durationNights !== undefined && profileUpdate.durationDays === undefined) {
        nextProfile.durationDays = nextProfile.durationNights === 0 ? 1 : nextProfile.durationNights + 1;
        if (nextProfile.startDate) {
          nextProfile.endDate = addDaysToDateStr(nextProfile.startDate, nextProfile.durationNights);
        }
      }

      return {
        ...prev,
        profile: nextProfile,
      };
    });
  };

  const updateMainTransport = (transportUpdate: Partial<TripState['mainTransport']>) => {
    setState((prev) => ({
      ...prev,
      mainTransport: { ...prev.mainTransport, ...transportUpdate },
    }));
  };

  const addTransportAddon = (addon: Omit<TransportAddon, 'id'>) => {
    const newAddon: TransportAddon = {
      ...addon,
      id: `addon-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setState((prev) => ({
      ...prev,
      mainTransport: {
        ...prev.mainTransport,
        addons: [...(prev.mainTransport.addons || []), newAddon],
      },
    }));
  };

  const removeTransportAddon = (addonId: string) => {
    setState((prev) => ({
      ...prev,
      mainTransport: {
        ...prev.mainTransport,
        addons: (prev.mainTransport.addons || []).filter((a) => a.id !== addonId),
      },
    }));
  };

  const updateTransportAddon = (addonId: string, update: Partial<TransportAddon>) => {
    setState((prev) => ({
      ...prev,
      mainTransport: {
        ...prev.mainTransport,
        addons: (prev.mainTransport.addons || []).map((a) =>
          a.id === addonId ? { ...a, ...update } : a
        ),
      },
    }));
  };

  const updateAccommodation = (accUpdate: Partial<TripState['accommodation']>) => {
    setState((prev) => ({
      ...prev,
      accommodation: { ...prev.accommodation, ...accUpdate },
    }));
  };

  const addFixedItem = (item: Omit<FixedCostItem, 'id'>) => {
    const newItem: FixedCostItem = {
      ...item,
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setState((prev) => ({
      ...prev,
      fixedItems: [...prev.fixedItems, newItem],
    }));
  };

  const updateFixedItem = (id: string, itemUpdate: Partial<FixedCostItem>) => {
    setState((prev) => ({
      ...prev,
      fixedItems: prev.fixedItems.map((item) =>
        item.id === id ? { ...item, ...itemUpdate } : item
      ),
    }));
  };

  const removeFixedItem = (id: string) => {
    setState((prev) => ({
      ...prev,
      fixedItems: prev.fixedItems.filter((item) => item.id !== id),
    }));
  };

  const updateDailyCosts = (dailyUpdate: Partial<TripState['dailyCosts']>) => {
    setState((prev) => ({
      ...prev,
      dailyCosts: { ...prev.dailyCosts, ...dailyUpdate },
    }));
  };

  const updateMeals = (mealsUpdate: Partial<TripState['dailyCosts']['meals']>) => {
    setState((prev) => ({
      ...prev,
      dailyCosts: {
        ...prev.dailyCosts,
        meals: { ...prev.dailyCosts.meals, ...mealsUpdate },
      },
    }));
  };

  const updateLocalTransport = (transUpdate: Partial<TripState['dailyCosts']['localTransport']>) => {
    setState((prev) => ({
      ...prev,
      dailyCosts: {
        ...prev.dailyCosts,
        localTransport: { ...prev.dailyCosts.localTransport, ...transUpdate },
      },
    }));
  };

  const updateActivities = (actUpdate: Partial<TripState['dailyCosts']['activities']>) => {
    setState((prev) => ({
      ...prev,
      dailyCosts: {
        ...prev.dailyCosts,
        activities: { ...prev.dailyCosts.activities, ...actUpdate },
      },
    }));
  };

  const addActivityItem = (item: Omit<ActivityItem, 'id'>) => {
    const newItem: ActivityItem = {
      ...item,
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setState((prev) => ({
      ...prev,
      dailyCosts: {
        ...prev.dailyCosts,
        activities: {
          ...prev.dailyCosts.activities,
          items: [...(prev.dailyCosts.activities.items || []), newItem],
        },
      },
    }));
  };

  const updateActivityItem = (id: string, update: Partial<ActivityItem>) => {
    setState((prev) => ({
      ...prev,
      dailyCosts: {
        ...prev.dailyCosts,
        activities: {
          ...prev.dailyCosts.activities,
          items: (prev.dailyCosts.activities.items || []).map((item) =>
            item.id === id ? { ...item, ...update } : item
          ),
        },
      },
    }));
  };

  const removeActivityItem = (id: string) => {
    setState((prev) => ({
      ...prev,
      dailyCosts: {
        ...prev.dailyCosts,
        activities: {
          ...prev.dailyCosts.activities,
          items: (prev.dailyCosts.activities.items || []).filter((item) => item.id !== id),
        },
      },
    }));
  };

  const updateTelecom = (telecomUpdate: Partial<TripState['dailyCosts']['telecom']>) => {
    setState((prev) => ({
      ...prev,
      dailyCosts: {
        ...prev.dailyCosts,
        telecom: { ...prev.dailyCosts.telecom, ...telecomUpdate },
      },
    }));
  };

  const updateContingency = (contUpdate: Partial<TripState['contingency']>) => {
    setState((prev) => ({
      ...prev,
      contingency: { ...prev.contingency, ...contUpdate },
    }));
  };

  const updateSectionNote = (sectionKey: keyof SectionNotes, note: string) => {
    setState((prev) => ({
      ...prev,
      notes: {
        ...(prev.notes || {}),
        [sectionKey]: note,
      },
    }));
  };

  const setCurrency = (newCurrency: CurrencyCode) => {
    const prevCurrency = state.profile.currency;
    if (newCurrency === prevCurrency) return;

    // Convert values
    setState((prev) => {
      const convert = (val: number) => Math.round(convertCurrency(val, prevCurrency, newCurrency));

      return {
        ...prev,
        profile: {
          ...prev.profile,
          currency: newCurrency,
        },
        mainTransport: {
          ...prev.mainTransport,
          ticketPricePerPerson: convert(prev.mainTransport.ticketPricePerPerson),
          baggageCostPerPerson: convert(prev.mainTransport.baggageCostPerPerson),
        },
        accommodation: {
          ...prev.accommodation,
          pricePerNight: convert(prev.accommodation.pricePerNight),
          depositAmount: convert(prev.accommodation.depositAmount),
        },
        fixedItems: prev.fixedItems.map((item) => ({
          ...item,
          cost: convert(item.cost),
        })),
        dailyCosts: {
          meals: {
            breakfastPerAdult: convert(prev.dailyCosts.meals.breakfastPerAdult),
            lunchPerAdult: convert(prev.dailyCosts.meals.lunchPerAdult),
            dinnerPerAdult: convert(prev.dailyCosts.meals.dinnerPerAdult),
            snacksAndCoffeePerAdult: convert(prev.dailyCosts.meals.snacksAndCoffeePerAdult),
          },
          localTransport: {
            vehicleRentalDaily: convert(prev.dailyCosts.localTransport.vehicleRentalDaily),
            fuelOrTransitDaily: convert(prev.dailyCosts.localTransport.fuelOrTransitDaily),
          },
          activities: {
            ticketsDailyPerAdult: convert(prev.dailyCosts.activities.ticketsDailyPerAdult),
            ticketsDailyPerChild: convert(prev.dailyCosts.activities.ticketsDailyPerChild),
            tourGuideDaily: convert(prev.dailyCosts.activities.tourGuideDaily),
          },
          telecom: {
            roamingOrWifiDaily: convert(prev.dailyCosts.telecom.roamingOrWifiDaily),
            devicesCount: prev.dailyCosts.telecom.devicesCount,
          },
        },
        contingency: {
          ...prev.contingency,
          souvenirBudget: convert(prev.contingency.souvenirBudget),
          missedFlight: {
            ...prev.contingency.missedFlight,
            cost: convert(prev.contingency.missedFlight.cost),
          },
          lostBaggage: {
            ...prev.contingency.lostBaggage,
            cost: convert(prev.contingency.lostBaggage.cost),
          },
          badWeather: {
            ...prev.contingency.badWeather,
            costPerNight: convert(prev.contingency.badWeather.costPerNight),
          },
          medicalEmergency: {
            ...prev.contingency.medicalEmergency,
            cost: convert(prev.contingency.medicalEmergency.cost),
          },
          postTripAirportToHome: convert(prev.contingency.postTripAirportToHome),
          postTripLaundry: convert(prev.contingency.postTripLaundry),
        },
      };
    });
  };

  const applyTravelStyle = (style: TravelStyle) => {
    const isInternational = state.profile.type === 'international';
    const recs = getStyleRecommendations(style, isInternational, state.profile.currency);

    // Convert from IDR to current currency
    const conv = (idr: number) =>
      Math.round(convertCurrency(idr, 'IDR', state.profile.currency));

    setState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        travelStyle: style,
      },
      accommodation: {
        ...prev.accommodation,
        pricePerNight: conv(recs.hotelPerNight),
      },
      dailyCosts: {
        ...prev.dailyCosts,
        meals: {
          breakfastPerAdult: conv(recs.breakfast),
          lunchPerAdult: conv(recs.lunch),
          dinnerPerAdult: conv(recs.dinner),
          snacksAndCoffeePerAdult: conv(recs.snacks),
        },
      },
      contingency: {
        ...prev.contingency,
        contingencyPercent: recs.contingencyPercent,
      },
    }));
  };

  const loadPreset = (presetId: string) => {
    const preset = TRIP_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setState(JSON.parse(JSON.stringify(preset.state)));
      setActiveStep(1);
    }
  };

  const resetAll = () => {
    setState(JSON.parse(JSON.stringify(DEFAULT_INITIAL_STATE)));
    setActiveStep(1);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('simulasi_perjalanan_ekstensif_v1');
  };

  const [lastImportedFlight, setLastImportedFlight] = useState<ToastData | null>(null);

  const clearLastImportedFlight = () => {
    setLastImportedFlight(null);
  };

  const importFlightData = (data: {
    airline?: string;
    price: number | string;
    tripType?: 'roundTrip' | 'oneWay';
    departureDate?: string;
    returnDate?: string;
    origin?: string;
    destination?: string;
  }) => {
    if (!data) return;
    const rawPrice = typeof data.price === 'number' ? data.price : parseInt(String(data.price).replace(/[^\d]/g, ''), 10);
    if (!rawPrice || isNaN(rawPrice) || rawPrice <= 0) return;

    const isRoundTrip = data.tripType !== 'oneWay';
    const price = Math.round(rawPrice);

    // 1. Update main transport to flight with scraped price & type
    updateMainTransport({
      tripType: isRoundTrip ? 'roundTrip' : 'oneWay',
      transportMode: 'pesawat',
      ticketPricePerPerson: price,
      departureTicketPerPerson: isRoundTrip ? Math.round(price / 2) : price,
      returnTicketPerPerson: isRoundTrip ? Math.round(price / 2) : 0,
    });

    // 2. Update profile dates, duration, & route if available
    const profileUpdate: Partial<TripState['profile']> = {};
    if (data.departureDate && isValidDateStr(data.departureDate)) {
      profileUpdate.startDate = data.departureDate;
      if (data.returnDate && isValidDateStr(data.returnDate) && isRoundTrip) {
        profileUpdate.endDate = data.returnDate;
        const { days, nights } = calculateDurationFromDates(data.departureDate, data.returnDate);
        profileUpdate.durationDays = days;
        profileUpdate.durationNights = nights;
      }
    }
    if (data.origin && (!state.profile.origin || state.profile.origin === 'Kota Asal' || state.profile.origin === 'Jakarta')) {
      profileUpdate.origin = data.origin;
    }
    if (data.destination && (!state.profile.destination || state.profile.destination === 'Kota Tujuan' || state.profile.destination === 'Bali')) {
      profileUpdate.destination = data.destination;
    }
    if (Object.keys(profileUpdate).length > 0) {
      updateProfile(profileUpdate);
    }

    // 3. Show visual confirmation toast
    setLastImportedFlight({
      airline: data.airline || 'Google Flights',
      price: price,
      tripType: isRoundTrip ? 'roundTrip' : 'oneWay',
      departureDate: data.departureDate,
      returnDate: data.returnDate,
      currency: state.profile.currency,
    });
  };

  // Auto-dismiss toast notification after 6 seconds
  useEffect(() => {
    if (lastImportedFlight) {
      const timer = setTimeout(() => {
        setLastImportedFlight(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [lastImportedFlight]);

  // Global listeners for Chrome Extension Companion Bridge, postMessage, and localStorage sync
  useEffect(() => {
    const handleFlightPayload = (payload: any) => {
      if (!payload) return;
      importFlightData(payload);
    };

    // 1. Listen for CustomEvent from extension content script bridge
    const handleCustomEvent = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent && customEvent.detail) {
        handleFlightPayload(customEvent.detail);
      }
    };
    window.addEventListener('trip-sim-flight-import', handleCustomEvent);

    // 2. Listen for postMessage from Mini Window popup or bridge
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'TRIP_SIMULATION_IMPORT_FLIGHT' && event.data.payload) {
        handleFlightPayload(event.data.payload);
      }
    };
    window.addEventListener('message', handleMessage);

    // 3. Listen for BroadcastChannel
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('trip_simulation_flight_sync');
      channel.onmessage = (event) => {
        if (event.data && event.data.type === 'TRIP_SIMULATION_IMPORT_FLIGHT' && event.data.payload) {
          handleFlightPayload(event.data.payload);
        }
      };
    } catch (e) {}

    // 4. Listen for StorageEvent (in case cross-tab localStorage was used)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'trip_sim_imported_flight' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          handleFlightPayload(parsed);
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('trip-sim-flight-import', handleCustomEvent);
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('storage', handleStorage);
      if (channel) channel.close();
    };
  }, [state.profile.currency, state.profile.origin, state.profile.destination]);

  return (
    <TripContext.Provider
      value={{
        state,
        activeStep,
        setActiveStep,
        calculations,
        updateProfile,
        updateMainTransport,
        addTransportAddon,
        removeTransportAddon,
        updateTransportAddon,
        updateAccommodation,
        addFixedItem,
        updateFixedItem,
        removeFixedItem,
        updateDailyCosts,
        updateMeals,
        updateLocalTransport,
        updateActivities,
        addActivityItem,
        updateActivityItem,
        removeActivityItem,
        updateTelecom,
        updateContingency,
        updateSectionNote,
        setCurrency,
        applyTravelStyle,
        loadPreset,
        resetAll,
        lastImportedFlight,
        clearLastImportedFlight,
        importFlightData,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export function useTripContext(): TripContextType {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTripContext must be used within a TripProvider');
  }
  return context;
}
