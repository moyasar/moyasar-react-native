import { getConfiguredLocalizations } from '../../localizations/i18n';
import { FieldValidator } from './field_validator';

export class CreditCardNameValidator extends FieldValidator {
  private latinRegex = /^[a-zA-Z\s-]+$/;

  constructor() {
    super();
    const { t } = getConfiguredLocalizations();

    this.addRule(t('moyasarTranslation:nameRequired'), (value: string) => {
      return value.length === 0;
    });

    this.addRule(
      t('moyasarTranslation:onlyEnglishAlphabets'),
      (value: string) => {
        return !this.latinRegex.test(value);
      }
    );

    this.addRule(t('moyasarTranslation:bothNamesRequired'), (value: string) => {
      return value.split(' ').filter((name) => name !== '').length < 2;
    });
  }
}
