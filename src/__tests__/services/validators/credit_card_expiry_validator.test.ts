import { CreditCardExpiryValidator } from '../../../services/validators/credit_card_expiry_validator';
import * as Localizations from '../../../localizations/i18n';
import i18next from 'i18next';

jest.mock('i18next', () => ({
  t: (key: string) => key,
}));

jest
  .spyOn(Localizations, 'getConfiguredLocalizations')
  .mockImplementation(() => i18next);

describe('CreditCardExpiryValidator', () => {
  let validator: CreditCardExpiryValidator;

  const date = new Date();

  const currentMonth = date.getMonth();
  const futureYear = date.getFullYear() + 1;

  beforeEach(() => {
    validator = new CreditCardExpiryValidator();
  });

  it('should not return error for valid 4-digits expiry date', () => {
    const result = validator.validate(
      `${currentMonth}/ ${futureYear.toString().slice(-2)}`
    );
    expect(result).toBeNull();

    const result2 = validator.validate(
      `${currentMonth}${futureYear.toString().slice(-2)}`
    );
    expect(result2).toBeNull();
  });

  it('should not return error for valid 6-digits expiry date', () => {
    const result = validator.validate(
      `${currentMonth} / ${futureYear.toString()}`
    );
    expect(result).toBeNull();

    const result2 = validator.validate(
      `${currentMonth}${futureYear.toString()}`
    );
    expect(result2).toBeNull();
  });

  it('should return error for empty expiry date', () => {
    const result = validator.validate('');
    expect(result).toContain('expiryRequired');
  });

  it('should invalidate an expired date', () => {
    const result = validator.validate('12/23');
    expect(result).toContain('expiredCard');
  });

  it('should invalidate an invalid expiry date format', () => {
    const result = validator.validate('12-23');
    expect(result).toContain('invalidExpiry');

    const result2 = validator.validate('12!23');
    expect(result2).toContain('invalidExpiry');

    const result3 = validator.validate('1212223');
    expect(result3).toContain('invalidExpiry');

    const result4 = validator.validate('12213');
    expect(result4).toContain('invalidExpiry');

    const result5 = validator.validate('122!3');
    expect(result5).toContain('invalidExpiry');

    const result6 = validator.validate('12a23');
    expect(result6).toContain('invalidExpiry');

    const result7 = validator.validate('202312');
    expect(result7).toContain('invalidExpiry');

    const result8 = validator.validate('1323');
    expect(result8).toContain('invalidExpiry');

    const result9 = validator.validate('0023');
    expect(result9).toContain('invalidExpiry');
  });
});
