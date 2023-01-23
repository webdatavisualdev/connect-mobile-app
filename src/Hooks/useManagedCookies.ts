import * as React from 'react';
import CookieManager, { Cookie } from '@react-native-community/cookies';

// : Hooks
import H, { useCrashlytics } from './../Hooks';

// : Components
import C from './../Components';

import { Platform } from 'react-native';

const domainCheck = (cookie: string) => {
  cookie = cookie.toLowerCase();
  if (cookie.indexOf('secure=true') > -1) {
    if (cookie.indexOf('domain=ahsonline.sharepoint.com') > -1) return true;
    if (cookie.indexOf('domain=.sharepoint.com') > -1) return true;
    if (cookie.indexOf('domain=login.adventhealth.com') > -1) return true;
    if (cookie.indexOf('domain=login.microsoft.com') > -1) return true;
    if (cookie.indexOf('domain=.login.microsoftonline.com') > -1) return true;
  }

  return false;
};

export const useManagedCookies = (activate: boolean) => {
  const [debug, log, warn, error, tags, titles, legacyLog] = H.Logs.useLog({ source: 'useManagedCookies.ts' });
  const crashlytics = useCrashlytics();
  const [status, setStatus] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (activate) {
      AsyncCookies(0);
    }
  }, [activate]);

  // : it appears cookies work out of the box with android, so not much needs to be done
  // : if ios, this grabs the cookies out of the WebKit Webview and serializes them for use in the fetch(s)
  const AsyncCookies = async (retries: number) => {
    if (Platform.OS === 'ios') {
      await CookieManager.clearAll();
      const cookies = await CookieManager.getAll(true);
      let AllSerializedCookies = Object.keys(cookies).map((cookieKey) => serializeCookie(cookies[cookieKey]));
      AllSerializedCookies = AllSerializedCookies.filter((cookie) => domainCheck(cookie));
      const wasOk = await FetchEstablishment(AllSerializedCookies, retries);
      if (wasOk) {
        debug('Cookies Established', '', { id: '1631043664' });
      } else {
        // : lets only show this Toast after several silent retries...
        if (retries > 3)
          C.Toast.show({
            text: `(${retries}) It looks like there was an error establishing your session, lets try that again.  We will retry up to about 10 times, then a different message will display.`,
            duration: 4000,
          });
        if (retries < 10) {
          setTimeout(() => {
            AsyncCookies(retries + 1);
          }, 5000);
        } else {
          crashlytics.log('Triggering Crashlytics at Managed Cookies (1635526094)');
          crashlytics.recordError(new Error('Manged Cookies failed more than 10 times'));
          C.Alert.alert(
            'Something Went Wrong',
            'There was an error while trying to establish your cookies and session with Sharepoint.  Please Re-Launch the application.  We are collecting logs so that we may try and resolve this issue.  Sorry for the inconvenience.',
          );
        }
      }
      setStatus(wasOk);
    } else {
      // Android, we don't rely on manually moving cookies from webview to NodeJS Engine
      const wasOk = await FetchEstablishment([]);
      wasOk ? debug('Cookies Established', '', { id: '1631043707' }) : error('Error establishing cookies', '', { id: '1631043710' });
      setStatus(wasOk);
    }
  };

  // : Accepts a cookie and returns the serialized string version of that cookie
  const serializeCookie = (c: Cookie) => {
    const extras = [];
    c.path ? extras.push(`path=${c.path}; `) : undefined;
    c.domain ? extras.push(`domain=${c.domain}; `) : undefined;
    c.version ? extras.push(`version=${c.version}; `) : undefined;
    c.expires ? extras.push(`expires=${c.expires}; `) : undefined;
    c.secure ? extras.push(`secure=${c.secure}; `) : undefined;
    c.httpOnly ? extras.push(`httpOnly=${c.httpOnly}; `) : undefined;
    const response = `${c.name}=${c.value}; ${extras.join('')}`;

    return response.substr(0, response.length - 2);
  };

  // : Fires off fetches with the serialized cookies, this way our "Session" has those cookies present
  // : Also this may result in the server establishing cookies on our fetch instance too
  const FetchEstablishment = async (AllSerializedCookies: any, retries: number = 0) => {
    const link = `https://ahsonline.sharepoint.com/application-lists/_api/`;
    const headers: RequestInit = {
      headers: {
        accept: 'application/json;odata=verbose',
        cookie: AllSerializedCookies.join('; '),
      },
      credentials: 'same-origin',
    };

    const response = await fetch(link, headers);
    let text = await response.text();
    let temp = AllSerializedCookies.map((itm: string) => {
      return itm.split(';');
    });

    if (response.ok) {
      log('ManagedCookies Fetch', `Ok: ${response.status}`, { id: '1631043761', extraData: { response, Cookies: temp, headers } });
    } else {
      error('ManagedCookies Fetch', `Not Ok: ${response.status} - ${text}`, { id: '1631043761', extraData: { response, Cookies: temp, headers } });
    }

    return response.ok;
  };

  return status;
};
