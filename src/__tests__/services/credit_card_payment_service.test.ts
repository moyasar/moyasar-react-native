import { CreditCardPaymentService } from '../../services/credit_card_payment_service';
import { CreditCardNetwork } from '../../models/credit_card_network';
import { createPayment, createToken } from '../../services/payment_service';
import { CreditCardRequestSource } from '../../models/api/sources/credit_card/credit_card_request_source';
import type { CreditCardFields } from '../../models/component_models/credit_card_fields';
import {
  paymentResponseWithInitFixture,
  paymentResponseWithPaidFixture,
} from '../__fixtures__/payment_response_fixture';
import {
  paymentConfigWithoutSaveOnlyFixture,
  paymentConfigWithSaveOnlyFixture,
} from '../__fixtures__/payment_config_fixture';
import { tokenResponseFixture } from '../__fixtures__/token_response_fixture';
import { GeneralError } from '../../models/errors/moyasar_errors';
import * as Localizations from '../../localizations/i18n';
import i18next from 'i18next';

jest.mock('../../services/payment_service');

jest
  .spyOn(Localizations, 'getConfiguredLocalizations')
  .mockImplementation(() => i18next);

const allNetworks = [
  CreditCardNetwork.mada,
  CreditCardNetwork.visa,
  CreditCardNetwork.master,
  CreditCardNetwork.amex,
];

describe('CreditCardPaymentService', () => {
  let service: CreditCardPaymentService;

  const validFields: CreditCardFields = {
    name: 'John Doe',
    number: '4111111111111111',
    expiry: `12/${new Date().getFullYear() + 1}`,
    cvc: '123',
  };

  const expiredCcFields: CreditCardFields = {
    name: 'John Doe',
    number: '4111111111111111',
    expiry: '12/23',
    cvc: '123',
  };

  const invalidFields: CreditCardFields = {
    name: 'John',
    number: '411111111111111',
    expiry: '12/23',
    cvc: '12',
  };

  beforeEach(() => {
    service = new CreditCardPaymentService();
  });

  describe('shouldShowNetworkLogo', () => {
    it('should return true for unknown network', () => {
      expect(
        service.shouldShowNetworkLogo('123456', CreditCardNetwork.unknown, [
          CreditCardNetwork.unknown,
        ])
      ).toBe(true);
    });

    it('should return true for matching network', () => {
      expect(
        service.shouldShowNetworkLogo(
          '4111111111111111',
          CreditCardNetwork.visa,
          [CreditCardNetwork.visa, CreditCardNetwork.mada]
        )
      ).toBe(true);
    });

    it('should return false for non-matching network', () => {
      expect(
        service.shouldShowNetworkLogo(
          '4111111111111111',
          CreditCardNetwork.master,
          [CreditCardNetwork.master]
        )
      ).toBe(false);
      expect(
        service.shouldShowNetworkLogo(
          '4201320111111010',
          CreditCardNetwork.visa,
          [CreditCardNetwork.visa]
        )
      ).toBe(false);
      expect(
        service.shouldShowNetworkLogo(
          '4201320111111010',
          CreditCardNetwork.unknown,
          [CreditCardNetwork.unknown]
        )
      ).toBe(false);
    });

    it('should return false for non-supported networks', () => {
      expect(
        service.shouldShowNetworkLogo(
          '4111111111111111',
          CreditCardNetwork.visa,
          [CreditCardNetwork.mada]
        )
      ).toBe(false);
      expect(
        service.shouldShowNetworkLogo(
          '4201320111111010',
          CreditCardNetwork.mada,
          [CreditCardNetwork.visa, CreditCardNetwork.master]
        )
      ).toBe(false);
    });
  });

  describe('beginTransaction', () => {
    it('should return false if expiry date is invalid', async () => {
      const result = await service.beginTransaction(
        paymentConfigWithoutSaveOnlyFixture,
        expiredCcFields,
        () => {}
      );

      expect(result).toBe(false);
    });

    it('should return true if fields are valid if payment status initiated and does not invoke the callback function', async () => {
      const onPaymentResult = jest.fn();
      const createPaymentMock = (createPayment as jest.Mock).mockResolvedValue(
        paymentResponseWithInitFixture
      );

      const result = await service.beginTransaction(
        paymentConfigWithoutSaveOnlyFixture,
        validFields,
        onPaymentResult
      );

      expect(result).toBe(true);
      expect(onPaymentResult).not.toHaveBeenCalledWith(
        paymentResponseWithInitFixture
      );
      createPaymentMock.mockReset();
    });

    it('should return false if fields are valid if payment status paid and invokes the callback function', async () => {
      const onPaymentResult = jest.fn();
      const createPaymentMock = (createPayment as jest.Mock).mockResolvedValue(
        paymentResponseWithPaidFixture
      );

      const result = await service.beginTransaction(
        paymentConfigWithoutSaveOnlyFixture,
        validFields,
        onPaymentResult
      );

      expect(result).toBe(false);
      expect(onPaymentResult).toHaveBeenCalledWith(
        paymentResponseWithPaidFixture
      );
      createPaymentMock.mockReset();
    });

    it('should return false if fields are valid if createSaveOnlyToken is true and invokes the callback function', async () => {
      const onPaymentResult = jest.fn();
      const createTokenMock = (createToken as jest.Mock).mockResolvedValue(
        tokenResponseFixture
      );

      const result = await service.beginTransaction(
        paymentConfigWithSaveOnlyFixture,
        validFields,
        onPaymentResult
      );

      expect(onPaymentResult).toHaveBeenCalledWith(tokenResponseFixture);
      expect(result).toBe(false);

      createTokenMock.mockReset();
    });

    it('should call createToken if createSaveOnlyToken is true', async () => {
      const createTokenMock = (createToken as jest.Mock).mockResolvedValue(
        tokenResponseFixture
      );

      await service.beginTransaction(
        paymentConfigWithSaveOnlyFixture,
        validFields,
        () => {}
      );

      expect(createTokenMock).toHaveBeenCalled();
      createTokenMock.mockReset();
    });

    it('should call createPayment if createSaveOnlyToken is false', async () => {
      const createPaymentMock = (createPayment as jest.Mock).mockResolvedValue(
        paymentResponseWithInitFixture
      );

      await service.beginTransaction(
        paymentConfigWithoutSaveOnlyFixture,
        validFields,
        () => {}
      );

      expect(createPaymentMock).toHaveBeenCalled();
      createPaymentMock.mockReset();
    });
  });

  describe('beginCcPayment', () => {
    const creditCardRequestSource = new CreditCardRequestSource({
      name: 'John Doe',
      number: '4111111111111111',
      cvc: '123',
      month: '12',
      year: `12/${new Date().getFullYear() + 1}`,
      tokenizeCard: false,
      manualPayment: false,
    });

    it('should return false if payment creation fails with moyasar error and invokes the callback function', async () => {
      const onPaymentResult = jest.fn();
      const createPaymentMock = (createPayment as jest.Mock).mockResolvedValue(
        new GeneralError('error')
      );

      const result = await service.beginCcPayment(
        paymentConfigWithoutSaveOnlyFixture,
        creditCardRequestSource,
        onPaymentResult
      );

      expect(result).toBe(false);
      expect(onPaymentResult).toHaveBeenCalledWith(new GeneralError('error'));

      createPaymentMock.mockReset();
    });

    it('should return false if payment status is not initiated and invokes the callback function', async () => {
      const onPaymentResult = jest.fn();
      const createPaymentMock = (createPayment as jest.Mock).mockResolvedValue(
        paymentResponseWithPaidFixture
      );

      const result = await service.beginCcPayment(
        paymentConfigWithoutSaveOnlyFixture,
        creditCardRequestSource,
        onPaymentResult
      );

      expect(result).toBe(false);
      expect(onPaymentResult).toHaveBeenCalledWith(
        paymentResponseWithPaidFixture
      );

      createPaymentMock.mockReset();
    });

    it('should return true if payment status is initiated and does not invoke the callback function', async () => {
      const onPaymentResult = jest.fn();
      const createPaymentMock = (createPayment as jest.Mock).mockResolvedValue(
        paymentResponseWithInitFixture
      );

      const result = await service.beginCcPayment(
        paymentConfigWithoutSaveOnlyFixture,
        creditCardRequestSource,
        onPaymentResult
      );

      expect(result).toBe(true);
      expect(service.payment).toBe(paymentResponseWithInitFixture);
      expect(onPaymentResult).not.toHaveBeenCalled();

      createPaymentMock.mockReset();
    });
  });

  describe('beginSaveOnlyToken', () => {
    const creditCardRequestSource = new CreditCardRequestSource({
      name: 'John Doe',
      number: '4111111111111111',
      cvc: '123',
      month: '12',
      year: `12/${new Date().getFullYear() + 1}`,
      tokenizeCard: false,
      manualPayment: false,
    });

    it('should call onPaymentResult with error if token creation fails with moyasar error', async () => {
      const onPaymentResult = jest.fn();
      const createTokenMock = (createToken as jest.Mock).mockResolvedValue(
        new GeneralError('error')
      );

      await service.beginSaveOnlyToken(
        paymentConfigWithSaveOnlyFixture,
        creditCardRequestSource,
        onPaymentResult
      );

      expect(onPaymentResult).toHaveBeenCalledWith(new GeneralError('error'));

      createTokenMock.mockReset();
    });

    it('should call onPaymentResult with response if token creation succeeds', async () => {
      const onPaymentResult = jest.fn();
      const createTokenMock = (createToken as jest.Mock).mockResolvedValue(
        tokenResponseFixture
      );

      await service.beginSaveOnlyToken(
        paymentConfigWithSaveOnlyFixture,
        creditCardRequestSource,
        onPaymentResult
      );

      expect(onPaymentResult).toHaveBeenCalledWith(tokenResponseFixture);

      createTokenMock.mockReset();
    });
  });

  describe('validateAllFields', () => {
    it('should return true if all fields are valid', () => {
      const result = service.validateAllFields(validFields, allNetworks);

      expect(result).toBe(true);
    });

    it('should return false if any field is invalid', () => {
      const result = service.validateAllFields(expiredCcFields, allNetworks);

      expect(result).toBe(false);
    });

    it('should return false if all fields are invalid', () => {
      const result = service.validateAllFields(invalidFields, allNetworks);

      expect(result).toBe(false);
    });
  });
});
