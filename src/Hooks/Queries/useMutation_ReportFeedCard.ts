import * as React from 'react';
import { sp } from '@pnp/sp/presets/all';
import { useMutation } from 'react-query';

// : Hooks
import { useLog, useLog_fetchFailed, useLog_timeToComplete } from './../';

export const useMutation_ReportFeedCard = () => {
  const [debug, log, warn, error, tags, titles, legacyLog] = useLog({ source: 'useMutation_ReportFeedCard.tsx' });
  const logFetchFailed = useLog_fetchFailed({ source: 'useMutation_ReportFeedCard.tsx' });
  const logTimeToComplete = useLog_timeToComplete({ source: 'useMutation_ReportFeedCard.tsx' });

  const fetch_SaveReportToList = async (variables: {
    Title: string;
    Comment: string;
    ReportedBy: string;
    PostType: 'article' | 'event';
    PostFacility: string;
    PostID: string;
  }) => {
    const startTime = Date.now();
    try {
      sp.setup({
        sp: {
          headers: {
            Accept: 'application/json;odata=verbose',
          },
          baseUrl: 'https://ahsonline.sharepoint.com',
        },
      });
      const web = await sp.web;

      const reportList = web.lists.getByTitle('Report Post');

      const response = await reportList.items.add({ ...variables });
      const totalTime = Date.now() - startTime;

      logTimeToComplete('Report Feed Card', '1612798387', totalTime, undefined);
      return response;
    } catch (err) {
      throw new Error(`Error while attempting to save Report Post ${err}`);
    }
  };

  const mutation = useMutation(fetch_SaveReportToList);

  React.useEffect(() => {
    if (mutation[1].isSuccess) {
      debug('Report Feed Card', 'Success', { id: '1631164231' });
    }
    if (mutation[1].isError) {
      const error: any = mutation[1].error;
      logFetchFailed('Report Feed Card', '1612798271', error);
    }
  }, [mutation[1].status]);

  return mutation;
};
