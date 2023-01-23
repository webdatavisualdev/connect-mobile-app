import * as React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import RouteNames from './../../../Routes';
import { AppsFavorites } from './appsFavorites';
import { Apps } from './apps';
import { createStackNavigator } from '@react-navigation/stack';
import M from './../../../../Misc';
import { StyleSheet } from 'react-native';

export const AppsStack: React.FC = () => {
  const AppsStack = createStackNavigator();

  return (
    <>
      <AppsStack.Navigator
        screenOptions={{
          ...M.Tools.NavitationScreenOptions,
          title: 'Applications',
        }}
        initialRouteName={RouteNames.apps}>
        <AppsStack.Screen options={{ headerLeft: () => undefined }} name={RouteNames.apps} component={AppsTabs} />
      </AppsStack.Navigator>
    </>
  );
};

export const AppsTabs = () => {
  const AppsTabs = createMaterialTopTabNavigator();

  return (
    <>
      <AppsTabs.Navigator
        screenOptions={{
          tabBarActiveTintColor: M.Colors.black,
          tabBarInactiveTintColor: M.Colors.doveGray,
          tabBarLabelStyle: styles.labelStyle,
          tabBarIndicatorStyle: styles.indicatorStyle,
          swipeEnabled: true
        }}
        initialRouteName={RouteNames.appsFavorites}>
        <AppsTabs.Screen name={RouteNames.appsFavorites} component={AppsFavorites} />
        <AppsTabs.Screen name={RouteNames.appsAll} component={Apps} />
      </AppsTabs.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  labelStyle: {
    textTransform: 'none',
    fontSize: 16,
  },
  indicatorStyle: {
    backgroundColor: M.Colors.black,
    height: 2,
  },
});
