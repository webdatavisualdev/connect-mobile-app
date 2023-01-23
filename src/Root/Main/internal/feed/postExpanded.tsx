import * as React from 'react';
import { InteractionManager } from 'react-native';
import { WebViewMessageEvent, WebViewNavigation } from 'react-native-webview';
import { WebViewSource } from 'react-native-webview/lib/WebViewTypes';

// : Hooks
import H, { Routes, AllActions, iReduxState } from './../../../../Hooks';

// : Components
import C from './../../../../Components';

// : Misc
import M, { iArticle, iEvent } from './../../../../Misc';

export interface iParams {
  data: iArticle | iEvent;
}

export const PostExpanded: React.FC = () => {
  const [debug, log, warn, error, tags] = H.Logs.useLog({ source: 'postExpanded.tsx' });
  const logPress = H.Logs.useLog_userPress({ source: 'postExpanded.tsx' });
  const nav = H.NPM.navigation.useNavigation();
  const Route = H.NPM.navigation.useRoute();
  const params = Route.params as iParams;
  const [webviewHeight, setWebviewHeight] = React.useState(100);
  const [navOptions, setNavOptions] = React.useState({});
  const [renderPlaceHolder, setRenderPlaceHolder] = React.useState(true);
  const [webViewSource, setWebViewSource] = React.useState<WebViewSource>({
    html: `
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
    <style>
      html {
        font-family: 'Montserrat', sans-serif;
      }
    </style>

    <html style="margin: 0; padding: 0;">
      <body style="">
        <div id="content">
          ${params.data.PopupContent}
        </div>
      <script>
          var height = document.getElementsByTagName('html')[0].clientHeight.toString();
          window.ReactNativeWebView.postMessage(height);
      </script>
      </body>
    </html>
  `,
  });

  React.useEffect(() => {
    setNavOptions({
      title: params.data.Title,
    });
  }, []);

  React.useEffect(() => {
    const CancelIM = InteractionManager.runAfterInteractions(() => {
      log('Interactions Manager', 'RunAfterInteractions', { id: '1635398854', special: true });
      setRenderPlaceHolder(false);
    });
    return () => {
      CancelIM.cancel();
    };
  }, []);

  const handle_Message = (msg: WebViewMessageEvent) => {
    try {
      const val = parseInt(msg.nativeEvent.data, 10);
      setWebviewHeight(val);
    } catch (err) {}
  };

  const handle_NavigationStateChange = (data: WebViewNavigation) => {
    if (data.url !== 'about:blank') {
      logPress('Post Expanded Content Link', '1612799734', 'link', [tags.navigate, tags.network]);
      nav.navigate(Routes.webview, { url: data.url, title: data.title });
    }

    if (data.url === 'about:blank') {
      return true;
    }
    return false;
  };

  const Footer = React.useMemo(() => {
    return (
      <>
        <C.Card style={{ marginVertical: 15, margin: 15, borderRadius: 5, overflow: 'hidden' }}>
          <C.View>
            <C.WebView
              scrollEnabled={false}
              style={{ minHeight: webviewHeight + 60 }}
              onMessage={handle_Message}
              onShouldStartLoadWithRequest={handle_NavigationStateChange}
              source={webViewSource}
            />
          </C.View>
        </C.Card>
      </>
    );
  }, [webviewHeight, webViewSource, renderPlaceHolder]);

  if (renderPlaceHolder) {
    return <C.Container style={{ backgroundColor: '#f6f6f6' }}></C.Container>;
  }

  return (
    <C.Container style={{ backgroundColor: '#f6f6f6' }}>
      <C.FlatList
        contentContainerStyle={{ padding: 15 }}
        data={[params.data]}
        keyExtractor={(itm) => itm.ID + itm.Title}
        renderItem={(itm) => <C.FeedCard feed={itm} hideButton />}
        ListFooterComponent={Footer}
      />
    </C.Container>
  );
};
