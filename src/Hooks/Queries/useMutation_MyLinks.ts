import * as React from 'react';
import { useMutation } from 'react-query';
import { sp } from '@pnp/sp/presets/all';

// : Hooks
import { useLog_fetchFailed, useLog_timeToComplete, useQuery_MyLinks } from './../';

// : Misc
import { iMyLinksEncasement } from '../../Misc';

export interface iUpdateMyLinks {
  NewMyLinks: iMyLinksEncasement;
  recordId?: number;
}

export const useMutation_MyLinks = () => {
  const logFetchFailed = useLog_fetchFailed({ source: 'useMutation_MyLinks.tsx' });
  const logTimeToComplete = useLog_timeToComplete({ source: 'useMutation_MyLinks.tsx' });

  const fetch_UpdateMyLinks = async (variables: iUpdateMyLinks) => {
    const startTime = Date.now();
    try {
      if (variables.recordId !== undefined) {
        sp.setup({
          sp: {
            headers: {
              Accept: 'application/json;odata=verbose',
            },
            baseUrl: 'https://ahsonline.sharepoint.com/application-lists/',
          },
        });
        const web = await sp.web;
        const list = web.lists.getByTitle('Users_MyLinks');

        const listItem = await list.items.getById(variables.recordId);
        listItem.update({ MyLinks: JSON.stringify(variables.NewMyLinks) });

        logTimeToComplete('Mutate My Links', '1631161308', Date.now() - startTime, undefined);
        return;
      } else {
        throw new Error(`Record ID input was undefined`);
      }
    } catch (err) {
      throw new Error('There was an error while attempting to update the users MyLinks ' + err);
    }
  };

  const MyLinks = useQuery_MyLinks();
  const mutation = useMutation(fetch_UpdateMyLinks);

  React.useEffect(() => {
    if (mutation[1].isSuccess) {
      globalThis.setTimeout(() => {
        MyLinks.refetch();
        mutation[1].reset();
      }, 500);
    }

    if (mutation[1].isError) {
      const err: any = mutation[1].error ? mutation[1].error : 'Error Data Not Found';
      const error = new Error(err);
      logFetchFailed('My Links', '1631161510', error);
    }
  }, [mutation[1].status]);

  return mutation;
};
