import React, {useCallback, useRef, useState} from 'react';
import {Image, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {sizes, useTheme} from '../../context/ThemeContext';
import {UserExtension} from '../../typings/IUser';
import StatusAnswerEvent, {useGetColorsEvent} from '../../typings/StatusAnswerEvent';
import STYLES, {WIDTH_EVENT_PANEL} from '../../utils/STYLES';
import ShadowWrapper from '../common/ShadowWrapper';
import IconButton from '../controls/IconButton';
import MyText from '../controls/MyText';
import EventAnswerBlock from './EventAnswerBlock';
import EventBlock from './EventBlock';
import EventInfoDate from './EventInfoDate';
import EventPanel from './EventPanel';
import {FilterEvents, IEvent} from '../../typings/IEvent';
import eventService from '../../services/eventService/eventService';
import debounce from '../../utils/debounce';
import useDidUpdateEffect from '../../useHooks/useDidUpdateEffect';
import {actionsEvent, SelectorsEvent} from '../../redux/event/eventReducer';
import {FilterMessenger, IChat} from '../../typings/IChat';
import chatService from '../../services/chatService/chatService';
import {useNavigation} from '@react-navigation/native';
import SwipeableEvent from './SwipeableEvent';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import {selectorsUser} from '../../redux/user/userReducer';
import ImageUser from '../Profile/ImageUser';
import getIdObj from '../../utils/getIdObj';
import TouchableOpacityDelay from '../controls/TouchableOpacityDelay';
import {unsubscribeChat} from '../../Notifications/subscribes';

interface IInvitedEventProps {
  conStyle?: StyleProp<ViewStyle>;
  defaultStatus?: StatusAnswerEvent;
  event: IEvent;
  onPress: (e: IEvent) => any;
  isOpen: boolean;
}

const compareStatus = (s1: StatusAnswerEvent, s2: StatusAnswerEvent) => {
  if (!s1) {
    return true;
  }
  if ((s1 === StatusAnswerEvent.yes || s1 === StatusAnswerEvent.maybe) && s2 === StatusAnswerEvent.no) {
    return true;
  } else if ((s2 === StatusAnswerEvent.yes || s2 === StatusAnswerEvent.maybe) && s1 === StatusAnswerEvent.no) {
    return true;
  }

  return false;
};

//chats.filter((c) => ids.some((id) => id === c._id))
const InvitedEvent = ({conStyle, defaultStatus, event, isOpen, onPress}: IInvitedEventProps) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {background, text} = useTheme();
  const userId = useSelector(selectorsUser.getUserId);
  const isShow = defaultStatus === undefined ? true : isOpen;
  const [statusEvent, setStatusEvent] = useState<StatusAnswerEvent>(defaultStatus);
  const chats = useSelector(SelectorsEvent.getChats);
  const {bg} = useGetColorsEvent(statusEvent);
  const user = event.owner;
  const [isLoading, setIsLoading] = useState(false);
  const refStatus = useRef<StatusAnswerEvent | null>(null);
  const refPrevStatus = useRef<StatusAnswerEvent | null>(statusEvent);
  const [disabledPressChat, setDisabledPressChat] = useState(false);

  const handlePressStatusEvent = (status: StatusAnswerEvent) => {
    dispatch(
      actionsEvent.changeStatus({
        event: event._id,
        answer: status,
        guest: userId,
      }),
    );
    setStatusEvent(status);

    if (!isLoading) {
      handleChangeStatus(status);
      refStatus.current = null;
    } else {
      refStatus.current = status;
    }
  };

  const handleOpenEvent = async () => {
    onPress(event);
  };

  const handleChangeStatus: any = useCallback(
    debounce(async (status: StatusAnswerEvent) => {
      setIsLoading(true);
      const res = await eventService.changeStatus({answer: status, id: event._id});

      if (res.success && compareStatus(refPrevStatus.current, status)) {
        if (status === StatusAnswerEvent.no) {
          const ids = res.data.chats.map((c) => getIdObj(c));
          dispatch(actionsEvent.removeChats(ids));
          for (const id of ids) {
            await unsubscribeChat(id);
          }
        } else {
          dispatch(actionsEvent.addEvent(res.data));
        }
      }
      refPrevStatus.current = status;
      setIsLoading(false);
    }, 500),
    [],
  );

  useDidUpdateEffect(() => {
    if (!isLoading && refStatus.current) {
      handleChangeStatus(refStatus.current);
      refStatus.current = null;
    }
  }, [isLoading]);

  const handleNavigateToChat = async (isSecret: boolean) => {
    setDisabledPressChat(true);
    let findChat: IChat | null = null;

    for (let item of event.chats) {
      let chat: IChat = item as any;
      if (typeof item === 'string') {
        chat = chats.find((c) => c._id === item);
      }
      if (chat) {
        if (isSecret && chat.type === FilterMessenger.secret) {
          findChat = chat;
          break;
        }
        if (!isSecret && chat.type !== FilterMessenger.secret) {
          findChat = chat;
          break;
        }
      }
    }

    if (findChat) {
      navigation.navigate('AdditionalNavigator', {
        screen: 'Chat',
        params: {
          chat: findChat,
        },
      });
    }

    setDisabledPressChat(false);
  };

  const styleInfo = statusEvent === StatusAnswerEvent.no ? styles.noStatus : undefined;

  return (
    <View style={[styles.con, conStyle]}>
      <EventInfoDate
        styleDate={styleInfo}
        styleTime={styleInfo}
        style={{
          paddingTop: sizes[20],
        }}
        date={event.date}
        time={event.time}
      />
      {isShow ? (
        <ShadowWrapper style={[STYLES.eventBlock, STYLES.eventShadow, styles.eventBlock]}>
          <View
            style={{
              backgroundColor: background,
              width: WIDTH_EVENT_PANEL,
              flexGrow: 1,
              borderRadius: sizes[4],
            }}>
            <TouchableOpacityDelay
              activeOpacity={1}
              onPress={() => {
                if (defaultStatus) {
                  onPress(event);
                }
              }}
              style={[
                styles.viewUser,
                {
                  backgroundColor: bg,
                },
              ]}>
              <View style={styles.viewItemUser}>
                <ImageUser style={styles.avatar} size={sizes[24]} image={UserExtension.image(user)} />
                <MyText numberOfLines={2} style={styles.name}>
                  {UserExtension.fullName(user)}
                </MyText>
              </View>
              {statusEvent && statusEvent !== StatusAnswerEvent.no && refPrevStatus.current !== StatusAnswerEvent.no && (
                <View style={styles.viewItemUser}>
                  <IconButton
                    disabled={disabledPressChat}
                    onPress={() => handleNavigateToChat(false)}
                    icon={{
                      name: 'ChatMenuIcon',
                      fill: bg,
                      size: sizes[20],
                      stroke: text,
                    }}
                  />
                  {event.chats.length > 1 && (
                    <IconButton
                      disabled={disabledPressChat}
                      onPress={() => handleNavigateToChat(true)}
                      style={{
                        marginLeft: sizes[15],
                      }}
                      icon={{
                        name: 'PrivateChatIcon',
                        fill: text,
                        width: sizes[26],
                        height: sizes[19],
                      }}
                    />
                  )}
                </View>
              )}
            </TouchableOpacityDelay>
            <EventBlock event={event} />
            <EventAnswerBlock statusEvent={statusEvent} onPress={handlePressStatusEvent} />
          </View>
        </ShadowWrapper>
      ) : (
        <SwipeableEvent id={event._id} type={FilterEvents.invited}>
          <EventPanel event={event} onPress={handleOpenEvent} statusEvent={statusEvent!} user={user} />
        </SwipeableEvent>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  con: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eventBlock: {
    padding: 0,
  },
  avatar: {
    marginRight: sizes[8],
  },
  name: {
    fontSize: sizes[10],
    width: responsiveScreenWidth(34),
  },
  viewUser: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: sizes[16],
    paddingVertical: sizes[12],
    borderTopLeftRadius: sizes[4],
    borderTopRightRadius: sizes[4],
  },
  viewItemUser: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noStatus: {
    textDecorationLine: 'line-through',
    opacity: 0.4,
  },
});

export default InvitedEvent;
