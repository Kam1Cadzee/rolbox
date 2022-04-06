import React, {useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import {useSelector} from 'react-redux';
import {sizes, useTheme} from '../../../context/ThemeContext';
import {selectorsUser} from '../../../redux/user/userReducer';
import {IUser, UserExtension} from '../../../typings/IUser';
import Icon from '../../common/Icons';
import MyText from '../MyText';
import TouchableOpacityDelay from '../TouchableOpacityDelay';
import DropdownMultiSelect, {IRenderItemListRemove, IRenderItemListSelect} from './DropdownMultiSelect';

interface IDropdownGuestsProps {
  label: string;
  name: string;
  errors: any;
  isRequired: boolean;
  onChange: any;
  defaultSelectedGuests?: IUser[];
}

const sizeSmallView = Math.floor(sizes[24]);

const RenderItemList = ({index, item, items, onSelect, isSelected}: IRenderItemListSelect<IUser>) => {
  const {secondaryDark, reverseText} = useTheme();

  return (
    <TouchableOpacityDelay onPress={() => onSelect(item, isSelected)} key={item._id} style={styles.renderItem}>
      <View style={styles.renderItemView}>
        {UserExtension.isImage(item) ? (
          <Image
            style={styles.itemImage}
            resizeMode={'cover'}
            source={{
              uri: UserExtension.image(item),
            }}
          />
        ) : (
          <Icon name="AvatarIcon" size={sizeSmallView} />
        )}
        <MyText numberOfLines={2} style={styles.text}>
          {UserExtension.fullName(item)}
        </MyText>
      </View>
      {isSelected && (
        <TouchableOpacityDelay
          onPress={() => onSelect(item, isSelected)}
          style={[
            styles.closeView,
            {
              backgroundColor: secondaryDark,
            },
          ]}>
          <Icon name="CrossIcon" size={sizes[10]} fill={reverseText} />
        </TouchableOpacityDelay>
      )}
    </TouchableOpacityDelay>
  );
};

const RenderSelectedItemList = ({index, item, items, onRemove}: IRenderItemListRemove<IUser>) => {
  const [readyRemove, setReadyRemove] = useState(false);
  const {secondary, secondaryDark, reverseText, backgroundLight} = useTheme();

  const handlePress = () => {
    setReadyRemove((s) => !s);
  };

  return (
    <TouchableOpacityDelay
      onPress={handlePress}
      key={item._id}
      style={[
        styles.renderSelectedItem,
        {
          backgroundColor: readyRemove ? secondary : backgroundLight,
        },
      ]}>
      {readyRemove ? (
        <TouchableOpacityDelay
          onPress={() => onRemove(item)}
          style={[
            styles.closeView,
            {
              backgroundColor: secondaryDark,
            },
          ]}>
          <Icon name="CrossIcon" size={sizes[10]} fill={reverseText} />
        </TouchableOpacityDelay>
      ) : UserExtension.isImage(item) ? (
        <Image
          style={styles.itemImage}
          resizeMode={'cover'}
          source={{
            uri: UserExtension.image(item),
          }}
        />
      ) : (
        <Icon name="AvatarIcon" size={sizeSmallView} />
      )}
      <MyText numberOfLines={2} style={styles.text}>
        {UserExtension.fullName(item)}
      </MyText>
    </TouchableOpacityDelay>
  );
};

const DropdownGuests = ({errors, isRequired, label, name, onChange, defaultSelectedGuests}: IDropdownGuestsProps) => {
  const users = useSelector(selectorsUser.getFriends);

  const handleFilter = (user: IUser, search: string) => {
    const fullName = UserExtension.fullName(user).toLocaleLowerCase();
    const str = search.toLowerCase();
    return fullName.indexOf(str) !== -1;
  };

  return (
    <DropdownMultiSelect<IUser>
      errors={errors}
      renderItemList={RenderItemList}
      renderSelectedItem={RenderSelectedItemList}
      isRequired={isRequired}
      items={users}
      label={label}
      name={name}
      onChange={onChange}
      defaultSelected={defaultSelectedGuests}
      filterSearch={handleFilter}
    />
  );
};

const styles = StyleSheet.create({
  closeView: {
    width: sizeSmallView,
    height: sizeSmallView,
    borderRadius: sizes[6],
    justifyContent: 'center',
    alignItems: 'center',
  },
  renderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: sizes[8],
    marginVertical: sizes[1],
    paddingLeft: sizes[10],
    paddingRight: sizes[10],
    paddingVertical: sizes[8],
    borderRadius: sizes[32],
  },
  renderItemView: {
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
  },
  renderSelectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: sizes[32],
    paddingLeft: sizes[10],
    paddingRight: sizes[20],
    paddingVertical: sizes[8],
    margin: sizes[3],
  },
  text: {
    marginLeft: sizes[10],
    maxWidth: responsiveScreenWidth(60),
  },
  itemImage: {
    width: sizeSmallView,
    height: sizeSmallView,
    borderRadius: sizes[6],
  },
});
export default DropdownGuests;
