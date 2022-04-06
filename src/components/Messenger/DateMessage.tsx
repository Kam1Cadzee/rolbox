import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useFormattingContext} from '../../context/FormattingContext';
import {sizes, useTheme} from '../../context/ThemeContext';
import {IMessageDate, PositionMessage} from '../../typings/IMessage';
import MyText from '../controls/MyText';

interface IDateMessageProps {
  message: IMessageDate;
}
const DateMessage = React.memo(({message}: IDateMessageProps) => {
  const {formatDateStr} = useFormattingContext();
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
          marginTop: message.position === PositionMessage.middle ? sizes[10] : undefined,
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
        {formatDateStr(message.date, 'dd MMMM yyyy')}
      </MyText>
    </View>
  );
});

const styles = StyleSheet.create({
  con: {
    borderTopWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    overflow: 'visible',
    marginBottom: sizes[20],
  },
  text: {
    fontSize: sizes[12],
    paddingHorizontal: sizes[16],
    top: -sizes[7],
    zIndex: 100,
  },
});
export default DateMessage;
