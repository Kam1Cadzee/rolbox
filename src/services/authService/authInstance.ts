import axios from 'axios';
import config from '../../config/configMode';
import includeToken from '../../utils/includeToken';
import setInstanceHeaders from '../../utils/setInstanceHeaders';

const authInstance = axios.create({
  baseURL: `${config.baseURL}/api/user`,
  // withCredentials: true
});

setInstanceHeaders(authInstance);
includeToken(authInstance);
authInstance.interceptors.response.use(
  (value) => {
    return value;
  },
  (error) => {
    console.error({error});
    throw error;
  },
);

export default authInstance;
