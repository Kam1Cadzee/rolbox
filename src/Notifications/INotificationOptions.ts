import {FirebaseMessagingTypes} from '@react-native-firebase/messaging';
import TypeHandlerMessaging from './TypeHandlerMessaging';

interface INotificationOptions {
  type: TypeHandlerMessaging;
  payload: FirebaseMessagingTypes.RemoteMessage;
  dispatch?: any;
  userId?: string;
}

export default INotificationOptions;
