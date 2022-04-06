import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack/lib/typescript/src/types';
import {AdditionalNavigatorScreenProps, StartNavigatorParamList} from './Start.navigator';
import EditProfileScreen from '../screens/Additional.navigator/EditProfile.screen';
import HeaderScreen from '../common/HeaderScreen';
import IGift, {IGiftShare} from '../../typings/IGift';
import GiftScreen from '../screens/Additional.navigator/Gift.screen';
import AddGiftScreen from '../screens/Additional.navigator/AddGift.screen';
import AddWishlistScreen from '../screens/Additional.navigator/AddWishlist.screen';
import AddAddressScreen from '../screens/Additional.navigator/AddAddress.screen';
import IAddress from '../../typings/IAddress';
import {IWishlist} from '../../typings/IWishlist';
import {IUser} from '../../typings/IUser';
import t from '../../utils/t';
import AddEventScreen from '../screens/Additional.navigator/AddEvent.screen.';
import {IEvent} from '../../typings/IEvent';
import CalendarScreen from '../screens/Additional.navigator/Calendar.screen';
import ChatScreen from '../screens/Additional.navigator/Chat.screen';
import {IChat, IMessage} from '../../typings/IChat';
import InfoChatScreen from '../screens/Additional.navigator/InfoChat.sceen';
import FriendProfileScreen from '../screens/Friends.navigator/FriendProfile.screen';
import IGuest from '../../typings/IGuest';
import AddGuestScreen from '../screens/Additional.navigator/AddGuest.screen';
import EditNameScreen from '../screens/Additional.navigator/EditName.screen';
import ListFriendsScreen from '../screens/Friends.navigator/ListFriends.screen';
import AddPeopleScreen from '../screens/Additional.navigator/AddPeople.screen';
import AddPeopleDetailScreen from '../screens/Additional.navigator/AddPeopleDetail.screen';

export type AdditionalNavigatorParamList = {
  EditProfile: {};
  EditName: {};
  Gift: {
    idGift: string;
    currentWishlist: IWishlist;
    owner: IUser;
  };
  AddGift: {
    gift: IGift;
    throwIdWishlist: string;
    shareData?: IGiftShare;
  };
  AddWishlist: {
    wishlist?: IWishlist;
    address?: IAddress;
    isBackToAddGift?: boolean;
    isBackToAddEvent?: boolean;
    updatedPeople?: IUser[];
  };
  AddAddress: {
    address?: IAddress;
  };
  AddEvent: {
    throwIdWishlist: string;
    event?: IEvent;
    updatedGuests?: IUser[];
  };
  Calendar: {};
  Chat: {
    chat: IChat;
    localMessage: IMessage;
  };
  InfoChat: {
    chat: IChat;
  };
  FriendProfile: {
    friend: IUser;
  };
  AddGuests: {
    guests: IUser[];
  };
  AddPeople: {
    people: IUser[];
  };

  AddPeopleDetail: {
    wishlist: IWishlist;
  };
  ListFriends: {
    friend: IUser;
  };
};

type EditProfileScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<AdditionalNavigatorParamList, 'EditProfile'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type EditProfileScreenRouteProp = RouteProp<AdditionalNavigatorParamList, 'EditProfile'>;

export type EditProfileScreenProps = {
  route: EditProfileScreenRouteProp;
  navigation: EditProfileScreenNavigationProp;
};

type GiftScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<AdditionalNavigatorParamList, 'Gift'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type GiftScreenRouteProp = RouteProp<AdditionalNavigatorParamList, 'Gift'>;

export type GiftScreenProps = {
  route: GiftScreenRouteProp;
  navigation: GiftScreenNavigationProp;
};

type AddGiftScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<AdditionalNavigatorParamList, 'AddGift'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type AddGiftScreenRouteProp = RouteProp<AdditionalNavigatorParamList, 'AddGift'>;

export type AddGiftScreenProps = {
  route: AddGiftScreenRouteProp;
  navigation: AddGiftScreenNavigationProp;
};

type AddWishlistScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<AdditionalNavigatorParamList, 'AddWishlist'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type AddWishlistScreenRouteProp = RouteProp<AdditionalNavigatorParamList, 'AddWishlist'>;

export type AddWishlistScreenProps = {
  route: AddWishlistScreenRouteProp;
  navigation: AddWishlistScreenNavigationProp;
};

type AddAddressScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<AdditionalNavigatorParamList, 'AddAddress'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type AddAddressScreenRouteProp = RouteProp<AdditionalNavigatorParamList, 'AddAddress'>;

export type AddAddressScreenProps = {
  route: AddAddressScreenRouteProp;
  navigation: AddAddressScreenNavigationProp;
};

type AddEventScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<AdditionalNavigatorParamList, 'AddEvent'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type AddEventScreenRouteProp = RouteProp<AdditionalNavigatorParamList, 'AddEvent'>;

export type AddEventScreenProps = {
  route: AddEventScreenRouteProp;
  navigation: AddEventScreenNavigationProp;
};

type CalendarScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<AdditionalNavigatorParamList, 'Calendar'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type CalendarScreenRouteProp = RouteProp<AdditionalNavigatorParamList, 'Calendar'>;

export type CalendarScreenProps = {
  route: CalendarScreenRouteProp;
  navigation: CalendarScreenNavigationProp;
};

type ChatScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<AdditionalNavigatorParamList, 'Chat'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type ChatScreenRouteProp = RouteProp<AdditionalNavigatorParamList, 'Chat'>;

export type ChatScreenProps = {
  route: ChatScreenRouteProp;
  navigation: ChatScreenNavigationProp;
};

type InfoChatScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<AdditionalNavigatorParamList, 'InfoChat'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type InfoChatScreenRouteProp = RouteProp<AdditionalNavigatorParamList, 'InfoChat'>;

export type InfoChatScreenProps = {
  route: InfoChatScreenRouteProp;
  navigation: InfoChatScreenNavigationProp;
};

type AddGuestsScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<AdditionalNavigatorParamList, 'AddGuests'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type AddGuestsScreenRouteProp = RouteProp<AdditionalNavigatorParamList, 'AddGuests'>;

export type AddGuestsScreenProps = {
  route: AddGuestsScreenRouteProp;
  navigation: AddGuestsScreenNavigationProp;
};

type EditNameScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<AdditionalNavigatorParamList, 'EditName'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type EditNameScreenRouteProp = RouteProp<AdditionalNavigatorParamList, 'EditName'>;

export type EditNameScreenProps = {
  route: EditNameScreenRouteProp;
  navigation: EditNameScreenNavigationProp;
};

type ListFriendsScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<AdditionalNavigatorParamList, 'ListFriends'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type ListFriendsScreenRouteProp = RouteProp<AdditionalNavigatorParamList, 'ListFriends'>;

export type ListFriendsScreenProps = {
  route: ListFriendsScreenRouteProp;
  navigation: ListFriendsScreenNavigationProp;
};

type AddPeopleScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<AdditionalNavigatorParamList, 'AddPeople'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type AddPeopleScreenRouteProp = RouteProp<AdditionalNavigatorParamList, 'AddPeople'>;

export type AddPeopleScreenProps = {
  route: AddPeopleScreenRouteProp;
  navigation: AddPeopleScreenNavigationProp;
};

type AddPeopleDetailScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<AdditionalNavigatorParamList, 'AddPeopleDetail'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type AddPeopleDetailScreenRouteProp = RouteProp<AdditionalNavigatorParamList, 'AddPeopleDetail'>;

export type AddPeopleDetailScreenProps = {
  route: AddPeopleDetailScreenRouteProp;
  navigation: AddPeopleDetailScreenNavigationProp;
};

const Stack = createStackNavigator<AdditionalNavigatorParamList>();

const AdditionalNavigator = React.memo(({}: AdditionalNavigatorScreenProps) => {
  return (
    <Stack.Navigator
      headerMode="screen"
      initialRouteName="EditProfile"
      detachInactiveScreens={true}
      screenOptions={{
        header: (props) => <HeaderScreen {...props} />,
      }}>
      <Stack.Screen
        name="EditProfile"
        options={{
          title: t('editProfile'),
        }}
        component={EditProfileScreen}
      />
      <Stack.Screen
        name="Gift"
        options={{
          title: t('giftOne'),
        }}
        component={GiftScreen}
      />
      <Stack.Screen
        name="AddGift"
        options={{
          title: t('addGift'),
        }}
        component={AddGiftScreen}
      />
      <Stack.Screen
        name="AddWishlist"
        options={{
          title: t('addWishlist'),
        }}
        component={AddWishlistScreen}
      />
      <Stack.Screen
        name="AddAddress"
        options={{
          title: t('addAddress'),
        }}
        component={AddAddressScreen}
      />
      <Stack.Screen
        name="AddEvent"
        options={{
          title: t('createEvent'),
        }}
        component={AddEventScreen}
      />
      <Stack.Screen
        name="Calendar"
        options={{
          title: t('titleCalendar'),
        }}
        component={CalendarScreen}
      />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="InfoChat" component={InfoChatScreen} />
      <Stack.Screen name="FriendProfile" component={FriendProfileScreen} />
      <Stack.Screen name="ListFriends" component={ListFriendsScreen} />
      <Stack.Screen name="AddPeople" component={AddPeopleScreen} />
      <Stack.Screen name="AddPeopleDetail" component={AddPeopleDetailScreen} />
      <Stack.Screen
        name="EditName"
        options={{
          header: () => null,
        }}
        component={EditNameScreen}
      />
      <Stack.Screen
        name="AddGuests"
        options={{
          title: t('addGuests'),
        }}
        component={AddGuestScreen}
      />
    </Stack.Navigator>
  );
});

export default AdditionalNavigator;
