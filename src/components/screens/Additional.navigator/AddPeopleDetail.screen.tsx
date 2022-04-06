import React from 'react';
import {AddPeopleDetailScreenProps, AddPeopleScreenProps} from '../../navigators/Additional.navigator';
import {useDispatch, useSelector} from 'react-redux';
import {actionsUser, selectorsUser} from '../../../redux/user/userReducer';
import {IUser} from '../../../typings/IUser';
import SelectUsers from '../../common/SelectUsers';
import useAxios from '../../../useHooks/useAxios';
import wishListService from '../../../services/wishListService/wishListService';
import {IWishlist, IWishListPost} from '../../../typings/IWishlist';

const AddPeopleDetailScreen = ({navigation, route}: AddPeopleDetailScreenProps) => {
  const dispatch = useDispatch();
  const wishlist = route.params.wishlist;
  const defaultPeople = useSelector(selectorsUser.getFriendsByIds(wishlist.showUsers));
  const friends = useSelector(selectorsUser.getFriends);
  const {request, isLoading} = useAxios(wishListService.updateWishlist);

  const handleSubmit = async (users: IUser[]) => {
    const dataFetch: IWishListPost = {
      name: wishlist.name,
      visibility: wishlist.visibility,
      coverCode: wishlist.coverCode,
      forWhom: wishlist.forWhom,
      note: wishlist.note,
      address: wishlist.address,
      showUsers: users.map((u) => u._id),
    };

    const res = await request<IWishlist>({id: wishlist._id, data: dataFetch});

    if (res.success) {
      res.data.gifts = wishlist.gifts ?? [];
      dispatch(actionsUser.addOwnedWishlist(res.data));
      navigation.goBack();
    }
  };

  return (
    <SelectUsers isLoading={isLoading} onSubmit={handleSubmit} defaultSelectableUsers={defaultPeople} users={friends} />
  );
};

export default AddPeopleDetailScreen;
