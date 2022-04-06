import React, {useEffect, useRef, useState} from 'react';
import {Platform, SafeAreaView, StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {responsiveScreenHeight, responsiveScreenWidth} from 'react-native-responsive-dimensions';
import ConfettiCannon from 'react-native-confetti-cannon';
import {useDispatch, useSelector} from 'react-redux';
import {GiftScreenProps} from '../../navigators/Additional.navigator';
import CarouselGifts from '../../Gift/CarouselGifts';
import MyButton, {TypeButton} from '../../controls/MyButton';
import {sizes, useTheme} from '../../../context/ThemeContext';
import ModalGiveGift from '../../Modals/ModalGiveGift';
import {actionsUser, selectorsUser} from '../../../redux/user/userReducer';
import StatusPurchase from '../../../typings/StatusPurchase';
import useAxios from '../../../useHooks/useAxios';
import purchaseService from '../../../services/purchaseService/purchaseService';
import IPurchase from '../../../typings/IPurchase';
import useDidUpdateEffect from '../../../useHooks/useDidUpdateEffect';
import getIdObj from '../../../utils/getIdObj';
import t from '../../../utils/t';

const GiftScreen = ({route, navigation}: GiftScreenProps) => {
  const dispatch = useDispatch();
  const {idGift, currentWishlist, owner} = route.params;
  const {background} = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [wishlist, setWishlist] = useState(currentWishlist);
  const {gifts} = currentWishlist;
  const [index, setIndex] = useState(gifts.findIndex((g) => g._id === idGift));
  const [isScroll, setIsScroll] = useState(false);
  const refExplosion = useRef<any | null>(null);
  const gift = gifts[index];

  const statusPurchase = useSelector(selectorsUser.getStatusPurchase(gift._id, gift.remaining));
  const purchase = useSelector(selectorsUser.getPurchaseByGift(gift._id));
  const {request: requestCancel, isLoading: isLoadingCancel} = useAxios(purchaseService.denyToGive);
  const {request: requestConfirm, isLoading: isLoadingConfirm} = useAxios(purchaseService.haveGifted);

  const openModalGiveGift = () => {
    setModalVisible(true);
  };

  const closeModalGiveGift = () => {
    setModalVisible(false);
  };

  const handleConfirm = (data: IPurchase) => {
    setWishlist((wl) => {
      const {gift, quantity} = data;
      const idGift = getIdObj(gift);
      const findIndex = wl.gifts.findIndex((g) => g._id === idGift);
      const itemGift = wl.gifts[findIndex];
      itemGift.remaining -= quantity;

      return wl;
    });

    navigation.goBack();
  };

  const handleCancelGiving = async () => {
    if (!purchase) {
      return;
    }
    const res = await requestCancel(purchase._id);
    if (res.success) {
      setWishlist((wl) => {
        const {gift, quantity} = purchase;
        const idGift = getIdObj(gift);
        const findIndex = wl.gifts.findIndex((g) => g._id === idGift);
        const itemGift = wl.gifts[findIndex];
        itemGift.remaining += quantity;

        return wl;
      });
      dispatch(actionsUser.removePurchase(purchase._id));
    }
  };

  const handleConfirmGiving = async () => {
    if (!purchase) {
      return;
    }
    const res = await requestConfirm<IPurchase>(purchase._id);

    if (res.success) {
      dispatch(actionsUser.changePurchase(res.data!));
      refExplosion.current.start();
    }
  };

  useDidUpdateEffect(() => {
    setIndex(gifts.findIndex((g) => g._id === idGift));
  }, [idGift]);

  useDidUpdateEffect(() => {
    setWishlist(currentWishlist);
  }, [currentWishlist]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <ModalGiveGift onClose={closeModalGiveGift} modalVisible={modalVisible} onConfirm={handleConfirm} gift={gift} />
      <ScrollView contentContainerStyle={styles.con} showsVerticalScrollIndicator={false} bounces={false}>
        <CarouselGifts owner={owner} wishlist={wishlist} selectedIndex={index} setSelected={setIndex} />
      </ScrollView>
      <View
        style={[
          styles.viewBtn,
          {
            backgroundColor: background,
          },
        ]}>
        {statusPurchase !== StatusPurchase.gifted &&
          (statusPurchase === StatusPurchase.reserved ? (
            <React.Fragment>
              <MyButton
                isLoading={isLoadingCancel || isLoadingConfirm}
                onPress={handleCancelGiving}
                disabled={isScroll || !purchase}
                containerStyle={styles.btn}
                type={TypeButton.ghost}>
                {t('wontGift')}
              </MyButton>
              <MyButton
                isLoading={isLoadingCancel || isLoadingConfirm}
                onPress={handleConfirmGiving}
                disabled={isScroll || !purchase}
                containerStyle={styles.btn}
                type={TypeButton.secondary}>
                {t('haveGifted')}
              </MyButton>
            </React.Fragment>
          ) : (
            <MyButton
              onPress={openModalGiveGift}
              disabled={isScroll}
              containerStyle={styles.btn}
              type={TypeButton.secondary}>
              {t('willGiftIt')}
            </MyButton>
          ))}
      </View>
      <ConfettiCannon
        fadeOut={true}
        ref={refExplosion}
        autoStart={false}
        explosionSpeed={1200}
        count={50}
        origin={{x: responsiveScreenWidth(50), y: -responsiveScreenHeight(100)}}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  con: {
    paddingBottom: sizes[30],
    flexGrow: 1,
  },
  viewBtn: {
    flexDirection: 'row',
    padding: sizes[20],
    paddingBottom: Platform.OS === 'ios' ? 0 : sizes[20],
    marginHorizontal: -sizes[10],
  },
  btn: {
    flexGrow: 1,
    marginHorizontal: sizes[10],
    paddingVertical: sizes[15],
  },
});
export default GiftScreen;
