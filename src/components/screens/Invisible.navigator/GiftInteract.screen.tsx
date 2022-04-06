import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {GiftInteractScreenNavigationProp, GiftInteractScreenProps} from '../../navigators/Invisible.navigator';
import CarouselGifts from '../../Gift/CarouselGifts';
import {sizes, useTheme} from '../../../context/ThemeContext';
import IconButton from '../../controls/IconButton';
import IGift from '../../../typings/IGift';
import ModalDeleteGift from '../../Modals/ModalDeleteGift';
import useSharing from '../../../useHooks/useSharing';
import {actionsUser, selectorsUser} from '../../../redux/user/userReducer';
import useDidUpdateEffect from '../../../useHooks/useDidUpdateEffect';
import {IWishlist} from '../../../typings/IWishlist';
import VisibilityType from '../../../typings/VisibilityType';

interface IHeaderRightProps {
  gift?: IGift;
  isDisabled?: boolean;
  onRemoveGift: any;
  wishlist: IWishlist;
}

const HeaderRight = ({gift, isDisabled = false, onRemoveGift, wishlist}: IHeaderRightProps) => {
  const {shareGift} = useSharing();
  const [isModalDelete, setIsModalDelete] = useState(false);
  const navigation = useNavigation<GiftInteractScreenNavigationProp>();
  const {text} = useTheme();

  const navigateToAddGift = () => {
    navigation.navigate('AdditionalNavigator', {
      screen: 'AddGift',
      params: {
        gift,
      },
    });
  };

  const onShare = async () => {
    if (gift) {
      await shareGift(gift);
    }
  };

  return (
    <View style={styles.headerView}>
      <ModalDeleteGift
        onDelete={onRemoveGift}
        modalVisible={isModalDelete}
        onClose={() => setIsModalDelete(false)}
        idGift={gift ? gift._id : ''}
      />
      <IconButton
        style={styles.headerItem}
        onPress={() => setIsModalDelete(true)}
        disabled={isDisabled}
        icon={{
          name: 'TrashIcon',
          fill: text,
          size: sizes[16],
        }}
      />
      <IconButton
        style={styles.headerItem}
        onPress={navigateToAddGift}
        disabled={isDisabled}
        icon={{
          name: 'EditIcon',
          fill: text,
          size: sizes[16],
        }}
      />
      <IconButton
        style={styles.headerItem}
        onPress={onShare}
        disabled={isDisabled}
        icon={{
          name: 'ShareIcon',
          fill: text,
          size: sizes[16],
        }}
      />
    </View>
  );
};

const GiftInteractScreen = ({route, navigation}: GiftInteractScreenProps) => {
  const dispatch = useDispatch();
  const {id, currentWishlist} = route.params;
  const gifts = useSelector(selectorsUser.getGiftsByWishlist(currentWishlist._id));
  const [index, setIndex] = useState(gifts.findIndex((g) => g._id === id));
  const [isScroll, setIsScroll] = useState(false);
  const gift = gifts[index];

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <HeaderRight wishlist={currentWishlist} gift={gift} isDisabled={isScroll} onRemoveGift={handelRemoveGift} />
        );
      },
      headerLeftAction: navigateToWishlistInteract,
    } as any);
  }, [gift, isScroll, currentWishlist]);

  const handelRemoveGift = () => {
    dispatch(actionsUser.removeGift({idWishlist: currentWishlist._id, idGift: gift._id}));
  };

  const navigateToWishlistInteract = () => {
    navigation.navigate('InvisibleNavigator', {
      screen: 'WishlistInteract',
      params: {
        idDefaultWishlist: currentWishlist._id,
      },
    });
  };

  useDidUpdateEffect(() => {
    if (gifts.length === 0) {
      navigateToWishlistInteract();
    }
  }, [gifts]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <ScrollView contentContainerStyle={styles.con} showsVerticalScrollIndicator={false} bounces={false}>
        <CarouselGifts wishlist={currentWishlist} selectedIndex={index} setSelected={setIndex} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  con: {
    paddingBottom: sizes[30],
    flexGrow: 1,
  },
  headerView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: -sizes[13],
  },
  headerItem: {
    marginHorizontal: sizes[13],
  },
});

export default GiftInteractScreen;
