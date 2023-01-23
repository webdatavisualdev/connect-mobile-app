import createReducer from './../createReducer';

import { iTokens } from './../../Misc/Network/Auth/fetchTokensInitial';

import activeSession from './activeSession';
import handleInitialToken from './handleInitialToken';
import handleTokens from './handleTokens';
import setPhase from './setPhase';

export interface iState {
  activeSession: boolean;
  activeSessionStart?: Date;
  tokens?: iTokens;
  phase?: 'detecting' | 'newUser' | 'returningUser' | 'secureAuth' | 'configure' | 'pin' | 'bio' | 'loggedIn' | 'loggedOut';
}

const initialState: iState = {
  activeSession: false,
};

export const AuthActions = {
  activeSession: activeSession.action,
  handleInitialToken: handleInitialToken.action,
  handleTokens: handleTokens.action,
  setPhase: setPhase.action,
};

export const AuthReducer = createReducer<iState>(initialState, {
  [activeSession.key]: activeSession.reducer,
  [handleInitialToken.key]: handleInitialToken.reducer,
  [handleTokens.key]: handleTokens.reducer,
  [setPhase.key]: setPhase.reducer,
});
