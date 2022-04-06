import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import {sizes, useTheme} from '../../context/ThemeContext';
import {IUser, UserExtension} from '../../typings/IUser';
import {getFontFamily} from '../../utils/getFontFamily';
import t from '../../utils/t';
import MyText from '../controls/MyText';
import TouchableOpacityGestureDelay from '../controls/TouchableOpacityGestureDelay';
import ImageUser from '../Profile/ImageUser';
import Icon from './Icons';

interface IRowSelectedUserProps {
  users: IUser[];
  onPress: () => any;
  styleCon?: StyleProp<ViewStyle>;
}

const sizeSquare = sizes[44];
const maxGuestForScreen = Math.floor(responsiveScreenWidth(90) / sizeSquare);

const RowSelectedUser = ({users, styleCon, onPress}: IRowSelectedUserProps) => {
  const {accent, background} = useTheme();

  return (
    <View style={[styles.viewGuests, styleCon]}>
      <MyText>{t('guests')}</MyText>
      <View style={styles.viewGuests2}>
        {users
          .filter((_, i) => maxGuestForScreen > i)
          .map((g, i) => {
            return (
              <ImageUser
                key={g._id}
                style={[
                  styles.imageUser,
                  {
                    left: (i * sizeSquare) / 2,

                    borderColor: background,
                  },
                ]}
                image={UserExtension.image(g)}
                size={sizeSquare}
              />
            );
          })}
        {users.length - maxGuestForScreen > 0 && (
          <View
            style={[
              styles.itemGuest,
              {
                top: 0,
                left: (maxGuestForScreen * sizeSquare) / 2,

                borderWidth: 2,
                borderColor: background,
              },
            ]}>
            <MyText style={styles.lessGuestsText}>+{users.length - maxGuestForScreen}</MyText>
          </View>
        )}
        <TouchableOpacityGestureDelay
          onPress={onPress}
          containerStyle={{
            zIndex: 10,
            right: users.length !== 0 ? 0 : undefined,
            position: 'absolute',
          }}
          style={styles.itemGuest}>
          <Icon fill={accent} name={users.length === 0 ? 'AddGuestIcon' : 'PlusIcon'} size={sizeSquare / 3} />
        </TouchableOpacityGestureDelay>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  lessGuestsText: {
    fontFamily: getFontFamily(500),
    fontSize: sizes[12],
  },
  itemGuest: {
    width: sizeSquare,
    height: sizeSquare,
    borderRadius: sizeSquare / 3,
    backgroundColor: '#E1EFF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewSecret: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewGuests: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: sizes[20],
  },
  viewGuests2: {
    flexGrow: 1,
    marginLeft: sizes[20],
    height: sizeSquare,
  },

  imageUser: {
    top: 0,
    position: 'absolute',
    borderWidth: 2,
  },
});

export default RowSelectedUser;
