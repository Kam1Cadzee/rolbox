import React from 'react';
import {StyleProp, StyleSheet, ViewStyle} from 'react-native';
import BackgroundContent from '../common/BackgroundContent';
import {getFontFamily} from '../../utils/getFontFamily';
import {sizes, useTheme} from '../../context/ThemeContext';
import MyText from '../controls/MyText';
import Icon from '../common/Icons';
import t from '../../utils/t';

interface IEmptyGiftsProps {
  style?: StyleProp<ViewStyle>;
}

const EmptyGifts = ({style}: IEmptyGiftsProps) => {
  const {lightText} = useTheme();
  return (
    <BackgroundContent style={[styles.con, style]}>
      <MyText style={[styles.text, {color: lightText}]}>{t('addGiftsHelper')}</MyText>
      <Icon name="BigPresentIcon" size={sizes[70]} />
    </BackgroundContent>
  );
};

const styles = StyleSheet.create({
  con: {
    justifyContent: 'center',
    alignItems: 'center',

    paddingHorizontal: '24%',
    paddingVertical: sizes[45],
  },
  text: {
    fontFamily: getFontFamily(300),
    fontSize: sizes[16],
    lineHeight: sizes[24],
    textAlign: 'center',
    marginBottom: sizes[35],
  },
});
export default EmptyGifts;
