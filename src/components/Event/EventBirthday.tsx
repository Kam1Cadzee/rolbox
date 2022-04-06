import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle, Image} from 'react-native';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import {sizes} from '../../context/ThemeContext';
import {IUser, UserExtension} from '../../typings/IUser';
import {getFontFamily} from '../../utils/getFontFamily';
import STYLES, {WIDTH_EVENT_PANEL} from '../../utils/STYLES';
import t from '../../utils/t';
import MyText from '../controls/MyText';
import TouchableOpacityDelay from '../controls/TouchableOpacityDelay';
import ImageUser from '../Profile/ImageUser';
import EventInfoDate from './EventInfoDate';

interface IEventBirthdayProps {
  conStyle?: StyleProp<ViewStyle>;
  user: IUser;
  date: Date;
}

const EventBirthday = ({user, conStyle, date}: IEventBirthdayProps) => {
  const navigation = useNavigation<any>();

  const navigateToUser = () => {
    navigation.navigate('AdditionalNavigator', {
      screen: 'FriendProfile',
      params: {
        friend: user,
      },
    });
  };

  return (
    <View style={[styles.con, conStyle]}>
      <EventInfoDate textTime={t('dayBirthday')} date={date} />
      <TouchableOpacityDelay
        onPress={navigateToUser}
        style={[STYLES.eventBlock, {backgroundColor: '#EBF3FA', width: WIDTH_EVENT_PANEL}]}>
        <ImageUser style={styles.avatar} size={sizes[24]} image={UserExtension.image(user)} />
        <MyText numberOfLines={2} style={styles.name}>
          {UserExtension.fullName(user)}
        </MyText>
      </TouchableOpacityDelay>
    </View>
  );
};

const styles = StyleSheet.create({
  con: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    marginRight: sizes[12],
  },
  name: {
    fontFamily: getFontFamily(500),
    fontSize: sizes[16],
    width: responsiveScreenWidth(50),
  },
});
export default EventBirthday;
