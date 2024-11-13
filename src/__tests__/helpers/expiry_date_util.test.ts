import { ExpiryDateUtil } from '../../helpers/expiry_date_util';

describe('ExpiryDateUtil.fromPattern', () => {
  it('should return an instance of ExpiryDateUtil for a valid 4-digit pattern', () => {
    const pattern = '1224';
    const result = ExpiryDateUtil.fromPattern(pattern);
    expect(result).toBeInstanceOf(ExpiryDateUtil);
    expect(result?.month).toBe(12);
    expect(result?.year).toBe(2024);
  });

  it('should return an instance of ExpiryDateUtil for a valid 4-digit pattern for a month that begins with a 0', () => {
    const pattern = '05/24';
    const result = ExpiryDateUtil.fromPattern(pattern);
    expect(result?.month).toBe(5);
    expect(result?.year).toBe(2024);
  });

  it('should return an instance of ExpiryDateUtil for a valid 6-digit pattern', () => {
    const pattern = '102024';
    const result = ExpiryDateUtil.fromPattern(pattern);
    expect(result).toBeInstanceOf(ExpiryDateUtil);
    expect(result?.month).toBe(10);
    expect(result?.year).toBe(2024);
  });

  it('should return null for an invalid pattern length', () => {
    const pattern = '123';
    const result = ExpiryDateUtil.fromPattern(pattern);
    expect(result).toBeNull();
  });

  it('should return null for an invalid pattern length with spaces and slashes', () => {
    const pattern = '12 / 252';
    const result = ExpiryDateUtil.fromPattern(pattern);
    expect(result).toBeNull();
  });

  it('should return null for a pattern with non-numeric characters', () => {
    const pattern = '12a3';
    const result = ExpiryDateUtil.fromPattern(pattern);
    expect(result).toBeNull();
  });

  it('should handle 4-digit pattern with spaces and slashes', () => {
    const pattern = '12 / 24';
    const result = ExpiryDateUtil.fromPattern(pattern);
    expect(result).toBeInstanceOf(ExpiryDateUtil);
    expect(result?.month).toBe(12);
    expect(result?.year).toBe(2024);
  });

  it('should handle 6-digit pattern with spaces and slashes', () => {
    const pattern = '12 / 2024';
    const result = ExpiryDateUtil.fromPattern(pattern);
    expect(result).toBeInstanceOf(ExpiryDateUtil);
    expect(result?.month).toBe(12);
    expect(result?.year).toBe(2024);
  });
});
