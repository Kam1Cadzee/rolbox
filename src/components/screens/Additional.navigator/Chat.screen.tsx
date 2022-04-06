import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View, StyleSheet, KeyboardAvoidingView, ActivityIndicator} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {sizes, useTheme} from '../../../context/ThemeContext';
import {selectorsUser} from '../../../redux/user/userReducer';
import {UserExtension} from '../../../typings/IUser';
import {getFontFamily} from '../../../utils/getFontFamily';
import MyText from '../../controls/MyText';
import {ChatScreenProps} from '../../navigators/Additional.navigator';
import {isIOS} from '../../../utils/isPlatform';
import {responsiveScreenHeight, responsiveScreenWidth} from 'react-native-responsive-dimensions';
import MessageInput from '../../Messenger/MessageInput';
import MessageButtonDown from '../../Messenger/MessageButtonDown';
import ManagerMessage, {
  ITextMessage,
  IMessageItem,
  TypeMessage,
  IMessageDate,
  StatusMessage,
  PositionMessage,
} from '../../../typings/IMessage';
import TextMessage from '../../Messenger/TextMessage';
import DateMessage from '../../Messenger/DateMessage';
import {FilterMessenger, IChat, IMessage} from '../../../typings/IChat';
import chatService from '../../../services/chatService/chatService';
import {actionsEvent, SelectorsEvent} from '../../../redux/event/eventReducer';
import NewMessage from '../../Messenger/NewMessage';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import ImageMessage from '../../Messenger/ImageMessage';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
import AvatarMessage from '../../Messenger/AvatarMessage';
import {useNavigation} from '@react-navigation/native';
import {currentChatRef, lastMessageRef} from '../../../utils/navigationRef';
import getIdObj from '../../../utils/getIdObj';
import useDidUpdateEffect from '../../../useHooks/useDidUpdateEffect';
import {usePluralizationMembers} from '../../../useHooks/usePluralization';
import TouchableOpacityDelay from '../../controls/TouchableOpacityDelay';
import Animated, {Easing, timing, useValue} from 'react-native-reanimated';

const WIDTH_CHAT = responsiveScreenWidth(100) - sizes[20];

interface IHeaderRightProps {
  chat: IChat;
}

const HeaderRight = React.memo(({chat}: IHeaderRightProps) => {
  const {lightText} = useTheme();
  const tMember = usePluralizationMembers();
  const navigation = useNavigation<any>();
  const userId = useSelector(selectorsUser.getUserId);
  const isGroup = chat.type !== FilterMessenger.local;

  const owner = useSelector((state: any) => SelectorsEvent.getMemberOfChat(state, chat._id, getIdObj(chat.owner)));
  const members = chat.members.filter((m) => m._id !== userId);
  const user = members.length === 1 ? members[0] : undefined;

  const member = isGroup ? owner : user;
  const name = isGroup ? chat.event.name : UserExtension.fullName(user);

  const handleNavigateToInfoChat = () => {
    if (isGroup) {
      navigation.navigate('AdditionalNavigator', {
        screen: 'InfoChat',
        params: {
          chat,
        },
      });
    } else {
      navigation.navigate('FriendProfile', {
        friend: user,
      });
    }
  };

  return (
    <View style={styles.conHeader}>
      <View
        style={{
          marginRight: sizes[10],
        }}>
        <MyText numberOfLines={1} style={styles.nameHeader}>
          {name}
        </MyText>
        {isGroup && (
          <MyText
            style={[
              styles.subTitleHeader,
              {
                color: lightText,
              },
            ]}>
            {chat.members.length} {tMember(chat.members.length)}
          </MyText>
        )}
      </View>
      <TouchableOpacityDelay onPress={handleNavigateToInfoChat}>
        <AvatarMessage isGroup={isGroup} user={member} />
      </TouchableOpacityDelay>
    </View>
  );
});

const limit = 50;

let dataProvider = new DataProvider((r1, r2) => {
  return r1 !== r2;
});

const isFirstMessage = (messages: IMessage[], idMessage: string) => {
  if (messages.length === 0) {
    return false;
  }

  return messages[0]._id === idMessage;
};

const ChatScreen = ({navigation, route}: ChatScreenProps) => {
  const dispatch = useDispatch();
  const user = useSelector(selectorsUser.getUser);
  const managerMessage = useRef(new ManagerMessage(user._id));
  const {secondary} = useTheme();
  const {chat: paramChat, localMessage} = route.params;
  const [chat, setChat] = useState(paramChat);
  const [refreshing, setRefreshing] = useState(false);
  const [replyMessageItem, setReplyMessageItem] = useState<IMessageItem>();
  const [messages, setMessages] = useState<IMessageItem[]>([]);
  const [newMessages, newSetMessages] = useState<IMessageItem[]>([]);
  const opacityAnim = useValue(0);
  const [isTop, setIsTop] = useState(false);
  const [page, setPage] = useState(1);
  const refIsTop = useRef(false);
  const refLoadMore = useRef(true);
  const refScroll = useRef<any>();
  const refMessages = useRef(messages);
  const refOffsetCountNewLine = useRef(0);
  const cloneWithRows = useMemo(() => {
    return dataProvider.cloneWithRows(messages);
  }, [messages]);

  const refLayout = useRef(
    new LayoutProvider(
      (index) => {
        return refMessages.current[index]?.type ?? 'undefinedType';
      },
      (type, dim, index) => {
        dim.height = 0;
        dim.width = 0;
      },
    ),
  );

  const onRefresh = () => {
    loadMessages();
  };

  useDidUpdateEffect(() => {
    if (localMessage) {
      handleScrollBottom();
    }
  }, [localMessage]);

  useDidUpdateEffect(() => {
    managerMessage.current.clear();
    opacityAnim.setValue(0);
    setMessages([]);
    newSetMessages([]);
    setRefreshing(false);
    setIsTop(false);
    setPage(1);
    refIsTop.current = false;
    refLoadMore.current = true;
    refMessages.current = [];
    refOffsetCountNewLine.current = 0;
    setChat(paramChat);
  }, [paramChat]);

  useEffect(() => {
    currentChatRef.current = chat._id;
    navigation.setOptions({
      headerRight: () => <HeaderRight chat={chat} />,
    });

    ManagerMessage.onReceiveMessage = handleReceiveMessage;

    loadMessages();

    return () => {
      ManagerMessage.onReceiveMessage = null;

      if (lastMessageRef.current) {
        clearUnreadMessages(lastMessageRef.current);
      }
      currentChatRef.current = null;
      lastMessageRef.current = null;
    };
  }, [chat]);

  const clearUnreadMessages = (id: string) => {
    chatService.commitLastMessage({id: chat._id, lastRead: id}).then((res) => {
      dispatch(actionsEvent.clearUnreadMessages(chat._id));
    });
  };

  const loadMessages = async () => {
    if (refreshing) {
      return;
    }

    if (!refLoadMore.current) {
      return;
    }
    setRefreshing(true);

    try {
      const res: any = await chatService.getMessages({
        id: chat._id,
        limit: page === 1 ? limit / 2 : limit,
        page,
      });

      if (res.success) {
        if (res.data.docs.length === 0) {
          opacityAnim.setValue(1);
          refLoadMore.current = false;
          return;
        }

        const messages = await managerMessage.current.parseAllMessages(res.data.docs);

        setPage((p) => {
          if (p === 1) {
            managerMessage.current.setInitDate(res.data.docs[0]);

            const unreadMessages = chat.unreadMessages ?? 0;
            if (unreadMessages !== 0) {
              lastMessageRef.current = res.data.docs[0]._id;
              dispatch(actionsEvent.clearUnreadMessages(chat._id));
            }
            timing(opacityAnim, {
              toValue: 1,
              duration: 700,
              easing: Easing.ease,
            }).start();
          }
          const page = p + 1;
          if (page > res.data.totalPages) {
            refLoadMore.current = false;
            messages[messages.length - 1].data.position = PositionMessage.start;
          }
          return page;
        });

        setMessages((items) => {
          if (items.length > 0) {
            const item = {...items[items.length - 1]};
            item.data = {...item.data, updateAt: Math.random()};
            items[items.length - 1] = item;
          }
          refMessages.current = [...items, ...messages];

          return refMessages.current;
        });
      }
    } finally {
      setRefreshing(false);
    }
  };

  const handleReceiveMessage = async (m: IMessage) => {
    if (getIdObj(m.from) === user._id) {
      return;
    }

    if (m.chat !== chat._id) {
      return;
    }

    if (refIsTop.current) {
      const parseMessage = await managerMessage.current.parse(m, true, true);
      newSetMessages((items) => {
        /*
        const newLine = managerMessage.current.createNewLine();
        if (newLine) {
          refOffsetCountNewLine.current = 1;
          return [parseMessage, newLine, ...items];
        }
        */
        refOffsetCountNewLine.current = 0;
        return [parseMessage, ...items];
      });
    } else {
      lastMessageRef.current = m._id;
      const parseMessage = await managerMessage.current.parse(m, true, false);
      setMessages((items) => {
        refMessages.current = [parseMessage, ...items];
        return refMessages.current;
      });
    }
  };

  const handleSelectReplyMessage = (messageItem: IMessageItem) => {
    setReplyMessageItem(messageItem);
  };

  const handleSendMessage = async (message: string, images: ImageOrVideo[]) => {
    try {
      handleScrollBottom();
      const timestump = Date.now();

      const itemMessage: IMessage = {
        _id: timestump.toString(),
        chat: chat._id,
        createdAt: '',
        from: user,
        images: images.map((img) => ({
          filename: img.filename,
          originalname: img.localIdentifier,
          url: img.path,
        })),
        message,
        timestump: timestump,
        updatedAt: timestump,
        viewed: false,
      };

      const parseMessage = await managerMessage.current.parse(itemMessage, true, false, StatusMessage.sending);
      setMessages((items) => {
        refMessages.current = [parseMessage, ...items];
        return refMessages.current;
      });

      const res = await chatService.sendMessage({
        id: chat._id,
        message,
        images,
      });

      if (res.success) {
        const m = res.data;
        const newParseMessage = await managerMessage.current.parse(
          m,
          true,
          false,
          undefined,
          parseMessage.data.position,
        );

        setMessages((items) => {
          const res = items.map((item) => {
            if (item?.data?.id === parseMessage.data.id) {
              return {
                type: item.type,
                data: newParseMessage.data,
              };
            }
            return item;
          });
          refMessages.current = res;
          return res;
        });

        /*  await Axios.post('http://192.168.31.65:3000/send', {
          chatId: chat._id,
          chatName: chat.name,
          payload: m,
        }); */

        dispatch(actionsEvent.updateChat(m));
      } else {
        setMessages((items) => {
          const res = items.map((item) => {
            if (item.data.id === parseMessage.data.id) {
              return {
                type: item.type,
                data: {
                  ...item.data,
                  status: StatusMessage.error,
                  updateAt: Date.now(),
                },
              };
            }
            return item;
          });
          refMessages.current = res;
          return res;
        });
      }
    } catch (e) {
      return false;
    }
  };

  const renderItem = useCallback((type: any, data: any, index: number) => {
    if (data.type === TypeMessage.text) {
      return <TextMessage onSelectReplyMessage={handleSelectReplyMessage} messageItem={data} />;
    }
    if (data.type === TypeMessage.image) {
      return <ImageMessage onSelectReplyMessage={handleSelectReplyMessage} messageItem={data} />;
    } else if (data.type === TypeMessage.unread) {
      return (
        <View style={{width: WIDTH_CHAT}}>
          <NewMessage />
        </View>
      );
    } else {
      const item = data.data as IMessageDate;
      return (
        <View style={{width: WIDTH_CHAT}}>
          <DateMessage message={item} />
        </View>
      );
    }
  }, []);

  const renderFooter = useCallback(() => {
    return !refreshing ? (
      <View style={{height: sizes[20]}} />
    ) : (
      <ActivityIndicator style={{marginVertical: sizes[20]}} color={secondary} />
    );
  }, [refreshing]);

  const handleScrollBottom = () => {
    if (refScroll.current) {
      refScroll.current.scrollToOffset(0, 0, true);
    }
  };

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={responsiveScreenHeight(14.5)}
      behavior={isIOS ? 'padding' : undefined}
      contentContainerStyle={{}}
      style={{flexGrow: 1}}>
      <Animated.View style={{flexGrow: 1, opacity: opacityAnim}}>
        {isTop && (
          <MessageButtonDown
            count={Math.max(newMessages.length - refOffsetCountNewLine.current, 0)}
            onPress={handleScrollBottom}
          />
        )}
        {messages.length > 0 && (
          <RecyclerListView
            layoutProvider={refLayout.current}
            rowRenderer={renderItem}
            forceNonDeterministicRendering={true}
            canChangeSize={true}
            dataProvider={cloneWithRows}
            renderFooter={renderFooter}
            onEndReached={onRefresh}
            scrollThrottle={16}
            optimizeForInsertDeleteAnimations={true}
            onScroll={(e) => {
              const isTop = e.nativeEvent.contentOffset.y > 120;
              if (refIsTop.current === isTop) {
                return;
              }
              refIsTop.current = isTop;
              setIsTop(isTop);
              if (isTop) {
                currentChatRef.current = null;
              } else {
                currentChatRef.current = chat._id;
                newSetMessages((newItems) => {
                  if (newItems.length > 0) {
                    setMessages((items) => {
                      refMessages.current = [...newItems, ...items];
                      lastMessageRef.current = newItems[0].data.id;
                      return refMessages.current;
                    });
                    return [];
                  }
                  return newItems;
                });
              }
            }}
            onEndReachedThreshold={sizes[200]}
            ref={refScroll}
            style={{
              flex: 1,
              paddingHorizontal: sizes[10],
              paddingTop: sizes[10],
              transform: [
                {
                  scaleY: -1,
                },
              ],
            }}
          />
        )}
      </Animated.View>
      <MessageInput
        onSendMessage={handleSendMessage}
        removeReplyMessageItem={() => setReplyMessageItem(undefined)}
        replyMessageItem={replyMessageItem}
      />
    </KeyboardAvoidingView>
  );
};

const keyExtractor = (info, index) => {
  if (info.type === TypeMessage.date) {
    return index.toString();
  } else if (info.type === TypeMessage.unread) {
    return index.toString();
  } else {
    const data = info.data as ITextMessage;

    return data.id + data.position;
  }
};

const styles = StyleSheet.create({
  conHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameHeader: {
    fontFamily: getFontFamily(500),
    fontSize: sizes[16],
    textAlign: 'right',
    width: responsiveScreenWidth(50),
  },
  subTitleHeader: {
    fontSize: sizes[12],
    textAlign: 'right',
    textTransform: 'lowercase',
  },
  imageHeader: {
    width: sizes[56],
    height: sizes[56],
    borderRadius: sizes[20],
  },
});

export {WIDTH_CHAT};
export default ChatScreen;
