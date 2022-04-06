import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {StackScreenProps} from '@react-navigation/stack/src/types';
import {useDispatch, useSelector} from 'react-redux';
import MainNavigator from './Main.navigator';
import AuthNavigator from './Auth.navigator';
import {actionsUser, selectorsUser} from '../../redux/user/userReducer';
import AdditionalNavigator from './Additional.navigator';
import {navigationRef, userIdRef} from '../../utils/navigationRef';
import SplashScreen from 'react-native-splash-screen';
import {actionsOther} from '../../redux/other/otherReducer';
import authService from '../../services/authService/authService';
import Providers from '../../constants/Providers';

export type StartNavigatorParamList = {
  MainNavigator: {};
  AuthNavigator: {};
  AdditionalNavigator: {};
};

export type MainNavigatorScreenProps = StackScreenProps<StartNavigatorParamList, 'MainNavigator'>;
export type AuthNavigatorScreenProps = StackScreenProps<StartNavigatorParamList, 'AuthNavigator'>;
export type AdditionalNavigatorScreenProps = StackScreenProps<StartNavigatorParamList, 'AdditionalNavigator'>;

const Stack = createStackNavigator<StartNavigatorParamList>();

const StartNavigator = React.memo(() => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectorsUser.isAuth);
  const isNeededEdit = useSelector(selectorsUser.isNeededEdit);
  const isNeedToUpdate = useSelector(selectorsUser.isNeedToUpdate);
  const userId = useSelector(selectorsUser.getUserId);

  useEffect(() => {
    if (!isAuth) {
      userIdRef.current = null;
      return;
    }

    if (isNeedToUpdate) {
      authService.getProfile().then((res) => {
        if (res.success) {
          dispatch(actionsUser.setUser(res.data![0]));
        }
      });

      SplashScreen.hide();
    }

    userIdRef.current = userId;
    if (isNeededEdit) {
      navigationRef.current.navigate('AdditionalNavigator', {
        screen: 'EditProfile',
      });
    }
  }, [isAuth]);

  return (
    <Stack.Navigator initialRouteName={'AuthNavigator'} headerMode="none">
      {!isAuth && <Stack.Screen name="AuthNavigator" component={AuthNavigator} />}
      {isAuth && (
        <>
          <Stack.Screen name="MainNavigator" component={MainNavigator} />
          <Stack.Screen name="AdditionalNavigator" component={AdditionalNavigator} />
        </>
      )}
    </Stack.Navigator>
  );
});

export default StartNavigator;
