import {createStore, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import {persistStore} from 'redux-persist';
import reducers from './reducer';
import {Mode, mode} from '../config/configMode';
import {eventCatch} from '../context/EventReduxContext';

export default function configureStore() {
  const middlewares = [thunkMiddleware, eventCatch];

  const store = createStore(
    reducers,
    true ? composeWithDevTools(applyMiddleware(...middlewares)) : applyMiddleware(...middlewares),
  );

  const persistor = persistStore(store as any);

  return {store, persistor};
}
