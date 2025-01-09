import { PaymentType } from '../../../payment_type';
import type { PaymentResponseSource } from '../payment_response_source';

export class StcPayResponseSource implements PaymentResponseSource {
  type: PaymentType = PaymentType.stcPay;
  mobile?: string | null;
  referenceNumber?: string | null;
  branch?: string | null;
  cashier?: string | null;
  transactionUrl: string;
  message?: string | null;

  constructor({
    mobile,
    referenceNumber,
    branch,
    cashier,
    transactionUrl,
    message,
  }: {
    mobile?: string | null;
    referenceNumber?: string | null;
    branch?: string | null;
    cashier?: string | null;
    transactionUrl: string;
    message?: string | null;
  }) {
    this.mobile = mobile;
    this.referenceNumber = referenceNumber;
    this.branch = branch;
    this.cashier = cashier;
    this.transactionUrl = transactionUrl;
    this.message = message;
  }

  static fromJson(json: Record<string, any>): StcPayResponseSource {
    return new StcPayResponseSource({
      mobile: json.mobile,
      referenceNumber: json.reference_number,
      branch: json.branch,
      cashier: json.cashier,
      transactionUrl: json.transaction_url,
      message: json.message,
    });
  }
}
