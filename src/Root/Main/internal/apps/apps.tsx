import * as React from 'react';
import { StyleSheet } from 'react-native';

// : Hooks
import H, { Routes, iReduxState } from './../../../../Hooks';

// : Components
import C from './../../../../Components';

// : Misc
import M, { iApplication } from './../../../../Misc';

export const Apps: React.FC = () => {
  const logPress = H.Logs.useLog_userPress({ source: 'app.tsx' });
  const logPullToRefresh = H.Logs.useLog_PullToRefresh({ source: 'app.tsx' });
  const isFocused = H.Misc.useScreenMount(Routes.appsAll, { title: 'All' });
  const apps = H.Queries.useQuery_Apps();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handle_Refresh = async () => {
    logPullToRefresh('All_Applications', '1614749294');
    setIsRefreshing(true);
    await apps.refetch();
    setIsRefreshing(false);
  };

  return (
    <C.Container style={styles.Container}>
      <C.FlatList
        contentContainerStyle={styles.FlatListStyle}
        renderItem={(i) => <RenderItem {...i.item} />}
        keyExtractor={(itm) => `AllApps_${itm.ID}`}
        data={apps.data}
        refreshing={isRefreshing}
        onRefresh={handle_Refresh}
      />
    </C.Container>
  );
};

interface iRenderItemProps extends iApplication {
  pressAction?: 'showModal' | 'openBestOption';
}

export const RenderItem = (props: iRenderItemProps) => {
  const TryParseFavorites = (): number[] => {
    if (userProfile.data) {
      try {
        let x = JSON.parse(userProfile.data?.Properties['MobileFavApps']);
        return x;
      } catch (err) {
        error('Error trying to parse users Favorite Apps', `${err}`, { id: '1634832098' });
        return [];
      }
    } else {
      return [];
    }
  };

  const [debug, log, warn, error, tags, titles, legacyLog] = H.Logs.useLog({ source: 'app.tsx:RenderItem' });
  const logPress = H.Logs.useLog_userPress({ source: 'app.tsx:RenderItem' });
  const visualDebugging = H.NPM.redux.useSelector((s: iReduxState) => s.Dev.visualDebugging);
  const nav = H.NPM.navigation.useNavigation();
  const userProfile = H.Queries.useQuery_UserProfile();
  const [mutateLiked, {}] = H.Queries.useMutation_UserProfileProperty();
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [canOpenLocalApp, setCanOpenLocalApp] = React.useState(false);
  const nativeAppStoreLink = C.RNPlatform.select({ ios: props.iosStoreLink, android: props.androidStoreLink });
  
  React.useEffect(() => {
    if (userProfile.data) {
      const favAppsById: number[] = TryParseFavorites();
      setIsFavorite(favAppsById.findIndex(id => id === props.ID) > -1);
    }
  }, [userProfile.data]);

  React.useEffect(() => {
    if (props.appLaunch !== undefined && props.appLaunch !== null) {
      C.RNLinking.canOpenURL(props.appLaunch).then((isAble) => setCanOpenLocalApp(isAble));
    }
  }, []);

  const ico_heart = isFavorite ? <C.Icon name="heart" style={styles.IconHeart} /> : <C.Icon style={styles.IconHeartOutline} name="heart-outline" />;

  const fn_Download = () => {
    logPress(`Apps_Download_Native_ID_${props.ID}`, '1614757452', 'btn');
    C.RNLinking.canOpenURL(nativeAppStoreLink as string).then((support) => {
      if (support) {
        C.RNLinking.openURL(nativeAppStoreLink as string);
      } else {
        C.Toast.show({ text: `Cannot open link ${nativeAppStoreLink}` });
      }
    });
  };
  const btn_Download = (
    <C.Button
      key={`btn_download_${props.ID}`}
      block
      style={[styles.ButtonLaunchApp, { display: nativeAppStoreLink && !canOpenLocalApp ? 'flex' : 'none' }]}
      onPress={fn_Download}>
      <C.Text style={styles.TextGeneric}>Download App</C.Text>
      <C.Text numberOfLines={1} style={styles.TextAppLaunch}>
        {nativeAppStoreLink}
      </C.Text>
    </C.Button>
  );

  const fn_ViewNative = async () => {
    logPress(`Apps_Launch_Native_ID_${props.ID}`, '1614757512', 'btn');
    if (canOpenLocalApp) {
      C.RNLinking.openURL(props.appLaunch as string);
    } else {
      C.Toast.show({ text: 'Unable to Open' });
    }
  };
  const btn_ViewNative = (
    <C.Button key={`btn_viewNative_${props.ID}`} block style={[styles.ButtonLaunchApp, { display: canOpenLocalApp ? 'flex' : 'none' }]} onPress={fn_ViewNative}>
      <C.Text style={styles.TextGeneric}>Open App</C.Text>
      <C.Text numberOfLines={1} style={styles.TextAppLaunch}>
        {props.appLaunch}
      </C.Text>
    </C.Button>
  );

  const fn_ViewWebView = () => {
    logPress(`Apps_Launch_Web_ID_${props.ID}`, '1614757620', 'btn');
    nav.navigate(Routes.webview, { url: props.appWebLaunch, title: props.Title });
    setModalIsOpen(false);
  };
  const btn_ViewWebView = (
    <C.Button key={`btn_viewWebview_${props.ID}`} block style={styles.ButtonOpenInWebView} onPress={fn_ViewWebView}>
      <C.Text style={styles.TextGeneric}>View in Connect App</C.Text>
      <C.Text numberOfLines={1} style={styles.TextAppLaunch}>
        {props.appWebLaunch}
      </C.Text>
    </C.Button>
  );

  const fn_ToggleFavorite = () => {
    logPress(`Apps_${isFavorite ? 'Remove_Favorite' : 'Add_Favorite'}_App_ID_${props.ID}`, '1614757699', 'btn');
    const newVal = [...TryParseFavorites()];
    if (isFavorite) {
      newVal.splice(newVal.indexOf(props.ID), 1);
    } else {
      newVal.push(props.ID);
    }
    mutateLiked({ key: 'MobileFavApps', value: JSON.stringify(newVal) });
  };
  const btn_ToggleFavorite = (
    <C.Button key={`btn_toggleFavorite_${props.ID}`} block transparent style={styles.ButtonFavorites} onPress={fn_ToggleFavorite}>
      <C.Text style={styles.TextFavorites}>{isFavorite ? 'Remove from Favorites' : 'Add to Favorites!'}</C.Text>
    </C.Button>
  );

  const handle_Press = () => {
    switch (props.pressAction) {
      case 'openBestOption':
        {
          if (canOpenLocalApp) {
            fn_ViewNative();
          } else if (nativeAppStoreLink && !canOpenLocalApp) {
            fn_Download();
          } else fn_ViewWebView();
        }
        break;
      default: {
        logPress(`Applications_Show_Modal ID_${props.ID}`, '1614758196', 'btn');
        setModalIsOpen(true);
      }
    }
  };

  return (
    <C.View key={`test_${props.ID}`}>
      <C.Card transparent>
        <C.Pressable onPress={handle_Press}>
          <C.CardItem style={styles.ListItem}>
            <C.Pressable onPress={fn_ToggleFavorite}>{ico_heart}</C.Pressable>
            <C.View style={styles.TextWrap}>
              <C.Text style={styles.TextAppName}>{props.appName}</C.Text>
            </C.View>
          </C.CardItem>
        </C.Pressable>
      </C.Card>

      <C.Modal visible={modalIsOpen} transparent={false} animationType="slide">
        <C.Header style={styles.ModelHeader}>
          <C.Left style={styles.ModelHeaderButtons}>
            <C.Pressable onPress={() => setModalIsOpen(false)}>
              <C.Icon name="chevron-back-outline" style={{color: M.Colors.white}} />
            </C.Pressable>
          </C.Left>
          <C.Body style={styles.ModelHeaderBody}>
            <C.Text style={styles.ModelHeaderTitle}>{props.appName}</C.Text>
          </C.Body>
          <C.Right style={styles.ModelHeaderButtons} />
        </C.Header>
        <C.View style={styles.ModelMain}>
          <C.ScrollView>
            <C.Card style={styles.ModelCardContainer}>
              <C.CardItem>
                <C.Body>
                  <C.Text style={styles.TextTitle}>{props.appName}</C.Text>
                  <C.Text style={[styles.TextDescription, { display: props.appDescription ? 'flex' : 'none' }]}>{props.appDescription}</C.Text>

                  {btn_Download}
                  {btn_ViewWebView}
                  {btn_ViewNative}
                  {btn_ToggleFavorite}

                  {visualDebugging && <C.JSONTree data={props} />}
                </C.Body>
              </C.CardItem>
            </C.Card>
          </C.ScrollView>
        </C.View>
        <C.Footer style={styles.ModelFooter} />
      </C.Modal>
    </C.View>
  );
};

const styles = StyleSheet.create({
  ModelHeader: {
    backgroundColor: M.Colors.veniceBlue,
  },
  ModelHeaderButtons: {
    flex: 1,
  },
  ModelHeaderBody: {
    flex: 10,
    alignItems: 'center',
  },
  ModelHeaderTitle: {
    textAlign: 'center',
    fontSize: 16,
    color: M.Colors.white,
  },
  ModelCardContainer: {
    flex: 1,
  },
  ModelMain: {
    flex: 1,
    padding: 10,
  },
  TextTitle: {
    marginHorizontal: 5,
    marginVertical: 10,
    fontWeight: 'bold',
  },
  TextDescription: {
    marginHorizontal: 5,
    marginVertical: 10,
  },
  TextGeneric: {
    flex: 1,
    textAlign: 'center',
  },
  ButtonLaunchApp: {
    flex: 1,
    margin: 5,
    flexDirection: 'column',
    backgroundColor: M.Colors.azureRadiance,
    borderRadius: 5,
  },
  ButtonOpenInWebView: {
    backgroundColor: M.Colors.finn,
    flex: 1,
    margin: 5,
    flexDirection: 'column',
    borderRadius: 5,
  },
  ButtonFavorites: {
    flex: 1,
    backgroundColor: 'transparent',
    margin: 5,
    flexDirection: 'column',
    borderRadius: 5,
  },
  TextFavorites: {
    textAlign: 'center',
    color: M.Colors.azureRadiance,
  },
  TextAppLaunch: {
    color: M.Colors.white,
    fontSize: 10,
  },
  ModelFooter: {
    height: 0,
  },
  Container: {
    flex: 1,
    backgroundColor: M.Colors.wildSand,
  },
  FlatListStyle: {
    paddingTop: 5,
    paddingHorizontal: 10,
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
    paddingTop: 8,
    paddingBottom: 8,
  },
  IconHeart: {
    color: M.Colors.finn,
    marginLeft: 10,
  },
  IconHeartOutline: {
    color: M.Colors.lightGray,
    marginLeft: 10,
  },
  TextAppName: {
    fontSize: 16,
  },
  TextWrap: {
    width: 270,
  },
});
