import * as React from 'react';
import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';

// : Hooks
import { iReduxState, useSelector } from './../Hooks';

export const useImageFileCache = (url: string) => {
  if (url === '' || url === undefined) url = 'https://picsum.photos/id/1025/500/500.jpg';
  const activeSession = useSelector((s: iReduxState) => s.Auth.activeSession);
  const cacheDir = `${RNFS.DocumentDirectoryPath}`;
  const sanitizedKeyPrefix = 'ImageFileCache--'.replace(/[^a-z0-9]/gi, '');
  const sanitizedKey = `${sanitizedKeyPrefix}--${url.replace(/[^a-z0-9]/gi, '').toLowerCase()}`;
  let FileExtension = url.split('.').slice(-1).pop();
  FileExtension = FileExtension?.split('?')[0];

  const [shouldDownload, setShouldDownload] = React.useState(true);
  const [shouldWaitForSession, setShouldWaitForSession] = React.useState(false);
  const [PhaseOneDone, setPhaseOneDone] = React.useState(false);
  const [localFile, setLocalFile] = React.useState<string>(`file://${cacheDir}/${sanitizedKey}.${FileExtension}`);

  const [status, setStatus] = React.useState<'inProgress' | 'error' | 'done'>('inProgress');

  // PHASE 1
  React.useEffect(() => {
    RNFS.exists(localFile).then((CacheExists) => {
      if (CacheExists) {
        setStatus('done');
      } else {
        if (determineWaitForAuth()) {
          setShouldWaitForSession(true);
        }
        setShouldDownload(true);
        setPhaseOneDone(true);
      }
    });
  }, []);

  // PHASE 2
  React.useEffect(() => {
    if (PhaseOneDone) {
      if (shouldWaitForSession && activeSession) {
        DownloadAndSaveImage();
      }

      if (!shouldWaitForSession) {
        DownloadAndSaveImage();
      }
    }
  }, [shouldDownload, shouldWaitForSession, PhaseOneDone]);

  const DownloadAndSaveImage = async () => {
    if (Platform.OS === 'ios') {
      const download = RNFS.downloadFile({ fromUrl: url, toFile: localFile });
      const resolution = await download.promise;
      if (resolution.statusCode > 199 && resolution.statusCode < 300) {
        setStatus('done');
      } else {
        setStatus('error');
      }
    }

    if (Platform.OS === 'android') {
      let blob = await RNFetchBlob.fetch('GET', url);
      let blobVal = await blob.base64();
      await RNFS.writeFile(localFile, blobVal, { encoding: 'base64' });
      if (blob.respInfo.status > 199 && blob.respInfo.status < 300) {
        setStatus('done');
      } else {
        setStatus('error');
      }
    }
  };

  const determineWaitForAuth = (): boolean => {
    if (url) {
      if (url.indexOf('ahsonline.sharepoint.com') > -1) return true;
    }
    return false;
  };

  return [localFile, status] as const;
};
