import React, {useMemo, useState} from 'react';
import {ListRenderItemInfo, Platform, StyleSheet, View} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import {useNavigation} from '@react-navigation/native';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import {useSelector} from 'react-redux';
import {sizes} from '../../context/ThemeContext';
import {getFontFamily} from '../../utils/getFontFamily';
import MyText from '../controls/MyText';
import LinkText, {TypeLinkText} from '../controls/LinkText';
import {ProfileScreenNavigationProp} from '../navigators/Main.navigator';
import GiftItem from '../Gift/GiftItem';
import IGift from '../../typings/IGift';
import EmptyFollowed from '../EmptyBlocks/EmptyFollowed';
import EmptyWillGifts from '../EmptyBlocks/EmptyWillGifts';
import {IWishlist} from '../../typings/IWishlist';
import {selectorsUser} from '../../redux/user/userReducer';
import ProfileWishListItem from '../WishlistItem/ProfileWishListItem';
import authService from '../../services/authService/authService';
import getIdObj from '../../utils/getIdObj';
import wishListService from '../../services/wishListService/wishListService';
import IPurchase from '../../typings/IPurchase';
import t from '../../utils/t';
import VisibilityType from '../../typings/VisibilityType';
import {StatusGift} from '../../typings/StatusGift';
import {isAndroid} from '../../utils/isPlatform';

interface ITabContentFollowedProps {}

const sliderWidth = responsiveScreenWidth(100);

const TabContentFollowed = ({}: ITabContentFollowedProps) => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const followedWishlist = useSelector(selectorsUser.getFollowedWishlist);
  const [isDisabled, setIsDisabled] = useState(false);
  const purchasesActive = useSelector(selectorsUser.getWillGivePurchasesActive) as IPurchase[];
  const purchasesArchive = useSelector(selectorsUser.getWillGivePurchasesArchived) as IPurchase[];
  const purchases = [...purchasesActive, ...purchasesArchive];
  const itemWidth = useMemo(() => {
    return responsiveScreenWidth(purchases.length === 1 ? 90 : 80);
  }, [purchases]);

  const navigateToGiftsScreen = () => {
    navigation.navigate('MainNavigator', {
      screen: 'InvisibleNavigator',
      params: {
        screen: 'Gifts',
      },
    });
  };

  const navigateToGift = async (purchase: IPurchase) => {
    if (isDisabled) {
      return;
    }
    setIsDisabled(true);
    navigation.navigate('InvisibleNavigator', {
      screen: 'WillGifts',
      params: {
        idGift: getIdObj(purchase.gift),
        status: purchase.status === 'gifted' ? StatusGift.archived : StatusGift.active,
      },
    });
    setIsDisabled(false);
  };

  const onPress = async (wishlist: IWishlist) => {
    const res = await authService.getUserById(getIdObj(wishlist.user));
    if (res.success) {
      navigation.navigate('MainNavigator', {
        screen: 'InvisibleNavigator',
        params: {
          screen: 'Wishlist',
          params: {
            defaultWishlist: wishlist,
            owner: res.data[0],
          },
        },
      });
    }
  };

  return (
    <View style={styles.con}>
      <View style={styles.viewTitle}>
        <MyText style={styles.title}>{t('itemsIWillGift')}</MyText>
        <LinkText type={TypeLinkText.accent} onPress={navigateToGiftsScreen}>
          {t('seeAll')}
        </LinkText>
      </View>
      {purchases.length > 0 ? (
        <Carousel
          data={purchases}
          contentContainerCustomStyle={[styles.contentContainerCustomStyle, {}]}
          containerCustomStyle={[styles.containerCustomStyle, {}]}
          slideStyle={[styles.slideStyle, {}]}
          activeSlideAlignment="start"
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          renderItem={(data: ListRenderItemInfo<IPurchase>) => {
            const gift = data.item.gift as IGift;

            return (
              <GiftItem
                width={itemWidth}
                isHorizontal={true}
                isDetail={false}
                isArchived={data.item.status === 'gifted'}
                gift={gift}
                onPress={() => navigateToGift(data.item)}
              />
            );
          }}
        />
      ) : (
        <EmptyWillGifts
          style={{
            marginTop: sizes[10],
            marginBottom: sizes[20],
          }}
        />
      )}
      <MyText
        style={[
          styles.title,
          {
            marginBottom: sizes[10],
          },
        ]}>
        {t('followedWishlists')}
      </MyText>
      {followedWishlist.length > 0 ? (
        followedWishlist.map((w) => {
          return (
            <ProfileWishListItem
              key={w._id}
              onPress={onPress}
              wishlist={w}
              isShare={w.visibility !== VisibilityType.private}
            />
          );
        })
      ) : (
        <EmptyFollowed />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  con: {
    width: responsiveScreenWidth(100),
    paddingTop: sizes[15],
    paddingBottom: sizes[45],
    paddingHorizontal: sizes[20],
  },
  title: {
    fontFamily: getFontFamily(500),
  },
  viewTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  contentContainerCustomStyle: {
    paddingVertical: sizes[50],
  },
  containerCustomStyle: {
    marginTop: -sizes[40],
    marginBottom: -sizes[30],
    marginHorizontal: -sizes[20],
  },
  slideStyle: {
    paddingLeft: sizes[20],
  },
});

export default TabContentFollowed;
