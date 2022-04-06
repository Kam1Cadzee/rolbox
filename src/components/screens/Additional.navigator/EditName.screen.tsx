import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {sizes} from '../../../context/ThemeContext';
import {actionsUser, selectorsUser} from '../../../redux/user/userReducer';
import authService from '../../../services/authService/authService';
import {IUserPost, UserExtension} from '../../../typings/IUser';
import {getFontFamily} from '../../../utils/getFontFamily';
import t from '../../../utils/t';
import useValidation from '../../../utils/validation';
import MyButton, {TypeButton} from '../../controls/MyButton';
import MyInputText from '../../controls/MyInputText';
import MyText from '../../controls/MyText';
import {EditNameScreenProps} from '../../navigators/Additional.navigator';

const EditNameScreen = ({navigation}: EditNameScreenProps) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const user = useSelector(selectorsUser.getUser);
  const [fullName, setFullName] = useState(UserExtension.fullName(user));

  const handleSubmit = async () => {
    const fetchData = convertData();
    authService.updateProfile(fetchData);
    dispatch(
      actionsUser.setName({
        firstName: fetchData.firstName,
        lastName: fetchData.lastName,
      }),
    );
    navigation.navigate('MainNavigator', {
      screen: 'Profile',
    });
  };

  const convertData = () => {
    const keys = [
      'birthday',
      'country',
      'state',
      'city',
      'hobbies',
      'gender',
      'maritalStatus',
      'weight',
      'height',
      'size',
      'shoeSize',
      'hideBirthday',
    ];
    const obj: any = {};
    keys.forEach((key) => {
      obj[key] = user[key];
    });
    const [firstName, lastName = ''] = fullName.split(' ');
    const data: IUserPost = {
      firstName,
      lastName,
      ...obj,
    };
    return data;
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.contentContainerStyle,
        {
          marginBottom: insets.bottom,
        },
      ]}>
      <View style={styles.viewTop}>
        <MyText style={styles.text}>{t('enterYourName')}</MyText>
        <MyInputText
          styleWrapper={styles.textInputWrapper}
          style={styles.textInput}
          isRequired={false}
          label={''}
          value={fullName}
          onChangeText={setFullName}
        />
      </View>
      <MyButton
        onPress={handleSubmit}
        disabled={fullName.trim() === ''}
        styleText={{
          fontSize: sizes[16],
        }}
        type={fullName.trim() === '' ? TypeButton.lightFog : TypeButton.secondary}>
        {t('continue')}
      </MyButton>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    marginHorizontal: sizes[20],
    justifyContent: 'space-between',
    flex: 1,
  },
  viewTop: {
    marginTop: responsiveScreenHeight(30),
  },
  text: {
    textAlign: 'center',
    fontFamily: getFontFamily(700),
    fontSize: sizes[24],
    marginBottom: sizes[40],
  },
  textInputWrapper: {
    borderWidth: 0,
    borderBottomWidth: 1,
  },
  textInput: {
    textAlign: 'center',
    fontSize: sizes[16],
  },
});
export default EditNameScreen;
