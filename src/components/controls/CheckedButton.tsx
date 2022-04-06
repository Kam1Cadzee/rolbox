import React from 'react';
import {StyleSheet} from 'react-native';
import {sizes, useTheme} from '../../context/ThemeContext';
import {getFontFamily} from '../../utils/getFontFamily';
import IconButton from './IconButton';

interface ICheckedButtonProps {
  onPress: any;
  selected: boolean;
  size?: number;
}

const CheckedButton = ({onPress, selected, size = sizes[24]}: ICheckedButtonProps) => {
  const innerSize = size * 0.5;
  const {background, lightText, border} = useTheme();

  const bgColor = selected ? lightText : background;
  const borderColor = selected ? lightText : border;

  return (
    <IconButton
      onPress={onPress}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 2,
        backgroundColor: bgColor,
        borderColor: borderColor,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      icon={{
        name: 'CheckIcon',
        fill: background,
        size: innerSize,
      }}
    />
  );
};

const styles = StyleSheet.create({
  con: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  outer: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: getFontFamily(500),
    marginLeft: sizes[10],
  },
});

export default CheckedButton;
