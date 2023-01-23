import * as React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import RNFS from 'react-native-fs';

import { useLog } from './';

/**
 * @param key : string that will be sanitized before use as a file name
 */
export interface iProps {
  key: string;
  keyPrefix?: string;
  value?: string;
  keepFileFormat?: boolean;
}

export interface iMetaData {
  /**
   * String Passed at Hook Mount
   */
  originalKey: string;
  sanitizedKey: string;
  cacheLastSet?: number;
  cacheLastRead?: number;
  fullFilePath: string;
  mountFinished: boolean;
}

export type iResponse = [string | undefined, () => Promise<string | undefined>, (val: string) => Promise<string>, iMetaData];

export const useFileCache = (props: iProps) => {
  const [debug, log, warn, error, tags, titles, legacyLog] = useLog({ source: 'useFileCache.ts' });
  const cacheDir = `${RNFS.DocumentDirectoryPath}/`;
  const sanitizedKeyPrefix = props.keyPrefix?.replace(/[^a-z0-9]/gi, '').toLowerCase();
  const sanitizedKey = `${sanitizedKeyPrefix}--${props.key.replace(/[^a-z0-9]/gi, '').toLowerCase()}`;

  const [cacheValue, setCacheValue] = React.useState<string | undefined>();
  const [metaDataState, setMetaDataState] = React.useState<iMetaData>({
    originalKey: props.key,
    sanitizedKey,
    fullFilePath: props.keepFileFormat ? `${cacheDir}/${sanitizedKey}.${props.key.split('.').slice(-1).pop()}` : `${cacheDir}/${sanitizedKey}.txt`,
    mountFinished: false,
  });

  React.useEffect(() => {
    getMetaData().then(() => {
      getCache().then((file) => {
        setCacheValue(file);
        setMetaDataState((prevState) => ({ ...prevState, mountFinished: true }));
      });
    });
  }, []);

  const setMetaData = async () => {
    try {
      await AsyncStorage.setItem(`useFileCache/${metaDataState.sanitizedKey}`, JSON.stringify(metaDataState));
      return 'success';
    } catch (err) {
      return 'Error while writing MetaData to async storage ' + err;
    }
  };

  const setCache = async (val: string): Promise<string> => {
    try {
      await RNFS.writeFile(`${cacheDir}/${sanitizedKey}.txt`, val, 'utf8');
      setMetaDataState((prevState) => ({ ...prevState, cacheLastSet: Date.now() }));
      await setMetaData();
      return 'success';
    } catch (err) {
      return 'Error while writing Cached File ' + err;
    }
  };

  const getMetaData = async () => {
    const metaDataValue = await AsyncStorage.getItem(sanitizedKey);
    if (metaDataValue) {
      try {
        const metaData = JSON.parse(metaDataValue);
        setMetaDataState((prevState) => ({ ...metaData }));
      } catch (err) {
        error('JSON Parse Error', 'err', { id: '1634830259' });
      }
    }
  };

  const getCache = async () => {
    try {
      const file = await RNFS.readFile(metaDataState.fullFilePath, 'utf8');
      setMetaDataState((prevState) => ({ ...prevState, cacheLastRead: Date.now() }));
      setCacheValue(file);
      return file;
    } catch {
      return undefined;
    }
  };

  return [cacheValue, getCache, setCache, metaDataState] as iResponse;
};
