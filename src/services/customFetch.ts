import {AxiosResponse} from 'axios';

const customFetch = async <T = any>(func: () => Promise<AxiosResponse<T>>) => {
  try {
    const res = await func();
    return {
      success: true,
      data: res.data as T,
      code: res.status,
    };
  } catch (e) {
    console.error({e});
    return {
      success: false,
      message: e.response?.data?.error?.message ?? 'Server error',
      code: e.response?.status || 500,
      error: e,
    };
  }
};

export default customFetch;
