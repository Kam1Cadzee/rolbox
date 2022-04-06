import axios from 'axios';
import config from '../../config/configMode';
import includeToken from '../../utils/includeToken';
import setInstanceHeaders from '../../utils/setInstanceHeaders';

const eventInstance = axios.create({
  baseURL: `${config.baseURL}/api/event`,
  // withCredentials: true
});

setInstanceHeaders(eventInstance);
includeToken(eventInstance);

eventInstance.interceptors.response.use(
  (value) => {
    return value;
  },
  (error) => {
    console.error({error});
    throw error;
  },
);

export default eventInstance;
