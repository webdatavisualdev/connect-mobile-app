import { Action } from 'redux';
import { iState } from '.';
import iStandardRedux from './../iStandardRedux';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

const key = '@Hooks/singleton/set';

interface iAction extends Action {
  key: string;
  value: any;
}

interface iPayload {
  key: string;
  value: any;
}

const action = (payload: iPayload): iAction => ({
  type: key,
  key: payload.key,
  value: payload.value,
});

const reducer = (state: iState, action: iAction): iState => {
  const newSingletons = { ...state.singleton };
  newSingletons[action.key] = action.value;

  return {
    ...state,
    singleton: newSingletons,
  };
};

export default {
  key,
  action,
  reducer,
} as iStandardRedux<iState, iPayload, iAction>;
