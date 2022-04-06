import axios from 'axios';
import config from '../../config/configMode';
import includeToken from '../../utils/includeToken';
import setInstanceHeaders from '../../utils/setInstanceHeaders';

const translationsInstance = axios.create({
  baseURL: `${config.baseURL}/api/translations`,
  headers: {
    api_key: 'only-for-dev-secret-api-key',
  },
  // withCredentials: true
});

setInstanceHeaders(translationsInstance);
includeToken(translationsInstance);
translationsInstance.interceptors.response.use(
  (value) => {
    return value;
  },
  (error) => {
    console.error({error});
    throw error;
  },
);

export default translationsInstance;
