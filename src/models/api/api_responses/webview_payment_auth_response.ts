export class WebviewPaymentAuthResponse {
  id: string;
  status: string;
  message: string;

  constructor({
    id,
    status,
    message,
  }: {
    id: string;
    status: string;
    message: string;
  }) {
    this.id = id;
    this.status = status;
    this.message = message;
  }
}
