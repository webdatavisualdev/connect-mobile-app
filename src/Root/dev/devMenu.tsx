import * as React from 'react';
import CookieManager from '@react-native-community/cookies';

// : Hooks
import H, { Routes, AllActions, iReduxState } from './../../Hooks';

// : Components
import C from './../../Components';

export interface iProps {}

export const DevMenu: React.FC<iProps> = () => {
  const [debug, log, warn, error, tags, titles, legacyLog] = H.Logs.useLog({ source: 'devMenu.tsx' });
  const isFocused = H.Misc.useScreenMount(Routes.devMenu, { title: 'Dev Menu' });
  const nav = H.NPM.navigation.useNavigation();
  const queryCache = H.NPM.query.useQueryCache();
  const Crashlytics = H.Firebase.useCrashlytics();
  const dispatch = H.NPM.redux.useDispatch();
  const devMenuSetting = H.NPM.redux.useSelector((s: iReduxState) => s.Dev.DevMenuEnabled);

  return (
    <C.Container style={{ paddingBottom: 30 }}>
      <C.Content style={{ paddingHorizontal: 15 }}>
        <RenderItem title="Quick Settings" desc="" action={() => {}} longPress={() => {}}>
          <C.Button
            onPress={() => {
              dispatch(AllActions.Dev.enableDevMenu({ newSetting: !devMenuSetting }));
            }}
            block>
            <C.Text>{devMenuSetting ? '[T] Disable' : '[F] Enable'} the Compact Dev Menu</C.Text>
          </C.Button>
        </RenderItem>

        <RenderItem
          title="Disclaimer"
          desc="Modifying settings in this menu could compromise the stability of the mobile app, but you may be asked to visit this screen explicity for assistance in troubleshooting or otherwise."
          action={() => {}}
          longPress={() => {}}
        />

        <RenderItem
          title="Visual Debugging"
          desc="Visual Debugging draws border boxes and reveals additional information for some elements for debugging purposes..."
          action={() => dispatch(AllActions.Dev.toggleSettings({ setting: 'visualDebugging' }))}
          longPress={() => {}}
        />

        <RenderItem
          title="Toggle Experiments"
          desc="Experiemental features that can be toggled on or off (Much like the Chrome://Flags Menu for Chromium Browsers)"
          action={() => nav.navigate(Routes.devExperiments)}
          longPress={() => {}}
        />

        <RenderItem
          title="Network Queries"
          desc="View and Clear/Reset Network Queries for the app, for the time beingn all you can do is clear the cached query values."
          action={() =>
            C.Alert.alert('Comming Soon', 'This feature is not yet available', [
              { text: 'Dismiss', style: 'default', onPress: () => {} },
              { text: 'Clear Cache', style: 'destructive', onPress: () => queryCache.clear() },
            ])
          }
          longPress={() => {}}
        />

        <RenderItem
          title="Async Storage"
          desc="View and Manage the async storage values stored within the application.  Async Storage are longer term stored values that persist between reboots of the app and your device."
          action={() => nav.navigate(Routes.devAsyncStorage)}
          longPress={() => {}}
        />

        <RenderItem
          title="Force Crash (Crashlytics log)"
          desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          action={() =>
            C.Alert.alert(
              'Enhancements Comming Soon',
              'Using the button below you can crash the app and submit your log data to the development team, there is a more graceful approach comming soon.',
              [
                { text: 'Dismiss', style: 'cancel', onPress: () => {} },
                { text: 'Crash', style: 'destructive', onPress: () => Crashlytics.crash() },
              ],
            )
          }
          longPress={() => {}}
        />

        <RenderItem
          title="FCM Manager"
          desc="FCM (Firebase Cloud Messaging) Management screen, here you can View, subscribe, and unsubscribe from topics that enable push notifications."
          action={() => nav.navigate(Routes.devFCMManager)}
          longPress={() => {}}
        />

        <RenderItem
          title="Navigation Master"
          desc="Navigation Master allows you to navigate to any static screen within the app, this screen also represents the nesting structure of the screens.  Not all screens can be navigated to as some require input from a previous screen."
          action={() => nav.navigate(Routes.devNavMaster)}
          longPress={() => {}}
        />

        <RenderItem
          title="Logs"
          desc="View the Logging events in the application, and also manage some togglable settings related to logging."
          action={() => nav.navigate(Routes.devLogs)}
          longPress={() => {}}
        />

        <RenderItem
          title="Cookies (Log Cookies)"
          desc="When clicked we will log the cookies associated with the authentication webview, this will be migrated into the logging screen at a later date."
          action={() =>
            CookieManager.getAll().then((cookies) => {
              log('Cookies Triggered by the Dev Menu', `See Extra Data`, { id: '1637701948', extraData: cookies });
            })
          }
          longPress={() => {}}
        />
      </C.Content>
    </C.Container>
  );
};

export interface iRenderItemProps {
  title: string;
  desc: string;
  action: () => void;
  longPress: () => void;
  disabled?: boolean;
}

export const RenderItem: React.FC<iRenderItemProps> = (props) => {
  if (props.children) {
    return (
      <>
        <C.Pressable onPress={props.action} onLongPress={props.longPress}>
          <C.Card>
            <C.CardItem header style={{ paddingBottom: 0 }}>
              <C.Text style={{ fontWeight: 'bold', color: props.disabled ? 'lightgrey' : 'black' }}>{`${props.title} ${
                props.disabled ? '(disabled)' : ''
              }`}</C.Text>
            </C.CardItem>
            <C.CardItem>
              <C.Body>{props.children}</C.Body>
            </C.CardItem>
          </C.Card>
        </C.Pressable>
      </>
    );
  }
  return (
    <>
      <C.Pressable onPress={props.action} onLongPress={props.longPress}>
        <C.Card>
          <C.CardItem header style={{ paddingBottom: 0 }}>
            <C.Text style={{ fontWeight: 'bold', color: props.disabled ? 'lightgrey' : 'black' }}>{`${props.title} ${
              props.disabled ? '(disabled)' : ''
            }`}</C.Text>
          </C.CardItem>
          <C.CardItem>
            <C.Body>
              <C.Text size="tiny" style={{ color: 'grey' }}>
                {props.desc}
              </C.Text>
            </C.Body>
          </C.CardItem>
        </C.Card>
      </C.Pressable>
    </>
  );
};
