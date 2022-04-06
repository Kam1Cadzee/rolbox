import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import ICoverItem from '../../typings/ICoverItem';
import WrapperCircular from './WrapperCircular';
import Icon from './Icons';
import {sizes} from '../../context/ThemeContext';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import TouchableOpacityGestureDelay from '../controls/TouchableOpacityGestureDelay';

interface ICoverItemProps {
  isSelected: boolean;
  item: ICoverItem;
  setSelected: (s: ICoverItem) => void;
  conStyle?: StyleProp<ViewStyle>;
}

const CoverItem = ({isSelected, item, setSelected, conStyle}: ICoverItemProps) => {
  return (
    <TouchableOpacityGestureDelay
      style={conStyle}
      onPress={() => {
        setSelected(item);
      }}>
      <WrapperCircular isSelected={isSelected}>
        <Icon name={item.icon} size={sizes[36]} />
      </WrapperCircular>
    </TouchableOpacityGestureDelay>
  );
};

export default CoverItem;
