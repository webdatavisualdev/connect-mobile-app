import * as React from 'react';
import crashlytics, { FirebaseCrashlyticsTypes } from '@react-native-firebase/crashlytics';

// : Hooks
import {
  useSingleton,
  useSelector,
  iReduxState,
  useQuery_UserProfile,
  useQuery_AlertApps,
  useQuery_AlertUserData,
  useQuery_Apps,
  useQuery_FacilityLocations,
  useQuery_Feed,
  useQuery_FeedDepartments,
  useQuery_FeedTopics,
  useQuery_MyLinks,
  useQuery_QuickLinks,
} from './../';

export const useCrashlytics = () => {
  const crash = useSingleton<FirebaseCrashlyticsTypes.Module>(() => crashlytics(), 'FirebaseCrashlytics');
  const redux = useSelector((s: iReduxState) => s);
  const Q_AlertApps = useQuery_AlertApps();
  const Q_AlertsUserData = useQuery_AlertUserData();
  const Q_Apps = useQuery_Apps();
  const Q_FacilityLocations = useQuery_FacilityLocations();
  const Q_Feed = useQuery_Feed();
  const Q_FeedDepartments = useQuery_FeedDepartments();
  const Q_FeedTopics = useQuery_FeedTopics();
  const Q_MyLinks = useQuery_MyLinks();
  const Q_QuickLinks = useQuery_QuickLinks();

  const Q_UserProfile = useQuery_UserProfile();
  const d = Q_UserProfile.data;

  React.useEffect(() => {
    crash.setUserId(d?.Properties.UserName || 'undefined');

    crash.setAttributes({
      // : Redux values
      Redux_Auth_ActiveSession: redux.Auth.activeSession.toString(),

      // : User Profile Key Values
      Redux_Auth_TokensExpireAt: redux.Auth.tokens?.expires_at || 'undefined',
      UserProfile_Account: d?.AccountName || 'undefined',
      UserProfile_Email: d?.Email || 'undefined',
      UserProfile_PrimaryLocation: d?.Properties.PrimaryLocation || 'undefined',
      UserProfile_SecondaryLocations: d?.Properties.SecondaryLocations || 'undefined',
      UserProfile_Department: d?.Properties.Department || 'undefined',
      UserProfile_Topics: d?.Properties.UserTopics || 'undefined',

      // : Query Statuses
      Query_UserProfile: Q_UserProfile.status,
      Query_AlertApps: Q_AlertApps.status,
      Query_AlertsUserData: Q_AlertsUserData.status,
      Query_Apps: Q_Apps.status,
      Query_FacilityLocations: Q_FacilityLocations.status,
      Query_Feed: Q_Feed.status,
      Query_FeedDepartments: Q_FeedDepartments.status,
      Query_FeedTopics: Q_FeedTopics.status,
      Query_MyLinks: Q_MyLinks.status,
      Query_QuickLinks: Q_QuickLinks.status,
    });
  }, []);

  return crash;
};
