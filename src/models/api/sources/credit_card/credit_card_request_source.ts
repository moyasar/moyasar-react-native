import { getCreditCardNetworkFromNumber } from '../../../../helpers/credit_card_utils';
import { CreditCardNetwork } from '../../../credit_card_network';
import { PaymentType } from '../../../payment_type';
import type { PaymentRequestSource } from '../payment_request_source';

export class CreditCardRequestSource implements PaymentRequestSource {
  type: PaymentType = PaymentType.creditCard;
  network: CreditCardNetwork;
  name: string;
  number: string;
  cvc: string;
  month: string;
  year: string;
  saveCard: string;
  manual: string;

  constructor({
    name,
    number,
    cvc,
    month,
    year,
    tokenizeCard = false,
    manualPayment = false,
  }: {
    name: string;
    number: string;
    cvc: string;
    month: string;
    year: string;
    tokenizeCard?: boolean;
    manualPayment?: boolean;
  }) {
    this.network = getCreditCardNetworkFromNumber(number);
    this.name = name;
    this.number = number;
    this.cvc = cvc;
    this.month = month;
    this.year = year;
    this.saveCard = tokenizeCard ? 'true' : 'false';
    this.manual = manualPayment ? 'true' : 'false';
  }

  toJson(): Record<string, any> {
    return {
      type: this.type,
      company: CreditCardNetwork[this.network],
      name: this.name,
      number: this.number,
      cvc: this.cvc,
      month: this.month,
      year: this.year,
      save_card: this.saveCard,
      manual: this.manual,
    };
  }
}
