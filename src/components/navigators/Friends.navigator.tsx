import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack/lib/typescript/src/types';
import {FriendsNavigatorProps, MainNavigatorParamList} from './Main.navigator';
import FriendsScreen from '../screens/Friends.navigator/Friends.screen';
import FriendProfileScreen from '../screens/Friends.navigator/FriendProfile.screen';
import {IUser} from '../../typings/IUser';
import HeaderScreen from '../common/HeaderScreen';
import ListFriendsScreen from '../screens/Friends.navigator/ListFriends.screen';
import t from '../../utils/t';

export type FriendsNavigatorParamList = {
  Friends: {};
  FriendProfile: {
    friend: IUser;
  };
  ListFriends: {
    friend: IUser;
  };
};

export type FriendsScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<FriendsNavigatorParamList, 'Friends'>,
  StackNavigationProp<MainNavigatorParamList>
>;
type FriendsScreenRouteProp = RouteProp<FriendsNavigatorParamList, 'Friends'>;

export type FriendsScreenProps = {
  route: FriendsScreenRouteProp;
  navigation: FriendsScreenNavigationProp;
};

type FriendProfileScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<FriendsNavigatorParamList, 'FriendProfile'>,
  StackNavigationProp<MainNavigatorParamList>
>;
type FriendProfileScreenRouteProp = RouteProp<FriendsNavigatorParamList, 'FriendProfile'>;

export type FriendProfileScreenProps = {
  route: FriendProfileScreenRouteProp;
  navigation: FriendProfileScreenNavigationProp;
};

type ListFriendsScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<FriendsNavigatorParamList, 'ListFriends'>,
  StackNavigationProp<MainNavigatorParamList>
>;
type ListFriendsScreenRouteProp = RouteProp<FriendsNavigatorParamList, 'ListFriends'>;

export type ListFriendsScreenProps = {
  route: ListFriendsScreenRouteProp;
  navigation: ListFriendsScreenNavigationProp;
};

const Stack = createStackNavigator<FriendsNavigatorParamList>();

const FriendsNavigator = React.memo(({}: FriendsNavigatorProps) => {
  return (
    <Stack.Navigator
      headerMode="screen"
      initialRouteName="Friends"
      screenOptions={{
        header: (props) => {
          return <HeaderScreen {...props} />;
        },
      }}>
      <Stack.Screen
        name="Friends"
        options={{
          header: () => null,
        }}
        component={FriendsScreen}
      />
      <Stack.Screen name="FriendProfile" component={FriendProfileScreen} />
      <Stack.Screen
        name="ListFriends"
        options={{
          title: t('friends'),
        }}
        component={ListFriendsScreen}
      />
    </Stack.Navigator>
  );
});

export default FriendsNavigator;
