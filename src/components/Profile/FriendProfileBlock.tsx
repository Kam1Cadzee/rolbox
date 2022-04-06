import {StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import React, {useState} from 'react';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import ProfileBlock from './ProfileBlock.dumb';
import {actionsUser, selectorsUser} from '../../redux/user/userReducer';
import {sizes, useTheme} from '../../context/ThemeContext';
import useFormatBio from '../../useHooks/useFormatBio';
import MyText from '../controls/MyText';
import Icon from '../common/Icons';
import CustomModalDropdown from '../controls/Dropdown/CustomModalDropdown';
import {IUser, UserExtension} from '../../typings/IUser';
import friendService from '../../services/friendService/friendService';
import RelationStatus, {RelationAction, useRelationStatusData} from '../../typings/IRelationStatus';
import IOption from '../../typings/IOption';
import MyButton, {TypeButton} from '../controls/MyButton';
import {useNavigation} from '@react-navigation/native';
import chatService from '../../services/chatService/chatService';
import t from '../../utils/t';
import {actionsEvent, SelectorsEvent} from '../../redux/event/eventReducer';
import {useDelay} from '../../useHooks/useDebounce';
import TouchableOpacityDelay from '../controls/TouchableOpacityDelay';

interface IFriendProfileBlockProps {
  friend: IUser;
}

const FriendProfileBlock = ({friend}: IFriendProfileBlockProps) => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const {border, background, primary, primaryLight} = useTheme();
  const bio = useFormatBio(friend);
  const statusFriend = useSelector(selectorsUser.getStatusFriend(friend._id));
  const statusData = useRelationStatusData(statusFriend);
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector(selectorsUser.getUser);
  const chat = useSelector(SelectorsEvent.getOneToOneChat(friend._id));
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  const giftsCount = friend.ownedWishlists ? friend.ownedWishlists.reduce((a, b) => a + b.gifts.length, 0) : 0;
  const wishlistCount = friend.ownedWishlists ? friend.ownedWishlists.length : 0;

  const handlePress = async (onPress: any) => {
    if (statusFriend === RelationStatus.requested) {
      const res = await friendService.reject(friend._id);
      if (res.success) {
        dispatch(actionsUser.cancelRequest(friend._id));
      }
    } else if (statusFriend === RelationStatus.noFriends) {
      setIsLoading(true);
      const res = await friendService.request(friend._id);

      if (res.success) {
        dispatch(
          actionsUser.addFriendsRequests({
            ...res.data,
            responder: friend,
          }),
        );
      }
      setIsLoading(false);
    } else {
      onPress();
    }
  };

  const handleSelect = async (option: IOption<string, RelationAction>) => {
    switch (option.value) {
      case RelationAction.accept: {
        const res = await friendService.accept(friend._id);
        if (res.success) {
          dispatch(actionsUser.moveToFriend(friend._id));
        }
        return;
      }
      case RelationAction.decline: {
        const res = await friendService.reject(friend._id);
        if (res.success) {
          dispatch(actionsUser.declineFriend(friend._id));
        }
        return;
      }
      case RelationAction.unfriend: {
        const res = await friendService.reject(friend._id);
        if (res.success) {
          dispatch(actionsUser.removeFriend(friend._id));
        }
      }
    }
  };

  const handlePressFriends = () => {
    navigation.navigate('ListFriends', {
      friend,
    });
  };

  const handlePressChat = async () => {
    let c = chat;
    if (!chat) {
      setIsLoadingChat(true);
      const res = await chatService.createChat([friend, user]);
      if (res.success) {
        dispatch(actionsEvent.addChat(res.data));
        c = res.data;
      }
      setIsLoadingChat(false);
    }

    navigation['navigate']('AdditionalNavigator', {
      screen: 'Chat',
      params: {
        chat: c,
      },
    });
  };

  return (
    <ProfileBlock
      onFriendsPress={handlePressFriends}
      conStyle={styles.con}
      fullName={UserExtension.fullName(friend)}
      wishList={wishlistCount}
      gifts={giftsCount}
      friends={friend.friends?.length ?? 0}
      leftExtraBtn={(props) => {
        return (
          <MyButton {...props} isLoading={isLoadingChat} type={TypeButton.ghost} onPress={handlePressChat}>
            {t('btnMessage')}
          </MyButton>
        );
      }}
      extraBtn={(props: any) => (
        <CustomModalDropdown
          renderButtonComponent={({onPress, ...props}: any) => (
            <TouchableOpacityDelay
              disabled={isLoading}
              style={[
                styles.btn,
                {
                  backgroundColor: [RelationStatus.requested, RelationStatus.friends].some((r) => r === statusFriend)
                    ? primaryLight
                    : primary,
                },
              ]}
              ref={props.forwardRef}
              onPress={() => handlePress(onPress)}
              {...props}>
              <MyText
                style={{
                  color: background,
                  marginRight: sizes[10],
                }}>
                {statusData.title}
              </MyText>
              {statusData.options.length > 0 && <Icon name="ArrowDownIcon" fill={background} size={sizes[10]} />}
            </TouchableOpacityDelay>
          )}
          label=""
          style={{
            flexGrow: 1,
            maxWidth: '47%',
          }}
          animated={false}
          dropdownStyle={styles.dropdownStyle}
          styleRowComponent={styles.styleRowComponent}
          renderSeparator={() => {
            return <View style={{height: 1, backgroundColor: border}} />;
          }}
          options={statusData.options}
          onSelect={handleSelect}
          {...props}
        />
      )}
      avatar={UserExtension.image(friend)}
      bio={bio}
    />
  );
};

const styles = StyleSheet.create({
  con: {
    paddingTop: sizes[10],
    paddingBottom: sizes[17],
  },
  btn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
    borderRadius: sizes[4],
  },
  dropdownStyle: {
    width: responsiveScreenWidth(42),
    height: 'auto',
    marginLeft: 0,
    borderWidth: 0,

    shadowColor: 'rgb(118, 105, 103)',
    shadowOffset: {
      width: 0,
      height: sizes[4],
    },
    shadowOpacity: 0.2,
    shadowRadius: sizes[20],
    elevation: 10,
    marginTop: sizes[10],
  },
  styleRowComponent: {
    padding: sizes[16],
  },
});
export default FriendProfileBlock;
