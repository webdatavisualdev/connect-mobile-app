global.XMLHttpRequest = require('xhr2');

import * as React from 'react';
import { LogBox, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import CookieManager from '@react-native-community/cookies';
import { QueryCache, ReactQueryCacheProvider } from 'react-query';
import AsyncStorage from '@react-native-community/async-storage';
import * as Hydration from 'react-query/hydration';
import messaging from '@react-native-firebase/messaging';

import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { Provider } from 'react-redux';
import { store } from './Redux';

import RootNavTree from './Root';

// : Components
import C from './Components';

// : Hooks
import SplashScreen from 'react-native-splash-screen';

type RootStackParam = {
  [x: string]: object | undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParam { }
  }
}

export const ConnectMobileApp: React.FC = () => {
  const [navState, setNavState] = React.useState();
  const [reactQueryCache, setReactQueryCache] = React.useState(new QueryCache());
  const doneLoadingRef = React.useRef<{ [key: string]: boolean }>({
    loadQueryCache: false,
    loadNavState: false,
    checkIsHeadless: Platform.OS === 'ios' ? false : true,
    artificialDelay: false,
  });
  Ionicons.loadFont();
  MaterialCommunityIcons.loadFont();
  FontAwesome.loadFont();
  CookieManager.clearAll();

  React.useEffect(() => {
    // TODO Remove this, no longer needed, ensure its not in use anywhere
    const placeHolder: () => void = () => {
      // console.warn('Tried to use AHLog before it was declared');
    };
    (globalThis.console as any).AHLog = placeHolder;
  }, []);

  // TODO Offload LogBox Config to hook
  LogBox.ignoreLogs([
    'Require cycle:',
    'Require cycles are allowed, but',
    'startLoadWithResult',
    'Did not receive response to shouldStartLoad in time',
    'startLoadWithResult invoked',
  ]);

  // : React-Query Cache init
  // const reactQueryCache = new QueryCache();
  // TODO Offload this Devtools feature to another file, maybe a hook?
  if (__DEV__) {
    import('react-query-native-devtools').then(({ addPlugin }) => {
      addPlugin(reactQueryCache);
    });
  }

  // : AsyncStorage in Flipper
  // TODO Offload this DevTools feature to another file.
  if (__DEV__) {
    // RNAsyncStorageFlipper(AsyncStorage);
    // import('rn-async-storage-flipper').then((RNAsyncStorageFlipper: any) => {
    //   RNAsyncStorageFlipper(AsyncStorage);
    // })
  }

  // : Rehydrate Queries Cache
  // TODO Offload this Dehydration/Rehydration to a hook
  // React.useEffect(() => {
  //   const temp = Hydration.dehydrate(reactQueryCache, { shouldDehydrate: () => true });
  //   // console.log('Cache response', reactQueryCache.getQueryData('publicFeed'));
  //   // temp.queries[0].data = reactQueryCache.getQueryData('publicFeed');

  //   AsyncStorage.setItem('dehydratedNetworkQueries', JSON.stringify(temp));
  // }, [reactQueryCache])

  const updateDoneLoading = (key: string, value: boolean) => {
    // console.log(Date.now(), key, value);
    doneLoadingRef.current[key] = value;
  };

  React.useEffect(() => {
    globalThis.setTimeout(() => {
      updateDoneLoading('artificialDelay', true);
    }, 100);
  }, []);

  React.useEffect(() => {
    if (Platform.OS === 'ios') {
      messaging()
        .getIsHeadless()
        .then((isHeadless) => {
          if (isHeadless === false) updateDoneLoading('checkIsHeadless', true);
        });
    } else {
      updateDoneLoading('checkIsHeadless', true);
    }
  }, []);

  React.useEffect(() => {
    AsyncStorage.getItem('dehydratedNetworkQueries').then((val) => {
      if (val) {
        // console.log({ val: JSON.parse(val) });
        try {
          Hydration.hydrate(reactQueryCache, JSON.parse(val));
        } catch (err) {
          console.error('Error trying to ReHydrate Network Queries ' + err);
        }
      }
      // setIsLoading(false);
      updateDoneLoading('loadQueryCache', true);
    });
  }, []);

  React.useEffect(() => {
    reactQueryCache.subscribe((cache) => {
      // console.log({ Message: 'Entering ReactQueryCache subscription callback' })
      const dehydratedValue = Hydration.dehydrate(cache, { shouldDehydrate: () => true });
      // console.log({ reactQueryCacheSubscription: dehydratedValue });
      AsyncStorage.setItem('dehydratedNetworkQueries', JSON.stringify(dehydratedValue));
    });
  }, [reactQueryCache]);

  // : Dehydrate/Rehydrate Navigation
  // TODO Offload this Dehydration/Rehydration to a hook
  const handle_NavStateChange = (state: any) => {
    AsyncStorage.setItem('DehydratedNavState', JSON.stringify(state));
  };

  React.useEffect(() => {
    AsyncStorage.getItem('DehydratedNavState').then((val) => {
      // if (val) setNavState(JSON.parse(val));
      // setIsLoading(false);
      updateDoneLoading('loadNavState', true);
    });

    SplashScreen.hide();
  }, []);

  // if (isLoading) return <C.Spinner />
  if (
    !Object.keys(doneLoadingRef.current)
      .map((key) => doneLoadingRef.current[key])
      .every((itm) => itm === true)
  )
    return <C.View></C.View>;

  return (
    <C.Root>
      <ReactQueryCacheProvider queryCache={reactQueryCache}>
        <NavigationContainer initialState={navState} onStateChange={handle_NavStateChange}>
          <Provider store={store}>
            <RootNavTree />
          </Provider>
        </NavigationContainer>
      </ReactQueryCacheProvider>
    </C.Root>
  );
};
