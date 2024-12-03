import { FieldValidator } from './field_validator';
import { CreditCardNetwork } from '../../models/credit_card_network';
import { getCreditCardNetworkFromNumber } from '../../helpers/credit_card_utils';
import { getConfiguredLocalizations } from '../../localizations/i18n';

export class CreditCardCvcValidator extends FieldValidator {
  constructor() {
    super();
    const { t } = getConfiguredLocalizations();

    this.addRule(t('moyasarTranslation:cvcRequired'), (value: string) => {
      return value.length === 0;
    });

    this.addRule(t('moyasarTranslation:onlyDigits'), (value: string) => {
      return !/^\d+$/.test(value);
    });

    this.addRule(
      t('moyasarTranslation:invalidCvc'),
      (value: string, creditCardNumber: string | undefined) => {
        const network = getCreditCardNetworkFromNumber(creditCardNumber ?? '');

        if (network === CreditCardNetwork.unknown) {
          return value.length < 3 || value.length > 4;
        }

        return network === CreditCardNetwork.amex
          ? value.length !== 4
          : value.length !== 3;
      }
    );
  }
}
