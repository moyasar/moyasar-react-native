import { StcPayService } from '../../services/stc_pay_service';
import { createPayment, sendOtp } from '../../services/payment_service';
import {
  NetworkError,
  UnexpectedError,
} from '../../models/errors/moyasar_errors';
import { paymentConfigWithoutSaveOnlyFixture } from '../__fixtures__/payment_config_fixture';
import {
  paymentResponseWithFailedStcFixture,
  paymentResponseWithInitStcFixture,
  paymentResponseWithPaidStcFixture,
} from '../__fixtures__/payment_response_fixture';

jest.mock('../../services/payment_service');

describe('StcPayService', () => {
  let stcPayService: StcPayService;
  let onPaymentResult: jest.Mock;

  beforeEach(() => {
    stcPayService = new StcPayService();
    onPaymentResult = jest.fn();
  });

  describe('beginStcPayment', () => {
    it('should return true if payment is initiated and should not call onPaymentResult', async () => {
      const createPaymentMock = (createPayment as jest.Mock).mockResolvedValue(
        paymentResponseWithInitStcFixture
      );

      const result = await stcPayService.beginStcPayment(
        paymentConfigWithoutSaveOnlyFixture,
        '0512345678',
        onPaymentResult
      );

      expect(result).toBe(true);
      expect(onPaymentResult).not.toHaveBeenCalled();
      createPaymentMock.mockReset();
    });

    it('should return false if payment status is not initiated and calls onPaymentResult', async () => {
      const createPaymentMock = (createPayment as jest.Mock).mockResolvedValue(
        paymentResponseWithFailedStcFixture
      );

      const result = await stcPayService.beginStcPayment(
        paymentConfigWithoutSaveOnlyFixture,
        '0512345678',
        onPaymentResult
      );

      expect(result).toBe(false);
      expect(onPaymentResult).toHaveBeenCalledWith(
        paymentResponseWithFailedStcFixture
      );
      createPaymentMock.mockReset();
    });

    it('should return false if phone number is invalid and should not call onPaymentResult', async () => {
      const result = await stcPayService.beginStcPayment(
        paymentConfigWithoutSaveOnlyFixture,
        '051234567',
        onPaymentResult
      );

      expect(result).toBe(false);
      expect(onPaymentResult).not.toHaveBeenCalled();
    });

    it('should return false if createPayment returns an error and calls onPaymentResult', async () => {
      const createPaymentMock = (createPayment as jest.Mock).mockResolvedValue(
        new NetworkError('error')
      );

      const result = await stcPayService.beginStcPayment(
        paymentConfigWithoutSaveOnlyFixture,
        '0512345678',
        onPaymentResult
      );

      expect(result).toBe(false);
      expect(onPaymentResult).toHaveBeenCalledWith(new NetworkError('error'));
      createPaymentMock.mockReset();
    });
  });

  describe('submitStcPaymentOtp', () => {
    beforeEach(() => {
      stcPayService.payment = paymentResponseWithInitStcFixture;
    });

    it('should call onPaymentResult with response if OTP is valid', async () => {
      const sendOtpMock = (sendOtp as jest.Mock).mockResolvedValue(
        paymentResponseWithPaidStcFixture
      );

      await stcPayService.submitStcPaymentOtp('123456', onPaymentResult);

      expect(onPaymentResult).toHaveBeenCalledWith(
        paymentResponseWithPaidStcFixture
      );
      sendOtpMock.mockReset();
    });

    it('should not call onPaymentResult if OTP is invalid', async () => {
      await stcPayService.submitStcPaymentOtp('123', onPaymentResult);

      expect(onPaymentResult).not.toHaveBeenCalled();
    });

    it('should call onPaymentResult with UnexpectedError if current payment is null', async () => {
      stcPayService.payment = null;

      await stcPayService.submitStcPaymentOtp('123456', onPaymentResult);

      expect(onPaymentResult).toHaveBeenCalledWith(expect.any(UnexpectedError));
    });

    it('should call onPaymentResult if current payment source is not STCPayResponseSource', async () => {
      stcPayService.payment = { ...paymentResponseWithInitStcFixture };
      stcPayService.payment.source = '' as any;

      await stcPayService.submitStcPaymentOtp('123456', onPaymentResult);

      expect(onPaymentResult).toHaveBeenCalledWith(expect.any(UnexpectedError));
    });

    it('should call onPaymentResult if sendOTP returns an error', async () => {
      const sendOtpMock = (sendOtp as jest.Mock).mockResolvedValue(
        new NetworkError('OTP error')
      );

      await stcPayService.submitStcPaymentOtp('123456', onPaymentResult);

      expect(onPaymentResult).toHaveBeenCalledWith(
        new NetworkError('OTP error')
      );
      sendOtpMock.mockReset();
    });
  });
});
