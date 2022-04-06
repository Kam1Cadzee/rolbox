import {Share} from 'react-native';
import {useSelector} from 'react-redux';
import {buildLinkEvent, buildLinkFriend, buildLinkGift, buildLinkWishlist} from '../config/configDeeplink';
import {IWishlist} from '../typings/IWishlist';
import {selectorsUser} from '../redux/user/userReducer';
import IGift from '../typings/IGift';
import t from '../utils/t';
import {selectorsConfig} from '../redux/config/configReducer';
import {IEvent} from '../typings/IEvent';
import {UserExtension} from '../typings/IUser';

const useSharing = () => {
  const fallbackUrlIOS = useSelector(selectorsConfig.getItemConfig('fallbackUrlIOS')) as string;
  const fallbackUrlAndroid = useSelector(selectorsConfig.getItemConfig('fallbackUrlAndroid')) as string;
  const user = useSelector(selectorsUser.getUser);

  const shareWishlist = async (wishlist: IWishlist) => {
    try {
      const fullName = UserExtension.fullName(wishlist.user);
      const link = await buildLinkWishlist(wishlist, fallbackUrlIOS, fallbackUrlAndroid);
      const str = t('shareWishlist', {wishlist: wishlist.name, owner: fullName});

      await Share.share(
        {
          message: link,
          url: link,
          title: str,
        },
        {
          dialogTitle: str,
        },
      );
    } catch (e) {}
  };

  const shareGift = async (gift: IGift) => {
    try {
      const fullName = UserExtension.fullName(gift.user);
      const link = await buildLinkGift(gift, fallbackUrlIOS, fallbackUrlAndroid);
      const str = t('shareGift', {gift: gift.name, owner: fullName});
      await Share.share(
        {
          message: link,
          url: link,
          title: str,
        },
        {
          dialogTitle: str,
        },
      );
    } catch {}
  };

  const shareFriend = async () => {
    try {
      const link = await buildLinkFriend(user._id, fallbackUrlIOS, fallbackUrlAndroid);
      const str = t('shareInvitaion');

      await Share.share(
        {
          message: link,
          url: link,
          title: str,
        },
        {
          dialogTitle: str,
        },
      );
    } catch {}
  };

  const shareEvent = async (e: IEvent) => {
    try {
      const link = await buildLinkEvent(e._id, fallbackUrlIOS, fallbackUrlAndroid);

      const str = t('shareEvent');

      await Share.share(
        {
          message: link,
          url: link,
          title: str,
        },
        {
          dialogTitle: str,
        },
      );
    } catch (e) {}
  };

  return {
    shareWishlist,
    shareGift,
    shareFriend,
    shareEvent,
  };
};

export default useSharing;
