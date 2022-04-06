import React, {useMemo, useState} from 'react';
import {StyleSheet, SafeAreaView, ScrollView, KeyboardAvoidingView} from 'react-native';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';
import {useSelector} from 'react-redux';
import {sizes, useTheme} from '../../../context/ThemeContext';
import {SelectorsEvent} from '../../../redux/event/eventReducer';
import {FilterMessenger} from '../../../typings/IChat';
import IOption from '../../../typings/IOption';
import {isIOS} from '../../../utils/isPlatform';
import {heightTabBarRef} from '../../../utils/navigationRef';
import t from '../../../utils/t';
import HeaderMessenger from '../../Messenger/HeaderMessenger';
import MessengerItem, {MessengerGroupItem} from '../../Messenger/MessengerItem';
import {MessengerScreenProps} from '../../navigators/Main.navigator';

const MessengerScreen = ({navigation}: MessengerScreenProps) => {
  const {lightText} = useTheme();
  const [search, setSearch] = useState('');
  const countObjMessages = useSelector(SelectorsEvent.getUnreadCount);
  const keyUnreadMessages = useSelector(SelectorsEvent.getKeyUnreadMessages);
  const options: IOption<string, FilterMessenger>[] = useMemo(() => {
    return [
      {
        label: t('localTypeChat'),
        value: FilterMessenger.local,
        extra: countObjMessages[FilterMessenger.local],
      },
      {
        label: t('groupTypeChat'),
        value: FilterMessenger.group,
        extra: countObjMessages[FilterMessenger.group],
      },
      {
        label: t('secretTypeChat'),
        value: FilterMessenger.secret,
        extra: countObjMessages[FilterMessenger.secret],
        //extra: 3,
      },
    ] as IOption<string, FilterMessenger>[];
  }, [keyUnreadMessages]);
  const [selected, setSelected] = useState(options[0]);
  const chats = useSelector((state: any) => SelectorsEvent.getChatsByType(state, selected.value));

  const lowerSearch = search.toLowerCase();
  const filterChats =
    search === ''
      ? chats
      : chats.filter((c) => {
          if (selected.value === FilterMessenger.local) {
            return c.name.toLowerCase().includes(lowerSearch);
          }
          return c.event.name.toLowerCase().includes(lowerSearch);
        });

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
      }}
      enabled
      behavior={isIOS ? 'padding' : undefined}>
      <SafeAreaView
        style={{
          flex: 1,
        }}>
        <HeaderMessenger
          defaultSearch={search}
          onSelected={setSelected}
          onSubmitSearch={setSearch}
          options={options}
          selected={selected}
        />
        {chats.length > 0 && (
          <ScrollView
            keyboardDismissMode={'on-drag'}
            keyboardShouldPersistTaps={'always'}
            style={[styles.scrollView]}
            contentContainerStyle={[
              styles.contentContainerStyle,
              {
                paddingBottom: heightTabBarRef.current,
              },
            ]}>
            {selected.value === options[0].value
              ? filterChats.map((c, i) => {
                  return (
                    <MessengerItem
                      chat={c}
                      style={[
                        styles.item,
                        {
                          borderBottomColor: lightText,
                        },
                      ]}
                      key={c._id}
                    />
                  );
                })
              : filterChats.map((c, i) => {
                  return (
                    <MessengerGroupItem
                      chat={c}
                      style={[
                        styles.item,
                        {
                          borderBottomColor: lightText,
                        },
                      ]}
                      key={c._id}
                    />
                  );
                })}
          </ScrollView>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: sizes[20],
    paddingBottom: heightTabBarRef.current,
  },
  contentContainerStyle: {},
  item: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  firstItem: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});

export default MessengerScreen;
