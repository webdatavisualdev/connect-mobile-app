import * as React from 'react';
import Clipboard from '@react-native-clipboard/clipboard';

// : Hooks
import H, { AllActions, iReduxState } from './../../Hooks';

// : Components
import C from './../../Components';

// : Misc
import M, { iLog } from './../../Misc';
import { ListRenderItemInfo } from 'react-native';

export const Logs: React.FC = () => {
  const [logs, setLogs] = React.useState<iLog[]>(window.globalThis.CustomLogs ? window.globalThis.CustomLogs : []);
  const [modalContent, setModalContent] = React.useState<iLog | undefined>();

  const RenderLog = (i: ListRenderItemInfo<iLog>) => {
    const { type } = i.item;

    let colors = 'black';
    switch (type) {
      case 'debug':
        colors = 'grey';
        break;
      case 'error':
        colors = 'red';
        break;
      case 'log':
        colors = 'black';
        break;
      case 'warn':
        colors = 'gold';
        break;
    }

    return (
      <C.Pressable onPress={() => setModalContent(i.item)}>
        <C.View style={{ borderWidth: 1, borderColor: colors, margin: 5, padding: 5, backgroundColor: M.Colors.white }}>
          <C.Text style={{ color: colors, fontWeight: 'bold' }}>{typeof i.item.title === 'string' ? i.item.title : 'Not a String'}</C.Text>
          <C.Text style={{ color: colors, fontSize: 12 }}>{typeof i.item.message === 'string' ? i.item.message : 'Not a String'}</C.Text>
        </C.View>
      </C.Pressable>
    );
  };

  return (
    <C.Container style={{ backgroundColor: M.Colors.wildSand }}>
      <C.FlatList
        data={logs ? logs : []}
        keyExtractor={(item, index) => `Key(${index})`}
        ListHeaderComponent={RenderHeader}
        renderItem={RenderLog}
        refreshing={false}
        onRefresh={() => setLogs(window.globalThis.CustomLogs ? window.globalThis.CustomLogs : [])}
      />
      <C.Modal visible={modalContent !== undefined} onDismiss={() => setModalContent(undefined)}>
        <C.Container>
          <C.Header>
            <C.Button transparent onPress={() => setModalContent(undefined)}>
              <C.Text>Close Modal</C.Text>
            </C.Button>
          </C.Header>
          <C.Content>
            <C.JSONTree
              data={modalContent ? modalContent : {}}
              valueRenderer={(raw: string) => (
                <C.Pressable onPress={() => C.Alert.alert('Value', raw)} onLongPress={() => Clipboard.setString(raw)}>
                  <C.Text>{raw}</C.Text>
                </C.Pressable>
              )}
            />
          </C.Content>
          <C.Footer>
            <C.View style={{ margin: 10, flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
              <C.Button
                transparent
                onPress={() =>
                  C.Alert.alert(
                    'Notice',
                    'Please note that expanding extra data may crash the app, this is not a supported use case and should not be reported as an issue, use at your own risk...',
                  )
                }>
                <C.Text>Notice</C.Text>
              </C.Button>
            </C.View>
          </C.Footer>
        </C.Container>
      </C.Modal>
    </C.Container>
  );
};

const RenderHeader: React.FC = () => {
  const logSettings = H.NPM.redux.useSelector((s: iReduxState) => s.Dev);
  const dispatch = H.NPM.redux.useDispatch();
  const logs = H.NPM.redux.useSelector((s: iReduxState) => s.Dev.logs);
  const [settingsExpanded, setSettingsExpanded] = React.useState(false);
  const [setLoggingEnabledCache, delLoggingEnabledCache, getLoggingEnabledCache, allLoggingEnabledCache] = H.Misc.useAsyncStorage({
    class: 'Logging',
    categories: ['settings'],
  });

  React.useEffect(() => {
    const val = logSettings.loggingEnabled ? 'true' : 'false';
    setLoggingEnabledCache([{ key: 'isEnabled', value: val }]);
  }, [logSettings.loggingEnabled]);

  const handle_ToggleLogging = () => {
    dispatch(AllActions.Dev.toggleSettings({ setting: 'loggingEnabled' }));
  };

  return (
    <>
      <C.Text>Logs ({logs.length.toString()})</C.Text>

      <C.Button block transparent onPress={() => setSettingsExpanded(!settingsExpanded)}>
        <C.Text>{settingsExpanded ? 'Hide' : 'Show'} Settings</C.Text>
      </C.Button>

      <C.View style={{ height: settingsExpanded ? undefined : 0, display: settingsExpanded ? 'flex' : 'none' }}>
        <C.Button style={{ margin: 15 }} block onPress={handle_ToggleLogging}>
          <C.Text>{logSettings.loggingEnabled ? '[T] Disable' : '[F] Enable'} Logging</C.Text>
        </C.Button>

        <C.View style={{ width: '100%', height: 5, backgroundColor: 'grey' }} />

        <C.View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 5 }}>
          <C.Text>Debug to Toast</C.Text>
          <C.Switch value={logSettings.debugToToast} onValueChange={() => dispatch(AllActions.Dev.toggleSettings({ setting: 'debugToToast' }))} />
        </C.View>

        <C.View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 5 }}>
          <C.Text>Log to Toast</C.Text>
          <C.Switch value={logSettings.logToToast} onValueChange={() => dispatch(AllActions.Dev.toggleSettings({ setting: 'logToToast' }))} />
        </C.View>

        <C.View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 5 }}>
          <C.Text>Warn to Toast</C.Text>
          <C.Switch value={logSettings.warnToToast} onValueChange={() => dispatch(AllActions.Dev.toggleSettings({ setting: 'warnToToast' }))} />
        </C.View>

        <C.View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 5 }}>
          <C.Text>Error to Toast</C.Text>
          <C.Switch value={logSettings.errorToToast} onValueChange={() => dispatch(AllActions.Dev.toggleSettings({ setting: 'errorToToast' }))} />
        </C.View>

        <C.View style={{ width: '100%', height: 5, backgroundColor: 'grey' }} />

        <C.View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 5 }}>
          <C.Text>Debug to Console</C.Text>
          <C.Switch value={logSettings.debugToConsole} onValueChange={() => dispatch(AllActions.Dev.toggleSettings({ setting: 'debugToConsole' }))} />
        </C.View>

        <C.View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 5 }}>
          <C.Text>Log to Console</C.Text>
          <C.Switch value={logSettings.logToConsole} onValueChange={() => dispatch(AllActions.Dev.toggleSettings({ setting: 'logToConsole' }))} />
        </C.View>

        <C.View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 5 }}>
          <C.Text>Warn to Console</C.Text>
          <C.Switch value={logSettings.warnToConsole} onValueChange={() => dispatch(AllActions.Dev.toggleSettings({ setting: 'warnToConsole' }))} />
        </C.View>

        <C.View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 5 }}>
          <C.Text>Error to Console</C.Text>
          <C.Switch value={logSettings.errorToConsole} onValueChange={() => dispatch(AllActions.Dev.toggleSettings({ setting: 'errorToConsole' }))} />
        </C.View>

        <C.View style={{ width: '100%', height: 5, backgroundColor: 'grey' }} />
      </C.View>
    </>
  );
};
