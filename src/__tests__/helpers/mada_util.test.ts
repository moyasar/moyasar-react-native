import { inMadaRange } from '../../helpers/mada_util';

describe('inMadaRange', () => {
  it('should return true for numbers in the mada range', () => {
    expect(inMadaRange('4201320111111010')).toBe(true);
    expect(inMadaRange('4030240000000000')).toBe(true);
    expect(inMadaRange('9682010000000000')).toBe(true);
  });

  it('should return false for numbers not in the mada range', () => {
    expect(inMadaRange('378282246310005')).toBe(false);
    expect(inMadaRange('5421080101000000')).toBe(false);
    expect(inMadaRange('4111111111111111')).toBe(false);
  });

  it('should return true for numbers that begins with the mada range', () => {
    expect(inMadaRange('22337902')).toBe(true);
    expect(inMadaRange('403024')).toBe(true);
    expect(inMadaRange('968201')).toBe(true);
  });

  it('should return false for empty string', () => {
    expect(inMadaRange('')).toBe(false);
  });

  it('should return false for numbers that has non-numeric characters', () => {
    expect(inMadaRange('968a201')).toBe(false);
  });

  it('should return false for numbers that begins with non-numeric characters', () => {
    expect(inMadaRange('a968201')).toBe(false);
  });
});
