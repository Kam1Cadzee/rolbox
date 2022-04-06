import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Dimensions, StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {sizes, useTheme} from '../../context/ThemeContext';
import coverOptions from '../../mockData/coverOptions';
import wishListService from '../../services/wishListService/wishListService';
import {UserExtension} from '../../typings/IUser';
import {IWishlist, IWishlistClientPost, IWishListPost} from '../../typings/IWishlist';
import {useVisibilityOptions} from '../../typings/VisibilityType';
import useAxios from '../../useHooks/useAxios';
import useDidUpdateEffect from '../../useHooks/useDidUpdateEffect';
import getErrorByObj from '../../utils/getErrorByObj';
import {getFontFamily} from '../../utils/getFontFamily';
import normalizeData from '../../utils/normalizeData';
import t from '../../utils/t';
import useValidation from '../../utils/validation';
import CoverItem from '../common/CoverItem';
import MyButton, {TypeButton} from '../controls/MyButton';
import MyInputText from '../controls/MyInputText';
import MyText from '../controls/MyText';
import RadioButton from '../controls/RadioButton';

const width = Dimensions.get('screen').width;

interface IShareAddWishlistProps {
  scrollToGift: any;
  setAddedWishlist: any;
  userName: string;
}

const ShareAddWishlist = ({scrollToGift, userName, setAddedWishlist}: IShareAddWishlistProps) => {
  const validation = useValidation();
  const privateOptions = useVisibilityOptions();
  const {errorColor, lightText} = useTheme();

  const [isLoading, setIsLoading] = useState(false);
  const {request} = useAxios(wishListService.createWishList);
  const [coverSelected, setCoverSelected] = useState(coverOptions[0]);
  const [privateSelected, setPrivateSelected] = useState(privateOptions[0]);

  const {control, handleSubmit, errors, reset} = useForm({
    reValidateMode: 'onChange',
    mode: 'onChange',
  });

  useDidUpdateEffect(() => {
    reset({
      forWhom: userName,
    });
  }, [userName]);

  const onSubmit = async (data: IWishlistClientPost) => {
    setIsLoading(true);
    const dataFetch: IWishListPost = {
      name: data.name,
      visibility: privateSelected.value,
      coverCode: coverSelected.icon,
      forWhom: normalizeData(data.forWhom),
      note: normalizeData(data.note),
    };

    const res = await request<IWishlist>(dataFetch);
    if (!res.success) {
      setIsLoading(false);
      return;
    }

    try {
      reset({
        name: '',
        note: '',
      });
      setCoverSelected(coverOptions[0]);
      setPrivateSelected(privateOptions[0]);
      setAddedWishlist((data) => {
        return [...data, res.data!];
      });
      scrollToGift();
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View
      style={{
        flexGrow: 1,
        width,
        backgroundColor: 'white',
        paddingHorizontal: sizes[20],
      }}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false} contentContainerStyle={[styles.styleScrollCon]}>
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
          defaultValue={userName}
        />
        <MyText>
          {t('chooseCover')} <MyText style={{color: errorColor}}>*</MyText>
        </MyText>
        <ScrollView
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
        <MyText>{t('whoCanSee')}</MyText>
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
    </View>
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
export default ShareAddWishlist;
