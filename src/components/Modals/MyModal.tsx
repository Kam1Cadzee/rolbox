import React from 'react';
import {Modal, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Portal} from 'react-native-portalize';
import {colorWithOpacity, sizes, useTheme} from '../../context/ThemeContext';
import IconButton from '../controls/IconButton';

interface IMyModalProps {
  modalVisible: boolean;
  onClose: any;
  isClose?: boolean;
  children?: any;
  style?: StyleProp<ViewStyle>;
  bgColor?: any;
}

const MyModal = React.memo(({modalVisible, onClose, children, bgColor, isClose, style}: IMyModalProps) => {
  const {text, primary} = useTheme();

  if (!modalVisible) {
    return null;
  }
  return (
    <Portal>
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <GestureHandlerRootView style={{flex: 1}}>
          <View
            style={[
              styles.centeredView,
              {
                backgroundColor: bgColor ?? colorWithOpacity(text, 0.8),
              },
            ]}>
            <View style={[styles.modalView, style]}>
              {isClose && (
                <IconButton
                  hitSlop={{
                    bottom: sizes[15],
                    left: sizes[15],
                    right: sizes[15],
                    top: sizes[15],
                  }}
                  onPress={onClose}
                  style={styles.btn}
                  icon={{
                    name: 'CloseIcon',
                    size: sizes[10],
                    fill: primary,
                  }}
                />
              )}
              {children}
            </View>
          </View>
        </GestureHandlerRootView>
      </Modal>
    </Portal>
  );
});

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: responsiveScreenWidth(100) - sizes[40],
    backgroundColor: 'white',
    borderRadius: sizes[16],
    paddingHorizontal: sizes[20],
    paddingVertical: sizes[40],
    position: 'absolute',
  },
  btn: {
    position: 'absolute',
    right: sizes[20],
    top: sizes[20],
    zIndex: 10,
  },
});
export default MyModal;
