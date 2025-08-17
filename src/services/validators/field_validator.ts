import type { CreditCardNetwork } from '../../models/credit_card_network';

type Predicate = (
  value: string,
  creditCardNumber: string | undefined,
  supportedNetworks: CreditCardNetwork[] | undefined
) => boolean;

interface ValidationRule {
  predicate: Predicate;
  error: string;
}

export class FieldValidator {
  private rules: ValidationRule[] = [];
  private shouldErr: boolean = false;

  addRule(error: string, predicate: Predicate): void {
    this.rules.push({ predicate, error });
  }

  // TODO: Refactor to named params
  /**
   * Validates input but only shows errors after the field has been touched
   * @param value The value to validate
   * @param creditCardNumber Optional credit card number
   * @param supportedNetworks Optional array of supported credit card networks (Needed for supported networks validation)
   * @returns Error message if validation fails and the field has been touched, null otherwise
   */
  visualValidate(
    value: string,
    creditCardNumber?: string,
    supportedNetworks?: CreditCardNetwork[]
  ): string | null {
    this.shouldErr = this.shouldErr || value !== '';
    if (!this.shouldErr) {
      return null;
    }

    return this.validate(value, creditCardNumber, supportedNetworks);
  }

  // TODO: Refactor to named params
  /**
   * Validates input against defined rules
   * @param value The value to validate
   * @param creditCardNumber Optional credit card number
   * @param supportedNetworks Optional array of supported credit card networks (Needed for supported networks validation)
   * @returns Error message if validation fails, null if validation passes
   */
  validate(
    value: string,
    creditCardNumber?: string,
    supportedNetworks?: CreditCardNetwork[]
  ): string | null {
    for (const rule of this.rules) {
      if (rule.predicate(value, creditCardNumber, supportedNetworks)) {
        return rule.error;
      }
    }
    return null;
  }
}
