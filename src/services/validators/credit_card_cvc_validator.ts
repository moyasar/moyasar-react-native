import i18n from 'i18next';
import { FieldValidator } from './field_validator';

export class CreditCardCvcValidator extends FieldValidator {
  constructor() {
    super();

    this.addRule(i18n.t('cvcRequired'), (value: string) => {
      return value.length === 0;
    });

    this.addRule(i18n.t('onlyDigits'), (value: string) => {
      return !/^\d+$/.test(value);
    });

    this.addRule(i18n.t('invalidCvc'), (value: string) => {
      return value.length < 3 || value.length > 4;
    });
  }
}
