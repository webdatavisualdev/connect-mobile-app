import { Action } from 'redux';
import { iState } from '.';
import iStandardRedux from './../iStandardRedux';

const key = '@Auth/activeSession';

interface iAction extends Action {
  newValue: boolean;
}

interface iPayload {
  newValue: boolean;
}

const action = (payload: iPayload): iAction => ({
  type: key,
  newValue: payload.newValue,
});

const reducer = (state: iState, action: iAction): iState => {
  return { ...state, activeSession: action.newValue };
};

export default {
  key,
  action,
  reducer,
} as iStandardRedux<iState, iPayload, iAction>;
