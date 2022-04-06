import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';
import {useDispatch} from 'react-redux';
import {sizes, useTheme} from '../../context/ThemeContext';
import {actionsUser} from '../../redux/user/userReducer';
import wishListService from '../../services/wishListService/wishListService';
import IUpdateData from '../../typings/IUpdateData';
import {IUser, IUserWithAdded, UserExtension} from '../../typings/IUser';
import {IWishlist, IWishListPost} from '../../typings/IWishlist';
import useAxios from '../../useHooks/useAxios';
import useDidUpdateEffect from '../../useHooks/useDidUpdateEffect';
import {getFontFamily} from '../../utils/getFontFamily';
import {UserItemDump} from '../common/UserItem';
import CheckedButton from '../controls/CheckedButton';
import MyButton, {TypeButton} from '../controls/MyButton';
import MyText from '../controls/MyText';
import MyModal from './MyModal';

interface IModalAllowAccessToWishlistProps {
  onClose: () => any;
  users: IUser[];
  usersAlready: string[];
  wishlist: IWishlist;
  onSubmit: () => any;
}

const ModalAllowAccessToWishlist = ({
  onClose,
  users,
  usersAlready,
  onSubmit,
  wishlist,
}: IModalAllowAccessToWishlistProps) => {
  const dispatch = useDispatch();
  const {border} = useTheme();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isAllUser, setIsAllUser] = useState(false);
  const {isLoading, request} = useAxios(wishListService.updateWishlist);

  const handleCheckedUser = (id: string) => {
    const findIndex = selectedUsers.findIndex((_id) => _id === id);

    if (findIndex === -1) {
      setSelectedUsers((selectedUsers) => {
        return [...selectedUsers, id];
      });
    } else {
      setSelectedUsers((users) => {
        return users.filter((_, i) => i !== findIndex);
      });
    }
  };

  useDidUpdateEffect(() => {
    setIsAllUser(selectedUsers.length === users.length);
  }, [selectedUsers]);

  const handleChangeAllUsers = () => {
    setIsAllUser((s) => {
      const res = !s;
      setSelectedUsers(res ? users.map((u) => u._id) : []);
      return res;
    });
  };

  const handleSubmit = async () => {
    const data: IUpdateData<IWishListPost> = {
      id: wishlist._id,
      data: {
        coverCode: wishlist.coverCode,
        forWhom: wishlist.forWhom,
        name: wishlist.name,
        note: wishlist.note,
        showUsers: [...selectedUsers, ...usersAlready],
        visibility: wishlist.visibility,
        address: wishlist.address,
      },
    };
    const res = await request(data);
    console.log(res);
    if (res.success) {
      dispatch(actionsUser.addOwnedWishlist(res.data as any));
    }

    onClose();
    onSubmit();
  };

  const handleClose = () => {
    onClose();
    onSubmit();
  };

  return (
    <MyModal modalVisible={true} onClose={handleClose} style={styles.modal} isClose>
      <MyText style={styles.title}>Open access</MyText>
      <MyText style={styles.subtitle}>These guests don`t have access to your wishlist</MyText>
      <View
        style={[
          styles.view,
          {
            borderBottomColor: border,
          },
        ]}>
        <MyText>All quests</MyText>
        <CheckedButton onPress={handleChangeAllUsers} selected={isAllUser} />
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        style={styles.flatlist}
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={(info) => {
          const user = info.item as IUser;
          const selected = selectedUsers.some((id) => id === user._id);
          return (
            <UserItemDump
              style={{
                marginBottom: sizes[16],
              }}
              key={user._id}
              name={UserExtension.fullName(user)}
              image={UserExtension.image(user)}
              userId={user._id}
              sizeImage={sizes[32]}
              onPress={() => handleCheckedUser(user._id)}
              rightComponent={<CheckedButton onPress={() => handleCheckedUser(user._id)} selected={selected} />}
            />
          );
        }}
      />
      <MyButton
        isLoading={isLoading}
        onPress={handleSubmit}
        style={{
          width: '50%',
          alignSelf: 'center',
        }}
        type={TypeButton.primary}>
        Open access
      </MyButton>
    </MyModal>
  );
};

const styles = StyleSheet.create({
  modal: {
    maxHeight: responsiveScreenHeight(86),
  },
  title: {
    fontFamily: getFontFamily(500),
    fontSize: sizes[16],
    marginBottom: sizes[16],
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: sizes[40],
    textAlign: 'center',
  },
  view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    marginBottom: sizes[14],
    paddingBottom: sizes[10],
  },
  flatlist: {
    marginBottom: sizes[40],
  },
});

export default ModalAllowAccessToWishlist;
