import {useFocusEffect} from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Image, FlatList} from 'react-native';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import {useDispatch, useSelector} from 'react-redux';
import {sizes, useTheme} from '../../../context/ThemeContext';
import {actionsOther, selectorsOther} from '../../../redux/other/otherReducer';
import {selectorsUser} from '../../../redux/user/userReducer';
import wishListService from '../../../services/wishListService/wishListService';
import {UserExtension} from '../../../typings/IUser';
import TypeView from '../../../typings/TypeView';
import {getFontFamily} from '../../../utils/getFontFamily';
import getIdObj from '../../../utils/getIdObj';
import {heightTabBarRef} from '../../../utils/navigationRef';
import t from '../../../utils/t';
import Icon from '../../common/Icons';
import IconButton from '../../controls/IconButton';
import LinkText, {TypeLinkText} from '../../controls/LinkText';
import MyText from '../../controls/MyText';
import TouchableOpacityGestureDelay from '../../controls/TouchableOpacityGestureDelay';
import GiftItem from '../../Gift/GiftItem';
import {WishlistScreenProps} from '../../navigators/Invisible.navigator';
import ImageUser from '../../Profile/ImageUser';

interface IHeaderRightProps {
  onPress: any;
  defaultValue: TypeView;
}

const HeaderRight = ({onPress, defaultValue}: IHeaderRightProps) => {
  const {text} = useTheme();
  const [typeView, setTypeView] = useState(defaultValue);
  const isGridView = typeView === TypeView.grid;

  const handleChangeView = () => {
    onPress();
    setTypeView((type) => {
      return type === TypeView.grid ? TypeView.list : TypeView.grid;
    });
  };

  return (
    <IconButton
      onPress={handleChangeView}
      icon={{
        name: isGridView ? 'ViewListIcon' : 'ViewGridIcon',
        fill: text,
        size: sizes[16],
      }}
    />
  );
};

const WishlistScreen = ({navigation, route}: WishlistScreenProps) => {
  const dispatch = useDispatch();
  const {defaultWishlist, owner} = route.params;
  const {lightText} = useTheme();
  const [wishlist, setWishlist] = useState(defaultWishlist);
  const {gifts} = wishlist;
  const defaultTypeView = useSelector(selectorsOther.getTypeView('WishlistScreen'));
  const [typeView, setTypeView] = useState(defaultTypeView);
  const isGridView = typeView === TypeView.grid;
  const userId = useSelector(selectorsUser.getUserId);

  const isFollow = wishlist.followers.some((f) => getIdObj(f) === userId);

  const handleChangeView = () => {
    setTypeView((type) => {
      const newType = type === TypeView.grid ? TypeView.list : TypeView.grid;

      dispatch(
        actionsOther.setTypeView({
          name: 'WishlistScreen',
          type: newType,
        }),
      );
      return newType;
    });
  };

  const handlePress = (idGift: string) => {
    navigation.navigate('AdditionalNavigator', {
      screen: 'Gift',
      params: {
        idGift,
        currentWishlist: wishlist,
        owner,
      },
    });
  };

  const navigateFriend = () => {
    //navigation.goBack();
    navigation.navigate('FriendsNavigator', {
      screen: 'FriendProfile',
      params: {
        friend: owner,
      },
    });
    /* navigation.push('MainNavigator', {
      screen: 'FriendsNavigator',
      params: {
        screen: 'FriendProfile',
        params: {
          friend: owner,
        },
      },
    }); */
  };

  const follow = async () => {
    const res = isFollow ? await wishListService.unFollow(wishlist._id) : await wishListService.follow(wishlist._id);

    const followers = res.data?.followers.map((f) => {
      if (typeof f === 'string') {
        return {_id: f};
      }
      return f;
    });

    setWishlist((d) => {
      return {...d, followers};
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      wishListService.getWishlistById(wishlist._id).then((res) => {
        if (res.success) {
          setWishlist(res.data);
        }
      });
    }, []),
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return <HeaderRight onPress={handleChangeView} defaultValue={typeView} />;
      },
    });
  }, []);

  const numColumns = isGridView ? 2 : 1;
  const heightItem = isGridView ? sizes[190] : sizes[105];

  const sortedGifts = [...gifts].sort((a, b) => {
    if (b.remaining === 0) {
      return -1;
    }
    return b.remaining - a.remaining;
  });
  return (
    <View style={styles.con}>
      <View
        style={[
          styles.viewReceiver,
          {
            borderBottomColor: lightText,
          },
        ]}>
        <TouchableOpacityGestureDelay
          onPress={navigateFriend}
          containerStyle={styles.conItemReceiver}
          style={styles.itemReceiver}>
          <ImageUser size={sizes[32]} image={UserExtension.image(owner)} />

          <MyText numberOfLines={1} style={[styles.title, styles.itemReceiverText]}>
            {UserExtension.fullName(owner)}
          </MyText>
        </TouchableOpacityGestureDelay>
        <View style={[styles.verticalLine, {borderLeftColor: lightText}]} />
        <TouchableOpacityGestureDelay
          onPress={follow}
          containerStyle={styles.conItemReceiver}
          style={styles.itemReceiver}>
          <Icon name={wishlist.coverCode} size={sizes[25]} />
          <View style={styles.itemReceiverText}>
            <MyText numberOfLines={1}>{wishlist.name}</MyText>
            <LinkText type={!isFollow ? TypeLinkText.accent : TypeLinkText.text}>
              {isFollow ? t('unfollow') : t('follow')}
            </LinkText>
          </View>
        </TouchableOpacityGestureDelay>
      </View>
      <FlatList
        key={typeView.toString()}
        keyExtractor={(item) => item._id}
        numColumns={numColumns}
        columnWrapperStyle={
          isGridView
            ? {
                marginHorizontal: -sizes[4],
                maxWidth: responsiveScreenWidth(100 / numColumns) - sizes[24],
              }
            : undefined
        }
        contentContainerStyle={{
          paddingTop: sizes[10],
          paddingHorizontal: sizes[20],
          paddingBottom: heightTabBarRef.current,
        }}
        style={{
          flexGrow: 1,
        }}
        renderItem={(data) => (
          <GiftItem
            key={data.item._id}
            wrapperStyle={{
              marginHorizontal: isGridView ? sizes[4] : 0,
              marginVertical: sizes[5],
            }}
            conStyle={{
              height: heightItem,
            }}
            isDetail={true}
            isArchived={data.item.remaining === 0}
            gift={data.item}
            isHorizontal={!isGridView}
            onPress={() => handlePress(data.item._id)}
          />
        )}
        data={sortedGifts}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  con: {
    flex: 1,
  },
  viewReceiver: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingVertical: sizes[15],
    marginHorizontal: sizes[20],
  },
  conItemReceiver: {
    flexBasis: '50%',
  },
  itemReceiver: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemReceiverText: {
    marginLeft: sizes[10],
    maxWidth: '70%',
  },
  verticalLine: {
    borderLeftWidth: 1,
    height: '100%',
    paddingRight: sizes[10],
  },
  title: {
    fontFamily: getFontFamily(500),
  },
});
export default WishlistScreen;
