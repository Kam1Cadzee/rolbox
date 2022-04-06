import React, {useCallback, useState} from 'react';
import {SafeAreaView, View, ScrollView, FlatList, ListRenderItemInfo, StyleSheet} from 'react-native';
import {sizes, useTheme} from '../../context/ThemeContext';
import {IUser, IUserWithAdded, UserExtension} from '../../typings/IUser';
import t from '../../utils/t';
import CheckedButton from '../controls/CheckedButton';
import IconButton from '../controls/IconButton';
import MyButton, {TypeButton} from '../controls/MyButton';
import MyTextInput from '../controls/MyInputText';
import MyText from '../controls/MyText';
import ImageUser from '../Profile/ImageUser';
import {UserItemDump} from './UserItem';

interface ISelectUsersProps {
  onSubmit: (users: IUser[]) => any;
  users: IUser[];
  defaultSelectableUsers: IUser[];
  isLoading?: boolean;
}
const SelectUsers = ({defaultSelectableUsers, onSubmit, users, isLoading = false}: ISelectUsersProps) => {
  const {backgroundDark, background, text, secondary} = useTheme();
  const [search, setSearch] = useState('');

  const [selectedUsers, setSelectedUsers] = useState(() => {
    return users.map((f) => {
      const u: IUserWithAdded = f;
      u.isAdded = defaultSelectableUsers.some((g) => g._id === u._id);
      return u;
    });
  });

  const handleSubmit = () => {
    const isAddedFriends = selectedUsers.filter((g) => g.isAdded);

    onSubmit(isAddedFriends);
  };

  const handleCheckedUser = (id: string) => {
    setSelectedUsers((guests) => {
      return guests.map((g) => {
        if (g._id === id) {
          g.isAdded = !g.isAdded;
        }
        return g;
      });
    });
  };

  const renderItem = useCallback((item: ListRenderItemInfo<IUserWithAdded>) => {
    const user = item.item;

    return (
      <UserItemDump
        style={styles.userItem}
        key={user._id}
        name={UserExtension.fullName(user)}
        image={UserExtension.image(user)}
        userId={user._id}
        sizeImage={sizes[32]}
        onPress={() => handleCheckedUser(user._id)}
        rightComponent={<CheckedButton onPress={() => handleCheckedUser(user._id)} selected={user.isAdded} />}
      />
    );
  }, []);

  const filterFriends =
    search !== ''
      ? selectedUsers.filter((f) => UserExtension.fullName(f).toLowerCase().includes(search.toLowerCase()))
      : selectedUsers;
  const isAddedFriends = selectedUsers.filter((g) => g.isAdded);

  return (
    <SafeAreaView style={styles.con}>
      <MyTextInput
        value={search}
        onChangeText={setSearch}
        rightComponent={
          <IconButton
            style={{
              marginRight: sizes[16],
            }}
            icon={{
              name: 'SearchIcon',
              size: sizes[16],
              fill: text,
            }}
          />
        }
      />
      <View
        style={[
          styles.viewAdded,
          {
            backgroundColor: backgroundDark,
          },
        ]}>
        <MyText style={styles.textAdded}>
          {t('addedGuests')}: {isAddedFriends.length}
        </MyText>
        {isAddedFriends.length > 0 && (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={{
              paddingTop: sizes[12],
              overflow: 'visible',
            }}
            horizontal>
            {isAddedFriends.map((g) => {
              return (
                <View key={g._id} style={styles.viewAddedItem}>
                  <ImageUser size={sizes[44]} image={UserExtension.image(g)} />
                  <MyText style={styles.textAddedItem} numberOfLines={1}>
                    {UserExtension.fullName(g)}
                  </MyText>
                  <IconButton
                    onPress={() => handleCheckedUser(g._id)}
                    style={[
                      styles.removeAddedItem,
                      {
                        backgroundColor: secondary,
                      },
                    ]}
                    icon={{
                      name: 'CrossIcon',
                      fill: background,
                      size: sizes[8],
                    }}
                  />
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: sizes[20],
        }}
        style={styles.scrollView2}
        data={filterFriends}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />

      <MyButton isLoading={isLoading} onPress={handleSubmit} type={TypeButton.fog}>
        {t('save')}
      </MyButton>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  con: {
    marginHorizontal: sizes[20],
    marginBottom: sizes[20],
    flex: 1,
  },
  viewAdded: {
    marginHorizontal: -sizes[20],
    borderRadius: sizes[4],
    paddingHorizontal: sizes[20],
    paddingVertical: sizes[10],
  },
  textAdded: {
    fontSize: sizes[12],
  },
  scrollView: {
    marginHorizontal: -sizes[10],
  },
  scrollView2: {
    paddingVertical: sizes[20],
  },
  viewAddedItem: {
    marginHorizontal: sizes[10],
    width: sizes[44],
    alignItems: 'center',
    overflow: 'visible',
  },
  textAddedItem: {
    fontSize: sizes[8],
    marginTop: sizes[5],
  },
  removeAddedItem: {
    width: sizes[20],
    height: sizes[20],
    borderRadius: sizes[10],
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: -sizes[8],
    top: -sizes[8],
  },
  userItem: {
    marginBottom: sizes[15],
  },
});

export default SelectUsers;
