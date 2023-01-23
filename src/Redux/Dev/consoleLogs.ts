import { Action } from 'redux';
import { iState } from '.';
import iStandardRedux from './../iStandardRedux';

import { iLog } from './../../Misc';

const key = '@Dev/consoleLog';

interface iAction extends Action {
  log: iLog;
}

interface iPayload {
  log: iLog;
}

const action = (payload: iPayload): iAction => ({
  type: key,
  log: payload.log,
});

const reducer = (state: iState, action: iAction): iState => {
  const newState = { ...state };

  newState.logs.unshift(action.log);

  return { ...newState };
};

export default {
  key,
  action,
  reducer,
} as iStandardRedux<iState, iPayload, iAction>;
