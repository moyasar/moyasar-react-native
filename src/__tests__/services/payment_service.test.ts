import {
  createPayment,
  createToken,
  sendOtp,
} from '../../services/payment_service';
import { PaymentRequest } from '../../models/api/api_requests/payment_request';
import { TokenRequest } from '../../models/api/api_requests/token_request';
import {
  NetworkError,
  NetworkEndpointError,
} from '../../models/errors/moyasar_errors';
import { CreditCardRequestSource } from '../../models/api/sources/credit_card/credit_card_request_source';
import {
  paymentResponseWithInitFixture,
  paymentResponseWithInitJsonFixture,
  paymentResponseWithInitStcFixture,
  paymentResponseWithInitStcJsonFixture,
} from '../__fixtures__/payment_response_fixture';
import {
  tokenResponseFixture,
  tokenResponseJsonFixture,
} from '../__fixtures__/token_response_fixture';
import { PaymentType } from '../../models/payment_type';

global.fetch = jest.fn();

describe('PaymentService', () => {
  const publishableApiKey = 'test_publishable_api_key';

  const networkErrorResponseJson = {
    type: 'invalid_request_error',
    message: 'Validation Failed',
    errors: {
      year: ['must be 2 or 4 digits'],
    },
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('createPayment', () => {
    const creditCardRequestSource = new CreditCardRequestSource({
      name: 'John Doe',
      number: '4111111111111111',
      cvc: '123',
      month: '12',
      year: `12/${new Date().getFullYear() + 1}`,
      tokenizeCard: false,
      manualPayment: false,
    });

    const paymentRequest = new PaymentRequest({
      amount: 100,
      currency: 'SAR',
      description: 'Test payment',
      source: creditCardRequestSource,
      callbackUrl: 'https://sdk.moyasar.com/return',
    });

    it('should create a payment successfully', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(paymentResponseWithInitJsonFixture),
      });

      const result = await createPayment(paymentRequest, publishableApiKey);

      expect(result).toEqual(paymentResponseWithInitFixture);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.moyasar.com/v1/payments',
        expect.objectContaining({
          method: 'POST',
          headers: expect.any(Object),
          body: JSON.stringify(paymentRequest.toJson()),
        })
      );
    });

    it('should handle network endpoint error', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 400,
        json: jest.fn().mockResolvedValue(networkErrorResponseJson),
      });

      const result = await createPayment(paymentRequest, publishableApiKey);

      expect(result).toBeInstanceOf(NetworkEndpointError);
    });

    it('should handle network error', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const result = await createPayment(paymentRequest, publishableApiKey);

      expect(result).toBeInstanceOf(NetworkError);
    });
  });

  describe('createToken', () => {
    const tokenRequest = new TokenRequest({
      name: 'John Doe',
      number: '4111111111111111',
      cvc: '123',
      month: '12',
      year: '2028',
      callbackUrl: 'https://sdk.moyasar.com/return',
      metadata: { orderId: '12345' },
    });

    it('should create a token successfully', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(tokenResponseJsonFixture),
      });

      const result = await createToken(tokenRequest, publishableApiKey);

      expect(result).toEqual(tokenResponseFixture);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.moyasar.com/v1/tokens',
        expect.objectContaining({
          method: 'POST',
          headers: expect.any(Object),
          body: JSON.stringify(tokenRequest.toJson()),
        })
      );
    });

    it('should handle network endpoint error', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 400,
        json: jest.fn().mockResolvedValue(networkErrorResponseJson),
      });

      const result = await createToken(tokenRequest, publishableApiKey);

      expect(result).toBeInstanceOf(NetworkEndpointError);
    });

    it('should handle network error', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const result = await createToken(tokenRequest, publishableApiKey);

      expect(result).toBeInstanceOf(NetworkError);
    });
  });

  describe('sendOtp', () => {
    const otp = '123456';
    const url = 'https://api.moyasar.com/v1/payments/otp';
    const paymentSource = PaymentType.stcPay;

    it('should send OTP successfully', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest
          .fn()
          .mockResolvedValue(paymentResponseWithInitStcJsonFixture),
      });

      const result = await sendOtp(otp, url, paymentSource);

      expect(result).toEqual(paymentResponseWithInitStcFixture);
      expect(global.fetch).toHaveBeenCalledWith(
        url,
        expect.objectContaining({
          method: 'POST',
          headers: expect.any(Object),
          body: JSON.stringify({ otp_value: otp }),
        })
      );
    });

    it('should handle network endpoint error', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 400,
        json: jest.fn().mockResolvedValue(networkErrorResponseJson),
      });

      const result = await sendOtp(otp, url, paymentSource);

      expect(result).toBeInstanceOf(NetworkEndpointError);
    });

    it('should handle network error', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const result = await sendOtp(otp, url, paymentSource);

      expect(result).toBeInstanceOf(NetworkError);
    });
  });
});
