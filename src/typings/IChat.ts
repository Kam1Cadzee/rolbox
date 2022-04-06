import {IEvent} from './IEvent';
import {IImage, IUser} from './IUser';

export enum FilterMessenger {
  local = 'oneToOne',
  group = 'group',
  secret = 'secret',
}

export interface IChat {
  members: IUser[];
  _id: string;
  name: string;
  event: IEvent;
  type: FilterMessenger;
  owner: string;
  createdAt: string;
  updatedAt: Date;
  lastMessage?: IMessage;
  unreadMessages?: number;
}

export interface IMessage {
  viewed: boolean;
  _id: string;
  message: string;
  from: IUser;
  chat: string;
  timestump: number;
  images: IImage[];
  createdAt: string;
  updatedAt: any;
}

export interface IMessageUpdate extends IMessage {
  isUpdateUnreadMessages?: boolean;
}
