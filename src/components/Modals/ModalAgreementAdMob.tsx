import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, View, Linking} from 'react-native';
import MyText from '../controls/MyText';
import MyModal from './MyModal';
import {getFontFamily} from '../../utils/getFontFamily';
import {useDispatch} from 'react-redux';
import {actionsOther} from '../../redux/other/otherReducer';
import MyButton, {TypeButton} from '../controls/MyButton';
import {AdsConsent, AdsConsentStatus, FirebaseAdMobTypes} from '@react-native-firebase/admob';
import {sizes, useTheme} from '../../context/ThemeContext';
import {ScrollView} from 'react-native-gesture-handler';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';
import LinkText, {TypeLinkText} from '../controls/LinkText';
import t from '../../utils/t';

interface IModalAgreementAdMobProps {
  modalVisible: boolean;
  onClose: any;
}

const ModalAgreementAdMob = ({modalVisible, onClose}: IModalAgreementAdMobProps) => {
  const dispatch = useDispatch();
  const {secondary, border} = useTheme();
  const [providers, setProviders] = useState<FirebaseAdMobTypes.AdProvider[]>([]);
  const [isShowProviders, setIsShowProviders] = useState(false);

  useEffect(() => {
    AdsConsent.getAdProviders().then((res) => {
      setProviders(res);
    });
  }, []);

  const handlePERSONALIZED = async () => {
    await AdsConsent.setStatus(AdsConsentStatus.PERSONALIZED);
    dispatch(
      actionsOther.setData({
        statusAdMob: 'PERSONALIZED',
      }),
    );
    onClose();
  };

  const handleNON_PERSONALIZED = async () => {
    await AdsConsent.setStatus(AdsConsentStatus.NON_PERSONALIZED);
    dispatch(
      actionsOther.setData({
        statusAdMob: 'NON_PERSONALIZED',
      }),
    );
    onClose();
  };

  return (
    <MyModal style={styles.modal} modalVisible={modalVisible} onClose={onClose}>
      <Image style={styles.image} source={require('../../assets/img/logo.png')} />
      {isShowProviders ? (
        <View>
          <MyText
            style={{
              marginBottom: sizes[20],
            }}>
            {t('adMob1')}
          </MyText>
          <ScrollView>
            <View style={styles.viewItems}>
              {providers.map((p) => {
                return (
                  <MyButton onPress={() => Linking.openURL(p.privacyPolicyUrl)} style={[styles.item]} key={p.companyId}>
                    {p.companyName}
                  </MyButton>
                );
              })}
            </View>
          </ScrollView>
          <View
            style={[
              styles.bottom,
              {
                borderTopColor: border,
              },
            ]}>
            <LinkText style={styles.linkText} type={TypeLinkText.accent}>
              {t('adMob2')}
            </LinkText>
            <MyButton onPress={() => setIsShowProviders(false)} type={TypeButton.primary}>
              {t('back')}
            </MyButton>
          </View>
        </View>
      ) : (
        <React.Fragment>
          <MyText style={styles.text}>{t('adMob3')}</MyText>
          <MyText style={[styles.text, {fontSize: sizes[18]}]}>{t('adMob4')}</MyText>
          <MyText style={{textAlign: 'center', marginBottom: sizes[30]}}>
            {t('adMob5')}
            <MyText style={{color: secondary}} onPress={() => setIsShowProviders(true)}>
              {t('adMob6', {
                providers: providers.length,
              })}
            </MyText>
          </MyText>
          <MyButton
            containerStyle={{width: '100%'}}
            style={[styles.btn, {marginBottom: sizes[15]}]}
            onPress={handlePERSONALIZED}
            type={TypeButton.primary}>
            {t('adMob7')}
          </MyButton>
          <MyButton
            containerStyle={{width: '100%', marginBottom: -sizes[20]}}
            style={styles.btn}
            onPress={handleNON_PERSONALIZED}>
            {t('adMob8')}
          </MyButton>
        </React.Fragment>
      )}
    </MyModal>
  );
};

const styles = StyleSheet.create({
  bold: {
    fontFamily: getFontFamily(700),
  },
  btn: {
    padding: sizes[15],
    paddingVertical: sizes[15],
  },
  viewItems: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  item: {
    borderRadius: sizes[6],
    padding: sizes[8],
    marginVertical: sizes[2],
    marginHorizontal: sizes[1],
  },
  modal: {
    alignItems: 'center',
    maxHeight: responsiveScreenHeight(90),
    overflow: 'hidden',
  },
  image: {
    marginTop: -sizes[30],
    width: sizes[80],
    height: sizes[80],
    marginBottom: sizes[20],
  },
  bottom: {
    borderTopWidth: 1,
    padding: sizes[20],
    marginHorizontal: -sizes[20],
    marginBottom: sizes[30],
  },
  linkText: {
    textAlign: 'center',
    marginBottom: sizes[20],
    fontSize: sizes[14],
  },
  text: {
    textAlign: 'center',
    marginBottom: sizes[16],
    fontFamily: getFontFamily(500),
  },
});

export default ModalAgreementAdMob;
