import i18n from 'i18next';
import { FieldValidator } from './field_validator';

export class OtpValidator extends FieldValidator {
  constructor() {
    super();

    this.addRule(i18n.t('moyasarTranslation:otpRequired'), (value: string) => {
      return value.length === 0;
    });

    this.addRule(
      i18n.t('moyasarTranslation:otpOnlyDigits'),
      (value: string) => {
        return !/^\d+$/.test(value);
      }
    );

    this.addRule(
      i18n.t('moyasarTranslation:otpInvalidCount'),
      (value: string) => {
        return value.length < 4 || value.length > 10;
      }
    );
  }
}
