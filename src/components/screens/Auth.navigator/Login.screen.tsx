import React, {useCallback, useEffect, useState} from 'react';
import {Linking, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {responsiveScreenHeight, responsiveScreenWidth} from 'react-native-responsive-dimensions';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {AccessToken, GraphRequest, GraphRequestManager, LoginManager} from 'react-native-fbsdk';
import {useDispatch} from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import {LoginScreenProps} from '../../navigators/Auth.navigator';
import {sizes, useTheme} from '../../../context/ThemeContext';
import Icon from '../../common/Icons';
import MyButton from '../../controls/MyButton';
import MyText from '../../controls/MyText';
import STYLES from '../../../utils/STYLES';
import Providers from '../../../constants/Providers';
import {getFontFamily} from '../../../utils/getFontFamily';
import {fbPermissions} from '../../../config/config';
import SentryTypeError from '../../../typings/SentryTypeError';
import authService from '../../../services/authService/authService';
import {actionsUser} from '../../../redux/user/userReducer';
import {actionsOther} from '../../../redux/other/otherReducer';
import {TypeModal, useModal} from '../../../context/ModalContext';
import t from '../../../utils/t';
import {IOS_VERSION} from '../../../config/configVersion';
import {isProd} from '../../../config/configMode';
import {appleAuth, AppleButton} from '@invertase/react-native-apple-authentication';
import {isIOS} from '../../../utils/isPlatform';
import SentryCrash from '../../../Crashlytics/Sentry';
import FirebaseCrash from '../../../Crashlytics/FirebaseCrash';

const LoginScreen = ({}: LoginScreenProps) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const {executeModal} = useModal();

  const {backgroundDark, lightText} = useTheme();

  const tryAuth = async (user: any) => {
    const res = await authService.getProfile();

    if (res.success) {
      dispatch(actionsUser.setUser(res.data![0]));
      dispatch(actionsUser.setUserFirebase(user));
      dispatch(actionsUser.setIsAuth(true));
    } else {
      await auth().signOut();
      dispatch(actionsUser.setIsAuth(false));
      setIsLoading(false);
      SentryCrash.catch(res.error, SentryTypeError.AuthBE);
      FirebaseCrash.catch(res.error, SentryTypeError.AuthBE);
      executeModal({
        type: TypeModal.info,
        payload: [
          [
            {
              isBold: true,
              text: res?.message ?? t('errorServer'),
            },
          ],
          [
            {
              isBold: false,
              text: t('tryAgainLater'),
            },
          ],
        ],
        priority: 'high',
      });
    }
  };

  const onGoogleButtonPress = async () => {
    try {
      setIsLoading(true);
      const {idToken} = await GoogleSignin.signIn();

      FirebaseCrash.log(`Google idToken = ${idToken}`);
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      FirebaseCrash.log(googleCredential);

      return await auth().signInWithCredential(googleCredential);
    } catch (e) {
      console.log({e});

      FirebaseCrash.log(e);
      setIsLoading(false);
      SentryCrash.catch(e, SentryTypeError.Google);
      FirebaseCrash.catch(e, SentryTypeError.Google);
    }
  };

  const onFacebookButtonPress = async () => {
    let data: AccessToken | null = null;
    setIsLoading(true);

    try {
      const result = await LoginManager.logInWithPermissions(fbPermissions);

      if (result.isCancelled) {
        setIsLoading(false);
        return;
      }

      data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        throw new Error('Something went wrong obtaining access token');
      }

      const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

      const user = await auth().signInWithCredential(facebookCredential);
      return user;
    } catch (e) {
      SentryCrash.catch(e, SentryTypeError.Facebook);
      FirebaseCrash.catch(e, SentryTypeError.Facebook);
      try {
        if (e.code === 'auth/account-exists-with-different-credential' && data) {
          // const authCredential = e.userInfo.authCredential;
          const email = (await getFacebookEmail(data.accessToken)) as string | null;
          if (email) {
            const providers = await auth().fetchSignInMethodsForEmail(email);

            if (providers.length > 0 && providers[0] === Providers.GOOGLE) {
              executeModal({
                type: TypeModal.info,
                payload: [
                  [
                    {
                      isBold: false,
                      text: `${t('theSameEmail')} `,
                    },
                    {
                      isBold: true,
                      text: email,
                    },
                  ],
                  [
                    {
                      isBold: false,
                      text: t('loginGoogle'),
                    },
                  ],
                ],
                priority: 'high',
              });
            }
          }
        } else if (e.code === 'EUNSPECIFIED') {
          executeModal({
            type: TypeModal.info,
            payload: [
              [
                {
                  isBold: false,
                  text: e.message,
                },
              ],
            ],
            priority: 'high',
          });
        }
      } catch (e) {
        SentryCrash.catch(e, SentryTypeError.Facebook);
        FirebaseCrash.catch(e, SentryTypeError.Facebook);
      }
      setIsLoading(false);
    }
  };

  const onAppleButtonPress = async () => {
    try {
      setIsLoading(true);
      // 1). start a apple sign-in request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      // 2). if the request was successful, extract the token and nonce
      const {identityToken, nonce} = appleAuthRequestResponse;

      // can be null in some scenarios
      if (identityToken) {
        // 3). create a Firebase `AppleAuthProvider` credential
        const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);

        // 4). use the created `AppleAuthProvider` credential to start a Firebase auth request,
        //     in this example `signInWithCredential` is used, but you could also call `linkWithCredential`
        //     to link the account to an existing user
        const userCredential = await auth().signInWithCredential(appleCredential);
      } else {
        // handle this - retry?
      }
    } catch (e) {
      setIsLoading(false);
      SentryCrash.catch(e, SentryTypeError.Apple);
      FirebaseCrash.catch(e, SentryTypeError.Apple);
    }
  };
  const handleOpenPrivacy = async () => {
    await Linking.openURL('https://rolbox.app/privacy-policy/');
  };

  const getFacebookEmail = (accessToken: string) =>
    new Promise((resolve) => {
      const infoRequest = new GraphRequest('/me?fields=email', {accessToken}, (error, result: any) => {
        if (error) {
          resolve(null);
          return;
        }

        resolve(result ? (result.email as string) : null);
      });
      new GraphRequestManager().addRequest(infoRequest).start();
    });

  const onAuthStateChanged = useCallback(async (user: FirebaseAuthTypes.User | null) => {
    if (user) {
      await tryAuth(user);
    } else {
      //dispatch(actionsUser.setIsAuth(false));
      setIsLoading(false);
    }
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, [onAuthStateChanged]);

  return (
    <View style={styles.safeArea}>
      <View style={[styles.box, {backgroundColor: backgroundDark, height: responsiveScreenHeight(30)}]}>
        <Icon name="WelcomeIcon" width={responsiveScreenWidth(100)} height={responsiveScreenHeight(25)} />
      </View>
      <View
        style={[
          styles.box,
          styles.bottom,
          {
            paddingBottom: insets.bottom,
          },
        ]}>
        <View>
          <MyButton
            disabled={isLoading}
            onPress={onGoogleButtonPress}
            style={[STYLES.row, styles.googleBtn, styles.btn]}>
            <Icon name="GoogleIcon" size={sizes[15]} />
            <MyText style={styles.btnText}>{t('login')} Google</MyText>
          </MyButton>
          <MyButton disabled={isLoading} onPress={onFacebookButtonPress} style={[STYLES.row, styles.btn]}>
            <Icon name="FacebookIcon" size={sizes[15]} />
            <MyText style={styles.btnText}>{t('login')} Facebook</MyText>
          </MyButton>
          {isIOS && appleAuth.isSupported && (
            <AppleButton
              cornerRadius={sizes[4]}
              style={{height: sizes[48], marginTop: sizes[16]}}
              buttonStyle={AppleButton.Style.WHITE_OUTLINE}
              buttonType={AppleButton.Type.SIGN_IN}
              onPress={onAppleButtonPress}
            />
          )}
          {/*  <MyButton onPress={onFriends}>friends</MyButton>
          <MyButton onPress={() => onUserId()}>user by uid</MyButton> */}
        </View>
        <MyText
          onPress={handleOpenPrivacy}
          style={[
            styles.text,
            {
              color: lightText,
            },
          ]}>
          {t('textPrivacy1')}
          <MyText
            style={[
              styles.textUnderLine,
              {
                color: lightText,
              },
            ]}>
            {'\n'}
            {t('textPrivacy2')}
          </MyText>
          {isProd ? '' : `\n v${IOS_VERSION}`}
        </MyText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flexGrow: 1,
  },
  box: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  bottom: {
    marginHorizontal: sizes[20],
    paddingTop: responsiveScreenHeight(8),
    marginBottom: responsiveScreenHeight(3),
    justifyContent: 'space-between',
  },
  btn: {
    paddingVertical: sizes[17],
  },
  googleBtn: {
    marginBottom: sizes[16],
  },
  btnText: {
    marginLeft: sizes[8],
  },
  text: {
    fontSize: sizes[12],
    textAlign: 'center',
  },
  textUnderLine: {
    textDecorationLine: 'underline',
    fontSize: sizes[12],
  },
  bold: {
    fontFamily: getFontFamily(700),
  },
});

export default LoginScreen;
