import {IUser} from '../typings/IUser';

const checkIsFriend = (friends: IUser[], idFriend: string) => {
  return friends.some((f) => f._id === idFriend);
};

export default checkIsFriend;
