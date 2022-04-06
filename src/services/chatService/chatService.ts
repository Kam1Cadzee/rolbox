import customFetch from '../customFetch';
import chatInstance from './chatInstance';
import {FilterMessenger, IChat, IMessage} from '../../typings/IChat';
import {IUploadImage, uploadImages} from '../uploadImage';
import getToken from '../../utils/getToken';
import {IUser, UserExtension} from '../../typings/IUser';

// /api/chat
const chatService = {
  createChat: (members: IUser[]) => {
    return customFetch<IChat>(() =>
      chatInstance.post('/', {
        members: members.map((m) => m._id),
        name: `${UserExtension.firstName(members[0])} + ${UserExtension.firstName(members[1])}`,
        type: FilterMessenger.local,
      }),
    );
  },
  getChats: () => {
    return customFetch<IChat[]>(() => chatInstance.get('/'));
  },
  getChatById: (id: string) => {
    return customFetch<IChat>(() => chatInstance.get('/' + id));
  },
  commitLastMessage: ({id, lastRead}: {id: string; lastRead: string}) => {
    return customFetch<IChat>(() =>
      chatInstance.put(`/${id}/last_read_message`, {
        lastRead,
      }),
    );
  },
  sendMessage: async ({id, message, images}: {id: string; message: string; images: IUploadImage[]}) => {
    return uploadImages({
      images,
      message,
      url: `${chatInstance.defaults.baseURL}/${id}/message`,
      token: await getToken(),
    }) as any;
  },
  getMessages: ({id, limit, page}: {id: string; page: any; limit: any}) => {
    return customFetch<IMessage[]>(() =>
      chatInstance.get(`/${id}/message`, {
        params: {
          page,
          limit,
        },
      }),
    );
  },
};

export default chatService;
