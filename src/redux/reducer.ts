import {combineReducers} from 'redux';
import {persistReducer} from 'redux-persist';
import MMKVStorage from 'react-native-mmkv-storage';
import {IOtherState} from './other/otherTypes';
import otherReducer from './other/otherReducer';
import {IUserState} from './user/userTypes';
import userReducer from './user/userReducer';
import {IConfigState} from './config/configTypes';
import configReducer from './config/configReducer';
import {IEventState} from './event/eventTypes';
import eventReducer from './event/eventReducer';

const storage = new MMKVStorage.Loader().initialize();

const otherPersistConfig = {
  key: 'other',
  storage: storage,
  whitelist: [
    'locale',
    'tokenNotification',
    'countProvidersAdMob',
    'countPublishersAdMob',
    'typeView',
    'isFirstEnter',
    'androidVersionCheck',
  ] as (keyof IOtherState)[],
};

const userPersistConfig = {
  key: 'user',
  storage: storage,
  whitelist: ['isAuth', 'user', 'userFirebase'] as (keyof IUserState)[],
};

export interface RootState {
  other: IOtherState;
  user: IUserState;
  config: IConfigState;
  event: IEventState;
}

export default combineReducers({
  other: persistReducer(otherPersistConfig, otherReducer),
  user: persistReducer(userPersistConfig, userReducer),
  config: configReducer,
  event: eventReducer,
});
