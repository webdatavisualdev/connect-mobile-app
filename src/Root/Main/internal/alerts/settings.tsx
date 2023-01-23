import React from 'react';
import { StyleSheet } from 'react-native';
import H, { AllActions, iReduxState } from './../../../../Hooks';
import C from './../../../../Components';
import M from './../../../../Misc';
import { iAlertApp, iSharepointValues, iDeviceRegistration } from './../../../../Misc';

export const Settings: React.FC = () => {
  const [debug, log, warn, logError, tags, titles, legacyLog] = H.Logs.useLog({ source: 'alerts/settings.tsx' });
  const AlertApps = H.Queries.useQuery_AlertApps();
  const [setAsyncCache, delAsyncCache, _getAsyncCache, allAsyncCache] = H.Misc.useAsyncStorage({ class: 'Alert', categories: ['AlertSetting'] });
  const [alerts, setAlerts] = React.useState<iAlertApp[]>([]);
  const [AlertSettingsMutation, { status, data, error, isLoading }] = H.Queries.useMutation_AlertSetting();
  const registeredPNFirebase = H.Firebase.useRegistered_PushNotification();
  const RegisteredPushNotification = H.Queries.useQuery_Registered_PushNotification();
  const [registeredPNApp, setRegisteredPN] = React.useState<iSharepointValues[]>([]);
  const dispatch = H.NPM.redux.useDispatch();
  const [submitting, setSubmitting] = React.useState(false);
  const alertSetting = H.NPM.redux.useSelector((s: iReduxState) => s.Main.alertSetting);

  React.useEffect(() => {
    if (AlertApps.data) {
      let alertsData = AlertApps.data;
      alertsData = parse_FilterInLink(alertsData);
      alertsData = parse_SortData(alertsData);

      if (RegisteredPushNotification.data) {
        let data = RegisteredPushNotification.data;
        if (data.length > 0) {
          try {
            setRegisteredPN(data);
            var serverSub = JSON.parse(data[0].Subscription as any);
            const serverDeviceSettings = serverSub.find((x: any) => x.fcmid === registeredPNFirebase?.fcmid);
            if (serverDeviceSettings) {
              alertsData.map((x: iAlertApp) => {
                const value = (serverDeviceSettings as any)[toFieldName(x.Name)];
                x.IsActive = value === false ? false : true;
                return x;
              });
            }
          } catch (err) {
            logError('Error while parsing alerts subscription data', `${err}`, { id: '1634831223' });
          }
        }
      }

      if (alertSetting.length > 0 && JSON.stringify(alertsData) !== JSON.stringify(alertSetting)) {
        alertsData = alertSetting;
      }

      if (alertsData.length !== 0) {
        setAlerts(alertsData);
      }
      setAsyncCache([{ key: 'alertsetting', value: JSON.stringify(alertsData) || '' }]);
    }
  }, [AlertApps.data, RegisteredPushNotification.data, registeredPNFirebase]);

  const parse_FilterInLink = (data: iAlertApp[]) => {
    data = data.filter((i) => i.Link);
    return data;
  };

  const parse_SortData = (data: iAlertApp[]) => {
    data = data.sort((a, b) => a.DisplayOrder - b.DisplayOrder);
    return data;
  };

  const onChangeItem = async (name: string) => {
    setSubmitting(true);
    const newAlertSetting = alerts;
    const index = alerts.findIndex((x: iAlertApp) => x.Name === name);
    if (index !== -1) {
      newAlertSetting[index].IsActive = !alerts[index].IsActive;
    }
    setAlerts(newAlertSetting);

    var subscriptionToSave: any = {};
    newAlertSetting.forEach((x: iAlertApp) => {
      subscriptionToSave[toFieldName(x.Name)] = x.IsActive;
    });
    dispatch(AllActions.Main.alertSettingReducer({ value: newAlertSetting }));
    var recordId = await getRecordId(registeredPNApp[0]);
    var subscription = await mergeSubscriptions(registeredPNApp[0].Subscription, { ...registeredPNFirebase, ...subscriptionToSave });
    AlertSettingsMutation({
      alertSetting: newAlertSetting,
      setAsyncCache: setAsyncCache,
      delAsyncCache: delAsyncCache,
      recordId: recordId,
      subscription: subscription,
    });
  };

  React.useEffect(() => {
    try {
      let newData: iAlertApp[] = [];
      if (allAsyncCache.length !== 0) {
        newData = JSON.parse(allAsyncCache[allAsyncCache.length - 1].value);
      }
      setAlerts(newData);
    } catch (err) {
      logError('Error parsing Alerts Async Cache data', `${err}`, { id: '1634831393' });
    }
  }, [allAsyncCache]);

  const handleRefresh = () => {
    RegisteredPushNotification.refetch();
  };

  React.useEffect(() => {
    (async () => {
      if (status === 'success') {
        await RegisteredPushNotification.refetch();
        setSubmitting(false);
      }

      if (error) {
        C.Alert.alert('Error', `There was an error while processing your request. Please share the error below with an Administrator ${error}`);
        await RegisteredPushNotification.refetch();
        await AlertApps.refetch();
        dispatch(AllActions.Main.alertSettingReducer({ value: alerts }));
        setSubmitting(false);
      }
    })();
  }, [status, data, error]);

  const mergeSubscriptions = (serverSubscriptions: any, thisSubscription: iDeviceRegistration) => {
    let existingFcmid = false;
    var merged: any[] = [];
    if (serverSubscriptions) {
      try {
        var serverSub = JSON.parse(serverSubscriptions);
        merged = serverSub.map((subscription: iDeviceRegistration) => {
          if (subscription.fcmid === thisSubscription.fcmid) {
            existingFcmid = true;
            return thisSubscription;
          }
          return subscription;
        });
      } catch (err) {
        logError('Error while parsing and Merging Alerts Subscriptions', `${err}`, { id: '1634831538' });
      }
    }

    return existingFcmid ? merged : [...merged, thisSubscription];
  };

  function toFieldName(name: string) {
    return name ? name.replace(/\s/g, '').toLowerCase() : '';
  }

  function getRecordId(data: iSharepointValues) {
    return data && data.Id ? data.Id : 0;
  }

  const hasData = alerts.length > 0;

  const trackColorOn = C.RNPlatform.OS === 'android' ? 'transparent' : M.Colors.blueMain;
  const trackColorOff = C.RNPlatform.OS === 'android' ? 'transparent' : M.Colors.gray;

  const RenderItem = (props: any) => {
    const androidContainerStyle = C.RNPlatform.OS === 'android' ? { backgroundColor: props.IsActive ? M.Colors.blueMain : M.Colors.gray } : {};
    return (
      <C.Card transparent>
        <C.CardItem style={styles.ItemContainer}>
          {isLoading || submitting || AlertApps.isStale || RegisteredPushNotification.isStale ? (
            <C.View style={styles.LoadingWrap}>
              <C.Spinner color="grey" size="small" style={styles.Loading} />
            </C.View>
          ) : (
            <C.View style={[styles.SwitchWrap, androidContainerStyle]}>
              <C.Switch
                trackColor={{ false: trackColorOff, true: trackColorOn }}
                thumbColor={M.Colors.white}
                value={props.IsActive}
                style={C.RNPlatform.OS === 'android' ? styles.Switch : {}}
                onValueChange={() => onChangeItem(props.Name)}
                disabled={isLoading}
                ios_backgroundColor={trackColorOff}
              />
            </C.View>
          )}
          <C.View style={styles.TextWrap}>
            <C.Text style={styles.TextName}>{props.Name}</C.Text>
          </C.View>
        </C.CardItem>
      </C.Card>
    );
  };

  const RecentDataFail = () => {
    let content = <></>;
    setTimeout(() => {
      content = <C.Text style={styles.TextRecentData}>Failed to fetch the most recent data</C.Text>;
    }, 500);
    return (
      <C.View style={styles.IsLoadingFetchData}>
        <C.Spinner color="grey" size="small" style={styles.Loading} />
        {content}
      </C.View>
    );
  };

  const RenderAlertSettingsList = () => (
    <C.FlatList
      contentContainerStyle={styles.FlatListContainerStyle}
      style={styles.FlatListStyle}
      renderItem={(item: { item: iAlertApp }) => <RenderItem {...item.item} />}
      data={alerts}
      keyExtractor={(item: iAlertApp) => `${item.Id}`}
      refreshing={AlertApps.isLoading || RegisteredPushNotification.isLoading}
      onRefresh={handleRefresh}
    />
  );

  return <C.Container style={styles.Container}>{hasData ? <RenderAlertSettingsList /> : <RecentDataFail />}</C.Container>;
};

const styles = StyleSheet.create({
  FlatListContainerStyle: {
    paddingHorizontal: 10,
    paddingTop: 5,
  },
  FlatListStyle: {
    borderWidth: 0,
  },
  ItemContainer: {
    flex: 1,
    marginBottom: 7,
    backgroundColor: M.Colors.white,
    borderRadius: 5,
    shadowColor: M.Colors.black,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
    paddingTop: 8,
    paddingBottom: 8,
  },
  SwitchWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    height: 30,
    paddingHorizontal: 3,
  },
  Switch: {
    transform: [{ scaleX: 1.22 }, { scaleY: 1.22 }],
  },
  TextWrap: {
    width: 250,
    paddingLeft: 10,
  },
  TextName: {
    fontSize: 16,
  },
  LoadingWrap: {
    margin: 0,
    marginHorizontal: 5,
    minHeight: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Loading: {
    height: 0,
  },
  IsLoadingFetchData: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingTop: 20,
  },
  TextRecentData: {
    paddingTop: 20,
  },
  Container: {
    flex: 1,
    backgroundColor: M.Colors.wildSand,
  },
});
