import React from 'react';
import {Modal, StyleSheet, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Portal} from 'react-native-portalize';
import {colorWithOpacity, sizes, useTheme} from '../../../context/ThemeContext';
import MyButton, {TypeButton} from '../../controls/MyButton';

interface ISheetAction {
  title: string;
  onPress: any;
  type: TypeButton;
}

interface IBaseModalSheetActionsProps {
  modalVisible: boolean;
  onClose: any;
  options: ISheetAction[];
}

const BaseModalSheetActions = React.memo(({modalVisible, options, onClose}: IBaseModalSheetActionsProps) => {
  const {text, background} = useTheme();

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
                backgroundColor: colorWithOpacity(text, 0.3),
              },
            ]}>
            <View
              style={{
                margin: sizes[20],
                backgroundColor: background,
                borderRadius: sizes[10],
                padding: sizes[20],
              }}>
              <View
                style={{
                  marginBottom: sizes[40],
                }}>
                {options.map((opt) => {
                  return (
                    <MyButton
                      onPress={opt.onPress}
                      styleText={{
                        paddingVertical: sizes[5],
                      }}
                      style={{marginVertical: sizes[5]}}
                      type={opt.type}>
                      {opt.title}
                    </MyButton>
                  );
                })}
              </View>
              <MyButton
                styleText={{
                  paddingVertical: sizes[5],
                }}
                type={TypeButton.primary}
                onPress={onClose}>
                Close
              </MyButton>
            </View>
          </View>
        </GestureHandlerRootView>
      </Modal>
    </Portal>
  );
});

const styles = StyleSheet.create({
  centeredView: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
});

export default BaseModalSheetActions;
