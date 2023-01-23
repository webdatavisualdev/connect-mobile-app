import * as React from 'react';

// : Hooks
import H, { AllActions, iReduxState } from './../../Hooks';

// : Components
import C from './../../Components';

import { WebViewSource, WebViewNavigationEvent, WebViewErrorEvent } from 'react-native-webview/lib/WebViewTypes';

import { useSelector, useDispatch } from 'react-redux';
import htmlDoc from './hiddenAuthEngineStartingHTML';

export const HiddenAuthEngine = () => {
  const [debug, log, warn, error, tags, titles, legacyLog] = H.Logs.useLog({ source: 'hiddenAuthEngine.tsx' });
  const dispatch = useDispatch();
  const tokenObj = useSelector((s: iReduxState) => s.Auth.tokens);
  const phase = useSelector((s: iReduxState) => s.Auth.phase);
  const [startCookies, setStartCookies] = React.useState(false);
  const CookiesStatus = H.Misc.useManagedCookies(startCookies);
  const [initWebView, setInitWebView] = React.useState<WebViewSource>();

  React.useEffect(() => {
    if (phase === 'loggedIn' || phase === 'configure') {
      const RemoteConfigURI =
        'https://login.adventhealth.com/AHConnectJWTLogin/JwtConsumerService.aspx?response_type=token&client_id=1c4c6885c29e4b65ba91fb1c02dbfc98&redirect_uri=https://login.adventhealth.com/arc_mobile.html&scope=OAuth&nonce=ARDS';
      setInitWebView({ html: htmlDoc(RemoteConfigURI, tokenObj?.access_token as string) });
    }
    if (phase === 'loggedOut') {
      setStartCookies(false);
    }
  }, [phase]);

  React.useEffect(() => {
    if (CookiesStatus === true && startCookies === true) {
      log('AuthEngine Progress', 'Done, now setting session var', { id: '1629844316' });
      dispatch(AllActions.Auth.activeSession({ newValue: true }));
    }
  }, [CookiesStatus, startCookies]);

  const handle_loadEnd = (e: WebViewNavigationEvent | WebViewErrorEvent) => {
    const title = e.nativeEvent.title;
    const loading = e.nativeEvent.loading;
    const url = e.nativeEvent.url;
    log('AuthEngine Progress', `WebView Progress: ${title}`, { id: '1629839490', extraData: url });
    if (title === 'News Feed' && loading === false) {
      setStartCookies(true);
    }
  };

  return (
    <>
      <C.WebView mediaPlaybackRequiresUserAction={true} source={initWebView} onLoadEnd={handle_loadEnd} />
    </>
  );
};
