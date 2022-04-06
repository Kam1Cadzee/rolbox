import {ANDROID_VERSION, IOS_VERSION} from '../../config/configVersion';
import {isIOS} from '../../utils/isPlatform';
import {CreatorReducer} from '../base/base';
import {RootState} from '../reducer';
import {IConfigActions, IConfigState, ItemConfigState} from './configTypes';

const init: IConfigState = {
  enabledDeeplink: true,
  enabledOptionalCheckVersion: true,
  enabledRequiredCheckVersion: true,
  enabledSharing: true,
  optionalVersionAndroid: ANDROID_VERSION,
  optionalVersionIOS: IOS_VERSION,
  requiredVersionAndroid: ANDROID_VERSION,
  requiredVersionIOS: IOS_VERSION,
  enabledLoadTranslations: null,
  fallbackUrlAndroid: '',
  fallbackUrlIOS: '',
};

const creator = new CreatorReducer<IConfigActions, IConfigState>('config');
creator.addAction('setData', (state, action) => {
  return {...state, ...action.payload};
});
const actionsConfig = creator.createActions();

const selectorsConfig = {
  getItemConfig: (name: ItemConfigState) => (state: RootState) => {
    return state.config[name];
  },
  getRequiredVersion: (state: RootState) =>
    isIOS ? state.config.requiredVersionIOS : state.config.requiredVersionAndroid,
  getOptionalVersion: (state: RootState) =>
    isIOS ? state.config.optionalVersionIOS : state.config.optionalVersionAndroid,
  getAllConfig: (state: RootState) => state.config,
  getFallbackUrl: (state: RootState) => {
    return isIOS ? state.config.fallbackUrlIOS : state.config.fallbackUrlAndroid;
  },
};

export {selectorsConfig, actionsConfig};
export default creator.createReducer(init);
