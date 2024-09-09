import { CreditCardNetwork } from '../models/credit_card_network';
import { getCreditCardNetworkFromNumber } from './credit_card_utils';

export function formatCreditCardNumber(number: string): string {
  const cardNetwork = getCreditCardNetworkFromNumber(number);

  const regexMatches = number.match(/\d{4,16}/g);
  const match = (regexMatches && regexMatches[0]) || '';
  const parts = [];

  if (cardNetwork === CreditCardNetwork.amex) {
    if (number.length > 4) {
      parts.push(number.substring(0, 4));

      if (number.length > 10) {
        parts.push(number.substring(4, 10));
        parts.push(number.substring(10, number.length));
      } else {
        parts.push(number.substring(4, number.length));
      }
    } else {
      parts.push(number);
    }
  } else {
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
  }

  if (parts.length) {
    return parts.join(' ');
  } else {
    return number;
  }
}

export function formatExpiryDate(expiryDate: string): string {
  if (expiryDate.length > 2) {
    expiryDate = `${expiryDate.slice(0, 2)} / ${expiryDate.slice(2)}`;
  }

  return expiryDate;
}
