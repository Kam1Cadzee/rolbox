import {IChat, IMessage, IMessageUpdate} from '../../typings/IChat';
import {IEvent} from '../../typings/IEvent';
import {IUser} from '../../typings/IUser';
import {IWishlist} from '../../typings/IWishlist';
import StatusAnswerEvent from '../../typings/StatusAnswerEvent';
import {IPayloadAnswerEvent} from '../../typings/TypeTopic';

export interface IEventActions {
  setEvents: (events: IEvent[]) => any;
  updateWishlistForEvent: (obj: {id: string; wishlist: IWishlist}) => any;
  addEvent: (data: IEvent) => any;
  removeEvent: (id: string) => any;
  changeStatus: (data: IPayloadAnswerEvent) => any;
  setDeleted: (data: {id: string; isDeleted: boolean}) => any;
  changeRemoteStatus: (data: IPayloadAnswerEvent) => any;

  setChats: (chats: IChat[]) => any;
  addChat: (chat: IChat) => any;
  removeChats: (ids: string[]) => any;
  updateChat: (obj: IMessageUpdate) => any;
  clearUnreadMessages: (id: string) => any;
  addMemberToChat: (obj: {user: IUser; idChat: string}) => any;
  updateMembers: (obj: {chats: string[]; users: string[]}) => any;

  setCacheMessagesBegin: (obj: {messages: IMessage[]; idChat: string}) => any;
  setCacheMessagesEnd: (obj: {messages: IMessage[]; idChat: string}) => any;

  unsubscribe: () => any;
  subscribe: () => any;
}

export interface IEventState {
  events: IEvent[];
  chats: IChat[];

  lastMessage: IMessage | null;
  keyForUnreadMessages: number;

  cacheChats: {
    [id: string]: IMessage[];
  };
}
