import * as React from 'react';

// : Hooks
import H, { Routes } from './../../../../Hooks';

// : Components
import C from './../../../../Components';

import { WebViewSourceUri } from 'react-native-webview/lib/WebViewTypes';

export const Dashboard: React.FC = () => {
  const [setAsyncCache, delAsyncCache, getAsyncCache, staticAsyncCache] = H.Misc.useAsyncStorage({ class: 'Dashboard', categories: [] });
  const DashboardKey = 'SelectedDash';
  const defaultDash = 'https://ahsonline.sharepoint.com/teams/CarversConcoctions/SitePages/Test-Landing-Dashboard.aspx?env=WebView';

  const nav = H.NPM.navigation.useNavigation();

  const [homeUrl, setHomeUrl] = React.useState('https://ahsonline.sharepoint.com/teams/CarversConcoctions/SitePages/Test-Landing-Dashboard.aspx?env=WebView');
  const [source, setSource] = React.useState<WebViewSourceUri>();

  const isFocused = H.Misc.useScreenMount(Routes.dashboard, {
    title: 'Dashboard',
    headerLeft: () => (
      <C.Pressable onPress={() => setSource({ uri: `${homeUrl}&cacheBuster=${Date.now()}` })}>
        <C.Ionicon style={{ fontSize: 24, color: 'white', marginLeft: 20 }} name="home-outline" />
      </C.Pressable>
    ),
    headerRight: () => (
      <C.Pressable onPress={() => nav.navigate(Routes.dashboardSelect)}>
        <C.Ionicon style={{ fontSize: 24, color: 'white', marginRight: 20 }} name="albums-outline" />
      </C.Pressable>
    ),
  });

  React.useEffect(() => {
    getAsyncCache([DashboardKey]).then((asyncVals) => {
      const storedValue = asyncVals[0][1];
      if (storedValue) {
        setHomeUrl(storedValue);
        setSource({ uri: storedValue });
      } else {
        setAsyncCache([{ key: DashboardKey, value: defaultDash }]);
        setHomeUrl(defaultDash);
        setSource({ uri: defaultDash });
      }
    });
  }, [isFocused]);

  const javascript = `document.getElementsByClassName('webPartContainer')[0].style.display = 'none'`;

  if (source === undefined) return <C.Spinner color="grey" />;
  return (
    <C.WebView
      pullToRefreshEnabled={true}
      style={{ flex: 1, height: '100%' }}
      source={{ uri: source.uri.indexOf('?') === -1 ? `${source.uri}?env=WebView` : `${source.uri}&env=WebView` }}
      injectedJavaScript={javascript}
      onMessage={() => {}}
    />
  );
};
