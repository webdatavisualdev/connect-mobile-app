import { Action } from 'redux';
import { iState } from '.';
import iStandardRedux from './../iStandardRedux';

const key = '@Dev/toggle';

interface iAction extends Action {
  setting: keyof iState;
}

interface iPayload {
  setting: keyof iState;
}

const action = (payload: iPayload): iAction => ({
  type: key,
  setting: payload.setting,
});

const reducer = (state: iState, action: iAction): iState => {
  const newState = { ...state };

  action.setting === 'visualDebugging' ? (newState[action.setting] = !newState[action.setting]) : undefined;
  action.setting === 'loggingEnabled' ? (newState[action.setting] = !newState[action.setting]) : undefined;

  action.setting === 'logToConsole' ? (newState[action.setting] = !newState[action.setting]) : undefined;
  action.setting === 'warnToConsole' ? (newState[action.setting] = !newState[action.setting]) : undefined;
  action.setting === 'debugToConsole' ? (newState[action.setting] = !newState[action.setting]) : undefined;
  action.setting === 'errorToConsole' ? (newState[action.setting] = !newState[action.setting]) : undefined;

  action.setting === 'logToToast' ? (newState[action.setting] = !newState[action.setting]) : undefined;
  action.setting === 'warnToToast' ? (newState[action.setting] = !newState[action.setting]) : undefined;
  action.setting === 'debugToToast' ? (newState[action.setting] = !newState[action.setting]) : undefined;
  action.setting === 'errorToToast' ? (newState[action.setting] = !newState[action.setting]) : undefined;

  action.setting === 'enableAnalytics' ? (newState[action.setting] = !newState[action.setting]) : undefined;

  return { ...newState };
};

export default {
  key,
  action,
  reducer,
} as iStandardRedux<iState, iPayload, iAction>;
