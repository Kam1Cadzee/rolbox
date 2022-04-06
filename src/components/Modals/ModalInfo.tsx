import React from 'react';
import {StyleSheet} from 'react-native';
import MyText from '../controls/MyText';
import MyModal from './MyModal';
import {getFontFamily} from '../../utils/getFontFamily';

interface IModalInfoProps {
  modalVisible: boolean;
  onClose: any;
  texts: IErrorMessage[][];
}

interface IErrorMessage {
  text: string;
  isBold: boolean;
}

const ModalInfo = ({modalVisible, onClose, texts}: IModalInfoProps) => {
  return (
    <MyModal
      style={{
        alignItems: 'center',
      }}
      modalVisible={modalVisible}
      onClose={onClose}
      isClose>
      {texts.map((item, i) => (
        <MyText key={i}>
          {item.map((row, i) => {
            if (row.isBold) {
              return (
                <MyText key={i} style={styles.bold}>
                  {row.text}
                </MyText>
              );
            }
            return row.text;
          })}
        </MyText>
      ))}
    </MyModal>
  );
};

const styles = StyleSheet.create({
  bold: {
    fontFamily: getFontFamily(700),
  },
});

export type {IErrorMessage};
export default ModalInfo;
