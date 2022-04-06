import React, {useMemo} from 'react';
import {gestureHandlerRootHOC, PanGestureHandler} from 'react-native-gesture-handler';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
// @ts-ignore
import {usePanGestureHandler, translateZ} from 'react-native-redash/lib/module/v1';
import Animated, {
  add,
  asin,
  cos,
  divide,
  Extrapolate,
  interpolate,
  multiply,
  set,
  sub,
  useCode,
  useValue,
  Value,
} from 'react-native-reanimated';
import MaskedView from '@react-native-community/masked-view';
import MyText from '../MyText';
import {withDecay} from '../../../utils/withDecay';
import {sizes, useTheme} from '../../../context/ThemeContext';
import IOption from '../../../typings/IOption';
import {getFontFamily} from '../../../utils/getFontFamily';

interface IScrollPickerProps<T = number> {
  options: IOption<T>[];
  onSelect: (i: number) => void;
  defaultSelected: T;
  style?: StyleProp<ViewStyle>;
}

const VISIBLE_ITEMS = 3;
const ITEM_HEIGHT = sizes[48];
const perspective = 600;
const RADIUS_REL = VISIBLE_ITEMS * 1;
const RADIUS = RADIUS_REL * ITEM_HEIGHT;
const X = Math.floor(VISIBLE_ITEMS / 2);

const ScrollPicker = gestureHandlerRootHOC(({options, onSelect, defaultSelected, style}: IScrollPickerProps) => {
  const {lightText, text} = useTheme();

  const index = useMemo(() => {
    const defaultIndex = options.findIndex((o) => o.value === defaultSelected);
    return defaultIndex !== -1 ? defaultIndex : 0;
  }, [defaultSelected, options]);

  const translateY = useValue(0);

  const onSetSelectedIndex = (i: number) => {
    onSelect(i);
  };

  const maskElement = (
    <Animated.View style={{transform: [{translateY}]}}>
      {options.map((v, i) => {
        const y = interpolate(divide(sub(translateY, ITEM_HEIGHT * X), -ITEM_HEIGHT), {
          inputRange: [i - RADIUS_REL, i, i + RADIUS_REL],
          outputRange: [-1, 0, 1],
          extrapolate: Extrapolate.CLAMP,
        });
        const rotateX = asin(y);
        const z = sub(multiply(RADIUS, cos(rotateX)), RADIUS);
        return (
          <Animated.View
            key={i}
            style={[
              styles.item,
              {
                transform: [{perspective}, {rotateX}, translateZ(perspective, z)],
              },
            ]}>
            <MyText
              style={[
                styles.label,
                {
                  fontFamily: getFontFamily(i === index ? 500 : 400),
                },
              ]}>
              {v.label}
            </MyText>
          </Animated.View>
        );
      })}
    </Animated.View>
  );

  return (
    <View style={[styles.container, style]}>
      <MaskedView {...{maskElement}}>
        <View style={{height: ITEM_HEIGHT * X, backgroundColor: lightText}} />
        <View
          style={{
            height: ITEM_HEIGHT,
            backgroundColor: text,
          }}
        />
        <View style={{height: ITEM_HEIGHT * X, backgroundColor: lightText}} />
      </MaskedView>
      <View style={StyleSheet.absoluteFill}>
        <View
          style={{
            borderColor: text,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            top: ITEM_HEIGHT * X,
            height: ITEM_HEIGHT,
          }}
        />
      </View>
      <GestureHandler
        key={options.length}
        max={options.length}
        value={translateY}
        setSelectedIndex={onSetSelectedIndex}
        defaultIndex={index}
      />
    </View>
  );
});

interface GestureHandlerProps {
  value: Animated.Value<number>;
  max: number;
  defaultIndex: number;
  setSelectedIndex: any;
}

const GestureHandler = ({value, max, defaultIndex, setSelectedIndex}: GestureHandlerProps) => {
  const {gestureHandler, translation, velocity, state} = usePanGestureHandler();
  const snapPoints = useMemo(() => {
    return new Array(max).fill(0).map((_, i) => i * -ITEM_HEIGHT);
  }, [max]);
  const translateY = withDecay({
    value: translation.y,
    velocity: velocity.y,
    state,
    snapPoints,
    offset: new Value(-ITEM_HEIGHT * 34),
    defaultKey: defaultIndex,
    onFinalPositionResolve: setSelectedIndex,
  });

  useCode(() => [set(value, add(translateY, ITEM_HEIGHT * X))], []);
  return (
    <PanGestureHandler {...gestureHandler}>
      <Animated.View style={[StyleSheet.absoluteFill]} />
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    overflow: 'hidden',
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
  },
  label: {
    fontSize: sizes[16],
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});

export {ITEM_HEIGHT};
export default ScrollPicker;
