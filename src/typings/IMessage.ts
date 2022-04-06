import {IMessage} from './IChat';
import {IImage, IUser} from './IUser';
import {TSFontSpecs} from 'react-native-text-size';
import {sizes} from '../context/ThemeContext';
import {getFontFamily} from '../utils/getFontFamily';
import getIdObj from '../utils/getIdObj';

const fontSpecs: TSFontSpecs = {
  fontFamily: getFontFamily(400),
  fontSize: sizes[14],
};

export enum TypeMessage {
  date,
  text,
  unread,
  image,
}
export enum StatusMessage {
  sending = 1,
  error = 2,
}

export enum PositionMessage {
  start,
  middle,
  end,
}
export interface IMessageDate {
  date: Date;
  status?: StatusMessage;
  position?: PositionMessage;
}

export interface IBaseMessage {
  id: string;
  date: Date;
  user: IUser;
  status?: StatusMessage;
  isNew?: boolean;
  isMine: boolean;
  position: PositionMessage;
  replyMessage?: IMessageItem;
  updateAt: number;
  sizeText?: number;
  chat: string;
}
export interface ITextMessage extends IBaseMessage {
  text: string;
}

export interface IImageMessage extends ITextMessage {
  images: IImage[];
}
export interface IMessageItem {
  type: TypeMessage;
  data: IMessageDate & ITextMessage & IImageMessage;
}

const isTheSameDate = (d1: Date | null, d2: Date) => {
  if (d1 === null) {
    return true;
  }
  return d1.getFullYear() === d1.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
};
const p = sizes[19] / sizes[14];
class ManagerMessage {
  private userId: string;
  private lastMessage: IMessageItem;
  private firstMessage: IMessageItem;
  private historyDate: Date | null = null;
  private isNewLine = false;

  public static onReceiveMessage: (m: IMessage) => any;

  public static emit(m: IMessage) {
    ManagerMessage.onReceiveMessage && ManagerMessage.onReceiveMessage(m);
  }

  public clear() {
    this.lastMessage = undefined;
    this.firstMessage = undefined;
    this.historyDate = null;
    this.isNewLine = false;
  }

  constructor(userId: string) {
    this.userId = userId;
  }

  createNewLine() {
    if (this.isNewLine) {
      return;
    }
    this.isNewLine = true;
    return {
      type: TypeMessage.unread,
    } as IMessageItem;
  }

  getPosition(isFirst: boolean, message: IMessage) {
    if (isFirst) {
      let position = PositionMessage.start;
      if (this.firstMessage) {
        const lastData = this.firstMessage.data as ITextMessage;
        if (getIdObj(lastData.user) !== getIdObj(message.from)) {
          position = PositionMessage.start;
        } else {
          if (lastData.position === PositionMessage.end) {
            lastData.position = PositionMessage.middle;
            position = PositionMessage.end;
          } else if (lastData.position === PositionMessage.start) {
            position = PositionMessage.end;
          }
        }
      }
      return position;
    } else {
      let position = PositionMessage.start;
      if (this.lastMessage) {
        const lastData = this.lastMessage.data as ITextMessage;
        if (getIdObj(lastData.user) !== getIdObj(message.from)) {
          this.lastMessage.data.position = PositionMessage.start;
          position = PositionMessage.end;
        } else {
          if (lastData.position === PositionMessage.end) {
            position = PositionMessage.middle;
          } else if (lastData.position === PositionMessage.start) {
            position = PositionMessage.middle;
            this.lastMessage.data.position = PositionMessage.end;
          } else if (lastData.position === PositionMessage.middle) {
            position = PositionMessage.middle;
          }
        }
      }

      return position;
    }
  }

  async parse(
    message: IMessage,
    isFirst: boolean,
    isNew = false,
    status?: StatusMessage,
    defaultPosition?: PositionMessage,
  ) {
    let position = defaultPosition ?? this.getPosition(isFirst, message);

    const itemMessage: IMessageItem = {
      type: message.images.length > 0 ? TypeMessage.image : TypeMessage.text,
      data: {
        id: message._id,
        date: new Date(message.timestump),
        isMine: this.userId === getIdObj(message.from),
        isNew: isNew,
        user: message.from,
        position: position,
        text: message.message,
        images: message.images,
        status,
        updateAt: new Date(message.updatedAt).getTime(),
        chat: message.chat,
      },
    };

    if (isFirst) {
      this.firstMessage = itemMessage;
    } else {
      this.lastMessage = itemMessage;
    }
    return itemMessage;
  }

  async parseAllMessages(messages: IMessage[]) {
    const res: IMessageItem[] = [];

    for (let m of messages) {
      const lastMessage = this.lastMessage;

      const item = await this.parse(m, false, false);
      if (!isTheSameDate(this.historyDate, item.data.date)) {
        this.historyDate = item.data.date;

        res.push({
          data: {
            date: item.data.date,
            position: lastMessage.data.position === PositionMessage.middle ? PositionMessage.middle : undefined,
          },
          type: TypeMessage.date,
        });
      }
      res.push(item);
    }

    if (!this.firstMessage && res.length > 0) {
      this.firstMessage = res[0];
    }
    return res;
  }

  setInitDate(message: IMessage) {
    this.historyDate = new Date(message.timestump);
  }
}

export default ManagerMessage;
