import axios from 'axios';
import config from '../../config/configMode';
import includeToken from '../../utils/includeToken';

const wishListInstance = axios.create({
  baseURL: `${config.baseURL}/api/wishlist`,
  // withCredentials: true
});

includeToken(wishListInstance);
wishListInstance.interceptors.response.use(
  (value) => {
    return value;
  },
  (error) => {
    console.error({error});
    throw error;
  },
);

export default wishListInstance;
