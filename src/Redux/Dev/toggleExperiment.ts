import { Action } from 'redux';
import { iState } from '.';
import iStandardRedux from './../iStandardRedux';

import { iExperiment } from './../../Misc';

const key = '@Dev/toggleExperiment';

interface iAction extends Action {
  key: string;
  experiment: iExperiment<string | boolean>;
}

interface iPayload {
  key: string;
  experiment: iExperiment<string | boolean>;
}

const action = (payload: iPayload): iAction => ({
  type: key,
  experiment: payload.experiment,
  key: payload.key,
});

const reducer = (state: iState, action: iAction): iState => {
  const newState = { ...state };
  newState.experiments[action.key] = action.experiment;
  return newState;
};

export default {
  key,
  action,
  reducer,
} as iStandardRedux<iState, iPayload, iAction>;
