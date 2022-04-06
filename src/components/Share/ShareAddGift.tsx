import React, {useEffect, useMemo, useState} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {ActivityIndicator, Dimensions, StyleSheet, View, Image, PermissionsAndroid} from 'react-native';

import {ScrollView} from 'react-native-gesture-handler';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import {sizes, useTheme} from '../../context/ThemeContext';
import {setTokenToInstance} from '../../services/extensionService/extensionInstance';
import extensionService from '../../services/extensionService/extensionService';
import IGift, {IGiftClientPost, IGiftPost} from '../../typings/IGift';
import IOption from '../../typings/IOption';
import {IUser, UserExtension} from '../../typings/IUser';
import {IWishlist, IWishListLabel} from '../../typings/IWishlist';
import {useCurrencyOptionByTypeFunc, useCurrencyOptions} from '../../typings/TypeCurrency';
import getErrorByObj from '../../utils/getErrorByObj';
import {getFontFamily} from '../../utils/getFontFamily';
import {isAndroid, isIOS} from '../../utils/isPlatform';
import normalizeData, {normalizePrice, normalizeURL} from '../../utils/normalizeData';
import useValidation, {executeRules, rulesInput} from '../../utils/validation';
import Icon from '../common/Icons';
import CustomModalDropdown from '../controls/Dropdown/CustomModalDropdown';
import MyButton, {TypeButton} from '../controls/MyButton';
import MyInputText from '../controls/MyInputText';
import MyText from '../controls/MyText';
import t from '../../utils/t';
import useAxios from '../../useHooks/useAxios';
import useDidUpdateEffect from '../../useHooks/useDidUpdateEffect';
import parseWebsiteData, {ITypeParseImage} from '../../utils/parseWebsiteData';
import BackgroundContent from '../common/BackgroundContent';
import LinkText, {TypeLinkText} from '../controls/LinkText';
import getHeightDropdown from '../../utils/getHeightDropdown';
import ModalPickerPhoto from '../Modals/ModalPickerPhoto';
import {IUploadImage} from '../../services/uploadImage';
import I18n from 'react-native-i18n';
import {getLocaleConstant} from '../../config/configLocale';
import auth from '@react-native-firebase/auth';
import TouchableOpacityDelay from '../controls/TouchableOpacityDelay';

const {height, width} = Dimensions.get('screen');

interface IShareViewProps {
  data?: string;
  mimeType?: string;
  onDismissExtension: any;
  onContinueInApp?: (data?: any) => any;
  scrollToWishlist: any;
  addedWishlist: IWishlist[];
  setUserName: any;
}

enum Status {
  isLoading,
  loaded,
  noAuth,
  error,
  success,
}

const getWishlist = (wishlists: IWishlist[]) => {
  const result: IOption<IWishListLabel>[] = wishlists.map((w) => ({
    value: w._id,
    label: {
      icon: w.coverCode,
      name: w.name,
    },
  }));
  return result;
};

const getNormUri = (uri: string) => {
  const appleId = uri.substring(5, 41);
  const ext = 'JPG';
  return `assets-library://asset/asset.${ext}?id=${appleId}&ext=${ext}`;
};

const ShareAddGift = ({
  mimeType,
  data: websiteLink,
  onDismissExtension,
  scrollToWishlist,
  addedWishlist,
  setUserName,
}: IShareViewProps) => {
  const validation = useValidation();
  const defaultCurrencyByLocale = getLocaleConstant(I18n.locale as any).currency;
  const funcGetCurrencyOption = useCurrencyOptionByTypeFunc();
  const currency = funcGetCurrencyOption(defaultCurrencyByLocale);

  const optionsCurrency = useCurrencyOptions();
  const {secondary, accent} = useTheme();
  const [user, setUser] = useState<IUser | null>(null);
  const [status, setStatus] = useState(Status.isLoading);
  const [token, setToken] = useState<string>();
  const [isPickerPhoto, setIsPickerPhoto] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [picture, setPicture] = useState<{type: ITypeParseImage; data: any | null}>({
    data: null,
    type: ITypeParseImage.none,
  });
  const [isStartPosition, setIsStartPosition] = useState(true);
  const {control, handleSubmit, errors, reset} = useForm({
    reValidateMode: 'onChange',
    mode: 'onTouched',
    defaultValues: {
      currency: currency,
    },
  });
  const {request} = useAxios(extensionService.createGift);
  const wishlistOptions = useMemo(() => {
    if (user) {
      return getWishlist([...user.ownedWishlists, ...addedWishlist]);
    }
    return [];
  }, [user, addedWishlist]);

  const handleSelectImage = (image: IUploadImage | null) => {
    if (image === null) {
      setPicture({
        data: null,
        type: ITypeParseImage.none,
      });
    } else {
      setPicture({
        data: image,
        type: ITypeParseImage.gallery,
      });
    }
  };

  const hasAndroidPermission = async () => {
    const permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  };

  const handleOpenGallery = async () => {
    if (isAndroid) {
      await hasAndroidPermission();
    }
    setIsPickerPhoto(true);
  };

  const onSubmit = async (data: IGiftClientPost) => {
    setIsLoading(true);
    try {
      const idWishlist = data.wishlist.value;

      const dataFetch: IGiftPost = {
        name: normalizeData(data.name),
        wishlist: idWishlist,
        color: normalizeData(data.color),
        note: normalizeData(data.note),
        price: {
          currency: data?.currency?.value ?? currency.value,
          value: normalizePrice(data.price),
        },
        quantity: data.quantity,
        size: normalizeData(data.size),
        websiteLink: normalizeURL(data.websiteLink),
      };
      const res = await request<IGift>(dataFetch);
      if (res.success) {
        if (picture.type === ITypeParseImage.gallery) {
          const newPicture: IUploadImage = {
            ...picture.data,
            path: getNormUri(picture.data.path!),
          };
          await extensionService.uploadImage(isIOS ? newPicture : picture.data, res.data._id, token);
        } else if (picture.type === ITypeParseImage.base64) {
          await extensionService.uploadImage(
            {
              mime: '',
              base64: picture.data,
              filename: '',
            },
            res.data._id,
            token,
          );
        } else if (picture.type === ITypeParseImage.url) {
          await extensionService.uploadImage(
            {
              mime: '',
              url: picture.data,
              filename: '',
            },
            res.data._id,
            token,
          );
        }
        setStatus(Status.success);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadData = async () => {
    try {
      const res = await extensionService.getProfile();
      if (!res.success) {
        throw new Error();
      }
      setUser(res.data[0]);
      setUserName(UserExtension.fullName(res.data[0]));

      const websiteRes = await extensionService.parseURL(websiteLink);

      if (websiteRes.success) {
        const parseData = parseWebsiteData.parse({
          currency: '',
          image: websiteRes.data.image,
          title: websiteRes.data.title,
          price: websiteRes.data.price,
        });

        reset({
          name: parseData.title,
          price: parseData.price,
        });
        setPicture(parseData.image);
      }

      setStatus(Status.loaded);
      setIsStartPosition(false);
    } catch {
      setStatus(Status.error);
    }
  };

  const getToken = async () => {
    try {
      const res = await auth().currentUser.getIdToken();

      return res ?? 'noAuth';
    } catch (e) {
      return 'noAuth';
    }
  };

  useEffect(() => {
    if (websiteLink === 'none' && mimeType === 'none') {
      setStatus(Status.error);
    } else if (websiteLink && mimeType && websiteLink !== 'none' && mimeType !== 'none') {
      getToken().then((token) => {
        setToken(token);
      });
    }
  }, [websiteLink, mimeType]);

  useDidUpdateEffect(() => {
    if (!token) {
      return;
    }
    if (token === 'noAuth') {
      setStatus(Status.noAuth);
    } else {
      //test(token);
      setTokenToInstance(token);
      loadData();
    }
  }, [token]);

  return (
    <View
      style={{
        flexGrow: 1,
        width,
      }}>
      {isPickerPhoto && (
        <ModalPickerPhoto
          selectImage={handleSelectImage}
          modalVisible={isPickerPhoto}
          onClose={() => setIsPickerPhoto(false)}
        />
      )}
      <View
        style={{
          backgroundColor: 'white',
          flexGrow: 1,
        }}>
        <View
          style={{
            flexGrow: 1,
          }}>
          {status !== Status.loaded && (
            <View
              style={{
                marginVertical: sizes[40],
                flexDirection: 'row',
                justifyContent: 'center',
                width: '100%',
              }}>
              <Image source={require('../../assets/img/logo.png')} />
            </View>
          )}
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              height,
              flexGrow: 1,
              justifyContent: 'center',
            }}>
            {status === Status.isLoading && (
              <React.Fragment>
                <ActivityIndicator size="large" color={secondary} />
                <MyText
                  style={[
                    styles.text,
                    {
                      marginTop: sizes[20],
                    },
                  ]}>
                  {t('ext1')}
                </MyText>
              </React.Fragment>
            )}
            {status === Status.error && <MyText style={styles.text}>{t('ext2')}</MyText>}
            {status === Status.noAuth && <MyText style={styles.text}>{t('ext3')}</MyText>}
            {status === Status.success && <MyText style={styles.text}>{t('ext4')}</MyText>}
          </View>
          {status === Status.loaded && (
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{
                padding: 20,
                flex: 1,
              }}
              contentContainerStyle={{
                paddingBottom: sizes[30],
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  width: '100%',
                  marginBottom: sizes[40],
                }}>
                <Image
                  style={{
                    height: sizes[100],
                    width: sizes[100],
                  }}
                  source={require('../../assets/img/logo.png')}
                />
              </View>
              <Controller
                control={control}
                render={({onChange, value}) => {
                  return (
                    <CustomModalDropdown<IWishListLabel>
                      isRequired
                      error={getErrorByObj(errors, 'wishlist')}
                      animated={false}
                      label={t('addToWishlist')}
                      options={wishlistOptions}
                      dropdownStyle={{
                        width: responsiveScreenWidth(100) - sizes[isIOS ? 35 : 40],
                        height: getHeightDropdown({
                          count: wishlistOptions.length + 1,
                          height: sizes[75],
                        }),
                        transform: [
                          {
                            translateY: isIOS ? sizes[50] : 0,
                          },
                        ],
                        backgroundColor: 'white',
                      }}
                      onSelect={onChange}
                      value={value ? value?.label?.name : ''}
                      styleRowComponent={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: sizes[20],
                      }}
                      renderRow={(d) => {
                        return (
                          <React.Fragment>
                            <Icon name={d.option.label.icon} size={sizes[25]} />
                            <MyText style={{fontFamily: getFontFamily(500), marginLeft: sizes[20]}}>
                              {d.option.label.name}
                            </MyText>
                          </React.Fragment>
                        );
                      }}
                      extra={({onPress}) => (
                        <TouchableOpacityDelay
                          onPress={() => {
                            onPress();
                            scrollToWishlist();
                          }}
                          style={styles.extraBtn}>
                          <Icon name="PlusIcon" size={sizes[12]} fill={accent} />
                          <LinkText style={styles.link} type={TypeLinkText.accent}>
                            {t('addWishlist')}
                          </LinkText>
                        </TouchableOpacityDelay>
                      )}
                    />
                  );
                }}
                name="wishlist"
                rules={validation.required}
              />
              {picture.type !== ITypeParseImage.none ? (
                <TouchableOpacityDelay
                  onPress={handleOpenGallery}
                  style={[
                    styles.viewPicture,
                    {
                      width: responsiveScreenWidth(100) - sizes[40],
                    },
                  ]}>
                  <Image
                    resizeMode="contain"
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: sizes[4],
                    }}
                    source={{
                      uri: picture.type === ITypeParseImage.gallery ? picture.data.path : (picture.data as any),
                    }}
                  />
                </TouchableOpacityDelay>
              ) : (
                <BackgroundContent style={styles.viewPicture}>
                  <Icon name="AddPictureIcon" size={sizes[45]} />
                  <LinkText onPress={handleOpenGallery} style={styles.addPhotoText} type={TypeLinkText.accent}>
                    {t('editPhoto')}
                  </LinkText>
                </BackgroundContent>
              )}
              <Controller
                control={control}
                render={({onChange, value}) => {
                  return (
                    <MyInputText
                      selection={
                        isStartPosition
                          ? {
                              start: 0,
                              end: 0,
                            }
                          : undefined
                      }
                      defaultValue={value}
                      isRequired
                      label={`${t('name')}:`}
                      onChangeText={onChange}
                      error={getErrorByObj(errors, 'name')}
                    />
                  );
                }}
                name="name"
                rules={validation.required}
              />
              <Controller
                control={control}
                render={({onChange, value}) => {
                  return (
                    <MyInputText
                      selection={
                        isStartPosition
                          ? {
                              start: 0,
                              end: 0,
                            }
                          : undefined
                      }
                      defaultValue={value}
                      textContentType={'URL'}
                      keyboardType={'url'}
                      label={`${t('website')}:`}
                      onChangeText={onChange}
                      error={getErrorByObj(errors, 'websiteLink')}
                    />
                  );
                }}
                name="websiteLink"
                defaultValue={websiteLink}
                rules={validation.website}
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  zIndex: 10,
                }}>
                <Controller
                  control={control}
                  render={({onChange, value}) => {
                    return (
                      <MyInputText
                        defaultValue={value}
                        keyboardAppearance="light"
                        keyboardType="numeric"
                        styleCon={{flexGrow: 1, marginRight: sizes[10]}}
                        label={`${t('price')}:`}
                        onChangeText={(text) => {
                          executeRules([rulesInput.price, rulesInput.maxValue(1000000.9), onChange], text);
                        }}
                        value={value}
                        error={getErrorByObj(errors, 'price')}
                      />
                    );
                  }}
                  name="price"
                />
                <Controller
                  control={control}
                  render={({onChange, value}: any) => {
                    return (
                      <CustomModalDropdown<string>
                        label=""
                        animated={false}
                        options={optionsCurrency}
                        onSelect={onChange}
                        style={{
                          minWidth: sizes[90],
                        }}
                        dropdownStyle={{
                          minWidth: sizes[89],
                          height: 'auto',
                          transform: [
                            {
                              translateY: isIOS ? sizes[50] : 0,
                            },
                          ],
                          backgroundColor: 'white',
                        }}
                        value={value ? value.label : currency.label}
                      />
                    );
                  }}
                  name="currency"
                />
              </View>
              <Controller
                control={control}
                render={({onChange, value}) => {
                  return (
                    <MyInputText
                      isRequired
                      defaultValue={value?.toString()}
                      keyboardType="number-pad"
                      label={`${t('quantity')}:`}
                      onChangeText={(text) => {
                        executeRules([rulesInput.maxValue(999), rulesInput.onlyNumber, onChange], text);
                      }}
                      value={value}
                      error={getErrorByObj(errors, 'quantity')}
                    />
                  );
                }}
                name="quantity"
                rules={validation.quantity}
                defaultValue="1"
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  zIndex: -1,
                }}>
                <Controller
                  control={control}
                  render={({onChange, value}) => {
                    return (
                      <MyInputText
                        defaultValue={value}
                        styleCon={{flexGrow: 1, maxWidth: '48.5%'}}
                        label={`${t('color')}:`}
                        onChangeText={onChange}
                        error={getErrorByObj(errors, 'color')}
                      />
                    );
                  }}
                  name="color"
                />
                <Controller
                  control={control}
                  render={({onChange, value}) => {
                    return (
                      <MyInputText
                        defaultValue={value}
                        styleCon={{flexGrow: 1, maxWidth: '48.5%'}}
                        label={`${t('size')}:`}
                        onChangeText={onChange}
                        error={getErrorByObj(errors, 'size')}
                      />
                    );
                  }}
                  name="size"
                />
              </View>

              <Controller
                control={control}
                render={({onChange, value}) => {
                  return (
                    <MyInputText
                      defaultValue={value}
                      label={`${t('note')}:`}
                      onChangeText={onChange}
                      error={getErrorByObj(errors, 'note')}
                    />
                  );
                }}
                name="note"
              />
              <MyButton
                isLoading={isLoading}
                onPress={handleSubmit(onSubmit)}
                type={TypeButton.secondary}
                style={styles.btn}>
                {t('save')}
              </MyButton>
              <MyButton isLoading={isLoading} onPress={onDismissExtension} style={styles.btn}>
                {t('cancel')}
              </MyButton>
            </ScrollView>
          )}
        </View>
        {status !== Status.loaded && (
          <MyButton
            type={TypeButton.primary}
            onPress={onDismissExtension}
            style={{
              margin: sizes[20],
            }}>
            {status === Status.success ? t('back') : t('cancel')}
          </MyButton>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: sizes[16],
    fontFamily: getFontFamily(500),
    textAlign: 'center',
  },
  btn: {
    paddingVertical: sizes[15],
    marginBottom: sizes[15],
  },
  viewPicture: {
    borderRadius: sizes[4],
    height: sizes[152],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: sizes[20],
  },
  addPhotoText: {
    marginTop: sizes[15],
  },
  link: {
    fontSize: sizes[14],
    marginLeft: sizes[20],
  },
  extraBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: sizes[20],
  },
});
export default ShareAddGift;
