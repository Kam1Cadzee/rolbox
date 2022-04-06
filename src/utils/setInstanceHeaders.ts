import {AxiosInstance} from 'axios';
import {getAvailableLocale} from '../config/configLocale';
import {ANDROID_VERSION, IOS_VERSION} from '../config/configVersion';
import {isIOS} from './isPlatform';

const setInstanceHeaders = (instance: AxiosInstance, headers: any = {}) => {
  instance.defaults.headers = {
    ...instance.defaults.headers,
    platform: isIOS ? 'ios' : 'android',
    'platform-version': isIOS ? IOS_VERSION : ANDROID_VERSION,
    locale: getAvailableLocale(),
    ...headers,
  };
};

export default setInstanceHeaders;
