import React, {useRef} from 'react';
import {View, StyleSheet, ScrollView, StyleProp, ViewStyle, ScrollViewProps} from 'react-native';
import Animated, {multiply, divide, concat} from 'react-native-reanimated';
import {sizes, useTheme} from '../../context/ThemeContext';

interface ICustomScrollViewProps extends ScrollViewProps {
  children?: any;
  scrollViewHeight: number;
  conStyle?: StyleProp<ViewStyle>;
  lineStyle?: StyleProp<ViewStyle>;
  trackStyle?: StyleProp<ViewStyle>;
}

const CustomScrollView = ({
  children,
  scrollViewHeight,
  conStyle,
  lineStyle,
  trackStyle,
  onScroll,
  onContentSizeChange,
  ...props
}: ICustomScrollViewProps) => {
  const {border, secondary} = useTheme();
  const value = useRef(new Animated.Value(0));
  const [contentSize, setContentSize] = React.useState(0);
  const scrollElementHeightPercent = useRef(25);
  const scrollElementHeightPercentStr = `${scrollElementHeightPercent.current}%`;
  const scrollAnim = multiply(
    divide(value.current, contentSize - scrollViewHeight),
    100 - scrollElementHeightPercent.current,
  );

  return (
    <View
      style={[
        styles.view,
        {
          height: scrollViewHeight,
        },
        conStyle,
      ]}>
      {scrollViewHeight < contentSize && (
        <View
          style={[
            styles.line,
            {
              backgroundColor: border,
            },
            lineStyle,
          ]}>
          <Animated.View
            style={[
              styles.track,
              {
                backgroundColor: secondary,
                top: concat(scrollAnim, '%'),
                height: scrollElementHeightPercentStr,
              },
              trackStyle,
            ]}
          />
        </View>
      )}
      <ScrollView
        bounces={false}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        onScroll={(e) => {
          value.current.setValue(e.nativeEvent.contentOffset.y as any);
          onScroll && onScroll(e);
        }}
        onContentSizeChange={(_, height) => {
          scrollElementHeightPercent.current = (scrollViewHeight * 100) / height;
          setContentSize(height);
          onContentSizeChange && onContentSizeChange(_, height);
        }}
        {...props}>
        {children}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    width: '100%',
  },
  line: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 1,
    height: '100%',
    zIndex: 1,
  },
  track: {
    position: 'absolute',
    left: -1,
    width: sizes[3],
    borderRadius: sizes[2],
  },
});

export default CustomScrollView;
