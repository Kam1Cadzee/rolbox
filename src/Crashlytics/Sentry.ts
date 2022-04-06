import * as Sentry from '@sentry/react-native';
import DeviceInfo from 'react-native-device-info';
import {Platform} from 'react-native';
import SentryTypeError from '../typings/SentryTypeError';
import config from '../config/configMode';
import {IOS_VERSION} from '../config/configVersion';
import configSentry from '../config/configMode';
import base64 from 'react-native-base64';

const DNS_SENTRY = 'https://2ebf867c1e0b488c869d885a91ef538a@o550262.ingest.sentry.io/5673650';

class SentryCrash {
  public static config() {
    if (config?.sentry?.enabled) {
      Sentry.init({
        release: `RolBox@${IOS_VERSION}`,
        dist: IOS_VERSION,
        dsn: DNS_SENTRY,
        enableNative: true,
        environment: config.sentry.environment,
        normalizeDepth: 1000,
        maxValueLength: 1000,
        beforeSend(event) {
          if (event.tags && !event.tags['Type.error']) {
            event.tags['Type.error'] = SentryTypeError.Uncaught;
          }
          return event;
        },
      });

      Sentry.setContext('OS', {
        os: Platform.OS,
        version: Platform.Version,
      });

      Sentry.setTag('OS', Platform.OS);
      Sentry.setTag('Brand', DeviceInfo.getBrand() ?? '');
      Sentry.setTag('DeviceId', DeviceInfo.getDeviceId() ?? '');
    }
  }

  public static catch(e: any, type: SentryTypeError) {
    if (!configSentry.sentry?.enabled) {
      return;
    }
    try {
      const ignoreList = ['stack', 'jsStack'];

      const JSON_ERROR = JSON.stringify(
        Object.getOwnPropertyNames(e).reduce((a, b) => {
          if (ignoreList.some((i) => i === b)) {
            return a;
          }
          a[b] = e[b];
          return a;
        }, {} as any),
      );

      Sentry.captureException(e, (scope) => {
        scope.setTag('Type.error', type);
        scope.setExtra('Payload', JSON_ERROR);
        scope.setExtra('PayloadBase64', base64.encode(JSON_ERROR));

        return scope;
      });
    } catch {
      Sentry.captureException(e, (scope) => {
        scope.setTag('Type.error', type);

        return scope;
      });
    }
  }
}

export default SentryCrash;
