import React from 'react';
import {Image, Linking, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import IGift, {getImageByGift, isImageOfGift} from '../../typings/IGift';
import {colorWithOpacity, sizes, useTheme} from '../../context/ThemeContext';
import Icon from '../common/Icons';
import MyText from '../controls/MyText';
import {getFontFamily} from '../../utils/getFontFamily';
import Expander from '../common/Expander';
import {getSymbolCurrency} from '../../typings/TypeCurrency';
import {IWishlist} from '../../typings/IWishlist';
import DetailWishlist from '../common/DetailWishlist';
import {IUser, UserExtension} from '../../typings/IUser';
import t from '../../utils/t';
import {useSelector} from 'react-redux';
import {selectorsUser} from '../../redux/user/userReducer';
import VisibilityType from '../../typings/VisibilityType';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import {ImageBuild} from '../../utils/ImageBuild';
import TouchableOpacityGestureDelay from '../controls/TouchableOpacityGestureDelay';

interface IGiftFullItemProps {
  gift: IGift;
  styleCon?: StyleProp<ViewStyle>;
  wishlist?: IWishlist;
  owner?: IUser;
}

const GiftFullItem = ({gift, styleCon, wishlist, owner}: IGiftFullItemProps) => {
  const navigation = useNavigation<any>();
  const {backgroundDark, lightText, accent, background, border} = useTheme();
  const isFriend = useSelector(selectorsUser.checkFriend(owner?._id));

  const navigateToWishlist = () => {
    navigation.navigate('InvisibleNavigator', {
      screen: 'Wishlist',
      params: {
        defaultWishlist: wishlist,
        owner,
      },
    });
  };

  const navigateFriend = () => {
    navigation.push('MainNavigator', {
      screen: 'FriendsNavigator',
      params: {
        screen: 'FriendProfile',
        params: {
          friend: owner,
        },
      },
    });
  };

  const openWebsite = async (url: string) => {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      Linking.openURL(url);
    }
  };

  const statuses = isFriend ? [VisibilityType.private] : [VisibilityType.private, VisibilityType.protected];

  return (
    <View style={[styleCon, {paddingBottom: sizes[50], backgroundColor: background}]}>
      {owner && (
        <View style={styles.viewReceiver}>
          <TouchableOpacityGestureDelay
            onPress={navigateFriend}
            containerStyle={styles.conItemReceiver}
            style={styles.itemReceiver}>
            <Image
              resizeMode="cover"
              style={styles.imgAvatar}
              source={{
                uri: UserExtension.image(owner),
              }}
            />
            <MyText numberOfLines={1} style={[styles.title, styles.itemReceiverText]}>
              {UserExtension.fullName(owner)}
            </MyText>
          </TouchableOpacityGestureDelay>
          <View style={[styles.verticalLine, {borderLeftColor: lightText}]} />
          {wishlist && !statuses.some((s) => s === wishlist.visibility) && (
            <TouchableOpacityGestureDelay
              onPress={navigateToWishlist}
              containerStyle={styles.conItemReceiver}
              style={styles.itemReceiver}>
              <Icon name={wishlist.coverCode} size={sizes[25]} />
              <MyText numberOfLines={1} style={[styles.itemReceiverText]}>
                {wishlist.name}
              </MyText>
            </TouchableOpacityGestureDelay>
          )}
        </View>
      )}
      {isImageOfGift(gift) ? (
        <Image
          resizeMode="contain"
          style={styles.img}
          source={{
            uri: getImageByGift(gift),
          }}
        />
      ) : (
        <View
          style={[
            styles.img,
            {
              backgroundColor: colorWithOpacity(border, 0.1),
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}>
          <Icon name="BigPresentIcon" size={sizes[100]} />
        </View>
      )}
      <View style={[styles.viewCount, {backgroundColor: backgroundDark}]}>
        <View
          style={[
            styles.viewCenter,
            {
              marginRight: sizes[10],
            },
          ]}>
          <Icon name="QuantityIcon" size={sizes[10]} fill={lightText} />
          <MyText style={[styles.textCount, {color: lightText}]}>
            {t('desired')}: {gift.quantity}
          </MyText>
        </View>
        <View style={styles.viewCenter}>
          <Icon name="GiftIcon" size={sizes[10]} fill={lightText} />
          <MyText style={[styles.textCount, {color: lightText}]}>
            {t('willGift')}: {gift.quantity - gift.remaining}
          </MyText>
        </View>
      </View>
      <View style={styles.viewText}>
        <MyText style={styles.label}>{t('name')}:</MyText>
        <MyText numberOfLines={3} style={styles.title}>
          {gift.name}
        </MyText>
      </View>
      <View style={styles.viewText}>
        <MyText style={styles.label}>{t('website')}:</MyText>
        <MyText numberOfLines={2} onPress={() => openWebsite(gift.websiteLink)} style={[styles.title, {color: accent}]}>
          {gift.websiteLink}
        </MyText>
      </View>
      <View style={styles.viewText}>
        <MyText style={styles.label}>{t('price')}:</MyText>
        {gift?.price?.value && (
          <MyText style={styles.title}>{`${getSymbolCurrency(gift.price.currency)} ${gift.price.value}`}</MyText>
        )}
      </View>
      <View style={styles.viewText}>
        <MyText style={styles.label}>{t('quantity')}:</MyText>
        <MyText style={styles.title}> {gift.quantity}</MyText>
      </View>
      <View style={styles.viewText}>
        <MyText style={styles.label}>{t('size')}:</MyText>
        <MyText style={styles.title}>{gift.size}</MyText>
      </View>
      <View style={styles.viewText}>
        <MyText style={styles.label}>{t('color')}:</MyText>
        <MyText style={styles.title}>{gift.color}</MyText>
      </View>
      <View style={styles.viewText}>
        <MyText style={styles.label} numberOfLines={1}>
          {t('note')}:
        </MyText>
        <MyText style={styles.title}>{gift.note}</MyText>
      </View>
      {/* <Expander title={t('detailWishlist')}>
        <DetailWishlist wishlist={wishlist} />
      </Expander> */}
    </View>
  );
};

const imageBuilder = new ImageBuild({
  width: responsiveScreenWidth(100) - sizes[40],
});

const styles = StyleSheet.create({
  img: {
    borderRadius: sizes[4],
    width: '100%',
    height: imageBuilder.Height,
    marginBottom: sizes[4],
  },
  imgAvatar: {
    borderRadius: sizes[10],
    width: sizes[32],
    height: sizes[32],
  },
  viewReceiver: {
    marginBottom: sizes[15],
    flexDirection: 'row',
    alignItems: 'center',
  },
  conItemReceiver: {
    flexBasis: '50%',
  },
  itemReceiver: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemReceiverText: {
    marginLeft: sizes[10],
    maxWidth: '70%',
  },
  verticalLine: {
    borderLeftWidth: 1,
    height: '100%',
    paddingRight: sizes[10],
  },
  viewCount: {
    borderRadius: sizes[4],
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: sizes[10],
    marginBottom: sizes[25],
  },
  viewCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textCount: {
    fontSize: sizes[12],
    marginLeft: sizes[8],
  },
  title: {
    fontFamily: getFontFamily(500),
  },
  viewText: {
    marginBottom: sizes[16],
    flexDirection: 'row',
    width: '70%',
  },
  label: {
    width: '40%',
  },
  extraInfo: {
    padding: sizes[20],
    borderRadius: sizes[4],
  },
  bold: {
    fontFamily: getFontFamily(700),
    marginBottom: sizes[4],
  },
});

export default GiftFullItem;
