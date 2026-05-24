import { FieldValidator } from './field_validator';
import {
  getCreditCardNetworkFromNumber,
  isValidLuhn,
  UNION_PAY_PREFIX_REGEX,
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
      const isUnionPayCandidate = UNION_PAY_PREFIX_REGEX.test(value);

      // TODO: Support other card types with different length requirements. With better approach
      if (isUnionPayCandidate) {
        return value.length < 16 || value.length > 19 || !isValidLuhn(value);
      }

      return value.length < 15 || value.length > 19 || !isValidLuhn(value);
    });

    this.addRule(
      t('moyasarTranslation:unsupportedCreditCardNetwork'),
      (value: string, _?: string, supportedNetworks?: CreditCardNetwork[]) => {
        const cardNetwork = getCreditCardNetworkFromNumber(value);

        // Checks for the supported card only if supportedNetworks is provided
        return (
          cardNetwork === CreditCardNetwork.unknown ||
          (!!supportedNetworks && !supportedNetworks.includes(cardNetwork))
        );
      }
    );
  }
}
