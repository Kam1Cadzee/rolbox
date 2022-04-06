import {createActions, handleActions} from 'redux-actions';
import {IAction, IBaseActions, IBaseState} from './baseTypes';

export class CreatorReducer<TAction = IBaseActions, TState = IBaseState> {
  private readonly options: any;

  private actions?: TAction;

  private actionMap: any;

  private reducerMap: any;

  constructor(private prefix: string) {
    this.options = {
      prefix: this.prefix,
    };
    this.actionMap = {};
    this.reducerMap = {};
  }

  private getUpperCase = (name: string) => {
    const rgx = /[A-Z]/g;
    const symbols = name.match(rgx);
    const phrases = name.split(rgx);

    if (symbols === null) {
      return name.toUpperCase();
    }
    let res = phrases[0].toUpperCase();
    for (let i = 1; i < phrases.length; i += 1) {
      res += `_${symbols[i - 1]}${phrases[i].toUpperCase()}`;
    }
    return res;
  };

  public addAction = <P = any>(
    name: keyof TAction | any,
    reducer: (state: TState, action: IAction<P>) => TState,
    func: any = (value: any) => value,
  ) => {
    if (typeof name === 'string') {
      this.actionMap[this.getUpperCase(name)] = func;
      this.reducerMap[name] = reducer;
    } else this.reducerMap[name] = reducer;
  };

  public getHandlerReducer = <T = any>(name: keyof TAction) => {
    return this.reducerMap[name] as (state: TState, action: {payload: T}) => TState;
  };

  public createActions: () => TAction = () => {
    if (!this.actions) {
      this.actions = createActions(this.actionMap, ...['SET_LOADING', 'SET_DATA', 'SET_ERROR'], this.options) as any;
    }
    return this.actions!;
  };

  public createReducerFetch = (initState: TState) => {
    const {setLoading, setData, setError, ...rest}: any = this.createActions();

    const maps: any = {};
    Object.keys(this.reducerMap).forEach((key) => {
      const name = rest[key];
      if (name) maps[name] = this.reducerMap[key];
      else maps[key] = this.reducerMap[key];
    });

    return handleActions<TState, TAction>(
      {
        [setLoading]: (state, action) => {
          return {...state, isLoading: action.payload};
        },
        [setData]: (state, action) => {
          return {...state, data: action.payload, error: false};
        },
        [setError]: (state, action) => {
          return {...state, error: action.payload};
        },
        ...maps,
      },
      initState,
    );
  };

  public createReducer = (initState: TState) => {
    const actions: any = this.createActions();

    const maps: any = {};
    Object.keys(this.reducerMap).forEach((key) => {
      const name = actions[key];
      if (name) maps[name] = this.reducerMap[key];
      else maps[key] = this.reducerMap[key];
    });

    return handleActions<TState, TAction>(maps, initState);
  };
}
