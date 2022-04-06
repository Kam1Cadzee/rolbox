import React from 'react';
import {Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import Animated, {concat, Extrapolate, interpolate, interpolateColors} from 'react-native-reanimated';
import Icon from '../common/Icons';
import {sizes, useTheme} from '../../context/ThemeContext';
import getHitSlop from '../../utils/getHitSlop';

interface ITabBarAdvancedButtonProps {
  bgColor?: string;
  onPress: any;
  value: any;
}

const width = sizes[80];
const height = width * 0.702;
const sizeBtn = width * 0.6;

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const TabBarAdvancedButton = ({bgColor, value, ...props}: ITabBarAdvancedButtonProps) => {
  const {secondary, lightText} = useTheme();

  const color = interpolateColors(value, {
    inputRange: [0, 1],
    outputColorRange: [secondary, lightText],
  });

  const rotate = interpolate(value, {
    inputRange: [0, 1],
    outputRange: [0, 45],
    extrapolate: Extrapolate.CLAMP,
  });

  return (
    <View style={[styles.container]} pointerEvents="box-none">
      <Icon name="UIcon" size={width} height={height} fill={bgColor} />
      <AnimatedTouchable
        hitSlop={getHitSlop(10)}
        activeOpacity={1}
        style={[
          styles.button,
          {
            backgroundColor: color,
            transform: [
              {
                rotate: concat(rotate, 'deg'),
              },
            ],
          },
        ]}
        onPress={props.onPress}>
        <Icon name="PlusIcon" size={sizes[14]} fill="white" />
      </AnimatedTouchable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: width - sizes[1],
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    top: 0,
  },
  button: {
    top: -sizeBtn / 2.4,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: sizeBtn,
    height: sizeBtn,
    borderRadius: sizeBtn / 2,
  },
  shadow: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 7,
  },
});

export default TabBarAdvancedButton;
