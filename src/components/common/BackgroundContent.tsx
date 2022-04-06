import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {colorWithOpacity, sizes, useTheme} from '../../context/ThemeContext';

interface IBackgroundContentProps {
  style?: StyleProp<ViewStyle>;
  children?: any;
}

const BackgroundContent = ({children, style}: IBackgroundContentProps) => {
  const {border} = useTheme();
  return <View style={[styles.con, {backgroundColor: colorWithOpacity(border, 0.1)}, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  con: {
    borderRadius: sizes[4],
    padding: sizes[20],
  },
});
export default BackgroundContent;
