import { Action } from 'redux';
import { iState } from '.';
import iStandardRedux from './../iStandardRedux';

const key = '@Dev/EnableDevMenu';

interface iAction extends Action {
  newSetting: boolean;
}

interface iPayload {
  newSetting: boolean;
}

const action = (payload: iPayload): iAction => ({
  type: key,
  newSetting: payload.newSetting,
});

const reducer = (state: iState, action: iAction): iState => {
  const newState = { ...state };

  newState.DevMenuEnabled = action.newSetting;

  return { ...newState };
};

export default {
  key,
  action,
  reducer,
} as iStandardRedux<iState, iPayload, iAction>;
