import { PhoneNumberValidator } from '../../../services/validators/phone_number_validator';

jest.mock('i18next', () => ({
  t: (key: string) => key,
}));

describe('PhoneNumberValidator', () => {
  let validator: PhoneNumberValidator;

  beforeEach(() => {
    validator = new PhoneNumberValidator();
  });

  it('should pass validation for a valid phone number', () => {
    const result = validator.validate('0512345678');
    expect(result).toBeNull();
  });

  it('should return error if phone number is empty', () => {
    const result = validator.validate('');
    expect(result).toContain('phoneNumberRequired');
  });

  it('should return error if phone number contains non-digit characters', () => {
    const result = validator.validate('05123a45678');
    expect(result).toContain('phoneNumberOnlyDigits');

    const result2 = validator.validate('05123a4567');
    expect(result2).toContain('phoneNumberOnlyDigits');

    const result3 = validator.validate('05123a45678a');
    expect(result3).toContain('phoneNumberOnlyDigits');
  });

  it('should return error if phone number does not start with 05', () => {
    const result = validator.validate('1234567890');
    expect(result).toContain('phoneNumberInvalid');
  });

  it('should return error if phone number length is not 10 digits', () => {
    const result = validator.validate('051234567');
    expect(result).toContain('phoneNumberInvalidCount');

    const resul2 = validator.validate('05123456789');
    expect(resul2).toContain('phoneNumberInvalidCount');
  });
});
