import React, {useRef} from 'react';
import {Image, Linking, StyleSheet, View} from 'react-native';
import iosImage from '../../assets/img/ios_website/for-ios.png';
import androidImage from '../../assets/img/android_website/for-android.png';
import MyModal from './MyModal';
import {isAndroid, isIOS} from '../../utils/isPlatform';
import {responsiveScreenHeight, responsiveScreenWidth} from 'react-native-responsive-dimensions';
import {getFontFamily} from '../../utils/getFontFamily';
import {sizes, useTheme} from '../../context/ThemeContext';
import MyText from '../controls/MyText';
import t from '../../utils/t';
import {ScrollView} from 'react-native-gesture-handler';
import MyButton, {TypeButton} from '../controls/MyButton';
import Animated, {divide, multiply, concat} from 'react-native-reanimated';
import CustomScrollView from '../common/CustomScrollView';

interface IModalAddFromWebsiteProps {
  modalVisible: boolean;
  onClose: any;
}

const originWidth = isIOS ? 803 : 822;
const originHeight = isIOS ? 1340 : 1346;
const ratio = originWidth / originHeight;

const imageWidth = responsiveScreenWidth(70);
const offsetImage = imageWidth * 0.02;
const offsetText = imageWidth * 0.08;
const imageHeigh = imageWidth / ratio;
const image = isIOS ? iosImage : androidImage;

const scrollViewHeight = responsiveScreenHeight(70);

const ModalAddFromWebsite = ({modalVisible, onClose}: IModalAddFromWebsiteProps) => {
  const goToGoogle = async () => {
    await Linking.openURL('https://www.google.com/');
  };
  return (
    <MyModal
      style={{
        paddingBottom: sizes[20],
      }}
      modalVisible={modalVisible}
      onClose={onClose}
      isClose>
      <MyText style={styles.title}>{t('addFromWebsite')}</MyText>
      <CustomScrollView scrollViewHeight={scrollViewHeight} contentContainerStyle={styles.contentContainerStyle}>
        <MyText style={styles.text}>1. {t('modalWebsiteText1')}</MyText>
        <MyText style={styles.text}>2. {t('modalWebsiteText2')}</MyText>
        <MyText style={styles.text}>3. {t('modalWebsiteText3')}</MyText>
        <Image resizeMode="contain" source={image} style={styles.image} />
      </CustomScrollView>

      <MyButton onPress={goToGoogle} containerStyle={styles.btn} type={TypeButton.secondary}>
        {t('goToWebsite')}
      </MyButton>
    </MyModal>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: getFontFamily(500),
    fontSize: sizes[16],
    textAlign: 'center',
  },
  text: {
    fontSize: sizes[16],
    textAlign: 'left',
    alignSelf: 'flex-start',
    left: offsetText,
  },
  contentContainerStyle: {
    paddingVertical: sizes[20],
    alignItems: 'center',
  },
  image: {
    height: imageHeigh,
    width: imageWidth,
    marginTop: sizes[20],
    left: offsetImage,
  },
  btn: {
    marginTop: sizes[20],
    marginHorizontal: '20%',
  },
});

export default ModalAddFromWebsite;
