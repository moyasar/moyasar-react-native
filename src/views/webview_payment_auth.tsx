import { StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { debugLog } from '../helpers/debug_log';
import { URL } from 'react-native-url-polyfill';
import type { WebviewPaymentAuthResponse } from '../models/webview_payment_auth_response';

const { width } = Dimensions.get('window');

export const WebviewPaymentAuth = ({
  transactionUrl,
  onWebviewPaymentAuthResult: onPaymentAuthResult,
}: {
  transactionUrl: string;
  onWebviewPaymentAuthResult: (
    webviewPaymentResponse: WebviewPaymentAuthResponse
  ) => void;
}) => {
  debugLog(`Moyasar SDK: Webview Payment Auth url: ${transactionUrl}`);

  return (
    <WebView
      style={styles.container}
      source={{ uri: transactionUrl }}
      onShouldStartLoadWithRequest={(request) => {
        const url = new URL(request.url);

        if (url.host === 'sdk.moyasar.com') {
          const status = url.searchParams.get('status') ?? '';
          const message = url.searchParams.get('message') ?? '';

          onPaymentAuthResult({ status, message });
          return false;
        }

        return true;
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
  },
});
