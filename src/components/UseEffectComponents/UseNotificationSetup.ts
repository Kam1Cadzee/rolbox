import React, {useEffect} from 'react';
import {getUniqueId} from 'react-native-device-info';
import {useDispatch, useSelector} from 'react-redux';
import {actionsOther, selectorsOther} from '../../redux/other/otherReducer';
import authService from '../../services/authService/authService';
import {TitleTopics} from '../../typings/TypeTopic';
import {isIOS, isAndroid} from '../../utils/isPlatform';
import useHandlerMessaging, {TypeHandlerMessaging, switchHandlerMessaging} from '../../useHooks/useHandlerMessaging';
import messaging, {FirebaseMessagingTypes} from '@react-native-firebase/messaging';
import {requestNotificationPermission} from '../../utils/requestNotificationPermission';
import {actionsEvent} from '../../redux/event/eventReducer';
import chatService from '../../services/chatService/chatService';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import {UserExtension} from '../../typings/IUser';
import {selectorsUser} from '../../redux/user/userReducer';
import {FilterMessenger} from '../../typings/IChat';
import eventService from '../../services/eventService/eventService';
import {subscribeTopic} from '../../Notifications/subscribes';

const UseNotificationSetup = React.memo(() => {
  const dispatch = useDispatch();
  const userId = useSelector(selectorsUser.getUserId);
  const tokenNotification = useSelector(selectorsOther.getTokenNotification);

  const switchHandlerMessaging = useHandlerMessaging();

  const handleCatchMessageOpenedApp = (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
    console.log(
      '------------------>    ' + (isIOS ? 'IOS' : 'ANDROID') + ': handleCatchMessageOpenedApp!',
      remoteMessage,
    );
    if (remoteMessage) {
      switchHandlerMessaging(TypeHandlerMessaging.openApp, remoteMessage);
    }
  };

  const handleMessage = async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
    console.log('------------------>    ' + (isIOS ? 'IOS' : 'ANDROID') + ': handleMessage!', remoteMessage);
    if (remoteMessage) {
      switchHandlerMessaging(TypeHandlerMessaging.message, remoteMessage);
    }
  };

  useEffect(() => {
    messaging().onNotificationOpenedApp(handleCatchMessageOpenedApp);
    if (isAndroid) {
      messaging().getInitialNotification().then(handleCatchMessageOpenedApp);
    }

    const unsubscribe = messaging().onMessage(handleMessage);

    const unsubscribeToken = messaging().onTokenRefresh(async (refreshToken) => {
      const id = await getUniqueId();

      const res = await authService.notification_tokens(refreshToken);
      if (res.success) {
        dispatch(actionsOther.setNotificationToken(refreshToken));
      } else {
        dispatch(actionsOther.setNotificationToken(null));
      }
    });

    return () => {
      unsubscribe();
      unsubscribeToken();
    };
  }, []);

  // Разрешения iOS
  const handleNotificationPermission = async () => {
    const res = (await requestNotificationPermission({
      alert: true,
      sound: true,
      criticalAlert: true,
      badge: true,
    })) as FirebaseMessagingTypes.AuthorizationStatus;

    if ([1, 2].some((n) => n === res)) {
      //Grated notification permission
    }
  };

  const loadEvents = async () => {
    const res = await eventService.getEvents();
    if (res.success) {
      dispatch(actionsEvent.setEvents(res.data));
    }
  };

  const loadChats = async () => {
    const res = await chatService.getChats();

    if (res.success) {
      res.data.forEach((item) => {
        item.updatedAt = new Date(item.updatedAt);
        if (item.type === FilterMessenger.local) {
          const member = item.members.find((m) => m._id !== userId);
          if (member) {
            item.name = UserExtension.fullName(member);
          }
        }
      });
      dispatch(actionsEvent.setChats(res.data));
      return res.data;
    }
  };

  const setupToken = async () => {
    if (!messaging().isDeviceRegisteredForRemoteMessages) {
      await messaging().registerDeviceForRemoteMessages();
    }
    const token = await messaging().getToken();

    if (tokenNotification !== token) {
      const res = await authService.notification_tokens(token);

      if (res.success) {
        dispatch(actionsOther.setNotificationToken(token));
      }
    }

    loadChats();
    loadEvents();
    subscribeTopic(TitleTopics.system);
  };

  useEffect(() => {
    handleNotificationPermission();
    setupToken();
  }, []);

  return null;
});

const backgroundMessageHandler = () => {
  if (isAndroid) {
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('------------------>    ANDROID' + ': Message handled in the background!', remoteMessage);
      switchHandlerMessaging({
        type: TypeHandlerMessaging.background,
        payload: remoteMessage,
      });
    });
  } else {
    PushNotification.configure({
      onNotification: function (notification) {
        if (!notification.foreground) {
          console.log('------------------>    iOS' + ': Message handled in the background!', notification);
          switchHandlerMessaging({
            type: TypeHandlerMessaging.background,
            payload: notification,
          });
        }

        notification.finish(PushNotificationIOS.FetchResult.NewData);
      },

      popInitialNotification: true,
      requestPermissions: false,
    });
  }
};

export {backgroundMessageHandler};
export default UseNotificationSetup;
