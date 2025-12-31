import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  useColorScheme,
  useWindowDimensions,
  type TextStyle,
} from 'react-native';
import {
  getConfiguredLocalizations,
  isArabicLang,
} from '../localizations/i18n';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { CreditCardProps } from '../models/component_models/moyasar_props';
import { formatAmount, toMajor } from '../helpers/currency_util';
import { CreditCardPaymentService } from '../services/credit_card_payment_service';
import { WebviewPaymentAuth } from './webview_payment_auth';
import type { CreditCardResponseSource } from '../models/api/sources/credit_card/credit_card_response_source';
import { Visa } from '../assets/visa';
import { Mastercard } from '../assets/mastercard';
import { Amex } from '../assets/amex';
import { Mada } from '../assets/mada';
import { CreditCardNetwork } from '../models/credit_card_network';
import {
  formatCreditCardNumber,
  formatExpiryDate,
} from '../helpers/formatters';
import {
  getCreditCardNetworkFromNumber,
  mapCardNetworkStrings,
} from '../helpers/credit_card_utils';
import { mapArabicNumbers } from '../helpers/arabic_numbers_mapper';
import { debugLog } from '../helpers/debug_log';
import { PoweredByLogo } from '../assets/powered_logo';
import { readexMedium, readexRegular } from '../helpers/fonts';
import { SaudiRiyal } from '../assets/saudi_riyal';

// TODO: Modify to a better approach rather than global variable
const paymentService = new CreditCardPaymentService();

let formattedAmount: string | null;

function getFormattedAmount(amount: number, currency: string): string {
  if (!formattedAmount) {
    return (formattedAmount = formatAmount(amount, currency));
  }
  return formattedAmount;
}

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
      formattedAmount = null;
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

const FieldLabel = ({
  labelText,
  errorText,
  isEmpty,
  labelStyle,
  errorStyle,
}: {
  labelText: string;
  errorText: string | null;
  isEmpty: boolean;
  labelStyle: TextStyle;
  errorStyle: TextStyle;
}) => {
  if (errorText) {
    // Error state - show error message as label with auto-scaling text
    return (
      <View style={defaultStyle.labelContainer}>
        <Text
          style={errorStyle}
          numberOfLines={1}
          adjustsFontSizeToFit={true}
          minimumFontScale={0.75}
        >
          {errorText}
        </Text>
      </View>
    );
  } else {
    // Normal or required state
    return (
      <View style={defaultStyle.labelContainer}>
        <Text
          style={labelStyle}
          numberOfLines={1}
          adjustsFontSizeToFit={true}
          minimumFontScale={0.75}
        >
          {labelText}
        </Text>
        {isEmpty && <Text style={errorStyle}>REQUIRED</Text>}
      </View>
    );
  }
};

// TODO: Extract to a separate file
const CreditCardView = ({
  paymentConfig,
  onPaymentResult,
  style: customStyle,
  setWebviewVisible,
}: CreditCardProps & {
  setWebviewVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { t } = getConfiguredLocalizations();
  const isLightMode = useColorScheme() === 'light';

  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const [nameError, setNameError] = useState<string | null>(null);
  const [numberError, setNumberError] = useState<string | null>(null);
  const [expiryError, setExpiryError] = useState<string | null>(null);
  const [cvcError, setCvcError] = useState<string | null>(null);

  const nameInputRef = useRef<TextInput>(null);
  const cardNumberInputRef = useRef<TextInput>(null);
  const expiryInputRef = useRef<TextInput>(null);
  const cvcInputRef = useRef<TextInput>(null);

  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [isPaymentInProgress, setIsPaymentInProgress] =
    useState<boolean>(false);

  const supportedNetworks = useMemo(
    () => mapCardNetworkStrings(paymentConfig.supportedNetworks),
    [paymentConfig.supportedNetworks]
  );

  const { width, height } = useWindowDimensions();
  const isPortrait = height > width;

  const themeColors = {
    background: isLightMode ? 'white' : 'black',
    text: isLightMode ? '#191502' : '#F7F7F7',
    placeholder: isLightMode ? '#9E9E9E' : '#6F6F6F',
    border: isLightMode ? '#E0E0E0' : '#444444',
    error: '#F62323',
    buttonBackground: '#768DFF',
    buttonText: 'white',
    required: '#F62323',
    inputBackground: isLightMode ? 'white' : '#2A2A2A',
  };

  useEffect(() => {
    setIsButtonDisabled(
      !paymentService.validateAllFields(
        { name, number, expiry, cvc },
        supportedNetworks
      ) || isPaymentInProgress
    );
  }, [name, number, expiry, cvc, isPaymentInProgress, supportedNetworks]);

  // Check if inputs are empty for required state
  const isNameEmpty = name.trim() === '';
  const isNumberEmpty = number.trim() === '';

  // Get the active card error in priority order (number, expiry, cvc)
  const getActiveCardError = () => {
    if (numberError) return numberError;
    if (expiryError) return expiryError;
    if (cvcError) return cvcError;
    return null;
  };

  // Determine if card form has an error
  const cardError = getActiveCardError();

  // Determine the border color based on the error state
  const getInputBorderStyle = (hasError: boolean) => ({
    borderColor: hasError ? themeColors.error : themeColors.border,
  });

  const getDividerStyle = (hasError: boolean) => ({
    backgroundColor: hasError ? themeColors.error : themeColors.border,
  });

  async function startPaymentTransaction() {
    setIsPaymentInProgress(true);
    const showAuthWebview = await paymentService.beginTransaction(
      paymentConfig,
      { name, number, expiry, cvc },
      onPaymentResult
    );
    setIsPaymentInProgress(false);
    setWebviewVisible(showAuthWebview);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={defaultStyle.scrollView}>
        <View
          style={[
            {
              ...defaultStyle.container,
              backgroundColor: themeColors.background,
            },
            customStyle?.container,
          ]}
        >
          <View style={defaultStyle.inputContainer}>
            {/* Name on Card */}
            <FieldLabel
              labelText={t('moyasarTranslation:nameOnCard')}
              errorText={nameError}
              isEmpty={isNameEmpty && !nameError}
              labelStyle={
                customStyle?.textInputsLabel ?? {
                  ...defaultStyle.labelText,
                  color: themeColors.text,
                }
              }
              errorStyle={
                customStyle?.errorText ?? {
                  ...defaultStyle.labelTextError,
                  color: themeColors.error,
                }
              }
            />
            <View style={defaultStyle.inputSubContainer}>
              <TextInput
                style={[
                  {
                    ...defaultStyle.inputStandalone,
                    ...getInputBorderStyle(!!nameError),
                    color: themeColors.text,
                    backgroundColor: themeColors.inputBackground,
                  },
                  customStyle?.standaloneTextInput,
                ]}
                value={name}
                ref={nameInputRef}
                returnKeyType="next"
                onSubmitEditing={() => {
                  cardNumberInputRef.current?.focus();
                }}
                onChangeText={(value) => {
                  setName(value);
                  setNameError(
                    paymentService.nameValidator.visualValidate(value)
                  );
                }}
                placeholder={t('moyasarTranslation:nameOnCardPlaceholder')}
                placeholderTextColor={
                  customStyle?.textInputsPlaceholderColor ??
                  themeColors.placeholder
                }
                autoCorrect={false}
                editable={!isPaymentInProgress}
                accessibilityLabel={t(
                  'moyasarTranslation:nameOnCardPlaceholder'
                )}
                testID="moyasar-name-on-card-input"
              />
            </View>

            {/* Card Label */}
            <View style={{ marginTop: 24 }}>
              <FieldLabel
                labelText={t('moyasarTranslation:cardInformation')}
                errorText={cardError}
                isEmpty={isNumberEmpty && !cardError}
                labelStyle={
                  customStyle?.textInputsLabel ?? {
                    ...defaultStyle.labelText,
                    color: themeColors.text,
                  }
                }
                errorStyle={
                  customStyle?.errorText ?? {
                    ...defaultStyle.labelTextError,
                    color: themeColors.error,
                  }
                }
              />
            </View>

            {/* iOS Shadow Wrapper */}
            <View
              style={
                Platform.OS === 'ios' ? defaultStyle.cardGroupShadowWrapper : {}
              }
            >
              {/* Card Group Container */}
              <View
                style={[
                  {
                    ...defaultStyle.cardGroup,
                    ...getInputBorderStyle(!!cardError),
                    backgroundColor: themeColors.inputBackground,
                  },
                  customStyle?.groupedTextInputsContainer,
                ]}
              >
                {/* Card Number */}
                <View style={defaultStyle.groupRowTop}>
                  <TextInput
                    style={[
                      {
                        ...defaultStyle.groupInput,
                        color: themeColors.text,
                      },
                      customStyle?.groupedTextInputs,
                    ]}
                    value={formatCreditCardNumber(number)}
                    ref={cardNumberInputRef}
                    returnKeyType="next"
                    onSubmitEditing={() => {
                      expiryInputRef.current?.focus();
                    }}
                    onChangeText={(value) => {
                      const cleanNumber = value
                        .replace(/\s/g, '')
                        .replace(/[^\d٠-٩]/gi, '')
                        .slice(0, 16);

                      const mappedCleanNumbers = mapArabicNumbers(cleanNumber);

                      setNumber(mappedCleanNumbers);
                      setNumberError(
                        paymentService.numberValidator.visualValidate(
                          mappedCleanNumbers,
                          undefined,
                          supportedNetworks
                        )
                      );

                      // To better handle Amex card validation
                      setCvcError(
                        paymentService.cvcValidator.visualValidate(
                          cvc,
                          mappedCleanNumbers
                        )
                      );
                    }}
                    placeholder={t('moyasarTranslation:cardNumberPlaceholder')}
                    placeholderTextColor={
                      customStyle?.textInputsPlaceholderColor ??
                      themeColors.placeholder
                    }
                    keyboardType="numeric"
                    editable={!isPaymentInProgress}
                    maxLength={
                      getCreditCardNetworkFromNumber(number) ===
                      CreditCardNetwork.amex
                        ? 17
                        : 19
                    }
                    textAlign={isArabicLang() ? 'right' : 'left'}
                    accessibilityLabel={t(
                      'moyasarTranslation:cardNumberPlaceholder'
                    )}
                    testID="moyasar-card-number-input"
                  />
                  <View style={defaultStyle.cardNetworkLogoContainer}>
                    {paymentService.shouldShowNetworkLogo(
                      number,
                      CreditCardNetwork.mada,
                      supportedNetworks
                    ) ? (
                      <Mada style={defaultStyle.cardNetworkLogo} />
                    ) : null}

                    {paymentService.shouldShowNetworkLogo(
                      number,
                      CreditCardNetwork.visa,
                      supportedNetworks
                    ) ? (
                      <Visa style={defaultStyle.cardNetworkLogo} />
                    ) : null}

                    {paymentService.shouldShowNetworkLogo(
                      number,
                      CreditCardNetwork.master,
                      supportedNetworks
                    ) ? (
                      <Mastercard style={defaultStyle.cardNetworkLogo} />
                    ) : null}

                    {paymentService.shouldShowNetworkLogo(
                      number,
                      CreditCardNetwork.amex,
                      supportedNetworks
                    ) ? (
                      <Amex style={defaultStyle.cardNetworkLogo} />
                    ) : null}
                  </View>
                </View>

                {/* Horizontal Divider */}
                <View
                  style={[
                    {
                      ...defaultStyle.dividerHorizontal,
                      ...getDividerStyle(!!cardError),
                    },
                    customStyle?.groupedTextInputsDividers,
                  ]}
                />

                {/* Bottom Row: Expiry | CVC */}
                <View style={defaultStyle.groupRowBottom}>
                  {/* Expiry Date */}
                  <View style={defaultStyle.groupCol}>
                    <TextInput
                      style={[
                        {
                          ...defaultStyle.groupInput,
                          color: themeColors.text,
                        },
                        customStyle?.groupedTextInputs,
                      ]}
                      value={formatExpiryDate(expiry)}
                      ref={expiryInputRef}
                      returnKeyType="next"
                      onSubmitEditing={() => {
                        cvcInputRef.current?.focus();
                      }}
                      onChangeText={(value) => {
                        const cleanExpiryDate = value
                          .replace(/[\s\/]/g, '')
                          .replace(/[^\d٠-٩]/gi, '')
                          .slice(0, 6);

                        const mappedCleanExpiryDate =
                          mapArabicNumbers(cleanExpiryDate);

                        setExpiry(mappedCleanExpiryDate);
                        setExpiryError(
                          paymentService.expiryValidator.visualValidate(
                            mappedCleanExpiryDate
                          )
                        );
                      }}
                      placeholder={t('moyasarTranslation:expiryPlaceholder')}
                      placeholderTextColor={
                        customStyle?.textInputsPlaceholderColor ??
                        themeColors.placeholder
                      }
                      keyboardType="numeric"
                      editable={!isPaymentInProgress}
                      maxLength={9}
                      textAlign={isArabicLang() ? 'right' : 'left'}
                      accessibilityLabel={t(
                        'moyasarTranslation:expiryPlaceholder'
                      )}
                      testID="moyasar-expiry-input"
                    />
                  </View>

                  {/* Vertical Divider */}
                  <View
                    style={[
                      {
                        ...defaultStyle.dividerVertical,
                        ...getDividerStyle(!!cardError),
                      },
                      customStyle?.groupedTextInputsDividers,
                    ]}
                  />

                  {/* CVC */}
                  <View style={defaultStyle.groupCol}>
                    <TextInput
                      style={[
                        {
                          ...defaultStyle.groupInput,
                          color: themeColors.text,
                        },
                        customStyle?.groupedTextInputs,
                      ]}
                      value={cvc}
                      ref={cvcInputRef}
                      returnKeyType="done"
                      onSubmitEditing={() => {
                        if (!isButtonDisabled) {
                          startPaymentTransaction();
                        }
                      }}
                      onChangeText={(value) => {
                        const cleanCvc = value
                          .replace(/\s/g, '')
                          .replace(/[^\d٠-٩]/gi, '');

                        const mappedCleanCvc = mapArabicNumbers(cleanCvc);

                        setCvc(mappedCleanCvc);
                        setCvcError(
                          paymentService.cvcValidator.visualValidate(
                            mappedCleanCvc,
                            number
                          )
                        );
                      }}
                      placeholder={t('moyasarTranslation:cvcPlaceholder')}
                      placeholderTextColor={
                        customStyle?.textInputsPlaceholderColor ??
                        themeColors.placeholder
                      }
                      keyboardType="numeric"
                      maxLength={(() => {
                        const cardNetwork =
                          getCreditCardNetworkFromNumber(number);

                        return cardNetwork === CreditCardNetwork.amex ||
                          cardNetwork === CreditCardNetwork.unknown
                          ? 4
                          : 3;
                      })()}
                      editable={!isPaymentInProgress}
                      textAlign={isArabicLang() ? 'right' : 'left'}
                      accessibilityLabel={t(
                        'moyasarTranslation:cvcPlaceholder'
                      )}
                      testID="moyasar-cvc-input"
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={defaultStyle.buttonContainer}>
            <TouchableOpacity
              style={[
                {
                  ...defaultStyle.button,
                  backgroundColor: themeColors.buttonBackground,
                },
                customStyle?.paymentButton,
                isButtonDisabled && { opacity: 0.5 },
              ]}
              onPress={async () => {
                startPaymentTransaction();
              }}
              disabled={isButtonDisabled}
              testID="moyasar-pay-button"
            >
              {isPaymentInProgress ? (
                <ActivityIndicator
                  size="small"
                  color={
                    customStyle?.activityIndicatorColor ??
                    themeColors.buttonText
                  }
                />
              ) : paymentConfig.currency === 'SAR' ? ( // TODO: Remove this temp solution when the new symbol is supported by RN dependencies
                <View
                  style={[
                    defaultStyle.inputSubContainer,
                    { alignItems: 'center' },
                    { minHeight: 26 },
                  ]}
                >
                  <Text
                    style={[
                      defaultStyle.buttonText,
                      { marginEnd: 5 },
                      customStyle?.paymentButtonText,
                    ]}
                  >
                    {`${t('moyasarTranslation:pay')}`}
                  </Text>
                  <View
                    style={[
                      defaultStyle.inputSubContainer,
                      { alignItems: 'center', direction: 'ltr' },
                    ]}
                  >
                    <SaudiRiyal height="16" width="16" />
                    <Text
                      style={[
                        defaultStyle.buttonText,
                        { marginStart: 4 },
                        customStyle?.paymentButtonText,
                      ]}
                    >
                      {`${toMajor(paymentConfig.amount, 'SAR')}`}
                    </Text>
                  </View>
                </View>
              ) : (
                <Text
                  style={[
                    defaultStyle.buttonText,
                    customStyle?.paymentButtonText,
                  ]}
                >
                  {t('moyasarTranslation:pay') +
                    ' ' +
                    getFormattedAmount(
                      paymentConfig.amount,
                      paymentConfig.currency
                    )}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View
            style={[
              defaultStyle.moyasarLogo,
              { width: isPortrait ? '50%' : '30%' },
            ]}
          >
            <PoweredByLogo />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const defaultStyle = StyleSheet.create({
  scrollView: {
    maxWidth: '100%',
    flexGrow: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  container: {
    flex: 1,
    padding: 25,
  },
  inputContainer: {
    justifyContent: 'flex-start',
  },
  inputSubContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    direction: isArabicLang() ? 'rtl' : 'ltr',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginTop: 40,
  },

  // Label container for showing label + required
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    paddingHorizontal: 6,
  },

  // Label text - normal state
  labelText: {
    fontSize: 16,
    lineHeight: Platform.OS === 'ios' ? 26 : undefined,
    flexShrink: 1,
    ...readexRegular,
  },

  // Error state label
  labelTextError: {
    fontSize: 16,
    lineHeight: Platform.OS === 'ios' ? 26 : undefined,
    flexShrink: 1,
    ...readexRegular,
  },

  // Required text
  requiredText: {
    fontSize: 14,
    lineHeight: Platform.OS === 'ios' ? 26 : undefined,
    flexShrink: 1,
    ...readexRegular,
  },

  // Standalone input for Name on Card
  inputStandalone: {
    width: '100%',
    fontSize: 16,
    direction: 'ltr',
    textAlign: isArabicLang() ? 'right' : 'left',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    ...readexRegular,
    // Added shadow to match the cardGroup
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 2,
      },
    }),
  },

  // iOS shadow wrapper to show shadows correctly
  cardGroupShadowWrapper: {
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  // Card Group Container
  cardGroup: {
    borderWidth: 1,
    borderRadius: 12,

    overflow: 'hidden',
    ...Platform.select({
      android: {
        elevation: 2,
      },
    }),
  },

  groupRowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 45,
    paddingHorizontal: 15,
  },

  groupRowBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 45,
  },

  groupCol: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 6,
    minHeight: 45,
  },

  dividerHorizontal: {
    height: 1,
    width: '100%',
  },

  dividerVertical: {
    width: 1,
    height: '100%',
    alignSelf: 'stretch',
  },

  // Input inside card group
  groupInput: {
    width: '100%',
    fontSize: 16,
    direction: 'ltr',
    padding: 4,
    paddingHorizontal: 0,
    borderWidth: 0,
    borderColor: 'transparent',
    ...readexRegular,
  },

  button: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    padding: 15,
    height: 50,
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: Platform.OS === 'ios' ? 26 : undefined,
    ...readexMedium,
  },

  cardNetworkLogoContainer: {
    flexDirection: 'row',
    position: 'absolute',
    alignSelf: 'center',
    end: 10,
    justifyContent: 'flex-end',
  },

  cardNetworkLogo: {
    marginEnd: 8,
    height: 35,
    width: 35,
  },

  moyasarLogo: {
    paddingTop: 20,
    alignItems: 'center',
    alignSelf: 'center',
    height: 40,
  },
});
