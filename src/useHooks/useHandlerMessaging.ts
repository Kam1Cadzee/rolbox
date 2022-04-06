import {FirebaseMessagingTypes} from '@react-native-firebase/messaging';
import IDataMessage, {TitleTopics} from '../typings/TypeTopic';
import {dispatchRef, userIdRef} from '../utils/navigationRef';
import TypeHandlerMessaging from '../Notifications/TypeHandlerMessaging';
import INotificationOptions from '../Notifications/INotificationOptions';
import HandlersTopic from '../Notifications/HandlersTopic';

const useHandlerMessaging = () => {
  return (type: TypeHandlerMessaging, payload: FirebaseMessagingTypes.RemoteMessage) => {
    switchHandlerMessaging({type, payload});
  };
};

const switchHandlerMessaging = ({payload, type}: INotificationOptions) => {
  const data: IDataMessage = payload.data as any;
  const dispatch = dispatchRef.current;
  const userId = userIdRef.current;

  switch (data.topic) {
    case TitleTopics.system:
      HandlersTopic.handlersSystemTopics({payload, dispatch, type});
      break;
    case TitleTopics.chat:
      HandlersTopic.handlersChatTopics({payload, dispatch, type, userId});
      break;
    default:
      HandlersTopic.handlersWithoutTopics({payload, dispatch, type, userId});
  }
};

export {switchHandlerMessaging, TypeHandlerMessaging};
export default useHandlerMessaging;
