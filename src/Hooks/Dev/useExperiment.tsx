import * as React from 'react';
import AsyncStorage from '@react-native-community/async-storage';

// : Hooks
import H, { AllActions, iReduxState } from './../../Hooks';

// : Misc
import { iExperiment } from './../../Misc';

export const useExperiment = <T extends string | boolean>(settings: iExperiment<T>) => {
  const [debug, log, warn, error, tags, titles, legacyLog] = H.Logs.useLog({ source: 'useExperiment.tsx' });
  const ExperimentsAsyncStorageKey = `useExperiment/${settings.key}`;
  const reduxVal = H.NPM.redux.useSelector((s: iReduxState) => s.Dev.experiments[ExperimentsAsyncStorageKey]);
  const dispatch = H.NPM.redux.useDispatch();

  React.useEffect(() => {
    get_AsyncStorage();
  }, []);

  React.useEffect(() => {
    if (reduxVal !== undefined) {
      save_AsyncStorage();
    }
  }, [reduxVal, reduxVal?.setting]);

  const get_AsyncStorage = async () => {
    try {
      const possiblySavedData = await AsyncStorage.getItem(ExperimentsAsyncStorageKey);
      if (possiblySavedData && possiblySavedData?.length > 0) {
        dispatch(AllActions.Dev.toggleExperiment({ key: ExperimentsAsyncStorageKey, experiment: JSON.parse(possiblySavedData) }));
      } else {
        dispatch(AllActions.Dev.toggleExperiment({ key: ExperimentsAsyncStorageKey, experiment: settings }));
      }
    } catch (err) {
      error('Error while trying to retreive and parse experiment', `${err}`, { id: '1634830620' });
    }
  };

  const save_AsyncStorage = async () => {
    const strVal = JSON.stringify(reduxVal);
    AsyncStorage.setItem(ExperimentsAsyncStorageKey, strVal);
  };

  return reduxVal as iExperiment<T>;
};
