import React, {useRef} from 'react';
import {StyleSheet} from 'react-native';
import Animated, {Easing, interpolateColors, timing} from 'react-native-reanimated';
import {sizes, useTheme} from '../../context/ThemeContext';
import useDidUpdateEffect from '../../useHooks/useDidUpdateEffect';
import TouchableOpacityDelay from './TouchableOpacityDelay';

interface IMySwitch {
  checked: boolean;
  onChecked: (c: boolean) => void;
}
const width = sizes[48];
const height = sizes[24];
const borderWidth = sizes[2];
const outerBorder = sizes[4];
const sizeCircle = height - borderWidth * 2 - outerBorder;
const offset = borderWidth;
const offsetLeft = width - borderWidth * 2 - sizeCircle - outerBorder;

const MySwitch = ({checked, onChecked}: IMySwitch) => {
  const {border, secondary, background} = useTheme();
  const animRef = useRef(new Animated.Value(0));

  useDidUpdateEffect(() => {
    timing(animRef.current, {
      duration: 200,
      easing: Easing.quad,
      toValue: checked ? offsetLeft : 0,
    }).start();
  }, [checked]);

  const bg = !checked ? background : secondary;
  const circleBg = !checked ? border : background;
  const borderBg = !checked ? border : secondary;

  return (
    <Animated.View style={[styles.con, {borderColor: borderBg, backgroundColor: bg}]}>
      <TouchableOpacityDelay onPress={() => onChecked(!checked)}>
        <Animated.View
          style={[
            styles.circle,
            {
              backgroundColor: circleBg,
              transform: [
                {
                  translateX: animRef.current,
                },
              ],
            } as any,
          ]}
        />
      </TouchableOpacityDelay>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  con: {
    width,
    height,
    borderRadius: height / 2,
    borderWidth,
  },
  circle: {
    width: sizeCircle,
    height: sizeCircle,
    borderRadius: sizeCircle / 2,
    top: offset,
    left: offset,
  },
});

export default MySwitch;
