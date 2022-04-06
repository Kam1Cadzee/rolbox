import React from 'react';
import {StyleSheet, View} from 'react-native';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/core';
import ProfileWishListItem from '../WishlistItem/ProfileWishListItem';
import {sizes} from '../../context/ThemeContext';
import {selectorsUser} from '../../redux/user/userReducer';
import EmptyWishlist from '../EmptyBlocks/EmptyWishlist';
import {IWishlist} from '../../typings/IWishlist';

interface ITabContentWishlistProps {}

const TabContentWishlist = ({}: ITabContentWishlistProps) => {
  const wishlists = useSelector(selectorsUser.getOwnedWishlists);
  const navigation = useNavigation();

  const onPress = (wishlist: IWishlist) => {
    navigation.navigate('InvisibleNavigator', {
      screen: 'WishlistInteract',
      params: {
        idDefaultWishlist: wishlist._id,
      },
    });
  };

  return (
    <View style={styles.con}>
      {wishlists.length > 0 ? (
        wishlists.map((w) => <ProfileWishListItem onPress={onPress} key={w._id} wishlist={w} />)
      ) : (
        <EmptyWishlist />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  con: {
    width: responsiveScreenWidth(100),
    paddingHorizontal: sizes[20],
    paddingBottom: sizes[45],
    paddingTop: sizes[20],
  },
});
export default TabContentWishlist;
