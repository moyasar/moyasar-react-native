import Decimal from 'decimal.js';
import { currentLang } from '../localizations/i18n';

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

export const currencyToCountryCodeMap: { [key: string]: string } = {
  AED: 'AE', // United Arab Emirates Dirham
  AFN: 'AF', // Afghan Afghani
  ALL: 'AL', // Albanian Lek
  AMD: 'AM', // Armenian Dram
  ANG: 'CW', // Netherlands Antillean Guilder
  AOA: 'AO', // Angolan Kwanza
  ARS: 'AR', // Argentine Peso
  AUD: 'AU', // Australian Dollar
  AWG: 'AW', // Aruban Florin
  AZN: 'AZ', // Azerbaijani Manat
  BAM: 'BA', // Bosnia and Herzegovina Convertible Mark
  BBD: 'BB', // Barbadian Dollar
  BDT: 'BD', // Bangladeshi Taka
  BGN: 'BG', // Bulgarian Lev
  BHD: 'BH', // Bahraini Dinar
  BIF: 'BI', // Burundian Franc
  BMD: 'BM', // Bermudian Dollar
  BND: 'BN', // Brunei Dollar
  BOB: 'BO', // Bolivian Boliviano
  BRL: 'BR', // Brazilian Real
  BSD: 'BS', // Bahamian Dollar
  BTN: 'BT', // Bhutanese Ngultrum
  BWP: 'BW', // Botswanan Pula
  BYN: 'BY', // Belarusian Ruble
  BZD: 'BZ', // Belize Dollar
  CAD: 'CA', // Canadian Dollar
  CDF: 'CD', // Congolese Franc
  CHF: 'CH', // Swiss Franc
  CLP: 'CL', // Chilean Peso
  CNY: 'CN', // Chinese Yuan
  COP: 'CO', // Colombian Peso
  CRC: 'CR', // Costa Rican Colón
  CUP: 'CU', // Cuban Peso
  CVE: 'CV', // Cape Verdean Escudo
  CZK: 'CZ', // Czech Republic Koruna
  DJF: 'DJ', // Djiboutian Franc
  DKK: 'DK', // Danish Krone
  DOP: 'DO', // Dominican Peso
  DZD: 'DZ', // Algerian Dinar
  EGP: 'EG', // Egyptian Pound
  ERN: 'ER', // Eritrean Nakfa
  ETB: 'ET', // Ethiopian Birr
  FJD: 'FJ', // Fijian Dollar
  FKP: 'FK', // Falkland Islands Pound
  GBP: 'GB', // British Pound Sterling
  GEL: 'GE', // Georgian Lari
  GGP: 'GG', // Guernsey Pound
  GHS: 'GH', // Ghanaian Cedi
  GIP: 'GI', // Gibraltar Pound
  GMD: 'GM', // Gambian Dalasi
  GNF: 'GN', // Guinean Franc
  GTQ: 'GT', // Guatemalan Quetzal
  GYD: 'GY', // Guyanaese Dollar
  HKD: 'HK', // Hong Kong Dollar
  HNL: 'HN', // Honduran Lempira
  HRK: 'HR', // Croatian Kuna
  HTG: 'HT', // Haitian Gourde
  HUF: 'HU', // Hungarian Forint
  IDR: 'ID', // Indonesian Rupiah
  IMP: 'IM', // Isle of Man Pound
  INR: 'IN', // Indian Rupee
  IQD: 'IQ', // Iraqi Dinar
  IRR: 'IR', // Iranian Rial
  ISK: 'IS', // Icelandic Króna
  JEP: 'JE', // Jersey Pound
  JMD: 'JM', // Jamaican Dollar
  JOD: 'JO', // Jordanian Dinar
  JPY: 'JP', // Japanese Yen
  KES: 'KE', // Kenyan Shilling
  KGS: 'KG', // Kyrgystani Som
  KHR: 'KH', // Cambodian Riel
  KID: 'KI', // Kiribati Dollar
  KMF: 'KM', // Comorian Franc
  KRW: 'KR', // South Korean Won
  KWD: 'KW', // Kuwaiti Dinar
  KYD: 'KY', // Cayman Islands Dollar
  KZT: 'KZ', // Kazakhstani Tenge
  LAK: 'LA', // Laotian Kip
  LBP: 'LB', // Lebanese Pound
  LKR: 'LK', // Sri Lankan Rupee
  LRD: 'LR', // Liberian Dollar
  LSL: 'LS', // Lesotho Loti
  LYD: 'LY', // Libyan Dinar
  MAD: 'MA', // Moroccan Dirham
  MDL: 'MD', // Moldovan Leu
  MGA: 'MG', // Malagasy Ariary
  MKD: 'MK', // Macedonian Denar
  MMK: 'MM', // Myanma Kyat
  MNT: 'MN', // Mongolian Tugrik
  MOP: 'MO', // Macanese Pataca
  MRU: 'MR', // Mauritanian Ouguiya
  MUR: 'MU', // Mauritian Rupee
  MVR: 'MV', // Maldivian Rufiyaa
  MWK: 'MW', // Malawian Kwacha
  MXN: 'MX', // Mexican Peso
  MYR: 'MY', // Malaysian Ringgit
  MZN: 'MZ', // Mozambican Metical
  NAD: 'NA', // Namibian Dollar
  NGN: 'NG', // Nigerian Naira
  NIO: 'NI', // Nicaraguan Córdoba
  NOK: 'NO', // Norwegian Krone
  NPR: 'NP', // Nepalese Rupee
  NZD: 'NZ', // New Zealand Dollar
  OMR: 'OM', // Omani Rial
  PAB: 'PA', // Panamanian Balboa
  PEN: 'PE', // Peruvian Nuevo Sol
  PGK: 'PG', // Papua New Guinean Kina
  PHP: 'PH', // Philippine Peso
  PKR: 'PK', // Pakistani Rupee
  PLN: 'PL', // Polish Zloty
  PYG: 'PY', // Paraguayan Guarani
  QAR: 'QA', // Qatari Rial
  RON: 'RO', // Romanian Leu
  RSD: 'RS', // Serbian Dinar
  RUB: 'RU', // Russian Ruble
  RWF: 'RW', // Rwandan Franc
  SAR: 'SA', // Saudi Riyal
  SBD: 'SB', // Solomon Islands Dollar
  SCR: 'SC', // Seychellois Rupee
  SDG: 'SD', // Sudanese Pound
  SEK: 'SE', // Swedish Krona
  SGD: 'SG', // Singapore Dollar
  SHP: 'SH', // Saint Helena Pound
  SLL: 'SL', // Sierra Leonean Leone
  SOS: 'SO', // Somali Shilling
  SRD: 'SR', // Surinamese Dollar
  SSP: 'SS', // South Sudanese Pound
  STN: 'ST', // São Tomé and Príncipe Dobra
  SYP: 'SY', // Syrian Pound
  SZL: 'SZ', // Swazi Lilangeni
  THB: 'TH', // Thai Baht
  TJS: 'TJ', // Tajikistani Somoni
  TMT: 'TM', // Turkmenistani Manat
  TND: 'TN', // Tunisian Dinar
  TOP: 'TO', // Tongan Paʻanga
  TRY: 'TR', // Turkish Lira
  TTD: 'TT', // Trinidad and Tobago Dollar
  TVD: 'TV', // Tuvaluan Dollar
  TWD: 'TW', // New Taiwan Dollar
  TZS: 'TZ', // Tanzanian Shilling
  UAH: 'UA', // Ukrainian Hryvnia
  UGX: 'UG', // Ugandan Shilling
  USD: 'US', // United States Dollar
  UYU: 'UY', // Uruguayan Peso
  UZS: 'UZ', // Uzbekistan Som
  VES: 'VE', // Venezuelan Bolívar Soberano
  VND: 'VN', // Vietnamese Dong
  VUV: 'VU', // Vanuatu Vatu
  WST: 'WS', // Samoan Tala
  XAF: 'CM', // Central African CFA Franc
  XCD: 'AG', // East Caribbean Dollar
  XOF: 'SN', // West African CFA Franc
  XPF: 'PF', // CFP Franc
  YER: 'YE', // Yemeni Rial
  ZAR: 'ZA', // South African Rand
  ZMW: 'ZM', // Zambian Kwacha
  ZWL: 'ZW', // Zimbabwean Dollar
};

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
  const numberFormatter = new Intl.NumberFormat(currentLang, {
    style: 'currency',
    currency: currency,
    useGrouping: true,
  });

  let majorAmount = toMajor(amount, currency);

  return numberFormatter.format(majorAmount);
}
