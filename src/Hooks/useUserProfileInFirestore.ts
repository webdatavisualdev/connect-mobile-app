import * as React from 'react';
import deviceInfoModule from 'react-native-device-info';
import { Platform } from 'react-native';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

import { useAuth, useQuery_UserProfile, useLog, useDispatch, useSelector, AllActions, iReduxState } from './';

export const useUserProfileInFirestore = (firestore: FirebaseFirestoreTypes.Module) => {
  const [debug, log, warn, error, tags, titles, legacyLog] = useLog({ source: 'useUserPRofileInFirestore.ts' });
  const DevMenuEnabled = useSelector((s: iReduxState) => s.Dev.DevMenuEnabled);
  const dispatch = useDispatch();
  const firebaseAuth = useAuth();
  const profile = useQuery_UserProfile();

  const RegisterUniqueDevice = () => {
    if (profile.data) {
      const UsersCollection = firestore.collection('users');
      const UserDoc = UsersCollection.doc(profile.data.Properties.UserName);
      const DeviceDoc = UserDoc.collection('devices').doc(deviceInfoModule.getUniqueId());

      DeviceDoc.set(
        {
          FirebaseAuthID: `${firebaseAuth?.uid}`,
          AppVersion: `${deviceInfoModule.getVersion()} (${deviceInfoModule.getBuildNumber()})`,
          DeviceName: deviceInfoModule.getDeviceNameSync(),
          Platform: Platform.OS,
        },
        { merge: true },
      );
    }
  };

  // : First Time setup and Updated of Anon User
  React.useEffect(() => {
    if (firebaseAuth?.uid) {
      const d = new Date(Date.now());
      const collection = firestore.collection('usersAnonymous');
      const doc = collection.doc(firebaseAuth.uid);

      doc.get().then((snapshot) => {
        if (snapshot.exists) {
          doc.set(
            {
              LastLogin: d.toString(),
              LastKnownAppVersion: `${deviceInfoModule.getVersion()} (${deviceInfoModule.getBuildNumber()})`,
              LastKnownDeviceId: deviceInfoModule.getDeviceId(),
              LastKnownDeviceName: deviceInfoModule.getDeviceNameSync(),
              LastKnownUniqueID: deviceInfoModule.getUniqueId(),
              LastKnownIsSimulator: deviceInfoModule.isEmulatorSync(),
              LastKnownPlatform: Platform.OS,
            },
            { merge: true },
          );
        } else {
          doc.set(
            {
              DevEnabled: false,
              LastLogin: d.toString(),
              LastKnownAppVersion: `${deviceInfoModule.getVersion()} (${deviceInfoModule.getBuildNumber()})`,
              LastKnownDeviceId: deviceInfoModule.getDeviceId(),
              LastKnownDeviceName: deviceInfoModule.getDeviceNameSync(),
              LastKnownUniqueID: deviceInfoModule.getUniqueId(),
              LastKnownIsSimulator: deviceInfoModule.isEmulatorSync(),
              LastKnownPlatform: Platform.OS,
            },
            { merge: true },
          );
        }
      });
    }
  }, [firebaseAuth?.uid]);

  // : First time Setup and Update of logged in User
  React.useEffect(() => {
    if (profile.data?.DisplayName) {
      const d = new Date(Date.now());
      const GUID = profile.data.Properties.UserProfile_GUID;
      const collection = firestore.collection('users');
      const doc = collection.doc(profile.data.Properties.UserName);

      doc.get().then((snapshot) => {
        if (snapshot.exists) {
          doc.set(
            {
              LastLogin: d.toString(),
              LastKnownAppVersion: `${deviceInfoModule.getVersion()} (${deviceInfoModule.getBuildNumber()})`,
              LastKnownDeviceId: deviceInfoModule.getDeviceId(),
              LastKnownDeviceName: deviceInfoModule.getDeviceNameSync(),
              LastKnownUniqueID: deviceInfoModule.getUniqueId(),
              LastKnownIsSimulator: deviceInfoModule.isEmulatorSync(),
              LastKnownPlatform: Platform.OS,
              SharepointUUID: GUID,
            },
            { merge: true },
          );
        } else {
          doc.set(
            {
              LastLogin: d.toString(),
              LastKnownAppVersion: `${deviceInfoModule.getVersion()} (${deviceInfoModule.getBuildNumber()})`,
              LastKnownDeviceId: deviceInfoModule.getDeviceId(),
              LastKnownDeviceName: deviceInfoModule.getDeviceNameSync(),
              LastKnownUniqueID: deviceInfoModule.getUniqueId(),
              LastKnownIsSimulator: deviceInfoModule.isEmulatorSync(),
              LastKnownPlatform: Platform.OS,
              SharepointUUID: GUID,
              DevEnabled: false,
            },
            { merge: true },
          );
        }
      });
      RegisterUniqueDevice();
    }
  }, [profile.data?.DisplayName]);

  // : Snapshot Listener Effect for when something in the AnonUser Profile Changes
  React.useEffect(() => {
    let maybeDestroyAnonUserSnapshot: undefined | (() => void) = undefined;

    if (firebaseAuth?.uid) {
      const AnonUsersCollection = firestore.collection('usersAnonymous');
      const AnonUserDoc = AnonUsersCollection.doc(firebaseAuth.uid);

      maybeDestroyAnonUserSnapshot = AnonUserDoc.onSnapshot((snapshot) => {
        let data = snapshot.data();
        if (data) {
          // console.log('Firestore Snapshot (AnonUser) Update:', data);
          if (data.DevEnabled && DevMenuEnabled) {
            log('Receiving Changes to Firebase User Profile', `DevMenuEnabled : ${data.DevEnabled}`, { id: '1635274159', extraData: data });
            dispatch(AllActions.Dev.enableDevMenu({ newSetting: true }));
          }
          if (!data.DevEnabled && DevMenuEnabled) {
            log('Receiving Changes to Firebase User Profile', `DevMenuEnabled : ${data.DevEnabled}`, { id: '1635288631', extraData: data });
            dispatch(AllActions.Dev.enableDevMenu({ newSetting: false }));
          }
        }
      });
    }

    return () => {
      if (maybeDestroyAnonUserSnapshot) {
        maybeDestroyAnonUserSnapshot();
      }
    };
  }, [firebaseAuth?.uid]);

  // : Snapshot Listener Effect for when something in the User Profile Changes
  React.useEffect(() => {
    let maybeDestroyUserSnapshot: undefined | (() => void) = undefined;

    if (profile.data?.Properties.UserName) {
      const UsersCollection = firestore.collection('users');
      const UserDoc = UsersCollection.doc(profile.data.Properties.UserName);
      maybeDestroyUserSnapshot = UserDoc.onSnapshot((snapshot) => {
        let data = snapshot.data();
        if (data) {
          // console.log('Firestore Snapshot (User(' + profile.data?.Properties.UserName + ')) Update:', data);
          if (data.DevEnabled && DevMenuEnabled) {
            log('Receiving Changes to Firebase User Profile', `DevMenuEnabled : ${data.DevEnabled}`, { id: '1635274159', extraData: data });
            dispatch(AllActions.Dev.enableDevMenu({ newSetting: true }));
          }
          if (!data.DevEnabled && DevMenuEnabled) {
            log('Receiving Changes to Firebase User Profile', `DevMenuEnabled : ${data.DevEnabled}`, { id: '1635288631', extraData: data });
            dispatch(AllActions.Dev.enableDevMenu({ newSetting: false }));
          }
        }
      });
    }

    return () => {
      if (maybeDestroyUserSnapshot) {
        maybeDestroyUserSnapshot();
      }
    };
  }, [firebaseAuth?.uid, profile.data?.Properties.UserName]);
};
