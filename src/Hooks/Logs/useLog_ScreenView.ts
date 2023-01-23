// : Hooks
import H from './../../Hooks';

import { iProps } from './useLog';

export const useLog_ScreenView = (props: iProps) => {
  const [debug, log, warn, error, tags, titles, legacyLog] = H.Logs.useLog(props);
  const [Analytics, userPropertyKeys] = H.Firebase.useAnalytics();

  return (screenName: string, uid: string) => {
    Analytics.logScreenView({ screen_name: screenName });
    log(`ScreenView ${screenName}`, ``, {
      id: uid,
    });
  };
};
