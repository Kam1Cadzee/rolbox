import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import MyText from './MyText';
import {sizes, useTheme} from '../../context/ThemeContext';

interface IWrapperInputProps {
  label?: string;
  children?: any;
  isFocus: boolean;
  isRequired?: boolean;
  error?: string;
  styleCon?: StyleProp<ViewStyle>;
  innerCon?: StyleProp<ViewStyle>;
}

const WrapperInput = ({children, label, isFocus, isRequired, styleCon, error, innerCon}: IWrapperInputProps) => {
  const {border, text, errorColor} = useTheme();

  const borderColor = isFocus ? text : border;
  return (
    <View style={[styles.con, styleCon]}>
      {!!label && (
        <MyText style={styles.label}>
          {`${label} `}
          {isRequired && <MyText style={{color: errorColor}}>*</MyText>}
        </MyText>
      )}
      <MyText style={[styles.error, {color: errorColor}]}>{error}</MyText>
      <View style={[styles.innerCon, {borderColor}, innerCon]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  con: {
    marginBottom: sizes[20],
  },
  innerCon: {
    borderRadius: sizes[4],
    borderWidth: 1,
  },
  label: {
    marginBottom: sizes[8],
  },
  error: {
    position: 'absolute',
    right: 0,
  },
});
export default WrapperInput;
