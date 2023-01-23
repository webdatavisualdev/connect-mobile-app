import { Action } from 'redux';
import { iState } from '.';
import iStandardRedux from './../iStandardRedux';

import { iTokens } from './../../Misc/Network/Auth/fetchTokensInitial';

const key = '@Auth/handleTokens';

interface iAction extends Action {
  tokens: iTokens;
}

interface iPayload {
  tokens: iTokens;
}

export const action = (payload: iPayload): iAction => ({
  type: key,
  tokens: payload.tokens,
});

export const reducer = (state: iState, action: iAction): iState => {
  if (state.phase === 'secureAuth') {
    action.tokens.expires_at = (Date.now() + parseInt(action.tokens.expires_in, 10)).toString();
    return { ...state, tokens: action.tokens, phase: 'configure' };
  }

  if (state.phase === 'returningUser') {
    return { ...state, tokens: action.tokens, phase: 'loggedIn' };
  }
  return { ...state, tokens: action.tokens };
};

export default {
  key,
  action,
  reducer,
} as iStandardRedux<iState, iPayload, iAction>;
