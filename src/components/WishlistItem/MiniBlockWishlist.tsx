import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {sizes, useTheme} from '../../context/ThemeContext';
import {actionsEvent} from '../../redux/event/eventReducer';
import {selectorsUser} from '../../redux/user/userReducer';
import wishListService from '../../services/wishListService/wishListService';
import {IWishlist} from '../../typings/IWishlist';
import getIdObj from '../../utils/getIdObj';
import t from '../../utils/t';
import Icon from '../common/Icons';
import MyText from '../controls/MyText';
import TouchableOpacityDelay from '../controls/TouchableOpacityDelay';

interface IMiniBlockWishlistProps {
  wishlist?: IWishlist;
  idEvent: string;
}
const MiniBlockWishlist = ({wishlist, idEvent}: IMiniBlockWishlistProps) => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const {backgroundLight} = useTheme();
  const userId = useSelector(selectorsUser.getUserId);
  const reduxWishlist = useSelector(selectorsUser.getWishlistById(getIdObj(wishlist)));
  const ws = reduxWishlist ?? wishlist;

  const isWishlist = !!ws;

  const handlePress = async () => {
    if (!isWishlist) {
      return;
    }
    if (typeof ws === 'string') {
      return;
    }

    if (userId === getIdObj(ws.user)) {
      navigateToWishlistInteract(ws._id);
      return;
    }

    if (!!ws.user && !!ws.gifts) {
      navigateToWishlist(ws);
      return;
    }

    const res = await wishListService.getWishlistById(ws._id);
    if (res.success) {
      const ws = res.data;

      dispatch(
        actionsEvent.updateWishlistForEvent({
          id: idEvent,
          wishlist: ws,
        }),
      );

      navigateToWishlist(ws);
    }
  };

  const navigateToWishlist = async (ws: IWishlist) => {
    navigation.push('MainNavigator', {
      screen: 'InvisibleNavigator',
      params: {
        screen: 'Wishlist',
        params: {
          defaultWishlist: ws,
          owner: ws.user,
        },
      },
    });
  };
  const navigateToWishlistInteract = async (id: string) => {
    navigation.push('MainNavigator', {
      screen: 'InvisibleNavigator',
      params: {
        screen: 'WishlistInteract',
        params: {
          idDefaultWishlist: id,
        },
      },
    });
  };

  return (
    <TouchableOpacityDelay
      disabled={!isWishlist}
      onPress={handlePress}
      style={[styles.item, {backgroundColor: backgroundLight}]}>
      {isWishlist ? (
        <React.Fragment>
          <Icon name={wishlist.coverCode} size={sizes[23]} />
          <MyText numberOfLines={2} style={styles.textItem}>
            {wishlist.name}
          </MyText>
        </React.Fragment>
      ) : (
        <MyText style={styles.textItem}>{t('noWishlist')}</MyText>
      )}
    </TouchableOpacityDelay>
  );
};

const styles = StyleSheet.create({
  item: {
    borderRadius: sizes[32],
    paddingVertical: sizes[6],
    paddingHorizontal: sizes[14],
    flexDirection: 'row',
    alignItems: 'center',
    height: sizes[40],
  },
  textItem: {
    fontSize: sizes[12],
    marginLeft: sizes[10],
    maxWidth: '80%',
  },
});
export default MiniBlockWishlist;
