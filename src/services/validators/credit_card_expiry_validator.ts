import { FieldValidator } from './field_validator';
import { ExpiryDateUtil } from '../../helpers/expiry_date_util';
import { getConfiguredLocalizations } from '../../localizations/i18n';

export class CreditCardExpiryValidator extends FieldValidator {
  constructor() {
    super();

    this.addRule(
      getConfiguredLocalizations().t('moyasarTranslation:expiryRequired'),
      (value: string) => {
        return value.length === 0;
      }
    );

    this.addRule(
      getConfiguredLocalizations().t('moyasarTranslation:invalidExpiry'),
      (value: string) => {
        const expiryDate = ExpiryDateUtil.fromPattern(value);
        return !(expiryDate?.isValid() ?? false);
      }
    );

    this.addRule(
      getConfiguredLocalizations().t('moyasarTranslation:expiredCard'),
      (value: string) => {
        const expiryDate = ExpiryDateUtil.fromPattern(value);
        return expiryDate?.isExpired() ?? true;
      }
    );
  }
}
