enum Mode {
  LOCAL = 'LOCAL',
  DEV = 'DEV',
  PROD = 'PROD',
  UAT = 'UAT',
}
const mode: any = Mode.PROD;

const config = (() => {
  switch (mode) {
    case Mode.DEV:
      return {
        baseURL: 'https://dev.rolbox.huspi.com',
        sentry: {
          enabled: true,
          environment: Mode.DEV,
        },
        admobAndroid: 'ca-app-pub-2960614240062252~3937816133',
        admobIOS: 'ca-app-pub-2960614240062252~9062150305',
        publisherID: ['pub-2960614240062252'],
        debugAdbmob: false,

        appConfig: {
          bundleId: 'com.huspi.rolbox',
          appStoreId: '1557678129',
          packageName: 'com.rollbox',
          teamId: 'E2J8W9HEEC',
        },
      };
    case Mode.PROD:
      return {
        baseURL: 'https://app-backend.rolbox.app',
        sentry: {
          enabled: true,
          environment: Mode.PROD,
        },
        admobAndroid: '',
        admobIOS: '',
        publisherID: [''],
        debugAdbmob: false,

        appConfig: {
          bundleId: 'com.rolbox',
          appStoreId: '1569083669',
          packageName: 'com.rolbox',
          teamId: '8HRQVU92F4',
        },
      };
    case Mode.UAT:
      return {
        baseURL: 'https://dev.rolbox.huspi.com',
        sentry: {
          enabled: true,
          environment: Mode.UAT,
        },
        admobAndroid: 'ca-app-pub-2960614240062252~3937816133',
        admobIOS: 'ca-app-pub-2960614240062252~9062150305',
        publisherID: ['pub-2960614240062252'],
        debugAdbmob: false,
        appConfig: {
          bundleId: 'com.huspi.rolbox',
          appStoreId: '1557678129',
          packageName: 'com.rollbox',
          teamId: 'E2J8W9HEEC',
        },
      };
    default:
      return {
        baseURL: 'https://dev.rolbox.huspi.com',
        sentry: {
          enabled: false,
          environment: Mode.LOCAL,
        },
        admobAndroid: 'ca-app-pub-2960614240062252/3937816133',
        admobIOS: 'ca-app-pub-2960614240062252/9062150305',
        publisherID: ['pub-2960614240062252'], // 'pub-3940256099942544'
        debugAdbmob: false,
        appConfig: {
          bundleId: 'com.huspi.rolbox',
          appStoreId: '1557678129',
          packageName: 'com.rollbox',
          teamId: 'E2J8W9HEEC',
        },
      };
  }
})();

const isProd = mode === Mode.PROD;
const isDev = mode !== Mode.PROD;

export {Mode, mode, isProd, isDev};
export default config;
