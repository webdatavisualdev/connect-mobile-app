import { createStore, applyMiddleware } from 'redux';
import { rootReducer } from './AllReducers';

const middlewares: any[] = [];
// if (__DEV__) {
//   middlewares.push(createDebugger());
// }

export const store = createStore(rootReducer, applyMiddleware(...middlewares));
