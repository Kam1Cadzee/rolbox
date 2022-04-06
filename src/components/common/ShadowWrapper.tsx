import React from 'react';
import {Platform, StyleProp, View, ViewStyle} from 'react-native';

const Androw = require('react-native-androw').default;

interface IShadowWrapperProps {
  children?: any;
  style?: StyleProp<ViewStyle>;
}

const ShadowWrapper = ({children, style}: IShadowWrapperProps) => {
  return Platform.OS === 'ios' ? <View style={style}>{children}</View> : <Androw style={style}>{children}</Androw>;
};

export default ShadowWrapper;
