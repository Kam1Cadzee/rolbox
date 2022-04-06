import {StyleSheet, View} from 'react-native';
import React from 'react';
import MyModal from './MyModal';
import {getFontFamily} from '../../utils/getFontFamily';
import {sizes} from '../../context/ThemeContext';
import MyText from '../controls/MyText';
import MyButton, {TypeButton} from '../controls/MyButton';
import t from '../../utils/t';

interface IModalLogoutProps {
  modalVisible: boolean;
  onClose: any;
  onConfirm: any;
  confirmText: string;
  title: string;
  subTitle: string;
  isLoading?: boolean;
}

const ModalConfirm = ({
  modalVisible,
  onClose,
  confirmText,
  onConfirm,
  subTitle,
  title,
  isLoading = false,
}: IModalLogoutProps) => {
  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <MyModal modalVisible={modalVisible} onClose={onClose}>
      <View style={styles.con}>
        <MyText style={styles.title}>{title}</MyText>
        <MyText>{subTitle}</MyText>
        <View style={styles.bottom}>
          <MyButton isLoading={isLoading} containerStyle={styles.btn} onPress={onClose}>
            {t('cancel')}
          </MyButton>
          <MyButton isLoading={isLoading} containerStyle={styles.btn} type={TypeButton.primary} onPress={handleConfirm}>
            {confirmText}
          </MyButton>
        </View>
      </View>
    </MyModal>
  );
};

const styles = StyleSheet.create({
  con: {
    alignItems: 'center',
  },
  title: {
    fontFamily: getFontFamily(700),
    fontSize: sizes[16],
    marginBottom: sizes[25],
  },
  btn: {
    flexGrow: 1,
    maxWidth: '47%',
  },
  bottom: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: sizes[24],
  },
});
export default ModalConfirm;
