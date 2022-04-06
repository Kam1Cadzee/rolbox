import React from 'react';
import {StyleProp, StyleSheet, TextStyle, ActivityIndicator, Platform} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {GenericTouchableProps} from 'react-native-gesture-handler/lib/typescript/components/touchables/GenericTouchable';
import MyText from './MyText';
import {sizes, useTheme} from '../../context/ThemeContext';
import {getFontFamily} from '../../utils/getFontFamily';
import {useDelay} from '../../useHooks/useDebounce';

enum TypeButton {
  ghost,
  primary,
  secondary,
  fog,
  lightFog,
  border,
}

interface IMyButtonProps extends GenericTouchableProps {
  children?: any;
  isLoading?: boolean;
  type?: TypeButton;
  styleText?: StyleProp<TextStyle>;
}

const MyButton = React.forwardRef(
  (
    {
      children,
      type = TypeButton.ghost,
      isLoading = false,
      disabled = false,
      style = {},
      styleText = {},
      containerStyle = {},
      onPress,
      ...props
    }: IMyButtonProps,
    ref,
  ) => {
    const {primary, lightText, reverseText, border, text, secondary, primaryLight, primaryThin} = useTheme();
    let bg = 'transparent';
    let color = lightText;
    let borderColor = border;

    const handlePress = useDelay(() => {
      if (disabled || isLoading) return;
      onPress && onPress();
    });

    if (type === TypeButton.primary) {
      bg = primary;
      color = reverseText;
      borderColor = primary;
    } else if (type === TypeButton.secondary) {
      bg = secondary;
      color = reverseText;
      borderColor = secondary;
    } else if (type === TypeButton.fog) {
      bg = primaryLight;
      color = reverseText;
      borderColor = primaryLight;
    } else if (type === TypeButton.lightFog) {
      bg = primaryThin;
      color = reverseText;
      borderColor = primaryThin;
    } else if (type === TypeButton.border) {
      color = text;
      borderColor = primary;
    }

    const content =
      typeof children === 'string' ? (
        <MyText
          numberOfLines={1}
          style={[
            styles.text,
            {
              color,
              fontFamily: getFontFamily(400),
              width: '90%',
            },
            styleText,
          ]}>
          {children}
        </MyText>
      ) : (
        children
      );

    return (
      <TouchableOpacity
        ref={ref as any}
        activeOpacity={0.4}
        disabled={disabled}
        style={[
          styles.con,
          {
            backgroundColor: bg,
            opacity: disabled ? 0.5 : 1,
            borderColor,
          },
          style,
        ]}
        containerStyle={[styles.conStyle, containerStyle]}
        onPress={handlePress}
        {...props}>
        {isLoading ? <ActivityIndicator size="small" color={color} /> : content}
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    paddingVertical: Platform.OS === 'ios' ? sizes[3] / 2 : sizes[1] / 2,
  },
  con: {
    borderRadius: sizes[4],
    paddingVertical: sizes[10],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  conStyle: {},
});

export {TypeButton};
export default MyButton;
