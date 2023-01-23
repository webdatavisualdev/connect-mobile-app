import * as React from 'react';
import { QueryConfig, useQuery } from 'react-query';

import { sp } from '@pnp/sp/presets/all';
import '@pnp/sp/webs';
import '@pnp/sp/lists';

// : Hooks
import { useLog_fetchFailed, useLog_timeToComplete, iReduxState, useSelector, useQuery_UserProfile } from './../';

// : Misc
import T from './../../Misc/Tools';
import { iAlertUserData } from '../../Misc';

export const useQuery_AlertUserData = () => {
  const logFetchFailed = useLog_fetchFailed({ source: 'useQuery_AlertUserData.tsx' });
  const logTimeToComplete = useLog_timeToComplete({ source: 'useQuery_AlertUserData.tsx' });
  const session = useSelector((s: iReduxState) => s.Auth.activeSession);
  const userProfile = useQuery_UserProfile();

  const fetch_getAlertUserData = async (key: string, queryInput: string): Promise<iAlertUserData> => {
    const startTime = Date.now();
    try {
      sp.setup({
        sp: {
          headers: {
            Accept: 'application/json;odata=verbose',
          },
          baseUrl: 'https://ahsonline.sharepoint.com/application-lists',
        },
      });
      const web = await sp.web;

      const list = web.lists.getByTitle('Users_Alerts');
      const items = await list.items.top(1).filter(`Users eq '${queryInput}'`).get();

      if (items.length < 1) throw new Error('No User Found');
      if (items.length > 1) throw new Error('Multiple Records match the users uuid');

      const temp = items[0];
      try {
        temp.MyAlerts = JSON.parse(temp.MyAlerts);
      } catch (err) {
        throw new Error('Error while attempting to parse users MyAlerts string into an Object');
      }

      logTimeToComplete('User Alerts Data', '1617209419', Date.now() - startTime, temp);
      return temp;
    } catch (err) {
      throw new Error('There was an error while fetching User Alerts' + err);
    }
  };

  const [qSettings, setQSettings] = React.useState<QueryConfig<iAlertUserData, Error>>({
    enabled: false,
    placeholderData: undefined,
    staleTime: 1000 * 60 * 5,
    cacheTime: Infinity,
    retry: 10,
    retryDelay: 1 * 1000,
    onError: (err) => logFetchFailed('User Alerts Data', '1617209796', err),
  });
  const query = useQuery<iAlertUserData, Error>(['alertUserData', userProfile.data?.Properties['UserProfile_GUID']], fetch_getAlertUserData, qSettings);

  React.useEffect(() => {
    T.InteractionManager.runAfterInteractions(() => {
      setQSettings({ ...qSettings, enabled: session });
    });
  }, [session]);

  return query;
};
