import React from 'react';
import {Image, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import {sizes} from '../../context/ThemeContext';
import {IEvent} from '../../typings/IEvent';
import {IUser, UserExtension} from '../../typings/IUser';
import StatusAnswerEvent, {useGetColorsEvent} from '../../typings/StatusAnswerEvent';
import {getFontFamily} from '../../utils/getFontFamily';
import {WIDTH_EVENT_PANEL} from '../../utils/STYLES';
import MyText from '../controls/MyText';
import TouchableOpacityGestureDelay from '../controls/TouchableOpacityGestureDelay';
import ImageUser from '../Profile/ImageUser';

interface IEventPanelProps {
  user: IUser;
  statusEvent: StatusAnswerEvent;
  conStyle?: StyleProp<ViewStyle>;
  onPress: any;

  event: IEvent;
}

const EventPanel = ({statusEvent, user, conStyle, onPress, event}: IEventPanelProps) => {
  const {bg, color} = useGetColorsEvent(statusEvent);

  const isNo = statusEvent === StatusAnswerEvent.no;

  const opacity = isNo ? 0.3 : 1;

  return (
    <TouchableOpacityGestureDelay
      activeOpacity={0.8}
      onPress={onPress}
      containerStyle={[
        styles.con,
        {
          backgroundColor: bg,
        },
        conStyle,
      ]}>
      <View style={styles.topView}>
        <MyText
          style={[
            styles.title,
            {
              textDecorationLine: isNo ? 'line-through' : undefined,
              opacity,
            },
          ]}
          numberOfLines={2}>
          {event.name}
        </MyText>
        <ImageUser
          style={{
            opacity,
          }}
          size={sizes[24]}
          image={UserExtension.image(user)}
        />
      </View>
      <MyText style={[styles.subTitle, {color, textDecorationLine: isNo ? 'line-through' : undefined, opacity}]}>
        {event.location}
      </MyText>
    </TouchableOpacityGestureDelay>
  );
};

const styles = StyleSheet.create({
  con: {
    padding: sizes[16],
    borderRadius: sizes[4],
    width: WIDTH_EVENT_PANEL,
  },
  topView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: getFontFamily(500),
    fontSize: sizes[16],
    marginBottom: sizes[6],
    width: responsiveScreenWidth(52),
  },
  subTitle: {
    fontSize: sizes[12],
  },
});
export default EventPanel;
