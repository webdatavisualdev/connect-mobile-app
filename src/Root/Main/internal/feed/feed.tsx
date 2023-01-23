import * as React from 'react';
import { useNavigation } from '@react-navigation/native';

// : Hooks
import H, { Routes, AllActions, iReduxState } from './../../../../Hooks';

// : Components
import C from './../../../../Components';

// : Tools
import T from './../../../../Misc/Tools';
import M, { iArticle, iEvent } from './../../../../Misc';

import { Alert } from 'react-native';

export const Feed: React.FC = () => {
  const [debug, log, warn, error, tags] = H.Logs.useLog({ source: '(internal) feed.tsx' });
  const logPress = H.Logs.useLog_userPress({ source: '(internal) feed.tsx' });
  const logPullToRefresh = H.Logs.useLog_PullToRefresh({ source: '(internal) feed.tsx' });
  const activeSession = H.NPM.redux.useSelector((s: iReduxState) => s.Auth.activeSession);
  const visualDebugging = H.NPM.redux.useSelector((s: iReduxState) => s.Dev.visualDebugging);
  const feedQuery = H.Queries.useQuery_Feed();
  const [feedRateLimiter, setFeedRateLimiter] = React.useState(10);
  const [fakeFeed, setFakeFeed] = React.useState(T.faker.FakeFeed.buildSampleData());
  const nav = useNavigation();
  const [listFooter, setListFooter] = React.useState(<></>);
  const [refreshing, setRefreshing] = React.useState(false);
  const [navOptions, setNavOptions] = React.useState({});
  const [cachedData, setCachedData] = React.useState<Array<iArticle | iEvent>>([]);
  // const memoizedFeed = React.useMemo(() => feedQuery.data?.slice(0, feedRateLimiter), [feedQuery.updatedAt, feedRateLimiter]);
  const memoizedFeed = React.useMemo(() => feedQuery.data, [feedQuery.updatedAt]);
  const [stallRender, setStallRender] = React.useState(true);
  const Experiment_FakeFeed = H.DEV.useExperiment<boolean>({
    key: 'FakeFeed',
    category: 'Feed',
    name: 'Fake the News',
    description: 'Replace the news with Faked values, there will be 1 card generated for each card type',
    setting: false,
    defaultSetting: false,
  });
  const dispatch = H.NPM.redux.useDispatch();

  React.useEffect(() => {
    setNavOptions({
      headerRight: () => renderUserIcon,
      title: 'News',
      headerLeft: () => renderSettingsCog,
    });
    setTimeout(() => dispatch(AllActions.Main.feedTabLoadedReducer({ value: true })), 1000);

    T.InteractionManager.runAfterInteractions(() => {
      setStallRender(false);
    });
  }, []);

  React.useEffect(() => {
    if (feedQuery.data) {
      if (feedQuery.data.length > feedRateLimiter) {
        setCachedData(feedQuery.data?.slice(0, feedRateLimiter));
        setListFooter(<FooterLoadMoreButton />);
      } else {
        setListFooter(<FooterFin />);
      }
    }
  }, [feedRateLimiter, feedQuery.data]);

  const renderSettingsCog = (
    <>
      <C.Pressable
        onPress={() => {
          logPress('Settings Cog on Feed', '1620055291', 'btn');
          nav.navigate(Routes.feedProfileSettingsStack);
        }}>
        <C.Icon style={{ padding: 10, paddingLeft: 20, color: M.Colors.white, fontSize: 16 }} name="cog" type="FontAwesome5" />
      </C.Pressable>
    </>
  );

  const renderUserIcon = (
    <>
      <C.Pressable
        onStartShouldSetResponderCapture={() => true}
        onPress={() => {
          logPress('Profile Picture Picture on Feed', '1619459598', 'btn');
          nav.navigate(Routes.userSettingsStack);
        }}
        style={{ marginRight: 15, width: 35, height: 35, borderRadius: 50, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <C.ProfilePicture />
      </C.Pressable>
    </>
  );

  const tryLoadMore = () => {
    const RateLimiterIncreaseAmount = 5;
    if (feedQuery.data) {
      const rawFeedPercentageCompleted = Math.round(((feedRateLimiter + RateLimiterIncreaseAmount) / feedQuery.data.length) * 100);
      const safeFeedPercentageCompleted = rawFeedPercentageCompleted > 100 ? 100 : rawFeedPercentageCompleted;
      log('Feed - Load More Posts', `User has Requested loading more posts, ${safeFeedPercentageCompleted}% of Feed Loaded`, {
        id: '1612556107',
        tags: [tags.userInteraction, tags.button],
        analytics: {
          name: `loadMore_feed_perc${safeFeedPercentageCompleted}`,
          stripExtraData: false,
        },
      });
      setFeedRateLimiter(feedRateLimiter + RateLimiterIncreaseAmount);
    }
  };

  const refreshData = async () => {
    logPullToRefresh('Internal Feed', '1610567085');
    setRefreshing(true);
    await feedQuery.refetch();
    setRefreshing(false);
  };

  const FooterLoadMoreButton = () => (
    <>
      <C.Button style={{ margin: 25, paddingVertical: 25 }} block onPress={tryLoadMore}>
        <C.Text style={{ color: 'white' }}>Load More Posts</C.Text>
      </C.Button>
    </>
  );

  const FooterFin = () => (
    <C.Card>
      <C.CardItem style={{ justifyContent: 'center' }}>
        <C.Text>End of News</C.Text>
      </C.CardItem>
    </C.Card>
  );

  const listHeader = (
    <C.View style={{ display: visualDebugging ? 'flex' : 'none' }}>
      <C.Text>News Query Last Updated: {feedQuery.updatedAt.toString()}</C.Text>
      <C.Text>News Query Data Length: {feedQuery.data ? feedQuery.data.length.toString() : 'Undefined'}</C.Text>
    </C.View>
  );

  const keyExtractor = React.useCallback((itm) => {
    return itm.PostType + itm.ID;
  }, []);

  const renderItem = React.useCallback((itm) => {
    return <C.FeedCard feed={itm} />;
  }, []);

  if (stallRender) {
    return <></>;
  }

  const showSecureSigninPopup = () => {
    Alert.alert(
      'Securely Signing You In',
      "We are currently signing you in to our AdventHealth applications. Until we are done, you may see old posts on your news or be prompted to log in. \n\n Once this blue banner disappears, you'll be fully signed in and ready to navigate the app.",
      [
        {
          text: 'OK',
          onPress: () => {},
        },
      ],
    );
  };

  return (
    <>
      <C.Container style={{ backgroundColor: '#f6f6f6' }}>
        <C.View>
          {!activeSession && (
            <C.View style={{ backgroundColor: '#00A3E0', justifyContent: 'center', alignItems: 'center', height: 35 }}>
              <C.Text style={{ color: 'white' }}>Securely Signing You In</C.Text>
              <C.Icon
                style={{ color: 'white', fontSize: 20, position: 'absolute', right: 20 }}
                type="FontAwesome5"
                name="info-circle"
                onPress={showSecureSigninPopup}
              />
            </C.View>
          )}
          {!memoizedFeed?.length && !activeSession ? (
            <C.Spinner color="grey" />
          ) : (
            <C.FlatList
              style={{ backgroundColor: 'transparent' }}
              contentContainerStyle={{ padding: 15 }}
              data={Experiment_FakeFeed?.setting ? fakeFeed : memoizedFeed?.length ? memoizedFeed : cachedData}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              maxToRenderPerBatch={5}
              ListHeaderComponent={listHeader}
              refreshing={refreshing}
              onRefresh={refreshData}
            />
          )}
        </C.View>
      </C.Container>
    </>
  );
};
