import * as React from 'react';
import { SocialBar } from './../SocialButtons';
import { StyleSheet } from 'react-native';
import { iDefaultCardProps } from './iDefaultCardProps';
import moment from 'moment';

// : Hooks
import H, { Routes } from './../../../../Hooks';

// : Components
import C from './../../../../Components';

// : Misc
import M, { iEvent } from './../../../../Misc';

export interface iProps extends iDefaultCardProps<iEvent> {}

export const EventDateText: React.FC<iProps> = (props) => {
  const nav = H.NPM.navigation.useNavigation();
  const [debug, log, warn, error, tags, titles, legacyLog] = H.Logs.useLog({ source: 'EventDateText.tsx' });
  const logPress = H.Logs.useLog_userPress({ source: 'EventDateText.tsx' });
  const [item, setItem] = React.useState<iEvent>(props.feed.item);
  const [accentColor, contrastingColor] = M.Tools.interpretAccentColor(item.AccentColor);
  const mom = moment(props.feed.item.PublishDate);

  const styles = StyleSheet.create({
    wholeCard: {
      overflow: 'hidden',
      borderRadius: 5,
      marginVertical: 10,
    },
    cardInnerWrapper: {
      flexDirection: 'row',
      flex: 1,
    },
    dateWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: accentColor,
      flex: 1,
    },
    dateMonth: {
      fontWeight: 'bold',
      color: contrastingColor,
    },
    dateDay: {
      fontWeight: 'bold',
      color: contrastingColor,
    },
    pad: {
      marginVertical: 10,
    },
    dataOuterWrapper: {
      flex: 3,
    },
    dataInnerWrapper: {
      justifyContent: 'center',
      alignItems: 'flex-start',
      flex: 1,
    },
    title: {
      color: M.Colors.veniceBlue,
      flex: 1,
    },
    teaser: {
      color: M.Colors.veniceBlue,
      fontSize: 17,
      flex: 1,
    },
    button: {
      backgroundColor: accentColor,
    },
    buttonText: {
      color: contrastingColor,
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

  const handle_ButtonPress = () => {
    logPress(`EventDateText_${props.feed.item.PostType.substring(0, 1)}_${props.feed.item.ID}`, '1612558280', 'btn', [tags.button, tags.navigate]);
    if (item?.PopupContent) {
      nav.navigate(Routes.feedPostExpand, { data: props.feed.item });
    } else {
      nav.navigate(Routes.webview, { url: item?.ButtonLink.Url, title: props.feed.item.Title });
    }
  };

  return (
    <C.Card style={styles.wholeCard}>
      <C.View style={styles.cardInnerWrapper}>
        <C.View style={styles.dateWrapper}>
          <C.Text style={styles.dateMonth}>{mom.format('MMMM')}</C.Text>
          <C.Text style={styles.dateDay}>{mom.format('Do')}</C.Text>
        </C.View>
        <C.CardItem style={styles.dataOuterWrapper}>
          <C.View style={styles.dataInnerWrapper}>
            <C.Title ellipsizeMode="tail" numberOfLines={1} style={[styles.pad, styles.title]} purpose="heading">
              {props.feed.item.Title}
            </C.Title>
            <C.Text style={[styles.pad, styles.teaser]} ellipsizeMode="tail" numberOfLines={3}>
              {props.feed.item.Teaser}
            </C.Text>
            {!props.hideButton && (
              <C.Button block onPress={handle_ButtonPress} style={styles.button}>
                <C.Text style={styles.buttonText} ellipsizeMode="tail" numberOfLines={1}>
                  {props.feed.item.ButtonText}
                </C.Text>
                {item?.PopupContent ? <C.Icon style={[styles.Icon, { color: contrastingColor }]} name="caret-forward" /> : undefined}
              </C.Button>
            )}
          </C.View>
        </C.CardItem>
      </C.View>
      <C.View style={styles.SocialBarWrap}>
        <SocialBar style={styles.SocialBar} currentCard={props.feed.item} />
      </C.View>
    </C.Card>
  );
};
