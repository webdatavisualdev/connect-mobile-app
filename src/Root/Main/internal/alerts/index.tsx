import * as React from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import RouteNames from './../../../Routes';
import { Alerts } from './alerts';
import { Settings } from './settings';
import M from './../../../../Misc';

export const AlertsStack: React.FC = () => {
  const AlertsStack = createStackNavigator();

  return (
    <>
      <AlertsStack.Navigator
        screenOptions={M.Tools.NavitationScreenOptions}
        initialRouteName={RouteNames.alerts}>
        <AlertsStack.Screen options={{ headerLeft: () => undefined }} name={RouteNames.alerts} component={Alerts} />
        <AlertsStack.Screen options={{ title: 'Alerts Settings' }} name={RouteNames.alertsSettings} component={Settings} />
      </AlertsStack.Navigator>
    </>
  );
};
