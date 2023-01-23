import * as React from 'react';
import AsyncStorage from '@react-native-community/async-storage';

export interface iProps {
  class: string;
  categories?: string[];
}

export const useAsyncStorage = (props: iProps) => {
  const [staticAsyncStorage, setStaticAsyncStorage] = React.useState<{ key: string; value: string }[]>([]);

  React.useEffect(() => {
    updateState();
  }, []);

  // : Sets the state with the scoped values of AsyncStorage
  const updateState = async () => {
    const allKeys = await AsyncStorage.getAllKeys();
    const filteredKeys = allKeys.filter((itm) => itm.startsWith(`${props.class}/`));
    const pairs = await Promise.all(
      filteredKeys.map(async (key) => {
        const value = (await AsyncStorage.getItem(key)) as string;
        return { key, value };
      }),
    );
    setStaticAsyncStorage(pairs);
  };

  const deleteAllScopedKeys = async () => {
    await updateState();
    let allKeys: string[] = [];
    staticAsyncStorage.forEach((i) => allKeys.push(i.key));
    await AsyncStorage.multiRemove(allKeys);
  };

  const del = (keys?: string[]) => {
    if (keys) {
      AsyncStorage.multiRemove(keys);
    } else {
      deleteAllScopedKeys();
    }
  };

  const set = (i: { key: string; value: string }[]) => {
    i.forEach((itm) => {
      AsyncStorage.setItem(`${props.class}/${props.categories?.join('/')}/${itm.key}`, itm.value);
    });
    updateState();
  };

  const get = async (keys: string[]) => {
    keys = keys.map((key) => `${props.class}/${props.categories?.join('/')}/${key}`);
    const val = await AsyncStorage.multiGet(keys);
    return val;
  };

  return [set, del, get, staticAsyncStorage, AsyncStorage] as const;
};

