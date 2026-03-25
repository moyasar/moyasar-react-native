import { PaymentRequest } from '../../models/api/api_requests/payment_request';
import { GeneralError, NetworkError } from '../../models/errors/moyasar_errors';
import { createPayment } from '../../services/payment_service';
import { SamsungPayRequestSource } from '../../models/api/sources/samsung_pay/samsung_pay_request_source';
import { onSamsungPayResponse } from '../../views/samsung_pay/samsung_pay';
import { paymentConfigWithoutSaveOnlyFixture } from '../__fixtures__/payment_config_fixture';
import { SamsungPayConfig } from '../../models/samsung_pay_config';
import { paymentResponseWithPaidSamsungFixture } from '../__fixtures__/payment_response_fixture';

jest.mock('../../services/payment_service');
jest.mock('../../localizations/i18n', () => ({
  getCurrentLang: jest.fn(() => 'en'),
}));

describe('onSamsungPayResponse', () => {
  const mockSamsungPayToken = 'mockSamsungPayToken';
  const mockOrderNumber = 'order-number-123';
  const onPaymentResult = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should create a payment and call onPaymentResult with the response', async () => {
    (createPayment as jest.Mock).mockResolvedValue(
      paymentResponseWithPaidSamsungFixture
    );

    await onSamsungPayResponse(
      mockSamsungPayToken,
      mockOrderNumber,
      paymentConfigWithoutSaveOnlyFixture,
      onPaymentResult
    );

    expect(createPayment).toHaveBeenCalledWith(
      expect.any(PaymentRequest),
      paymentConfigWithoutSaveOnlyFixture.publishableApiKey
    );
    expect(onPaymentResult).toHaveBeenCalledWith(
      paymentResponseWithPaidSamsungFixture
    );
  });

  it('should pass manual and save_card from samsung config to source payload', async () => {
    (createPayment as jest.Mock).mockResolvedValue(
      paymentResponseWithPaidSamsungFixture
    );

    const configWithSamsungTokenization = {
      ...paymentConfigWithoutSaveOnlyFixture,
      samsungPay: new SamsungPayConfig({
        serviceId: 'ea810dafb758408fa530b1',
        merchantName: 'Test Samsung',
        orderNumber: mockOrderNumber,
        manual: true,
        saveCard: true,
      }),
    };

    await onSamsungPayResponse(
      mockSamsungPayToken,
      mockOrderNumber,
      configWithSamsungTokenization,
      onPaymentResult
    );

    const paymentRequest = (createPayment as jest.Mock).mock
      .calls[0][0] as PaymentRequest;
    const samsungSource = paymentRequest.source as SamsungPayRequestSource;

    expect(samsungSource.toJson()).toEqual(
      expect.objectContaining({
        type: 'samsungpay',
        token: mockSamsungPayToken,
        manual: 'true',
        save_card: true,
      })
    );
    expect(paymentRequest.metadata).toEqual(
      expect.objectContaining({ samsungpay_order_id: mockOrderNumber })
    );
  });

  it('should handle MoyasarError and call onPaymentResult with the error', async () => {
    const mockError = new GeneralError('Test Error');

    (createPayment as jest.Mock).mockRejectedValue(mockError);

    await onSamsungPayResponse(
      mockSamsungPayToken,
      mockOrderNumber,
      paymentConfigWithoutSaveOnlyFixture,
      onPaymentResult
    );

    expect(onPaymentResult).toHaveBeenCalledWith(mockError);
  });

  it('should handle non-MoyasarError and call onPaymentResult with NetworkError', async () => {
    const mockError = new Error('Network Error');
    (createPayment as jest.Mock).mockRejectedValue(mockError);

    await onSamsungPayResponse(
      mockSamsungPayToken,
      mockOrderNumber,
      paymentConfigWithoutSaveOnlyFixture,
      onPaymentResult
    );

    expect(onPaymentResult).toHaveBeenCalledWith(expect.any(NetworkError));
  });
});
