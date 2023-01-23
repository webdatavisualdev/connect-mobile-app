import * as React from 'react';
import { StyleSheet } from 'react-native';

// : Hooks
import H, { Routes } from './../../../../Hooks';

// : Components
import C from './../../../../Components';

// : Misc
import M, { iQuickLinks } from './../../../../Misc';

export const QuickLinks: React.FC = () => {
  const [debug, log, warn, errorLog, tags] = H.Logs.useLog({ source: 'quickLinks.tsx' });
  const logPress = H.Logs.useLog_userPress({ source: 'quickLinks.tsx' });
  const logPullToRefresh = H.Logs.useLog_PullToRefresh({ source: 'quickLinks.tsx' });
  const nav = H.NPM.navigation.useNavigation();
  const QuickLinksQuery = H.Queries.useQuery_QuickLinks();
  const [refreshing, setRefreshing] = React.useState(false);

  const handle_onPress = (link: string, title: string) => {
    logPress(`Quick_Link_Opened_${link}`, '1613428374', 'btn', [tags.navigate]);
    nav.navigate(Routes.webview, { url: link, title });
  };

  const handle_Refresh = async () => {
    logPullToRefresh('Quick_Links', '1613424620');
    setRefreshing(true);
    await QuickLinksQuery.refetch();
    setRefreshing(false);
  };

  const RenderLink = (props: iQuickLinks) => {
    return (
      <C.Pressable onPress={() => handle_onPress(props.link.Url, props.Title)}>
        <C.Card transparent>
          <C.CardItem style={styles.ListItem}>
            <C.View style={styles.TextWrap}>
              <C.Text style={styles.TextBase}>{props.Title}</C.Text>
              {
                // TODO Experiments Make this Display link option an experiment
              }
              <C.Text numberOfLines={1} style={styles.TextLink}>
                {props.link.Url}
              </C.Text>
            </C.View>
            <C.Icon style={styles.Icon} name="chevron-forward-outline" />
          </C.CardItem>
        </C.Card>
      </C.Pressable>
    );
  };

  return (
    <C.Container style={styles.Container}>
      <C.FlatList
        keyExtractor={(i) => i.GUID}
        contentContainerStyle={styles.FlatListStyle}
        renderItem={(i) => <RenderLink {...i.item} />}
        data={QuickLinksQuery.data}
        refreshing={refreshing}
        onRefresh={handle_Refresh}
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
  TextBase: {
    fontSize: 16,
  },
  TextLink: {
    fontSize: 10,
    color: 'grey',
  },
  TextWrap: {
    flex: 1,
    width: 280,
    paddingLeft: 15,
  },
  Icon: {
    flex: 0,
  },
});
