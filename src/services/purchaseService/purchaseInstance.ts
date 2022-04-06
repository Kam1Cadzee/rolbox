import axios from 'axios';
import config from '../../config/configMode';
import includeToken from '../../utils/includeToken';
import setInstanceHeaders from '../../utils/setInstanceHeaders';

const purchaseInstance = axios.create({
  baseURL: `${config.baseURL}/api/purchase`,
  // withCredentials: true
});

setInstanceHeaders(purchaseInstance);
includeToken(purchaseInstance);
purchaseInstance.interceptors.response.use(
  (value) => {
    return value;
  },
  (error) => {
    console.error({error});
    throw error;
  },
);

export default purchaseInstance;
