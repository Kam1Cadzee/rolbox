import authInstance from './authInstance';
import {IUser, IUserPost} from '../../typings/IUser';
import customFetch from '../customFetch';
import uploadImage, {IUploadImage} from '../uploadImage';
import getToken from '../../utils/getToken';

interface IUsersOptions {
  page: number;
  limit: number;
  search: string;
}
// /api/user
const authService = {
  getProfile: async () => {
    return customFetch(() => authInstance.get('/profile'));
  },
  notification_tokens: async (token: string) => {
    return customFetch(() =>
      authInstance.put('/notification_tokens', {
        token,
      }),
    );
  },
  updateProfile: async (data: IUserPost) => {
    return customFetch<IUser>(() => authInstance.put('/profile', data));
  },
  getUserById: async (id: string) => {
    return customFetch<IUser>(() => authInstance.get(`/${id}`));
  },
  uploadImage: async (data: IUploadImage) => {
    return uploadImage({
      data,
      url: `${authInstance.defaults.baseURL}/image`,
      token: await getToken(),
    });
  },
  users: ({limit, page, search}: IUsersOptions) => {
    let encodeURL = '';
    let [firstName = '', lastName = ''] = search.split(' ');
    firstName = firstName.trim();
    lastName = lastName.trim();
    if (lastName === '') {
      encodeURL = `filter={"$or":[{"firstName":{"$regex":"${firstName}", "$options": "i"}}]}`;
    } else {
      encodeURL = `filter={"$or":[{"firstName":{"$regex":"${firstName}", "$options": "i"}}, {"lastName":{"$regex":"${lastName}", "$options": "i"}}]}`;
    }
    return customFetch<IUser[]>(() =>
      authInstance.get('/', {
        params: {
          limit,
          page,
          filter: encodeURL,
        },
      }),
    );
  },
  removeImage: async () => {
    return customFetch(() => authInstance.delete('/image'));
  },
};

export default authService;
