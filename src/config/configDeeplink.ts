import dynamicLinks from '@react-native-firebase/dynamic-links';
import {IWishlist} from '../typings/IWishlist';
import IGift from '../typings/IGift';
import IParseLink from '../typings/IParseLink';
import config from './configMode';

const domain = 'https://rolbox.app/';

enum TypeShare {
  wishlist = 'wishlist',
  gift = 'gift',
  friend = 'friend',
  event = 'event',
}
const configDeeplink = {
  domainUriPrefix: 'https://rolbox.app',
  minimumVersion: {
    base: {
      ios: '0.0.025',
      android: '25',
    },
  },
  shareLink: {
    wishlist: `${domain}${TypeShare.wishlist}/`,
    gift: `${domain}${TypeShare.gift}/`,
    friend: `${domain}${TypeShare.friend}/`,
    event: `${domain}${TypeShare.event}/`,
  },
};

const baseConfig = (fallbackUrliOS: string, fallbackUrlAnroid: string) => {
  return {
    domainUriPrefix: configDeeplink.domainUriPrefix,
    ios: {
      appStoreId: config.appConfig.appStoreId,
      bundleId: config.appConfig.bundleId,
      minimumVersion: configDeeplink.minimumVersion.base.ios,
      fallbackUrl: fallbackUrliOS,
    },
    android: {
      packageName: config.appConfig.packageName,
      fallbackUrl: fallbackUrlAnroid,
      minimumVersion: configDeeplink.minimumVersion.base.android,
    },
  };
};

const buildLinkWishlist = async (wishlist: IWishlist, fallbackUrliOS: string, fallbackUrlAnroid: string) => {
  return dynamicLinks().buildShortLink({
    link: `${configDeeplink.shareLink.wishlist}${wishlist._id}`,
    ...baseConfig(fallbackUrliOS, fallbackUrlAnroid),
  });
};

const buildLinkGift = async (gift: IGift, fallbackUrliOS: string, fallbackUrlAnroid: string) => {
  return dynamicLinks().buildShortLink({
    link: `${configDeeplink.shareLink.gift}${gift.wishlist}/${gift._id}`,
    ...baseConfig(fallbackUrliOS, fallbackUrlAnroid),
  });
};

const buildLinkFriend = async (idFriend: string, fallbackUrliOS: string, fallbackUrlAnroid: string) => {
  return dynamicLinks().buildShortLink({
    link: `${configDeeplink.shareLink.friend}${idFriend}`,
    ...baseConfig(fallbackUrliOS, fallbackUrlAnroid),
  });
};

const buildLinkEvent = async (idEvent: string, fallbackUrliOS: string, fallbackUrlAnroid: string) => {
  return dynamicLinks().buildShortLink({
    link: `${configDeeplink.shareLink.event}${idEvent}`,
    ...baseConfig(fallbackUrliOS, fallbackUrlAnroid),
  });
};

const parseLink = (link: string) => {
  if (link.indexOf(configDeeplink.shareLink.wishlist) !== -1) {
    return {
      type: TypeShare.wishlist,
      id: link.replace(configDeeplink.shareLink.wishlist, ''),
    } as IParseLink;
  } else if (link.indexOf(configDeeplink.shareLink.gift) !== -1) {
    const [idWishlist, idGift] = link.replace(configDeeplink.shareLink.gift, '').split('/');

    return {
      type: TypeShare.gift,
      idGift,
      idWishlist,
    } as IParseLink;
  } else if (link.indexOf(configDeeplink.shareLink.friend) !== -1) {
    return {
      type: TypeShare.friend,
      id: link.replace(configDeeplink.shareLink.friend, ''),
    } as IParseLink;
  } else if (link.indexOf(configDeeplink.shareLink.event) !== -1) {
    return {
      type: TypeShare.event,
      id: link.replace(configDeeplink.shareLink.event, ''),
    };
  }
  return null;
};

export {buildLinkWishlist, TypeShare, parseLink, buildLinkGift, buildLinkEvent, buildLinkFriend};
