import i18n from 'i18next';
import { FieldValidator } from './field_validator';

export class CreditCardNameValidator extends FieldValidator {
  private latinRegex = /^[a-zA-Z\s-]+$/;

  constructor() {
    super();

    this.addRule(i18n.t('nameRequired'), (value: string) => {
      return value.length === 0;
    });

    this.addRule(i18n.t('onlyEnglishAlphabets'), (value: string) => {
      return !this.latinRegex.test(value);
    });

    this.addRule(i18n.t('bothNamesRequired'), (value: string) => {
      return value.split(' ').filter((name) => name !== '').length < 2;
    });
  }
}
