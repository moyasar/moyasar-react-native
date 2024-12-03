import { CreditCardCvcValidator } from '../../../services/validators/credit_card_cvc_validator';
import * as Localizations from '../../../localizations/i18n';
import i18next from 'i18next';

jest.mock('i18next', () => ({
  t: (key: string) => key,
}));

jest
  .spyOn(Localizations, 'getConfiguredLocalizations')
  .mockImplementation(() => i18next);

describe('CreditCardCvcValidator', () => {
  let validator: CreditCardCvcValidator;

  beforeEach(() => {
    validator = new CreditCardCvcValidator();
  });

  it('should not return error for valid CVC length for Amex', () => {
    const result = validator.validate('1234', '378282246310005');
    expect(result).toBeNull();
  });

  it('should not return error for valid CVC length for non-Amex', () => {
    const result = validator.validate('123', '4111111111111111');
    expect(result).toBeNull();

    const result2 = validator.validate('123', '4201320111111010');
    expect(result2).toBeNull();
  });

  it('should return error for empty CVC', () => {
    const result = validator.validate('');
    expect(result).toContain('cvcRequired');
  });

  it('should return error for non-digit CVC', () => {
    const result = validator.validate('abc');
    expect(result).toContain('onlyDigits');

    const result2 = validator.validate('1!23');
    expect(result2).toContain('onlyDigits');
  });

  it('should return error for invalid CVC length for unknown network', () => {
    const result = validator.validate('12', '1234567890123456');
    expect(result).toContain('invalidCvc');

    const result2 = validator.validate('12345', '1234567890123456');
    expect(result2).toContain('invalidCvc');
  });

  it('should return error for invalid CVC length for Amex', () => {
    const result = validator.validate('123', '378282246310005');
    expect(result).toContain('invalidCvc');

    const result2 = validator.validate('12345', '378282246310005');
    expect(result2).toContain('invalidCvc');
  });

  it('should return error for invalid CVC length for non-Amex', () => {
    const result = validator.validate('1234', '4111111111111111');
    expect(result).toContain('invalidCvc');

    const result2 = validator.validate('12345', '4111111111111111');
    expect(result2).toContain('invalidCvc');

    const result3 = validator.validate('12', '4111111111111111');
    expect(result3).toContain('invalidCvc');
  });
});
