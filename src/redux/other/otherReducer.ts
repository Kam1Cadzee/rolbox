import {CreatorReducer} from '../base/base';
import {IOtherActions, IOtherState} from './otherTypes';
import {RootState} from '../reducer';
import {getAvailableLocale} from '../../config/configLocale';
import TypeView from '../../typings/TypeView';
import {IContact} from '../../typings/IContact';
import {actionsUser} from '../user/userReducer';

const init: IOtherState = {
  locale: getAvailableLocale(),
  theme: 'light',
  currentIdWishlist: null,
  selectedTab: null,
  tokenNotification: null,
  countProvidersAdMob: -1,
  countPublishersAdMob: -1,
  statusAdMob: 'UNKNOWN',
  typeView: {},
  contacts: {},
  idOpenChat: null,
  androidVersionCheck: '',
};

const creator = new CreatorReducer<IOtherActions, IOtherState>('other');
creator.addAction(actionsUser.setIsAuth, (state, action) => {
  if (!action.payload) {
    return {
      ...state,
      tokenNotification: null,
    };
  }
  return state;
});
creator.addAction('setData', (state, action) => {
  return {...state, ...action.payload};
});
creator.addAction('setLocale', (state, action) => {
  return {...state, locale: action.payload};
});
creator.addAction<{name: string; type: TypeView}>('setTypeView', (state, action) => {
  const {name, type} = action.payload;
  return {...state, typeView: {...state.typeView, [name]: type}};
});
creator.addAction<{name: string; contacts: IContact[]}>('setContacts', (state, action) => {
  const {name, contacts} = action.payload;

  return {...state, contacts: {...state.contacts, [name]: contacts}};
});
creator.addAction('setNotificationToken', (state, action) => {
  return {...state, tokenNotification: action.payload};
});
const actionsOther = creator.createActions();

const selectorsOther = {
  getLocale: (state: RootState) => state.other.locale,
  getIdOpenChat: (state: RootState) => state.other.idOpenChat,
  getTheme: (state: RootState) => {
    return state.other.theme;
  },
  getCurrentIdWishlist: (state: RootState) => {
    return state.other.currentIdWishlist;
  },
  getSelectedTab: (state: RootState) => state.other.selectedTab,
  getTokenNotification: (state: RootState) => {
    return state.other.tokenNotification;
  },
  getCountPublishersAdMob: (state: RootState) => state.other.countPublishersAdMob,
  getCountProvidersAdMob: (state: RootState) => state.other.countProvidersAdMob,
  getStatusAdMob: (state: RootState) => state.other.statusAdMob,
  getTypeView: (name: string) => (state: RootState) => {
    const typeView = state.other.typeView[name];
    return typeView ?? TypeView.grid;
  },
  getContacts: (state: RootState) => {
    const userId = state.user.user?._id ?? '';
    return state.other.contacts[userId] ?? [];
  },
  getItem: (key: keyof IOtherState) => (state: RootState) => state.other[key],
};

export {actionsOther, selectorsOther};
export default creator.createReducer(init);
