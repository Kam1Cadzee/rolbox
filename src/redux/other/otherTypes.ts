import {Locale} from '../../config/configLocale';
import {IContact} from '../../typings/IContact';
import IOption from '../../typings/IOption';
import TypeView from '../../typings/TypeView';

export interface IOtherActions {
  setLocale: (o: Locale) => any;
  setData: (o: Partial<IOtherState>) => any;
  setTypeView: (obj: {name: string; type: TypeView}) => any;
  setContacts: (obj: {name: string; contacts: IContact[]}) => any;
  setNotificationToken: (token: string) => any;
}

interface ITypeView {
  [name: string]: TypeView;
}
export interface IOtherState {
  locale: Locale;
  theme: 'light' | 'dark';
  currentIdWishlist: string | null;
  selectedTab: IOption<string, any> | null;
  tokenNotification: string | null;
  statusAdMob: 'UNKNOWN' | 'NON_PERSONALIZED' | 'PERSONALIZED';
  countPublishersAdMob: number;
  countProvidersAdMob: number;
  typeView: ITypeView;
  contacts: {
    [name: string]: IContact[];
  };
  idOpenChat: string | null;
  androidVersionCheck: string;
  isLoadingScreen: boolean;
}
