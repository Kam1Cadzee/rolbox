import React, {useState} from 'react';
import {Image, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MyText from '../controls/MyText';
import LinkText, {TypeLinkText} from '../controls/LinkText';
import {sizes} from '../../context/ThemeContext';
import authService from '../../services/authService/authService';
import t from '../../utils/t';
import Icon from './Icons';
import {useDispatch, useSelector} from 'react-redux';
import {actionsUser, selectorsUser} from '../../redux/user/userReducer';
import RelationStatus from '../../typings/IRelationStatus';
import friendService from '../../services/friendService/friendService';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import useSharing from '../../useHooks/useSharing';
import {IUser} from '../../typings/IUser';
import ImageUser from '../Profile/ImageUser';
import TouchableOpacityDelay from '../controls/TouchableOpacityDelay';
import {navigationRef} from '../../utils/navigationRef';

interface IUserItemProps {
  style?: StyleProp<ViewStyle>;
  image?: string;
  name: string;
  userId: string;
  user?: IUser;
}

const UserItem = ({userId, name, image, user, style}: IUserItemProps) => {
  const dispatch = useDispatch();
  const statusFriend = useSelector(selectorsUser.getStatusFriend(userId));
  const [isLoading, setIsLoading] = useState(false);
  const myId = useSelector(selectorsUser.getUserId);

  const isDisabled = myId === userId;

  const onAddFriend = async () => {
    if (isDisabled) {
      return;
    }
    setIsLoading(true);
    try {
      if (statusFriend === RelationStatus.requested) {
        const res = await friendService.reject(userId);
        if (res.success) {
          dispatch(actionsUser.cancelRequest(userId));
        }
      } else if (statusFriend === RelationStatus.noFriends) {
        const res = await friendService.request(userId);

        if (res.success) {
          dispatch(
            actionsUser.addFriendsRequests({
              ...res.data,
              responder: user,
            }),
          );
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserItemDump
      name={name}
      rightComponent={
        statusFriend !== RelationStatus.friends ? (
          <LinkText
            style={{
              width: sizes[80],
              textAlign: 'center',
            }}
            numberOfLines={2}
            type={TypeLinkText.accent}
            onPress={onAddFriend}>
            {statusFriend === RelationStatus.noFriends ? `+ ${t('addFriend')}` : t('requested')}
          </LinkText>
        ) : undefined
      }
      image={image}
      style={style}
      disabled={isLoading}
      userId={userId}
    />
  );
};

interface IUserItemSendInviteProps {
  name: string;
  image?: string;
  style: StyleProp<ViewStyle>;
}
const UserItemSendInvite = ({name, style, image}: IUserItemSendInviteProps) => {
  const {shareFriend} = useSharing();

  const handleSendInvite = () => {
    shareFriend();
  };

  return (
    <UserItemDump
      name={name}
      rightComponent={
        <LinkText
          style={{
            width: sizes[80],
            textAlign: 'center',
          }}
          numberOfLines={2}
          type={TypeLinkText.accent}
          onPress={handleSendInvite}>
          {t('sendInvite')}
        </LinkText>
      }
      image={image}
      style={style}
      disabled={true}
    />
  );
};

interface IUserItemDumpProps {
  onPress?: (u: IUser) => any;
  rightComponent: any;
  image?: string;
  name: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  userId?: string;
  sizeImage?: number;
}
const UserItemDump = ({
  name,
  image,
  style,
  disabled,
  onPress,
  userId,
  rightComponent,
  sizeImage = sizes[56],
}: IUserItemDumpProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const myId = useSelector(selectorsUser.getUserId);

  const isDisabled = myId === userId;

  const navigateFriendProfile = async () => {
    if (!userId) {
      return;
    }
    if (isDisabled) {
      return;
    }
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    const res = await authService.getUserById(userId);

    if (res.success) {
      if (onPress) {
        onPress(res.data[0]);
      } else {
        navigationRef.current.navigate('FriendProfile', {
          friend: res.data[0]!,
        });
      }
    }
    setIsLoading(false);
  };

  return (
    <View style={[styles.con, style]}>
      <TouchableOpacityDelay
        disabled={isDisabled || disabled || isLoading}
        onPress={navigateFriendProfile}
        style={[
          styles.con,
          {
            justifyContent: 'flex-start',
          },
        ]}>
        <ImageUser size={sizeImage} image={image} />
        <MyText numberOfLines={2} style={styles.name}>
          {name}
        </MyText>
      </TouchableOpacityDelay>
      {rightComponent}
    </View>
  );
};

const styles = StyleSheet.create({
  con: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  view: {
    flexGrow: 1,
  },

  name: {
    fontSize: sizes[16],
    marginLeft: sizes[15],
    width: responsiveScreenWidth(48),
  },
});

export {UserItemDump, UserItemSendInvite};
export default UserItem;
