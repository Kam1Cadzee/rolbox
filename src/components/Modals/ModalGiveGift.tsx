import {Linking, StyleSheet, View} from 'react-native';
import React, {useRef, useState} from 'react';
import {useDispatch} from 'react-redux';
import MyModal from './MyModal';
import MyText from '../controls/MyText';
import {sizes, useTheme} from '../../context/ThemeContext';
import {getFontFamily} from '../../utils/getFontFamily';
import MyButton, {TypeButton} from '../controls/MyButton';
import generateRange from '../../utils/generateRange';
import ScrollPicker from '../controls/ScrollPicker/CustomScrollPicker';
import IOption from '../../typings/IOption';
import Icon from '../common/Icons';
import useAxios from '../../useHooks/useAxios';
import purchaseService from '../../services/purchaseService/purchaseService';
import IGift from '../../typings/IGift';
import IPurchase from '../../typings/IPurchase';
import {actionsUser} from '../../redux/user/userReducer';
import t from '../../utils/t';
import useDidUpdateEffect from '../../useHooks/useDidUpdateEffect';

interface IModalModalGiveGiftProps {
  onClose: any;
  modalVisible: boolean;
  onConfirm: (n: IPurchase) => void;
  gift: IGift;
}

const ModalGiveGift = ({modalVisible, onClose, gift, onConfirm}: IModalModalGiveGiftProps) => {
  const perItems = 20;
  const dispatch = useDispatch();
  const {backgroundDark, lightText, accent} = useTheme();
  const {_id, quantity, websiteLink, remaining} = gift;
  const purchased = quantity - remaining;
  const refStart = useRef(1);
  const refEnd = useRef(Math.min(remaining, perItems));
  const loadOptions = () => {
    if (refStart.current > remaining) {
      return [];
    }

    const res = generateRange(refStart.current, refEnd.current);
    refStart.current = refEnd.current + 1;
    refEnd.current = Math.min(refEnd.current + perItems, remaining);
    return res;
  };

  const onEndReached = () => {
    if (refStart.current > remaining) {
      return;
    }

    return setOptions((options) => {
      return [...options, ...loadOptions()];
    });
  };

  const [options, setOptions] = useState(() => {
    return loadOptions();
  });
  const [isConfirm, setIsConfirm] = useState(false);
  const [value, setValue] = useState(options[0]?.value);
  const {request, isLoading, data} = useAxios(purchaseService.reserve);

  const handleSelectWeight = (option: IOption<string>) => {
    setValue(option.value);
  };

  const handleConfirm = async () => {
    const res = await request<IPurchase>({gift: _id, quantity: value});
    if (res.success) {
      clearValue();
      dispatch(actionsUser.addPurchase(res.data!));
      setIsConfirm(true);
    }
  };

  const handleOpenLink = async () => {
    if (await Linking.canOpenURL(websiteLink)) {
      await Linking.openURL(websiteLink);
    }
  };

  useDidUpdateEffect(() => {
    clearValue();
  }, [gift]);

  const clearValue = () => {
    if (options.length > 0) {
      setValue(options[0]?.value);
    }
  };
  const handleClose = () => {
    if (isConfirm) {
      onConfirm(data);
    }
    setIsConfirm(false);
    onClose();
  };

  if (remaining === 0) {
    return null;
  }
  return (
    <MyModal style={styles.contentModal} modalVisible={modalVisible} onClose={handleClose} isClose>
      {isConfirm ? (
        <React.Fragment>
          <MyText style={[styles.title, {marginTop: 0, marginBottom: sizes[15]}]}>{t('textConnectGift')}</MyText>
          {websiteLink && (
            <React.Fragment>
              <MyText>{t('textBuyHere')}</MyText>
              <MyText
                numberOfLines={2}
                onPress={handleOpenLink}
                style={[styles.bold, {color: accent, textAlign: 'center', maxWidth: '80%'}]}>
                {websiteLink}
              </MyText>
            </React.Fragment>
          )}
        </React.Fragment>
      ) : (
        <React.Fragment>
          <View
            style={{
              backgroundColor: backgroundDark,
              height: sizes[75],
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'flex-end',
              paddingBottom: sizes[15],
              position: 'absolute',
              left: 0,
              right: 0,
            }}>
            <View style={styles.viewCenter}>
              <Icon name="QuantityIcon" size={sizes[10]} fill={lightText} />
              <MyText style={[styles.textCount, {color: lightText}]}>
                {t('desired')}: {quantity}
              </MyText>
            </View>
            <View style={styles.viewCenter}>
              <Icon name="GiftIcon" size={sizes[10]} fill={lightText} />
              <MyText style={[styles.textCount, {color: lightText}]}>
                {t('purchased')}: {purchased}
              </MyText>
            </View>
          </View>
          <MyText style={styles.title}>{t('textNumbersGift')}</MyText>
          <View style={[styles.con]}>
            <ScrollPicker<string>
              style={styles.item}
              options={options}
              defaultSelectedIndex={0}
              onValueChange={handleSelectWeight}
              onEndReached={onEndReached}
              onEndReachedThreshold={0.2}
            />
          </View>
          <MyButton isLoading={isLoading} style={styles.btn} onPress={handleConfirm} type={TypeButton.primary}>
            {t('confirm')}
          </MyButton>
        </React.Fragment>
      )}
    </MyModal>
  );
};

const styles = StyleSheet.create({
  con: {
    marginVertical: sizes[20],
  },
  title: {
    fontSize: sizes[16],
    fontFamily: getFontFamily(500),
    textAlign: 'center',
    marginTop: sizes[60],
  },
  contentModal: {
    alignItems: 'center',
    overflow: 'hidden',
    paddingHorizontal: 0,
  },
  btn: {width: sizes[151]},
  item: {
    width: sizes[50],
    marginHorizontal: sizes[10],
  },
  viewCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: sizes[15],
  },
  textCount: {
    fontSize: sizes[12],
    marginLeft: sizes[8],
  },
  bold: {
    marginTop: sizes[8],
    fontFamily: getFontFamily(500),
  },
});

export default ModalGiveGift;
