import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {sizes, useTheme} from '../../context/ThemeContext';
import {FilterEvents, IEvent} from '../../typings/IEvent';
import STYLES, {WIDTH_EVENT_PANEL} from '../../utils/STYLES';
import ShadowWrapper from '../common/ShadowWrapper';
import IconButton from '../controls/IconButton';
import MyText from '../controls/MyText';
import EventBlock from './EventBlock';
import EventInfoDate from './EventInfoDate';
import MineEventPanel from './MineEventPanel';
import {actionsEvent, SelectorsEvent} from '../../redux/event/eventReducer';
import chatService from '../../services/chatService/chatService';
import SwipeableEvent from './SwipeableEvent';
import useSharing from '../../useHooks/useSharing';
import getIdObj from '../../utils/getIdObj';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import TouchableOpacityDelay from '../controls/TouchableOpacityDelay';

interface IMineEventProps {
  conStyle?: StyleProp<ViewStyle>;
  event: IEvent;
  onPress: (e: IEvent) => any;
  isOpen: boolean;
}
const MineEvent = React.memo(({conStyle, event, isOpen, onPress}: IMineEventProps) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {shareEvent} = useSharing();
  const {text, blue, background} = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const chats = useSelector(SelectorsEvent.getChats);
  const handleEditEvent = () => {
    navigation.navigate('AdditionalNavigator', {
      screen: 'AddEvent',
      params: {
        event,
      },
    });
  };

  const handleShareEvent = () => {
    shareEvent(event);
  };

  const handleOpenEvent = async () => {
    onPress(event);
  };

  const handleNavigateToChat = async () => {
    setIsLoading(true);
    let chat = event.chats[0];
    if (typeof chat === 'string') {
      const findChat = chats.find((c) => c._id === chat);
      if (findChat) {
        chat = findChat;
      } else {
        const res = await chatService.getChatById(chat);
        if (res.success) {
          dispatch(actionsEvent.addChat(res.data));
          chat = res.data;
        }
      }
    }

    navigation.navigate('AdditionalNavigator', {
      screen: 'Chat',
      params: {
        chat: chat,
      },
    });
    setIsLoading(false);
  };

  return (
    <View style={[styles.con, {position: event.isDeleted ? 'absolute' : undefined}, conStyle]}>
      <EventInfoDate
        style={{
          paddingTop: sizes[20],
        }}
        date={event.date}
        time={event.time}
      />
      {isOpen ? (
        <ShadowWrapper style={[STYLES.eventBlock, STYLES.eventShadow, styles.eventBlock]}>
          <View
            style={[
              styles.view,
              {
                backgroundColor: background,
              },
            ]}>
            <TouchableOpacityDelay
              activeOpacity={1}
              onPress={handleOpenEvent}
              style={[
                styles.viewUser,
                {
                  backgroundColor: blue,
                },
              ]}>
              <MyText numberOfLines={2} style={styles.name}>
                {event.name}
              </MyText>
              {isOpen && (
                <View style={styles.viewItemUser}>
                  <IconButton
                    disabled={isLoading}
                    onPress={handleNavigateToChat}
                    icon={{
                      name: 'ChatMenuIcon',
                      stroke: text,
                      fill: blue,
                      width: sizes[21],
                      height: sizes[19],
                    }}
                  />
                  <IconButton
                    onPress={handleEditEvent}
                    icon={{
                      name: 'EditIcon',
                      fill: text,
                      size: sizes[16],
                    }}
                  />
                  <IconButton
                    onPress={handleShareEvent}
                    icon={{
                      name: 'ShareIcon',
                      fill: text,
                      width: sizes[14],
                      height: sizes[16],
                    }}
                  />
                </View>
              )}
            </TouchableOpacityDelay>
            <EventBlock event={event} />
          </View>
        </ShadowWrapper>
      ) : (
        <SwipeableEvent id={event._id} type={FilterEvents.mine}>
          <MineEventPanel event={event} onPress={handleOpenEvent} />
        </SwipeableEvent>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  view: {
    width: WIDTH_EVENT_PANEL,
    flexGrow: 1,
    borderRadius: sizes[4],
  },
  con: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eventBlock: {
    padding: 0,
  },
  avatar: {
    width: sizes[24],
    height: sizes[24],
    borderRadius: sizes[6],
    marginRight: sizes[8],
  },
  name: {
    fontSize: sizes[10],
    maxWidth: '40%',
  },
  viewUser: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: sizes[16],
    paddingVertical: sizes[12],
    borderTopLeftRadius: sizes[4],
    borderTopRightRadius: sizes[4],
  },
  viewItemUser: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '50%',
  },
  noStatus: {
    textDecorationLine: 'line-through',
    opacity: 0.4,
  },
});

export default MineEvent;
