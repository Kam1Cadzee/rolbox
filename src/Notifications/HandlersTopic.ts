import ToastHelper from '../Helpers/ToastHelper';
import {actionsEvent} from '../redux/event/eventReducer';
import {actionsUser} from '../redux/user/userReducer';
import eventService from '../services/eventService/eventService';
import {IChat, IMessage} from '../typings/IChat';
import {IEvent} from '../typings/IEvent';
import StatusAnswerEvent from '../typings/StatusAnswerEvent';
import IDataMessage, {
  TypeTopics,
  IPayloadRejectFriend,
  IPayloadRequestFriend,
  IPayloadAnswerEvent,
} from '../typings/TypeTopic';
import getIdObj from '../utils/getIdObj';
import t from '../utils/t';
import HandlersChatTopic from './HandlersChatTopic';
import HandlersSystemTopic from './HandlersSystemTopic';
import HandlersWithoutTopic from './HandlersWithoutTopic';
import INotificationOptions from './INotificationOptions';
import RemoveNotifications from './RemoveNotifications';
import TypeHandlerMessaging from './TypeHandlerMessaging';

class HandlersTopic {
  public static handlersSystemTopics({payload, dispatch}: INotificationOptions) {
    const data: IDataMessage = payload.data as any;

    switch (data.type) {
      case TypeTopics.config:
        HandlersSystemTopic.Config_Foreground(dispatch);
        break;
      case TypeTopics.signOutGoogle:
        HandlersSystemTopic.SignOutGoogle_Foreground(dispatch);
        break;
    }
  }

  public static async handlersWithoutTopics({payload, dispatch, type, userId}: INotificationOptions) {
    const data: IDataMessage = payload.data as any;

    switch (data.type) {
      case TypeTopics.acceptFriend: {
        const parseDate = JSON.parse(data.payload) as IPayloadRejectFriend;
        dispatch(actionsUser.acceptFriendRemote(parseDate.responder));
        break;
      }
      case TypeTopics.cancelFriend: {
        const parseDate = JSON.parse(data.payload) as IPayloadRejectFriend;
        dispatch(actionsUser.cancelFriendRemote(parseDate.responder));
        break;
      }
      case TypeTopics.declineFriend: {
        const parseDate = JSON.parse(data.payload) as IPayloadRejectFriend;
        dispatch(actionsUser.declineFriendRemote(parseDate.responder));
        break;
      }
      case TypeTopics.deleteFriend: {
        const parseDate = JSON.parse(data.payload) as IPayloadRejectFriend;
        dispatch(actionsUser.removeFriend(parseDate.responder));

        break;
      }
      case TypeTopics.newChat: {
        const parseDate = JSON.parse(data.payload) as IChat;
        dispatch(actionsEvent.addChat(parseDate));
        break;
      }
      case TypeTopics.requestFriend: {
        const parseDate = JSON.parse(data.payload) as IPayloadRequestFriend;

        if (parseDate.requester === userId) {
          return;
        }
        if (type === TypeHandlerMessaging.openApp) {
          HandlersWithoutTopic.RequestFriend_OpenApp(dispatch, parseDate, userId);
        } else if (type === TypeHandlerMessaging.message) {
          HandlersWithoutTopic.RequestFriend_Foreground(dispatch, parseDate, userId);
        } else if (type === TypeHandlerMessaging.background) {
          HandlersWithoutTopic.RequestFriend_Foreground(dispatch, parseDate, userId);
        }
        break;
      }
      case TypeTopics.invitationEvent: {
        const parseDate = JSON.parse(data.payload) as IEvent;
        if (getIdObj(parseDate.owner) === userId) {
          return;
        }
        let event = parseDate;
        const res = await eventService.getEventById(parseDate._id);
        if (res.success) {
          event = res.data;
        }

        event.currentUserStatus = StatusAnswerEvent.invited;
        dispatch(actionsEvent.addEvent(event));

        if (type === TypeHandlerMessaging.message) {
          ToastHelper.showToast({
            onPress: () => HandlersWithoutTopic.InvitationEvent_OpenApp(event._id),
            text1: t('createEventTitle'),
            text2: t('createEventBody', {
              event: payload.notification.bodyLocArgs[0],
            }),
          });
        } else if (type === TypeHandlerMessaging.openApp) {
          HandlersWithoutTopic.InvitationEvent_OpenApp(event._id);
        }
        break;
      }
      case TypeTopics.removeParticipantEvent: {
        const parseDate = JSON.parse(data.payload) as any;
        if (getIdObj(parseDate.owner) === userId) {
          return;
        }

        dispatch(actionsEvent.removeEvent(parseDate.event));
        break;
      }

      case TypeTopics.deleteEventEvent: {
        const parseDate = JSON.parse(data.payload) as any;
        if (getIdObj(parseDate.owner) === userId) {
          return;
        }

        dispatch(actionsEvent.removeEvent(parseDate.event));
        break;
      }
      case TypeTopics.answerEvent:
        const parseDate = JSON.parse(data.payload) as IPayloadAnswerEvent;
        parseDate.answer = parseDate.answer === StatusAnswerEvent.deleted ? StatusAnswerEvent.no : parseDate.answer;
        dispatch(actionsEvent.changeRemoteStatus(parseDate));

        if (type === TypeHandlerMessaging.openApp) {
          HandlersWithoutTopic.InvitationEvent_OpenApp(parseDate.event);
        }
        break;
    }
  }

  public static handlersChatTopics({payload, dispatch, type, userId}: INotificationOptions) {
    const data: IDataMessage = payload.data as any;

    if (data.type === TypeTopics.receiveMessage) {
      const parseDate = JSON.parse(data.payload) as IMessage;

      if (type === TypeHandlerMessaging.openApp) {
        RemoveNotifications.removeMessagesForChat(parseDate.chat);
        HandlersChatTopic.ReceiveMessage_OpenApp(dispatch, parseDate);
      } else if (type === TypeHandlerMessaging.message) {
        HandlersChatTopic.ReceiveMessage_Foreground(dispatch, parseDate, userId);
      } else if (type === TypeHandlerMessaging.background) {
        HandlersChatTopic.ReceiveMessage_Background(dispatch, parseDate, userId);
      }
    }
  }
}

export default HandlersTopic;
