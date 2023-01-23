import * as React from 'react';
import { QueryConfig, useQuery } from 'react-query';

import { sp } from '@pnp/sp/presets/all';
import '@pnp/sp/webs';
import '@pnp/sp/lists';

// : Hooks
import { useLog_fetchFailed, useLog_timeToComplete, iReduxState, useSelector } from './../';

// : Misc
import T from './../../Misc/Tools';
import { iAlertApp } from '../../Misc';

export const useQuery_AlertApps = () => {
  const logFetchFailed = useLog_fetchFailed({ source: 'useQuery_AlertApps.tsx' });
  const logTimeToComplete = useLog_timeToComplete({ source: 'useQuery_AlertApps.tsx' });
  const session = useSelector((s: iReduxState) => s.Auth.activeSession);

  const fetch_getAlertApps = async (): Promise<iAlertApp[]> => {
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

      const list = web.lists.getByTitle('AlertApps');
      const items = await list.items.getAll();

      logTimeToComplete('User Alerts Apps', '1617209419', Date.now() - startTime, items);
      return items;
    } catch (err) {
      throw new Error('There was an error while fetching Alert Apps ' + err);
    }
  };

  const [qSettings, setQSettings] = React.useState<QueryConfig<iAlertApp[], Error>>({
    enabled: false,
    placeholderData: [],
    staleTime: 1000 * 60 * 5,
    cacheTime: Infinity,
    retry: true,
    retryDelay: 1 * 1000,
    onError: (err) => logFetchFailed('Alerts Apps', '1617209879', err),
  });
  const query = useQuery<iAlertApp[], Error>('alertApplications', fetch_getAlertApps, qSettings);

  React.useEffect(() => {
    T.InteractionManager.runAfterInteractions(() => {
      setQSettings({ ...qSettings, enabled: session });
    });
  }, [session]);

  return query;
};
