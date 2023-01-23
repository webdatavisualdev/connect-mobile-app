import { useMutation } from 'react-query';
import { sp } from '@pnp/sp/presets/all';
import { HttpRequestError } from '@pnp/odata';
import '@pnp/sp/webs';
import '@pnp/sp/lists';

import { iAlertApp, iDeviceRegistrations } from '../../Misc';

// : Hooks
import { useLog_fetchFailed, useLog_timeToComplete } from './../';

export interface iUpdateAlertSetting {
  alertSetting: iAlertApp[];
  setAsyncCache: Function;
  delAsyncCache: Function;
  subscription: iDeviceRegistrations;
  recordId: number;
}

export const useMutation_AlertSetting = () => {
  const logFetchFailed = useLog_fetchFailed({ source: 'useMutation_AlertSetting.tsx' });
  const logTimeToComplete = useLog_timeToComplete({ source: 'useMutation_AlertSetting.tsx' });

  const fetch_UpdateAlertSetting = async (variables: iUpdateAlertSetting) => {
    const startTime = Date.now();
    try {
      if (variables.recordId) {
        await variables.setAsyncCache([{ key: 'alertsetting', value: JSON.stringify(variables.alertSetting) || '' }]);
        sp.setup({
          sp: {
            headers: {
              Accept: 'application/json;odata=verbose',
            },
            baseUrl: 'https://ahsonline.sharepoint.com/application-lists',
          },
        });
        const web = await sp.web;
        const list = await web.lists.getByTitle('Registered_PushNotification');
        await list.items.getById(variables.recordId).update({
          Subscription: JSON.stringify(variables.subscription),
        });
        logTimeToComplete('Mutate Alert Setting', '1631158573', Date.now() - startTime, undefined);
      }
    } catch (error) {
      logFetchFailed('Mutate Alert Setting', '1631158677', error);
      await variables.delAsyncCache();
      if (error?.isHttpRequestError) {
        const data = await (<HttpRequestError>error).response.json();
        const message = typeof data['odata.error'] === 'object' ? data['odata.error'].message.value : error.message;
        throw new Error(message);
      } else {
        throw new Error(error);
      }
    }
  };

  return useMutation(fetch_UpdateAlertSetting);
};
