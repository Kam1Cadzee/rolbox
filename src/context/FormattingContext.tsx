import React, {useContext, useEffect, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import I18n from 'react-native-i18n';
import {actionsOther, selectorsOther} from '../redux/other/otherReducer';
import {saveToStorage} from '../utils/saveToStorage';
import {getAvailableLocale, getLocaleConstant, IConstant, Locale} from '../config/configLocale';
import {updateTranslation} from '../utils/translations';
import {DetectedDate, ExtensionTime} from '../typings/TypeTime';
import ExtensionCalendar from '../components/extensions/ExtensionCalendar';

export interface IFormattingContext {
  currentLocale: Locale;
  setLocale: (l: Locale) => any;
  formatNumber: (n: number) => string;
  formatDate: (d: Date) => string;
  formatDateStr: (d: Date, str: string) => string;
  formatTimeByDate: (date: Date) => string;
  formatTimeForChat: (date: Date) => string;
  payload: IConstant;
}

interface IFormattingContextProps {
  locale?: Locale;
}

const formatNumber = (n: number) => {
  return I18n.toNumber(n, {
    precision: 2,
  }).replace('.00', '');
};

const FormattingContext = React.createContext({} as IFormattingContext);

const useFormattingContext = () => {
  return useContext(FormattingContext);
};

const ProviderFormattingContext: React.FC<IFormattingContextProps> = ({children}) => {
  const dispatch = useDispatch();
  const currentLocale = useSelector(selectorsOther.getLocale);

  const value: IFormattingContext = useMemo(() => {
    return {
      currentLocale,
      setLocale: (locale: Locale) => {
        dispatch(actionsOther.setLocale(locale));
        I18n.locale = locale;
        updateTranslation(locale);
      },
      formatNumber: (n: number) => {
        return formatNumber(n);
      },
      formatDate: (date: Date) => {
        const constant = getLocaleConstant(currentLocale);
        return ExtensionTime.formatDate(date, constant.shortDateFormat, constant);
      },
      formatDateStr: (date: Date, str: string) => {
        const constant = getLocaleConstant(currentLocale);
        return ExtensionTime.formatDate(date, str, constant);
      },
      formatTimeByDate: (date: Date) => {
        return ExtensionTime.formatTimeByDate(date, currentLocale);
      },
      formatTimeForChat: (date: Date) => {
        const constant = getLocaleConstant(currentLocale);
        const detected = ExtensionTime.detectedDate(date);
        switch (detected) {
          case DetectedDate.theSameDay:
            return ExtensionTime.formatTimeByDate(date, currentLocale);
          case DetectedDate.theSameWeek:
            return constant.shortWeek[ExtensionCalendar.getDay(date)];
          case DetectedDate.theSameYear:
            return ExtensionTime.formatDate(date, 'dd.mm', constant);
          case DetectedDate.other:
            return ExtensionTime.formatDate(date, constant.shortDateFormat, constant);
        }
      },
      payload: getLocaleConstant(currentLocale),
    };
  }, [currentLocale]);

  useEffect(() => {
    const locale = getAvailableLocale();
    dispatch(actionsOther.setLocale(locale));
    I18n.locale = locale;
    saveToStorage('locale', locale);
  }, []);

  return <FormattingContext.Provider value={value}>{children}</FormattingContext.Provider>;
};

export {useFormattingContext, formatNumber};
export default ProviderFormattingContext;
