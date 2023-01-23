import { Action } from 'redux';
import { iState } from '.';
import iStandardRedux from './../iStandardRedux';

// : Redux-Thunk Specific Imports
import iReduxState from './../iReduxState';
import { action as handleTokens } from './handleTokens';

// : Helper Functions
import fetchTokensInitial from './../../Misc/Network/Auth/fetchTokensInitial';

const key = '@Auth/handleInitialToken';

interface iAction extends Action {
  token: string;
}

interface iPayload {
  token: string;
}

export const action =
  (payload: iPayload): any =>
  async (dispatch: any, getState: () => iReduxState): Promise<void> => {
    try {
      const tokens = await fetchTokensInitial(payload.token);
      dispatch(handleTokens({ tokens }));
    } catch (error) {
      console.error('Error while fetching initial token and refresh token', error);
    }
  };

export const reducer = (state: iState, action: iAction): iState => {
  return { ...state };
};

export default {
  key,
  action,
  reducer,
} as iStandardRedux<iState, iPayload, iAction>;
