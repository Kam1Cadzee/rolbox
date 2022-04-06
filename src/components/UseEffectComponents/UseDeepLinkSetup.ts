import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {parseLink, TypeShare} from '../../config/configDeeplink';
import {useModal, TypeModal} from '../../context/ModalContext';
import {selectorsConfig} from '../../redux/config/configReducer';
import {selectorsUser} from '../../redux/user/userReducer';
import authService from '../../services/authService/authService';
import giftService from '../../services/giftService/giftService';
import wishListService from '../../services/wishListService/wishListService';
import IParseLink from '../../typings/IParseLink';
import VisibilityType from '../../typings/VisibilityType';
import useDidUpdateEffect from '../../useHooks/useDidUpdateEffect';
import checkIsFriend from '../../utils/checkIsFriend';
import getIdObj from '../../utils/getIdObj';
import {navigationRef} from '../../utils/navigationRef';
import t from '../../utils/t';
import validateVersion from '../../utils/validateVersion';
import dynamicLinks, {FirebaseDynamicLinksTypes} from '@react-native-firebase/dynamic-links';
import {isAndroid} from '../../utils/isPlatform';
import {actionsOther} from '../../redux/other/otherReducer';

enum ContinueData {
  deepLink,
}

interface IContinueData {
  type: ContinueData;
  payload: any;
}

const UseDeepLinkSetup = React.memo(() => {
  const dispatch = useDispatch();
  const friends = useSelector(selectorsUser.getFriends);
  const isAuthDispatch = useSelector(selectorsUser.isAuth);
  const isNeededEdit = useSelector(selectorsUser.isNeededEdit);
  const userId = useSelector(selectorsUser.getUserId);
  const [continueData, setContinueData] = useState<IContinueData | null>(null);
  const enabledDeepLink = useSelector(selectorsConfig.getItemConfig('enabledDeeplink'));
  const isFirstEnter = useSelector(selectorsUser.getFirstExit);
  const refIsFirstEnter = useRef(isFirstEnter);
  const refFriends = useRef(friends);
  const refIsAuth = useRef(isAuthDispatch);
  const {executeModal} = useModal();

  useDidUpdateEffect(() => {
    refIsFirstEnter.current = isFirstEnter;
    refFriends.current = friends;
    refIsAuth.current = isAuthDispatch;
  }, [isFirstEnter, friends, isAuthDispatch]);

  const handleDynamicLink = async (link: FirebaseDynamicLinksTypes.DynamicLink) => {
    if (!link) {
      return;
    }

    if (refIsFirstEnter.current) {
      return;
    }
    if (validateVersion(link.minimumAppVersion)) {
      const payload = parseLink(link.url);
      if (!payload) {
        // link didn't match
        return;
      }

      if (refIsAuth.current) {
        executeDynamicLink(payload);
      } else {
        setContinueData({
          type: ContinueData.deepLink,
          payload,
        });
        executeModal({
          type: TypeModal.info,
          payload: [
            [
              {
                text: t('signIn'),
                isBold: true,
              },
            ],
            [
              {
                text: t('signInDeeplink'),
                isBold: false,
              },
            ],
          ],
          priority: 'high',
        });
      }
    } else {
      // version unavailable
      executeModal({
        type: TypeModal.update,
        payload: false,
        priority: 'high',
      });
    }
  };

  const executeDynamicLink = async (payload: IParseLink) => {
    try {
      dispatch(
        actionsOther.setData({
          isLoadingScreen: true,
        }),
      );
      executeModal({
        priority: 'high',
        type: TypeModal.isLoadingScreen,
      });

      switch (payload.type) {
        case TypeShare.wishlist:
          await navigateWishlist(payload.id!);
          break;
        case TypeShare.gift: {
          const {idGift, idWishlist} = payload;
          await navigateGift(idWishlist!, idGift!);
          break;
        }
        case TypeShare.friend: {
          const {id} = payload;
          await navigateFriend(id);
          break;
        }
        case TypeShare.event: {
          const {id} = payload;
          await navigateEvent(id);
          break;
        }
        default:
        // link didn't match
      }
    } finally {
      dispatch(
        actionsOther.setData({
          isLoadingScreen: false,
        }),
      );
    }
  };

  const navigateEvent = (id: string) => {
    navigationRef.current.navigate('MainNavigator', {
      screen: 'Event',
      params: {
        id,
      },
    });
  };

  const navigateFriend = async (id: string) => {
    if (id === userId) {
      navigationRef.current.navigate('MainNavigator', {
        screen: 'Profile',
      });
      return;
    }

    const res = await authService.getUserById(id);

    if (res.success) {
      navigationRef.current.navigate('MainNavigator', {
        screen: 'FriendsNavigator',
        params: {
          screen: 'FriendProfile',
          params: {
            friend: res.data[0],
          },
        },
      });
    }
  };

  const navigateWishlist = async (idWishlist: string) => {
    const result = await wishListService.getWishlistById(idWishlist);
    if (!result.success) {
      return;
    }

    const wishlist = result.data!;
    const ownerId = getIdObj(wishlist.user);

    if (ownerId === userId) {
      navigationRef.current.navigate('InvisibleNavigator', {
        screen: 'WishlistInteract',
        params: {
          idDefaultWishlist: wishlist._id,
        },
      });
      return;
    }

    if (wishlist.visibility === VisibilityType.protected) {
      if (!checkIsFriend(refFriends.current, ownerId)) {
        const res = await authService.getUserById(ownerId);

        executeModal({
          type: TypeModal.info,
          priority: 'high',
          payload: [
            [
              {
                text: 'Wishlist for friends',
                isBold: true,
              },
            ],
            [
              {
                text: 'To see this wishlist you should be friends',
                isBold: false,
              },
            ],
          ],
        });
        if (res.success) {
          navigationRef.current.navigate('MainNavigator', {
            screen: 'FriendsNavigator',
            params: {
              screen: 'FriendProfile',
              params: {
                friend: res.data[0],
              },
            },
          });
        }
        return;
      }
    }

    const res: any = await authService.getUserById(ownerId);
    if (res.success) {
      navigationRef.current.navigate('InvisibleNavigator', {
        screen: 'Wishlist',
        params: {
          defaultWishlist: wishlist,
          owner: res.data[0],
        },
      });
    }
  };

  const navigateGift = async (idWishlist: string, idGift: string) => {
    const resGift = await giftService.getGiftById(idGift);
    idWishlist = getIdObj(resGift.data.wishlist);

    const result = await wishListService.getWishlistById(idWishlist);
    if (!result.success) {
      return;
    }

    const wishlist = result.data!;
    const ownerId = getIdObj(wishlist.user);

    if (ownerId === userId) {
      navigationRef.current.navigate('MainNavigator', {
        screen: 'InvisibleNavigator',
        params: {
          screen: 'GiftInteract',
          params: {
            id: idGift,
            currentWishlist: wishlist,
          },
        },
      });
      return;
    }

    if (wishlist.visibility === VisibilityType.protected) {
      if (!checkIsFriend(refFriends.current, ownerId)) {
        const res = await authService.getUserById(ownerId);

        executeModal({
          type: TypeModal.info,
          priority: 'high',
          payload: [
            [
              {
                text: 'Gift for friends',
                isBold: true,
              },
            ],
            [
              {
                text: 'To see this gift you should be friends',
                isBold: false,
              },
            ],
          ],
        });
        if (res.success) {
          navigationRef.current.navigate('MainNavigator', {
            screen: 'FriendsNavigator',
            params: {
              screen: 'FriendProfile',
              params: {
                friend: res.data[0],
              },
            },
          });
        }
        return;
      }
    }

    let owner: any = wishlist.user;
    if (typeof wishlist.user === 'string') {
      const res = await authService.getUserById(wishlist.user);
      if (res.success) {
        owner = res.data[0];
      }
    }
    navigationRef.current.navigate('AdditionalNavigator', {
      screen: 'Gift',
      params: {
        idGift,
        currentWishlist: wishlist,
        owner: owner,
      },
    });
  };

  useEffect(() => {
    if (!enabledDeepLink) {
      return;
    }

    if (isAndroid) {
      dynamicLinks().getInitialLink().then(handleDynamicLink);
    }
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    return () => unsubscribe();
  }, [enabledDeepLink, isAuthDispatch]);

  useEffect(() => {
    if (!isAuthDispatch) {
      return;
    }
    if (isNeededEdit) {
      return;
    }
    if (continueData !== null) {
      if (continueData.type === ContinueData.deepLink) {
        executeDynamicLink(continueData.payload);
      }
      setContinueData(null);
    }
  }, [isAuthDispatch, isNeededEdit]);

  return null;
});

export default UseDeepLinkSetup;
