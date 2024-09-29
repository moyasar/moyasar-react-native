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
import type { WebviewPaymentAuthResponse } from '../models/webview_payment_auth_response';
import { useState } from 'react';

const { width, height } = Dimensions.get('window');

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
              const status = url.searchParams.get('status') ?? '';
              const message = url.searchParams.get('message') ?? '';

              onPaymentAuthResult({ status, message });
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
