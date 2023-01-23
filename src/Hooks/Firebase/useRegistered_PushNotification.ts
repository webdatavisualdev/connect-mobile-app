import * as React from 'react';
import fcm, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { iDeviceRegistration } from '../../Misc';
import DeviceInfo from 'react-native-device-info';
import { useSingleton } from '..';

export const useRegistered_PushNotification = () => {
  const messaging = useSingleton<FirebaseMessagingTypes.Module>(() => fcm(), 'FirebaseCloudMessaging');
  const [data, setData] = React.useState<iDeviceRegistration>();

  React.useEffect(() => {
    messaging.getToken().then((item) => {
      const subscription: iDeviceRegistration = {
        device: DeviceInfo.getDeviceNameSync(),
        fcmid: item,
        feed: true,
        peoplesoft: true,
        timeandattendance: true,
      };
      setData(subscription);
    });
  }, []);

  return data;
};
