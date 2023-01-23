import * as React from 'react';

// : Hooks
import H, { Routes } from './../../../../Hooks';

// : Components
import C from './../../../../Components';

// : Misc
import M, { iArticle } from './../../../../Misc';

// : Misc
import { iDefaultCardProps } from './iDefaultCardProps';
import { SocialBar } from './../SocialButtons';
import { StyleSheet } from 'react-native';

export interface iProps extends iDefaultCardProps<iArticle> {}

export const ArticleText: React.FC<iProps> = (props) => {
  const nav = H.NPM.navigation.useNavigation();
  const [debug, log, warn, error, tags, titles, legacyLog] = H.Logs.useLog({ source: 'ArticleText.tsx' });
  const logPress = H.Logs.useLog_userPress({ source: 'ArticleText.tsx' });
  const [item, setItem] = React.useState<iArticle>(props.feed.item);
  const [accentColor, contrastingColor] = M.Tools.interpretAccentColor(item.AccentColor);

  const handle_ButtonPress = () => {
    logPress(`ArticleText_${props.feed.item.PostType.substring(0, 1)}_${props.feed.item.ID}`, '1612558280', 'btn', [tags.button, tags.navigate]);
    if (item?.PopupContent) {
      nav.navigate(Routes.feedPostExpand, { data: props.feed.item });
    } else {
      nav.navigate(Routes.webview, { url: item?.ButtonLink.Url, title: props.feed.item.Title });
    }
  };

  return (
    <C.Card style={styles.Article}>
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
      <C.View style={styles.SocialBarWrap}>
        <SocialBar style={styles.SocialBar} currentCard={props.feed.item} />
      </C.View>
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
  SocialBarWrap: {
    marginHorizontal: 10,
    marginVertical: 10,
  },
  Icon: {
    marginRight: 0,
  },
});
