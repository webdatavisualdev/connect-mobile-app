// : DEV
import { useExperiment } from './Dev/useExperiment';
import { useWhyDidYouUpdate } from './Dev/useWhyDidYouUpdate';

// : NPM
import { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/elements';
import Routes, { RoutesHierarchy } from './../Root/Routes'; // : HELPER/UTILITY to navigation
import { useSelector, useDispatch } from 'react-redux';
import iState from './../Redux/iReduxState'; // : HELPER/UTILITY to Redux
import AllActions from './../Redux/AllActions'; // : HELPER/UTILITY to Redux

// : Logs
import useLog from './Logs/useLog';
import { useLog_PullToRefresh } from './Logs/useLog_PullToRefresh';
import { useLog_fetchFailed } from './Logs/useLog_fetchFailed';
import { useLog_timeToComplete } from './Logs/useLog_timeToComplete';
import { useLog_userPress } from './Logs/useLog_userPress';
import { useLog_ScreenView } from './Logs/useLog_ScreenView';

// : Misc
import { useCustomLinking } from './useCustomLinking';
import { useScreenMount } from './useScreenMount';
import { useFileCache } from './useFileCache';
import { useAsyncStorage } from './useAsyncStorage';
import { useDirectLine } from './useDirectLine';
import { useManagedCookies } from './useManagedCookies';
import { useUserProfileInFirestore } from './useUserProfileInFirestore';
import { useSingleton } from './useSingleton';
import { usePreloadFeedItem } from './usePreloadFeedItem';

// : Firebase
import { useAnalytics } from './Firebase/useAnalytics';
import { useRemoteConfig } from './Firebase/useRemoteConfig';
import { useAuth } from './Firebase/useAuth';
import { useCrashlytics } from './Firebase/useCrashlytics';
import { usePerfMon } from './Firebase/usePerfMon';
import { useFirebaseCloudMessaging } from './Firebase/useFirebaseCloudMessaging';
import { useFirestore } from './Firebase/useFirestore';
import { useRegistered_PushNotification } from './Firebase/useRegistered_PushNotification';

// : Queries
import { useQueryCache } from 'react-query';
import { useQuery_Feed } from './Queries/useQuery_Feed';
import { useQuery_FeedItem } from './Queries/useQuery_FeedItem';
import { useQuery_UserProfile } from './Queries/useQuery_UserProfile';
import { useQueryHelper_UserProfile_Sub_FeedPrimLoc } from './Queries/useQueryHelper_UserProfile_Sub_FeedPrimLoc';
import { useQueryHelper_UserProfile_Sub_FeedSecLoc } from './Queries/useQueryHelper_UserProfile_Sub_FeedSecLoc';
import { useQueryHelper_UserProfile_Sub_FeedTopics } from './Queries/useQueryHelper_UserProfile_Sub_FeedTopics';
import { useQuery_LookupUser } from './Queries/useQuery_LookupUser';
import { useQuery_MyLinks } from './Queries/useQuery_MyLinks';
import { useQuery_QuickLinks } from './Queries/useQuery_QuickLinks';
import { useQuery_Apps } from './Queries/useQuery_Apps';
import { useQuery_AlertApps } from './Queries/useQuery_AlertApps';
import { useQuery_AlertUserData } from './Queries/useQuery_AlertUserData';
import { useQuery_FacilityLocations } from './Queries/useQuery_FacilityLocations';
import { useQuery_FeedDepartments } from './Queries/useQuery_FeedDepartments';
import { useQuery_FeedTopics } from './Queries/useQuery_FeedTopics';
import { useQuery_Registered_PushNotification } from './Queries/useQuery_Registered_PushNotification';

// : Mutations
import { useMutation_ShareFeedCard } from './Queries/useMutation_ShareFeedCard';
import { useMutation_ReportFeedCard } from './Queries/useMutation_ReportFeedCard';
import { useMutation_FeedLikes } from './Queries/useMutation_FeedLikes';
import { useMutation_MyLinks } from './Queries/useMutation_MyLinks';
import { useMutation_UserProfileProperty } from './Queries/useMutation_UserProfileProperty';
import { useMutation_AlertSetting } from './Queries/useMutation_AlertSetting';

// : HELPERS Exports
export interface iReduxState extends iState {}
export { Routes, RoutesHierarchy, AllActions };

export default {
  DEV: {
    useExperiment,
    useWhyDidYouUpdate,
  },
  NPM: {
    react: {
      useState,
      useEffect,
    },
    navigation: {
      useNavigation,
      useRoute,
      useHeaderHeight,
    },
    redux: {
      useSelector,
      useDispatch,
    },
    query: {
      useQueryCache,
    },
  },
  Logs: {
    useLog,
    useLog_PullToRefresh,
    useLog_fetchFailed,
    useLog_timeToComplete,
    useLog_userPress,
    useLog_ScreenView,
  },
  Misc: {
    useCustomLinking,
    useScreenMount,
    useFileCache,
    useAsyncStorage,
    useDirectLine,
    useManagedCookies,
    useUserProfileInFirestore,
    useSingleton,
    usePreloadFeedItem,
  },
  Firebase: {
    useAnalytics,
    useRemoteConfig,
    useAuth,
    useCrashlytics,
    usePerfMon,
    useFirebaseCloudMessaging,
    useFirestore,
    useRegistered_PushNotification,
  },
  Queries: {
    useQuery_Feed,
    useQuery_FeedItem,
    useQuery_UserProfile,
    useQueryHelper_UserProfile_Sub_FeedPrimLoc,
    useQueryHelper_UserProfile_Sub_FeedSecLoc,
    useQueryHelper_UserProfile_Sub_FeedTopics,
    useQuery_LookupUser,
    useQuery_MyLinks,
    useQuery_QuickLinks,
    useQuery_Apps,
    useQuery_AlertApps,
    useQuery_AlertUserData,
    useQuery_FacilityLocations,
    useQuery_FeedDepartments,
    useQuery_FeedTopics,
    useMutation_ShareFeedCard,
    useMutation_ReportFeedCard,
    useMutation_FeedLikes,
    useMutation_MyLinks,
    useMutation_UserProfileProperty,
    useMutation_AlertSetting,
    useQuery_Registered_PushNotification,
  },
};

// : Tree Shakable individual imports...
// : This was added to aid easy import of individual hooks into files
// : Primarily for use in other hooks, to avoid the circular dependency warning
export {
  // : DEV
  useExperiment,
  useWhyDidYouUpdate,
  // : NPM
  useState,
  useEffect,
  useNavigation,
  useRoute,
  useHeaderHeight,
  useSelector,
  useDispatch,
  // : Logs
  useLog,
  useLog_PullToRefresh,
  useLog_fetchFailed,
  useLog_timeToComplete,
  useLog_userPress,
  useLog_ScreenView,
  // : Misc
  useCustomLinking,
  useScreenMount,
  useFileCache,
  useAsyncStorage,
  useDirectLine,
  useManagedCookies,
  useUserProfileInFirestore,
  useSingleton,
  usePreloadFeedItem,
  // : Firebase
  useAnalytics,
  useRemoteConfig,
  useAuth,
  useCrashlytics,
  usePerfMon,
  useFirebaseCloudMessaging,
  useFirestore,
  useRegistered_PushNotification,
  // : Queries
  useQueryCache,
  useQuery_Feed,
  useQuery_FeedItem,
  useQuery_UserProfile,
  useQueryHelper_UserProfile_Sub_FeedPrimLoc,
  useQueryHelper_UserProfile_Sub_FeedSecLoc,
  useQueryHelper_UserProfile_Sub_FeedTopics,
  useQuery_LookupUser,
  useQuery_MyLinks,
  useQuery_QuickLinks,
  useQuery_Apps,
  useQuery_AlertApps,
  useQuery_AlertUserData,
  useQuery_FacilityLocations,
  useQuery_FeedDepartments,
  useQuery_FeedTopics,
  useQuery_Registered_PushNotification,
  // : Mutations
  useMutation_ShareFeedCard,
  useMutation_ReportFeedCard,
  useMutation_FeedLikes,
  useMutation_MyLinks,
  useMutation_UserProfileProperty,
  useMutation_AlertSetting,
};
