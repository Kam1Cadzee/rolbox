import PushNotification from 'react-native-push-notification';
import {IMessage} from '../typings/IChat';
import IDataMessage, {IPayloadAnswerEvent, IPayloadRequestFriend, TypeTopics} from '../typings/TypeTopic';

class RemoveNotifications {
  static removeMessagesForChat(idChat: string) {
    const ids: string[] = [];
    PushNotification.getDeliveredNotifications((notifications) => {
      for (const n of notifications) {
        const data: IDataMessage = n.userInfo;
        if (data) {
          const parseDate = JSON.parse(data.payload) as IMessage;
          if (parseDate.chat === idChat) {
            ids.push(n.identifier);
          }
        }
      }
      PushNotification.removeDeliveredNotifications(ids);
    });
  }

  static removeFriendRequest(id: string) {
    const ids: string[] = [];
    PushNotification.getDeliveredNotifications((notifications) => {
      for (const n of notifications) {
        const data: IDataMessage = n.userInfo;
        if (data) {
          const parseDate = JSON.parse(data.payload) as IPayloadRequestFriend;
          if (parseDate.requester === id) {
            ids.push(n.identifier);
          }
        }
      }

      PushNotification.removeDeliveredNotifications(ids);
    });
  }

  static removeAnswerForEvent({event, guest}: IPayloadAnswerEvent) {
    const ids: string[] = [];
    PushNotification.getDeliveredNotifications((notifications) => {
      for (const n of notifications) {
        const data: IDataMessage = n.userInfo;
        if (data && data.type === TypeTopics.answerEvent) {
          const parseDate = JSON.parse(data.payload) as IPayloadAnswerEvent;
          if (parseDate.event === event && parseDate.guest === guest) {
            ids.push(n.identifier);
          }
        }
      }
      ids.shift();
      PushNotification.removeDeliveredNotifications(ids);
    });
  }

  static removeAllInfoAboutEvent(id: string) {
    const ids: string[] = [];
    let isIgnoredOneNotification = false;
    PushNotification.getDeliveredNotifications((notifications) => {
      for (const n of notifications) {
        const data: IDataMessage = n.userInfo;
        const parseData = JSON.parse(data.payload);
        if (!isIgnoredOneNotification) {
          if (data.type === TypeTopics.deleteEventEvent || data.type === TypeTopics.removeParticipantEvent) {
            isIgnoredOneNotification = true;
            continue;
          }
        }
        const eventId = parseData._id ?? parseData.event;
        if (eventId === id) {
          ids.push(n.identifier);
        }
      }
      PushNotification.removeDeliveredNotifications(ids);
      PushNotification.removeAllDeliveredNotifications();
    });
  }
}

export default RemoveNotifications;
