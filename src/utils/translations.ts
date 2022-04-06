import I18n from 'react-native-i18n';
import {getAvailableLocale, Locale} from '../config/configLocale';
import translationsService from '../services/translationsService/translationsService';

const updateTranslation = async (locale?: Locale) => {
  try {
    locale = locale ?? getAvailableLocale();
    const res = await translationsService.getTranslations(locale);

    if (res.success) {
      I18n.translations = {
        ...I18n.translations,
        [locale]: res.data!,
      };
    }
  } catch (e) {}
};

const saveTranslation = async (isExecute: boolean) => {
  if (!isExecute) {
    return;
  }
  const uk = require('../assets/locales/uk').default;
  const ru = require('../assets/locales/ru').default;
  const es = require('../assets/locales/es').default;
  const en = require('../assets/locales/en').default;

  const translations = [
    {
      locale: 'uk',
      data: uk,
    },
    {
      locale: 'en',
      data: en,
    },
    {
      locale: 'es',
      data: es,
    },
    {
      locale: 'ru',
      data: ru,
    },
  ] as {locale: Locale; data: any}[];

  await Promise.all(translations.map((t) => translationsService.saveTranslations(t.locale, t.data)));
};

export {updateTranslation, saveTranslation};
