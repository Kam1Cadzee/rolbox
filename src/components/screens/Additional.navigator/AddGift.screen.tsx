import React, {useState} from 'react';
import {Image, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Controller, useForm} from 'react-hook-form';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import {useDispatch, useSelector} from 'react-redux';
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker';
import {AddGiftScreenProps} from '../../navigators/Additional.navigator';
import {colorWithOpacity, sizes, useTheme} from '../../../context/ThemeContext';
import MyButton, {TypeButton} from '../../controls/MyButton';
import MyText from '../../controls/MyText';
import Icon from '../../common/Icons';
import LinkText, {TypeLinkText} from '../../controls/LinkText';
import MyInputText from '../../controls/MyInputText';
import getErrorByObj from '../../../utils/getErrorByObj';
import {useCurrencyOptionByTypeFunc, useCurrencyOptions} from '../../../typings/TypeCurrency';
import BackgroundContent from '../../common/BackgroundContent';
import CustomModalDropdown from '../../controls/Dropdown/CustomModalDropdown';
import {actionsUser, selectorsUser} from '../../../redux/user/userReducer';
import {selectorsOther} from '../../../redux/other/otherReducer';
import IGift, {
  getFilenameOfImageByGift,
  getImageByGift,
  IGiftClientPost,
  IGiftPost,
  isImageOfGift,
} from '../../../typings/IGift';
import giftService from '../../../services/giftService/giftService';
import useAxios from '../../../useHooks/useAxios';
import useValidation, {executeRules, rulesInput} from '../../../utils/validation';
import normalizeData, {normalizePrice, normalizeURL} from '../../../utils/normalizeData';
import t from '../../../utils/t';
import getIdObj from '../../../utils/getIdObj';
import useDidUpdateEffect from '../../../useHooks/useDidUpdateEffect';
import {useFormattingContext} from '../../../context/FormattingContext';
import ModalAddFromWebsite from '../../Modals/ModalAddFromWebsite';
import {ImageBuild} from '../../../utils/ImageBuild';
import DropdownWishlist from '../../controls/Dropdown/DropdownWishlist';
import IconButton from '../../controls/IconButton';
import TouchableOpacityDelay from '../../controls/TouchableOpacityDelay';

const imageBuilder = new ImageBuild({
  width: responsiveScreenWidth(100) - sizes[40],
});

const AddGiftScreen = ({route, navigation}: AddGiftScreenProps) => {
  const validation = useValidation();
  const dispatch = useDispatch();
  const defaultGift = route?.params?.gift;
  const shareData = route?.params?.shareData;
  const throwIdWishlist = route?.params?.throwIdWishlist;
  const [isStartPosition, setIsStartPosition] = useState(true);

  const {payload} = useFormattingContext();
  const defaultCurrencyByLocale = payload.currency;

  const optionsCurrency = useCurrencyOptions();
  const funcGetCurrencyOption = useCurrencyOptionByTypeFunc();
  let defaultCurrentIdWishlist = useSelector(selectorsOther.getCurrentIdWishlist);
  const [currentIdWishlist, setCurrentIdWishlist] = useState(
    throwIdWishlist ?? getIdObj(defaultGift?.wishlist) ?? defaultCurrentIdWishlist,
  );
  const [isModalWebsite, setIsModalWebsite] = useState(false);
  const currentWishlist = useSelector(selectorsUser.getWishlistById(currentIdWishlist));
  const wishlistOptions = useSelector(selectorsUser.getOwnedWishlistOptions);
  const [isRemovePicture, setIsRemovePicture] = useState(false);
  const [picture, setPicture] = useState(null as ImageOrVideo | null);
  const {lightText, border, primary, background, accent, secondary, reverseText} = useTheme();
  const defaultWishlist = currentIdWishlist && wishlistOptions.find((w) => w.value === currentIdWishlist);
  const {control, handleSubmit, errors} = useForm({
    reValidateMode: 'onChange',
    mode: 'onTouched',

    defaultValues: shareData ?? {
      ...defaultGift,
      wishlist: defaultWishlist,
      price: defaultGift?.price?.value,
      currency: funcGetCurrencyOption(defaultGift?.price?.currency ?? defaultCurrencyByLocale),
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const {request} = useAxios(defaultGift ? giftService.updateGift : giftService.createGift);

  const handleOpenModalWebsite = () => {
    setIsModalWebsite(true);
  };

  const handleCloseModalWebsite = () => {
    setIsModalWebsite(false);
  };

  const multiply = 400;

  const handleAddPicture = () => {
    ImagePicker.openPicker({
      cropping: true,
      cropperCircleOverlay: false,
      avoidEmptySpaceAroundImage: false,
      mediaType: 'photo',
      cropperActiveWidgetColor: secondary,
      cropperStatusBarColor: secondary,
      cropperToolbarColor: secondary,
      cropperToolbarWidgetColor: reverseText,
      width: imageBuilder.PixelW * multiply,
      height: imageBuilder.PixelH * multiply,
    }).then((image) => {
      setPicture(image);
      setIsRemovePicture(false);
    });
  };

  useDidUpdateEffect(() => {
    if (throwIdWishlist) {
      setCurrentIdWishlist(throwIdWishlist);
    } else if (defaultGift) {
      setCurrentIdWishlist(getIdObj(defaultGift?.wishlist));
    }
  }, [throwIdWishlist, defaultGift]);

  const navigateToAddWishlist = () => {
    navigation.navigate('AdditionalNavigator', {
      screen: 'AddWishlist',
      params: {
        isBackToAddGift: true,
      },
    });
  };

  const onSubmit = async (data: IGiftClientPost) => {
    setIsLoading(true);
    const oldIdWishlist = getIdObj(defaultGift?.wishlist);
    const idWishlist = data.wishlist.value;
    const isChangeWishlist = oldIdWishlist ? oldIdWishlist !== idWishlist : false;

    const dataFetch: IGiftPost = {
      name: normalizeData(data.name),
      wishlist: idWishlist,
      color: normalizeData(data.color),
      note: normalizeData(data.note),
      price: {
        currency: data?.currency?.value,
        value: normalizePrice(data.price),
      },
      quantity: data.quantity,
      size: normalizeData(data.size),
      websiteLink: normalizeURL(data.websiteLink),
    };

    const res = await request<IGift>(defaultGift ? {id: defaultGift._id, data: dataFetch} : dataFetch);
    if (!res.success) {
      setIsLoading(false);
      return;
    }
    try {
      if (isRemovePicture) {
        if (isImageOfGift(defaultGift)) {
          const resImage = await giftService.deleteImage(defaultGift._id, getFilenameOfImageByGift(defaultGift));
          if (resImage.success) {
            res.data!.images = [];
          }
        }
      } else if (picture) {
        if (isImageOfGift(defaultGift)) {
          await giftService.deleteImage(defaultGift._id, getFilenameOfImageByGift(defaultGift));
        }
        const imageRes = await giftService.uploadImage(picture!, res.data._id);

        if (imageRes.success) {
          res.data!.images = [imageRes.data];
        }
      }
      dispatch(
        actionsUser.addGift({
          idWishlist,
          gift: res.data!,
        }),
      );

      if (isChangeWishlist) {
        dispatch(
          actionsUser.removeGift({
            idWishlist: oldIdWishlist,
            idGift: defaultGift?._id,
          }),
        );
      }
      if (defaultGift) {
        if (isChangeWishlist) {
          // currentWishlist.gifts = [...currentWishlist.gifts, res.data!];
        } else {
          const findIndex = currentWishlist.gifts.findIndex((g) => g._id === res.data!._id);
          currentWishlist.gifts[findIndex] = res.data!;
        }

        navigation.navigate('MainNavigator', {
          screen: 'InvisibleNavigator',
          params: {
            screen: 'GiftInteract',
            params: {
              id: res.data!._id,
              currentWishlist,
            },
          },
        });
      } else {
        navigation.navigate('MainNavigator', {
          screen: 'InvisibleNavigator',
          params: {
            screen: 'WishlistInteract',
            params: {
              idDefaultWishlist: idWishlist,
            },
          },
        });
      }
    } catch {
      setIsLoading(false);
    }
  };

  // (responsiveScreenWidth(100) - sizes[40]) / (picture.width / picture.height)
  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={sizes[70]}
      enabled
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView
        onLayout={() => {
          setIsStartPosition(false);
        }}>
        <ModalAddFromWebsite modalVisible={isModalWebsite} onClose={handleCloseModalWebsite} />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={[styles.styleScrollCon, {}]}>
          {!defaultGift && (
            <React.Fragment>
              <MyButton style={styles.btn} onPress={handleOpenModalWebsite} type={TypeButton.primary}>
                {t('addFromWebsite')}
              </MyButton>
              <View style={[styles.line, {backgroundColor: border}]}>
                <MyText style={[styles.text, {color: lightText, backgroundColor: background}]}>{t('create')}</MyText>
              </View>
            </React.Fragment>
          )}

          <Controller
            control={control}
            render={({onChange, value}) => {
              return (
                <DropdownWishlist
                  label={t('addToWishlist')}
                  isRequired={true}
                  name="wishlist"
                  errors={errors}
                  value={value}
                  onSelect={(e) => {
                    setCurrentIdWishlist(e.value);
                    onChange(e);
                  }}
                  onPressExtra={navigateToAddWishlist}
                />
              );
            }}
            name="wishlist"
            defaultValue={defaultWishlist}
            rules={validation.required}
          />
          {!isRemovePicture && (picture || isImageOfGift(defaultGift)) ? (
            <TouchableOpacityDelay style={[styles.viewPicture]} onPress={handleAddPicture}>
              <Image
                resizeMode="contain"
                style={{
                  borderRadius: sizes[4],
                  width: imageBuilder.Width,
                  height: imageBuilder.Height,
                }}
                source={{
                  uri: picture?.path ?? getImageByGift(defaultGift),
                }}
              />
              <IconButton
                onPress={() => setIsRemovePicture(true)}
                style={{
                  backgroundColor: colorWithOpacity(primary, 0.7),
                  borderRadius: sizes[6],
                  width: sizes[32],
                  height: sizes[32],
                  position: 'absolute',
                  right: sizes[12],
                  top: sizes[12],
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                icon={{
                  name: 'TrashIcon',
                  size: sizes[16],
                  fill: reverseText,
                }}
              />
            </TouchableOpacityDelay>
          ) : (
            <BackgroundContent
              style={[
                styles.viewPicture,
                {
                  height: imageBuilder.Height,
                },
              ]}>
              <Icon name="AddPictureIcon" size={sizes[45]} />
              <LinkText style={styles.addPhotoText} type={TypeLinkText.accent} onPress={handleAddPicture}>
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
                  label={`${t('website')}:`}
                  onChangeText={onChange}
                  error={getErrorByObj(errors, 'websiteLink')}
                />
              );
            }}
            name="websiteLink"
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
                    }}
                    value={value ? value.label : ''}
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
                  keyboardType="decimal-pad"
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
              maxWidth: '100%',
            }}>
            <Controller
              control={control}
              render={({onChange, value}) => {
                return (
                  <MyInputText
                    styleCon={{flexGrow: 1, maxWidth: '48.5%'}}
                    defaultValue={value}
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
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyView: {
    flex: 1,
  },
  styleScrollCon: {
    paddingVertical: sizes[15],
    paddingHorizontal: sizes[20],
  },
  btn: {
    paddingVertical: sizes[15],
  },
  line: {
    height: 1,
    marginVertical: sizes[25],
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    position: 'absolute',
    padding: sizes[12],
  },
  viewPicture: {
    borderRadius: sizes[4],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: sizes[20],
  },
  addPhotoText: {
    marginTop: sizes[15],
  },
});
export default AddGiftScreen;
