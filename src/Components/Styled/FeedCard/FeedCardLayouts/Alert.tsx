import * as React from 'react';

// : Components
import C from './../../../../Components';
import FAIcon from 'react-native-vector-icons/FontAwesome';

// : Misc
import M, { iArticle, iEvent } from './../../../../Misc';

// : Misc
import { iDefaultCardProps } from './iDefaultCardProps';
import { StyleSheet } from 'react-native';

export interface iProps extends iDefaultCardProps<iArticle | iEvent> {}

export const Alert: React.FC<iProps> = (props) => {
  const [item, setItem] = React.useState<iArticle | iEvent>(props.feed.item);
  const [accentColor, contrastingColor] = M.Tools.interpretAccentColor(item.AccentColor);

  return (
    <C.Card style={styles.Article}>
      <C.CardItem style={{ backgroundColor: accentColor }}>
        <FAIcon name={item?.Icon} style={{ fontSize: 21, color: contrastingColor }} />
        <C.Text style={{ paddingHorizontal: 10, color: contrastingColor }}>{item.Title}</C.Text>
      </C.CardItem>
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
});
