import React, {useState} from 'react';
import {ScrollView, StyleSheet, SafeAreaView, View} from 'react-native';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';
import {useDispatch, useSelector} from 'react-redux';
import {sizes, useTheme} from '../../../context/ThemeContext';
import {actionsUser, selectorsUser} from '../../../redux/user/userReducer';
import purchaseService from '../../../services/purchaseService/purchaseService';
import IGift from '../../../typings/IGift';
import IPurchase from '../../../typings/IPurchase';
import {StatusGift} from '../../../typings/StatusGift';
import useAxios from '../../../useHooks/useAxios';
import useDidUpdateEffect from '../../../useHooks/useDidUpdateEffect';
import {isIOS} from '../../../utils/isPlatform';
import t from '../../../utils/t';
import MyButton, {TypeButton} from '../../controls/MyButton';
import CarouselGifts from '../../Gift/CarouselGifts';
import {WillGiftsScreenProps} from '../../navigators/Invisible.navigator';

const WillGiftsScreen = ({route, navigation}: WillGiftsScreenProps) => {
  const {status, idGift} = route.params;
  const dispatch = useDispatch();
  const {background} = useTheme();
  const purchasesActive = useSelector(selectorsUser.getWillGivePurchasesActive);
  const purchasesArchived = useSelector(selectorsUser.getWillGivePurchasesArchived);
  const purchases = status === StatusGift.active ? purchasesActive : purchasesArchived;
  const gifts = purchases.map((p) => p.gift as IGift);
  const [index, setIndex] = useState(gifts.findIndex((g) => g._id === idGift));
  const purchase = purchases[index];

  const {request: requestCancel, isLoading: isLoadingCancel} = useAxios(purchaseService.denyToGive);
  const {request: requestConfirm, isLoading: isLoadingConfirm} = useAxios(purchaseService.haveGifted);
  const {request: requestHaveNotGifted, isLoading: isLoadingHaveNotGifted} = useAxios(purchaseService.haveNotGifted);

  const handleConfirmGiving = async () => {
    if (!purchase) {
      return;
    }
    const res = await requestConfirm<IPurchase>(purchase._id);

    if (res.success) {
      setIndex((index) => {
        return index === 0 ? 0 : index - 1;
      });
      dispatch(actionsUser.changePurchase(res.data!));
    }
  };

  const handleCancelGiving = async () => {
    if (!purchase) {
      return;
    }
    const res = await requestCancel(purchase._id);
    if (res.success) {
      setIndex((index) => {
        return index === 0 ? 0 : index - 1;
      });
      dispatch(actionsUser.removePurchase(purchase._id));
    }
  };

  const handleHaveNotGifted = async () => {
    if (!purchase) {
      return;
    }
    const res = await requestHaveNotGifted<IPurchase>(purchase._id);

    if (res.success) {
      setIndex((index) => {
        return index === 0 ? 0 : index - 1;
      });
      dispatch(actionsUser.changePurchase(res.data!));
    }
  };

  useDidUpdateEffect(() => {
    if (gifts.length === 0) {
      navigation.goBack();
    }
  }, [gifts]);

  return (
    <View style={{flex: 1}}>
      <ScrollView style={styles.con} showsVerticalScrollIndicator={false} bounces={false}>
        <CarouselGifts gifts={gifts} selectedIndex={index} setSelected={setIndex} />
      </ScrollView>
      <View
        style={[
          styles.viewBtn,
          {
            backgroundColor: background,
          },
        ]}>
        {status === StatusGift.active ? (
          <React.Fragment>
            <MyButton
              isLoading={isLoadingCancel || isLoadingConfirm}
              onPress={handleCancelGiving}
              disabled={!purchase}
              containerStyle={styles.btn}
              type={TypeButton.ghost}>
              {t('wontGift')}
            </MyButton>
            <MyButton
              isLoading={isLoadingCancel || isLoadingConfirm}
              onPress={handleConfirmGiving}
              disabled={!purchase}
              containerStyle={styles.btn}
              type={TypeButton.secondary}>
              {t('haveGifted')}
            </MyButton>
          </React.Fragment>
        ) : (
          <MyButton
            isLoading={isLoadingHaveNotGifted}
            onPress={handleHaveNotGifted}
            disabled={!purchase}
            containerStyle={[
              styles.btn,
              {
                flexGrow: 1,
              },
            ]}
            type={TypeButton.secondary}>
            {t('haveNotGifted')}
          </MyButton>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  con: {},
  viewBtn: {
    flexDirection: 'row',
    paddingHorizontal: sizes[20],
    marginHorizontal: -sizes[10],
    justifyContent: 'space-between',
    height: sizes[140],
  },
  btn: {
    paddingVertical: sizes[15],
    width: '48%',
  },
});
export default WillGiftsScreen;
