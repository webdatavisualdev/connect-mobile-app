import * as React from 'react';
import * as Keychain from 'react-native-keychain';
import * as Cookies from '@react-native-community/cookies';

import Routes from '../Routes';

// : Components
import C from './../../Components';

// : Hooks
import H, { AllActions } from './../../Hooks';
import { StyleSheet } from 'react-native';

export interface iProps {}

export const Logout: React.FC = () => {
  const qCache = H.NPM.query.useQueryCache();

  const dispatch = H.NPM.redux.useDispatch();
  const nav = H.NPM.navigation.useNavigation();
  const Auth = H.Firebase.useAuth();
  const [set, del, get, staticAsyncStorage, AsyncStorage] = H.Misc.useAsyncStorage({ class: 'logout' });

  const [logList, setLogList] = React.useState<Array<string>>([]);

  React.useEffect(() => {
    cleanUp();
  }, []);

  const cleanUp = async () => {
    await disableSession();
    await deleteCookies();
    await deleteQueries();
    await deleteKeychainValues();
    await deleteAsyncStorage();
    await deleteFirebaseAccount();
    dispatch(AllActions.Auth.setPhase({ phase: 'loggedOut' }));

    setLog('Navigating to Login Screen');
    nav.reset({ index: 0, routes: [{ name: Routes.Start, params: { screen: Routes.auth } }] });
  };

  const disableSession = async () => {
    dispatch(AllActions.Auth.activeSession({ newValue: false }));
  };

  const deleteCookies = async () => {
    setLog('Clearing Cookies');
    Cookies.default.clearAll();
  };

  const deleteQueries = async () => {
    setLog('Clearing Query Data');
    qCache.clear(); // Clear the cache for all queries

    qCache.cancelQueries();
    qCache.removeQueries();
    qCache.removeQueries();
  };

  const deleteFirebaseAccount = async (count?: number) => {
    setLog(`Deleting Firebase Credentials (${count ? count : ''})`);
    if (count && count >= 10) {
      return;
    }
    if (Auth) {
      if (Auth.email) {
        await Auth.updateEmail(`DELETED.${Auth.email}`);
      }
      await Auth.updateProfile({ displayName: undefined });
      await Auth.delete();
    } else {
      await setTimeout(deleteAsyncStorage, 1000);
    }
  };

  const deleteAsyncStorage = async () => {
    setLog('Deleting Cached Values from local storage');
    const keys = await AsyncStorage.getAllKeys();
    keys.splice(
      keys.findIndex((key) => key === 'HasViewedWelcomeCards'),
      1,
    );
    await AsyncStorage.multiRemove(keys);
  };

  const deleteKeychainValues = async () => {
    setLog('Removing your token');
    await Keychain.resetGenericPassword({ service: 'usersPin' });
    await Keychain.resetGenericPassword({ service: 'secureAuthToken' });
  };

  const setLog = (value: string) => {
    setLogList([...logList, value]);
  };

  return (
    <C.SafeAreaView style={styles.container}>
      <C.View style={styles.content}>
        <C.View>
          {logList.map((value, index) => (
            <C.Text key={index}>{value}</C.Text>
          ))}
        </C.View>
        <C.View>
          <C.Spinner color="grey" />
        </C.View>
      </C.View>
    </C.SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
