import * as Sentry from '@sentry/react-native';
import base64 from 'react-native-base64';
import configSentry from '../config/configMode';
import SentryTypeError from '../typings/SentryTypeError';

const generateSentryError = (e: any, type: SentryTypeError) => {
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
};

export default generateSentryError;
