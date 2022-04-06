import React from 'react';
import {StyleSheet} from 'react-native';
import WrapperInput from './WrapperInput';
import MyText from './MyText';
import {sizes} from '../../context/ThemeContext';
import {getFontFamily} from '../../utils/getFontFamily';
import TouchableOpacityDelay from './TouchableOpacityDelay';

interface ITouchableInputProps {
  label: string;
  isRequired?: boolean;
  onPress: any;
  strValue: string;
  rightComponent?: any;
}

const TouchableInput = ({isRequired, label, onPress, strValue, rightComponent}: ITouchableInputProps) => {
  return (
    <WrapperInput label={label} isFocus={false} isRequired={isRequired}>
      <TouchableOpacityDelay style={styles.touchable} onPress={onPress}>
        <MyText style={{fontFamily: getFontFamily(500)}}>{strValue}</MyText>
        {rightComponent}
      </TouchableOpacityDelay>
    </WrapperInput>
  );
};

const styles = StyleSheet.create({
  touchable: {
    padding: sizes[15],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default TouchableInput;
