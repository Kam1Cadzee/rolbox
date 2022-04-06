import {AxiosInstance} from 'axios';
import getToken from './getToken';

const includeToken = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    async (value) => {
      const token = await getToken();
      value.headers = {
        ...instance.defaults.headers,
        ...(token ? {Authorization: token} : {}),
        ...value.headers,
      };
      return value;
    },
    (error) => {
      throw error;
    },
  );
};

export default includeToken;
