import createReducer from './../createReducer';

import { iExperiment } from './../../Misc';
import { iLog } from './../../Misc';

// : 'Leaf' Imports
import enableDevMenu from './enableDevMenu';
import toggleSetting from './toggleSetting';
import toggleExperiment from './toggleExperiment';
import consoleLogs from './consoleLogs';

export interface iState {
  DevMenuEnabled: boolean;
  visualDebugging: boolean;
  loggingEnabled: boolean;

  logs: iLog[];

  experiments: {
    [key: string]: iExperiment<string | boolean>;
  };

  logToConsole: boolean;
  warnToConsole: boolean;
  debugToConsole: boolean;
  errorToConsole: boolean;

  logToToast: boolean;
  warnToToast: boolean;
  debugToToast: boolean;
  errorToToast: boolean;

  enableAnalytics: boolean;
}

const initialState: iState = __DEV__
  ? {
      // ? Developer Mode Enabled, use these default settings
      DevMenuEnabled: true,
      visualDebugging: false,
      loggingEnabled: true,
      logs: [],
      experiments: {},

      logToConsole: true,
      warnToConsole: true,
      debugToConsole: true,
      errorToConsole: true,

      logToToast: false,
      warnToToast: false,
      debugToToast: false,
      errorToToast: false,

      enableAnalytics: false,
    }
  : {
      // ? Developer Mode Disabled, likely Production, use these default settings
      DevMenuEnabled: false,
      visualDebugging: false,
      loggingEnabled: false,
      logs: [],
      experiments: {},

      logToConsole: false,
      warnToConsole: false,
      debugToConsole: false,
      errorToConsole: false,

      logToToast: false,
      warnToToast: false,
      debugToToast: false,
      errorToToast: false,

      enableAnalytics: true,
    };

export const DevActions = {
  enableDevMenu: enableDevMenu.action,
  toggleSettings: toggleSetting.action,
  toggleExperiment: toggleExperiment.action,
  addLog: consoleLogs.action,
};

export const DevReducer = createReducer<iState>(initialState, {
  [enableDevMenu.key]: enableDevMenu.reducer,
  [toggleSetting.key]: toggleSetting.reducer,
  [toggleExperiment.key]: toggleExperiment.reducer,
  [consoleLogs.key]: consoleLogs.reducer,
});
