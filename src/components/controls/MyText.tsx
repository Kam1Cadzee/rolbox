import React from 'react';
import {TextProps, Text, StyleSheet} from 'react-native';
import {sizes, useTheme} from '../../context/ThemeContext';
import {getFontFamily} from '../../utils/getFontFamily';
import ParsedText, {ParsedTextProps} from 'react-native-parsed-text';

interface IMyTextProps extends TextProps {
  children?: any;
}
const MyText = React.memo(({children, style = {}, ...props}: IMyTextProps) => {
  const {text} = useTheme();
  return (
    <Text maxFontSizeMultiplier={1} minimumFontScale={1} style={[styles.text, {color: text}, style]} {...props}>
      {children}
    </Text>
  );
});

interface MyParseTextProps extends ParsedTextProps {
  children?: any;
}
const MyParseText = ({children, style, ...props}: MyParseTextProps) => {
  const {text} = useTheme();
  return (
    <ParsedText maxFontSizeMultiplier={1} minimumFontScale={1} style={[styles.text, {color: text}, style]} {...props}>
      {children}
    </ParsedText>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: sizes[14],
    fontFamily: getFontFamily(400),
  },
});

export {MyParseText};
export default MyText;
