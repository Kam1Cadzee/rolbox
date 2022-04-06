import axios from 'axios';
import config from '../../config/configMode';

const extensionInstance = axios.create({
  baseURL: `${config.baseURL}`,
  // withCredentials: true
});

extensionInstance.interceptors.response.use(
  (value) => {
    return value;
  },
  (error) => {
    console.error({status: error.response, data: error.response.data});
    throw error;
  },
);

const setTokenToInstance = (token: string) => {
  extensionInstance.interceptors.request.use(
    async (value) => {
      value.headers = {
        ...extensionInstance.defaults.headers,
        ...(token ? {Authorization: token} : {}),
      };
      return value;
    },
    (error) => {
      throw error;
    },
  );
};

export {setTokenToInstance};
export default extensionInstance;
