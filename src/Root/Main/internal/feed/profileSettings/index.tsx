import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import RouteNames from './../../../../Routes';
import { Settings } from './settings';
import { Save } from './save';
import T from './../../../../../Misc/Tools';

export const ProfileSettingsStack: React.FC = () => {
  const SettingsStack = createStackNavigator();

  return (
    <>
      <SettingsStack.Navigator screenOptions={T.NavitationScreenOptions} initialRouteName={RouteNames.feedProfileSettings}>
        <SettingsStack.Screen name={RouteNames.feedProfileSettings} component={Settings} />
        <SettingsStack.Screen name={RouteNames.feedProfileSettingsSave} component={Save} />
      </SettingsStack.Navigator>
    </>
  );
};
