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
    this.addRule(
      getConfiguredLocalizations().t('moyasarTranslation:cardNumberRequired'),
      (value: string) => {
        return value.length === 0;
      }
    );

    this.addRule(
      getConfiguredLocalizations().t('moyasarTranslation:invalidCardNumber'),
      (value: string) => {
        return value.length < 15 || !isValidLuhn(value);
      }
    );

    this.addRule(
      getConfiguredLocalizations().t(
        'moyasarTranslation:unsupportedCreditCardNetwork'
      ),
      (value: string) => {
        return (
          getCreditCardNetworkFromNumber(value) === CreditCardNetwork.unknown
        );
      }
    );
  }
}
