import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {sizes, useTheme} from '../../context/ThemeContext';
import {IMessageItem, ITextMessage, TypeMessage} from '../../typings/IMessage';
import {getFontFamily} from '../../utils/getFontFamily';
import MyText from '../controls/MyText';

interface IReplyMessageProps {
  message: IMessageItem;
  conStyle?: StyleProp<ViewStyle>;
}

const ReplyMessage = React.memo(({message, conStyle}: IReplyMessageProps) => {
  const {primary} = useTheme();

  return (
    <View style={[styles.con, {borderLeftColor: primary}, conStyle]}>
      {message.type === TypeMessage.text && <ReplyMessageText message={message.data as any} />}
    </View>
  );
});

interface IReplyMessageTextProps {
  message: ITextMessage;
}

const ReplyMessageText = React.memo(({message}: IReplyMessageTextProps) => {
  const {primary} = useTheme();

  return (
    <React.Fragment>
      <MyText style={[styles.name, {color: primary}]}>Vadim</MyText>
      <MyText style={styles.text} numberOfLines={1}>
        {message.text}
      </MyText>
    </React.Fragment>
  );
});

const styles = StyleSheet.create({
  con: {borderLeftWidth: sizes[2], paddingLeft: sizes[4], marginBottom: sizes[5]},
  name: {
    fontFamily: getFontFamily(500),
    fontSize: sizes[12],
  },
  text: {
    fontSize: sizes[12],
  },
});
export default ReplyMessage;
