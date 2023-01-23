import * as React from 'react';

// : Hooks
import H, { Routes, iReduxState } from '../../../../Hooks';

// : Components
import C from '../../..';

// : Tools
import M, { iArticle, iEvent } from '../../../../Misc';

// : Misc
import { iDefaultCardProps } from './iDefaultCardProps';
import { SocialBar } from '../SocialButtons';
import { WebViewSourceUri, WebViewSourceHtml } from 'react-native-webview/lib/WebViewTypes';
import { StyleSheet } from 'react-native';

export interface iProps extends iDefaultCardProps<iArticle | iEvent> {}

export const VideoText: React.FC<iProps> = (props: iProps) => {
  const nav = H.NPM.navigation.useNavigation();
  const [debug, log, warn, error, tags, titles, legacyLog] = H.Logs.useLog({ source: 'VideoText.tsx' });
  const logPress = H.Logs.useLog_userPress({ source: 'VideoText.tsx' });
  const [item, setItem] = React.useState<iArticle | iEvent>(props.feed.item);
  const [accentColor, contrastingColor] = M.Tools.interpretAccentColor(item.AccentColor);
  const activeSession = H.NPM.redux.useSelector((s: iReduxState) => s.Auth.activeSession);
  const [webviewSource, setWebviewSource] = React.useState<WebViewSourceUri | WebViewSourceHtml | undefined>(undefined);
  const [videoLoading, setVideoLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (activeSession) {
      setWebviewSource({ uri: item.VideoUrl?.Url });
    }
  }, [activeSession]);

  const handle_ButtonPress = () => {
    logPress(`VideoText_${props.feed.item.PostType.substring(0, 1)}_${props.feed.item.ID}`, '1612559829', 'btn', [tags.button, tags.navigate]);
    if (item?.PopupContent) {
      nav.navigate(Routes.feedPostExpand, { data: props.feed.item });
    } else {
      nav.navigate(Routes.webview, { url: item.VideoUrl.Url, title: props.feed.item.Title });
    }
  };

  const onVideoLoaded = () => {
    if (activeSession) {
      setVideoLoading(false);
    }
  };

  return (
    <C.Card style={styles.Article}>
      <C.CardItem cardBody style={styles.WebViewContainer}>
        <C.WebView
          originWhitelist={['*']}
          useSharedProcessPool={true}
          sharedCookiesEnabled={true}
          mediaPlaybackRequiresUserAction={true}
          source={webviewSource}
          style={styles.WebView}
          mixedContentMode="always"
          useWebKit={true}
          onLoadEnd={onVideoLoaded}
        />
        {videoLoading ? (
          <C.View style={styles.VideoLoading}>
            <C.Spinner color="grey" />
          </C.View>
        ) : (
          <></>
        )}
      </C.CardItem>

      <C.View style={styles.SocialBarWrap}>
        <SocialBar style={styles.SocialBar} currentCard={props.feed.item} />
      </C.View>
      <C.CardItem style={styles.CardItem}>
        <C.Title style={styles.Title} purpose="heading">
          {props.feed.item.Title}
        </C.Title>
        <C.Text style={styles.Teaser}>{item?.Teaser}</C.Text>
      </C.CardItem>
      {!props.hideButton && (
        <C.CardItem style={styles.CardItem}>
          <C.Button onPress={handle_ButtonPress} style={[styles.Button, { backgroundColor: accentColor }]}>
            <C.Text style={[styles.ButtonText, { color: contrastingColor }]}>{item?.ButtonText}</C.Text>
            {item?.PopupContent ? <C.Icon style={[styles.Icon, { color: contrastingColor }]} name="caret-forward" /> : undefined}
          </C.Button>
        </C.CardItem>
      )}
    </C.Card>
  );
};

const styles = StyleSheet.create({
  Article: {
    overflow: 'hidden',
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  CardItem: {
    backgroundColor: 'white',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  TextContainer: {
    flexDirection: 'column',
  },
  Title: {
    color: M.Colors.veniceBlue,
  },
  Teaser: {
    paddingHorizontal: 0,
    color: M.Colors.veniceBlue,
    fontSize: 17,
    alignItems: 'flex-start',
    paddingTop: 10,
  },
  Button: {
    borderRadius: 5,
    paddingHorizontal: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  ButtonText: {
    fontFamily: 'Montserrat-Medium',
  },
  SocialBar: {
    backgroundColor: 'white',
  },
  WebViewContainer: {
    backgroundColor: 'black',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  WebView: {
    width: '100%',
    aspectRatio: 16 / 9,
    overflow: 'hidden',
  },
  SocialBarWrap: {
    marginHorizontal: 10,
    marginTop: 10,
  },
  Icon: {
    marginRight: 0,
  },
  VideoLoading: {
    position: 'absolute',
    alignSelf: 'center',
  },
});
