import countries from '../assets/countries/countries.json';
import {Locale} from '../config/configLocale';
import IOption from '../typings/IOption';

const getCountries = (locale: Locale) => {
  return Object.keys(countries).map((item) => {
    return {
      value: item,
      label: countries[item][locale],
    } as IOption<string, string>;
  });
};

const getCountryByKey = (locale: Locale) => (key: string) => {
  const res = countries[key];
  if (res) {
    return res[locale];
  }
  return '';
};

export {getCountryByKey};
export default getCountries;
