import React, {useRef, useState} from 'react';
import {StyleSheet, View, StyleProp, ViewStyle, TextStyle} from 'react-native';
import Animated, {Easing, useValue} from 'react-native-reanimated';
import IOption from '../../typings/IOption';
import {sizes, useTheme} from '../../context/ThemeContext';
import MyText from '../controls/MyText';
import {getFontFamily} from '../../utils/getFontFamily';
import {isIOS} from '../../utils/isPlatform';
import useDidUpdateEffect from '../../useHooks/useDidUpdateEffect';
import TouchableOpacityGestureDelay from '../controls/TouchableOpacityGestureDelay';

interface IVerticalTabsProps<T, R = any> {
  options: IOption<T, R>[];
  select: IOption<T, R>;
  setOption: (d: IOption<T, R>) => void;
  style?: StyleProp<ViewStyle>;
  styleText?: StyleProp<TextStyle>;
}

const VerticalTabs = <T,>({options, select, setOption, styleText, style}: IVerticalTabsProps<T>) => {
  const animLeftRef = useValue(0);
  const [selected, setSelected] = useState(select);
  const measureRef = useRef(new Array(options.length).fill(0));
  const animWidthRef = useValue(0);
  const {secondary, border, lightText, text} = useTheme();

  useDidUpdateEffect(() => {
    handleSelect(
      select,
      options.findIndex((opt) => opt.value === select.value),
    );
  }, [select]);

  const handleSelect = (opt: IOption<T>, index: number) => {
    setSelected(opt);
    const leftValue = Math.floor(
      measureRef.current.reduce((a, b, i) => {
        if (index > i) {
          return a + b;
        }
        return a;
      }, 0),
    );
    const widthValue = Math.floor(measureRef.current[index]);

    if (isIOS) {
      Animated.timing(animLeftRef, {
        toValue: leftValue,
        duration: 300,
        easing: Easing.circle,
      }).start();
      Animated.timing(animWidthRef, {
        toValue: widthValue,
        duration: 300,
        easing: Easing.circle,
      }).start();
    } else {
      animLeftRef.setValue(leftValue);
      animWidthRef.setValue(widthValue);
    }
    setOption(opt);
  };

  return (
    <View style={[styles.con, {borderBottomColor: border}, style]}>
      {options.map((opt, index) => {
        const isActive = opt.value === selected.value;

        return (
          <TouchableOpacityGestureDelay
            activeOpacity={0.6}
            onLayout={(e) => {
              if (measureRef.current[index] !== 0) {
                return;
              }
              if (index === 0) {
                animWidthRef.setValue(e.nativeEvent.layout.width);
              }
              measureRef.current[index] = e.nativeEvent.layout.width;
            }}
            key={opt.value}
            containerStyle={{
              flexGrow: 1,
            }}
            style={[styles.btn, {}]}
            onPress={() => handleSelect(opt, index)}>
            <MyText
              style={[
                styles.text,
                {
                  color: isActive ? text : lightText,
                  fontFamily: getFontFamily(isActive ? 500 : 400),
                },
                styleText,
              ]}>
              {opt.label}
              {!!opt.extra && <MyText style={{color: secondary}}> +{opt.extra}</MyText>}
            </MyText>
          </TouchableOpacityGestureDelay>
        );
      })}
      <Animated.View
        style={[
          styles.line,
          {
            backgroundColor: secondary,
            left: animLeftRef,
            width: animWidthRef,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  con: {
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: sizes[16],
    textAlign: 'center',
  },
  btn: {
    paddingVertical: sizes[13],
    flexGrow: 1,
  },
  line: {
    position: 'absolute',
    height: sizes[2],
    bottom: -sizes[1],
    borderRadius: sizes[1],
  },
});
export default VerticalTabs;
