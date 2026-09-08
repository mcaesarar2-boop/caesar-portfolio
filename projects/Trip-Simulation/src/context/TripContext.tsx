import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TripState, FixedCostItem, TravelStyle, CurrencyCode, CalculationResults, TransportAddon, SectionNotes } from '../types';
import { DEFAULT_INITIAL_STATE, TRIP_PRESETS, getStyleRecommendations } from '../utils/presets';
import { useTripCalculator } from '../hooks/useTripCalculator';
import { convertCurrency } from '../utils/currency';

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
  updateTelecom: (telecom: Partial<TripState['dailyCosts']['telecom']>) => void;
  updateContingency: (contingency: Partial<TripState['contingency']>) => void;
  updateSectionNote: (sectionKey: keyof SectionNotes, note: string) => void;
  setCurrency: (currency: CurrencyCode) => void;
  applyTravelStyle: (style: TravelStyle) => void;
  loadPreset: (presetId: string) => void;
  resetAll: () => void;
}

const STORAGE_KEY = 'simulasi_perjalanan_ekstensif_v1';

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<TripState>(() => {
    try {
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
    return DEFAULT_INITIAL_STATE;
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

  // Synchronize durationNights with accommodation.totalNights if duration changes
  useEffect(() => {
    if (state.accommodation.totalNights !== state.profile.durationNights) {
      setState((prev) => ({
        ...prev,
        accommodation: {
          ...prev.accommodation,
          totalNights: prev.profile.durationNights,
        },
      }));
    }
  }, [state.profile.durationNights]);

  const calculations = useTripCalculator(state);

  const updateProfile = (profileUpdate: Partial<TripState['profile']>) => {
    setState((prev) => {
      const nextProfile = { ...prev.profile, ...profileUpdate };
      // If durationDays changed, update nights automatically to days - 1 if sensible
      if (profileUpdate.durationDays !== undefined && profileUpdate.durationNights === undefined) {
        nextProfile.durationNights = Math.max(0, profileUpdate.durationDays - 1);
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
  };

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
        updateTelecom,
        updateContingency,
        updateSectionNote,
        setCurrency,
        applyTravelStyle,
        loadPreset,
        resetAll,
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
