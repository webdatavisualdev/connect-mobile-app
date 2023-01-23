// TODO Allow basic saving/retrieving data to firestore; typically under the users identifier
import * as React from 'react';
import firebaseFirestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

import { useUserProfileInFirestore, useSingleton } from '../';

export const useFirestore = () => {
  const firestore = useSingleton<FirebaseFirestoreTypes.Module>(() => firebaseFirestore(), 'FirebaseFirestore');

  // : Hook that manages User Data in Firestore
  useUserProfileInFirestore(firestore);

  return firestore;
};
