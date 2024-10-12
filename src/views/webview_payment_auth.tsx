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

const { width, height } = Dimensions.get('window');

/**
 * A webview component to handle payment verification.
 * @param transactionUrl - The URL to the payment verification page (3DS challenge).
 * @param onPaymentAuthResult - Callback function to handle the payment verification result.
 *
 * The `callbackUrl` field set in the previous payment setup request must have the host value of `sdk.moyasar.com` (By default handeled if performed the previous request with the SDK's APIs).
 */
export const WebviewPaymentAuth = ({
  transactionUrl,
  onWebviewPaymentAuthResult: onPaymentAuthResult,
}: {
  transactionUrl: string;
  onWebviewPaymentAuthResult: (
    webviewPaymentResponse: WebviewPaymentAuthResponse
  ) => void;
}) => {
  const [loading, setLoading] = useState(true);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? undefined : 'padding'}
    >
      <View style={styles.container}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#235CE1" />
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

            if (url.host === 'sdk.moyasar.com') {
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
