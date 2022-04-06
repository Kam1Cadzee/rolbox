import React, {useState} from 'react';
import {Image, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/core';
import BackgroundContent from './BackgroundContent';
import {sizes} from '../../context/ThemeContext';
import {getFontFamily} from '../../utils/getFontFamily';
import MyText from '../controls/MyText';
import MyButton, {TypeButton} from '../controls/MyButton';
import {IUser, UserExtension} from '../../typings/IUser';
import friendService from '../../services/friendService/friendService';
import {actionsUser} from '../../redux/user/userReducer';
import authService from '../../services/authService/authService';
import t from '../../utils/t';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import ImageUser from '../Profile/ImageUser';
import TouchableOpacityGestureDelay from '../controls/TouchableOpacityGestureDelay';

interface IFriendsRequestsProps {
  friends: IUser[];
  styleCon?: StyleProp<ViewStyle>;
}

const height = sizes[50];
const maxHeight = height * 3;

const FriendsRequests = ({styleCon, friends}: IFriendsRequestsProps) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleAcceptFriend = async (id: string) => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    const res = await friendService.accept(id);

    if (res.success) {
      dispatch(actionsUser.moveToFriend(id));
    }
    setIsLoading(false);
  };

  const handleDeclineFriend = async (id: string) => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    const res = await friendService.reject(id);
    if (res.success) {
      dispatch(actionsUser.declineFriend(id));
    }
    setIsLoading(false);
  };

  const navigateFriendProfile = async (id: string) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    const res = await authService.getUserById(id);

    if (res.success) {
      navigation.navigate('FriendProfile', {
        friend: res.data[0]!,
      });
    }
    setIsLoading(false);
  };

  return (
    <BackgroundContent style={styleCon}>
      <MyText numberOfLines={1} style={styles.title}>
        {t('friendsRequests')}:
      </MyText>
      <ScrollView
        snapToInterval={maxHeight}
        style={{
          maxHeight,
        }}
        contentContainerStyle={{}}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        {friends.map((item) => {
          return (
            <View style={styles.item} key={item._id}>
              <TouchableOpacityGestureDelay onPress={() => navigateFriendProfile(item._id)} style={styles.view}>
                <ImageUser size={sizes[32]} image={UserExtension.image(item)} />
                <MyText numberOfLines={2} style={styles.name}>
                  {UserExtension.fullName(item)}
                </MyText>
              </TouchableOpacityGestureDelay>
              <View
                style={[
                  styles.view,
                  {
                    maxWidth: '50%',
                  },
                ]}>
                <MyButton
                  disabled={isLoading}
                  onPress={() => handleAcceptFriend(item._id)}
                  containerStyle={{
                    flexGrow: 1,
                  }}
                  style={styles.btn}
                  type={TypeButton.fog}>
                  {t('accept')}
                </MyButton>
                <MyButton
                  disabled={isLoading}
                  onPress={() => handleDeclineFriend(item._id)}
                  containerStyle={{
                    flexGrow: 1,
                  }}
                  style={[styles.offset, styles.btn]}
                  type={TypeButton.ghost}>
                  {t('decline')}
                </MyButton>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </BackgroundContent>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height,
  },
  view: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    maxWidth: responsiveScreenWidth(30),
    marginLeft: sizes[10],
  },
  offset: {
    marginLeft: sizes[10],
  },
  title: {
    fontFamily: getFontFamily(500),
    marginBottom: sizes[15],
  },
  btn: {
    paddingHorizontal: sizes[2],
    paddingVertical: sizes[6],
  },
});
export default FriendsRequests;
