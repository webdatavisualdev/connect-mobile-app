import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// : Hooks
import { Routes } from './../../Hooks';

// : Misc
import M from './../../Misc';

import { UserSettings } from './UserSettings';
import { AppAndDeviceInfo } from './DeviceInfo';

export const UserSettingsStack: React.FC = () => {
  const UserSettingsStack = createStackNavigator();

  return (
    <>
      <UserSettingsStack.Navigator screenOptions={{ ...M.Tools.NavitationScreenOptions, presentation: 'card' }}>
        <UserSettingsStack.Screen name={Routes.userSettings} component={UserSettings} />
        <UserSettingsStack.Screen name={Routes.deviceInfo} component={AppAndDeviceInfo} />
      </UserSettingsStack.Navigator>
    </>
  );
};
