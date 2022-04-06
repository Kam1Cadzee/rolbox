import React, {useEffect, useMemo, useRef, useState} from 'react';
import {KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {Controller, useForm} from 'react-hook-form';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker';
import {EditProfileScreenProps} from '../../navigators/Additional.navigator';
import MyInputText from '../../controls/MyInputText';
import {sizes, useTheme} from '../../../context/ThemeContext';
import LinkText, {TypeLinkText} from '../../controls/LinkText';
import Avatar from '../../Profile/Avatar';
import {actionsUser, selectorsUser} from '../../../redux/user/userReducer';
import getErrorByObj from '../../../utils/getErrorByObj';
import useValidation from '../../../utils/validation';
import MyButton, {TypeButton} from '../../controls/MyButton';
import TouchableInputWithModal, {TypeInputModal} from '../../controls/TouchableInputWithModal';
import IUnit from '../../../typings/IUnit';
import TypeWeight, {formatUnitWeightValue, useTranslateUnitWeight} from '../../../typings/TypeWeight';
import TypeHeight, {useFormatUnitHeightValue} from '../../../typings/TypeHeight';
import {IClientUserPost, IUserPost, UserExtension} from '../../../typings/IUser';
import authService from '../../../services/authService/authService';
import CustomModalDropdown from '../../controls/Dropdown/CustomModalDropdown';
import normalizeData, {normalizeDate} from '../../../utils/normalizeData';
import t from '../../../utils/t';
import useGenderOptions, {useGetLabelGender} from '../../../typings/TypeGender';
import useMaritalStatusOptions, {useGetLabelMaritalStatus} from '../../../typings/TypeMaritalStatus';
import {useFormattingContext} from '../../../context/FormattingContext';
import getCountries, {getCountryByKey} from '../../../utils/getCountries';
import getHeightDropdown from '../../../utils/getHeightDropdown';
import {getLabelStatusBirthday, useGetStatusBirthday} from '../../../typings/TypeBirthday';
import IconButton from '../../controls/IconButton';
import useDidUpdateEffect from '../../../useHooks/useDidUpdateEffect';
import wishListService from '../../../services/wishListService/wishListService';
import VisibilityType from '../../../typings/VisibilityType';

enum TypeControl {
  text,
  dropdown,
  modal,
}

const useDataEditProfile = () => {
  const {formatDate, currentLocale} = useFormattingContext();
  const genderOptions = useGenderOptions();
  const maritalStatusOptions = useMaritalStatusOptions();
  const birthdayOptions = useGetStatusBirthday();
  const getLabelGender = useGetLabelGender();
  const getLabelMaritalStatus = useGetLabelMaritalStatus();
  const validation = useValidation();
  const tWeight = useTranslateUnitWeight();
  const user = useSelector(selectorsUser.getUser)!;
  const firstName = useSelector(selectorsUser.getFirstName);
  const lastName = useSelector(selectorsUser.getLastName);
  const formatUnitHeightValue = useFormatUnitHeightValue();

  return useMemo(() => {
    return [
      {
        name: 'firstName',
        label: t('firstName'),
        isRequired: true,
        rules: validation.firstName,
        type: TypeControl.text,
        defaultValue: firstName,
      },
      {
        name: 'lastName',
        label: t('lastName'),
        rules: validation.lastName,
        isRequired: false,
        type: TypeControl.text,
        defaultValue: lastName,
      },
      {
        name: 'birthday',
        label: t('birthday'),
        isRequired: false,
        type: TypeControl.modal,
        typeModal: TypeInputModal.birthday,
        formatStr: (d: Date) => {
          return formatDate(d);
        },
        defaultValue: user.birthday ? new Date(user.birthday) : undefined,
      },
      {
        name: 'hideBirthday',
        label: '',
        isRequired: false,
        type: TypeControl.dropdown,
        options: birthdayOptions,
        defaultValue: user.hideBirthday ?? false,
        getLabel: getLabelStatusBirthday as any,
      },
      {
        name: 'country',
        label: t('country'),
        isRequired: false,
        type: TypeControl.dropdown,
        options: getCountries(currentLocale),
        defaultValue: user.country ?? '',
        getLabel: getCountryByKey(currentLocale) as any,
      },
      {
        name: 'state',
        label: t('state'),
        isRequired: false,
        type: TypeControl.text,
        defaultValue: user.state ?? '',
      },
      {
        name: 'city',
        label: t('city'),
        isRequired: false,
        type: TypeControl.text,
        defaultValue: user.city ?? '',
      },
      {
        name: 'hobbies',
        label: t('hobbies'),
        isRequired: false,
        type: TypeControl.text,
        placeholder: t('hobbiesPlaceholder'),
        defaultValue: (user.hobbies ?? []).join(', '),
      },
      {
        name: 'gender',
        label: t('gender'),
        isRequired: true,
        type: TypeControl.dropdown,
        options: genderOptions,
        defaultValue: user.gender ?? '',
        getLabel: getLabelGender as any,
      },
      {
        name: 'maritalStatus',
        label: t('maritalStatus'),
        isRequired: true,
        type: TypeControl.dropdown,
        options: maritalStatusOptions,
        defaultValue: user.maritalStatus ?? '',
        getLabel: getLabelMaritalStatus as any,
      },

      {
        name: 'weight',
        label: t('weight'),
        isRequired: false,
        type: TypeControl.modal,
        typeModal: TypeInputModal.weight,
        formatStr: (value: IUnit<TypeWeight>) => {
          return `${value.value} ${tWeight(value.unit)}`;
        },
        defaultValue: user.weight ?? undefined,
        isRemove: true,
        clearValue: null,
      },
      {
        name: 'height',
        label: t('height'),
        isRequired: false,
        type: TypeControl.modal,
        typeModal: TypeInputModal.height,
        formatStr: (value: IUnit<TypeHeight>) => {
          return `${formatUnitHeightValue(value.value, value.unit)}`;
        },
        defaultValue: user.height ?? undefined,
        isRemove: true,
        clearValue: null,
      },

      {
        name: 'size',
        label: t('sizeClothes'),
        isRequired: false,
        type: TypeControl.text,
        defaultValue: user.size ?? '',
      },

      {
        name: 'shoeSize',
        label: t('shoeSize'),
        isRequired: false,
        type: TypeControl.text,
        defaultValue: user.shoeSize ?? '',
      },
    ];
  }, []);
};

const EditProfileScreen = ({navigation}: EditProfileScreenProps) => {
  const dispatch = useDispatch();
  const {secondary, text, reverseText} = useTheme();
  const {control, handleSubmit, errors, getValues} = useForm({
    reValidateMode: 'onChange',
    mode: 'onChange',
  });
  const items = useDataEditProfile();
  const user = useSelector(selectorsUser.getUser);
  const isNeededEdit = useSelector(selectorsUser.isNeededEdit);
  const [isRemovePicture, setIsRemovePicture] = useState(!UserExtension.isUploadImage(user));
  const [picture, setPicture] = useState(null as ImageOrVideo | null);
  const [isLoading, setIsLoading] = useState(false);
  const refIsNeededEdit = useRef(isNeededEdit);

  const handleAddPicture = () => {
    ImagePicker.openPicker({
      cropping: true,
      cropperCircleOverlay: true,
      avoidEmptySpaceAroundImage: false,
      mediaType: 'photo',
      cropperActiveWidgetColor: secondary,
      cropperStatusBarColor: secondary,
      cropperToolbarColor: secondary,
      cropperToolbarWidgetColor: reverseText,
    }).then((image) => {
      setPicture(image);
      setIsRemovePicture(false);
    });
  };

  useEffect(() => {
    if (isNeededEdit) {
      navigation.setOptions({
        header: () => null,
      });
    }
    return () => {
      if (refIsNeededEdit.current) {
        const data = getValues() as any;
        const firstName = (user.firstName ?? '').trim();
        if (firstName) {
          onSubmit(data);
        }
      }
    };
  }, []);

  const convertData = (data: IClientUserPost) => {
    const hobbiesStr = data.hobbies?.trim() ?? '';
    const hobbies: string[] = hobbiesStr.length > 0 ? hobbiesStr.split(',').map((s: string) => s.trim()) : [];
    const {gender} = data;
    const {maritalStatus} = data;
    const {birthday} = data;

    const fetchData: IUserPost = {
      ...Object.keys(data).reduce((a, b) => {
        const value = data[b];
        a[b] = normalizeData(value);
        return a;
      }, {} as any),
      hobbies,
      gender: normalizeData(gender),
      maritalStatus: normalizeData(maritalStatus),
      birthday: normalizeDate(birthday),
    };

    console.log('Saved :', fetchData.birthday);

    return fetchData;
  };

  const onSubmit = async (data: IClientUserPost) => {
    const fetchData = convertData(data);

    try {
      setIsLoading(true);
      const res = await authService.updateProfile(fetchData);

      if (res.success) {
        refIsNeededEdit.current = false;
        if (isRemovePicture) {
          await authService.removeImage();
        } else if (picture) {
          const imageRes = await authService.uploadImage(picture!);
          if (imageRes.success) {
            fetchData.image = imageRes.data;
          }
        }
        dispatch(actionsUser.updateUser(fetchData));
        createWishlist(fetchData);

        navigation.goBack();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const createWishlist = (fetchData: any) => {
    if (isNeededEdit) {
      wishListService
        .createWishList({
          coverCode: 'BalloonCoverIcon',
          forWhom: UserExtension.fullName(fetchData),
          name: t('myWishlist'),
          note: '',
          visibility: VisibilityType.private,
        })
        .then((res) => {
          if (res.success) {
            dispatch(actionsUser.addOwnedWishlist(res.data));
          }
        });
    }
  };

  return (
    <KeyboardAvoidingView keyboardVerticalOffset={sizes[70]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView>
        <ScrollView
          nestedScrollEnabled={true}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          bounces={false}>
          <View style={styles.viewAvatar}>
            <Avatar
              onPress={isRemovePicture ? undefined : () => setIsRemovePicture(true)}
              img={isRemovePicture ? UserExtension.image(user, true) : picture?.path ?? UserExtension.image(user)}
            />
            <LinkText type={TypeLinkText.accent} style={styles.textAvatar} onPress={handleAddPicture}>
              {t('editPhoto')}
            </LinkText>
          </View>
          {items.map((item, i) => {
            return (
              <Controller
                key={i}
                control={control}
                render={({onChange, value}: {onChange: any; value: any}) => {
                  if (item.type === TypeControl.text) {
                    return (
                      <MyInputText
                        isRequired={item.isRequired}
                        label={item.label}
                        onChangeText={onChange}
                        error={getErrorByObj(errors, item.name)}
                        placeholder={item.placeholder}
                        defaultValue={item.defaultValue as any}
                      />
                    );
                  } else if (item.type === TypeControl.modal) {
                    return (
                      <TouchableInputWithModal
                        label={item.label}
                        strValue={value && item.formatStr ? item.formatStr(value) : ''}
                        value={value}
                        onSubmit={onChange}
                        type={item.typeModal ?? TypeInputModal.none}
                        isRequired={item.isRequired}
                        clearValue={item.clearValue}
                        isClear={item.isRemove}
                        rightComponent={
                          item.isRemove &&
                          value && (
                            <IconButton
                              onPress={() => onChange(null)}
                              icon={{
                                name: 'TrashIcon',
                                fill: text,
                                size: sizes[14],
                              }}
                            />
                          )
                        }
                      />
                    );
                  }
                  return (
                    <CustomModalDropdown<any>
                      animated={false}
                      showsVerticalScrollIndicator={false}
                      label={item.label}
                      options={item.options || []}
                      onSelect={(item1) => {
                        onChange(item1.value);
                      }}
                      value={item.getLabel(value)}
                      dropdownStyle={{
                        width: responsiveScreenWidth(100) - sizes[40],
                        height: item.name === 'country' ? sizes[240] : undefined,
                      }}
                    />
                  );
                }}
                name={item.name}
                rules={item.rules}
                defaultValue={item.defaultValue!}
              />
            );
          })}
          <MyButton isLoading={isLoading} onPress={handleSubmit(onSubmit)} type={TypeButton.secondary}>
            {t('save')}
          </MyButton>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  con: {},
  scroll: {
    padding: sizes[20],
  },
  viewAvatar: {
    alignItems: 'center',
    marginBottom: sizes[20],
  },
  textAvatar: {
    marginTop: sizes[15],
  },
});
export default EditProfileScreen;
