import {Image, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import Icon from '../common/Icons';
import {colorWithOpacity, sizes, useTheme} from '../../context/ThemeContext';
import TouchableOpacityGestureDelay from '../controls/TouchableOpacityGestureDelay';

interface IAvatarProps {
  img?: string | null;
  onPress?: any;
}

const Avatar = ({img, onPress}: IAvatarProps) => {
  const [isModeDelete, setIsModeDelete] = useState(false);
  const {reverseText, primary} = useTheme();

  const handlePress = () => {
    if (!onPress) {
      return;
    }
    if (isModeDelete) {
      onPress();
      setIsModeDelete(false);
    } else {
      setIsModeDelete(true);
    }
  };

  return (
    <TouchableOpacityGestureDelay onPress={handlePress} style={styles.avatar}>
      {img ? (
        <Image
          source={{
            uri: img,
          }}
          style={styles.avatar}
        />
      ) : (
        <Icon name="AvatarIcon" size={sizes[56]} />
      )}
      {isModeDelete && (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: colorWithOpacity(primary, 0.7),
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: sizes[20],
          }}>
          <Icon name="TrashIcon" size={sizes[16]} fill={reverseText} />
        </View>
      )}
    </TouchableOpacityGestureDelay>
  );
};

const styles = StyleSheet.create({
  avatar: {
    borderRadius: sizes[20],
    width: sizes[56],
    height: sizes[56],
  },
});
export default Avatar;
