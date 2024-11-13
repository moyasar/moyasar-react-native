import { CreditCardNameValidator } from '../../../services/validators/credit_card_name_validator';

jest.mock('i18next', () => ({
  t: (key: string) => key,
}));

describe('CreditCardNameValidator', () => {
  let validator: CreditCardNameValidator;

  beforeEach(() => {
    validator = new CreditCardNameValidator();
  });

  it('should not return any error for a valid name', () => {
    const result = validator.validate('Mohammed Abdulaziz');
    expect(result).toBeNull();
  });

  it('should return error if name is empty', () => {
    const result = validator.validate('');
    expect(result).toBe('nameRequired');
  });

  it('should return error if name contains non-English alphabets', () => {
    const result = validator.validate('محمد عبدالعزيز');
    expect(result).toBe('onlyEnglishAlphabets');
  });

  it('should return error if name does not contain both first and last names', () => {
    const result = validator.validate('Mohammed');
    expect(result).toBe('bothNamesRequired');
  });
});
