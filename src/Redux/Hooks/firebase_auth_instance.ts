import { Action } from 'redux';
import { iState } from '.';
import iStandardRedux from './../iStandardRedux';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

const key = '@Hooks/firebase/auth_instance';

interface iAction extends Action {
  value: FirebaseAuthTypes.Module;
}

interface iPayload {
  value: FirebaseAuthTypes.Module;
}

const action = (payload: iPayload): iAction => ({
  type: key,
  value: payload.value,
});

const reducer = (state: iState, action: iAction): iState => {
  return {
    ...state,
    firebase: {
      ...state.firebase,
      auth_instance: action.value,
    },
  };
};

export default {
  key,
  action,
  reducer,
} as iStandardRedux<iState, iPayload, iAction>;
