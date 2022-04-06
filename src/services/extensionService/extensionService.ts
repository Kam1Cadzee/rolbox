import extensionInstance from './extensionInstance';
import customFetch from '../customFetch';
import IGift, {IGiftPost} from '../../typings/IGift';
import uploadImage, {IUploadImage} from '../uploadImage';

//
const extensionService = {
  getProfile: async () => {
    return customFetch(() => extensionInstance.get('/api/user/profile'));
  },
  createGift: (data: IGiftPost) => {
    return customFetch<IGift>(() => extensionInstance.post('/api/gift', data));
  },
  parseURL: (url: string) => {
    return customFetch(() =>
      extensionInstance.post('/api/url/parse', {
        url,
      }),
    );
  },
  uploadImage: async (data: IUploadImage, idGift: string, token: string) => {
    if (data.base64) {
      return customFetch(() =>
        extensionInstance.post(`/api/gift/${idGift}/image`, {
          filename: `base64_` + Date.now(),
          data: data.base64,
        }),
      );
    } else if (data.url) {
      return customFetch(() =>
        extensionInstance.post(`/api/gift/${idGift}/image`, {
          filename: `url_` + Date.now(),
          url: data.url,
        }),
      );
    } else {
      return uploadImage({
        data,
        url: `${extensionInstance.defaults.baseURL}/api/gift/${idGift}/image`,
        token,
      });
    }
  },
};

export default extensionService;
