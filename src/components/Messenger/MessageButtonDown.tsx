import React from 'react';
import {StyleSheet} from 'react-native';
import {sizes, useTheme} from '../../context/ThemeContext';
import {normalizeBigNumber} from '../../utils/normalizeData';
import Icon from '../common/Icons';
import MyText from '../controls/MyText';
import TouchableOpacityDelay from '../controls/TouchableOpacityDelay';

interface IMessageButtonDownProps {
  onPress: any;
  count: number;
}

const sizeCircle = sizes[36];
const sizeLittleCircle = sizeCircle * 0.5;

const MessageButtonDown = ({onPress, count}: IMessageButtonDownProps) => {
  const {secondary, secondaryDark, reverseText} = useTheme();

  return (
    <TouchableOpacityDelay
      onPress={onPress}
      style={[
        styles.con,
        {
          backgroundColor: secondaryDark,
        },
      ]}>
      {count !== 0 && (
        <MyText
          style={[
            styles.text,
            {
              color: reverseText,
            },
          ]}>
          {normalizeBigNumber(count)}
        </MyText>
      )}
      <Icon name="ArrowDownIcon" size={sizeCircle / 2} fill={reverseText} />
    </TouchableOpacityDelay>
  );
};

const styles = StyleSheet.create({
  con: {
    position: 'absolute',
    bottom: sizes[20],
    right: sizes[10],
    width: sizeCircle,
    height: sizeCircle,
    borderRadius: sizeCircle / 2,
    zIndex: 10000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    position: 'absolute',
    fontSize: sizes[10],
    width: sizeLittleCircle,
    height: sizeLittleCircle,
    borderRadius: sizeLittleCircle / 2,
    top: sizes[2],
  },
});

export default MessageButtonDown;
