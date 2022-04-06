import React from 'react';
import {StyleSheet, Image, View, StyleProp, ViewStyle} from 'react-native';
import {colorWithOpacity, sizes, useTheme} from '../../context/ThemeContext';
import IGift, {getImageByGift} from '../../typings/IGift';
import MyText from '../controls/MyText';
import ShadowWrapper from '../common/ShadowWrapper';
import {getFontFamily} from '../../utils/getFontFamily';
import Icon from '../common/Icons';
import {getSymbolCurrency} from '../../typings/TypeCurrency';
import {IUser, UserExtension} from '../../typings/IUser';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import {normalizeBigNumber} from '../../utils/normalizeData';
import {ImageBuild} from '../../utils/ImageBuild';
import TouchableOpacityGestureDelay from '../controls/TouchableOpacityGestureDelay';

interface IGiftProps {
  gift: IGift;
  onPress?: any;
  isDetail: boolean;
  isArchived: boolean;
  isHorizontal: boolean;
  width?: number;
  conStyle?: StyleProp<ViewStyle>;
  wrapperStyle?: StyleProp<ViewStyle>;
}

const GiftItem = ({
  gift,
  isHorizontal = false,
  isArchived,
  isDetail,
  width,
  onPress,
  conStyle,
  wrapperStyle,
}: IGiftProps) => {
  const {background, border, lightText} = useTheme();
  const user = gift.user as IUser;

  const style = width
    ? {
        width,
      }
    : {
        width: '100%',
      };
  const styleText = width
    ? {
        width: isHorizontal ? width * 0.46 : '100%',
      }
    : {
        width: '100%',
      };

  return (
    <ShadowWrapper
      style={[
        {
          maxWidth: '100%',
        },
        wrapperStyle,
        isArchived ? {} : styles.shadow,
      ]}>
      <TouchableOpacityGestureDelay
        onPress={onPress}
        activeOpacity={0.8}
        containerStyle={[style, {}]}
        style={[styles.con, {backgroundColor: background, flexDirection: isHorizontal ? 'row' : 'column'}, conStyle]}>
        {isArchived && (
          <View
            style={[
              styles.isArchived,
              {
                backgroundColor: colorWithOpacity(border, 0.5),
              },
            ]}
          />
        )}
        {gift.images && gift.images.length > 0 ? (
          <Image
            fadeDuration={0}
            resizeMode="contain"
            style={[styles.imgGift, isHorizontal ? styles.imgGiftH : styles.imgGiftV]}
            source={{
              uri: getImageByGift(gift),
            }}
          />
        ) : (
          <View
            style={[
              styles.imgGift,
              isHorizontal ? styles.imgGiftH : styles.imgGiftV,
              {
                backgroundColor: colorWithOpacity(border, 0.1),
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}>
            <Icon name="BigPresentIcon" size={sizes[70]} />
          </View>
        )}
        <View style={[styles.content, isHorizontal ? styles.contentH : styles.contentV]}>
          <MyText style={[styles.title, styleText]} numberOfLines={2}>
            {gift.name}
          </MyText>
          {isDetail ? (
            <View style={[styles.detailView]}>
              <MyText style={styles.price}>
                {gift?.price?.value
                  ? `${getSymbolCurrency(gift.price.currency)}${normalizeBigNumber(+gift.price.value)}`
                  : ''}
              </MyText>
              <View style={styles.detailView}>
                <View style={styles.iconView}>
                  <Icon name="QuantityIcon" size={sizes[9]} fill={lightText} />
                  <MyText style={[styles.iconText, {color: lightText}]}>{normalizeBigNumber(gift.quantity)}</MyText>
                </View>
                <View style={styles.iconView}>
                  <Icon name="GiftIcon" size={sizes[9]} fill={lightText} />
                  <MyText style={[styles.iconText, {color: lightText}]}>
                    {normalizeBigNumber(gift.quantity - gift.remaining)}
                  </MyText>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.viewAvatar}>
              <Image
                style={styles.avatar}
                source={{
                  uri: UserExtension.image(user),
                }}
              />
              <MyText numberOfLines={2} style={styles.textName}>
                {UserExtension.fullName(user)}
              </MyText>
            </View>
          )}
        </View>
      </TouchableOpacityGestureDelay>
    </ShadowWrapper>
  );
};

const imageBuilder = new ImageBuild({
  width: sizes[114],
});

const imageBuilderV = new ImageBuild({
  width: responsiveScreenWidth(50) - sizes[45],
});

const styles = StyleSheet.create({
  con: {
    borderRadius: sizes[4],
    padding: sizes[10],
    flexGrow: 1,
    overflow: 'hidden',
  },
  content: {
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  contentH: {
    paddingTop: sizes[6],
    paddingBottom: sizes[6],
    marginLeft: sizes[23],
    flexGrow: 1,
  },
  contentV: {
    paddingTop: sizes[10],
    paddingBottom: 0,
    marginLeft: 0,
  },
  shadow: {
    shadowColor: 'rgb(141, 155, 167)',
    shadowOffset: {
      width: 0,
      height: sizes[16],
    },
    shadowOpacity: 0.15,
    shadowRadius: sizes[20],
  },
  textName: {
    fontSize: sizes[10],
    marginLeft: sizes[8],
    maxWidth: responsiveScreenWidth(40),
  },
  imgGift: {
    borderRadius: sizes[4],
  },
  imgGiftH: {
    height: imageBuilder.Height,
    width: imageBuilder.Width,
  },
  imgGiftV: {
    height: imageBuilderV.Height,
    width: imageBuilderV.Width,
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
  isArchived: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    borderRadius: sizes[4],
  },
  title: {
    fontFamily: getFontFamily(500),
    maxWidth: responsiveScreenWidth(46),
  },
  price: {
    fontSize: sizes[14],
  },
  detailView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconText: {
    fontSize: sizes[10],
    marginLeft: sizes[5],
  },
  iconView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: sizes[6],
  },
});

export default GiftItem;
