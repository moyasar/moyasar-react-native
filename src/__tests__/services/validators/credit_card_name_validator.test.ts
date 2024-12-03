import { CreditCardNameValidator } from '../../../services/validators/credit_card_name_validator';
import * as Localizations from '../../../localizations/i18n';
import i18next from 'i18next';

jest.mock('i18next', () => ({
  t: (key: string) => key,
}));

jest
  .spyOn(Localizations, 'getConfiguredLocalizations')
  .mockImplementation(() => i18next);

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
    expect(result).toContain('nameRequired');
  });

  it('should return error if name contains non-English alphabets', () => {
    const result = validator.validate('محمد عبدالعزيز');
    expect(result).toContain('onlyEnglishAlphabets');
  });

  it('should return error if name does not contain both first and last names', () => {
    const result = validator.validate('Mohammed');
    expect(result).toContain('bothNamesRequired');
  });
});
