import React, {useEffect} from 'react';
import {KeyboardAvoidingView, SafeAreaView, Platform, StyleSheet} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Controller, useForm} from 'react-hook-form';
import {AddAddressScreenProps} from '../../navigators/Additional.navigator';
import {sizes} from '../../../context/ThemeContext';
import useValidation from '../../../utils/validation';
import MyInputText from '../../controls/MyInputText';
import getErrorByObj from '../../../utils/getErrorByObj';
import MyButton, {TypeButton} from '../../controls/MyButton';
import IAddress from '../../../typings/IAddress';
import normalizeData from '../../../utils/normalizeData';
import t from '../../../utils/t';

const useDataAddAddress = () => {
  const validation = useValidation();
  return [
    {
      name: 'addressLineOne',
      label: t('addressLine2'),
      isRequired: false,
    },
    {
      name: 'addressLineTwo',
      label: t('addressLine1'),
      isRequired: false,
    },
    {
      name: 'city',
      label: t('city'),
      isRequired: false,
    },
    {
      name: 'state',
      label: t('stateRegionProvince'),
      isRequired: false,
    },
    {
      name: 'zip',
      label: t('zip'),
      isRequired: false,
    },
    {
      name: 'country',
      label: t('country'),
      isRequired: false,
    },
  ];
};
const AddAddressScreen = ({route, navigation}: AddAddressScreenProps) => {
  const defaultAddress = route.params ? route.params.address : undefined;
  const options = useDataAddAddress();
  const {control, handleSubmit, errors} = useForm({
    reValidateMode: 'onChange',
    mode: 'onChange',
    defaultValues: defaultAddress,
  });

  useEffect(() => {
    if (defaultAddress) {
      navigation.setOptions({
        title: t('changeAddress'),
      });
    }
  }, []);

  const onSubmit = (data: IAddress) => {
    navigation.navigate('AddWishlist', {
      address: Object.keys(data).reduce((a, b) => {
        const value = data[b];
        a[b] = normalizeData(value);
        return a;
      }, {}),
    });
  };

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={Platform.OS === 'ios' ? sizes[70] : -sizes[70]}
      style={styles.keyView}
      enabled
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}>
      <SafeAreaView style={styles.safeView}>
        <ScrollView
          style={styles.styleScroll}
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={styles.styleScrollCon}>
          {options.map((item, i) => {
            return (
              <Controller
                key={i}
                control={control}
                name={item.name}
                render={({onChange, value}) => {
                  return (
                    <MyInputText
                      isRequired={item.isRequired}
                      label={item.label}
                      onChangeText={onChange}
                      error={getErrorByObj(errors, item.name)}
                      defaultValue={value}
                    />
                  );
                }}
              />
            );
          })}
        </ScrollView>
        <MyButton onPress={handleSubmit(onSubmit)} type={TypeButton.secondary}>
          Save
        </MyButton>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyView: {
    flex: 1,
  },
  safeView: {
    flex: 1,
    marginHorizontal: sizes[20],
    marginBottom: sizes[20],
  },
  styleScroll: {
    flex: 1,
    marginBottom: sizes[20],
  },
  styleScrollCon: {
    paddingVertical: sizes[15],
  },
});

export default AddAddressScreen;
