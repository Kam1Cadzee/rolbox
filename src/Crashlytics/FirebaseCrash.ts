import {IUser} from '../typings/IUser';
import crashlytics from '@react-native-firebase/crashlytics';
import SentryTypeError from '../typings/SentryTypeError';
import config, {Mode, mode} from '../config/configMode';
import {isIOS} from '../utils/isPlatform';
import {ANDROID_VERSION, IOS_VERSION} from '../config/configVersion';

class FirebaseCrash {
  public static init(user: IUser) {
    if (mode === Mode.LOCAL) {
      return;
    }
    FirebaseCrash.log(`User ${user.firstName} by id(${user._id}) signed in.`);

    crashlytics().setUserId(user._id);
    crashlytics().setAttributes({
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      ENV: mode,
      OS: isIOS ? 'iOS' : 'Android',
      version: (isIOS ? IOS_VERSION : ANDROID_VERSION).toString(),
    });
  }

  public static log(str: string | any) {
    if (mode === Mode.LOCAL) {
      return;
    }
    if (typeof str === 'string') {
      crashlytics().log(str);
    }
    try {
      crashlytics().log(JSON.stringify(str));
    } catch {
      crashlytics().log((str as Error).message);
    }
  }

  public static catch(error: Error, errorName: SentryTypeError) {
    if (mode === Mode.LOCAL) {
      return;
    }
    crashlytics().recordError(error, errorName);
  }
}

export default FirebaseCrash;
