import customFetch from '../customFetch';
import purchaseInstance from './purchaseInstance';

// /api/purchase
const purchaseService = {
  reserve: (data: {gift: string; quantity: number}) => {
    return customFetch(() => purchaseInstance.post('/', data));
  },
  haveGifted: (id: string) => {
    return customFetch(() => purchaseInstance.put(`/${id}/give`));
  },
  haveNotGifted: (id: string) => {
    return customFetch(() => purchaseInstance.put(`/${id}/have_not_gifted`));
  },
  denyToGive: (id: string) => {
    return customFetch(() => purchaseInstance.put(`/${id}/not_give`));
  },
};

export default purchaseService;
