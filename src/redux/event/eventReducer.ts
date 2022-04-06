import {CreatorReducer} from '../base/base';
import {createCachedSelector} from 're-reselect';
import {RootState} from '../reducer';
import {IEventActions, IEventState} from './eventTypes';
import {FilterEvents, IEvent} from '../../typings/IEvent';
import {IWishlist} from '../../typings/IWishlist';
import StatusAnswerEvent from '../../typings/StatusAnswerEvent';
import {FilterMessenger, IChat, IMessage, IMessageUpdate} from '../../typings/IChat';
import {currentChatRef, userIdRef} from '../../utils/navigationRef';
import {IUser, UserExtension} from '../../typings/IUser';
import {actionsUser} from '../user/userReducer';
import getIdObj from '../../utils/getIdObj';
import {IPayloadAnswerEvent} from '../../typings/TypeTopic';

const init: IEventState = {
  chats: [],
  events: [],
  lastMessage: null,
  cacheChats: {},
  keyForUnreadMessages: 0,
};

const creator = new CreatorReducer<IEventActions, IEventState>('event');

creator.addAction<IEvent[]>('setEvents', (state, action) => {
  state.events = action.payload;
  return state;
});
creator.addAction<{id: string; wishlist: IWishlist}>('updateWishlistForEvent', (state, action) => {
  const findEvent = state.events.find((e) => e._id === action.payload.id);
  if (findEvent) {
    findEvent.wishlist = action.payload.wishlist;
  }
  return state;
});
creator.addAction<IEvent>('addEvent', (state, action) => {
  const events = state.events;
  const findIndex = events.findIndex((w) => w._id === action.payload._id);

  if (findIndex === -1) {
    // add wishlist
    state.events = [...events, action.payload];
  } else {
    // update wishlist
    state.events = state.events.filter((_, i) => i !== findIndex);
    state.events.push(action.payload);
  }

  action.payload.chats.forEach((c) => {
    if (typeof c === 'string') {
      return;
    }
    state = creator.getHandlerReducer('addChat')(state, {
      payload: c,
    });
  });
  return state;
});
creator.addAction<string>('removeEvent', (state, action) => {
  const findItem = state.events.find((e) => e._id === action.payload);
  if (!findItem) {
    return state;
  }
  const chats = findItem.chats;
  state.chats = state.chats.filter((c) => !chats.some((id) => c._id === getIdObj(id)));
  state.events = state.events.filter((w) => w._id !== action.payload);
  state.keyForUnreadMessages = state.keyForUnreadMessages + 1;

  return state;
});
creator.addAction<IPayloadAnswerEvent>('changeStatus', (state, action) => {
  const findEventIndex = state.events.findIndex((e) => e._id === action.payload.event);

  if (findEventIndex === -1) {
    return state;
  }

  state.events[findEventIndex].currentUserStatus = action.payload.answer;

  return creator.getHandlerReducer('changeRemoteStatus')(state, action);
});
creator.addAction('setChats', (state, action) => {
  state.chats = action.payload;
  state.keyForUnreadMessages = state.keyForUnreadMessages + 1;
  return state;
});
creator.addAction<IChat>('addChat', (state, action) => {
  const chats = state.chats;
  const findIndex = chats.findIndex((w) => w._id === action.payload._id);
  action.payload.updatedAt = new Date(action.payload.updatedAt);
  if (action.payload.type === FilterMessenger.local) {
    const member = action.payload.members.find((m) => m._id !== userIdRef.current);
    if (member) {
      action.payload.name = UserExtension.fullName(member);
    }
  }
  if (findIndex === -1) {
    state.chats = [...chats, action.payload];
  } else {
    state.chats = state.chats.filter((_, i) => i !== findIndex);
    state.chats.push(action.payload);
  }

  return state;
});
creator.addAction<{id: string; isDeleted: boolean}>('setDeleted', (state, action) => {
  const findItem = state.events.find((e) => e._id === action.payload.id);
  if (!findItem) {
    return state;
  }
  findItem.isDeleted = action.payload.isDeleted;
  return state;
});
creator.addAction<string[]>('removeChats', (state, action) => {
  state.chats = state.chats.filter((c) => !action.payload.some((id) => id === c._id));
  return state;
});
creator.addAction<IMessageUpdate>('updateChat', (state, action) => {
  const date = new Date(action.payload.timestump);
  const idChat = action.payload.chat;
  const lastMessage = action.payload;

  const findIndex = state.chats.findIndex((c) => c._id === idChat);

  if (findIndex === -1) {
    return state;
  }

  const chat = state.chats[findIndex];
  const unreadMessages = chat.unreadMessages ?? 0;

  state.chats[findIndex] = {...chat, lastMessage: lastMessage, updatedAt: date};
  state.lastMessage = lastMessage;
  if (lastMessage.isUpdateUnreadMessages && currentChatRef.current !== lastMessage.chat) {
    state.chats[findIndex].unreadMessages = unreadMessages + 1;
    state.keyForUnreadMessages = state.keyForUnreadMessages + 1;
  }
  return state;
});
creator.addAction<{messages: IMessage[]; idChat: string}>('setCacheMessagesBegin', (state, action) => {
  const messages = state.cacheChats[action.payload.idChat];
  if (messages) {
    state.cacheChats[action.payload.idChat] = [...action.payload.messages, ...messages];
  } else {
    state.cacheChats[action.payload.idChat] = action.payload.messages;
  }
  return state;
});
creator.addAction<{messages: IMessage[]; idChat: string}>('setCacheMessagesEnd', (state, action) => {
  const messages = state.cacheChats[action.payload.idChat];
  if (messages) {
    state.cacheChats[action.payload.idChat] = [...messages, ...action.payload.messages];
  } else {
    state.cacheChats[action.payload.idChat] = action.payload.messages;
  }
  return state;
});
creator.addAction<string>('clearUnreadMessages', (state, action) => {
  const findItem = state.chats.find((c) => c._id === action.payload);
  if (findItem) {
    findItem.unreadMessages = 0;
    state.keyForUnreadMessages = state.keyForUnreadMessages + 1;
  }
  return state;
});
creator.addAction<{user: IUser; idChat: string}>('addMemberToChat', (state, action) => {
  const findItem = state.chats.find((c) => c._id === action.payload.idChat);
  if (!findItem) {
    return state;
  }
  findItem.members.push(action.payload.user);
  return state;
});
creator.addAction(actionsUser.setIsAuth, (state, action) => {
  if (!action.payload) {
    return {
      cacheChats: {},
      chats: [],
      events: [],
      keyForUnreadMessages: state.keyForUnreadMessages,
      lastMessage: null,
    };
  }
  return state;
});
creator.addAction<IPayloadAnswerEvent>('changeRemoteStatus', (state, action) => {
  try {
    const findEventIndex = state.events.findIndex((e) => e._id === action.payload.event);

    if (findEventIndex === -1) {
      return state;
    }
    const findGuestIndex = state.events[findEventIndex].guests.findIndex((g) => g.user._id === action.payload.guest);

    if (findGuestIndex === -1) {
      return state;
    }

    const guest = state.events[findEventIndex].guests[findGuestIndex];

    state.events[findEventIndex].guests[findGuestIndex] = {
      ...guest,
      status: action.payload.answer,
    };

    const chatsId = state.events[findEventIndex].chats.map((c) => getIdObj(c));

    chatsId.forEach((chatId) => {
      const findChatIndex = state.chats.findIndex((c) => c._id === chatId);
      if (findChatIndex === -1) {
        return;
      }
      if (action.payload.answer === StatusAnswerEvent.deleted || action.payload.answer === StatusAnswerEvent.no) {
        state.chats[findChatIndex].members = state.chats[findChatIndex].members.filter(
          (m) => m._id !== action.payload.guest,
        );
      } else {
        const findMemberIndex = state.chats[findChatIndex].members.findIndex((m) => m._id === action.payload.guest);
        if (findMemberIndex === -1) {
          state.chats[findChatIndex].members = [...state.chats[findChatIndex].members, guest.user];
        }
      }
    });
    return state;
  } catch (e) {
    return state;
  }
});
creator.addAction<{chats: string[]; users: string[]}>('updateMembers', (state, action) => {
  const {chats, users} = action.payload;
  state.chats.forEach((c, index) => {
    if (chats.some((cid) => cid === c._id)) {
      state.chats[index] = {
        ...state.chats[index],
        members: state.chats[index].members.filter((m) => {
          if (users.some((uid) => uid === m._id)) {
            return false;
          }
          return true;
        }),
      };
    }
  });
  return state;
});

const actionsEvent = creator.createActions();

class SelectorsEvent {
  static getKeyUnreadMessages(state: RootState) {
    return state.event.keyForUnreadMessages;
  }
  static getEvents(state: RootState) {
    return state.event.events;
  }
  static isEmpty(state: RootState) {
    return state.event.events.length === 0;
  }
  static getEventsWithTypeNewCount(state: RootState) {
    return SelectorsEvent.getEventsWithTypeNew(state).length;
  }
  static getEventById(id: string) {
    return (state: RootState) => {
      const res = state.event.events;
      return res.find((e) => e._id === id);
    };
  }
  static getMemberOfChat = createCachedSelector(
    SelectorsEvent.getChats,
    (_, idChat, idMember) => ({idChat, idMember}),

    (chats, {idChat, idMember}) => {
      const findChat = chats.find((c) => c._id === idChat);
      if (!findChat) {
        return null;
      }

      const findMember = findChat.members.find((m) => m._id === idMember);

      return findMember;
    },
  )((state, idChat, idMember) => {
    const findChat = state.event.chats.find((c) => c._id === idChat);
    return idMember + (findChat?.members.length ?? '');
  });
  static getEventsWithTypeNew(state: RootState) {
    const events = SelectorsEvent.getEvents(state);
    const res = events
      .filter((e) => e.currentUserStatus === StatusAnswerEvent.invited)

      .map((e) => {
        e.date = new Date(e.date);
        return {
          type: StatusAnswerEvent.invited,
          date: e.date,
          payload: e,
        };
      })
      .sort((a, b) => {
        return a.date.getTime() - b.date.getTime();
      });
    return res;
  }
  static getEventsWithTypeMine(state: RootState) {
    const events = SelectorsEvent.getEvents(state);
    return events
      .filter((e) => !e.currentUserStatus)
      .map((e) => {
        e.date = new Date(e.date);
        return {
          type: FilterEvents.mine,
          date: e.date,
          payload: e,
        };
      });
  }
  static getEventsWithTypeInvited(state: RootState) {
    const events = SelectorsEvent.getEvents(state);
    return events
      .filter((e) => e.currentUserStatus && e.currentUserStatus !== StatusAnswerEvent.invited)
      .map((e) => {
        e.date = new Date(e.date);
        return {
          type: e.currentUserStatus,
          date: e.date,
          payload: e,
        };
      });
  }

  static getCacheMessages(state: RootState) {
    const res = state.event.cacheChats;
    return res;
  }

  static getChats(state: RootState) {
    const res = state.event.chats;
    return res;
  }

  static isEmptyChats(state: RootState) {
    return SelectorsEvent.getChats(state).length === 0;
  }

  static getUnreadCount = createCachedSelector(SelectorsEvent.getChats, (chats) => {
    const res = {
      [FilterMessenger.local]: 0,
      [FilterMessenger.group]: 0,
      [FilterMessenger.secret]: 0,
    };
    chats.forEach((c) => {
      const count = c.unreadMessages ? c.unreadMessages : 0;
      res[c.type] = res[c.type] + count;
    });
    return res;
  })((state) => {
    return state.event.keyForUnreadMessages;
  });

  static getChatsByType = createCachedSelector(
    SelectorsEvent.getChats,
    (_, type) => type,

    (chats, type) => {
      return chats
        .filter((c) => {
          if (c.type === type && type === FilterMessenger.local) {
            return !!c.lastMessage;
          }
          return c.type === type;
        })
        .sort((a, b) => {
          const aTime = a.updatedAt.getTime();
          const bTime = b.updatedAt.getTime();

          return bTime - aTime;
        });
    },
  )((state, type) => {
    const message = SelectorsEvent.getLastMessage(state);
    const count = state.event.keyForUnreadMessages;
    return (message?._id ?? '') + count;
  });

  static getOneToOneChat(id: string) {
    return (state: RootState) => {
      const chats = state.event.chats;

      const findChat = chats.find((c) => {
        if (c.type === FilterMessenger.local) {
          return c.members.some((m) => getIdObj(m) === id);
        }
        return false;
      });

      return findChat ?? null;
    };
  }

  static getChatsById = createCachedSelector(
    SelectorsEvent.getChats,
    (_, id) => id,

    (chats, id) => {
      return chats.find((c) => c._id === id)!;
    },
  )((state, id) => {
    return id;
  });

  static getCacheMessagesById = createCachedSelector(
    SelectorsEvent.getCacheMessages,
    (_, id, lastMessage) => ({id, lastMessage}),

    (obj, ids) => {
      return obj[ids.id] ?? [];
    },
  )((state, id, lastMessage) => {
    return state.event.cacheChats[id] ? lastMessage : id;
  });

  static getLastMessage(state: RootState) {
    return state.event.lastMessage;
  }
}
export {actionsEvent, SelectorsEvent};
export default creator.createReducer(init);
