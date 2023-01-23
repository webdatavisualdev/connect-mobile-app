import * as React from 'react';
import { useMutation } from 'react-query';
import { sp } from '@pnp/sp/presets/all';

// : Hooks
import { useLog, useLog_fetchFailed, useLog_timeToComplete, useQuery_UserProfile } from './../';

export interface iUpdateUserProfileProperty {
  accountName?: string;
  key: string;
  value: string | string[];
}

export const useMutation_UserProfileProperty = () => {
  const [debug, log, warn, error, tags, titles, legacyLog] = useLog({ source: 'useMutation_UserProfileProperty.tsx' });
  const logFetchFailed = useLog_fetchFailed({ source: 'useMutation_UserProfileProperty.tsx' });
  const logTimeToComplete = useLog_timeToComplete({ source: 'useMutation_UserProfileProperty.tsx' });

  const fetch_UpdateUserProfileProperty = async (variables: iUpdateUserProfileProperty) => {
    const startTime = Date.now();
    try {
      if (variables.accountName === undefined) throw new Error('User Account Name was undefined, User Profile may not be loaded yet');
      sp.setup({
        sp: {
          headers: {
            Accept: 'application/json;odata=verbose',
          },
          baseUrl: 'https://ahsonline.sharepoint.com/',
        },
      });

      if (typeof variables.value === 'string') {
        sp.profiles.setSingleValueProfileProperty(variables.accountName, variables.key, variables.value);
      } else {
        sp.profiles.setMultiValuedProfileProperty(variables.accountName, variables.key, variables.value);
      }

      logTimeToComplete('Mutate User Property', '1614760987', Date.now() - startTime, undefined);
      return;
    } catch (err) {
      throw new Error('There was an error while attempting to update the users Profile Property, ERROR: ' + err);
    }
  };

  const userProfile = useQuery_UserProfile();
  const accountName = userProfile.data?.AccountName;
  const mutation = useMutation((v: iUpdateUserProfileProperty) => fetch_UpdateUserProfileProperty({ ...v, accountName: accountName }));

  React.useEffect(() => {
    if (mutation[1].isSuccess) {
      globalThis.setTimeout(() => {
        userProfile.refetch();
        mutation[1].reset();
      }, 500);
    }

    if (mutation[1].isError) {
      const error: any = mutation[1].error;
      logFetchFailed('Mutate User Property', '1614760273', error);
    }
  }, [mutation[1].status]);

  return mutation;
};
