import customFetch from '../customFetch';
import giftInstance from './giftInstance';
import IGift, {IGiftPost} from '../../typings/IGift';
import IUpdateData from '../../typings/IUpdateData';
import uploadImage, {IUploadImage} from '../uploadImage';
import getToken from '../../utils/getToken';

// /api/gift
const giftService = {
  createGift: (data: IGiftPost) => {
    return customFetch<IGift>(() => giftInstance.post('/', data));
  },
  getAllGifts: () => {
    return customFetch<IGift[]>(() => giftInstance.get('/'));
  },
  getGiftById: (id: string) => {
    return customFetch<IGift>(() => giftInstance.get(`/${id}`));
  },
  updateGift: ({id, data}: IUpdateData<IGiftPost>) => {
    return customFetch<IGift>(() => giftInstance.put(`/${id}`, data));
  },
  deleteGift: (id: string) => {
    return customFetch(() => giftInstance.delete(`/${id}`));
  },
  uploadImage: async (data: IUploadImage, idGift: string) => {
    return uploadImage({
      data,
      url: `${giftInstance.defaults.baseURL}/${idGift}/image`,
      token: await getToken(),
    });
  },
  deleteImage: async (idGift: string, filename: string) => {
    return customFetch(() => giftInstance.delete(`/${idGift}/image/${filename}`));
  },
};

export default giftService;
