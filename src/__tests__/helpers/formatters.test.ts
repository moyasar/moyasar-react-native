import { formatCreditCardNumber } from '../../helpers/formatters';

describe('formatCreditCardNumber', () => {
  it('should format 16 digits cards correctly', () => {
    const formattedNumber = formatCreditCardNumber('4201320111111010');
    expect(formattedNumber).toBe('4201 3201 1111 1010');

    const formattedNumber2 = formatCreditCardNumber('4111111111111111');
    expect(formattedNumber2).toBe('4111 1111 1111 1111');

    const formattedNumber3 = formatCreditCardNumber('5500000000000004');
    expect(formattedNumber3).toBe('5500 0000 0000 0004');
  });

  it('should format 15 digits (amex) card correctly', () => {
    const formattedNumber = formatCreditCardNumber('378282246310005');
    expect(formattedNumber).toBe('3782 822463 10005');
  });

  it('should return the original number if it does not match any pattern', () => {
    const formattedNumber = formatCreditCardNumber('411');
    expect(formattedNumber).toBe('411');
  });

  it('should format incompleted 16 digits cards correctly', () => {
    const formattedNumber = formatCreditCardNumber('411111');
    expect(formattedNumber).toBe('4111 11');

    const formattedNumber2 = formatCreditCardNumber('41111111111');
    expect(formattedNumber2).toBe('4111 1111 111');

    const formattedNumber3 = formatCreditCardNumber('411111111111');
    expect(formattedNumber3).toBe('4111 1111 1111');

    const formattedNumber4 = formatCreditCardNumber('41111111111111');
    expect(formattedNumber4).toBe('4111 1111 1111 11');
  });

  it('should format incompleted 15 digits (amex) card correctly', () => {
    const formattedNumber = formatCreditCardNumber('37828224');
    expect(formattedNumber).toBe('3782 8224');

    const formattedNumber2 = formatCreditCardNumber('3782822463');
    expect(formattedNumber2).toBe('3782 822463');

    const formattedNumber3 = formatCreditCardNumber('378282246310');
    expect(formattedNumber3).toBe('3782 822463 10');

    const formattedNumber4 = formatCreditCardNumber('37828224631000');
    expect(formattedNumber4).toBe('3782 822463 1000');
  });
});
