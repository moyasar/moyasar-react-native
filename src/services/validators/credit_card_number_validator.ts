import { FieldValidator } from './field_validator';
import {
  getCreditCardNetworkFromNumber,
  isValidLuhn,
} from '../../helpers/credit_card_utils';
import { CreditCardNetwork } from '../../models/credit_card_network';
import { getConfiguredLocalizations } from '../../localizations/i18n';

export class CreditCardNumberValidator extends FieldValidator {
  constructor() {
    super();
    const { t } = getConfiguredLocalizations();

    this.addRule(
      t('moyasarTranslation:cardNumberRequired'),
      (value: string) => {
        return value.length === 0;
      }
    );

    this.addRule(t('moyasarTranslation:invalidCardNumber'), (value: string) => {
      return value.length < 15 || !isValidLuhn(value);
    });

    this.addRule(
      t('moyasarTranslation:unsupportedCreditCardNetwork'),
      (value: string) => {
        return (
          getCreditCardNetworkFromNumber(value) === CreditCardNetwork.unknown
        );
      }
    );
  }
}
