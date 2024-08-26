export class CreditCardConfig {
  public saveCard: boolean;
  public manual: boolean;

  /**
   * @param {boolean} saveCard - An option to save (tokenize) the card after a successful payment.
   * @param {boolean} manual - An option to enable the manual auth and capture flow.
   */
  constructor({
    saveCard = false,
    manual = false,
  }: {
    saveCard?: boolean;
    manual?: boolean;
  }) {
    this.saveCard = saveCard;
    this.manual = manual;
  }
}
