import React, {useMemo, useState} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import Avatar from './Avatar';
import {sizes, useTheme} from '../../context/ThemeContext';
import {getFontFamily} from '../../utils/getFontFamily';
import MyText from '../controls/MyText';
import MyButton from '../controls/MyButton';
import IBio from '../../typings/IBio';
import t from '../../utils/t';
import LinkText, {TypeLinkText} from '../controls/LinkText';
import ImageUser from './ImageUser';
import TouchableOpacityDelay from '../controls/TouchableOpacityDelay';

interface IProfileBlockProps {
  conStyle?: StyleProp<ViewStyle>;
  fullName: string | null;
  wishList: number;
  gifts: number;
  friends: number;
  avatar?: string | null;
  bio?: Partial<IBio>;
  leftExtraBtn?: any;
  extraBtn: any;
  onFriendsPress?: any;
  onPressWishlist?: any;
}

const ProfileBlock = ({
  avatar,
  conStyle,
  gifts,
  friends,
  wishList,
  fullName,
  bio,
  onFriendsPress,
  onPressWishlist,
  extraBtn: ExtraBtn,
  leftExtraBtn: LeftExtraBtn,
}: IProfileBlockProps) => {
  const keys = useMemo(() => {
    return {
      birthday: t('birthday'),
      location: t('location'),
      hobbies: t('hobbies'),
      gender: t('gender'),
      height: t('height'),
      maritalStatus: t('maritalStatus'),
      weight: t('weight'),
      size: t('sizeClothes'),
      shoesSize: t('shoeSize'),
    } as IBio;
  }, []);
  const {lightText, background} = useTheme();
  const [isMore, setIsMore] = useState(false);

  const handleToggle = () => {
    setIsMore((t) => !t);
  };

  const filterBio = Object.entries(keys)
    .filter(([key]) => !!(bio as any)[key])
    .filter((_, i) => isMore || i < 3);

  return (
    <View style={[styles.con, {backgroundColor: background}, conStyle]}>
      <View style={styles.view}>
        <ImageUser size={sizes[56]} image={avatar} />
        <View style={[styles.view, styles.infoView]}>
          <TouchableOpacityDelay onPress={onPressWishlist} style={styles.item}>
            <MyText style={styles.boldText}>{wishList}</MyText>
            <MyText>{t('wishlists')}</MyText>
          </TouchableOpacityDelay>
          <View style={styles.item}>
            <MyText style={styles.boldText}>{gifts}</MyText>
            <MyText>{t('gifts')}</MyText>
          </View>
          <TouchableOpacityDelay onPress={onFriendsPress} style={styles.item}>
            <MyText style={styles.boldText}>{friends}</MyText>
            <MyText>{t('friends')}</MyText>
          </TouchableOpacityDelay>
        </View>
      </View>
      <MyText style={[styles.title, styles.boldText]}>{fullName}</MyText>
      {bio && (
        <View style={styles.bioView}>
          {filterBio.map(([key, value], index) => {
            if (filterBio.length > 2 && index === filterBio.length - 1) {
              return (
                <View
                  key={key}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    maxWidth: '80%',
                  }}>
                  <MyText
                    numberOfLines={isMore ? undefined : 1}
                    key={key}
                    style={[
                      styles.lightText,
                      {
                        color: lightText,
                      },
                    ]}>
                    {value}: <MyText style={[styles.innerText]}>{(bio as any)[key]}</MyText>
                  </MyText>
                  <LinkText
                    style={{
                      fontSize: sizes[14],
                      top: 2,
                      marginLeft: sizes[5],
                    }}
                    onPress={handleToggle}
                    type={TypeLinkText.accent}>
                    {isMore ? t('seeLess') : t('seeMore')}
                  </LinkText>
                </View>
              );
            }
            return (
              <MyText
                numberOfLines={isMore ? undefined : 1}
                key={key}
                style={[
                  styles.lightText,
                  {
                    color: lightText,
                  },
                ]}>
                {value}: <MyText style={[styles.innerText]}>{(bio as any)[key]}</MyText>
              </MyText>
            );
          })}
        </View>
      )}
      <View style={[styles.view, styles.viewBtn]}>
        {LeftExtraBtn && <LeftExtraBtn containerStyle={styles.btn} />}
        <ExtraBtn containerStyle={styles.btn} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  con: {},
  view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  boldText: {
    fontFamily: getFontFamily(500),
    fontSize: sizes[16],
  },
  lightText: {
    fontFamily: getFontFamily(300),
    marginTop: sizes[5],
  },
  innerText: {
    marginLeft: sizes[5],
  },
  item: {
    alignItems: 'center',
  },
  infoView: {
    flexGrow: 1,
    maxWidth: responsiveScreenWidth(56),
  },
  title: {
    marginTop: sizes[10],
    marginBottom: sizes[5],
  },
  bioView: {
    marginBottom: sizes[10],
  },
  viewBtn: {
    marginHorizontal: -sizes[9],
  },
  btn: {
    flexGrow: 1,
    marginHorizontal: sizes[9],
  },
});
export default ProfileBlock;
