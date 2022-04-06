import React, {useEffect, useRef} from 'react';
import {View} from 'react-native';
import Animated, {Easing} from 'react-native-reanimated';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {sizes, useTheme} from '../../context/ThemeContext';
import Icon from './Icons';

interface IWrapperCircularProps {
  isSelected: boolean;
  children?: any;
}

const WrapperCircular = ({isSelected, children}: IWrapperCircularProps) => {
  const animValue = useRef(new Animated.Value(0));

  const {secondary} = useTheme();

  useEffect(() => {
    Animated.timing(animValue.current, {
      duration: 200,
      easing: Easing.linear,
      toValue: isSelected ? 1 : 0,
    }).start();
  }, [isSelected]);

  return (
    <>
      <AnimatedCircularProgress
        rotation={65}
        duration={400}
        size={Math.round(sizes[56])}
        width={sizes[2]}
        fill={isSelected ? 100 : 0}
        tintColor={secondary}
        backgroundColor="white">
        {() => children}
      </AnimatedCircularProgress>
      <Animated.View
        style={{
          position: 'absolute',
          backgroundColor: 'white',
          borderRadius: sizes[10],
          padding: sizes[2],
          right: 0,
          top: 0,
          zIndex: 1,
          transform: [
            {
              scale: animValue.current,
            },
          ],
        }}>
        <View
          style={{
            padding: sizes[5],
            borderRadius: sizes[10],
            backgroundColor: secondary,
          }}>
          <Icon name="CheckIcon" size={sizes[8]} fill="white" />
        </View>
      </Animated.View>
    </>
  );
};

export default WrapperCircular;
