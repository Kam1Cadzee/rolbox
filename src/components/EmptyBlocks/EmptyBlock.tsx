import React from 'react';
import {StyleProp, StyleSheet, ViewStyle} from 'react-native';
import {sizes, useTheme} from '../../context/ThemeContext';
import MyText from '../controls/MyText';
import {getFontFamily} from '../../utils/getFontFamily';
import BackgroundContent from '../common/BackgroundContent';

interface IEmptyBlockProps {
  texts: string[];
  style?: StyleProp<ViewStyle>;
}

const EmptyBlock = ({texts, style}: IEmptyBlockProps) => {
  const {lightText} = useTheme();

  return (
    <BackgroundContent style={[styles.con, style]}>
      {texts.map((text, i) => {
        return (
          <MyText key={i} style={[styles.text, {color: lightText}]}>
            {text}
          </MyText>
        );
      })}
    </BackgroundContent>
  );
};

const styles = StyleSheet.create({
  con: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    paddingVertical: sizes[35],
    paddingHorizontal: '20%',
  },
  text: {
    fontFamily: getFontFamily(300),
    fontSize: sizes[16],
    lineHeight: sizes[24],
    textAlign: 'center',
  },
});
export default EmptyBlock;
