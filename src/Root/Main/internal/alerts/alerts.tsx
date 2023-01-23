import * as React from 'react';
import moment from 'moment';
import { WebViewSource } from 'react-native-webview/lib/WebViewTypes';

// : Hooks
import H, { Routes, iReduxState } from './../../../../Hooks';

// : Components
import C from './../../../../Components';

// : Misc
import M, { iAlertApp } from './../../../../Misc';
import { RefreshControl, StyleSheet } from 'react-native';

export const Alerts: React.FC = () => {
  const [debug, log, warn, error, tags, titles, legacyLog] = H.Logs.useLog({ source: 'alerts.tsx' });
  const logPress = H.Logs.useLog_userPress({ source: 'alerts.tsx' });
  const logPullToRefresh = H.Logs.useLog_PullToRefresh({ source: 'alerts.tsx' });
  const nav = H.NPM.navigation.useNavigation();
  const VisualDebugging = H.NPM.redux.useSelector((s: iReduxState) => s.Dev.visualDebugging);
  const hasSession = H.NPM.redux.useSelector((s: iReduxState) => s.Auth.activeSession);
  const AlertApps = H.Queries.useQuery_AlertApps();
  const UserAlerts = H.Queries.useQuery_AlertUserData();
  const [AlertAppsParsed, setAlertAppsParsed] = React.useState<iAlertApp[]>([]);

  const [webViewSource, setWebViewSource] = React.useState<WebViewSource>({ html: '<html><body><h1>Awaiting Session</h1></body></html>' });
  const [requestRefresh, setRequestRefresh] = React.useState(false);
  const [firstTime, setFirstTime] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [_setAsyncCache, _delAsyncCache, _getAsyncCache, allAsyncCache] = H.Misc.useAsyncStorage({ class: 'Alert', categories: ['AlertSetting'] });
  const RegisteredPushNotification = H.Queries.useQuery_Registered_PushNotification();
  const registeredPNFirebase = H.Firebase.useRegistered_PushNotification();
  const alertSetting = H.NPM.redux.useSelector((s: iReduxState) => s.Main.alertSetting);

  React.useEffect(() => {
    if (requestRefresh || UserAlerts.isFetching) setRefreshing(true);
    if (requestRefresh === false && UserAlerts.isFetching === false) setRefreshing(false);
  }, [requestRefresh, UserAlerts.isFetching]);

  React.useEffect(() => {
    if ((hasSession && requestRefresh) || (hasSession && firstTime)) {
      setWebViewSource({ uri: `https://ahsonline.sharepoint.com/application-lists/Pages/MobileAlerts.aspx?${Date.now()}` });
    }
  }, [hasSession, requestRefresh]);

  React.useEffect(() => {
    if (AlertApps.data) {
      let temp = AlertApps.data;
      temp = parse_FilterInLink(temp);
      temp = parse_SortData(temp);

      if (RegisteredPushNotification.data) {
        let data = RegisteredPushNotification.data;
        if (data.length > 0) {
          try {
            var serverSub = JSON.parse(data[0].Subscription as any);
            const serverDeviceSettings = serverSub.find((x: any) => x.fcmid === registeredPNFirebase?.fcmid);
            if (serverDeviceSettings) {
              temp.map((x: iAlertApp) => {
                const value = (serverDeviceSettings as any)[toFieldName(x.Name)];
                x.IsActive = value === false ? false : true;
                return x;
              });
            }
          } catch (err) {
            error('There was an error while parsing the Registered Push Notifications data', `${err}`, { id: '1634830967' });
          }
        }
      }

      if (alertSetting.length > 0 && JSON.stringify(temp) !== JSON.stringify(alertSetting)) {
        temp = alertSetting;
      }
      temp = parse_FilterInActive(temp);
      setAlertAppsParsed(temp);
    } else {
      setAlertAppsParsed([]);
    }
  }, [AlertApps.data, RegisteredPushNotification.data, registeredPNFirebase, alertSetting]);

  const parse_FilterInLink = (data: iAlertApp[]) => {
    data = data.filter((i) => i.Link);
    return data;
  };

  const parse_FilterInActive = (data: iAlertApp[]) => {
    data = data.filter((i) => i.IsActive);
    return data;
  };

  const parse_SortData = (data: iAlertApp[]) => {
    data = data.sort((a, b) => a.DisplayOrder - b.DisplayOrder);
    return data;
  };

  const handle_onPress = (link: string, title: string) => {
    logPress(`Alerts Item Opened - ${link}`, '1615832669', 'btn', [tags.navigate]);
    nav.navigate(Routes.webview, { url: link, title });
  };

  const handle_onLoadEnd = () => {
    if (hasSession) {
      if (requestRefresh) {
        setRequestRefresh(false);
        UserAlerts.refetch();
      }

      if (firstTime) {
        setFirstTime(false);
        UserAlerts.refetch();
      }
    }
  };

  const ApprovalsCount = (props: { title: string }) => {
    if (UserAlerts.isLoading) return <C.Spinner color="grey" size="small" style={{ height: 0 }} />;

    const userAlertValues: { [key: string]: string } = {};
    UserAlerts.data?.MyAlerts.forEach((i) => (userAlertValues[i.title] = i.totalCount));

    const safeValue = userAlertValues[props.title] ? userAlertValues[props.title] : '0';

    return (
      <>
        <C.Text style={[styles.SafeValueText, { color: UserAlerts.isStale ? '#FAA41A' : 'black' }]}>{safeValue}</C.Text>
      </>
    );
  };

  React.useEffect(() => {
    try {
      let alerts: iAlertApp[] = [];
      if (allAsyncCache.length !== 0) {
        alerts = JSON.parse(allAsyncCache[allAsyncCache.length - 1].value);
      }
      alerts = parse_FilterInActive(alerts);
      setAlertAppsParsed(alerts);
    } catch (err) {
      error('Error parsing Alerts Async Cache data', `${err}`, { id: '1634831046' });
    }
  }, [allAsyncCache]);

  function toFieldName(name: string) {
    return name ? name.replace(/\s/g, '').toLowerCase() : '';
  }

  React.useEffect(() => {
    nav.setOptions({
      headerLeft: renderSettingsCog,
    });
  }, []);

  const renderSettingsCog = () => {
    return (
      <>
        <C.Pressable
          onPress={() => {
            nav.navigate(Routes.alertsSettings);
          }}>
          <C.Icon style={{ padding: 10, paddingLeft: 20, color: M.Colors.white, fontSize: 16 }} name="cog" type="FontAwesome5" />
        </C.Pressable>
      </>
    );
  };

  const RenderStaleWarning = UserAlerts.isStale ? (
    <C.View style={styles.StaleWarningContainer}>
      <C.Text style={styles.StaleWarningText}>
        The above values may not be accurate until your profile fully loads. These values will update when you are fully logged in, or you can pull down to
        refresh
      </C.Text>
    </C.View>
  ) : (
    <></>
  );

  const RenderItem = (props: iAlertApp) => (
    <C.Pressable onPress={() => handle_onPress(props.Link, props.Title)}>
      <C.Card transparent>
        <C.CardItem style={styles.ListItem}>
          <C.View style={styles.ApprovalsWrap}>
            <ApprovalsCount title={props.Title} />
          </C.View>
          <C.View style={styles.NameWrap}>
            <C.Text style={styles.NameText}>{props.Name}</C.Text>
          </C.View>
          <C.Icon name="chevron-forward-outline" />
        </C.CardItem>
      </C.Card>
    </C.Pressable>
  );

  const handle_Refresh = () => {
    logPullToRefresh('User Alerts', '1617207469');
    setRefreshing(true);
    setRequestRefresh(true);
  };

  return (
    <C.Container style={styles.Container}>
      <C.FlatList
        contentContainerStyle={styles.FlatListStyle}
        refreshControl={<RefreshControl tintColor={''} onRefresh={handle_Refresh} refreshing={refreshing} />}
        renderItem={(itm) => <RenderItem {...itm.item} />}
        keyExtractor={(itm) => `${itm.Id}`}
        data={AlertAppsParsed}
        ListHeaderComponent={() => (
          <>
            <C.WebView style={{ height: VisualDebugging ? 500 : 0 }} onLoadEnd={handle_onLoadEnd} originWhitelist={['*']} source={webViewSource} />
          </>
        )}
        ListFooterComponent={() => (
          <>
            <C.View style={styles.LastRefreshedWrap}>
              <C.Text style={styles.LastRefreshText}>Last Refreshed : {moment(UserAlerts.data?.Modified).format('ddd M/DD/YY hh:mm:ss a')}</C.Text>
            </C.View>
            {RenderStaleWarning}
            {VisualDebugging ? (
              <>
                <C.Text>Raw Data</C.Text>
                <C.JSONTree data={AlertApps.data} />
                <C.Text>Parsed Data</C.Text>
                <C.JSONTree data={AlertAppsParsed} />
                <C.Text>Users Alert Data</C.Text>
                <C.JSONTree data={UserAlerts.data} />
              </>
            ) : (
              <></>
            )}
          </>
        )}
      />
    </C.Container>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: M.Colors.wildSand,
  },
  FlatListStyle: {
    paddingTop: 5,
    paddingHorizontal: 10,
  },
  LastRefreshedWrap: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
  },
  LastRefreshText: {
    color: 'grey',
    alignSelf: 'center',
    fontSize: 14,
  },
  ListItem: {
    marginBottom: 7,
    backgroundColor: M.Colors.white,
    borderRadius: 5,
    shadowColor: M.Colors.black,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 10,
    paddingBottom: 10,
    justifyContent: 'space-between',
  },
  NameWrap: {
    flex: 1,
    width: 250,
  },
  NameText: {
    fontSize: 16,
  },
  ApprovalsWrap: {
    marginLeft: 20,
    marginRight: 10,
  },
  SafeValueText: {
    fontSize: 16,
  },
  StaleWarningContainer: {
    marginVertical: 15,
    padding: 15,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FAA41A',
    borderRadius: 5,
  },
  StaleWarningText: {
    color: 'white',
    textAlign: 'center',
  },
});
