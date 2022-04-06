import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {sizes, useTheme} from '../../context/ThemeContext';
import {FilterMessenger} from '../../typings/IChat';
import IOption from '../../typings/IOption';
import {getFontFamily} from '../../utils/getFontFamily';
import t from '../../utils/t';
import VerticalTabs from '../common/VerticalTabs';
import IconButton from '../controls/IconButton';
import MyTextInput from '../controls/MyInputText';
import MyText from '../controls/MyText';

interface IHeaderMessengerProps {
  options: IOption<string, FilterMessenger>[];
  selected: IOption<string, FilterMessenger>;
  onSelected: (s: IOption<string, FilterMessenger>) => void;
  defaultSearch: string;
  onSubmitSearch: (s: string) => void;
}

const HeaderMessenger = ({onSelected, options, selected, defaultSearch, onSubmitSearch}: IHeaderMessengerProps) => {
  const {text} = useTheme();
  const [isShowSearchBar, setIsShowSearchBar] = useState(false);
  const [search, setSearch] = useState(defaultSearch);

  const handleSubmit = (text: string) => {
    setSearch(text);
    onSubmitSearch(text.toLowerCase());
  };

  return (
    <View style={[styles.topView]}>
      {isShowSearchBar ? (
        <MyTextInput
          styleWrapper={{
            borderWidth: 0,
            borderBottomWidth: 1,
          }}
          autoFocus
          onBlur={() => setIsShowSearchBar(false)}
          value={search}
          onChangeText={handleSubmit}
          rightComponent={
            <IconButton
              style={{
                marginRight: sizes[16],
              }}
              onPress={() => {
                setIsShowSearchBar(false);
                handleSubmit('');
              }}
              icon={{
                name: 'CrossIcon',
                size: sizes[10],
                fill: text,
              }}
            />
          }
        />
      ) : (
        <View style={styles.viewSearchBar}>
          <MyText style={styles.title}>{t('titleMessenger')}</MyText>
          <IconButton
            onPress={() => setIsShowSearchBar(true)}
            icon={{
              name: 'SearchIcon',
              size: sizes[16],
              fill: text,
            }}
          />
        </View>
      )}

      <VerticalTabs<string> options={options} select={selected} setOption={onSelected} />
    </View>
  );
};

const styles = StyleSheet.create({
  topView: {
    marginHorizontal: sizes[20],
  },
  viewSearchBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: getFontFamily(700),
    fontSize: sizes[24],
    marginTop: sizes[24],
    marginBottom: sizes[25],
  },
});

export default HeaderMessenger;
