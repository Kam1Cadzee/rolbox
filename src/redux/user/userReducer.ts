import {createCachedSelector} from 're-reselect';
import {CreatorReducer} from '../base/base';
import {IUserActions, IUserState} from './userTypes';
import {RootState} from '../reducer';
import Providers from '../../constants/Providers';
import {IWishlist, IWishListLabel} from '../../typings/IWishlist';
import IOption from '../../typings/IOption';
import IGift from '../../typings/IGift';
import RelationStatus from '../../typings/IRelationStatus';
import {IUser, IUserWithGuestStatus, UserExtension} from '../../typings/IUser';
import StatusPurchase from '../../typings/StatusPurchase';
import getIdObj from '../../utils/getIdObj';
import IPurchase from '../../typings/IPurchase';
import {normalizeDateOffset} from '../../utils/normalizeData';
import VisibilityType from '../../typings/VisibilityType';
import {normalizeMaritalStatus} from '../../typings/TypeMaritalStatus';
import {FilterEvents} from '../../typings/IEvent';
import IGuest from '../../typings/IGuest';
import FirebaseCrash from '../../Crashlytics/FirebaseCrash';
import {userIdRef} from '../../utils/navigationRef';

const init: IUserState = {
  isAuth: false,
  userFirebase: null,
  user: null,
  isNeedToUpdate: true,
};

const creator = new CreatorReducer<IUserActions, IUserState>('user');
creator.addAction('setUserFirebase', (state, action) => {
  state.userFirebase = action.payload;
  return {...state};
});
creator.addAction<{firstName: string; lastName: string}>('setName', (state, action) => {
  if (!state.user) {
    return state;
  }
  state.user.firstName = action.payload.firstName;
  state.user.lastName = action.payload.lastName;
  return {...state};
});
creator.addAction<IUser>('setUser', (state, action) => {
  FirebaseCrash.init(action.payload);

  action.payload.maritalStatus = normalizeMaritalStatus(action.payload.maritalStatus);

  state.user = action.payload;
  state.isNeedToUpdate = false;

  return {...state};
});
creator.addAction('setIsAuth', (state, action) => {
  state.isAuth = action.payload;
  return {...state};
});
creator.addAction('setIsNeedToUpdate', (state, action) => {
  state.isNeedToUpdate = action.payload;
  return {...state};
});
creator.addAction('updateUser', (state, action) => {
  state.user = {...state.user, ...action.payload};
  return {...state};
});
creator.addAction<IWishlist[]>('setOwnedWishlists', (state, action) => {
  state.user.ownedWishlists = action.payload;
  return {...state};
});
creator.addAction<IWishlist>('addOwnedWishlist', (state, action) => {
  const user = state.user!;
  const findIndex = user.ownedWishlists.findIndex((w) => w._id === action.payload._id);

  if (findIndex === -1) {
    // add wishlist
    user.ownedWishlists = [...user.ownedWishlists, action.payload];
  } else {
    // update wishlist
    user.ownedWishlists[findIndex] = action.payload;
    user.ownedWishlists = [...user.ownedWishlists];
  }

  return {...state};
});
creator.addAction<string>('removeOwnedWishlist', (state, action) => {
  const user = state.user!;
  user.ownedWishlists = user.ownedWishlists.filter((w) => w._id !== action.payload);
  return {...state};
});
creator.addAction<{idWishlist: string; gift: IGift}>('addGift', (state, action) => {
  const user = state.user!;
  const {gift, idWishlist} = action.payload;
  const indexWishlist = user.ownedWishlists.findIndex((w) => w._id === idWishlist);
  const wishlist = user.ownedWishlists[indexWishlist];

  const indexGift = wishlist.gifts.findIndex((g) => g._id === gift._id);
  if (indexGift === -1) {
    // add gift
    // user.ownedWishlists[indexWishlist] = {...wishlist, gifts: [...wishlist.gifts, gift]};
    user.ownedWishlists[indexWishlist].gifts = [...wishlist.gifts, gift];
  } else {
    // update gift
    wishlist.gifts[indexGift] = gift;
    // user.ownedWishlists[indexWishlist] = {...wishlist, gifts: [...wishlist.gifts]};
    user.ownedWishlists[indexWishlist].gifts = [...wishlist.gifts];
  }

  // user.ownedWishlists = [...user.ownedWishlists];
  // return {...state, user: {...user}};
  return {...state};
});
creator.addAction<{idWishlist: string; idGift: string}>('removeGift', (state, action) => {
  const {idGift, idWishlist} = action.payload;
  const {ownedWishlists} = state.user!;
  const indexWishlist = ownedWishlists.findIndex((w) => w._id === idWishlist);
  const wishlist = ownedWishlists[indexWishlist];
  wishlist.gifts = wishlist.gifts.filter((g) => g._id !== idGift);

  return {...state};
});
creator.addAction('addFriendsRequests', (state, action) => {
  const {friendsRequests} = state.user!;
  state.user!.friendsRequests = [...friendsRequests, action.payload];
  return {...state};
});
creator.addAction('addFriendsResponse', (state, action) => {
  const {friendsResponses} = state.user!;
  if (friendsResponses.some((f) => f.requester._id === action.payload.requester._id)) {
    return state;
  }
  state.user!.friendsResponses = [...friendsResponses, action.payload];
  return {...state};
});
creator.addAction('addFriend', (state, action) => {
  const {friends} = state.user!;
  state.user!.friends = [...friends, action.payload];
  return {...state};
});
creator.addAction('removeFriend', (state, action) => {
  const {friends} = state.user!;
  state.user!.friends = friends.filter(
    (f) => ![getIdObj(f.requester), getIdObj(f.responder)].some((id) => id === action.payload),
  );
  return {...state};
});
creator.addAction('declineFriend', (state, action) => {
  const {friendsResponses} = state.user!;
  state.user!.friendsResponses = friendsResponses.filter((r) => getIdObj(r.requester) !== action.payload);
  return {...state};
});
creator.addAction<IPurchase>('addPurchase', (state, action) => {
  const {purchases} = state.user!;
  state.user!.purchases = [...purchases, action.payload];
  return {...state};
});
creator.addAction<IPurchase>('changePurchase', (state, action) => {
  const {purchases} = state.user!;
  const findIndex = purchases.findIndex((p) => p._id === action.payload._id);

  if (findIndex !== -1) {
    purchases[findIndex] = {...purchases[findIndex], status: action.payload.status};
  }
  return {...state};
});
creator.addAction('removePurchase', (state, action) => {
  const {purchases} = state.user!;
  state.user!.purchases = purchases.filter((p) => p._id !== action.payload);
  return {...state};
});
creator.addAction('moveToFriend', (state, action) => {
  const friend = state.user.friendsResponses.find((r) => r.requester._id === action.payload);
  const {friends} = state.user!;
  state.user!.friends = [...friends, friend];
  return creator.getHandlerReducer('declineFriend')(state, action);
});
creator.addAction('cancelRequest', (state, action) => {
  state.user!.friendsRequests = state.user.friendsRequests.filter((r) => getIdObj(r.responder) !== action.payload);
  return {...state};
});
creator.addAction('cancelFriendRemote', (state, action) => {
  state.user!.friendsResponses = state.user.friendsResponses.filter((r) => getIdObj(r.requester) !== action.payload);
  return {...state};
});
creator.addAction('declineFriendRemote', (state, action) => {
  state.user!.friendsRequests = state.user.friendsRequests.filter((r) => getIdObj(r.responder) !== action.payload);
  return {...state};
});
creator.addAction('acceptFriendRemote', (state, action) => {
  const id = action.payload;
  let friend: any = null;
  state.user.friendsRequests = state.user.friendsRequests.filter((r) => {
    if (getIdObj(r.responder) === id) {
      friend = r;
      return false;
    }
    return true;
  });
  if (!friend) {
    return state;
  }

  state.user!.friends = [...state.user!.friends, friend];

  return state;
});
const actionsUser = creator.createActions();

class SelectorsUser {
  static isNeededEdit(state: RootState) {
    const isEdit = state.user.user ? UserExtension.isEmptyNames(state.user.user) : false;
    const isFirstEnter = SelectorsUser.getFirstExit(state);
    return isEdit || isFirstEnter;
  }

  static getUserFirebase(state: RootState) {
    return state.user.userFirebase;
  }

  static getUser(state: RootState) {
    return state.user.user;
  }

  static getUserId(state: RootState) {
    return state.user?.user?._id ?? '';
  }

  static getEmail(state: RootState) {
    return state.user.user?.email ?? '';
  }

  static isAuth(state: RootState) {
    return state.user.isAuth;
  }

  static isNeedToUpdate(state: RootState) {
    return state.user.isNeedToUpdate;
  }

  static isExistsProvider(provider: Providers) {
    return (state: RootState) => {
      if (state.user.userFirebase) {
        return state.user.userFirebase.providerData.some((p) => p.providerId === provider);
      }
      return false;
    };
  }

  static getUrlImg(state: RootState) {
    return UserExtension.image(state.user.user);
  }

  static getFirstName(state: RootState) {
    return UserExtension.firstName(state.user.user);
  }

  static getLastName(state: RootState) {
    return UserExtension.lastName(state.user.user);
  }

  static getFullName(state: RootState) {
    return UserExtension.fullName(state.user.user);
  }

  static getOwnedWishlists(state: RootState) {
    const {user} = state.user;
    return user ? user.ownedWishlists : [];
  }

  static getOwnedWishlistOptions(state: RootState) {
    const wishlists = SelectorsUser.getOwnedWishlists(state);

    const result: IOption<IWishListLabel>[] = wishlists.map((w) => ({
      value: w._id,
      label: {
        icon: w.coverCode,
        name: w.name,
      },
    }));
    return result;
  }

  static getWishlistById(id: string) {
    return (state: RootState) => {
      const wishlists = SelectorsUser.getOwnedWishlists(state);

      return wishlists.find((w) => w._id === id)!;
    };
  }

  static getCountWishlists(state: RootState) {
    return state.user.user!.ownedWishlists.length;
  }

  static getCountGifts(state: RootState) {
    return state.user.user!.ownedWishlists.reduce((a, b) => a + b.gifts.length, 0);
  }

  static getFollowedWishlist(state: RootState) {
    const friends = SelectorsUser.getFriends(state);

    return (state.user.user?.followedWishlists ?? []).filter((wishlist) => {
      if (wishlist.visibility === VisibilityType.protected) {
        return friends.some((f) => f._id === getIdObj(wishlist.user));
      }

      return true;
    });
  }

  static getGiftsByWishlist(id: string) {
    return (state: RootState) => {
      const wishlist = SelectorsUser.getWishlistById(id)(state);
      return wishlist?.gifts ?? [];
    };
  }

  static getStatusFriend(idFriend: string) {
    return (status: RootState) => {
      const user = status.user.user!;
      return utilGetRelationStatusUser(user, idFriend);
    };
  }

  static getCountFriends(state: RootState) {
    return state.user.user.friends.length;
  }

  static getWillGiveGifts(state: RootState) {
    return (state.user.user?.purchases ?? [])
      .filter((p) => !!p.gift)
      .sort((p1, p2) => {
        if (p1.status === 'reserved') {
          return 1;
        }
        return -1;
      })
      .map((p) => p.gift);
  }

  static getWillGivePurchasesActive(state: RootState) {
    return (state.user.user?.purchases ?? []).filter((p) => p.status === 'reserved' && !!p.gift);
  }

  static getWillGivePurchasesArchived(state: RootState) {
    return (state.user.user?.purchases ?? []).filter((p) => p.status === 'gifted' && !!p.gift);
  }

  static getWillGiveGiftsActive(state: RootState) {
    return (state.user.user?.purchases ?? []).filter((p) => p.status === 'reserved' && !!p.gift).map((p) => p.gift);
  }

  static getWillGiveGiftsArchived(state: RootState) {
    return (state.user.user?.purchases ?? []).filter((p) => p.status === 'gifted' && !!p.gift).map((p) => p.gift);
  }

  static getStatusPurchase(idGift: string, remaining: number) {
    return (state: RootState) => {
      const purchases = (state.user.user?.purchases ?? []).filter((p) => !!p.gift).filter((p) => p.status !== 'gifted');
      const purchase = purchases.find((p) => getIdObj(p.gift) === idGift);

      if (remaining === 0) {
        if (!purchase) {
          return StatusPurchase.gifted;
        }
        if (purchase.status === 'reserved') {
          return StatusPurchase.reserved;
        }
        return StatusPurchase.gifted;
      } else {
        if (!purchase) {
          return StatusPurchase.willGifted;
        }
        if (purchase.status === 'reserved') {
          return StatusPurchase.reserved;
        }
        if (purchase.status === 'gifted') {
          return StatusPurchase.willGifted;
        }
      }
    };
  }

  static getPurchaseByGift(idGift: string) {
    return (state: RootState) => {
      const purchases = (state.user.user?.purchases ?? []).filter((p) => !!p.gift).filter((p) => p.status !== 'gifted');
      return purchases.find((p) => getIdObj(p.gift) === idGift);
    };
  }

  static getFriendsResponses(state: RootState) {
    return state.user.user.friendsResponses.filter((r) => r.status === 'pending').map((p) => p.requester);
  }

  static getFriends(state: RootState) {
    return UserExtension.getFriends(state.user.user);
  }

  static getFriend(idFriend: string) {
    return (state: RootState) => {
      const friends = SelectorsUser.getFriends(state);
      return friends.find((f) => f._id === idFriend);
    };
  }

  static checkFriend(idFriend: string) {
    return (state: RootState) => {
      const friends = SelectorsUser.getFriends(state);
      return friends.some((f) => f._id === idFriend);
    };
  }

  static getFirstExit(state: RootState) {
    return state.user?.user?.firstExit;
  }

  static getCountFriendsResponses(state: RootState) {
    return (state.user.user.friendsResponses || []).length;
  }

  static getFiendsAsEvents = createCachedSelector(SelectorsUser.getFriends, (friends) => {
    const currentDate = new Date();
    const lowerDate = new Date();
    lowerDate.setDate(lowerDate.getDate() - 14);
    lowerDate.setHours(0, 0, 0, 0);

    return friends
      .filter((user) => !!user.birthday)
      .map((user) => {
        const birthdayDate = new Date(user.birthday);
        birthdayDate.setFullYear(currentDate.getFullYear());
        birthdayDate.setHours(0, 0, 0, 0);

        if (birthdayDate.getTime() < lowerDate.getTime()) {
          birthdayDate.setFullYear(currentDate.getFullYear() + 1);
        }
        return {
          type: FilterEvents.birthday,
          date: birthdayDate,
          payload: user,
        };
      });
  })((state) => {
    return state.user.user.friends.length;
  });

  static getFriendsByGuests(guests: IGuest[]) {
    return (state: RootState) => {
      const obj = guests.reduce((a, b) => {
        a[getIdObj(b.user)] = b;
        return a;
      }, {});
      return SelectorsUser.getFriends(state).filter((user) => obj[user._id]);
    };
  }

  static getFiendsWithGuestStatus(guests: IGuest[]) {
    return (state: RootState) => {
      const obj = guests.reduce((a, b) => {
        a[getIdObj(b.user)] = b;
        return a;
      }, {});
      return SelectorsUser.getFriendsByGuests(guests)(state).map((user) => {
        const u: IUserWithGuestStatus = user as any;
        u.guestStatus = obj[user._id].status;

        return u;
      });
    };
  }

  static getFriendsByIds(ids: string[] = []) {
    return (state: RootState) => {
      const friends = SelectorsUser.getFriends(state);
      const res: IUser[] = friends.filter((friend) => {
        return ids.some((id) => id === friend._id);
      });

      return res;
    };
  }
}

const utilGetRelationStatusUser = (user: IUser, id: string) => {
  if (user.friends.some((f) => getIdObj(f.requester) === id || getIdObj(f.responder) === id)) {
    return RelationStatus.friends;
  }
  if (user.friendsResponses.some((f) => getIdObj(f.requester) === id)) {
    return RelationStatus.replaying;
  }
  if (user.friendsRequests.some((f) => getIdObj(f.responder) === id)) {
    return RelationStatus.requested;
  }
  return RelationStatus.noFriends;
};

const utilGetRelationStatusFriend = (user: IUser, id: string) => {
  if (user.friends.some((f) => getIdObj(f.requester) === id || getIdObj(f.responder) === id)) {
    return RelationStatus.friends;
  }
  if (user.friendsResponses.some((f) => getIdObj(f.requester) === id)) {
    return RelationStatus.requested;
  }
  if (user.friendsRequests.some((f) => getIdObj(f.responder) === id)) {
    return RelationStatus.replaying;
  }
  return RelationStatus.noFriends;
};

export {actionsUser, SelectorsUser as selectorsUser, utilGetRelationStatusFriend};
export default creator.createReducer(init);
