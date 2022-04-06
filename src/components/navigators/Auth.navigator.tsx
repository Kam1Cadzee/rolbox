import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack/lib/typescript/src/types';
import LoginScreen from '../screens/Auth.navigator/Login.screen';
import {AuthNavigatorScreenProps, StartNavigatorParamList} from './Start.navigator';
import {sizes, useTheme} from '../../context/ThemeContext';

export type AuthNavigatorParamList = {
  Login: {};
};

type LoginScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<AuthNavigatorParamList, 'Login'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type LoginScreenRouteProp = RouteProp<AuthNavigatorParamList, 'Login'>;

export type LoginScreenProps = {
  route: LoginScreenRouteProp;
  navigation: LoginScreenNavigationProp;
};

const Stack = createStackNavigator<AuthNavigatorParamList>();

const AuthNavigator = React.memo(({navigation}: AuthNavigatorScreenProps) => {
  const {text, backgroundLight} = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="Login"
      headerMode="none"
      screenOptions={{
        title: '',
        headerTruncatedBackTitle: '',
        headerBackTitle: '',
      }}>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
});

export default AuthNavigator;
