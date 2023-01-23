import AsyncStorage from '@react-native-community/async-storage';

export const helper_ClearAsyncStorage = async () => {
  const allKeys = await AsyncStorage.getAllKeys();
  AsyncStorage.multiRemove(allKeys);
};
