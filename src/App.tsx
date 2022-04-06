import React, {useMemo} from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import StartNavigator from './components/navigators/Start.navigator';
import {useTheme} from './context/ThemeContext';
import {isReadyRef, navigationRef} from './utils/navigationRef';
import Toast, {BaseToast} from 'react-native-toast-message';

const App = React.memo(() => {
  const {theme, ...colors} = useTheme();

  const toastConfig = useMemo(() => {
    return {
      info: ({...rest}: any) => {
        return (
          <BaseToast
            {...rest}
            style={{borderLeftColor: colors.secondary}}
            contentContainerStyle={{paddingHorizontal: 15}}
            text1Style={{
              color: colors.text,
            }}
          />
        );
      },
    };
  }, []);

  const MyTheme: any = {
    dark: theme === 'dark',
    colors: {
      primary: colors.primary,
      background: colors.background,
      card: colors.background,
      text: colors.text,
      notification: 'red',
    },
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        isReadyRef.current = true;
      }}
      theme={MyTheme}>
      <StatusBar
        animated={true}
        backgroundColor={colors.background}
        translucent={false}
        showHideTransition={'slide'}
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <StartNavigator />
      <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
    </NavigationContainer>
  );
});

export default App;
