import {GestureHandlerRootView} from 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import {Host, Portal} from 'react-native-portalize';

import I18n from 'react-native-i18n';
import configureStore from '../../redux/store';
import ProviderTheme, {sizes} from '../../context/ThemeContext';
import {getFromStorage} from '../../utils/saveToStorage';
import {getAvailableLocale} from '../../config/configLocale';
import {Dimensions} from 'react-native';
const {width} = Dimensions.get('screen');

const store = configureStore();

const ContainerShare = ({children}: any) => {
  useEffect(() => {
    getFromStorage('locale').then((res) => {
      I18n.locale = res || getAvailableLocale();
    });
  }, []);

  return (
    <Host
      style={{
        width,
      }}>
      <Provider store={store.store}>
        <ProviderTheme>
          <GestureHandlerRootView style={{flex: 1}}>{children}</GestureHandlerRootView>
        </ProviderTheme>
      </Provider>
    </Host>
  );
};

export default ContainerShare;
