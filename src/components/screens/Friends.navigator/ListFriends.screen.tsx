import React from 'react';
import {FlatList, SafeAreaView, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {sizes} from '../../../context/ThemeContext';
import {selectorsUser} from '../../../redux/user/userReducer';
import {mapContactApp} from '../../../typings/IContact';
import {UserExtension} from '../../../typings/IUser';
import {heightTabBarRef} from '../../../utils/navigationRef';
import UserItem from '../../common/UserItem';
import {ListFriendsScreenProps} from '../../navigators/Friends.navigator';

const ListFriendsScreen = ({route}: ListFriendsScreenProps) => {
  const {friend} = route.params;

  const users = UserExtension.getFriends(friend).map(mapContactApp);

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <FlatList
        data={users}
        style={{
          flex: 1,
          padding: sizes[20],
        }}
        contentContainerStyle={{
          paddingBottom: heightTabBarRef.current,
        }}
        keyExtractor={(item) => item.id}
        renderItem={(info) => {
          const user = info.item;
          return (
            <UserItem
              style={styles.userItem}
              key={user.id}
              name={user.name}
              image={user.image}
              userId={user.id}
              user={user.user}
            />
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  userItem: {
    marginBottom: sizes[15],
  },
});

export default ListFriendsScreen;
