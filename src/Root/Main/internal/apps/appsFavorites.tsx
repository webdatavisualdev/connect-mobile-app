import * as React from 'react';

// : Hooks
import H, { Routes } from './../../../../Hooks';

// : Components
import C from './../../../../Components';
import { RenderItem } from './apps';

// : Misc
import M, { iApplication } from './../../../../Misc';

import { StyleSheet } from 'react-native';

export const AppsFavorites: React.FC = () => {
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

  const [debug, log, warn, error, tags, titles, legacyLog] = H.Logs.useLog({ source: 'appsFavorites.tsx' });
  const logPullToRefresh = H.Logs.useLog_PullToRefresh({ source: 'appsFavorites.tsx' });
  const isFocused = H.Misc.useScreenMount(Routes.appsFavorites, { title: 'Favorites' });
  const apps = H.Queries.useQuery_Apps();
  const [favoriteApps, setFavoriteApps] = React.useState<iApplication[]>([]);
  const userProfile = H.Queries.useQuery_UserProfile();
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  
  React.useEffect(() => {
    const newFavoriteApps: iApplication[] = [];
    if (userProfile.data && apps.data !== undefined) {
      const favAppsById: number[] = TryParseFavorites();
      favAppsById.forEach((favAppId) => {
        apps.data?.forEach((app) => {
          if (app.ID === favAppId) newFavoriteApps.push(app);
        });
      });
      setFavoriteApps(newFavoriteApps);
    }
  }, [apps.data, userProfile.data]);

  const handle_Refresh = async () => {
    logPullToRefresh('Favorite Applications', '1614749697');
    setIsRefreshing(true);
    await apps.refetch();
    await userProfile.refetch();
    setIsRefreshing(false);
  };

  return (
    <C.Container style={styles.Container}>
      <C.FlatList
        contentContainerStyle={styles.FlatListStyle}
        keyExtractor={(itm, index) => `FavoriteApps_${itm.ID}_${index}`}
        data={favoriteApps}
        renderItem={(i) => <RenderItem {...i.item} pressAction="openBestOption" />}
        refreshing={isRefreshing}
        onRefresh={handle_Refresh}
        ListFooterComponent={() => <>{false && <C.JSONTree data={apps.data} />}</>}
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
});
