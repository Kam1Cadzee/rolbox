import IOption from './IOption';
import {IImage, IUser} from './IUser';
import {IWishListLabel} from './IWishlist';
import TypeCurrency from './TypeCurrency';

interface IGiftBase {
  name: string;
  wishlist: string;
  websiteLink?: string;
  quantity: number;
  size?: string;
  color?: string;
  note?: string;
  price: {
    value?: string;
    currency: TypeCurrency;
  };
}

export interface IGiftPost extends Omit<IGiftBase, 'wishlist'> {
  wishlist?: string;
}

export interface IGiftClientPost extends Omit<IGiftBase, 'wishlist' | 'price'> {
  wishlist: IOption<IWishListLabel>;
  price: string;
  currency: IOption<string, TypeCurrency>;
}

export interface IGiftShare extends Partial<IGiftBase> {}
interface IGift extends IGiftBase {
  _id: string;
  user: IUser | string;
  remaining: number;
  purchases: string[];
  images: IImage[];
}

export const isImageOfGift = (gift: IGift) => {
  if (!gift) {
    return false;
  }
  return gift.images && gift.images.length > 0;
};
export const getImageByGift = (gift: IGift) => {
  return isImageOfGift(gift) ? gift.images[0].url : undefined;
};
export const getFilenameOfImageByGift = (gift: IGift) => {
  return isImageOfGift(gift) ? gift.images[0].filename : '';
};
export default IGift;
