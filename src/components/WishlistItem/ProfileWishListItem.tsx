import React from 'react';
import WishListItem from './WishListItem.dumb';
import IconButton from '../controls/IconButton';
import {sizes, useTheme} from '../../context/ThemeContext';
import {IWishlist} from '../../typings/IWishlist';
import VisibilityType, {useVisibilityByType} from '../../typings/VisibilityType';
import useSharing from '../../useHooks/useSharing';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import {Image, StyleSheet, View} from 'react-native';
import {getFontFamily} from '../../utils/getFontFamily';
import MyText from '../controls/MyText';
import {useSelector} from 'react-redux';
import {selectorsUser} from '../../redux/user/userReducer';
import getIdObj from '../../utils/getIdObj';
import {UserExtension} from '../../typings/IUser';

interface IProfileWishListItemProps {
  wishlist: IWishlist;
  onPress: (w: IWishlist) => void;
  isShare?: boolean;
}

const ProfileWishListItem = ({wishlist, onPress, isShare = true}: IProfileWishListItemProps) => {
  const {shareWishlist} = useSharing();
  const visibility = useVisibilityByType(wishlist.visibility);
  const user = useSelector(selectorsUser.getUser);
  const userWishlist = wishlist.user as any;

  const {lightText} = useTheme();

  const handlePress = () => {
    onPress(wishlist);
  };

  const onShare = async () => {
    await shareWishlist(wishlist);
  };

  const isFollow = user._id !== getIdObj(userWishlist);

  return (
    <WishListItem
      onPress={handlePress}
      type={wishlist.coverCode}
      title={wishlist.name}
      styleCon={{
        marginBottom: sizes[10],
      }}
      styleTitle={{
        maxWidth: responsiveScreenWidth(52),
      }}
      extraBtn={
        isShare ? (
          <IconButton
            onPress={onShare}
            icon={{
              name: 'ShareIcon',
              fill: lightText,
              size: sizes[16],
            }}
          />
        ) : null
      }>
      {isFollow ? (
        <View style={styles.viewAvatar}>
          <Image
            style={styles.avatar}
            source={{
              uri: UserExtension.image(userWishlist),
            }}
          />
          <MyText numberOfLines={2} style={styles.textName}>
            {UserExtension.fullName(userWishlist)}
          </MyText>
        </View>
      ) : (
        <MyText style={[styles.subtitle, {color: lightText}]}>{visibility.label.title}</MyText>
      )}
    </WishListItem>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    fontSize: sizes[12],
    fontFamily: getFontFamily(300),
    marginTop: sizes[8],
  },
  textName: {
    fontSize: sizes[10],
    marginLeft: sizes[8],
    maxWidth: responsiveScreenWidth(40),
  },
  avatar: {
    borderRadius: sizes[6],
    width: sizes[24],
    height: sizes[24],
  },
  viewAvatar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: sizes[10],
  },
});
export default ProfileWishListItem;
