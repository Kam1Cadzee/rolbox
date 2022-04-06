import {IUser} from './IUser';
import {IName} from '../components/common/Icons';
import IGift from './IGift';
import VisibilityType from './VisibilityType';
import IAddress from './IAddress';

interface IWishlistBase {
  name: string;
  visibility: VisibilityType;
  coverCode: IName;
  forWhom: string;
  note: string;
  address?: IAddress;
  showUsers: string[];
}

export interface IWishListPost extends IWishlistBase {}

export interface IWishlistClientPost extends Omit<IWishListPost, 'coverCode' | 'address' | 'showUsers'> {}

export interface IWishlist extends IWishlistBase {
  _id: string;
  followers: string[] | IUser[];
  gifts: IGift[];
  user: IUser | string;
  createdAt: string;
  updatedAt: string;
}

export interface IWishListLabel {
  icon: IName;
  name: string;
}
