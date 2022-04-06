import React, {useRef, useState} from 'react';
import {NativeViewGestureHandlerProperties, TextInput} from 'react-native-gesture-handler';
import {Keyboard, Platform, StyleProp, StyleSheet, TextInputProps, ViewStyle} from 'react-native';
import {sizes, useTheme} from '../../context/ThemeContext';
import WrapperInput from './WrapperInput';
import {getFontFamily} from '../../utils/getFontFamily';
import useDidUpdateEffect from '../../useHooks/useDidUpdateEffect';

type IMyTextInput = NativeViewGestureHandlerProperties &
  TextInputProps & {
    label?: string;
    isRequired?: boolean;
    styleCon?: StyleProp<ViewStyle>;
    styleWrapper?: StyleProp<ViewStyle>;
    error?: string;
    rightComponent?: any;
  };

const MyTextInput = React.memo(
  ({
    label,
    value,
    keyboardType,
    onChangeText,
    onFocus,
    onBlur,
    error = '',
    style = undefined,
    styleCon = {},
    styleWrapper,
    isRequired = false,
    placeholder,
    rightComponent,
    ...props
  }: IMyTextInput) => {
    let {border, lightText, text, errorColor, accent} = useTheme();
    const [isFocus, setIsFocus] = useState(false);
    const ref = useRef();

    if (error !== '') {
      border = errorColor;
    }

    const handleFocus = (e: any) => {
      if (onFocus) {
        onFocus(e);
      }
      setIsFocus(true);
    };

    const handleBlur = (e: any) => {
      if (onBlur) {
        onBlur(e);
      }
      setIsFocus(false);
    };

    useDidUpdateEffect(() => {
      if (ref.current) {
        ref.current.focus();
      }
    }, [error]);

    return (
      <WrapperInput
        label={label}
        isFocus={isFocus}
        isRequired={isRequired}
        error={error}
        innerCon={[
          {
            flexDirection: 'row',
          },
          styleWrapper,
        ]}
        styleCon={{...(styleCon as any), borderColor: border}}>
        <TextInput
          ref={ref}
          selectionColor={accent}
          style={[styles.textInput, {color: text}, style]}
          maxFontSizeMultiplier={1}
          autoCapitalize="none"
          onSubmitEditing={Keyboard.dismiss}
          keyboardType={keyboardType}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={lightText}
          {...props}
        />
        {rightComponent}
      </WrapperInput>
    );
  },
);

const styles = StyleSheet.create({
  textInput: {
    fontFamily: getFontFamily(500),
    padding: Platform.OS === 'ios' ? sizes[15] : undefined,
    paddingHorizontal: sizes[15],
    fontSize: sizes[14],
    flexGrow: 1,
  },
});

export default MyTextInput;
