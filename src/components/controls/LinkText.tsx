import React from 'react';
import {StyleProp, StyleSheet, TextStyle, TouchableOpacityProps} from 'react-native';
import MyText from './MyText';
import {sizes, useTheme} from '../../context/ThemeContext';
import getHitSlop from '../../utils/getHitSlop';
import TouchableOpacityGestureDelay from './TouchableOpacityGestureDelay';

interface ILinkTextProps {
  children?: any;
  type: TypeLinkText;
  isLine?: boolean;
  onPress?: any;
  style?: StyleProp<TouchableOpacityProps | TextStyle>;
  numberOfLines?: number;
}
enum TypeLinkText {
  text,
  accent,
}

const LinkText = ({children, type, isLine = true, onPress, style, numberOfLines}: ILinkTextProps) => {
  const {accent, lightText} = useTheme();
  let color = '';
  if (type === TypeLinkText.accent) {
    color = accent;
  } else if (type === TypeLinkText.text) {
    color = lightText;
  }

  if (onPress) {
    return (
      <TouchableOpacityGestureDelay hitSlop={getHitSlop(20)} onPress={onPress}>
        <MyText
          numberOfLines={numberOfLines}
          style={[styles.text, {color, textDecorationLine: isLine ? 'underline' : 'none'}, style]}>
          {children}
        </MyText>
      </TouchableOpacityGestureDelay>
    );
  }
  return (
    <MyText
      numberOfLines={numberOfLines}
      style={[styles.text, {color, textDecorationLine: isLine ? 'underline' : 'none'}, style]}>
      {children}
    </MyText>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: sizes[12],
  },
});

export {TypeLinkText};
export default LinkText;
