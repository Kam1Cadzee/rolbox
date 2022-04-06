import React from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {StyleSheet} from 'react-native';
import FriendsRequests from './FriendsRequests';
import {sizes} from '../../context/ThemeContext';
import UserItem from './UserItem';
import {IUser, UserExtension} from '../../typings/IUser';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';
import {heightTabBarRef} from '../../utils/navigationRef';

interface IFriendsListProps {
  friendsRequests: IUser[];
  friends: IUser[];
  search: string;
}

const FriendsList = ({friendsRequests, friends, search}: IFriendsListProps) => {
  const filterFriends = friends.filter(
    (f) => UserExtension.fullName(f).toLowerCase().indexOf(search.toLowerCase()) !== -1,
  );

  return (
    <ScrollView
      style={styles.style}
      contentContainerStyle={[
        styles.contentContainerStyle,
        {
          paddingBottom: heightTabBarRef.current,
        },
      ]}
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={false}
      bounces={true}>
      {friendsRequests.length > 0 && (
        <FriendsRequests
          styleCon={{
            marginHorizontal: -sizes[20],
            marginBottom: sizes[20],
          }}
          friends={friendsRequests}
        />
      )}
      {filterFriends.map((u) => {
        return (
          <UserItem
            style={{
              marginBottom: sizes[15],
            }}
            key={u._id}
            userId={u._id}
            name={UserExtension.fullName(u)}
            image={UserExtension.image(u)}
          />
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  style: {marginHorizontal: -sizes[20], flex: 1},
  contentContainerStyle: {
    paddingHorizontal: sizes[20],
  },
});
export default FriendsList;
