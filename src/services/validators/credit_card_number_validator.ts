import i18n from 'i18next';
import { FieldValidator } from './field_validator';
import {
  getCreditCardNetworkFromNumber,
  isValidLuhn,
} from '../../helpers/credit_card_utils';
import { CreditCardNetwork } from '../../models/credit_card_network';

export class CreditCardNumberValidator extends FieldValidator {
  constructor() {
    super();

    this.addRule(i18n.t('cardNumberRequired'), (value: string) => {
      return value.length === 0;
    });

    this.addRule(i18n.t('invalidCardNumber'), (value: string) => {
      return value.length < 15 || !isValidLuhn(value);
    });

    this.addRule(i18n.t('unsupportedCreditCardNetwork'), (value: string) => {
      return (
        getCreditCardNetworkFromNumber(value) === CreditCardNetwork.unknown
      );
    });
  }
}
