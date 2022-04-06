import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {IFriendRequest, IUser, IUserPost} from '../../typings/IUser';
import {IWishlist} from '../../typings/IWishlist';
import IGift from '../../typings/IGift';
import IPurchase from '../../typings/IPurchase';

export interface IUserActions {
  setUserFirebase: (user: FirebaseAuthTypes.User | null) => any;
  setUser: (user: IUser | null) => any;
  setName: (obj: {firstName: string; lastName: string}) => any;
  updateUser: (user: IUserPost) => any;
  setIsAuth: (b: boolean) => any;
  setIsNeedToUpdate: (b: boolean) => any;
  setOwnedWishlists: (data: IWishlist[]) => any;

  addOwnedWishlist: (data: IWishlist) => any;
  removeOwnedWishlist: (id: string) => any;

  addGift: (obj: {idWishlist: string; gift: IGift}) => any;
  removeGift: (obj: {idWishlist: string; idGift: string}) => any;

  addFriendsRequests: (obj: IFriendRequest) => any;
  addFriendsResponse: (obj: IFriendRequest) => any;
  addFriend: (obj: IFriendRequest) => any;
  removeFriend: (idFriend: string) => any;
  declineFriend: (idFriend: string) => any;
  moveToFriend: (idFriend: string) => any;
  cancelRequest: (idFriend: string) => any;
  acceptFriendRemote: (idFriend: string) => any;
  cancelFriendRemote: (idFriend: string) => any;
  declineFriendRemote: (idFriend: string) => any;

  addPurchase: (obj: IPurchase) => any;
  changePurchase: (obj: IPurchase) => any;
  removePurchase: (id: string) => any;
}

export interface IUserState {
  userFirebase: FirebaseAuthTypes.User | null;
  user: IUser | null;
  isAuth: boolean;
  isNeedToUpdate: boolean;
}
