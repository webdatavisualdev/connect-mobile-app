import * as React from 'react';
import { sp } from '@pnp/sp/presets/all';
import { useMutation } from 'react-query';

// : Hooks
import { useLog, useLog_fetchFailed, useLog_timeToComplete } from './../';

// : Misc
import { iArticle, iEvent } from '../../Misc';

export interface iProps {
  To: string;
  Message: string;
  Post: iArticle | iEvent;
}

export const useMutation_ShareFeedCard = () => {
  const [debug, log, warn, error, tags, titles, legacyLog] = useLog({ source: 'useMutation_ShareFeedCard.tsx' });
  const logFetchFailed = useLog_fetchFailed({ source: 'useMutation_ShareFeedCard.tsx' });
  const logTimeToComplete = useLog_timeToComplete({ source: 'useMutation_ShareFeedCard.tsx' });

  const fetch_SaveShareToList = async (variables: { From: string; To: string; Message: string; Post: iArticle | iEvent }) => {
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

      const shareList = web.lists.getByTitle('FeedShare');

      const response = await shareList.items.add({
        Title: variables.Post.Title,
        Comments: variables.Message,
        From: variables.From,
        To: variables.To,
        PostType: variables.Post.PostType,
        PostID: variables.Post.ID.toString(),
      });
      const totalTime = Date.now() - startTime;

      logTimeToComplete('Share Feed Post', '1612798105', totalTime, undefined);
      return response;
    } catch (err) {
      throw new Error(`Error while attempting to save Share Post ${err}`);
    }
  };

  const mutation = useMutation(fetch_SaveShareToList);

  React.useEffect(() => {
    if (mutation[1].isSuccess) {
      debug('Share Feed Card', 'Success', { id: '1631164521' });
    }
    if (mutation[1].isError) {
      const error: any = mutation[1].error;
      logFetchFailed('Share Feed Card', '1631164526', error);
    }
  }, [mutation[1].status]);

  return mutation;
};
