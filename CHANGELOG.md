## 0.8.1

- [General] Support older React Native versions.
- [General] Enhancements.

If you encounter any issues, make sure to fully clean your project and rebuild it.

### Needs attention:

- Make sure you have one of the followng Node.js versions installed:

  - v20.19 or higher
  - v22.12 or higher
  - v23.4 or higher

- If you are using [Jest](https://jestjs.io) and encountering issues, update your Jest configuration (likely found in your package.json or any jest.config.\* file) with the following:

```js
module.exports = {
  // ... The rest of your configuration
  transformIgnorePatterns: [
    'node_modules/(?!((@)?react-native|react-native-moyasar-sdk)/)',
  ],
};
```

## 0.8.0

- [Apple Pay] Support Apple Pay tokenization (`saveCard` field).

## 0.7.0

- [Samsung Pay] Support Samsung Pay feature.
- [General] Support customizing merchant's country code.
- [General] Support `givenId` feature.
- [Credit Card Token Fix] Always enforce the `saveOnly` field as `true` in the `TokenRequest` class, and remove it from the public SDK API.
- [General] Enhancements.

If you encounter any issues, make sure to clean your project and rebuild it.

### Required changes (only if consuming the `TokenRequest` class directly):

If you are utilizing the `TokenRequest` class directly, change the following:

- If you supplied `saveOnly` parameter as `true`. Remove it since now it will be always true in this context.
- If you didn't supply the `saveOnly` parameter (or made it `false`). Switch to using the `PaymentRequest` class with the `CreditCardRequestSource` class and set the `tokenizeCard` option to `true`. It will achieve the same result.

### Needs attention:

- Supply the `merchantCountryCode` field in the `PaymentConfig` to indicate your merchant’s principle place of business. Previously, this was based on the currency, which was less precise. Now, you should explicitly set this code for accurate payment processing (defaults to SA).
- Supply the `givenId` field in the `PaymentConfig` object to support [Idempotency](https://docs.moyasar.com/api/idempotency).
- Check [Installation](https://docs.moyasar.com/sdk/react-native/installation) and [Basic Integration](https://docs.moyasar.com/sdk/react-native/basic-integration) documents to support and configure Samsung Pay.

## 0.6.4

- [General] Update dependencies and tooling.

### Required changes:

- Update native code for iOS by running the following command in the `ios/` directory:

```sh
pod install
```

- Set react-native-svg version package to '^15.11.2'.
- Set react-native-webview version package to '^13.13.4'.

## 0.6.3

- [Fix] Fix the Saudi Riyal symbol color

## 0.6.2

- [General] Add the Saudi Riyal symbol

## 0.6.1

- [Credit Card & Stc Pay] Support customizing placeholder text color and more styles.

## 0.6.0

- [Stc Pay] Support Stc Pay feature.

## 0.5.2

- [General Fix] Fix issue with New Architecture.

### Required changes:

Update native code for iOS by running the following command in the `ios/` directory:

```sh
pod install
```

## 0.5.1

- [Fix] Isolate SDK's localization.

## 0.5.0

- [API] `metadata` parameter type fix.
- [General] Support customizing the components' style to align with your app's design.
- [General] Support building your own UI.
- [General] Enhancements.

## 0.4.0

- [Credit Card] Support create save only token.
- [Apple Pay] Fix Apple Pay.

### Required changes:

Change the `paymentResponse` parameter type from `PaymentResponse | MoyasarError` to `PaymentResult` in the `onPaymentResult` callback of the CreditCard and ApplePay components.

## 0.3.0

- [Credit Card] Add arabic number mapper.
- [General] Support dark mode.
- [General] Enhance UI.
- [General] Enhance error handling.

### Optional changes:

Change the `paymentResponse` parameter type from `any` to `PaymentResponse | MoyasarError` in the `onPaymentResult` callback.

## 0.2.0

- [Credit Card] Add input formatting.
- [Credit Card] Add card network detection.
- [Credit Card] Fix Amex card validation.
- [General] Enhancements.

### Required changes:

Add 'react-native-svg' library to your project.

```sh
npm install react-native-svg
```

or

```sh
yarn add react-native-svg
```

Link native code for iOS by running the following command in the `ios/` directory:

```sh
pod install
```

## 0.1.1

- [API] Modify callback type.

## 0.1.0

- [General] Initial release.
- [Apple Pay] Add Apple Pay with button view.
- [Credit Card] Add Credit Card view with managed 3DS step.
