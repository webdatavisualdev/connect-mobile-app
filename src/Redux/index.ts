import { createStore, applyMiddleware } from 'redux';
import createDebugger from 'redux-flipper';
import { rootReducer } from './AllReducers';
import thunk from 'redux-thunk';

const middlewares: any[] = [];
middlewares.push(thunk);
if (__DEV__) {
  middlewares.push(createDebugger());
}

export const store = createStore(rootReducer, applyMiddleware(...middlewares));
