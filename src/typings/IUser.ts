import TypeHeight from './TypeHeight';
import TypeWeight from './TypeWeight';
import {IWishlist} from './IWishlist';
import IPurchase from './IPurchase';
import {Gender} from './TypeGender';
import {MaritalStatus} from './TypeMaritalStatus';
import {IContact} from './IContact';
import IUnit from './IUnit';
import StatusAnswerEvent from './StatusAnswerEvent';
import getIdObj from '../utils/getIdObj';

export enum FriendRequestStatus {
  friends = 'friends',
  pending = 'pending',
}
export interface IFriendRequest {
  status: FriendRequestStatus;
  _id: string;
  requester: IUser;
  responder: IUser;
}
export interface IUserBase {
  firstName?: string;
  lastName?: string;
  picture: string;
  birthday: string;
  country: string;
  state: string;
  city: string;
  hobbies: string[];
  gender: Gender;
  maritalStatus: MaritalStatus;
  weight: IUnit<TypeWeight>;
  height: IUnit<TypeHeight>;
  size: string;
  shoeSize: string;
  image?: IImage;
  hideBirthday: boolean;
  firstExit: boolean;
}

export interface IUserPost extends Partial<IUserBase> {
  firstName: string;
}

export interface IClientUserPost extends Omit<IUserPost, 'gender' | 'maritalStatus' | 'hobbies' | 'birthday'> {
  gender?: Gender;
  maritalStatus?: MaritalStatus;
  hobbies?: string;
  birthday?: Date;
}

export interface IImage {
  originalname: string;
  filename: string;
  url: string;
}
export interface IUser extends IUserPost {
  _id: string;
  ownedWishlists: IWishlist[];
  followedWishlists: IWishlist[];
  email: string;
  picture: string;
  friendsRequests: IFriendRequest[];
  friendsResponses: IFriendRequest[];
  friends: IFriendRequest[];
  purchases: IPurchase[];
}

export interface IUserWithAdded extends IUser {
  isAdded?: boolean;
}

export interface IUserWithGuestStatus extends IUser {
  guestStatus: StatusAnswerEvent;
}

interface IName {
  firstName?: string;
  lastName?: string;
  email?: string;
}
export class UserExtension {
  static image(user: IUser | IContact, isIgnoreUploadImage = false) {
    if (isIgnoreUploadImage) {
      return user?.picture;
    }
    return user?.image?.url ?? user?.picture;
  }

  static isImage(user: IUser) {
    if (!user) {
      return false;
    }
    return !!(user?.image?.url ?? user?.picture);
  }

  static isUploadImage(user: IUser | IContact) {
    return !!user?.image?.url;
  }

  static isEmptyNames(user: IUser) {
    return !user.lastName && !user.firstName;
  }

  static fullName(user: IName | string) {
    if (typeof user === 'string') {
      return '';
    }
    const fullname = `${UserExtension.firstName(user)} ${UserExtension.lastName(user)}`.trim();
    const u = user as IUser;
    return fullname ?? UserExtension.parseEmailForName(u?.email) ?? '';
  }

  private static parseEmailForName(email: string = '') {
    const separate = /[\.\/\-\,\_]/g;
    const firstPart = email.split('@')[0];
    return firstPart
      .split(separate)
      .filter((str) => str !== '')
      .filter((_, i) => i <= 1)
      .join(' ');
  }

  static firstName(user: IName | string) {
    if (typeof user === 'string') {
      return '';
    }
    const lastName = user?.lastName ?? '';
    const firstNames = user?.firstName?.split(' ') ?? '';
    if (lastName) {
      return user?.firstName;
    } else {
      return firstNames ? firstNames[0] : '';
    }
  }
  static lastName(user: IName) {
    const lastName = user?.lastName ?? '';
    const firstNames = user?.firstName?.split(' ') ?? '';

    if (lastName) {
      return lastName;
    } else {
      return firstNames ? firstNames[1] ?? '' : '';
    }
  }

  static getFriends(user: IUser) {
    const userId = user?._id;
    if (!userId) {
      return [];
    }
    const friends = user?.friends ?? [];
    return friends.map((p) => {
      if (userId === getIdObj(p.requester)) {
        return p.responder;
      }
      return p.requester;
    });
  }
}
