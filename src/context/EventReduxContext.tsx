import React, {useContext, useEffect} from 'react';
import RemoveNotifications from '../Notifications/RemoveNotifications';
import {subscribeChat, subscribeEvent, unsubscribeChat, unsubscribeEvent} from '../Notifications/subscribes';
import {actionsEvent} from '../redux/event/eventReducer';
import {RootState} from '../redux/reducer';
import {actionsUser} from '../redux/user/userReducer';
import {FilterMessenger, IChat} from '../typings/IChat';
import {IEvent} from '../typings/IEvent';
import StatusAnswerEvent from '../typings/StatusAnswerEvent';
import getIdObj from '../utils/getIdObj';
import {getStoreRef} from '../utils/navigationRef';

interface IEventReduxContext {}

const EventReduxContext = React.createContext({} as IEventReduxContext);

const useEventRedux = () => {
  const context = useContext(EventReduxContext);
  return context;
};

enum TypeEvent {
  moveToFriend = actionsUser.moveToFriend('').type,
  declineFriend = actionsUser.declineFriend('').type,
  cancelFriendRemote = actionsUser.cancelFriendRemote('').type,
  addEvent = actionsEvent.addEvent({} as any).type,
  addChat = actionsEvent.addChat({} as any).type,
  changeRemoteStatus = actionsEvent.changeRemoteStatus({} as any).type,
  removeEvent = actionsEvent.removeEvent('').type,
  setChats = actionsEvent.setChats([]).type,
  setEvents = actionsEvent.setEvents([]).type,
}

let event: any = {};

const eventCatch = (store) => (next) => (action) => {
  event.action = action;
  return next(action);
};

const ProviderEventRedux = ({children}: any) => {
  useEffect(() => {
    event = new Proxy(event, {
      set(target, prop, val) {
        const type = val.type;

        switch (type) {
          case TypeEvent.moveToFriend:
          case TypeEvent.declineFriend:
          case TypeEvent.cancelFriendRemote:
            RemoveNotifications.removeFriendRequest(val.payload);
            break;
          case TypeEvent.changeRemoteStatus:
            RemoveNotifications.removeAnswerForEvent(val.payload);
            break;
          case TypeEvent.addEvent: {
            const event = val.payload as IEvent;
            if (!!event.currentUserStatus) {
              subscribeEvent(event._id);
            }
            if (event.currentUserStatus === StatusAnswerEvent.invited) {
              break;
            }
            event.chats.forEach((c) => {
              if (typeof c !== 'string' && c.type === FilterMessenger.secret) {
                return;
              }

              subscribeChat(getIdObj(c));
            });
            break;
          }
          case TypeEvent.removeEvent: {
            RemoveNotifications.removeAllInfoAboutEvent(val.payload);
            const state = getStoreRef.current() as RootState;
            const findItem = state.event.events.find((e) => e._id === val.payload);

            if (!findItem) {
              break;
            }
            const chats = findItem.chats;

            chats.forEach((c) => {
              unsubscribeChat(getIdObj(c));
            });
            unsubscribeEvent(val.payload);
            break;
          }
          case TypeEvent.addChat: {
            const chat = val.payload as IChat;
            if (chat.type !== FilterMessenger.secret) {
              subscribeChat(chat._id);
            }
            break;
          }
          case TypeEvent.setChats: {
            const chats = val.payload as IChat[];
            chats.forEach((c) => {
              if (c.type !== FilterMessenger.secret) {
                subscribeChat(c._id);
              }
            });
            break;
          }
          case TypeEvent.setEvents: {
            const events = val.payload as IEvent[];
            events.forEach((e) => {
              if (!!e.currentUserStatus) {
                subscribeEvent(e._id);
              }
            });
            break;
          }
        }
        return true;
      },
    });
  }, []);

  return <EventReduxContext.Provider value={null}>{children}</EventReduxContext.Provider>;
};

export {useEventRedux, eventCatch};
export default ProviderEventRedux;
