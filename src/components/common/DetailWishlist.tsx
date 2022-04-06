import React from 'react';
import {StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/core';
import {sizes, useTheme} from '../../context/ThemeContext';
import {IWishlist} from '../../typings/IWishlist';
import VisibilityType, {useVisibilityByType} from '../../typings/VisibilityType';
import {getFontFamily} from '../../utils/getFontFamily';
import MyText from '../controls/MyText';
import BackgroundContent from './BackgroundContent';
import t from '../../utils/t';
import RowSelectedUser from './RowSelectedUser';
import {selectorsUser} from '../../redux/user/userReducer';

interface IDetailWishlistProps {
  wishlist: IWishlist;
}

const DetailWishlist = ({wishlist}: IDetailWishlistProps) => {
  const navigation = useNavigation();
  const visibility = useVisibilityByType(wishlist.visibility);
  const selectedUsers = useSelector(selectorsUser.getFriendsByIds(wishlist.showUsers ?? []));

  const navigateToAddUsers = () => {
    navigation.navigate('AdditionalNavigator', {
      screen: 'AddPeopleDetail',
      params: {
        wishlist,
      },
    });
  };

  return (
    <BackgroundContent style={{}}>
      <MyText style={styles.bold}>{t('wishlistFor')}:</MyText>
      <MyText style={styles.margin}>{wishlist.forWhom}</MyText>
      <MyText style={styles.bold}>{t('whoCanSee')} </MyText>
      <MyText style={styles.margin}>{visibility.label.title}</MyText>
      {visibility.value === VisibilityType.specific && (
        <RowSelectedUser onPress={navigateToAddUsers} users={selectedUsers} />
      )}
      {!!wishlist.note && (
        <React.Fragment>
          <MyText style={styles.bold}>{t('note')}</MyText>
          <MyText style={styles.margin}>{wishlist.note}</MyText>
        </React.Fragment>
      )}
      {/* {wishlist.address && (
        <React.Fragment>
          <MyText style={styles.bold}>{t('shippingAddress')}</MyText>
          <MyText
            style={{
              color: lightText,
              fontSize: sizes[12],
              marginBottom: sizes[10],
            }}>
            {t('helperAddressText')}
          </MyText>
          <MyText>{joinWithComma(wishlist.address)}</MyText>
        </React.Fragment>
      )} */}
    </BackgroundContent>
  );
};

const styles = StyleSheet.create({
  bold: {
    fontFamily: getFontFamily(700),
    marginBottom: sizes[4],
  },
  margin: {
    marginBottom: sizes[15],
  },
});

export default DetailWishlist;
