import {TitleTopics} from '../typings/TypeTopic';
import {RootState} from './reducer';
import messaging from '@react-native-firebase/messaging';
import {actionsOther} from './other/otherReducer';
import {unsubscribeChat, unsubscribeEvent, unsubscribeTopic} from '../Notifications/subscribes';

const unsubscribeAll = () => {
  return async (dispatch, getState) => {
    const root: RootState = getState();

    try {
      await Promise.all([
        Promise.all(root.event.chats.map((c) => unsubscribeChat(c._id))),
        Promise.all(root.event.events.filter((item) => !!item.currentUserStatus).map((e) => unsubscribeEvent(e._id))),
      ]);
    } catch {}

    dispatch(actionsOther.setNotificationToken(null));
    unsubscribeTopic(TitleTopics.system);
    try {
      await messaging().deleteToken();
    } catch {}

    if (messaging().isDeviceRegisteredForRemoteMessages) {
      try {
        await messaging().unregisterDeviceForRemoteMessages();
      } catch {}
    }
  };
};

export {unsubscribeAll};
