import { Action } from 'redux';

export default <iState>(initialState: iState, handlers: any) => {
  return (state = initialState, action: Action<string>): iState => {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action);
    } else {
      return state;
    }
  };
};
