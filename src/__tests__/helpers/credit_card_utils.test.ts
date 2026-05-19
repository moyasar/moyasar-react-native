import {
  isValidLuhn,
  getCreditCardNetworkFromNumber,
  mapCardNetworkStrings,
} from '../../helpers/credit_card_utils';
import { CreditCardNetwork } from '../../models/credit_card_network';

describe('isValidLuhn', () => {
  it('should return true for a valid card number', () => {
    expect(isValidLuhn('4201320111111010')).toBe(true); // Valid Mada
    expect(isValidLuhn('4532015112830366')).toBe(true); // Valid Visa
    expect(isValidLuhn('378282246310005')).toBe(true); // Valid Amex
    expect(isValidLuhn('5421080101000000')).toBe(true); // Valid Mastercard
    expect(isValidLuhn('6200000000000005')).toBe(true); // Valid UnionPay
  });

  it('should return false for an invalid card number', () => {
    expect(isValidLuhn('4201320111111011')).toBe(false); // Invalid Mada
    expect(isValidLuhn('4532015112830367')).toBe(false); // Invalid Visa
    expect(isValidLuhn('378282246310006')).toBe(false); // Invalid Amex
    expect(isValidLuhn('5421080101000001')).toBe(false); // Invalid Mastercard
    expect(isValidLuhn('6200000000000006')).toBe(false); // Invalid UnionPay
  });

  it('should return false for a card number with non-digit characters', () => {
    expect(isValidLuhn('4532a15112830366')).toBe(false);
    expect(isValidLuhn('6011-5144-3354-6201')).toBe(false);
  });

  it('should return false for a card number with only one digit', () => {
    expect(isValidLuhn('4')).toBe(false);
  });
});

describe('getCreditCardNetworkFromNumber', () => {
  it('should return mada for a card number in Mada range', () => {
    expect(getCreditCardNetworkFromNumber('4201320111111010')).toBe(
      CreditCardNetwork.mada
    );
  });

  it('should return amex for a card number starting with 34 or 37', () => {
    expect(getCreditCardNetworkFromNumber('378282246310005')).toBe(
      CreditCardNetwork.amex
    );
    expect(getCreditCardNetworkFromNumber('340000000000009')).toBe(
      CreditCardNetwork.amex
    );
  });

  it('should return visa for a card number starting with 4', () => {
    expect(getCreditCardNetworkFromNumber('4532015112830366')).toBe(
      CreditCardNetwork.visa
    );
  });

  it('should return mastercard for a card number in mastercard range', () => {
    expect(getCreditCardNetworkFromNumber('5421080101000000')).toBe(
      CreditCardNetwork.master
    );
    expect(getCreditCardNetworkFromNumber('2221000000000009')).toBe(
      CreditCardNetwork.master
    );
  });

  it('should return unionpay for a card number matching unionpay range and length', () => {
    expect(getCreditCardNetworkFromNumber('6200000000000005')).toBe(
      CreditCardNetwork.unionpay
    );
    expect(getCreditCardNetworkFromNumber('6200000000000000000')).toBe(
      CreditCardNetwork.unionpay
    );
  });

  it('should return unknown for unionpay prefixes with invalid length', () => {
    expect(getCreditCardNetworkFromNumber('620000000000000')).toBe(
      CreditCardNetwork.unknown
    );
    expect(getCreditCardNetworkFromNumber('62000000000000000000')).toBe(
      CreditCardNetwork.unknown
    );
  });

  it('should return unknown for a card number not matching any known network', () => {
    expect(getCreditCardNetworkFromNumber('1234567812345670')).toBe(
      CreditCardNetwork.unknown
    );
  });
});

describe('mapCardNetworkStrings', () => {
  it('should map all supported network aliases including UnionPay aliases', () => {
    const mappedNetworks = mapCardNetworkStrings([
      'mada',
      'visa',
      'mastercard',
      'amex',
      'unionpay',
      'chinaunionpay',
      'china union pay',
    ]);

    expect(mappedNetworks).toEqual([
      CreditCardNetwork.mada,
      CreditCardNetwork.visa,
      CreditCardNetwork.master,
      CreditCardNetwork.amex,
      CreditCardNetwork.unionpay,
      CreditCardNetwork.unionpay,
      CreditCardNetwork.unionpay,
    ]);
  });

  it('should filter out unsupported network names', () => {
    const mappedNetworks = mapCardNetworkStrings(['visa', 'unsupported']);

    expect(mappedNetworks).toEqual([CreditCardNetwork.visa]);
  });
});
