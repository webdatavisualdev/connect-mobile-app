import * as React from 'react';
import * as FirebaseAnalytics from '@react-native-firebase/analytics';

// : Hooks
import { useSingleton } from './../';

export interface iCustomAnalytics {
  logScreenView: (params: FirebaseAnalytics.FirebaseAnalyticsTypes.ScreenViewParameters) => Promise<void>;
  logEvent: (name: string, params?: { [key: string]: any }) => Promise<void>;
}

export const useAnalytics = () => {
  const fireAnalytics = useSingleton<FirebaseAnalytics.FirebaseAnalyticsTypes.Module>(() => FirebaseAnalytics.default(), 'FirebaseAnalytics');

  React.useEffect(() => {
    // Enabled by default, not needed...
    fireAnalytics.setAnalyticsCollectionEnabled(true);
  }, []);

  const logScreenView = async (params: FirebaseAnalytics.FirebaseAnalyticsTypes.ScreenViewParameters) => {
    fireAnalytics.logScreenView(params);
  };

  const logEvent = async (name: string, params?: { [key: string]: any }) => {
    fireAnalytics.logEvent(name, params);
  };

  /**
   * Firebase only allows 25 unique custom user properties
   */
  enum userPropertyKeys {
    PRIMARY_LOCATION = 'PRIMARY_LOCATION',
    USER_MODE = 'USER_MODE',
  }

  const analytics: iCustomAnalytics = {
    logScreenView,
    logEvent,
  };

  return [analytics, userPropertyKeys] as const;
};
