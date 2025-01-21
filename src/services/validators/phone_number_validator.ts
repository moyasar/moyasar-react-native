import i18n from 'i18next';
import { FieldValidator } from './field_validator';

export class PhoneNumberValidator extends FieldValidator {
  constructor() {
    super();

    this.addRule(
      i18n.t('moyasarTranslation:phoneNumberRequired'),
      (value: string) => {
        return value.length === 0;
      }
    );

    this.addRule(
      i18n.t('moyasarTranslation:phoneNumberOnlyDigits'),
      (value: string) => {
        return !/^\d+$/.test(value);
      }
    );

    this.addRule(
      i18n.t('moyasarTranslation:phoneNumberInvalid'),
      (value: string) => {
        return !/^05/.test(value);
      }
    );

    this.addRule(
      i18n.t('moyasarTranslation:phoneNumberInvalidCount'),
      (value: string) => {
        return value.length !== 10;
      }
    );
  }
}
