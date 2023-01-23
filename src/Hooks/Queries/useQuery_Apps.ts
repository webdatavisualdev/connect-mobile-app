import * as React from 'react';
import { QueryConfig, useQuery } from 'react-query';

import { sp } from '@pnp/sp/presets/all';
import '@pnp/sp/webs';
import '@pnp/sp/lists';

// : Hooks
import { useLog_fetchFailed, useLog_timeToComplete, iReduxState, useSelector } from './../';

// : Misc
import T from './../../Misc/Tools';
import { iApplication } from './../../Misc';

export const useQuery_Apps = () => {
  const logFetchFailed = useLog_fetchFailed({ source: 'useQuery_Apps.tsx' });
  const logTimeToComplete = useLog_timeToComplete({ source: 'useQuery_Apps.tsx' });
  const session = useSelector((s: iReduxState) => s.Auth.activeSession);

  const fetch_getApps = async (): Promise<iApplication[]> => {
    const startTime = Date.now();
    try {
      sp.setup({
        sp: {
          headers: {
            Accept: 'application/json;odata=verbose',
          },
          baseUrl: 'https://ahsonline.sharepoint.com/sites/single-page-apps/mobile-application-applications',
        },
      });
      const web = await sp.web;

      const ApplicationsList = web.lists.getByTitle('Mobile Application - Applications');

      const items = await ApplicationsList.items.getAll();

      const sortedItems = items.sort((a, b) => (a.appName < b.appName ? -1 : a.appName > b.appName ? 1 : 0));

      logTimeToComplete('Applications', '1614760042', Date.now() - startTime, sortedItems);

      return sortedItems;
    } catch (err) {
      throw new Error('There was an error while fetching Apps ' + err);
    }
  };

  const [qSettings, setQSettings] = React.useState<QueryConfig<iApplication[], Error>>({
    enabled: false,
    placeholderData: [App_AdventHealthConnect, App_SelfService],
    staleTime: 1000 * 60 * 5,
    cacheTime: Infinity,
    retry: true,
    retryDelay: 1 * 1000,
    onError: (err) => logFetchFailed('Applications', '1614759996', err),
  });

  const query = useQuery<iApplication[], Error>('applications', fetch_getApps, qSettings);

  React.useEffect(() => {
    T.InteractionManager.runAfterInteractions(() => {
      setQSettings({ ...qSettings, enabled: session });
    });
  }, [session]);

  return query;
};

const App_AdventHealthConnect: iApplication = {
  Id: 1,
  ID: 1,
  appName: 'AdventHealth Connect',
  Title: 'AdventHealth Connect',
  appDescription: 'Place Holder Value, Access the Connect Intranet Site',
  appWebLaunch: 'https://ahsonline.sharepoint.com/',
};

const App_SelfService: iApplication = {
  Id: 2,
  ID: 2,
  appName: 'AdventHealth Self Service',
  Title: 'AdventHealth Self Service',
  appDescription: 'Place Holder Value, Access Self Service',
  appWebLaunch: 'https://selfservice.adventhealth.com/',
};
