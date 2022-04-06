import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {getFontFamily} from '../../utils/getFontFamily';
import MyText from '../controls/MyText';

interface IBadgeProps {
  number: number | string;
  sizeCircle: number;
  type?: 'primary' | 'secondary' | 'blank';
  style?: StyleProp<ViewStyle>;
}

const Badge = ({number, sizeCircle, type = 'blank', style}: IBadgeProps) => {
  const innerSize = sizeCircle * 0.44;
  const {primary, secondary, reverseText} = useTheme();
  let bg = reverseText;
  let color = secondary;
  if (type === 'primary') {
    bg = primary;
    color = reverseText;
  } else if (type === 'secondary') {
    bg = secondary;
    color = reverseText;
  }

  if (!number || number === 0) {
    return null;
  }
  return (
    <View
      style={[
        styles.circle,
        {backgroundColor: bg, width: sizeCircle, height: sizeCircle, borderRadius: sizeCircle / 2},
        style,
      ]}>
      <MyText style={[styles.textCircle, {color: color, fontSize: innerSize}]}>{`+${number}`}</MyText>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCircle: {
    fontFamily: getFontFamily(700),
  },
});
export default Badge;
