import I18n from 'react-native-i18n';
import {NativeModules} from 'react-native';
import {isIOS} from '../utils/isPlatform';
import TypeCurrency from '../typings/TypeCurrency';
import {DayOfWeek} from '../typings/IEvent';
import TypeTime from '../typings/TypeTime';

type Locale = 'en' | 'uk' | 'ru' | 'es';

interface IConfigLocale {
  defaultLocale: Locale;
  locales: Locale[];
}

const configLocale: IConfigLocale = {
  defaultLocale: 'en',
  locales: ['en', 'es', 'ru', 'uk'],
};

const getAvailableLocale = () => {
  try {
    const locale = (isIOS
      ? NativeModules.SettingsManager.settings.AppleLocale
      : NativeModules.I18nManager.localeIdentifier
    ).split('_')[0];

    return configLocale.locales.some((l) => l === locale) ? locale : configLocale.defaultLocale;
  } catch {
    return configLocale.defaultLocale;
  }
};

const loadLocale = (locale: Locale) => {
  switch (locale) {
    case 'en':
      return require(`../assets/locales/en`).default;
    case 'ru':
      return require(`../assets/locales/ru`).default;
    case 'uk':
      return require(`../assets/locales/uk`).default;
    case 'es':
      return require(`../assets/locales/es`).default;
  }
};
const configInitI18N = () => {
  const locale = getAvailableLocale();
  I18n.fallbacks = true;
  I18n.defaultLocale = locale;
  I18n.locale = locale;

  I18n.translations = {
    [locale]: loadLocale(locale),
  };
};

interface IConstant {
  longMonths: string[];
  shortMonths: string[];
  longWeek: string[];
  shortWeek: string[];
  currency: TypeCurrency;

  shortDateFormat: string;
  dayOfWeek: DayOfWeek;
  typeTime: TypeTime;
}

type ILocaleConstant = {
  [name in Locale]: IConstant;
};

const CONSTANTS_UNIT: ILocaleConstant = {
  en: {
    longMonths: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
    currency: TypeCurrency.USD,
    shortDateFormat: 'mm-dd-yyyy',
    longWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    shortWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    dayOfWeek: DayOfWeek.Sun,
    typeTime: TypeTime.clock12,
  },
  uk: {
    longMonths: [
      'Січень',
      'Лютий',
      'Березень',
      'Квітень',
      'Травень',
      'Червень',
      'Липень',
      'Серпень',
      'Вересень',
      'Жовтень',
      'Листопад',
      'Грудень',
    ],
    shortMonths: ['Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер', 'Лип', 'Сер', 'Вер', 'Жов', 'Лис', 'Гру'],
    currency: TypeCurrency.UAH,
    shortDateFormat: 'dd.mm.yyyy',
    longWeek: ['Понеділок', 'Вівторок', 'Середа', 'Четвер', 'Пʼятниця', 'Субота', 'Неділя'],
    shortWeek: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'],
    dayOfWeek: DayOfWeek.Mon,
    typeTime: TypeTime.clock24,
  },
  ru: {
    longMonths: [
      'Январь',
      'Февраль',
      'Март',
      'Апрель',
      'Май',
      'Июнь',
      'Июль',
      'Август',
      'Сентябрь',
      'Октябрь',
      'Ноябрь',
      'Декабрь',
    ],
    shortMonths: ['Янв', 'Февр', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сент', 'Окт', 'Нояб', 'Дек'],
    currency: TypeCurrency.USD,
    shortDateFormat: 'dd.mm.yyyy',
    longWeek: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
    shortWeek: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    dayOfWeek: DayOfWeek.Mon,
    typeTime: TypeTime.clock24,
  },
  es: {
    longMonths: [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ],
    shortMonths: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sept', 'Oct', 'Nov', 'Dic'],
    currency: TypeCurrency.USD,
    shortDateFormat: 'dd/mm/yyyy',
    longWeek: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
    shortWeek: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    dayOfWeek: DayOfWeek.Mon,
    typeTime: TypeTime.clock12,
  },
};

const getLocaleConstant = (locale?: Locale) => {
  const currentLocale = locale || getAvailableLocale();

  return CONSTANTS_UNIT[currentLocale] as IConstant;
};

const checkLocale = (locales: Locale[], locale?: Locale) => {
  locale = getAvailableLocale();
  return locales.some((l) => l === locale);
};

export {
  Locale,
  configLocale,
  checkLocale,
  getAvailableLocale,
  getLocaleConstant,
  configInitI18N,
  CONSTANTS_UNIT,
  IConstant,
};
