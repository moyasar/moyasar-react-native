import {
  StyleSheet,
  Dimensions,
  View,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { URL } from 'react-native-url-polyfill';
import type { WebviewPaymentAuthResponse } from '../models/api/api_responses/webview_payment_auth_response';
import { useState } from 'react';
import type { CreditCardMoyasarStyle } from '../models/component_models/moyasar_style';

const { width, height } = Dimensions.get('window');

/**
 * A webview component to handle 3DS payment verification.
 * @param {string} transactionUrl - The URL to the payment verification page (3DS challenge).
 * @param onPaymentAuthResult - Callback function to handle the payment verification result.
 * @param {string} [callbackUrl="https://sdk.moyasar.com/return"] - The URL to be redirected to after a 3D secure transaction. Defaults to 'https://sdk.moyasar.com/return'
 * @param {CreditCardMoyasarStyle} [style] - Optional custom styling for the webview.
 */
export const WebviewPaymentAuth = ({
  transactionUrl,
  onWebviewPaymentAuthResult: onPaymentAuthResult,
  callbackUrl = 'https://sdk.moyasar.com/return',
  style: customStyle,
}: {
  transactionUrl: string;
  onWebviewPaymentAuthResult: (
    webviewPaymentResponse: WebviewPaymentAuthResponse
  ) => void;
  callbackUrl?: string;
  style?: CreditCardMoyasarStyle;
}) => {
  const [loading, setLoading] = useState(true);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? undefined : 'padding'}
    >
      <View style={styles.container}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={customStyle?.webviewActivityIndicatorColor ?? '#768DFF'}
            />
          </View>
        )}
        <WebView
          source={{ uri: transactionUrl }}
          onLoadProgress={({ nativeEvent }) => {
            if (nativeEvent.progress >= 0.5 && loading) {
              setLoading(false);
            }
          }}
          onShouldStartLoadWithRequest={(request) => {
            const url = new URL(request.url);
            const callbackUrlHost = new URL(callbackUrl).host;

            if (url.host === callbackUrlHost) {
              const id = url.searchParams.get('id') ?? '';
              const status = url.searchParams.get('status') ?? '';
              const message = url.searchParams.get('message') ?? '';

              onPaymentAuthResult({ id, status, message });
              return false;
            }

            return true;
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: height,
    width: width,
  },
  loadingContainer: {
    height: height,
    width: width,
    justifyContent: 'center',
  },
});
