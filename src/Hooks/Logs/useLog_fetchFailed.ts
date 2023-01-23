// : Hooks
import H from './../../Hooks';

// : Misc
import { eLogTags } from './../../Misc';

import { iProps } from './useLog';

export const useLog_fetchFailed = (props: iProps) => {
  const [debug, log, warn, error, tags, titles, legacyLog] = H.Logs.useLog(props);

  return (name: string, uid: string, err: Error, additionalTags: eLogTags[] = []) => {
    error(`Fetch ${name} Error`, `${name} Fetch Failed, Error Attached`, {
      id: uid,
      tags: [tags.network, tags.fetch, tags.error, ...additionalTags],
      extraData: { error: err },
      analytics: {
        name: `error_fetch_${name.replace(/ /g, '')}`,
        stripExtraData: true,
      },
    });
  };
};
