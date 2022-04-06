import React from 'react';
import {StyleSheet, View} from 'react-native';
import {sizes, useTheme} from '../../context/ThemeContext';
import t from '../../utils/t';
import MyText from '../controls/MyText';

interface INewMessageProps {}
const NewMessage = React.memo(({}: INewMessageProps) => {
  const {lightText, background} = useTheme();

  return (
    <View
      style={[
        styles.con,
        {
          borderTopColor: lightText,
          transform: [
            {
              scaleY: -1,
            },
          ],
        },
      ]}>
      <MyText
        style={[
          styles.text,
          {
            color: lightText,
            backgroundColor: background,
          },
        ]}>
        {t('unreadMessage')}
      </MyText>
    </View>
  );
});

const styles = StyleSheet.create({
  con: {
    borderTopWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    overflow: 'visible',
    marginBottom: sizes[10],
  },
  text: {
    fontSize: sizes[12],
    paddingHorizontal: sizes[16],
    top: -sizes[7],
    zIndex: 100,
  },
});
export default NewMessage;
