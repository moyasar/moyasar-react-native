import { CreditCardExpiryValidator } from '../../../services/validators/credit_card_expiry_validator';

jest.mock('i18next', () => ({
  t: (key: string) => key,
}));

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
    expect(result).toBe('expiryRequired');
  });

  it('should invalidate an expired date', () => {
    const result = validator.validate('12/23');
    expect(result).toBe('expiredCard');
  });

  it('should invalidate an invalid expiry date format', () => {
    const result = validator.validate('12-23');
    expect(result).toBe('invalidExpiry');

    const result2 = validator.validate('12!23');
    expect(result2).toBe('invalidExpiry');

    const result3 = validator.validate('1212223');
    expect(result3).toBe('invalidExpiry');

    const result4 = validator.validate('12213');
    expect(result4).toBe('invalidExpiry');

    const result5 = validator.validate('122!3');
    expect(result5).toBe('invalidExpiry');

    const result6 = validator.validate('12a23');
    expect(result6).toBe('invalidExpiry');

    const result7 = validator.validate('202312');
    expect(result7).toBe('invalidExpiry');

    const result8 = validator.validate('1323');
    expect(result8).toBe('invalidExpiry');

    const result9 = validator.validate('0023');
    expect(result9).toBe('invalidExpiry');
  });
});
