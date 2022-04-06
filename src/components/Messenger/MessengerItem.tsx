import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import {useSelector} from 'react-redux';
import {useFormattingContext} from '../../context/FormattingContext';
import {sizes, useTheme} from '../../context/ThemeContext';
import {selectorsUser} from '../../redux/user/userReducer';
import {FilterMessenger, IChat, IMessage} from '../../typings/IChat';
import {IUser, UserExtension} from '../../typings/IUser';
import {getFontFamily} from '../../utils/getFontFamily';
import getIdObj from '../../utils/getIdObj';
import Icon from '../common/Icons';
import MyText from '../controls/MyText';
import TouchableOpacityGestureDelay from '../controls/TouchableOpacityGestureDelay';
import AvatarMessage from './AvatarMessage';

interface IMessengerItemProps {
  conStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  chat: IChat;
}

const sizeCircle = sizes[23];
const innerSize = sizeCircle * 0.45;

const MessengerItem = React.memo(({conStyle, style, chat}: IMessengerItemProps) => {
  const navigation = useNavigation();
  const userId = useSelector(selectorsUser.getUserId);

  const navigateToChat = () => {
    navigation.navigate('AdditionalNavigator', {
      screen: 'Chat',
      params: {
        chat,
      },
    });
  };

  const members = chat.members.filter((m) => m._id !== userId);
  const user = members.length === 1 ? members[0] : undefined;

  return (
    <MessengerItemDumb
      chat={chat}
      name={chat.name}
      user={user}
      onPress={navigateToChat}
      style={[styles.con, style]}
      conStyle={[conStyle]}
    />
  );
});

const MessengerGroupItem = React.memo(({conStyle, style, chat}: IMessengerItemProps) => {
  const navigation = useNavigation();

  const navigateToChat = () => {
    navigation.navigate('AdditionalNavigator', {
      screen: 'Chat',
      params: {
        chat,
      },
    });
  };

  return (
    <MessengerItemDumb
      chat={chat}
      name={chat.event.name}
      user={chat.lastMessage?.from}
      onPress={navigateToChat}
      style={[styles.con, style]}
      conStyle={[conStyle]}
    />
  );
});

interface IMessengerItemDumbProps extends IMessengerItemProps {
  onPress: any;
  user?: IUser;
  name: string;
}
const MessengerItemDumb = React.memo(({conStyle, name, style, chat, user, onPress}: IMessengerItemDumbProps) => {
  const {formatTimeForChat} = useFormattingContext();
  const userId = useSelector(selectorsUser.getUserId);
  const {text, lightText, reverseText} = useTheme();

  const isGroup = chat.type !== FilterMessenger.local;
  const isSecret = chat.type === FilterMessenger.secret;
  const countMessage = chat.unreadMessages ?? 0;
  const isNewMessage = countMessage !== 0;

  const itsMe = userId === getIdObj(user);

  return (
    <TouchableOpacityGestureDelay onPress={onPress} style={[styles.con, style]} containerStyle={[conStyle]}>
      <AvatarMessage sizeImage={sizes[46]} isGroup={isGroup} user={user} />
      <View
        style={{
          flexGrow: 1,
          marginLeft: sizes[14],
        }}>
        <View style={styles.view}>
          <MyText style={styles.name} numberOfLines={2}>
            {isSecret && <Icon name="LockIcon" size={sizes[11]} fill={text} />}
            {name}
          </MyText>
          {chat.lastMessage && (
            <MyText
              style={[
                styles.time,
                {
                  color: lightText,
                },
              ]}>
              {formatTimeForChat(new Date(chat.lastMessage.updatedAt))}
            </MyText>
          )}
        </View>

        <View style={styles.view}>
          {chat.lastMessage && (
            <LastMessage
              isGroup={isGroup}
              member={user}
              isNewMessage={isNewMessage}
              itsMe={itsMe}
              lastMessage={chat.lastMessage}
            />
          )}

          {isNewMessage && (
            <View style={[styles.circle, {backgroundColor: text}]}>
              <MyText style={[styles.textCircle, {color: reverseText}]}>{`+${countMessage}`}</MyText>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacityGestureDelay>
  );
});

interface ILastMessageProps {
  lastMessage: IMessage | null;
  isNewMessage: boolean;
  itsMe: boolean;
  isGroup: boolean;
  member: IUser;
}

const LastMessage = ({lastMessage, isNewMessage, itsMe, member, isGroup}: ILastMessageProps) => {
  const {lightText} = useTheme();
  const isMessageText = !!lastMessage.message;
  const isMessageImage = lastMessage.images && lastMessage.images.length > 0 ? true : false;

  return (
    <MyText style={[styles.message, isNewMessage ? styles.unreadableMessage : {color: lightText}]} numberOfLines={1}>
      {!itsMe && isGroup && (
        <MyText
          style={{
            fontFamily: getFontFamily(500),
          }}>
          {UserExtension.firstName(member) + ': '}
        </MyText>
      )}

      {isMessageImage && (
        <Image
          style={{
            width: sizes[14],
            height: sizes[14],
          }}
          source={{
            uri: lastMessage.images[0].url,
          }}
        />
      )}
      {isMessageText && lastMessage.message}
    </MyText>
  );
};

const sizeImage = sizes[40];

const styles = StyleSheet.create({
  con: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: sizes[14],
  },
  image: {
    borderRadius: sizeImage / 2,
    width: sizeImage,
    height: sizeImage,
    marginRight: sizes[23],
  },
  imageUser: {
    borderRadius: sizes[6],
    width: sizes[24],
    height: sizes[24],
    position: 'absolute',
    bottom: 0,
    right: -sizes[12],
  },
  view: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: responsiveScreenWidth(100) - sizes[40] - sizes[46] - sizes[14],
  },
  name: {
    fontSize: sizes[14],
    textAlign: 'left',
    width: '80%',
  },
  time: {
    fontSize: sizes[12],
  },
  unreadableMessage: {
    fontFamily: getFontFamily(700),
  },
  message: {
    width: responsiveScreenWidth(60),
    fontSize: sizes[13],
  },
  circle: {
    width: sizeCircle,
    height: sizeCircle,
    borderRadius: sizeCircle / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCircle: {
    fontSize: innerSize,
    fontFamily: getFontFamily(500),
  },
});

export {MessengerGroupItem};
export default MessengerItem;
