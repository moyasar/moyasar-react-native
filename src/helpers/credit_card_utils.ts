import { CreditCardNetwork } from '../models/credit_card_network';
import { inMadaRange } from './mada_util';

export function getCreditCardNetworkFromNumber(
  input: string
): CreditCardNetwork {
  if (inMadaRange(input)) {
    return CreditCardNetwork.mada;
  } else if (new RegExp('^3[47]').test(input)) {
    return CreditCardNetwork.amex;
  } else if (new RegExp('^4').test(input)) {
    return CreditCardNetwork.visa;
  } else if (
    new RegExp(
      '^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)'
    ).test(input)
  ) {
    return CreditCardNetwork.master;
  }

  return CreditCardNetwork.unknown;
}

export function isValidLuhn(cardNumber: string): boolean {
  const digits = cardNumber
    .split('')
    .reverse()
    .map((digit) => parseInt(digit, 10));
  const sum = digits.reduce((acc, digit, index) => {
    if (index % 2 === 1) {
      const doubled = digit * 2;
      return acc + (doubled > 9 ? doubled - 9 : doubled);
    }
    return acc + digit;
  }, 0);
  return sum % 10 === 0;
}

/**
 * Maps an array of network strings to CreditCardNetwork enum values
 * @param networks Array of network strings (e.g. ["visa", "mada"])
 * @returns Array of CreditCardNetwork enum values
 */
export function mapCardNetworkStrings(networks: string[]): CreditCardNetwork[] {
  return networks
    .map((network) => {
      const normalizedNetwork = network.toLowerCase().trim();

      switch (normalizedNetwork) {
        case 'mada':
          return CreditCardNetwork.mada;
        case 'visa':
          return CreditCardNetwork.visa;
        case 'master':
        case 'mastercard':
        case 'master card':
          return CreditCardNetwork.master;
        case 'amex':
        case 'americanexpress':
        case 'american express':
          return CreditCardNetwork.amex;
        default:
          return CreditCardNetwork.unknown;
      }
    })
    .filter((network) => network !== CreditCardNetwork.unknown);
}

/**
 * Gets the first active card error from a set of card field errors.
 * Returns errors in priority order: card number → expiry → CVC
 * @param cardNumberError - Error message for card number field
 * @param expiryError - Error message for expiry field
 * @param cvcError - Error message for CVC field
 * @returns The first non-null error message, or null if no errors
 */
export function getActiveCardError(
  cardNumberError: string | null,
  expiryError: string | null,
  cvcError: string | null
): string | null {
  if (cardNumberError) return cardNumberError;
  if (expiryError) return expiryError;
  if (cvcError) return cvcError;
  return null;
}
