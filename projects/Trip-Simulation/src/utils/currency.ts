import { CurrencyCode } from '../types';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateToIDR: number; // 1 unit in IDR
  decimals: number;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  IDR: {
    code: 'IDR',
    symbol: 'Rp',
    name: 'Indonesian Rupiah',
    rateToIDR: 1,
    decimals: 0,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    rateToIDR: 16000,
    decimals: 0,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    rateToIDR: 17200,
    decimals: 0,
  },
  SGD: {
    code: 'SGD',
    symbol: 'S$',
    name: 'Singapore Dollar',
    rateToIDR: 11900,
    decimals: 0,
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    rateToIDR: 105,
    decimals: 0,
  },
  MYR: {
    code: 'MYR',
    symbol: 'RM',
    name: 'Malaysian Ringgit',
    rateToIDR: 3600,
    decimals: 0,
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    rateToIDR: 10400,
    decimals: 0,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    rateToIDR: 20400,
    decimals: 0,
  },
};

/**
 * Format a number as currency string according to selected currency code.
 */
export function formatCurrency(amount: number, currency: CurrencyCode = 'IDR'): string {
  const config = CURRENCIES[currency] || CURRENCIES.IDR;
  const validAmount = Number.isFinite(amount) ? amount : 0;

  if (currency === 'IDR') {
    return `Rp ${Math.round(validAmount).toLocaleString('id-ID')}`;
  }

  return `${config.symbol} ${Math.round(validAmount).toLocaleString('en-US')}`;
}

/**
 * Convert an amount from one currency to another using the approximate exchange rate.
 */
export function convertCurrency(
  amount: number,
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode
): number {
  if (fromCurrency === toCurrency) return amount;
  const fromRate = CURRENCIES[fromCurrency]?.rateToIDR || 1;
  const toRate = CURRENCIES[toCurrency]?.rateToIDR || 1;
  const idrValue = amount * fromRate;
  return idrValue / toRate;
}
