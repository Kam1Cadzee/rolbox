import React from 'react';
import {StyleSheet, View} from 'react-native';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';
import Animated from 'react-native-reanimated';
import {useNavigation} from '@react-navigation/native';
import MyButton, {TypeButton} from '../controls/MyButton';
import Icon from '../common/Icons';
import {sizes, useTheme} from '../../context/ThemeContext';
import MyText from '../controls/MyText';
import {getFontFamily} from '../../utils/getFontFamily';
import t from '../../utils/t';

interface IModalPlusProps {
  modalVisible: boolean;
  onClose: any;
  value: any;
}

const ModalPlus = ({modalVisible, onClose, value}: IModalPlusProps) => {
  const navigation = useNavigation();
  const {reverseText} = useTheme();

  const navigateToAddGift = () => {
    onClose();
    navigation.navigate('AdditionalNavigator', {
      screen: 'AddGift',
    });
  };

  const navigateToAddWishlist = () => {
    onClose();
    navigation.navigate('AdditionalNavigator', {
      screen: 'AddWishlist',
    });
  };

  const navigateToEvent = () => {
    onClose();
    navigation.navigate('AdditionalNavigator', {
      screen: 'AddEvent',
    });
  };

  return (
    <Animated.View
      pointerEvents={modalVisible ? 'auto' : 'none'}
      style={[
        styles.centeredView,
        {
          opacity: value,
        },
      ]}
      onTouchStart={onClose}>
      <View style={styles.modalView} onTouchStart={(e) => e.stopPropagation()}>
        <MyButton onPress={navigateToAddGift} style={[styles.btn, styles.tobBtn]} type={TypeButton.secondary}>
          <Icon name="GiftIcon" size={sizes[12]} fill={reverseText} />
          <MyText style={[styles.text, {color: reverseText}]}>{t('addGift')}</MyText>
        </MyButton>
        <MyButton onPress={navigateToAddWishlist} style={[styles.btn, styles.middleBtn]} type={TypeButton.primary}>
          <Icon name="ListIcon" size={sizes[12]} fill={reverseText} />
          <MyText style={[styles.text, {color: reverseText}]}>{t('addWishlist')}</MyText>
        </MyButton>
        <MyButton onPress={navigateToEvent} style={[styles.btn, styles.bottomBtn]} type={TypeButton.fog}>
          <Icon name="EventMenuIcon" size={sizes[13]} fill={reverseText} />
          <MyText style={[styles.text, {color: reverseText}]}>{t('addEvent')}</MyText>
        </MyButton>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'absolute',
    height: responsiveScreenHeight(100),
    width: '100%',
    zIndex: 10,
    bottom: 0,
  },
  modalView: {
    bottom: sizes[90],
  },
  btn: {
    flexDirection: 'row',
    paddingHorizontal: sizes[15],
    paddingVertical: sizes[20],
    justifyContent: 'space-between',
  },
  text: {
    fontFamily: getFontFamily(500),
    marginLeft: sizes[13],
    textAlign: 'left',
    flexGrow: 1,
  },
  tobBtn: {
    borderTopLeftRadius: sizes[16],
    borderTopRightRadius: sizes[16],
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
  middleBtn: {
    borderRadius: 0,
    marginVertical: 1,
  },
  bottomBtn: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: sizes[16],
    borderBottomLeftRadius: sizes[16],
  },
});

export default ModalPlus;
