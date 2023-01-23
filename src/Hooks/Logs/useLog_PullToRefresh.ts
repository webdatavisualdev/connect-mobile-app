// : Hooks
import H from './../../Hooks';

import { iProps } from './useLog';

export const useLog_PullToRefresh = (props: iProps) => {
  const [debug, log, warn, error, tags, titles, legacyLog] = H.Logs.useLog(props);

  return (name: string, uid: string) => {
    log(`Refreshing ${name}`, `User Initiated Pull to Refresh the Component: ${name}`, {
      id: `1613422442_${uid}`,
      tags: [tags.userInteraction, tags.refresh, tags.gesture, tags.network],
      analytics: {
        name: `pullRefresh_${name.split(' ').join('')}`,
        stripExtraData: false,
      },
    });
  };
};
