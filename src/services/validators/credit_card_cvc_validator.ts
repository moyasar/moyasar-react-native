import i18n from 'i18next';
import { FieldValidator } from './field_validator';
import { CreditCardNetwork } from '../../models/credit_card_network';
import { getCreditCardNetworkFromNumber } from '../../helpers/credit_card_utils';

export class CreditCardCvcValidator extends FieldValidator {
  constructor() {
    super();

    this.addRule(i18n.t('cvcRequired'), (value: string) => {
      return value.length === 0;
    });

    this.addRule(i18n.t('onlyDigits'), (value: string) => {
      return !/^\d+$/.test(value);
    });

    this.addRule(
      i18n.t('invalidCvc'),
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
