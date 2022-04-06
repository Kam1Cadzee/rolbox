import {useNavigation} from '@react-navigation/core';
import React, {useEffect, useMemo, useState} from 'react';
import {ActivityIndicator, Alert, SafeAreaView, StyleSheet, View} from 'react-native';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {useFormattingContext} from '../../../context/FormattingContext';
import {sizes, useTheme} from '../../../context/ThemeContext';
import {actionsEvent, SelectorsEvent} from '../../../redux/event/eventReducer';
import eventService from '../../../services/eventService/eventService';
import {FilterMessenger} from '../../../typings/IChat';
import {IEvent} from '../../../typings/IEvent';
import IOption from '../../../typings/IOption';
import {IUser, UserExtension} from '../../../typings/IUser';
import {ExtensionTime} from '../../../typings/TypeTime';
import useAxios from '../../../useHooks/useAxios';
import useDidUpdateEffect from '../../../useHooks/useDidUpdateEffect';
import {getFontFamily} from '../../../utils/getFontFamily';
import getIdObj from '../../../utils/getIdObj';
import t from '../../../utils/t';
import {UserItemDump} from '../../common/UserItem';
import VerticalTabs from '../../common/VerticalTabs';
import MyText from '../../controls/MyText';
import AvatarMessage from '../../Messenger/AvatarMessage';
import {InfoChatScreenProps} from '../../navigators/Additional.navigator';
import MiniBlockWishlist from '../../WishlistItem/MiniBlockWishlist';
import Toast from 'react-native-toast-message';
import Clipboard from '@react-native-community/clipboard';
import MyButton, {TypeButton} from '../../controls/MyButton';
import {selectorsUser} from '../../../redux/user/userReducer';
import TouchableOpacityGestureDelay from '../../controls/TouchableOpacityGestureDelay';

enum InfoChatOption {
  member = 1,
  infoEvent = 2,
}
const InfoChatScreen = ({route}: InfoChatScreenProps) => {
  const dispatch = useDispatch();
  const {chat} = route.params;
  const navigation = useNavigation();
  const {backgroundLight, secondary, lightText} = useTheme();
  const {formatDateStr} = useFormattingContext();
  const options: IOption<string, InfoChatOption>[] = useMemo(() => {
    if (chat.type === FilterMessenger.local) {
      return [
        {
          label: t('infoChatOption1'),
          value: InfoChatOption.member,
        },
      ];
    }
    return [
      {
        label: t('infoChatOption1'),
        value: InfoChatOption.member,
      },
      {
        label: t('infoChatOption2'),
        value: InfoChatOption.infoEvent,
      },
    ] as IOption<string, InfoChatOption>[];
  }, []);
  const [selected, setSelected] = useState(options[0]);
  const {members, event, owner} = chat;
  const ownerId = getIdObj(owner);
  const userId = useSelector(selectorsUser.getUserId);
  const selectorEvent = useSelector(SelectorsEvent.getEventById(getIdObj(event)));
  const {request, isLoading} = useAxios(eventService.getEventById);
  const member = members.find((m) => m._id === ownerId)!;

  useDidUpdateEffect(() => {
    if (selected.value === options[1].value && !selectorEvent && !isLoading) {
      request<IEvent>(getIdObj(event)).then((res) => {
        if (res.success) {
          res.data.date = new Date(res.data.date);
          dispatch(actionsEvent.addEvent(res.data));
        }
      });
    }
  }, [selected]);

  const sortMembers = [...members].sort((a, b) => {
    let a1 = 0;
    let a2 = 0;
    if (a._id === ownerId) {
      a1 = -1;
    } else if (b._id === ownerId) {
      a2 = -1;
    }

    return a1 - a2;
  });

  const navigateToFriend = (u: IUser) => {
    navigation.navigate('FriendProfile', {
      friend: u,
    });
  };

  const navigateToEditEvent = () => {
    navigation.navigate('AdditionalNavigator', {
      screen: 'AddEvent',
      params: {
        event: selectorEvent,
      },
    });
  };

  const handleCopyLocation = () => {
    Toast.show({
      text1: 'Location copied', //TODO:
      type: 'info',
      position: 'bottom',
      autoHide: true,
      visibilityTime: 1000,
    });
    Clipboard.setString(selectorEvent.location);
  };

  const getTime = () => {
    const dateStr = formatDateStr(new Date(selectorEvent.date), 'dd MM');
    const timeStr = ExtensionTime.formatTime(selectorEvent.time?.value);
    if (!!timeStr) {
      return `${dateStr}, ${timeStr}`;
    }
    return dateStr;
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <View style={[styles.topView, {backgroundColor: backgroundLight}]}>
        <AvatarMessage isGroup={chat.type !== FilterMessenger.local} user={member} />
        <MyText style={styles.titleEvent}>{chat.event.name}</MyText>
        <VerticalTabs<string> options={options} select={selected} setOption={setSelected} />
      </View>
      {selected.value === options[0].value && (
        <FlatList
          data={sortMembers}
          style={{
            paddingHorizontal: sizes[20],
            flex: 1,
          }}
          contentContainerStyle={{
            paddingTop: sizes[20],
          }}
          keyExtractor={(item) => {
            return item._id;
          }}
          renderItem={(info) => {
            const user: IUser = info.item;
            return (
              <UserItemDump
                style={styles.userItem}
                key={user._id}
                name={UserExtension.fullName(user)}
                image={UserExtension.image(user)}
                userId={user._id}
                onPress={navigateToFriend}
                rightComponent={
                  ownerId === user._id ? (
                    <MyText
                      style={{
                        fontSize: sizes[12],
                        color: lightText,
                      }}>
                      {t('owner')}
                    </MyText>
                  ) : null
                }
              />
            );
          }}
        />
      )}
      {selected.value === options[1]?.value && (
        <View style={styles.secondView}>
          {!!selectorEvent ? (
            <React.Fragment>
              <MyText style={[styles.textTitleEvent, {color: lightText}]}>{t('when')}</MyText>
              <MyText>{getTime()}</MyText>

              {!!selectorEvent.location && (
                <TouchableOpacityGestureDelay onLongPress={handleCopyLocation}>
                  <MyText style={[styles.textTitleEvent, {color: lightText}]}>{t('where')}</MyText>
                  <MyText>{selectorEvent.location}</MyText>
                </TouchableOpacityGestureDelay>
              )}
              <MyText style={[styles.textTitleEvent, {color: lightText}]}>{t('wishlistForEvent')}</MyText>
              <MiniBlockWishlist idEvent={selectorEvent._id} wishlist={selectorEvent.wishlist} />
              {userId === ownerId && (
                <MyButton
                  containerStyle={{
                    width: '100%',
                    marginTop: sizes[20],
                  }}
                  onPress={navigateToEditEvent}
                  type={TypeButton.ghost}>
                  {t('editEvent')}
                </MyButton>
              )}
            </React.Fragment>
          ) : (
            <ActivityIndicator style={{alignSelf: 'center'}} color={secondary} />
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  topView: {
    paddingTop: sizes[20],
    alignItems: 'center',
  },
  titleEvent: {
    fontSize: sizes[16],
    fontFamily: getFontFamily(500),
    marginTop: sizes[10],
    marginBottom: sizes[20],
    marginHorizontal: sizes[20],
    textAlign: 'center',
  },
  userItem: {
    marginBottom: sizes[15],
  },
  secondView: {
    padding: sizes[40],
    alignItems: 'flex-start',
    paddingTop: sizes[15],
  },
  textTitleEvent: {
    fontSize: sizes[12],
    marginBottom: sizes[8],
    marginTop: sizes[25],
  },
  offsetEvent: {
    marginBottom: sizes[25],
  },
});
export default InfoChatScreen;
