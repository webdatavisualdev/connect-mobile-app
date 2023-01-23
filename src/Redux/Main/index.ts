import createReducer from './../createReducer';
import handleSwipeNavigate from './handleSwipeNavigate';
import alertSettingReducer from './alertSettingReducer';
import feedTabLoadedReducer from './feedTabLoadedReducer';
import showLinkEditReducer from './showLinkEditReducer';
import { iAlertApp } from '../../Misc'
import pinScreenFocusedReducer from './pinScreenFocusedReducer';

export interface iState {
  swipeEnabled: boolean;
  alertSetting: iAlertApp[];
  feedTabLoaded: boolean;
  showLinkEdit: boolean;
  pinScreenFocused: boolean;
}

const initialState: iState = {
  swipeEnabled: true,
  alertSetting: [],
  feedTabLoaded: false,
  showLinkEdit: true,
  pinScreenFocused: true,
};

export const MainActions = {
  handleSwipeNavigate: handleSwipeNavigate.action,
  alertSettingReducer: alertSettingReducer.action,
  feedTabLoadedReducer: feedTabLoadedReducer.action,
  showLinkEditReducer: showLinkEditReducer.action,
  pinScreenFocusedReducer: pinScreenFocusedReducer.action,
};

export const MainReducer = createReducer<iState>(initialState, {
  [handleSwipeNavigate.key]: handleSwipeNavigate.reducer,
  [alertSettingReducer.key]: alertSettingReducer.reducer,
  [feedTabLoadedReducer.key]: feedTabLoadedReducer.reducer,
  [showLinkEditReducer.key]: showLinkEditReducer.reducer,
  [pinScreenFocusedReducer.key]: pinScreenFocusedReducer.reducer,
});
