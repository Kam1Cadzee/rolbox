import translationsInstance from './translationsInstance';
import customFetch from '../customFetch';
import {Locale} from '../../config/configLocale';

// /api/translations
const translationsService = {
  getTranslations: async (locale: Locale) => {
    return customFetch(() => translationsInstance.get(`/${locale}`));
  },
  saveTranslations: async (locale: Locale, body: any) => {
    return customFetch(() => translationsInstance.post(`/${locale}`, body));
  },
};

export default translationsService;
