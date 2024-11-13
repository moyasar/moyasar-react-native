import { PaymentRequest } from '../../models/api/api_requests/payment_request';
import { GeneralError, NetworkError } from '../../models/errors/moyasar_errors';
import { createPayment } from '../../services/payment_service';
import { onApplePayResponse } from '../../views/apple_pay';
import { paymentConfigWithoutSaveOnlyFixture } from '../__fixtures__/payment_config_fixture';
import { paymentResponseWithPaidFixture } from '../__fixtures__/payment_response_fixture';

jest.mock('../../services/payment_service');
jest.mock('../../localizations/i18n', () => ({
  getCurrentLang: jest.fn(() => 'en'),
}));

describe('onApplePayResponse', () => {
  const mockApplePayToken = 'mockApplePayToken';
  const onPaymentResult = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should create a payment and call onPaymentResult with the response', async () => {
    (createPayment as jest.Mock).mockResolvedValue(
      paymentResponseWithPaidFixture
    );

    await onApplePayResponse(
      mockApplePayToken,
      paymentConfigWithoutSaveOnlyFixture,
      onPaymentResult
    );

    expect(createPayment).toHaveBeenCalledWith(
      expect.any(PaymentRequest),
      paymentConfigWithoutSaveOnlyFixture.publishableApiKey
    );
    expect(onPaymentResult).toHaveBeenCalledWith(
      paymentResponseWithPaidFixture
    );
  });

  it('should handle MoyasarError and call onPaymentResult with the error', async () => {
    const mockError = new GeneralError('Test Error');

    (createPayment as jest.Mock).mockRejectedValue(mockError);

    await onApplePayResponse(
      mockApplePayToken,
      paymentConfigWithoutSaveOnlyFixture,
      onPaymentResult
    );

    expect(onPaymentResult).toHaveBeenCalledWith(mockError);
  });

  it('should handle non-MoyasarError and call onPaymentResult with NetworkError', async () => {
    const mockError = new Error('Network Error');
    (createPayment as jest.Mock).mockRejectedValue(mockError);

    await onApplePayResponse(
      mockApplePayToken,
      paymentConfigWithoutSaveOnlyFixture,
      onPaymentResult
    );

    expect(onPaymentResult).toHaveBeenCalledWith(expect.any(NetworkError));
  });
});
