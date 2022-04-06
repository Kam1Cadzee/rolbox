import React from 'react';
import {StyleProp, StyleSheet, ViewStyle} from 'react-native';
import {TypeModal, useModal} from '../../context/ModalContext';
import {useTheme} from '../../context/ThemeContext';
import {getFontFamily} from '../../utils/getFontFamily';
import {MyParseText} from '../controls/MyText';

interface IParseTextMessageProps {
  text: string;
  styleText?: StyleProp<ViewStyle>;
}
const ParseTextMessage = ({text, styleText}: IParseTextMessageProps) => {
  const {accent} = useTheme();
  const {executeModal} = useModal();

  const handlePressURL = (url: string) => {
    executeModal({
      priority: 'high',
      type: TypeModal.urlSheet,
      payload: url,
    });
  };

  return (
    <MyParseText
      style={styleText}
      parse={[
        {
          type: 'url',
          style: [
            styles.url,
            {
              color: accent,
            },
          ],
          onPress: handlePressURL,
          pattern: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/=]*)?/gi,
        },
      ]}>
      {text}
    </MyParseText>
  );
};

const styles = StyleSheet.create({
  url: {
    fontFamily: getFontFamily(500),
    textDecorationLine: 'underline',
  },
});
export default ParseTextMessage;
