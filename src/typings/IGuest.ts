import {IUser} from './IUser';
import StatusAnswerEvent from './StatusAnswerEvent';

interface IGuest {
  status: StatusAnswerEvent;
  _id: string;
  user: IUser;
}

export default IGuest;
