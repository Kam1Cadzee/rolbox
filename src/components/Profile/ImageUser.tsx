import React from 'react';
import {Image, ImageStyle, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {sizes, useTheme} from '../../context/ThemeContext';
import Icon from '../common/Icons';

interface IImageUserProps {
  image?: string;
  style?: StyleProp<ViewStyle & ImageStyle>;
  size: number;
}
const ImageUser = ({image, style, size}: IImageUserProps) => {
  const {border, background} = useTheme();

  if (image) {
    return (
      <Image
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 3,
          },
          style,
        ]}
        source={{
          uri: image,
        }}
      />
    );
  }

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 3,
          backgroundColor: border,
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}>
      <Icon name="ProfileIcon" fill={background} size={size / 2} />
    </View>
  );
};

export default ImageUser;
