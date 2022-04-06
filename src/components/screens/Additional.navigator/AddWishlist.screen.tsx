import React, {useEffect, useRef, useState} from 'react';
import {KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Controller, useForm} from 'react-hook-form';
import {useDispatch, useSelector} from 'react-redux';
import {sizes, useTheme} from '../../../context/ThemeContext';
import {AddWishlistScreenProps} from '../../navigators/Additional.navigator';
import MyInputText from '../../controls/MyInputText';
import getErrorByObj from '../../../utils/getErrorByObj';
import MyText from '../../controls/MyText';
import coverOptions, {getCoverOptionByIcon} from '../../../mockData/coverOptions';
import CoverItem from '../../common/CoverItem';
import {getFontFamily} from '../../../utils/getFontFamily';
import RadioButton from '../../controls/RadioButton';
import MyButton, {TypeButton} from '../../controls/MyButton';
import useDidUpdateEffect from '../../../useHooks/useDidUpdateEffect';
import {IWishlist, IWishlistClientPost, IWishListPost} from '../../../typings/IWishlist';
import wishListService from '../../../services/wishListService/wishListService';
import {actionsUser, selectorsUser} from '../../../redux/user/userReducer';
import useValidation from '../../../utils/validation';
import VisibilityType, {useVisibilityByTypeFunc, useVisibilityOptions} from '../../../typings/VisibilityType';
import normalizeData from '../../../utils/normalizeData';
import useAxios from '../../../useHooks/useAxios';
import t from '../../../utils/t';
import {UserExtension} from '../../../typings/IUser';
import RowSelectedUser from '../../common/RowSelectedUser';

const AddWishlistScreen = ({navigation, route}: AddWishlistScreenProps) => {
  const refScroll = useRef<any>();
  const dispatch = useDispatch();
  const validation = useValidation();
  const user = useSelector(selectorsUser.getUser)!;
  const defaultWishlist = route && route.params ? route.params.wishlist : undefined;
  const defaultAddress = route && route.params ? route.params.address : undefined;
  const isBackToAddGift = route && route.params ? route.params.isBackToAddGift : undefined;
  const isBackToAddEvent = route && route.params ? route.params.isBackToAddEvent : undefined;
  const updatedPeople = route && route.params ? route.params.updatedPeople : undefined;

  const privateOptions = useVisibilityOptions();
  const funcGetPrivate = useVisibilityByTypeFunc();

  const defaultCoverSelected = defaultWishlist ? getCoverOptionByIcon(defaultWishlist.coverCode) : coverOptions[0];
  const defaultPrivateSelected = defaultWishlist ? funcGetPrivate(defaultWishlist.visibility) : null;

  const defaultSelectedUsers = useSelector(selectorsUser.getFriendsByIds(defaultWishlist?.showUsers ?? []));
  const [selectedUsers, setSelectedUsers] = useState(defaultSelectedUsers);
  const [coverSelected, setCoverSelected] = useState(defaultCoverSelected);
  const [privateSelected, setPrivateSelected] = useState(defaultPrivateSelected);
  const [address, setAddress] = useState(defaultWishlist?.address);
  const {errorColor, lightText} = useTheme();
  const [customErrors, setCustomErrors] = useState({});
  const {control, handleSubmit, errors} = useForm({
    reValidateMode: 'onChange',
    mode: 'onChange',
    defaultValues: defaultWishlist,
  });
  const [isLoading, setIsLoading] = useState(false);
  const {request} = useAxios(defaultWishlist ? wishListService.updateWishlist : wishListService.createWishList);

  useDidUpdateEffect(() => {
    setSelectedUsers(updatedPeople ?? []);
  }, [updatedPeople]);

  useDidUpdateEffect(() => {
    setAddress(defaultAddress);
  }, [defaultAddress]);

  useEffect(() => {
    const findIndex = coverOptions.findIndex((opt) => opt.id === defaultCoverSelected.id);
    const scrollX = findIndex * sizes[45];
    if (refScroll.current) {
      refScroll.current.scrollTo({
        x: scrollX,
        animated: false,
      });
    }
  }, []);

  const onSubmit = async (data: IWishlistClientPost) => {
    if (!privateSelected) {
      setCustomErrors({
        visibility: validation.required.validate(''),
      });
      return;
    }
    setIsLoading(true);
    const dataFetch: IWishListPost = {
      name: data.name,
      visibility: privateSelected.value,
      coverCode: coverSelected.icon,
      forWhom: normalizeData(data.forWhom),
      note: normalizeData(data.note),
      address,
      showUsers: selectedUsers.map((u) => u._id),
    };

    const res = await request<IWishlist>(defaultWishlist ? {id: defaultWishlist._id, data: dataFetch} : dataFetch);
    if (!res.success) {
      setIsLoading(false);
      return;
    }

    try {
      res.data.gifts = defaultWishlist?.gifts ?? [];
      dispatch(actionsUser.addOwnedWishlist(res.data));

      if (isBackToAddGift) {
        navigation.replace('AdditionalNavigator', {
          screen: 'AddGift',
          params: {
            throwIdWishlist: res.data!._id,
          },
        });
      } else if (isBackToAddEvent) {
        navigation.navigate('AdditionalNavigator', {
          screen: 'AddEvent',
          params: {
            throwIdWishlist: res.data!._id,
          },
        });
      } else {
        navigation.navigate('MainNavigator', {
          screen: 'InvisibleNavigator',
          params: {
            screen: 'WishlistInteract',
            params: {
              idDefaultWishlist: res.data!._id,
            },
          },
        });
      }
    } catch {
      setIsLoading(false);
    }
  };

  const navigateToAddUsers = () => {
    navigation.navigate('AdditionalNavigator', {
      screen: 'AddPeople',
      params: {
        people: selectedUsers,
      },
    });
  };

  const navigateToAddAddress = () => {
    navigation.navigate('AddAddress', {});
  };

  const navigateToChangeAddress = () => {
    navigation.navigate('AddAddress', {
      address,
    });
  };

  const isAddress = !!address;

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={sizes[70]}
      enabled
      style={{flexGrow: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={[styles.safeView]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={[styles.styleScrollCon]}>
          <Controller
            control={control}
            render={({onChange, value}) => {
              return (
                <MyInputText
                  defaultValue={value}
                  isRequired
                  label={`${t('name')}: `}
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
                  defaultValue={value}
                  isRequired={true}
                  label={`${t('wishlistFor')}:`}
                  onChangeText={onChange}
                  error={getErrorByObj(errors, 'forWhom')}
                />
              );
            }}
            name="forWhom"
            rules={validation.required}
            defaultValue={UserExtension.fullName(user)}
          />
          <MyText>
            {t('chooseCover')} <MyText style={{color: errorColor}}>*</MyText>
          </MyText>
          <ScrollView
            ref={refScroll}
            contentContainerStyle={{
              marginHorizontal: -sizes[9],
            }}
            style={{
              paddingVertical: sizes[10],
            }}
            horizontal={true}
            showsHorizontalScrollIndicator={false}>
            {coverOptions.map((item) => {
              const isSelected = coverSelected ? coverSelected.id === item.id : false;
              return (
                <CoverItem
                  conStyle={styles.coverItem}
                  key={item.id}
                  isSelected={isSelected}
                  item={item}
                  setSelected={setCoverSelected}
                />
              );
            })}
          </ScrollView>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <MyText>
              {t('whoCanSee')} <MyText style={{color: errorColor}}>*</MyText>
            </MyText>
            {customErrors['visibility'] && <MyText style={{color: errorColor}}>{customErrors['visibility']}</MyText>}
          </View>

          {privateOptions.map((option) => {
            const isSelected = privateSelected ? privateSelected.value === option.value : false;
            return (
              <View key={option.value} style={styles.viewItem}>
                <MyText style={styles.bold}>
                  {`${option.label.title} `}
                  <MyText style={{color: lightText}}>({option.label.private})</MyText>
                </MyText>
                <RadioButton label="" onPress={() => setPrivateSelected(option)} selected={isSelected} />
              </View>
            );
          })}
          {privateSelected?.value === VisibilityType.specific && (
            <RowSelectedUser styleCon={{marginTop: sizes[20]}} onPress={navigateToAddUsers} users={selectedUsers} />
          )}
          {/* <WrapperInput
            styleCon={[styles.title]}
            innerCon={{
              borderWidth: isAddress ? 0 : 1,
            }}
            label={t('addressGift')}
            isFocus={false}>
            {isAddress ? (
              <BackgroundContent style={styles.viewAddress}>
                <MyText
                  style={{
                    width: '95%',
                  }}>
                  {joinWithComma(address)}
                </MyText>
                <IconButton
                  onPress={navigateToChangeAddress}
                  icon={{
                    name: 'EditIcon',
                    size: sizes[16],
                    fill: text,
                  }}
                />
              </BackgroundContent>
            ) : (
              <LinkText onPress={navigateToAddAddress} style={styles.innerInput} type={TypeLinkText.text}>
                + {t('address')}
              </LinkText>
            )}
          </WrapperInput> */}
          <Controller
            control={control}
            render={({onChange, value}) => {
              return (
                <MyInputText
                  styleCon={{
                    marginTop: sizes[15],
                  }}
                  defaultValue={value}
                  label={`${t('note')}: `}
                  onChangeText={onChange}
                  error={getErrorByObj(errors, 'note')}
                />
              );
            }}
            name="note"
          />
          <MyButton isLoading={isLoading} onPress={handleSubmit(onSubmit)} type={TypeButton.secondary}>
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
  safeView: {
    marginHorizontal: sizes[20],
  },
  styleScroll: {
    flex: 1,
  },
  styleScrollCon: {
    paddingVertical: sizes[15],
  },
  coverItem: {
    marginHorizontal: sizes[9],
  },
  bold: {
    fontFamily: getFontFamily(500),
  },
  viewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: sizes[15],
  },
  title: {
    marginTop: sizes[25],
    marginBottom: sizes[8],
  },
  innerInput: {
    padding: sizes[15],
  },
  viewAddress: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});
export default AddWishlistScreen;
