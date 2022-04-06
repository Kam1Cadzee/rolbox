import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import {useSelector} from 'react-redux';
import {sizes, useTheme} from '../../../context/ThemeContext';
import {selectorsUser} from '../../../redux/user/userReducer';
import {IWishListLabel} from '../../../typings/IWishlist';
import getErrorByObj from '../../../utils/getErrorByObj';
import {getFontFamily} from '../../../utils/getFontFamily';
import getHeightDropdown from '../../../utils/getHeightDropdown';
import t from '../../../utils/t';
import Icon from '../../common/Icons';
import CustomModalDropdown from './CustomModalDropdown';
import LinkText, {TypeLinkText} from '../LinkText';
import MyText from '../MyText';
import TouchableOpacityDelay from '../TouchableOpacityDelay';

interface IDropdownWishlistProps {
  onSelect: (e: any) => any;
  errors: any;
  value: any;
  placeholder?: string;
  onPressExtra?: any;
  name: string;
  isRequired: boolean;
  label: string;
  isWithoutWishlist?: boolean;
}

const dropdownWidth = responsiveScreenWidth(100) - sizes[40];

const DropdownWishlist = ({
  errors,
  onSelect,
  isRequired,
  name,
  value,
  placeholder,
  onPressExtra,
  label,
  isWithoutWishlist = false,
}: IDropdownWishlistProps) => {
  const {accent} = useTheme();
  const selectorWishlistOptions = useSelector(selectorsUser.getOwnedWishlistOptions);
  const wishlistOptions = useMemo(() => {
    if (isWithoutWishlist) {
      return [
        ...selectorWishlistOptions,
        {
          value: -1,
          label: {
            icon: 'ForbiddenIcon',
            name: t('withoutWishlist'),
          },
        },
      ];
    }
    return selectorWishlistOptions;
  }, []);

  return (
    <CustomModalDropdown<IWishListLabel>
      isRequired={isRequired}
      error={getErrorByObj(errors, name)}
      animated={false}
      label={label}
      options={wishlistOptions}
      dropdownStyle={{
        width: dropdownWidth,
        height: getHeightDropdown({
          count: wishlistOptions.length === 0 ? 0 : wishlistOptions.length + 1,
          height: sizes[75],
        }),
      }}
      placeholder={placeholder}
      onSelect={onSelect}
      value={value ? value?.label?.name : ''}
      styleRowComponent={styles.styleRowComponent}
      extraBorder={wishlistOptions.length !== 0}
      extra={
        onPressExtra
          ? ({onPress}) => (
              <TouchableOpacityDelay
                onPress={() => {
                  onPress();
                  onPressExtra();
                }}
                style={styles.extraBtn}>
                <Icon name="PlusIcon" size={sizes[12]} fill={accent} />
                <LinkText style={styles.link} type={TypeLinkText.accent}>
                  {t('addWishlist')}
                </LinkText>
              </TouchableOpacityDelay>
            )
          : undefined
      }
      renderRow={(d) => {
        return (
          <React.Fragment>
            <Icon name={d.option.label.icon} size={sizes[25]} />
            <MyText style={styles.text}>{d.option.label.name}</MyText>
          </React.Fragment>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  styleRowComponent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: sizes[20],
  },
  text: {
    fontFamily: getFontFamily(500),
    marginLeft: sizes[20],
    maxWidth: responsiveScreenWidth(65),
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
export default DropdownWishlist;
