import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {sizes, useTheme} from '../../context/ThemeContext';
import {IEvent} from '../../typings/IEvent';
import {getFontFamily} from '../../utils/getFontFamily';
import {WIDTH_EVENT_PANEL} from '../../utils/STYLES';
import MyText from '../controls/MyText';
import TouchableOpacityGestureDelay from '../controls/TouchableOpacityGestureDelay';

interface IMineEventPanelProps {
  conStyle?: StyleProp<ViewStyle>;
  onPress: any;
  event: IEvent;
}

const MineEventPanel = ({conStyle, onPress, event}: IMineEventPanelProps) => {
  const {blueDark, blue} = useTheme();
  const bg = blue;
  const color = blueDark;

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
      <MyText style={[styles.title]} numberOfLines={1}>
        {event.name}
      </MyText>
      <MyText numberOfLines={2} style={[styles.subTitle, {color}]}>
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
  },
  subTitle: {
    fontSize: sizes[12],
  },
  avatar: {
    width: sizes[24],
    height: sizes[24],
    borderRadius: sizes[6],
  },
});
export default MineEventPanel;
