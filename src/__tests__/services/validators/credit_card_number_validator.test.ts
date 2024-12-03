import { CreditCardNumberValidator } from '../../../services/validators/credit_card_number_validator';
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

  it('should return error for unsupported credit card network', () => {
    const result = validator.validate('1234567812345670');
    expect(result).toContain('unsupportedCreditCardNetwork');
  });
});
