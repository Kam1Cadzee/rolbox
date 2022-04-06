/* eslint-disable react/jsx-filename-extension */
import 'react-native-gesture-handler';
import {AppRegistry, AppState, LogBox} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import React, {useEffect, useMemo} from 'react';
import {Host} from 'react-native-portalize';
import auth from '@react-native-firebase/auth';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {name as appName} from './app.json';
import ProviderTheme from './src/context/ThemeContext';
import ProviderFormattingContext from './src/context/FormattingContext';
import configureStore from './src/redux/store';
import ProviderModal from './src/context/ModalContext';
import {isAndroid, isIOS} from './src/utils/isPlatform';
import ContainerShare from './src/components/Share/ContainerShare';
import ShareAndroid from './src/components/Share/Share.android';
import {saveTranslation} from './src/utils/translations';
import Content from './src/Content';
import config, {isProd, Mode, mode} from './src/config/configMode';
import {configGoogleSignin, ignoreList} from './src/config/config';
import {configInitI18N} from './src/config/configLocale';
import ErrorBoundary from './src/components/common/ErrorBoundary';
import {backgroundMessageHandler} from './src/components/UseEffectComponents/UseNotificationSetup';
import {dispatchRef, getStoreRef} from './src/utils/navigationRef';
import ProviderEventRedux from './src/context/EventReduxContext';

configInitI18N();

backgroundMessageHandler();
saveTranslation(mode === Mode.LOCAL && false);

if (isProd) {
  LogBox.ignoreAllLogs(true);
} else {
  LogBox.ignoreLogs(ignoreList);
}
const store = configureStore();
dispatchRef.current = store.store.dispatch;
getStoreRef.current = store.store.getState;

const Main = () => {
  useEffect(() => {
    configGoogleSignin();
    if (isIOS) {
      auth().useUserAccessGroup(`${config.appConfig.teamId}.${config.appConfig.bundleId}`);
    }
  }, []);

  return (
    <Provider store={store.store}>
      <PersistGate loading={null} persistor={store.persistor}>
        <ProviderFormattingContext>
          <SafeAreaProvider>
            <ProviderTheme>
              <Host>
                <ProviderModal>
                  <ErrorBoundary>
                    <ProviderEventRedux>
                      <Content />
                    </ProviderEventRedux>
                  </ErrorBoundary>
                </ProviderModal>
              </Host>
            </ProviderTheme>
          </SafeAreaProvider>
        </ProviderFormattingContext>
      </PersistGate>
    </Provider>
  );
};

AppRegistry.registerComponent(appName, () => Main);

// Android registerComponent for extensions or just specific code for Android
if (isAndroid) {
  const Share = () => {
    return (
      <ContainerShare>
        <ShareAndroid />
      </ContainerShare>
    );
  };
  AppRegistry.registerComponent('MyShareEx', () => Share);
}
