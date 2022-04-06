import {StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import React from 'react';
import ProfileBlock from './ProfileBlock.dumb';
import {selectorsUser} from '../../redux/user/userReducer';
import MyButton, {TypeButton} from '../controls/MyButton';
import {sizes} from '../../context/ThemeContext';
import {ProfileScreenNavigationProp} from '../navigators/Main.navigator';
import useFormatBio from '../../useHooks/useFormatBio';
import t from '../../utils/t';

interface IMyProfileBlockProps {
  onPressWishlist: any;
}

const MyProfileBlock = ({onPressWishlist}: IMyProfileBlockProps) => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const user = useSelector(selectorsUser.getUser)!;
  const firstName = useSelector(selectorsUser.getFirstName);
  const lastName = useSelector(selectorsUser.getLastName);
  const wishList = useSelector(selectorsUser.getCountWishlists);
  const gifts = useSelector(selectorsUser.getCountGifts);
  const bio = useFormatBio(user);
  const avatar = useSelector(selectorsUser.getUrlImg);
  const countFriends = useSelector(selectorsUser.getCountFriends);

  const handleGoEditProfileScreen = () => {
    navigation.navigate('AdditionalNavigator', {
      screen: 'EditProfile',
    });
  };

  const onFriendsPress = () => {
    navigation.navigate('MainNavigator', {
      screen: 'FriendsNavigator',
      params: {
        screen: 'Friends',
      },
    });
  };
  return (
    <ProfileBlock
      onPressWishlist={onPressWishlist}
      conStyle={styles.con}
      fullName={`${firstName} ${lastName}`}
      wishList={wishList}
      gifts={gifts}
      onFriendsPress={onFriendsPress}
      friends={countFriends}
      extraBtn={(props: any) => (
        <MyButton onPress={handleGoEditProfileScreen} type={TypeButton.fog} {...props}>
          {t('editProfile')}
        </MyButton>
      )}
      avatar={avatar}
      bio={bio}
    />
  );
};

const styles = StyleSheet.create({
  con: {
    paddingBottom: sizes[17],
  },
});
export default MyProfileBlock;
