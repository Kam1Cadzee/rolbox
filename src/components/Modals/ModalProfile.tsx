import React, {useState} from 'react';
import {Linking, StyleSheet, View} from 'react-native';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MyText from '../controls/MyText';
import {getFontFamily} from '../../utils/getFontFamily';
import {sizes, useTheme} from '../../context/ThemeContext';
import ModalLogout from './ModalLogout';
import Icon from '../common/Icons';
import CustomModalDropdown from '../controls/Dropdown/CustomModalDropdown';
import IOption from '../../typings/IOption';
import t from '../../utils/t';
import IconButton from '../controls/IconButton';
import {useNavigation} from '@react-navigation/core';
import TouchableOpacityDelay from '../controls/TouchableOpacityDelay';

interface IModalPlusProps {}

const ModalProfile = ({}: IModalPlusProps) => {
  const navigation = useNavigation();
  const options = [
    {
      label: t('privacyPolicy'),
      value: '1',
    },
    {label: t('logOut'), value: '0'},
  ];
  const insets = useSafeAreaInsets();
  const {border, text, secondary} = useTheme();
  const [isLogout, setIsLogout] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (o: IOption<string>) => {
    switch (o.value) {
      case '0':
        setIsLogout(true);
        break;
      case '1':
        Linking.openURL('https://rolbox.app/privacy-policy/');
        break;
      default:
    }
  };

  const navigateToCalendar = () => {
    navigation.navigate('AdditionalNavigator', {
      screen: 'Calendar',
    });
  };
  return (
    <View
      style={[
        styles.con,
        {
          marginTop: insets.top ? 0 : sizes[20],
        },
      ]}>
      <CustomModalDropdown
        onDropdownWillShow={() => {
          setIsOpen(true);
        }}
        onDropdownWillHide={() => {
          setIsOpen(false);
        }}
        renderButtonComponent={(props: any) => (
          <TouchableOpacityDelay
            style={[styles.btn]}
            ref={props.forwardRef}
            hitSlop={{
              right: sizes[20],
              top: sizes[20],
              left: sizes[20],
              bottom: sizes[20],
            }}
            {...props}>
            <MyText style={[styles.text]}>{t('myProfile')}</MyText>
            <Icon name={isOpen ? 'ArrowUpIcon' : 'ArrowDownIcon'} size={sizes[12]} fill={text} />
          </TouchableOpacityDelay>
        )}
        label=""
        animated={false}
        dropdownStyle={styles.dropdownStyle}
        styleRowComponent={styles.styleRowComponent}
        renderSeparator={() => {
          return <View style={{height: 1, backgroundColor: border}} />;
        }}
        options={options}
        onSelect={handleSelect}
      />
      <IconButton
        onPress={navigateToCalendar}
        icon={{
          name: 'CalendarIcon',
          fill: secondary,
          size: sizes[20],
        }}
      />
      <ModalLogout modalVisible={isLogout} onClose={() => setIsLogout(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  con: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: sizes[20],
  },
  text: {
    fontFamily: getFontFamily(500),
    paddingRight: sizes[16],
  },
  dropdownStyle: {
    width: responsiveScreenWidth(61),
    height: 'auto',
    marginLeft: sizes[70],
    borderWidth: 0,

    shadowColor: 'rgb(118, 105, 103)',
    shadowOffset: {
      width: 0,
      height: sizes[4],
    },
    shadowOpacity: 0.2,
    shadowRadius: sizes[20],
    elevation: 10,
  },
  styleRowComponent: {
    padding: sizes[16],
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ModalProfile;
