import * as React from 'react';

// : Components
import C from './../../../../Components';

// : Tools
import M, { iArticle, iEvent } from './../../../../Misc';

import { iDefaultCardProps } from './iDefaultCardProps';
import { StyleSheet } from 'react-native';

export const DefaultCard: React.FC<iDefaultCardProps<iArticle | iEvent>> = (props) => (
  <>
    <C.Card key={props.feed.index + '_' + props.feed.item.ID}>
      <C.CardItem>
        <C.Text style={styles.Notification}>Oops! Card Type not found.</C.Text>
      </C.CardItem>
      <C.CardItem>
        <C.Text style={styles.Title}>
          {props.feed.item.Title} - {props.feed.item.ID}
        </C.Text>
      </C.CardItem>
      <C.CardItem>
        <C.Text style={styles.CardType}>CardType: {props.feed.item.LayoutType}</C.Text>
      </C.CardItem>
    </C.Card>
  </>
);

const styles = StyleSheet.create({
  Notification: {
    color: 'red',
    fontWeight: 'bold',
  },
  Title: {
    color: M.Colors.veniceBlue,
  },
  CardType: {
    color: M.Colors.veniceBlue,
    fontSize: 18,
  },
});
