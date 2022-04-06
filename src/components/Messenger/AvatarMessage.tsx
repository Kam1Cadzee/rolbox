import React from 'react';
import {Image, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {sizes, useTheme} from '../../context/ThemeContext';
import {IUser, UserExtension} from '../../typings/IUser';
import Icon from '../common/Icons';
import ImageUser from '../Profile/ImageUser';

interface IAvatarMessageProps {
  user: IUser;
  isGroup: boolean;
  sizeImage?: number;
}
const AvatarMessage = ({user, isGroup, sizeImage = sizes[56]}: IAvatarMessageProps) => {
  const {reverseText, backgroundDark} = useTheme();

  const iconSize = sizeImage / 2;
  const smallImage = sizeImage / 2.5;
  const borderRadius = sizeImage / 2.7;

  if (isGroup) {
    return (
      <View
        style={[
          styles.image,
          {
            backgroundColor: backgroundDark,
            alignItems: 'center',
            justifyContent: 'center',
            width: sizeImage,
            height: sizeImage,
            borderRadius,
          },
        ]}>
        <Icon name="GroupChatIcon" size={iconSize} fill={reverseText} />
        <ImageUser
          size={smallImage}
          image={UserExtension.image(user)}
          style={{
            right: -(smallImage / 2),

            position: 'absolute',
            bottom: 0,
          }}
        />
      </View>
    );
  } else {
    return <ImageUser size={sizeImage} image={UserExtension.image(user)} />;
  }
};

const styles = StyleSheet.create({
  image: {},
  imageUser: {
    borderRadius: sizes[6],
    position: 'absolute',
    bottom: 0,
  },
});
export default AvatarMessage;
