import { OtpValidator } from '../../../services/validators/otp_validator';

jest.mock('i18next', () => ({
  t: (key: string) => key,
}));

describe('OTPValidator', () => {
  let validator: OtpValidator;

  beforeEach(() => {
    validator = new OtpValidator();
  });

  it('should not return any error for a valid OTP', () => {
    const result = validator.validate('123456');
    expect(result).toBeNull();

    const result2 = validator.validate('1234');
    expect(result2).toBeNull();

    const result3 = validator.validate('12345678');
    expect(result3).toBeNull();

    const result4 = validator.validate('1234567890');
    expect(result4).toBeNull();
  });

  it('should return error if OTP is empty', () => {
    const result = validator.validate('');
    expect(result).toContain('otpRequired');
  });

  it('should return error if OTP contains non-digit characters', () => {
    const result = validator.validate('12a4');
    expect(result).toContain('otpOnlyDigits');
  });

  it('should return error if OTP length is less than 4', () => {
    const result = validator.validate('123');
    expect(result).toContain('otpInvalidCount');
  });

  it('should return error if OTP length is more than 10', () => {
    const result = validator.validate('12345678901');
    expect(result).toContain('otpInvalidCount');
  });
});
