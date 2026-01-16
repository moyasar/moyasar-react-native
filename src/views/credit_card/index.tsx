import { useEffect, useState } from 'react';
import type { CreditCardProps } from '../../models/component_models/moyasar_props';
import { WebviewPaymentAuth } from '../webview_payment_auth';
import type { CreditCardResponseSource } from '../../models/api/sources/credit_card/credit_card_response_source';
import { debugLog } from '../../helpers/debug_log';
import { CreditCardView } from './credit_card_view';
import { resetFormattedAmount } from './components/payment_button';
import { paymentService } from './payment_service_instance';

// TODO: Test support against autofilling card details
export function CreditCard({
  paymentConfig,
  onPaymentResult,
  style: customStyle,
}: CreditCardProps) {
  const [isWebviewVisible, setWebviewVisible] = useState(false);

  useEffect(() => {
    debugLog('Moyasar SDK: CreditCard view mounted');
    return () => {
      debugLog('Moyasar SDK: CreditCard view unmounted');
      resetFormattedAmount();
    };
  }, []);

  return isWebviewVisible ? (
    <WebviewPaymentAuth
      transactionUrl={
        (paymentService.payment?.source as CreditCardResponseSource)
          .transactionUrl
      }
      onWebviewPaymentAuthResult={(webviewPaymentResponse) => {
        if (paymentService.payment) {
          paymentService.payment.status = webviewPaymentResponse.status as any;
          (paymentService.payment.source as CreditCardResponseSource).message =
            webviewPaymentResponse.message;
          onPaymentResult(paymentService.payment);
        }
      }}
      style={customStyle}
    />
  ) : (
    <CreditCardView
      paymentConfig={paymentConfig}
      onPaymentResult={onPaymentResult}
      style={customStyle}
      setWebviewVisible={setWebviewVisible}
    />
  );
}
