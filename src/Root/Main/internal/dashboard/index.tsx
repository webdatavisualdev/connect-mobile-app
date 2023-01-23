import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// : Hooks
import { Routes } from './../../../../Hooks';

// : Misc
import M from './../../../../Misc';

import { Dashboard } from './dashboard';
import { SelectDash } from './selectDash';

export const DashboardStack: React.FC = () => {
  const DashboardNavigator = createStackNavigator();

  return (
    <>
      <DashboardNavigator.Navigator screenOptions={{ ...M.Tools.NavitationScreenOptions }}>
        <DashboardNavigator.Screen name={Routes.dashboard} component={Dashboard} />
        <DashboardNavigator.Screen name={Routes.dashboardSelect} component={SelectDash} options={{ presentation: 'modal' }} />
      </DashboardNavigator.Navigator>
    </>
  );
};
