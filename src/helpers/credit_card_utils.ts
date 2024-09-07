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
