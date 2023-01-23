import * as React from 'react';
import { Alert } from 'react-native';
import fcm, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

// : Hooks
import H from './../../Hooks';

import { useSingleton } from '../';

export interface iTopicsManager {
  subscribeToTopic: (topic: string) => Promise<void>;
  unsubscribeToTopic: (topic: string) => Promise<void>;
  isSubscribed: (topic: string) => boolean;
  allSubscribedTopics: () => { key: string; value: string }[];
  _sanitize: (value: string, prefix?: string, postfix?: string) => string;
}

export const useFirebaseCloudMessaging = (): [FirebaseMessagingTypes.Module, iTopicsManager] => {
  const [debug, log, warn, error, tags, titles, legacyLog] = H.Logs.useLog({ source: 'useFirebaseCloudMessaging.ts' });
  const messaging = useSingleton<FirebaseMessagingTypes.Module>(() => fcm(), 'FirebaseCloudMessaging');

  // ! Move these to another file
  const [setAsyncTopic, delAsyncTopic, allAsyncTopic, staticAsyncTopic] = H.Misc.useAsyncStorage({ class: 'FCM', categories: ['Topic'] });

  // : Request Permission to receive Push Notifications
  React.useEffect(() => {
    messaging.requestPermission().then((status) => {
      const enabled = status === (fcm.AuthorizationStatus.AUTHORIZED || fcm.AuthorizationStatus.PROVISIONAL);
      if (enabled) {
        log('Request Push Notifications Permission', 'Push Notifications Allowed by User', { id: '1631047401' });
      } else {
        log('Request Push Notifications Permission', 'Push Notifications Not Allowed by User', { id: '1631047420' });
      }
    });
  }, []);

  // : Declare Message Received while app is in Foreground Handler
  React.useEffect(() => {
    const unsubscribe = messaging.onMessage(async (remoteMessage) => {
      Alert.alert('FCM Message', JSON.stringify(remoteMessage, undefined, 2));
      debug('FCM Foreground Message', '', { id: '1631047520', extraData: remoteMessage });
    });

    // : Unmount Cleanup
    return unsubscribe;
  }, []);

  // : Declare Message Received while app is in Background or Not Running Handler
  React.useEffect(() => {
    const unsubscribe = messaging.setBackgroundMessageHandler(async (remoteMessage) => {
      Alert.alert('FCM Background Message', JSON.stringify(remoteMessage, undefined, 2));
      debug('FCM Background Message', '', { id: '1631047492', extraData: remoteMessage });
    });

    // : Unmount Cleanup
    return unsubscribe;
  }, []);

  const _logSubscription = (a: 'Subscribed' | 'Unsubscribed', topic: string) => {
    const shortA = a === 'Subscribed' ? 'Sub' : 'UnSub';
    log(`User ${a} To ${topic}`, '', { id: '1622220563', analytics: { name: `FCM_${shortA}_${topic}`, stripExtraData: true } });
  };

  const _sanitize = (value: string, prefix?: string, postfix?: string) => {
    let sanitized = value.replace(/ /g, '_');
    sanitized = sanitized.replace(/[^a-zA-Z0-9-_.~%]+/g, 'X');
    return `${prefix ? prefix + '_' : ''}${sanitized}${postfix ? '_' + postfix : ''}`;
  };

  const _WriteTopicMetaData = async (value: string | string[]) => {
    if (typeof value === 'string') {
      setAsyncTopic([{ key: value, value: value }]);
    } else {
      setAsyncTopic(value.map((v) => ({ key: v, value: v })));
    }
  };

  const _GetTopicMetaData = async (): Promise<{ key: string; value: string }[]> => {
    return staticAsyncTopic;
  };

  const subscribeToTopic = async (topic: string | string[]) => {
    // TODO Save topic to Async Storage for reference;
    // TODO Log/Analytics topic subscription;
    if (typeof topic === 'string') {
      _logSubscription('Subscribed', topic);
      await _WriteTopicMetaData(topic);
      messaging.subscribeToTopic(topic);
    } else {
      await _WriteTopicMetaData(topic);
      topic.forEach((t) => {
        _logSubscription('Subscribed', t);
        messaging.subscribeToTopic(t);
      });
    }
  };

  const unsubscribeToTopic = async (topic: string | string[]) => {
    // TODO Remove topic from Async Storage reference;
    // TODO Log/Analytics topic unsubscribe;
    if (typeof topic === 'string') {
      _logSubscription('Unsubscribed', topic);
      delAsyncTopic([topic]);
      messaging.unsubscribeFromTopic(topic);
    } else {
      // await AsyncStorage.multiRemove(topic.map((itm) => `FCM/Topic/${itm}`));
      delAsyncTopic(topic);
      topic.forEach((itm) => {
        _logSubscription('Unsubscribed', itm);
        messaging.unsubscribeFromTopic(itm);
      });
    }
  };

  const isSubscribed = (topic: string) => {
    return staticAsyncTopic.includes({ key: topic, value: topic });
  };

  const allSubscribedTopics = () => {
    return staticAsyncTopic;
  };

  const TopicsManager: iTopicsManager = {
    subscribeToTopic,
    unsubscribeToTopic,
    isSubscribed,
    allSubscribedTopics,
    _sanitize,
  };

  return [messaging, TopicsManager];
};
