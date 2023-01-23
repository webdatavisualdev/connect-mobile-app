import * as React from 'react';
import { useRoute } from '@react-navigation/native';

// : Hooks
import H from './../../Hooks';

// : Components
import C from './../../Components';
import { WebView as RNWebView } from 'react-native-webview';
import { WebViewErrorEvent, WebViewNavigation, WebViewNavigationEvent } from 'react-native-webview/lib/WebViewTypes';
import M from './../../Misc';
import { StyleSheet } from 'react-native';

export interface iProps {}
export interface iParams {
  url: string;
  title: string;
}

export const WebView: React.FC = () => {
  const [debug, log, warn, error, tags, titles, legacyLog] = H.Logs.useLog({ source: 'webview.tsx' });
  const nav = H.NPM.navigation.useNavigation();
  const [analytics, _userPropertyKeys] = H.Firebase.useAnalytics();
  const Route = useRoute();
  const url = (Route.params as iParams).url ? (Route.params as iParams).url : 'https://www.google.com';
  const title = (Route.params as iParams).title;
  const [webViewNavigationState, setWebViewNavigationState] = React.useState<WebViewNavigation>();
  const [animatedValue, _setAnimatedValue] = React.useState(new C.RNAnimated.Value(1));

  const colorIconBack = webViewNavigationState && webViewNavigationState.canGoBack ? M.Colors.black : M.Colors.gray;
  const colorIconForward = webViewNavigationState && webViewNavigationState.canGoForward ? M.Colors.black : M.Colors.gray;
  const animatedWidth = animatedValue.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });
  const animatedOpacity = animatedValue.interpolate({ inputRange: [0, 100], outputRange: [0.25, 1] });
  const animatedBackgroundColor = [M.Colors.sushi, M.Colors.azureRadiance, M.Colors.curiousBlue, M.Colors.eden][Math.floor(Math.random() * 4)];

  let webViewRef = React.useRef<RNWebView>(null);

  React.useEffect(() => {
    analytics.logEvent('Webview_URL', { url: (Route.params as iParams).url });
  }, []);

  React.useEffect(() => {
    nav.setOptions({ headerBackTitle: 'Back' });
  }, []);

  const handleExternalLink = () => {
    if (webViewNavigationState) {
      const link = webViewNavigationState.url;
      C.RNLinking.openURL(link);
    }
  };

  const handleWebViewOnLoadStart = (_e: WebViewNavigationEvent) => {
    C.RNAnimated.loop(
      C.RNAnimated.sequence([
        C.RNAnimated.timing(animatedValue, {
          toValue: 100,
          duration: 2000,
          useNativeDriver: false,
        }),
        C.RNAnimated.timing(animatedValue, {
          toValue: 0,
          duration: 750,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  };

  const handleWebViewOnLoadEnd = (_e: WebViewNavigationEvent | WebViewErrorEvent) => {
    C.RNAnimated.timing(animatedValue, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  return (
    <C.Container style={styles.Container}>
      <C.View style={styles.HeaderContainer}>
        <C.Header style={styles.Header}>
          <C.Left>
            <C.Pressable onPress={() => nav.goBack()}>
              <C.Icon type="FontAwesome" name="close" style={[styles.HeaderIcon, { fontSize: 20, color: M.Colors.white }]} />
            </C.Pressable>
          </C.Left>
          <C.Body style={styles.HeaderBody}>
            <C.Text style={styles.HeaderTitle} numberOfLines={1}>{title}</C.Text>
            <C.Text style={styles.HeaderLink} numberOfLines={1}>{url}</C.Text>
          </C.Body>
          <C.Right />
        </C.Header>
        <C.RNAnimated.View style={[styles.Animated, { backgroundColor: animatedBackgroundColor, width: animatedWidth, opacity: animatedOpacity }]} />
      </C.View>
      <C.Content contentContainerStyle={styles.content} scrollEnabled={false}>
        <RNWebView
          ref={webViewRef}
          applicationNameForUserAgent="AHConnect"
          source={{ uri: url }}
          onNavigationStateChange={setWebViewNavigationState}
          onLoadStart={handleWebViewOnLoadStart}
          onLoadEnd={handleWebViewOnLoadEnd}
          onError={(e) => error('Webview Error', '', { id: '1631055940', extraData: { error: e } })}
          style={styles.WebViewStyle}
        />
      </C.Content>
      <C.View style={styles.FooterContainer}>
        <C.Footer style={styles.Footer}>
          <C.Pressable onPress={() => webViewRef.current?.goBack()}>
            <C.Icon type="FontAwesome5" name="angle-left" style={[styles.HeaderIcon, { fontSize: 30, color: colorIconBack }]} />
          </C.Pressable>
          <C.Pressable onPress={() => webViewRef.current?.goForward()}>
            <C.Icon type="FontAwesome5" name="angle-right" style={[styles.HeaderIcon, { fontSize: 30, color: colorIconForward }]} />
          </C.Pressable>
          <C.Pressable onPress={() => webViewRef.current?.reload()}>
            <C.Icon type="FontAwesome5" name="redo" style={[styles.HeaderIcon, { fontSize: 20 }]} />
          </C.Pressable>
          <C.Pressable onPress={() => handleExternalLink()}>
            <C.Icon type="FontAwesome5" name="globe" style={[styles.HeaderIcon, { fontSize: 20 }]} />
          </C.Pressable>
        </C.Footer>
      </C.View>
    </C.Container>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  WebViewStyle: {
    flex: 1,
  },
  GoBackText: {
    paddingLeft: 15,
    textAlignVertical: 'center',
  },
  Header: {
    backgroundColor: M.Colors.veniceBlue,
  },
  Footer: {
    backgroundColor: M.Colors.white,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  HeaderIcon: {
    fontSize: 5,
    paddingLeft: 15,
    paddingRight: 15,
    textAlignVertical: 'center',
  },
  HeaderContainer: {
    shadowColor: M.Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
    position: 'relative',
  },
  HeaderBody: {
    flex: 6,
    textAlign: 'center',
  },
  HeaderTitle: {
    fontSize: 16,
    color: M.Colors.white,
  },
  HeaderLink: {
    fontSize: 11,
    color: M.Colors.white,
  },
  FooterContainer: {
    shadowColor: M.Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
    width: '100%',
  },
  RightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  Animated: {
    flexDirection: 'column',
    flex: 0.005,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 0,
    zIndex: 10,
    height: 5,
  },
  content: {
    flex: 1,
    alignItems: 'stretch',
    alignContent: 'stretch',
    backgroundColor: 'lime',
  },
});
