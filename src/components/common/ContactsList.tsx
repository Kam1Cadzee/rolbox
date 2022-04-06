import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {PermissionsAndroid, StyleSheet, PermissionStatus, ActivityIndicator} from 'react-native';
import {sizes, useTheme} from '../../context/ThemeContext';
import {useDispatch, useSelector} from 'react-redux';
import {actionsOther, selectorsOther} from '../../redux/other/otherReducer';
import {
  exceptDuplicates,
  exceptFriends,
  IContact,
  IMapContact,
  mapContact,
  mapContactApp,
  mapContactsFromPhone,
} from '../../typings/IContact';
import UserItem, {UserItemSendInvite} from './UserItem';
import {selectorsUser} from '../../redux/user/userReducer';
import {isIOS} from '../../utils/isPlatform';
import Contacts, {requestPermission} from 'react-native-contacts';
import authService from '../../services/authService/authService';
import {IUser} from '../../typings/IUser';
import useDidUpdateEffect from '../../useHooks/useDidUpdateEffect';
import {heightTabBarRef} from '../../utils/navigationRef';
import debounce from '../../utils/debounce';

interface IContactsListProps {
  search: string;
}

const ContactsList = ({search}: IContactsListProps) => {
  const limit = 20;
  const refPage = useRef(1);
  const dispatch = useDispatch();
  const userId = useSelector(selectorsUser.getUserId);
  const contacts = useSelector(selectorsOther.getContacts);
  const [users, setUsers] = useState<IUser[]>([]);
  const friends = useSelector(selectorsUser.getFriends);
  const [isLoading, setIsLoading] = useState(false);
  const refIsLoading = useRef(isLoading);
  const refSearch = useRef(search || '');
  const {secondary} = useTheme();

  const contactsInApp = exceptFriends([...friends, {_id: userId} as any], exceptDuplicates(users.map(mapContactApp)));
  const contactsOutApp = contacts.map(mapContact);
  const filterContactsOutApp = contactsOutApp.filter((c) => c.name.toLowerCase().indexOf(search.toLowerCase()) !== -1);

  useEffect(() => {
    loadContacts();
  }, []);

  useDidUpdateEffect(() => {
    refSearch.current = search;
    refPage.current = 1;
    loadUsers();
  }, [search]);

  const getContacts = async () => {
    let permissionStatus: PermissionStatus | 'authorized' | 'denied' | 'undefined';
    if (isIOS) {
      permissionStatus = await requestPermission();
    } else {
      permissionStatus = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS);
    }
    if (permissionStatus === 'authorized' || permissionStatus === 'granted') {
      const res = await Contacts.getAll();

      return res;
    } else if (permissionStatus === 'denied' || permissionStatus === 'never_ask_again') {
      return [];
    }

    return [];
  };

  const loadContacts = async () => {
    /*
    if (isGoogle) {
      try {
        setIsLoading(true);
        await GoogleSignin.signInSilently();
        const tokens = await GoogleSignin.getTokens();
        const refresh = user._user.refreshToken;
        const data = {
          access_token: tokens.accessToken,
          refresh_token: refresh,
          id_token: tokens.idToken,
        };
        const res = await friendService.contacts(data);

        if (res.success) {
          dispatch(
            actionsOther.setContacts({
              name: userId,
              contacts: res.data,
            }),
          );
        }
      } catch (e) {
      } finally {
        setIsLoading(false);
      }
    } else if (isFacebook || isApple) {
    }
    */
    try {
      const data = await getContacts();
      const contacts: IContact[] = mapContactsFromPhone(data);

      dispatch(
        actionsOther.setContacts({
          name: userId,
          contacts: contacts,
        }),
      );

      loadUsers();
    } catch (e) {}
  };

  const loadUsers = useCallback(
    debounce(async () => {
      if (refPage.current === -1 || refIsLoading.current) {
        return;
      }
      setIsLoading(true);
      refIsLoading.current = true;
      const res: any = await authService.users({limit: limit, page: refPage.current, search: refSearch.current});

      if (res.success) {
        setUsers((users) => {
          if (refPage.current === 1) {
            return res.data.docs;
          }
          return [...users, ...res.data.docs];
        });
        refPage.current = res.data.hasNextPage ? refPage.current + 1 : -1;
      }
      refIsLoading.current = false;
      setIsLoading(false);
    }, 400),
    [],
  );

  const commonContacts = refPage.current === -1 ? [...contactsInApp, ...filterContactsOutApp] : contactsInApp; //TODO: empty names

  return (
    <FlatList
      keyExtractor={(item, index) => {
        return item.isOutApp ? index.toString() : item.id.toString();
      }}
      style={styles.scrollView}
      contentContainerStyle={[
        styles.contentContainerStyle,
        {
          paddingBottom: heightTabBarRef.current,
        },
      ]}
      showsVerticalScrollIndicator={false}
      bounces={true}
      data={commonContacts}
      onEndReachedThreshold={0.3}
      onEndReached={loadUsers}
      ListFooterComponent={() => {
        if (refPage.current === -1) {
          return null;
        }
        return <ActivityIndicator color={secondary} size="small" />;
      }}
      renderItem={(info) => {
        const item: IMapContact = info.item;
        if (item.isOutApp) {
          return <UserItemSendInvite style={styles.userItem} key={info.index} name={item.name} image={item.image} />;
        }
        return (
          <UserItem
            style={styles.userItem}
            key={item.id}
            user={item.user}
            name={item.name}
            image={item.image}
            userId={item.id}
          />
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  scrollView: {
    marginHorizontal: -sizes[20],
    flex: 1,
  },
  contentContainerStyle: {
    paddingHorizontal: sizes[20],
  },
  userItem: {
    marginBottom: sizes[15],
  },
});
export default ContactsList;
