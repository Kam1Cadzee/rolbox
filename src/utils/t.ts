import I18n from 'react-native-i18n';
import {ITranslate} from '../assets/locales/uk';

const t = (str: ITranslate[] | ITranslate, obj?: any) => {
  return I18n.t(str, obj);
};

export default t;
