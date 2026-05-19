import { CreditCardNumberValidator } from '../../../services/validators/credit_card_number_validator';
import { CreditCardNetwork } from '../../../models/credit_card_network';
import * as Localizations from '../../../localizations/i18n';
import i18next from 'i18next';

jest.mock('i18next', () => ({
  t: (key: string) => key,
}));

jest
  .spyOn(Localizations, 'getConfiguredLocalizations')
  .mockImplementation(() => i18next);

describe('CreditCardNumberValidator', () => {
  let validator: CreditCardNumberValidator;

  beforeEach(() => {
    validator = new CreditCardNumberValidator();
  });

  it('should not return any error for a valid card number', () => {
    const result = validator.validate('4111111111111111');
    expect(result).toBeNull();
  });

  it('should return error for empty card number', () => {
    const result = validator.validate('');
    expect(result).toContain('cardNumberRequired');
  });

  it('should return error for invalid card number length', () => {
    const result = validator.validate('41111111111111'); // 14 digits
    expect(result).toContain('invalidCardNumber');
  });

  it('should return error for invalid Luhn card number', () => {
    const result = validator.validate('4532015112830367');
    expect(result).toContain('invalidCardNumber');
  });

  it('should not return any error for valid unionpay card numbers (16-19 digits)', () => {
    const result = validator.validate('6200000000000005');
    expect(result).toBeNull();

    const result2 = validator.validate('6200000000000000000');
    expect(result2).toBeNull();
  });

  it('should return error for invalid unionpay card number length', () => {
    const tooShort = validator.validate('620000000000000');
    expect(tooShort).toContain('invalidCardNumber');

    const tooLong = validator.validate('62000000000000000000');
    expect(tooLong).toContain('invalidCardNumber');
  });

  it('should validate supportedNetworks for unionpay correctly', () => {
    const unsupportedResult = validator.validate(
      '6200000000000005',
      undefined,
      [CreditCardNetwork.visa]
    );
    expect(unsupportedResult).toContain('unsupportedCreditCardNetwork');

    const supportedResult = validator.validate('6200000000000005', undefined, [
      CreditCardNetwork.unionpay,
      CreditCardNetwork.visa,
    ]);
    expect(supportedResult).toBeNull();
  });

  it('should return error for unsupported credit card network', () => {
    const result = validator.validate('1234567812345670');
    expect(result).toContain('unsupportedCreditCardNetwork');
  });
});
