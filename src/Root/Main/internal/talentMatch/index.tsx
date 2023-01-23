import * as React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import RouteNames from './../../../Routes';
import TalentMatch from './talentMatch';

export default () => {
  const TalentMatchStack = createStackNavigator();

  return (
    <>
      <TalentMatchStack.Navigator
        initialRouteName={RouteNames.talentMatch}
        screenOptions={{ animationEnabled: Platform.select({ android: false, ios: true }) }}>
        <TalentMatchStack.Screen options={{ headerLeft: () => undefined }} name={RouteNames.talentMatch} component={TalentMatch} />
      </TalentMatchStack.Navigator>
    </>
  );
};
