import * as React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import RouteNames from '../Routes';
import { InternalStack } from './internal';

export const MainStack: React.FC = () => {
  const MainStack = createStackNavigator();

  return (
    <>
      <MainStack.Navigator screenOptions={{ gestureEnabled: false, animationEnabled: Platform.select({ android: false, ios: true }), headerShown: false }}>
        <MainStack.Screen name={RouteNames.internalContent} component={InternalStack} />
      </MainStack.Navigator>
    </>
  );
};
