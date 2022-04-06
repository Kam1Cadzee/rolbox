import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/core';
import {useSelector} from 'react-redux';
import WishListItem from './WishListItem.dumb';
import LinkText, {TypeLinkText} from '../controls/LinkText';
import {sizes} from '../../context/ThemeContext';
import {IWishlist} from '../../typings/IWishlist';
import {IUser} from '../../typings/IUser';
import wishListService from '../../services/wishListService/wishListService';
import {selectorsUser} from '../../redux/user/userReducer';
import getIdObj from '../../utils/getIdObj';
import useDidUpdateEffect from '../../useHooks/useDidUpdateEffect';
import t from '../../utils/t';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';

interface IFriendWishListItemProps {
  wishlist: IWishlist;
  owner: IUser;
}

const FriendWishListItem = ({wishlist, owner}: IFriendWishListItemProps) => {
  const navigation = useNavigation<any>();
  const userId = useSelector(selectorsUser.getUserId);

  const [data, setData] = useState(wishlist);
  const navigateWishlist = () => {
    navigation.navigate('MainNavigator', {
      screen: 'InvisibleNavigator',
      params: {
        screen: 'Wishlist',
        params: {
          defaultWishlist: wishlist,
          owner,
        },
      },
    });
  };
  const isFollow = data.followers.some((f) => getIdObj(f) === userId);

  const follow = async () => {
    const res = isFollow ? await wishListService.unFollow(wishlist._id) : await wishListService.follow(wishlist._id);
    const followers = res.data?.followers;

    setData((d) => {
      return {...d, followers};
    });
  };

  useDidUpdateEffect(() => {
    setData(wishlist);
  }, [wishlist]);

  return (
    <WishListItem
      onPress={navigateWishlist}
      type={wishlist.coverCode}
      title={wishlist.name}
      styleCon={{
        marginBottom: sizes[10],
      }}
      styleTitle={{
        maxWidth: responsiveScreenWidth(38),
      }}
      extraBtn={
        <LinkText onPress={follow} type={!isFollow ? TypeLinkText.accent : TypeLinkText.text}>
          {isFollow ? t('unfollow') : t('follow')}
        </LinkText>
      }
    />
  );
};

export default FriendWishListItem;
