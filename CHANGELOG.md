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
