import * as React from 'react';
import { useMutation } from 'react-query';
import { sp } from '@pnp/sp/presets/all';

// : Hooks
import { useLog, useLog_fetchFailed, useLog_timeToComplete, useQuery_FeedItem } from './../';

// : Misc
import { iArticle, iEvent } from '../../Misc';

export const useMutation_FeedLikes = (type: 'article' | 'event', id: number) => {
  const [debug, log, warn, error, tags, titles, legacyLog] = useLog({ source: 'useMutation_FeedLikes.tsx' });
  const logFetchFailed = useLog_fetchFailed({ source: 'useMutation_FeedLikes.tsx' });
  const logTimeToComplete = useLog_timeToComplete({ source: 'useMutation_FeedLikes.tsx' });

  const fetch_toggleLike = async (variables: { Post: iArticle | iEvent; userId?: number }) => {
    const startTime = Date.now();
    debug(`Liking ${variables.Post.ID} as user ${variables.userId}`, '', { id: '1631161030' });
    if (!variables.userId) throw new Error('UserId is undefined');
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

      const UnifiedArticle = web.lists.getByTitle('UnifiedArticle');
      const UnifiedEvents = web.lists.getByTitle('UnifiedEvent');

      const list = variables.Post.PostType === 'article' ? UnifiedArticle : UnifiedEvents;

      const item = await list.items.getById(variables.Post.ID);
      const itemValue = await item.get<iArticle | iEvent>();
      let LikedByStringId = itemValue.LikedByStringId !== null && itemValue.LikedByStringId.results ? [...itemValue.LikedByStringId.results] : [];
      let newLikedByStringId: any[] = [];
      let newLikesCount: any = itemValue.LikesCount;
      let unliking = LikedByStringId.join(',').indexOf(variables.userId + '') > -1;

      if (unliking) {
        // * We are Removing, aka Removing the users Like
        LikedByStringId.forEach((i) => {
          if (i.toString() !== variables.userId?.toString()) newLikedByStringId.push(i);
        });
      } else {
        // * We are Adding, aka Liking
        newLikedByStringId = [...LikedByStringId, variables.userId.toString()];
      }

      newLikesCount = newLikedByStringId.length;
      await item.update({ LikedByStringId: { results: newLikedByStringId }, LikesCount: newLikesCount });
      const totalTime = Date.now() - startTime;
      logTimeToComplete(`${unliking ? 'Unlike' : 'Like'} Feed Card`, '1612800825', totalTime, undefined);

      return;
    } catch (err) {
      throw new Error(`Error after attempting mutation ${err}`);
    }
  };

  const feedItem = useQuery_FeedItem(type, id);
  const mutation = useMutation(fetch_toggleLike);

  React.useEffect(() => {
    if (mutation[1].isSuccess) {
      feedItem.refetch();
      mutation[1].reset();
    }
    if (mutation[1].isError) {
      const err: any = mutation[1].error ? mutation[1].error : 'Error Data Not Found';
      const error = new Error(err);
      logFetchFailed('Liking/Unliking Feed Card', '1612800701', error);
    }
  }, [mutation[1].status]);

  return mutation;
};
