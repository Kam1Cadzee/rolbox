import axios from 'axios';
import config from '../../config/configMode';
import includeToken from '../../utils/includeToken';
import setInstanceHeaders from '../../utils/setInstanceHeaders';

const giftInstance = axios.create({
  baseURL: `${config.baseURL}/api/gift`,
  // withCredentials: true
});

setInstanceHeaders(giftInstance);
includeToken(giftInstance);
giftInstance.interceptors.response.use(
  (value) => {
    return value;
  },
  (error) => {
    console.error({error});
    throw error;
  },
);

export default giftInstance;
