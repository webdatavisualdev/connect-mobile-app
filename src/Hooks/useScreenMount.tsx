import * as React from 'react';

// : Hooks
import H from './../Hooks';

// : Misc
import T from './../Misc/Tools';

export const useScreenMount = (route: string, options: {}) => {
  const nav = H.NPM.navigation.useNavigation();
  const logScreenView = H.Logs.useLog_ScreenView({ source: `(${route}) useScreenMount.tsx` });

  const [isFocused, setIsFocused] = React.useState(false);

  React.useEffect(() => {
    nav.addListener('focus', () => {
      setIsFocused(true);
    });
    nav.addListener('blur', () => {
      setIsFocused(false);
    });
  }, []);

  React.useEffect(() => {
    nav.setOptions({ ...options });
  }, [options]);

  React.useEffect(() => {
    if (isFocused)
      T.InteractionManager.runAfterInteractions(() => {
        logScreenView(route, '1631218919');
      });
  }, [isFocused]);

  return isFocused;
};
