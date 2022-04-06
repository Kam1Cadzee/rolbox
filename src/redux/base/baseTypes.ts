export interface IBaseState {
  data: any | null;
  isLoading: boolean;
  error: any;
}

export interface IBaseActions {
  setLoading: any;
  setData: any;
  setError: any;
}

export interface IAction<T = any> {
  payload: T;
  type: string;
}
