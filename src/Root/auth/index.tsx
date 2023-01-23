import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import RouteNames from './../Routes';
import { Auth } from './auth';
import { Register } from './register';
import { PinEntry } from './pinEntry';
import { Logout } from './logout';
import T from './../../Misc/Tools';

export const AuthStack = () => {
  const AuthStack = createStackNavigator();

  return (
    <>
      <AuthStack.Navigator
        screenOptions={{ ...T.NavitationScreenOptions, gestureEnabled: false }}>
        <AuthStack.Screen name={RouteNames.auth} component={Auth} />
        <AuthStack.Screen options={{ headerShown: false }} name={RouteNames.authRegister} component={Register} />
        <AuthStack.Screen options={{ headerShown: false }} name={RouteNames.authPin} component={PinEntry} />
        <AuthStack.Screen name={RouteNames.authLogout} options={{ headerLeft: () => undefined, title: 'Auth Logout' }} component={Logout} />
      </AuthStack.Navigator>
    </>
  );
};
