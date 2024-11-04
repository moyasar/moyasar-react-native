import { mapArabicNumbers } from '../../helpers/arabic_numbers_mapper';

describe('mapArabicNumbers', () => {
  it('should map arabic numbers to english numbers', () => {
    expect(mapArabicNumbers('٠١٢٣٤٥٦٧٨٩')).toBe('0123456789');
  });

  it('should return the same string if there are no arabic numbers', () => {
    expect(mapArabicNumbers('1234567890')).toBe('1234567890');
  });

  it('should handle mixed arabic and english numbers', () => {
    expect(mapArabicNumbers('١2٣4٥6٧8٩0')).toBe('1234567890');
  });

  it('should handle empty string', () => {
    expect(mapArabicNumbers('')).toBe('');
  });

  it('should handle strings with non-numeric characters', () => {
    expect(mapArabicNumbers('١a٢b٣c4d')).toBe('1a2b3c4d');
  });
});
