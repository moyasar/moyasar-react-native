import Decimal from 'decimal.js';
import { getCurrentLang } from '../localizations/i18n';

type FractionMap = Map<string, number>;

const fractions: FractionMap = new Map([
  ['ADP', 0],
  ['AFN', 0],
  ['ALL', 0],
  ['AMD', 0],
  ['BHD', 3],
  ['BIF', 0],
  ['BYN', 2],
  ['BYR', 0],
  ['CAD', 2],
  ['CHF', 2],
  ['CLF', 4],
  ['CLP', 0],
  ['COP', 0],
  ['CRC', 0],
  ['CZK', 0],
  ['DJF', 0],
  ['DKK', 2],
  ['ESP', 0],
  ['GNF', 0],
  ['GYD', 0],
  ['HUF', 0],
  ['IDR', 0],
  ['IQD', 0],
  ['IRR', 0],
  ['ISK', 0],
  ['ITL', 0],
  ['JOD', 3],
  ['JPY', 0],
  ['KMF', 0],
  ['KPW', 0],
  ['KRW', 0],
  ['KWD', 3],
  ['LAK', 0],
  ['LBP', 0],
  ['LUF', 0],
  ['LYD', 3],
  ['MGA', 0],
  ['MGF', 0],
  ['MMK', 0],
  ['MNT', 0],
  ['MRO', 0],
  ['MUR', 0],
  ['NOK', 0],
  ['OMR', 3],
  ['PKR', 0],
  ['PYG', 0],
  ['RSD', 0],
  ['RWF', 0],
  ['SEK', 0],
  ['SLL', 0],
  ['SOS', 0],
  ['STD', 0],
  ['SYP', 0],
  ['TMM', 0],
  ['TND', 3],
  ['TRL', 0],
  ['TWD', 0],
  ['TZS', 0],
  ['UGX', 0],
  ['UYI', 0],
  ['UYW', 4],
  ['UZS', 0],
  ['VEF', 0],
  ['VND', 0],
  ['VUV', 0],
  ['XAF', 0],
  ['XOF', 0],
  ['XPF', 0],
  ['YER', 0],
  ['ZMK', 0],
  ['ZWD', 0],
]);

function currencyFraction(currency: string): number {
  return fractions.get(currency.toUpperCase()) ?? 2;
}

export function toMajor(minor: number, currency: string): number {
  // TODO: Double check if this implementation can cause floating point precision errors or format the number to fixed decimal places based on the currency fraction
  return new Decimal(minor)
    .div(new Decimal(10).pow(currencyFraction(currency)))
    .toNumber();
}

export function formatAmount(amount: number, currency: string): string {
  const numberFormatter = new Intl.NumberFormat(getCurrentLang(), {
    style: 'currency',
    currency: currency,
    useGrouping: true,
  });

  let majorAmount = toMajor(amount, currency);

  return numberFormatter.format(majorAmount);
}
