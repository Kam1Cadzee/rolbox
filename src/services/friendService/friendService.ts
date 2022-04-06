import {IContact} from '../../typings/IContact';
import {IFriendRequest} from '../../typings/IUser';
import customFetch from '../customFetch';
import friendInstance from './friendInstance';

// /api/friend
const friendService = {
  request: async (idFriend: string) => {
    return customFetch<IFriendRequest>(() => friendInstance.post(`/request/${idFriend}`));
  },
  accept: async (idFriend: string) => {
    return customFetch<IFriendRequest>(() => friendInstance.post(`/accept/${idFriend}`));
  },
  reject: async (idFriend: string) => {
    return customFetch<IFriendRequest>(() => friendInstance.post(`/reject/${idFriend}`));
  },
  contacts: async (data: any) => {
    return customFetch<IContact[]>(() => friendInstance.post(`/find/google`, data));
  },
};

export default friendService;
