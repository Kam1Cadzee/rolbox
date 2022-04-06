import {ANDROID_VERSION, IOS_VERSION} from '../config/configVersion';

const validateVersion = (version?: string | number | null) => {
  if (version === undefined || version === null) {
    return false;
  }

  if (typeof version === 'number') {
    return ANDROID_VERSION >= version;
  }
  const currentVersions = IOS_VERSION.split('.').map(parseFloat);
  const versions = version.toString().split('.').map(parseFloat);

  try {
    for (let i = 0; i < 3; i += 1) {
      if (currentVersions[i] < versions[i]) {
        return false;
      } else if (currentVersions[i] > versions[i]) {
        return true;
      }
    }

    return true;
  } catch {
    return false;
  }
};

export default validateVersion;
