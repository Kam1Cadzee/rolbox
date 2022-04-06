import axios from 'axios';
import config from '../../config/configMode';
import includeToken from '../../utils/includeToken';
import setInstanceHeaders from '../../utils/setInstanceHeaders';

const chatInstance = axios.create({
  baseURL: `${config.baseURL}/api/chat`,
  // withCredentials: true
});

setInstanceHeaders(chatInstance);
includeToken(chatInstance);

chatInstance.interceptors.response.use(
  (value) => {
    return value;
  },
  (error) => {
    console.error({error});
    throw error;
  },
);

export default chatInstance;
