import i18n from 'i18next';
import { FieldValidator } from './field_validator';
import { ExpiryDateUtil } from '../../helpers/expiry_date_util';

export class CreditCardExpiryValidator extends FieldValidator {
  constructor() {
    super();

    this.addRule(i18n.t('expiryRequired'), (value: string) => {
      return value.length === 0;
    });

    this.addRule(i18n.t('invalidExpiry'), (value: string) => {
      const expiryDate = ExpiryDateUtil.fromPattern(value);
      return !(expiryDate?.isValid() ?? false);
    });

    this.addRule(i18n.t('expiredCard'), (value: string) => {
      const expiryDate = ExpiryDateUtil.fromPattern(value);
      return expiryDate?.isExpired() ?? true;
    });
  }
}
