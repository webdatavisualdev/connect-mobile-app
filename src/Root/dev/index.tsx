import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// : Hooks
import { Routes } from './../../Hooks';

// : Misc
import M from './../../Misc';

// : Screens
import { DevMenu } from './devMenu';
import { Experiments } from './experiments';
import { AsyncStorage } from './asyncStorage';
import { FCMManager } from './fcmManager';
import { NavMaster } from './navMaster';
import { Logs } from './logs';

export interface iProps {}

export const DevMenuStack: React.FC<iProps> = () => {
  const StackNav = createStackNavigator();

  return (
    <>
      <StackNav.Navigator initialRouteName={Routes.devMenu} screenOptions={M.Tools.NavitationScreenOptions}>
        {/* <StackNav.Screen name={Routes.devStoryBook} component={() => <></>} /> */}
        <StackNav.Screen name={Routes.devMenu} component={DevMenu} />
        <StackNav.Screen name={Routes.devExperiments} component={Experiments} />
        <StackNav.Screen name={Routes.devAsyncStorage} component={AsyncStorage} />
        <StackNav.Screen name={Routes.devFCMManager} component={FCMManager} />
        <StackNav.Screen name={Routes.devNavMaster} component={NavMaster} />
        <StackNav.Screen name={Routes.devLogs} component={Logs} />
      </StackNav.Navigator>
    </>
  );
};
