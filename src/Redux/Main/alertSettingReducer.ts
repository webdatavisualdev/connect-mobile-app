import { Action } from 'redux';
import { iState } from '.';
import {iAlertApp} from '../../Misc';
import iStandardRedux from '../iStandardRedux';

const key = '@Main/alertSettingReducer';

interface iAction extends Action {
  value: iAlertApp[];
}

interface iPayload {
  value: iAlertApp[];
}

const action = (payload: iPayload): iAction => ({
  type: key,
  value: payload.value,
});

const reducer = (state: iState, action: iAction): iState => {
  return { ...state, alertSetting: action.value };
};

export default {
  key,
  action,
  reducer,
} as iStandardRedux<iState, iPayload, iAction>;
