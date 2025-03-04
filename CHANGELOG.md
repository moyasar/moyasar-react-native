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
