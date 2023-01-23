import { Action } from 'redux';
import { iState } from '.';
import iStandardRedux from '../iStandardRedux';

const key = '@Main/handleSwipeNavigate';

interface iAction extends Action {
  value: boolean;
}

interface iPayload {
  value: boolean;
}

const action = (payload: iPayload): iAction => ({
  type: key,
  value: payload.value,
});

const reducer = (state: iState, action: iAction): iState => {
  return { ...state, swipeEnabled: action.value };
};

export default {
  key,
  action,
  reducer,
} as iStandardRedux<iState, iPayload, iAction>;
