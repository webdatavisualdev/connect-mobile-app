import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import RouteNames from './../../../Routes';
import { Feed } from './feed';
import { PostExpanded } from './postExpanded';
import { PostInfo } from './postInfo';
import { PostReport } from './postReport';
import { PostShare } from './postShare';
import { ProfileSettingsStack } from './profileSettings';
import T from './../../../../Misc/Tools';

export const FeedStack: React.FC = () => {
  const FeedStack = createStackNavigator();

  return (
    <>
      <FeedStack.Navigator screenOptions={T.NavitationScreenOptions}>
        <FeedStack.Screen options={{ headerLeft: () => undefined }} name={RouteNames.feed} component={Feed} />
        <FeedStack.Screen name={RouteNames.feedPostExpand} component={PostExpanded} />
        <FeedStack.Screen name={RouteNames.feedPostInfo} component={PostInfo} />
        <FeedStack.Screen name={RouteNames.feedReportPost} component={PostReport} />
        <FeedStack.Screen name={RouteNames.feedSharePost} component={PostShare} />
        <FeedStack.Screen options={{ headerShown: false }} name={RouteNames.feedProfileSettingsStack} component={ProfileSettingsStack} />
      </FeedStack.Navigator>
    </>
  );
};
