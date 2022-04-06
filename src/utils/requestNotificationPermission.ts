import messaging, {FirebaseMessagingTypes} from '@react-native-firebase/messaging';

type IOSPermissions = FirebaseMessagingTypes.IOSPermissions;

const requestNotificationPermission = async (options: IOSPermissions) => {
  const authorizationStatus = await messaging().requestPermission(options);
  return authorizationStatus as FirebaseMessagingTypes.AuthorizationStatus;
};

const getNotificationPermission = async () => {
  return (await messaging().hasPermission()) as FirebaseMessagingTypes.AuthorizationStatus;
};

export {requestNotificationPermission, getNotificationPermission};
