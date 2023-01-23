import React from 'react';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import C from '../../Components';
import M from '../../Misc';
import H, { Routes } from '../../Hooks';

export const Blank: React.FC = () => {
  const nav = H.NPM.navigation.useNavigation();
  const [_setReturningUserCache, _delReturningUserCache, getReturningUserCache, _allReturningUserCache] = H.Misc.useAsyncStorage({
    class: 'Auth',
    categories: ['ReturningUser'],
  });

  React.useEffect(() => {
    getReturningUserCache(['returningUser']).then((user) => {
      if (user[0][1] && user[0][1].length > 0) {
        nav.reset({ index: 1, routes: [{ name: Routes.RootStack }, { name: Routes.authStack, params: { screen: Routes.authPin } }] });
      } else {
        AsyncStorage.getItem('HasViewedWelcomeCards').then((viewed) => {
          if (viewed) {
            nav.reset({ index: 0, routes: [{ name: Routes.authStack }] });
          } else {
            nav.reset({ index: 0, routes: [{ name: Routes.walkthroughCards }] });
          }
        });
      }
    });
  }, []);

  return <C.View style={styles.Container}></C.View>;
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: M.Colors.white,
  },
});
