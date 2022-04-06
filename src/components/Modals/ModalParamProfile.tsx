import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import React from 'react';
import MyModal from './MyModal';
import MyText from '../controls/MyText';
import {sizes} from '../../context/ThemeContext';
import {getFontFamily} from '../../utils/getFontFamily';
import MyButton, {TypeButton} from '../controls/MyButton';
import t from '../../utils/t';

interface IModalParamProfileProps {
  children?: any;
  style?: StyleProp<ViewStyle>;
  title: string;
  onClose: any;
  modalVisible: boolean;
  onApply: () => void;
  onClear: () => void;
}

const ModalParamProfile = ({
  children,
  style,
  onClear,
  modalVisible,
  onClose,
  title,
  onApply,
}: IModalParamProfileProps) => {
  return (
    <MyModal style={styles.contentModal} modalVisible={modalVisible} onClose={onClose} isClose>
      <MyText style={styles.title}>{title}</MyText>
      <View style={[styles.con, style]}>{children}</View>
      <View
        style={{
          flexDirection: 'row',
        }}>
        {onClear && (
          <MyButton containerStyle={styles.btn} onPress={onClear} type={TypeButton.border}>
            {t('clear')}
          </MyButton>
        )}

        <MyButton containerStyle={styles.btn} onPress={onApply} type={TypeButton.primary}>
          {t('apply')}
        </MyButton>
      </View>
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
  },
  contentModal: {
    alignItems: 'center',
  },
  btn: {width: '44%', marginHorizontal: sizes[5]},
});

export default ModalParamProfile;
