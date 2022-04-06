import React from 'react';
import {Linking, Modal, StyleSheet, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Portal} from 'react-native-portalize';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import {useDispatch, useSelector} from 'react-redux';
import {colorWithOpacity, sizes, useTheme} from '../../context/ThemeContext';
import {selectorsConfig} from '../../redux/config/configReducer';
import {getFontFamily} from '../../utils/getFontFamily';
import t from '../../utils/t';
import Icon from '../common/Icons';
import MyButton, {TypeButton} from '../controls/MyButton';
import MyText from '../controls/MyText';
import {isAndroid} from '../../utils/isPlatform';
import {CheckAndroidVersion} from '../../config/configVersion';
import {actionsOther} from '../../redux/other/otherReducer';

interface IModalUpdateAppProps {
  modalVisible: boolean;
  onClose: any;
  isRequired?: boolean;
}
const width = responsiveScreenWidth(100) - sizes[40];
const ModalUpdateApp = ({modalVisible, onClose, isRequired = false}: IModalUpdateAppProps) => {
  const dispatch = useDispatch();
  const {text, backgroundDark} = useTheme();
  const url = useSelector(selectorsConfig.getFallbackUrl);

  const handleUpdate = async () => {
    if (isAndroid) {
      try {
        const result = await CheckAndroidVersion.check();

        dispatch(
          actionsOther.setData({
            androidVersionCheck: result.storeVersion,
          }),
        );
        await CheckAndroidVersion.startUpdate(result);
        return;
      } catch {}
    }

    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      Linking.openURL(url);
    }
  };
  return (
    <Portal>
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <GestureHandlerRootView style={{flex: 1}}>
          <View
            style={[
              styles.centeredView,
              {
                backgroundColor: colorWithOpacity(text, 0.8),
              },
            ]}>
            <View style={[styles.modalView]}>
              <View
                style={{
                  backgroundColor: backgroundDark,
                  borderRadius: sizes[16],
                  marginBottom: sizes[10],
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    zIndex: 10,
                    transform: [
                      {
                        translateY: sizes[40],
                      },
                    ],
                  }}>
                  <Icon name="RocketIcon" width={sizes[105]} height={sizes[191]} />
                </View>
                <View
                  style={{
                    transform: [
                      {
                        translateY: sizes[4],
                      },
                    ],
                  }}>
                  <Icon name="CloudIcon" width={width} height={sizes[95]} />
                </View>
              </View>
              <View
                style={{
                  paddingBottom: sizes[25],
                  paddingHorizontal: sizes[20],
                  alignItems: 'center',
                }}>
                <MyText style={styles.title}>{t('updateAppText1')}</MyText>
                <MyText style={styles.text}>{t('updateAppText2')}</MyText>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}>
                  {isRequired ? (
                    <MyButton
                      onPress={handleUpdate}
                      containerStyle={[
                        styles.btn,
                        {
                          marginHorizontal: sizes[20],
                        },
                      ]}
                      type={TypeButton.primary}>
                      {t('update')}
                    </MyButton>
                  ) : (
                    <React.Fragment>
                      <MyButton
                        onPress={onClose}
                        containerStyle={[
                          styles.btn,
                          {
                            maxWidth: '47%',
                          },
                        ]}
                        type={TypeButton.ghost}>
                        {t('updateLater')}
                      </MyButton>
                      <MyButton
                        onPress={handleUpdate}
                        containerStyle={[
                          styles.btn,
                          {
                            maxWidth: '47%',
                          },
                        ]}
                        type={TypeButton.primary}>
                        {t('updateNow')}
                      </MyButton>
                    </React.Fragment>
                  )}
                </View>
              </View>
            </View>
          </View>
        </GestureHandlerRootView>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width,
    backgroundColor: 'white',
    borderRadius: sizes[16],
    position: 'absolute',
  },
  title: {
    fontSize: sizes[24],
    fontFamily: getFontFamily(500),
    marginBottom: sizes[24],
  },
  text: {
    fontSize: sizes[16],
    fontFamily: getFontFamily(400),
    marginBottom: sizes[14],
    textAlign: 'center',
    maxWidth: '80%',
  },
  btn: {
    flexGrow: 1,
    paddingVertical: sizes[16],
  },
});
export default ModalUpdateApp;
