import type CreditCardNetwork from '../../credit_card_network';
import PaymentType from '../../payment_type';
import type { PaymentResponseSource } from '../payment_response_source';

class CreditCardResponseSource implements PaymentResponseSource {
  public type: PaymentType = PaymentType.creditCard;
  public network: CreditCardNetwork;
  public name: string;
  public number: string;
  public gatewayId: string;
  public transactionUrl: string;
  public referenceNumber?: string;
  public token?: string;
  public message?: string;

  constructor({
    company,
    name,
    number,
    gatewayId,
    transactionUrl,
    referenceNumber,
    token,
    message,
  }: {
    company: CreditCardNetwork;
    name: string;
    number: string;
    gatewayId: string;
    transactionUrl: string;
    referenceNumber: string;
    token: string;
    message: string;
  }) {
    this.network = company;
    this.name = name;
    this.number = number;
    this.gatewayId = gatewayId;
    this.transactionUrl = transactionUrl;
    this.referenceNumber = referenceNumber;
    this.token = token;
    this.message = message;
  }

  static fromJson(json: Record<string, any>): CreditCardResponseSource {
    return new CreditCardResponseSource({
      company: json.company,
      name: json.name,
      number: json.number,
      gatewayId: json.gateway_id,
      transactionUrl: json.transaction_url,
      referenceNumber: json.reference_number,
      token: json.token,
      message: json.message,
    });
  }
}

export default CreditCardResponseSource;
