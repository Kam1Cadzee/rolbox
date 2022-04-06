import {useState} from 'react';

type IFetchMethod = (
  data?: any,
) => Promise<{
  success: boolean;
  data?: any;
  code: any;
  message?: string;
}>;

const useAxios = <T = any>(fetch: IFetchMethod) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null as any | null);
  const [data, setData] = useState(null as T | null);

  const request = async <R>(dataFetch?: any): Promise<{success: boolean; data?: R; code: number; message?: string}> => {
    setIsLoading(true);
    const res = await fetch(dataFetch);
    if (res.success) {
      setData(res.data);
      setError(null);
    } else {
      setError({
        error: res.data,
        code: res.code,
      });
    }
    setIsLoading(false);
    return res;
  };
  return {
    isLoading,
    error,
    data,
    request,
  };
};

export default useAxios;
