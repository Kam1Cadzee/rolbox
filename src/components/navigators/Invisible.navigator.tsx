import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack/lib/typescript/src/types';
import {InvisibleNavigatorProps, MainNavigatorParamList} from './Main.navigator';
import GiftsScreen from '../screens/Invisible.navigator/Gifts.screen';
import HeaderScreen from '../common/HeaderScreen';
import WishlistInteractScreen from '../screens/Invisible.navigator/WishlistInteract.screen';
import GiftInteractScreen from '../screens/Invisible.navigator/GiftInteract.screen';
import {IWishlist} from '../../typings/IWishlist';
import WishlistScreen from '../screens/Invisible.navigator/Wishlist.screen';
import {IUser} from '../../typings/IUser';
import t from '../../utils/t';
import IGift from '../../typings/IGift';
import WillGiftsScreen from '../screens/Invisible.navigator/WillGifts.screen';
import {StatusGift} from '../../typings/StatusGift';

export type InvisibleNavigatorParamList = {
  Gifts: {};
  Wishlist: {
    defaultWishlist: IWishlist;
    owner: IUser;
  };
  WishlistInteract: {
    idDefaultWishlist: string;
  };
  GiftInteract: {
    id: string;
    currentWishlist: IWishlist;
  };
  WillGifts: {
    status: StatusGift;
    idGift: string;
  };
};

type GiftsScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<InvisibleNavigatorParamList, 'Gifts'>,
  StackNavigationProp<MainNavigatorParamList>
>;
type GiftsScreenRouteProp = RouteProp<InvisibleNavigatorParamList, 'Gifts'>;

export type GiftsScreenProps = {
  route: GiftsScreenRouteProp;
  navigation: GiftsScreenNavigationProp;
};

export type WishlistInteractScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<InvisibleNavigatorParamList, 'WishlistInteract'>,
  StackNavigationProp<MainNavigatorParamList>
>;
type WishlistInteractScreenRouteProp = RouteProp<InvisibleNavigatorParamList, 'WishlistInteract'>;

export type WishlistInteractScreenProps = {
  route: WishlistInteractScreenRouteProp;
  navigation: WishlistInteractScreenNavigationProp;
};

export type GiftInteractScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<InvisibleNavigatorParamList, 'GiftInteract'>,
  StackNavigationProp<MainNavigatorParamList>
>;
type GiftInteractScreenRouteProp = RouteProp<InvisibleNavigatorParamList, 'GiftInteract'>;

export type GiftInteractScreenProps = {
  route: GiftInteractScreenRouteProp;
  navigation: GiftInteractScreenNavigationProp;
};

export type WishlistScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<InvisibleNavigatorParamList, 'Wishlist'>,
  StackNavigationProp<MainNavigatorParamList>
>;
type WishlistScreenRouteProp = RouteProp<InvisibleNavigatorParamList, 'Wishlist'>;

export type WishlistScreenProps = {
  route: WishlistScreenRouteProp;
  navigation: WishlistScreenNavigationProp;
};

type WillGiftsScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<InvisibleNavigatorParamList, 'WillGifts'>,
  StackNavigationProp<MainNavigatorParamList>
>;
type WillGiftsScreenRouteProp = RouteProp<InvisibleNavigatorParamList, 'WillGifts'>;

export type WillGiftsScreenProps = {
  route: WillGiftsScreenRouteProp;
  navigation: WillGiftsScreenNavigationProp;
};

const Stack = createStackNavigator<InvisibleNavigatorParamList>();

const InvisibleNavigator = React.memo(({}: InvisibleNavigatorProps) => {
  return (
    <Stack.Navigator
      headerMode="screen"
      detachInactiveScreens={true}
      initialRouteName="Gifts"
      screenOptions={{
        header: (props) => <HeaderScreen {...props} />,
      }}>
      <Stack.Screen
        name="Gifts"
        options={{
          title: t('itemsIWillGift'),
        }}
        component={GiftsScreen}
      />
      <Stack.Screen
        name="WishlistInteract"
        options={{
          title: t('wishlist'),
        }}
        component={WishlistInteractScreen}
      />
      <Stack.Screen
        name="GiftInteract"
        options={{
          title: t('gift'),
        }}
        component={GiftInteractScreen}
      />
      <Stack.Screen
        name="Wishlist"
        options={{
          title: t('wishlist'),
        }}
        component={WishlistScreen}
      />
      <Stack.Screen
        name="WillGifts"
        options={{
          title: t('wishlist'),
        }}
        component={WillGiftsScreen}
      />
    </Stack.Navigator>
  );
});

export default InvisibleNavigator;
