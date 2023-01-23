import * as React from 'react';
import * as C from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import { Provider } from 'react-redux';
import { store } from './Redux';

export default () => {
  return (
    <>
      <NavigationContainer>
        <Provider store={store}>
          <C.View style={{ flexGrow: 1, justifyContent: 'center', alignContent: 'center', backgroundColor: 'lime' }}>
            <C.Text>Hello There, React Native for Web; VERY VERY basic Implementation</C.Text>
          </C.View>
        </Provider>
      </NavigationContainer>
    </>
  );
};
