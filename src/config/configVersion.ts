import SpInAppUpdates, {AndroidUpdateType, NeedsUpdateResponse} from 'sp-react-native-in-app-updates';
import DeviceInfo from 'react-native-device-info';

const IOS_VERSION = DeviceInfo.getVersion();
const ANDROID_VERSION = +DeviceInfo.getBuildNumber();

class CheckAndroidVersion {
  static inAppUpdates = new SpInAppUpdates(
    false, // isDebug
  );

  static async check() {
    return CheckAndroidVersion.inAppUpdates.checkNeedsUpdate({
      curVersion: ANDROID_VERSION.toString(),
      customVersionComparator: (v1, v2) => {
        const res = +v1 - +v2;

        if (res === 0) {
          return 0;
        } else if (res < 0) {
          return -1;
        } else {
          return 1;
        }
      },
    });
  }

  static async startUpdate(result: NeedsUpdateResponse) {
    if (result.shouldUpdate) {
      return CheckAndroidVersion.inAppUpdates.startUpdate({
        updateType: 1,
      });
    }
    return;
  }
}

export {IOS_VERSION, ANDROID_VERSION, CheckAndroidVersion};
