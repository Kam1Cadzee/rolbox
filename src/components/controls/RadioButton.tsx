import React, {useEffect, useRef, useState} from 'react';
import Animated, {Extrapolate, interpolate, interpolateColors, Easing} from 'react-native-reanimated';
import {StyleSheet} from 'react-native';
import {sizes, useTheme} from '../../context/ThemeContext';
import {getFontFamily} from '../../utils/getFontFamily';
import MyText from './MyText';
import TouchableOpacityDelay from './TouchableOpacityDelay';

interface IRadioButtonProps {
  label: string;
  onPress: any;
  selected: boolean;
  size?: number;
}

const RadioButton = ({label, onPress, selected, size = sizes[25]}: IRadioButtonProps) => {
  const innerSize = size * 0.4;
  const value = useRef(new Animated.Value(size));
  const {secondary, border} = useTheme();

  useEffect(() => {
    Animated.timing(value.current, {
      toValue: selected ? innerSize : size,
      duration: 300,
      easing: selected ? Easing.linear : Easing.linear,
    }).start();
  }, [selected]);

  const opacity = interpolate(value.current, {
    inputRange: [innerSize, innerSize * 2, size],
    outputRange: [1, 1, 0],
    extrapolate: Extrapolate.CLAMP,
  });

  const color = selected ? secondary : border;

  return (
    <TouchableOpacityDelay style={styles.con} activeOpacity={0.6} onPress={onPress}>
      <Animated.View
        style={[
          styles.outer,
          {
            width: size,
            borderRadius: size / 2,
            height: size,
            borderColor: color,
          },
        ]}>
        <Animated.View
          style={{
            width: value.current,
            height: value.current,
            backgroundColor: color,
            borderRadius: size / 2,
            opacity,
          }}
        />
      </Animated.View>
      <MyText style={styles.text}>{label}</MyText>
    </TouchableOpacityDelay>
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
export default RadioButton;
