import React from 'react';
import {StyleProp, StyleSheet, ViewStyle} from 'react-native';
import EmptyBlock from './EmptyBlock';
import {sizes} from '../../context/ThemeContext';
import t from '../../utils/t';

interface IEmptyWishlistProps {
  style?: StyleProp<ViewStyle>;
}

const EmptyWillGifts = ({style}: IEmptyWishlistProps) => {
  return <EmptyBlock style={[styles.con, style]} texts={[t('textChooseGifts')]} />;
};

const styles = StyleSheet.create({
  con: {
    paddingVertical: sizes[20],
    paddingHorizontal: '10%',
  },
});
export default EmptyWillGifts;
