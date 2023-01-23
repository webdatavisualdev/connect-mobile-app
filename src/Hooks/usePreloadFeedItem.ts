import * as React from 'react';

// : Hooks
import { useQuery_FeedItem } from './../Hooks';

// : Misc
import { iArticle, iEvent } from './../Misc';

export const usePreloadFeedItem = (begin: boolean, card?: iArticle | iEvent) => {
  const [preloadStatus, setPreloadStatus] = React.useState<'waitingToStart' | 'preloading' | 'loaded'>('waitingToStart');
  const [postType, setPostType] = React.useState<'article' | 'event'>('article');
  const [postId, setPostId] = React.useState(1);
  const [stallQuery, setStallQuery] = React.useState(true);
  const query = useQuery_FeedItem(postType, postId, undefined, stallQuery);

  // : Initialize prefetching and set variables, this should kick off fetching via the query
  React.useEffect(() => {
    if (card) {
      if (begin) {
        setPostType(card.PostType);
        setPostId(card.ID);
        setStallQuery(false);
        setPreloadStatus('preloading');
      }
    }
  }, [begin]);

  // : Watch for the prefetch to have begun and the query has been fetched... when both these conditions are met, the data should be prefetched
  React.useEffect(() => {
    if (preloadStatus === 'preloading' && begin && (query.isFetched || query.isError)) {
      setPreloadStatus('loaded');
    }
  }, [query.isFetched, query.isError, begin, preloadStatus]);

  // : If we get an undefined Card and begin is set to true, lets immediately return loaded...
  React.useEffect(() => {
    if (begin === true && card === undefined) setPreloadStatus('loaded');
  }, [begin, card]);

  return preloadStatus;
};
