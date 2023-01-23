import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import RouteNames from './Routes';
import { MainStack } from './Main';
import { AuthStack } from './auth';
import { DevMenuStack } from './dev';
import { WebView } from './webview';
import { HiddenAuthEngine } from './auth/hiddenAuthEngine';
import { UserSettingsStack } from './userSettings';
import { ChatbotStack } from './chatbot';
import { InitialLoading } from './initialLoading';
import { Blank } from './initialLoading/blank';
import { Legal } from './legal/legal';
import { WalkthroughCards } from './walkthroughCards/walkthroughCards';

// : Hooks
import H, { Routes, AllActions, iReduxState } from './../Hooks';

// : Components
import C from './../Components';

// : Misc
import M from './../Misc';

import { useNavigation } from '@react-navigation/native';
import RN, { Platform } from 'react-native';
import { useCustomLinking } from './../Hooks/';
import RNRestart from 'react-native-restart';

export default () => {
  const Wrapper = createStackNavigator();

  return (
    <>
      <Wrapper.Navigator screenOptions={{ headerShown: false, animationEnabled: false }}>
        <Wrapper.Screen name={'RootWrapper'} component={RootStack} />
      </Wrapper.Navigator>
    </>
  );
};

export const RootStack = () => {
  const nav = useNavigation();
  const [showHiddenAuth, setShowHiddenAuth] = React.useState(false);
  const DevMenuEnabled = H.NPM.redux.useSelector((s: iReduxState) => s.Dev.DevMenuEnabled);
  const loggingEnabled = H.NPM.redux.useSelector((s: iReduxState) => s.Dev.loggingEnabled);
  const [state, setState] = React.useState({ active: false });
  const pinScreenFocused = H.NPM.redux.useSelector((s: iReduxState) => s.Main.pinScreenFocused);
  const [setLoggingEnabledCache, delLoggingEnabledCache, getLoggingEnabledCache] = H.Misc.useAsyncStorage({
    class: 'Logging',
    categories: ['settings'],
  });

  const ModalStack = createStackNavigator();
  // const customLogger = H.Misc.useLogging();
  const dispatch = H.NPM.redux.useDispatch();
  const [MountTime, setMountTime] = React.useState(Date.now());
  const [showBlur, setShowBlur] = React.useState(false);

  // : OnMount Getting Logging Value and setting it in Redux
  React.useEffect(() => {
    getLoggingEnabledCache(['isEnabled']).then((val) => {
      if (val[0][1] === null) {
        // Value isn't set, lets do Nothing?
      }

      if (val[0][1] === 'true') {
        // Logging is enabled, lets set redux to true
        if (loggingEnabled) {
          // DO Nothing, its already enabled, we're good
        } else {
          dispatch(AllActions.Dev.toggleSettings({ setting: 'loggingEnabled' }));
        }
      }

      if (val[0][1] === 'false') {
        // Logging is not enabled, lets set redux to false
        if (loggingEnabled) {
          dispatch(AllActions.Dev.toggleSettings({ setting: 'loggingEnabled' }));
        } else {
          // DO Nothing, its already enabled, we're good
        }
      }
    });
  }, []);

  // : Handing the Backgrounding and Refocusing of the app
  React.useEffect(() => {
    RN.AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        setShowBlur(false);
        // : We Just resumed the app
        if (Date.now() > MountTime + 1000 * 60 * 5) {
          // : 5 Minutes
          RNRestart.Restart();
        }
      }

      if (state === 'background' || state === 'inactive') {
        setShowBlur(true);
        // : We Just backgrounded the app
        dispatch(AllActions.Main.pinScreenFocusedReducer({ value: false }));
      }
    });
    setTimeout(() => {
      if (!pinScreenFocused) {
        RNRestart.Restart();
      }
    }, 2000);
  }, []);

  // ! React Native Linking Proof of Concept
  useCustomLinking();

  return (
    <>
      <C.Pressable
        onPress={() => setShowHiddenAuth(!showHiddenAuth)}
        style={{
          zIndex: showHiddenAuth ? 10 : -1,
          position: 'absolute',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          borderWidth: 10,
          borderColor: 'red',
        }}>
        <C.View style={{ position: 'absolute', width: '90%', height: '80%' }}>
          <C.Pressable style={{ width: '100%', height: '100%' }}>
            <HiddenAuthEngine />
          </C.Pressable>
        </C.View>
      </C.Pressable>

      <ModalStack.Navigator
        screenOptions={{ headerShown: false, animationEnabled: Platform.select({ android: false, ios: true }), animationTypeForReplace: 'push' }}
        initialRouteName={RouteNames.Start}>
        <ModalStack.Group>
          <ModalStack.Screen name={RouteNames.Start} component={Blank} />
          <ModalStack.Screen name={RouteNames.RootStack} component={MainStack} />
        </ModalStack.Group>

        {/* Modals */}
        <ModalStack.Group>
          <ModalStack.Screen name={RouteNames.userSettingsStack} component={UserSettingsStack} options={{ presentation: 'card' }} />
          <ModalStack.Screen name={RouteNames.authStack} component={AuthStack} />
          <ModalStack.Screen name={RouteNames.dev} component={DevMenuStack} />
          <ModalStack.Screen name={RouteNames.chatbotStack} component={ChatbotStack} />
          <ModalStack.Screen name={RouteNames.webview} options={{ headerShown: false, presentation: 'modal' }} component={WebView} />
          <ModalStack.Screen name={RouteNames.legalContent} component={Legal} options={{ ...M.Tools.NavitationScreenOptions, headerShown: true }} />
        </ModalStack.Group>

        {/* One off Screens */}
        <ModalStack.Group>
          <ModalStack.Screen name={RouteNames.initialLoading} options={{ gestureEnabled: false }} component={InitialLoading} />
          <ModalStack.Screen name={RouteNames.walkthroughCards} component={WalkthroughCards} />
        </ModalStack.Group>
      </ModalStack.Navigator>

      <C.BlurView
        blurType={C.RNPlatform.OS === 'ios' ? 'thinMaterialLight' : 'light'}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          display: showBlur ? 'flex' : 'none'
        }}
      />

      <C.Fab
        active={state.active}
        direction="up"
        containerStyle={{ marginBottom: 50, marginLeft: undefined, display: DevMenuEnabled ? 'flex' : 'none' }}
        style={{ backgroundColor: 'transparent' }}
        position="bottomLeft"
      >
        <C.Pressable
          style={{ borderWidth: 0, zIndex: 999 }}
          onPress={() =>
            C.Alert.alert('Popup Dev Menu', '', [
              { text: 'Navigate to DevMenu', style: 'default', onPress: () => nav.navigate(Routes.dev, { screen: Routes.devMenu }) },
              { text: 'Toggle Visual Debugging', style: 'default', onPress: () => dispatch(AllActions.Dev.toggleSettings({ setting: 'visualDebugging' })) },
              { text: 'Show Hidden Auth WebView', style: 'default', onPress: () => setShowHiddenAuth(!showHiddenAuth) },
              { text: 'Cancel', style: 'cancel', onPress: () => {} },
            ])
          }>
          <C.Icon style={{ opacity: 1, color: 'black' }} name="bug" />
        </C.Pressable>
      </C.Fab>
    </>
  );
};
