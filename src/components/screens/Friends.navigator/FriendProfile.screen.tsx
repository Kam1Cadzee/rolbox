import React, {useCallback, useEffect, useState} from 'react';
import {Platform, ScrollView, SafeAreaView, RefreshControl, StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/core';
import {FriendProfileScreenProps} from '../../navigators/Friends.navigator';
import {sizes, useTheme} from '../../../context/ThemeContext';
import ShadowWrapper from '../../common/ShadowWrapper';
import FriendProfileBlock from '../../Profile/FriendProfileBlock';
import FriendWishListItem from '../../WishlistItem/FriendWishListItem';
import authService from '../../../services/authService/authService';
import {selectorsUser} from '../../../redux/user/userReducer';
import VisibilityType from '../../../typings/VisibilityType';
import RelationStatus from '../../../typings/IRelationStatus';

const FriendProfileScreen = ({route, navigation}: FriendProfileScreenProps) => {
  const dispatch = useDispatch();
  const {friend} = route.params;
  const isFocus = useIsFocused();
  const {secondary} = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const myId = useSelector(selectorsUser.getUserId);
  const [user, setUser] = useState(friend);
  const statusFriend = useSelector(selectorsUser.getStatusFriend(user._id));
  const followedWishlist = useSelector(selectorsUser.getFollowedWishlist);

  const wishlists = user.ownedWishlists ?? [];
  const {background} = useTheme();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await executeRefreshFriend();

    setRefreshing(false);
  }, [friend]);

  const executeRefreshFriend = async () => {
    const res = await authService.getUserById(friend._id);
    if (res.success) {
      setUser(res.data[0]);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      title: `${friend.firstName} ${friend.lastName ?? ''}`,
    });
    setUser(friend);
    executeRefreshFriend();
  }, [isFocus]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            tintColor={secondary}
            progressBackgroundColor={secondary}
            colors={['white']}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        contentContainerStyle={{
          paddingBottom: sizes[50],
          flexGrow: 1,
        }}
        style={{
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        bounces={true}>
        <ShadowWrapper style={styles.shadow}>
          <View style={[styles.top, {backgroundColor: background}]}>
            <FriendProfileBlock friend={user} />
          </View>
        </ShadowWrapper>
        <View style={styles.list}>
          {wishlists
            .filter((w) => {
              if (w.visibility === VisibilityType.protected && statusFriend === RelationStatus.friends) {
                return true;
              } else if (w.visibility === VisibilityType.public) {
                return true;
              } else if (w.visibility === VisibilityType.private) {
                return followedWishlist.some((fw) => w._id === fw._id);
              } else if (w.visibility === VisibilityType.specific) {
                return (w.showUsers ?? []).some((id) => id === myId);
              }

              return false;
            })
            .map((w) => (
              <FriendWishListItem key={w._id} owner={user} wishlist={w} />
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  svg: {},
  text: {
    fontSize: sizes[16],
    marginRight: sizes[10],
  },
  btnProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 0 : sizes[15],
  },
  top: {
    paddingHorizontal: sizes[20],
  },
  shadow: {
    shadowColor: 'rgb(141, 155, 167)',
    shadowOffset: {
      width: 0,
      height: sizes[26],
    },
    shadowOpacity: 0.1,
    shadowRadius: sizes[24],
  },
  list: {
    paddingHorizontal: sizes[20],
    paddingTop: sizes[15],
  },
});

export default FriendProfileScreen;
