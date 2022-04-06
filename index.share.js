import React, {useEffect} from 'react';
import {AppRegistry, LogBox} from 'react-native';
import ContainerShare from './src/components/Share/ContainerShare';
import ShareIOS from './src/components/Share/Share.ios';
import {configInitI18N} from './src/config/configLocale';
import config from './src/config/configMode';
import {isIOS} from './src/utils/isPlatform';
import auth from '@react-native-firebase/auth';

configInitI18N();
LogBox.ignoreAllLogs(true);

const Share = () => {
  useEffect(() => {
    if (isIOS) {
      auth().useUserAccessGroup(`${config.appConfig.teamId}.${config.appConfig.bundleId}`);
    }
  }, []);
  return (
    <ContainerShare>
      <ShareIOS />
    </ContainerShare>
  );
};
AppRegistry.registerComponent('ShareMenuModuleComponent', () => Share);
