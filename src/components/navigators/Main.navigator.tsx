import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import {StackNavigationProp} from '@react-navigation/stack/lib/typescript/src/types';
import {MainNavigatorScreenProps, StartNavigatorParamList} from './Start.navigator';
import ProfileScreen from '../screens/Main.navigator/Profile.screen';
import FriendsNavigator from './Friends.navigator';
import Icon from '../common/Icons';
import TabBar from '../TabBar/TabBar';
import InvisibleNavigator from './Invisible.navigator';
import EventScreen from '../screens/Main.navigator/Event.screen';
import MessengerScreen from '../screens/Main.navigator/Messenger.screen';
import {useTheme} from '../../context/ThemeContext';

export type MainNavigatorParamList = {
  FriendsNavigator: {};
  Profile: {};
  InvisibleNavigator: {};
  Event: {
    id?: string;
  };
  Messenger: {};
};

type FriendsNavigatorNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainNavigatorParamList, 'FriendsNavigator'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type FriendsNavigatorRouteProp = RouteProp<MainNavigatorParamList, 'FriendsNavigator'>;

export type FriendsNavigatorProps = {
  route: FriendsNavigatorRouteProp;
  navigation: FriendsNavigatorNavigationProp;
};

type InvisibleNavigatorNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainNavigatorParamList, 'InvisibleNavigator'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type InvisibleNavigatorRouteProp = RouteProp<MainNavigatorParamList, 'InvisibleNavigator'>;

export type InvisibleNavigatorProps = {
  route: InvisibleNavigatorRouteProp;
  navigation: InvisibleNavigatorNavigationProp;
};

export type ProfileScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainNavigatorParamList, 'Profile'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type ProfileScreenRouteProp = RouteProp<MainNavigatorParamList, 'Profile'>;

export type ProfileScreenProps = {
  route: ProfileScreenRouteProp;
  navigation: ProfileScreenNavigationProp;
};

export type EventScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainNavigatorParamList, 'Event'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type EventScreenRouteProp = RouteProp<MainNavigatorParamList, 'Event'>;

export type EventScreenProps = {
  route: EventScreenRouteProp;
  navigation: EventScreenNavigationProp;
};

type MessengerScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainNavigatorParamList, 'Messenger'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type MessengerScreenRouteProp = RouteProp<MainNavigatorParamList, 'Messenger'>;

export type MessengerScreenProps = {
  route: MessengerScreenRouteProp;
  navigation: MessengerScreenNavigationProp;
};

const Tab = createBottomTabNavigator<MainNavigatorParamList>();

const MainNavigator = React.memo(({}: MainNavigatorScreenProps) => {
  const {secondary, text, background} = useTheme();

  return (
    <Tab.Navigator
      backBehavior="history"
      tabBarOptions={{
        keyboardHidesTabBar: true,
      }}
      tabBar={(props: any) => {
        return <TabBar {...props} />;
      }}
      initialRouteName="Profile">
      <Tab.Screen
        name="Event"
        component={EventScreen}
        options={{
          tabBarIcon: ({size, color, isCurrent, ...props}: any) => {
            let fill = isCurrent ? secondary : background;
            let stroke = isCurrent ? secondary : text;

            return (
              <React.Fragment>
                <Icon name="EventMenuIcon" size={size} fill={fill} {...props} strokeWidth={1.5} stroke={stroke} />
              </React.Fragment>
            );
          },
          unmountOnBlur: false,
        }}
      />
      <Tab.Screen
        name="FriendsNavigator"
        component={FriendsNavigator}
        options={{
          tabBarIcon: ({size, color, isCurrent, ...props}: any) => {
            let fill = isCurrent ? secondary : background;
            let stroke = isCurrent ? secondary : text;

            return <Icon name="FriendsIcon" size={size} fill={fill} {...props} strokeWidth={1.5} stroke={stroke} />;
          },
          unmountOnBlur: false,
        }}
      />
      <Tab.Screen
        name="InvisibleNavigator"
        options={{
          unmountOnBlur: true,
        }}
        component={InvisibleNavigator}
      />
      <Tab.Screen
        name="Messenger"
        component={MessengerScreen}
        options={{
          tabBarIcon: ({size, color, isCurrent, ...props}: any) => {
            let fill = isCurrent ? secondary : background;
            let stroke = isCurrent ? background : text;

            return <Icon name="ChatMenuIcon" size={size} fill={fill} {...props} strokeWidth={1.5} stroke={stroke} />;
          },
          unmountOnBlur: true,
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({size, color, isCurrent, ...props}: any) => {
            let fill = isCurrent ? secondary : background;
            let stroke = isCurrent ? secondary : text;
            return <Icon name="ProfileIcon" size={size} fill={fill} {...props} strokeWidth={1.5} stroke={stroke} />;
          },
        }}
      />
    </Tab.Navigator>
  );
});

export default MainNavigator;
