import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import {sizes, useTheme} from '../../../context/ThemeContext';
import useDidUpdateEffect from '../../../useHooks/useDidUpdateEffect';
import getErrorByObj from '../../../utils/getErrorByObj';
import {getFontFamily} from '../../../utils/getFontFamily';
import MyTextInput from '../MyInputText';
import Dropdown from './Dropdown';

interface IIdentifier {
  id?: any;
  _id?: any;
}
interface IRenderItemList<T> {
  item: T;
  index: number;
  items: T[];
}
interface IRenderItemListSelect<T> extends IRenderItemList<T> {
  isSelected: boolean;
  onSelect: (item: T, isSelected: boolean) => void;
}
interface IRenderItemListRemove<T> extends IRenderItemList<T> {
  onRemove: (item: T) => void;
}
interface IDropdownMultiSelectProps<T> {
  label: string;
  name: string;
  errors: any;
  isRequired: boolean;
  onChange: any;
  items: T[];
  defaultSelected?: T[];
  renderItemList: (item: IRenderItemListSelect<T>) => any;
  renderSelectedItem: (item: IRenderItemListRemove<T>) => any;
  filterSearch?: (item: T, search: string) => boolean;
}

const DropdownMultiSelect = <T extends IIdentifier>({
  errors,
  isRequired,
  label,
  name,
  onChange,
  defaultSelected = [],
  items,
  renderItemList: RenderItemList,
  renderSelectedItem: RenderSelectedItem,
  filterSearch = () => true,
}: IDropdownMultiSelectProps<T>) => {
  const {text, accent} = useTheme();
  const [textValue, setTextValue] = useState('');
  const [selectedItems, setSelectedItems] = useState<T[]>(defaultSelected);
  const [preSelectedItems, setPreSelectedItems] = useState<T[]>([]);

  const handleSelect = (item: T, isSelected: boolean) => {
    if (isSelected) {
      setPreSelectedItems((items) => {
        return items.filter((si) => si !== item);
      });
    } else {
      setPreSelectedItems((items) => {
        return [...items, item];
      });
    }
  };

  const handleHideDropdown = () => {
    setSelectedItems((items) => {
      return [...items, ...preSelectedItems];
    });
    setPreSelectedItems([]);
  };

  const handleRemove = (item: T) => {
    setSelectedItems((items) => {
      return items.filter((innerItem) => item !== innerItem);
    });
  };

  useDidUpdateEffect(() => {
    onChange(selectedItems);
  }, [selectedItems]);

  const filterItems = items.filter((item) => {
    return !selectedItems.some((si) => si._id === item._id) && filterSearch(item, textValue);
  });

  return (
    <Dropdown
      label={label}
      isRequired={isRequired}
      error={getErrorByObj(errors, name)}
      onDropdownWillHide={handleHideDropdown}
      isCoverDropdown={true}
      animated={false}
      styleTouchable={styles.styleTouchable}
      renderButtonComponent={selectedItems.map((item, index) => {
        return (
          <RenderSelectedItem
            key={item._id ?? item.id}
            index={index}
            items={selectedItems}
            item={item}
            onRemove={handleRemove}
          />
        );
      })}
      dropdownStyle={styles.dropdownStyle}>
      {({onClose}) => (
        <View
          style={{
            height: sizes[200],
          }}>
          <MyTextInput
            value={textValue}
            onChangeText={setTextValue}
            style={[styles.textInput]}
            styleWrapper={[styles.styleWrapper, {borderColor: text}]}
            styleCon={styles.styleCon}
          />
          <ScrollView
            focusable={false}
            alwaysBounceVertical={false}
            bounces={false}
            keyboardShouldPersistTaps={'never'}
            keyboardDismissMode={'none'}>
            {filterItems.map((item, index) => {
              const isSelected = preSelectedItems.some((si) => si === item);
              return (
                <RenderItemList
                  key={item._id ?? item.id}
                  index={index}
                  item={item}
                  items={filterItems}
                  onSelect={handleSelect}
                  isSelected={isSelected}
                />
              );
            })}
          </ScrollView>
        </View>
      )}
    </Dropdown>
  );
};

const styles = StyleSheet.create({
  dropdownStyle: {
    width: responsiveScreenWidth(100) - sizes[38],
  },
  styleWrapper: {
    borderTopWidth: 0,
    marginHorizontal: -sizes[1],
  },
  textInput: {
    fontFamily: getFontFamily(300),
  },
  styleCon: {
    marginBottom: 0,
  },
  styleTouchable: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: sizes[4],
    paddingHorizontal: sizes[8],
    minHeight: sizes[48],
  },
});

export {IRenderItemListRemove, IRenderItemListSelect};
export default DropdownMultiSelect;
