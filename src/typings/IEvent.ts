import {IChat} from './IChat';
import IGuest from './IGuest';
import IOption from './IOption';
import IUnit from './IUnit';
import {IUser} from './IUser';
import {IWishlist} from './IWishlist';
import StatusAnswerEvent from './StatusAnswerEvent';
import TypeTime from './TypeTime';

enum DayOfWeek {
  Mon,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat,
  Sun,
}

enum FilterEvents {
  all = 'all',
  invited = 'invited',
  mine = 'mine',
  birthday = 'birthday',
  yes = 'yes',
  no = 'no',
  maybe = 'maybe',
}

interface IBaseEvent {
  name: string;
  time?: IUnit<TypeTime, string>;
  location?: string;
  secretChat: boolean;
}

interface IEvent extends IBaseEvent {
  _id: string;
  chats: [IChat | string];
  owner: IUser;
  guests: IGuest[];
  date: Date;
  currentUserStatus?: StatusAnswerEvent;
  updatedAt: string;
  isDeleted?: boolean;
  wishlist: IWishlist;
}

interface IEventPost extends IBaseEvent {
  guests?: string[];
  date: string;
  wishlist: string;
}

interface IEventClientPost extends Omit<IBaseEvent, 'secretChat' | 'wishlist'> {
  guests?: IUser[];
  wishlist: IOption<string, string>;
  date: Date;
}

interface IEventUpdate extends Omit<IBaseEvent, 'secretChat'> {
  date: string;
  newGuests: string[];
  deletedGuests: string[];
  secretChat?: boolean;
  wishlist: string;
}

interface IEventDataItem {
  type: FilterEvents;
  date: Date;
  payload: IEvent | IUser;
}
interface IEventData {
  [year: string]: {
    [month: string]: {
      [day: string]: {
        existsEvents: Array<FilterEvents | StatusAnswerEvent>;
        events: IEventDataItem[];
      };
    };
  };
}

export {DayOfWeek, IEvent, IEventData, IEventPost, IEventDataItem, IEventClientPost, FilterEvents, IEventUpdate};
