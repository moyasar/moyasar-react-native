import {
  View,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  useWindowDimensions,
} from 'react-native';
import { getConfiguredLocalizations } from '../../localizations/i18n';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { CreditCardProps } from '../../models/component_models/moyasar_props';
import { mapCardNetworkStrings } from '../../helpers/credit_card_utils';
import { CreditCardThemeContext } from './theme_context';
import { NameInput } from './components/name_input';
import { FieldLabel } from './components/field_label';
import { CardGroupContainer } from './components/card_group_container';
import { PaymentButton } from './components/payment_button';
import { MoyasarLogo } from './components/moyasar_logo';
import { creditCardViewStyles } from './credit_card_view.styles';
import type { ThemeColors } from '../../models/component_models/theme_colors';
import { paymentService } from './payment_service_instance';

export const CreditCardView = ({
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

  const themeColors: ThemeColors = {
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
  // TODO: Why duplicated?
  const getActiveCardError = () => {
    if (numberError) return numberError;
    if (expiryError) return expiryError;
    if (cvcError) return cvcError;
    return null;
  };

  // Determine if card form has an error
  const cardError = getActiveCardError();

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

  const handleNameChange = (value: string) => {
    setName(value);
    setNameError(paymentService.nameValidator.visualValidate(value));
  };

  const handleNumberChange = (value: string) => {
    setNumber(value);
    setNumberError(
      paymentService.numberValidator.visualValidate(
        value,
        undefined,
        supportedNetworks
      )
    );
  };

  const handleExpiryChange = (value: string) => {
    setExpiry(value);
    setExpiryError(paymentService.expiryValidator.visualValidate(value));
  };

  const handleCvcChange = (value: string) => {
    setCvc(value);
    setCvcError(paymentService.cvcValidator.visualValidate(value, number));
  };

  return (
    <CreditCardThemeContext.Provider value={{ themeColors, customStyle }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={creditCardViewStyles.scrollView}>
          <View
            style={[
              {
                ...creditCardViewStyles.container,
                backgroundColor: themeColors.background,
              },
              customStyle?.container,
            ]}
          >
            <View style={creditCardViewStyles.inputContainer}>
              {/* Name on Card */}
              <NameInput
                value={name}
                error={nameError}
                isEmpty={isNameEmpty}
                onChangeText={handleNameChange}
                onSubmitEditing={() => {
                  cardNumberInputRef.current?.focus();
                }}
                inputRef={nameInputRef}
                disabled={isPaymentInProgress}
              />

              {/* Card Label */}
              <View style={{ marginTop: 24 }}>
                <FieldLabel
                  labelText={t('moyasarTranslation:cardInformation')}
                  errorText={cardError}
                  isEmpty={isNumberEmpty && !cardError}
                />
              </View>

              <CardGroupContainer
                cardNumber={number}
                cardNumberError={numberError}
                expiry={expiry}
                expiryError={expiryError}
                cvc={cvc}
                cvcError={cvcError}
                onCardNumberChange={handleNumberChange}
                onCvcValidationChange={setCvcError}
                onExpiryChange={handleExpiryChange}
                onCvcChange={handleCvcChange}
                onCardNumberSubmit={() => {
                  expiryInputRef.current?.focus();
                }}
                onExpirySubmit={() => {
                  cvcInputRef.current?.focus();
                }}
                onCvcSubmit={() => {
                  if (!isButtonDisabled) {
                    startPaymentTransaction();
                  }
                }}
                cardNumberInputRef={cardNumberInputRef}
                expiryInputRef={expiryInputRef}
                cvcInputRef={cvcInputRef}
                disabled={isPaymentInProgress}
                supportedNetworks={supportedNetworks}
              />
            </View>

            <View style={creditCardViewStyles.buttonContainer}>
              <PaymentButton
                disabled={isButtonDisabled}
                loading={isPaymentInProgress}
                amount={paymentConfig.amount}
                currency={paymentConfig.currency}
                onPress={startPaymentTransaction}
              />
            </View>

            <MoyasarLogo isPortrait={isPortrait} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </CreditCardThemeContext.Provider>
  );
};
