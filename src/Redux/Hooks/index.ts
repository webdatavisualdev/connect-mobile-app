import createReducer from './../createReducer';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

import firebase_auth_instance from './firebase_auth_instance';
import setSingleton from './setSingleton';

export interface iState {
  singleton: { [key: string]: any };
  firebase: {
    auth_instance: FirebaseAuthTypes.Module | null;
  };
}

const initialState: iState = {
  singleton: {},
  firebase: {
    auth_instance: null,
  },
};

export const HooksActions = {
  firebase_auth_instance: firebase_auth_instance.action,
  setSingleton: setSingleton.action,
};

export const HooksReducer = createReducer<iState>(initialState, {
  [firebase_auth_instance.key]: firebase_auth_instance.reducer,
  [setSingleton.key]: setSingleton.reducer,
});
