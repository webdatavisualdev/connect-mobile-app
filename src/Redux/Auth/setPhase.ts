import { Action } from 'redux';
import { iState } from '.';
import iStandardRedux from './../iStandardRedux';

const key = '@Auth/setPhase';

interface iAction extends Action {
  phase: 'detecting' | 'newUser' | 'returningUser' | 'secureAuth' | 'configure' | 'pin' | 'bio' | 'loggedIn' | 'loggedOut';
}

interface iPayload {
  phase: 'detecting' | 'newUser' | 'returningUser' | 'secureAuth' | 'configure' | 'pin' | 'bio' | 'loggedIn' | 'loggedOut';
}

export const action = (payload: iPayload): iAction => ({
  type: key,
  phase: payload.phase,
});

export const reducer = (state: iState, action: iAction): iState => {
  return { ...state, phase: action.phase };
};

export default {
  key,
  action,
  reducer,
} as iStandardRedux<iState, iPayload, iAction>;
