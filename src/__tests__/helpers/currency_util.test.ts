import { formatAmount, toMajor } from '../../helpers/currency_util';

jest.mock('../../localizations/i18n', () => ({
  getCurrentLang: jest.fn(() => 'en'),
}));

describe('toMajor', () => {
  it('should convert minor units to major units correctly for currencies with 2 decimal places', () => {
    expect(toMajor(100, 'SAR')).toBe(1);
    expect(toMajor(2500, 'USD')).toBe(25);
    expect(toMajor(2500, 'EUR')).toBe(25);
  });

  it('should convert minor units to major units correctly for currencies with 3 decimal places', () => {
    expect(toMajor(1000, 'BHD')).toBe(1);
    expect(toMajor(25000, 'KWD')).toBe(25);
  });

  it('should convert minor units to major units correctly for currencies with 0 decimal places', () => {
    expect(toMajor(100, 'JPY')).toBe(100);
    expect(toMajor(2500, 'VND')).toBe(2500);
  });

  it('should return 0 for 0 minor units', () => {
    expect(toMajor(0, 'SAR')).toBe(0);
    expect(toMajor(0, 'JPY')).toBe(0);
  });

  it('should handle negative minor units correctly', () => {
    expect(toMajor(-100, 'SAR')).toBe(-1);
    expect(toMajor(-2500, 'JPY')).toBe(-2500);
  });

  it('should handle currencies not in the fraction map by defaulting to 2 decimal places', () => {
    expect(toMajor(100, 'XYZ')).toBe(1);
    expect(toMajor(2500, 'ABC')).toBe(25);
  });

  it('should handle numbers with fractions correctly for currencies with 2 decimal places', () => {
    expect(toMajor(1, 'SAR')).toBe(0.01);
    expect(toMajor(1001, 'SAR')).toBe(10.01);
    expect(toMajor(250025, 'SAR')).toBe(2500.25);
    expect(toMajor(250099, 'SAR')).toBe(2500.99);
  });

  it('should handle numbers with fractions correctly for currencies with 3 decimal places', () => {
    expect(toMajor(1, 'BHD')).toBe(0.001);
    expect(toMajor(1001, 'BHD')).toBe(1.001);
    expect(toMajor(250025, 'BHD')).toBe(250.025);
    expect(toMajor(250099, 'BHD')).toBe(250.099);
  });

  it('should handle numbers with fractions correctly for currencies with 0 decimal places', () => {
    expect(toMajor(1, 'JPY')).toBe(1);
    expect(toMajor(1001, 'JPY')).toBe(1001);
    expect(toMajor(250025, 'JPY')).toBe(250025);
    expect(toMajor(250099, 'JPY')).toBe(250099);
  });
});

describe('formatAmount', () => {
  it('should format the amount correctly for currencies with 2 decimal places', () => {
    expect(formatAmount(100, 'SAR')).toBe('SAR 1.00');
    expect(formatAmount(2500, 'SAR')).toBe('SAR 25.00');
  });

  it('should format the amount correctly for currencies with 3 decimal places', () => {
    expect(formatAmount(1000, 'BHD')).toBe('BHD 1.000');
    expect(formatAmount(25000, 'KWD')).toBe('KWD 25.000');
  });

  it('should format the amount correctly for currencies with 0 decimal places', () => {
    expect(formatAmount(100, 'JPY')).toBe('¥100');
    expect(formatAmount(2500, 'JPY')).toBe('¥2,500');
  });

  it('should return SAR 0.00 for 0 minor units in SAR', () => {
    expect(formatAmount(0, 'SAR')).toBe('SAR 0.00');
  });

  it('should handle negative minor units correctly', () => {
    expect(formatAmount(-100, 'SAR')).toBe('-SAR 1.00');
    expect(formatAmount(-2500, 'JPY')).toBe('-¥2,500');
  });

  it('should handle currencies not in the fraction map by defaulting to 2 decimal places', () => {
    expect(formatAmount(100, 'XYZ')).toBe('XYZ 1.00');
    expect(formatAmount(2500, 'ABC')).toBe('ABC 25.00');
  });
});
