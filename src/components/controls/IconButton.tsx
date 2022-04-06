import React from 'react';
import {StyleSheet, TouchableOpacityProps} from 'react-native';
import Icon, {IDesignIconProps} from '../common/Icons';
import {colorWithOpacity, sizes} from '../../context/ThemeContext';
import TouchableOpacityDelay from './TouchableOpacityDelay';

interface IIconButtonProps extends TouchableOpacityProps {
  icon: IDesignIconProps;
}
const IconButton = React.memo(({icon, style = {}, disabled, onPress, ...props}: IIconButtonProps) => {
  const handlePress = (e: any) => {
    if (disabled) {
      return;
    }
    onPress && onPress(e);
  };

  return (
    <TouchableOpacityDelay
      hitSlop={{
        right: sizes[15],
        top: sizes[15],
        left: sizes[15],
        bottom: sizes[15],
      }}
      style={[styles.con, style]}
      onPress={handlePress}
      {...props}>
      <Icon {...icon} fill={colorWithOpacity(icon.fill!, disabled ? 0.5 : 1)} />
    </TouchableOpacityDelay>
  );
});

const styles = StyleSheet.create({
  con: {
    justifyContent: 'center',
  },
});

export default IconButton;
