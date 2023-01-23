import * as React from 'react';
import { Linking, Alert } from 'react-native';

import BreakDownUrl from './../Misc/Tools/helper_BreakDownUrl';

import { useDispatch } from 'react-redux';
import AllActions from './../Redux/AllActions';

export const useCustomLinking = () => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    Linking.addEventListener('url', (e) => {
      const urlBreakdown = BreakDownUrl(e.url);

      // * Handle Initial Token Deep link (Ergo user just signed in)
      if (e.url.indexOf('code=') > -1) {
        const code = urlBreakdown.queryString.get('code');
        if (code) dispatch(AllActions.Auth.handleInitialToken({ token: code }));
      }
    });

    Linking.getInitialURL().then((url) => {
      if (url !== null) {
        Alert.alert('App was Launched with a DeepLink', url);
      }
    });
  }, []);
  return;
};
