import React from 'react';
import { Share, StyleSheet } from 'react-native';

// : Hooks
import H, { Routes, iReduxState } from './../../Hooks';

// : Components
import C from './../../Components';

// : Misc
import { iArticle, iEvent } from './../../Misc';

import { quotes } from './quotes';
const images = [
  require('./../../Assets/loaderImages/choice-blue.png'),
  require('./../../Assets/loaderImages/choice-purple.png'),
  require('./../../Assets/loaderImages/choice-teal.png'),
  require('./../../Assets/loaderImages/choice-yellow.png'),
  require('./../../Assets/loaderImages/rest-blue.png'),
  require('./../../Assets/loaderImages/rest-purple.png'),
  require('./../../Assets/loaderImages/rest-teal.png'),
  require('./../../Assets/loaderImages/rest-yellow.png'),
];

const styles = StyleSheet.create({
  absolute: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  quote: {
    justifyContent: 'center',
    padding: 10,
    bottom: 0,
  },
});

export interface iParams {
  hold?: boolean;
}

export const InitialLoading: React.FC = () => {
  const [debug, log, warn, error, tags, titles, legacyLog] = H.Logs.useLog({ source: 'initialLoading.tsx' });
  const nav = H.NPM.navigation.useNavigation();
  const Route = H.NPM.navigation.useRoute();
  const [index, setIndex] = React.useState(0);
  const [quote, setQuote] = React.useState('');
  const [progress, setProgress] = React.useState(0);
  const [redirectTime, setRedirectTimeout] = React.useState<number>();

  // : Progress Triggers
  const session = H.NPM.redux.useSelector((s: iReduxState) => s.Auth.activeSession);
  const userProfile = H.Queries.useQuery_UserProfile();
  const feed = H.Queries.useQuery_Feed();
  const [startPreloading, setStartPreloading] = React.useState(false);
  const [CardOne, setCardOne] = React.useState<iArticle | iEvent>();
  const [CardTwo, setCardTwo] = React.useState<iArticle | iEvent>();
  const [CardThree, setCardThree] = React.useState<iArticle | iEvent>();
  const CardOneStatus = H.Misc.usePreloadFeedItem(startPreloading, CardOne);
  const CardTwoStatus = H.Misc.usePreloadFeedItem(startPreloading, CardTwo);
  const CardThreeStatus = H.Misc.usePreloadFeedItem(startPreloading, CardThree);

  React.useEffect(() => {
    setQuote(rand_quote);
  }, []);

  React.useEffect(() => {
    const progressTouchPoints = 6;
    let totalProgress = 0;
    if (progress !== 1) {
      debug('Session Found', session ? 'true' : 'false', { id: '1631054313' });
      if (session) totalProgress = totalProgress + 1 / progressTouchPoints;

      debug('UserProfile Fetched', userProfile.isFetched ? 'true' : 'false', { id: '1631054370' });
      if (userProfile.isFetched) totalProgress = totalProgress + 1 / progressTouchPoints;

      debug('Feed Fetched', feed.isFetched ? 'true' : 'false', { id: '1631054398' });
      if (feed.isFetched) totalProgress = totalProgress + 1 / progressTouchPoints;

      debug('Preload', `Card One ${CardOneStatus}`, { id: '1640721921' });
      if (CardOneStatus === 'loaded') totalProgress = totalProgress + 1 / progressTouchPoints;

      debug('Preload', `Card Two ${CardTwoStatus}`, { id: '1640721945' });
      if (CardTwoStatus === 'loaded') totalProgress = totalProgress + 1 / progressTouchPoints;

      debug('Preload', `Card Three ${CardThreeStatus}`, { id: '1640721947' });
      if (CardThreeStatus === 'loaded') totalProgress = totalProgress + 1 / progressTouchPoints;

      debug('Total Progress for Initial Loader', `${totalProgress}`, { id: '1640723242' });
      setProgress((Route.params as iParams)?.hold === true ? 0 : totalProgress);
      if (totalProgress > 0.95 && (Route.params as iParams)?.hold !== true) {
        // : Loading is done, lets set the redirect time for 5 seconds in the future
        const val = Date.now() + 1000 * 7;
        debug('Setting Redirect Timeout', `Value = ${val}`, { id: '1640723106' });
        setRedirectTimeout(val);
      }
    }
  }, [session, userProfile.isFetched, feed.isFetched, progress, CardOneStatus, CardTwoStatus, CardThreeStatus]);

  React.useEffect(() => {
    if (feed.data) {
      setCardOne(feed.data[0]);
      setCardTwo(feed.data[1]);
      setCardThree(feed.data[2]);
      setStartPreloading(true);
    }
  }, [feed.isFetched]);

  React.useEffect(() => {
    // : Check to see if Timeout is set, undefined means that we are still loading
    if (redirectTime) {
      // : Ensure that the redirect time is a future time
      if (redirectTime > Date.now()) {
        window.setTimeout(() => {
          nav.reset({
            index: 2,
            routes: [{ name: Routes.RootStack, params: { screen: Routes.internalContent, params: { screen: Routes.feedStack } } }],
          });
        }, redirectTime - Date.now());
      } else {
        // : the redirect time was a past date, maybe the app is running slowly? Reset it for 5 seconds in the future, sorry user...
        setRedirectTimeout(Date.now() + 1000 * 7);
      }
    }
  }, [redirectTime]);

  const next = () => {
    // Next Image
    index < images.length - 1 ? setIndex(index + 1) : setIndex(0);

    // Random Quote
    setQuote(rand_quote());
  };

  const rand_quote = () => {
    const max = quotes.length - 1;
    const min = 0;
    const randNum = Math.floor(Math.random() * (max - min + 1)) + min;
    return quotes[randNum].quote;
  };

  const blurType = C.RNPlatform.OS == 'ios' ? 'thinMaterialLight' : 'light';

  return (
    <>
      <C.View style={{ position: 'absolute' }}>
        <C.ProfilePicture />
      </C.View>
      <C.RNImage style={styles.absolute} source={images[index]} />
      <C.View style={{ flexGrow: 1, flexDirection: 'column', justifyContent: 'flex-end' }}>
        <C.View style={{ flex: 3 }} />
        <C.Pressable
          style={styles.absolute}
          onPress={next}
          onLongPress={() => {
            nav.goBack();
          }}
        />
        <C.View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', position: 'relative' }}>
          <C.BlurView blurType={blurType} style={[styles.absolute, styles.quote]} />
          <C.View style={{ flexDirection: 'column', justifyContent: 'space-around', flex: 1, padding: 10 }}>
            <C.Pressable
              onLongPress={() => {
                Share.share({ message: quote, url: '' });
              }}>
              <C.Text style={{ textAlign: 'center' }}>{quote}</C.Text>
            </C.Pressable>
            <C.Paper.ProgressBar indeterminate={true} color="blue" />
          </C.View>
        </C.View>
      </C.View>
    </>
  );
};
