import * as React from 'react';
import auth from '@react-native-firebase/auth';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import * as Device from 'react-native-device-info';

// : Hooks
import H, { Routes, AllActions, iReduxState } from './../../Hooks';

// : Components
import C from './../../Components';

export const useAuth = () => {
  const [debug, log, warn, error, tags, titles, legacyLog] = H.Logs.useLog({ source: 'useAuth.ts' });
  const activeSession = H.NPM.redux.useSelector((s: iReduxState) => s.Auth.activeSession);
  const authInstance = H.NPM.redux.useSelector((s: iReduxState) => s.Hooks.firebase.auth_instance);
  const nav = H.NPM.navigation.useNavigation();
  const dispatch = H.NPM.redux.useDispatch();
  const user = React.useRef<FirebaseAuthTypes.User | null>();
  const UserProfile = H.Queries.useQuery_UserProfile();

  React.useEffect(() => {
    if (authInstance === null) {
      log('Establishing Auth Instance', '(This should only be called once)', { id: '1631043889' });
      dispatch(AllActions.Hooks.firebase_auth_instance({ value: auth() }));
    }
  }, []);

  React.useEffect(() => {
    if (authInstance) {
      authInstance.signInAnonymously();
      authInstance.onAuthStateChanged(handle_onAuthStateChanged);
    }
  }, [authInstance]);

  const handle_onAuthStateChanged = (u: FirebaseAuthTypes.User | null) => {
    log('Logged in current user (Firebase Auth)', '', { id: '1631044009', extraData: u });
    user.current = u;
  };

  React.useEffect(() => {
    if (activeSession && UserProfile.isFetched) {
      authInstance?.currentUser
        ?.getIdTokenResult(true)
        .then(() => {
          try {
            authInstance?.currentUser?.updateEmail(`${Device.getUniqueId().substr(0, 6)}.${UserProfile.data?.Email}` || 'No.Email.In.SP.Profile');
            authInstance?.currentUser?.updateProfile({ displayName: UserProfile.data?.DisplayName });
          } catch (err) {
            error(`Caught Error while Updating Firebase Email/Profile`, `${err}`, { id: '1635175686', extraData: { error: err } });
          }
        })
        .catch((err) => {
          error('Firebase Account Disabled or Not Found', 'User needs to log in again', {
            id: '1631044202',
            tags: [tags.firebase],
            analytics: { name: 'Firebase_Account_Error', stripExtraData: true },
            extraData: { error: err },
          });
          C.Alert.alert('Error', 'Please Login again');
          nav.navigate(Routes.auth, { screen: Routes.authLogout });
        });
    }
  }, [activeSession, UserProfile.updatedAt]);

  return authInstance?.currentUser;
};
