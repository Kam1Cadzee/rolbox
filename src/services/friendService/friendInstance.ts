import axios from 'axios';
import config from '../../config/configMode';
import includeToken from '../../utils/includeToken';
import setInstanceHeaders from '../../utils/setInstanceHeaders';

const friendInstance = axios.create({
  baseURL: `${config.baseURL}/api/friend`,
  // withCredentials: true
});

setInstanceHeaders(friendInstance);
includeToken(friendInstance);
friendInstance.interceptors.response.use(
  (value) => {
    return value;
  },
  (error) => {
    console.error({error});
    throw error;
  },
);

export default friendInstance;
