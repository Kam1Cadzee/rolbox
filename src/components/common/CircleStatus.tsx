import React, {useCallback} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {sizes, useTheme} from '../../context/ThemeContext';
import StatusAnswerEvent from '../../typings/StatusAnswerEvent';
import Icon from './Icons';

interface ICircleStatusProps {
  statusEvent: StatusAnswerEvent;
  style?: StyleProp<ViewStyle>;
  sizeCircle?: number;
}
const CircleStatus = ({statusEvent, style, sizeCircle = sizes[20]}: ICircleStatusProps) => {
  const {green, red1, yellow, reverseText} = useTheme();

  if (statusEvent === StatusAnswerEvent.invited) {
    return null;
  }
  const sizeIcon = sizeCircle / 2.5;

  const getInfo = useCallback(() => {
    if (statusEvent === StatusAnswerEvent.yes) {
      return {
        bg: green,
        name: 'CheckIcon',
      };
    } else if (statusEvent === StatusAnswerEvent.maybe) {
      return {
        bg: yellow,
        name: 'QuestionIcon',
      };
    } else if (statusEvent === StatusAnswerEvent.no || statusEvent === StatusAnswerEvent.deleted) {
      return {
        bg: red1,
        name: 'CrossIcon',
      };
    }
    return {};
  }, [statusEvent]);

  const {bg, name} = getInfo();

  if (!name) {
    return null;
  }
  return (
    <View
      style={[
        styles.circle,
        {backgroundColor: bg, width: sizeCircle, height: sizeCircle, borderRadius: sizeCircle / 2},
        style,
      ]}>
      <Icon name={name} size={sizeIcon} fill={reverseText} />
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default CircleStatus;
