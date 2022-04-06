import customFetch from '../customFetch';
import {IWishlist, IWishListPost} from '../../typings/IWishlist';
import wishListInstance from './wishListInstance';
import IGift from '../../typings/IGift';
import IUpdateData from '../../typings/IUpdateData';

// /api/wishlist
const wishListService = {
  createWishList: (data: IWishListPost) => {
    return customFetch<IWishlist>(() => wishListInstance.post('/', data));
  },
  getAllWishList: () => {
    return customFetch<IWishlist[]>(() => wishListInstance.get('/'));
  },
  deleteWishList: (id: string) => {
    return customFetch<IWishlist[]>(() => wishListInstance.delete(`/${id}`));
  },
  getWishlistById: (id: string) => {
    return customFetch<IWishlist>(() => wishListInstance.get(`/${id}`));
  },
  updateWishlist: ({id, data}: IUpdateData<IWishListPost>) => {
    return customFetch<IWishlist>(() => wishListInstance.put(`/${id}`, data));
  },
  getGifts: (id: string) => {
    return customFetch<IGift[]>(() => wishListInstance.get(`/${id}/gift`));
  },
  follow: (id: string) => {
    return customFetch<IWishlist>(() => wishListInstance.put(`/${id}/follow`));
  },
  unFollow: (id: string) => {
    return customFetch<IWishlist>(() => wishListInstance.put(`/${id}/unfollow`));
  },
};

export default wishListService;
