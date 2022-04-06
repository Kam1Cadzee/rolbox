import React, {useMemo, useRef} from 'react';
import {StyleProp, Animated, StyleSheet, View, ViewStyle} from 'react-native';
import {useFormattingContext} from '../../context/FormattingContext';
import {sizes, useTheme} from '../../context/ThemeContext';
import {IBaseMessage, IMessageItem, ITextMessage, PositionMessage, StatusMessage} from '../../typings/IMessage';
import {ExtensionTime} from '../../typings/TypeTime';
import Icon from '../common/Icons';
import MyText from '../controls/MyText';
import ReplyMessage from './ReplyMessage';
import {UserExtension} from '../../typings/IUser';
import {getFontFamily} from '../../utils/getFontFamily';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import ImageUser from '../Profile/ImageUser';
import ContextMenu, {ContextMenuAction} from 'react-native-context-menu-view';
import Clipboard from '@react-native-community/clipboard';
import Toast from 'react-native-toast-message';
interface IBaseMessageProps {
  messageItem: IMessageItem;
  children?: any;
  conStyle?: StyleProp<ViewStyle>;
  nameStyle?: StyleProp<ViewStyle>;
  onSelectReplyMessage: (messageItem: IMessageItem) => void;
  isShowName?: boolean;
  extraActions?: ContextMenuAction[];
}

const getStyles = (message: IBaseMessage) => {
  if (message.isMine) {
    if (message.position === PositionMessage.start) {
      return [styles.conMine, styles.conMineStart, STYLES_RADIUS_MESSAGE.conMine, STYLES_RADIUS_MESSAGE.conMineStart];
    } else if (message.position === PositionMessage.middle) {
      return [styles.conMine, styles.conMineMiddle];
    } else if (message.position === PositionMessage.end) {
      return [styles.conMine, styles.conMineEnd, STYLES_RADIUS_MESSAGE.conMine, STYLES_RADIUS_MESSAGE.conMineEnd];
    }
  } else {
    if (message.position === PositionMessage.start) {
      return [styles.con, styles.conStart, STYLES_RADIUS_MESSAGE.con, STYLES_RADIUS_MESSAGE.conStart];
    } else if (message.position === PositionMessage.middle) {
      return [styles.con, styles.conMiddle];
    } else if (message.position === PositionMessage.end) {
      return [styles.con, styles.conEnd, STYLES_RADIUS_MESSAGE.conEnd, STYLES_RADIUS_MESSAGE.con];
    }
  }
};

function areEqualMessageItemProps(prevProps: IBaseMessageProps, nextProps: IBaseMessageProps) {
  if (prevProps === nextProps) {
    return true;
  }
  const item1 = prevProps.messageItem.data as ITextMessage;
  const item2 = nextProps.messageItem.data as ITextMessage;
  if (item1.id) {
    const res = item1.updateAt === item2.updateAt;
    return res;
  }

  return true;
}

const tes = (n: any) => {
  if (n === 0) {
    return 'start';
  }
  if (n === 1) {
    return 'middle';
  }
  if (n === 2) {
    return 'end';
  }
};
const BaseMessage = React.memo(
  ({
    messageItem,
    children,
    conStyle,
    isShowName = true,
    nameStyle,
    extraActions = [],
    onSelectReplyMessage,
  }: IBaseMessageProps) => {
    const message = messageItem.data as IBaseMessage;
    const {currentLocale} = useFormattingContext();
    const {lightText, errorColor} = useTheme();
    const member = messageItem.data.user;
    const refSwipe = useRef();
    const style = getStyles(message);
    const actions = useMemo(() => {
      const res = extraActions as any;
      if (!!messageItem.data.text) {
        res.push({
          title: 'Copy', //TODO:
          systemIcon: 'doc.on.doc',
          onPress: () => {
            Clipboard.setString(messageItem.data.text);
            Toast.show({
              text1: 'Message copied to clipboard', //TODO:
              type: 'info',
              position: 'bottom',
              autoHide: true,
              visibilityTime: 1000,
            });
          },
        });
      }
      return res;
    }, [messageItem]);
    //style.push(conStyle);

    const renderRightActions = (progress, dragX: Animated.AnimatedInterpolation) => {
      const trans = dragX.interpolate({
        inputRange: [-sizes[40], 0],
        outputRange: [0, 20],
      });

      return (
        <Animated.View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: sizes[40],
            transform: [
              {
                translateX: trans,
              },
            ],
          }}>
          <Icon name="TrashIcon" size={sizes[15]} fill={lightText} />
        </Animated.View>
      );
    };

    const handlePressContextMenu = (e: any) => {
      actions[e.nativeEvent.index].onPress();
    };

    return (
      /* <Swipeable
      friction={4}
      overshootFriction={10}
      containerStyle={{
        marginTop: message.position === PositionMessage.start ? sizes[16] : undefined,
      }}
      onSwipeableRightWillOpen={() => {
        refSwipe.current.close();
        onSelectReplyMessage(messageItem);
      }}
      overshootRight={false}
      rightThreshold={sizes[40]}
      useNativeAnimations={true}
      ref={refSwipe}
      renderRightActions={renderRightActions}
    > */
      <View
        style={[
          styles.view,
          {
            justifyContent: messageItem.data.isMine ? 'flex-end' : 'flex-start',
            paddingLeft:
              !message.isMine && messageItem.data.position !== PositionMessage.start
                ? MEASURES_CHATS.commonSizeAvatar
                : 0,
            marginBottom:
              messageItem.data.position === PositionMessage.start
                ? MEASURES_CHATS.offsetEndMessage
                : MEASURES_CHATS.offsetBetweenMessage,
          },
        ]}>
        {!message.isMine && messageItem.data.position === PositionMessage.start && (
          <ImageUser style={styles.avatarUser} size={MEASURES_CHATS.sizeAvatar} image={UserExtension.image(member)} />
        )}
        <View
          style={[
            message.isMine ? styles.conMineWidth : styles.conWidth,
            {
              transform: [
                {
                  scaleY: -1,
                },
              ],
              overflow: 'hidden',
            },
          ]}>
          <ContextMenu previewBackgroundColor={'transparent'} actions={actions} onPress={handlePressContextMenu}>
            <View removeClippedSubviews={true} style={[style, conStyle]}>
              {message.replyMessage && <ReplyMessage message={message.replyMessage} />}
              {!message.isMine && isShowName && (
                <MyText numberOfLines={1} style={[styles.nameUser, nameStyle]}>
                  {UserExtension.fullName(member)}
                </MyText>
              )}

              {children}

              <View style={message.isMine ? styles.mineTimeView : [styles.mineTimeView, styles.timeView]}>
                <MyText style={[styles.timeText, {color: lightText}]}>
                  {ExtensionTime.formatTimeByDate(message.date, currentLocale)}
                </MyText>
                {message.status && (
                  <Icon
                    name={message.status === StatusMessage.sending ? 'ClockIcon' : 'ErrorIcon'}
                    width={sizes[10]}
                    height={sizes[10]}
                    fill={message.status === StatusMessage.sending ? lightText : errorColor}
                  />
                )}
              </View>
            </View>
          </ContextMenu>
        </View>
      </View>
      /* <ModalLogout
        modalVisible={isOpenContext}
        onClose={() => {
          setIsOpenContext(false);
          refAnimLongPress.current.setValue(0);
        }}
      /> */
      /*   </Swipeable> */
    );
  },
  areEqualMessageItemProps,
);

class MEASURES_CHATS {
  static BORDER_RADIUS_MESSAGE = sizes[11];
  static minWidth = responsiveScreenWidth(25);
  static sizeAvatar = sizes[30];
  static marginRightAvatar = sizes[5];
  static commonSizeAvatar = MEASURES_CHATS.sizeAvatar + MEASURES_CHATS.marginRightAvatar;

  static offsetBetweenMessage = sizes[2];
  static offsetEndMessage = sizes[6];

  static WIDTH_CHAT = responsiveScreenWidth(100) - sizes[20];

  static paddingV = sizes[14];
  static paddingH = sizes[10];
}

const PALETTE_CHATS = {
  MINE_BG_COLOR: '#DDEFF0',
  BG_COLOR: '#F9FCFD',
  NAME_COLOR: '#057373',
};

const styles = StyleSheet.create({
  view: {
    width: MEASURES_CHATS.WIDTH_CHAT,
    flexDirection: 'row',
  },
  nameUser: {
    color: PALETTE_CHATS.NAME_COLOR,
    fontFamily: getFontFamily(500),
    fontSize: sizes[12],
    marginBottom: sizes[4],
  },
  avatarUser: {
    width: MEASURES_CHATS.sizeAvatar,
    height: MEASURES_CHATS.sizeAvatar,
    borderRadius: sizes[8],
    marginRight: MEASURES_CHATS.marginRightAvatar,

    transform: [
      {
        scaleY: -1,
      },
    ],
  },
  conMineWidth: {
    minWidth: MEASURES_CHATS.minWidth,
    maxWidth: MEASURES_CHATS.WIDTH_CHAT - MEASURES_CHATS.commonSizeAvatar,
  },
  conWidth: {
    minWidth: MEASURES_CHATS.minWidth,
    maxWidth: MEASURES_CHATS.WIDTH_CHAT - MEASURES_CHATS.commonSizeAvatar,
  },
  conMine: {
    paddingTop: MEASURES_CHATS.paddingH,
    paddingBottom: MEASURES_CHATS.paddingV,
    paddingHorizontal: MEASURES_CHATS.paddingH,
    backgroundColor: PALETTE_CHATS.MINE_BG_COLOR,
    borderTopLeftRadius: MEASURES_CHATS.BORDER_RADIUS_MESSAGE,
    borderBottomLeftRadius: MEASURES_CHATS.BORDER_RADIUS_MESSAGE,
  },
  conMineStart: {
    borderTopRightRadius: MEASURES_CHATS.BORDER_RADIUS_MESSAGE,
  },
  conMineMiddle: {},
  conMineEnd: {
    borderBottomRightRadius: MEASURES_CHATS.BORDER_RADIUS_MESSAGE,
  },
  con: {
    paddingTop: MEASURES_CHATS.paddingH,
    paddingBottom: MEASURES_CHATS.paddingV,
    paddingHorizontal: MEASURES_CHATS.paddingH,
    backgroundColor: PALETTE_CHATS.BG_COLOR,
    borderTopRightRadius: MEASURES_CHATS.BORDER_RADIUS_MESSAGE,
    borderBottomRightRadius: MEASURES_CHATS.BORDER_RADIUS_MESSAGE,
  },
  conStart: {
    borderTopLeftRadius: MEASURES_CHATS.BORDER_RADIUS_MESSAGE,
  },
  conMiddle: {},
  conEnd: {
    borderBottomLeftRadius: MEASURES_CHATS.BORDER_RADIUS_MESSAGE,
  },
  mineTimeView: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    justifyContent: 'space-evenly',
    right: sizes[8],
    bottom: sizes[1],
    zIndex: 10,
    backgroundColor: PALETTE_CHATS.MINE_BG_COLOR,
    borderRadius: sizes[5],
    paddingHorizontal: sizes[2],
  },
  timeView: {
    backgroundColor: PALETTE_CHATS.BG_COLOR,
    borderRadius: sizes[5],
  },
  timeText: {
    fontSize: sizes[10],
    padding: sizes[1],
    paddingHorizontal: sizes[2],
  },
});

const STYLES_RADIUS_MESSAGE = StyleSheet.create({
  conMine: {
    borderTopLeftRadius: MEASURES_CHATS.BORDER_RADIUS_MESSAGE,
    borderBottomLeftRadius: MEASURES_CHATS.BORDER_RADIUS_MESSAGE,
  },
  conMineStart: {
    borderTopRightRadius: MEASURES_CHATS.BORDER_RADIUS_MESSAGE,
  },
  conMineEnd: {
    borderBottomRightRadius: MEASURES_CHATS.BORDER_RADIUS_MESSAGE,
  },
  con: {
    borderTopRightRadius: MEASURES_CHATS.BORDER_RADIUS_MESSAGE,
    borderBottomRightRadius: MEASURES_CHATS.BORDER_RADIUS_MESSAGE,
  },
  conStart: {
    borderTopLeftRadius: MEASURES_CHATS.BORDER_RADIUS_MESSAGE,
  },
  conEnd: {
    borderBottomLeftRadius: MEASURES_CHATS.BORDER_RADIUS_MESSAGE,
  },
});

export {areEqualMessageItemProps, STYLES_RADIUS_MESSAGE, PALETTE_CHATS as PALETTE, MEASURES_CHATS};
export default BaseMessage;
