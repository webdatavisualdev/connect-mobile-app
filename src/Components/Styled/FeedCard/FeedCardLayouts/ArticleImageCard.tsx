import * as React from 'react';

// : Components
import C from './../../../../Components';

// : Misc
import M, { iArticle, iEvent } from './../../../../Misc';

// : Misc
import { iDefaultCardProps } from './iDefaultCardProps';
import { SocialBar } from './../SocialButtons';
import { StyleSheet } from 'react-native';

export interface iProps extends iDefaultCardProps<iArticle | iEvent> {}

export const ArticleImageCard: React.FC<iProps> = (props) => {
  const [item, setItem] = React.useState<iArticle | iEvent>(props.feed.item);
  const imageUrl = M.Tools.TypeGuards.isArticle(item) ? (item as iArticle).ImageUrl?.Url : (item as iEvent).BannerUrl.Url;

  return (
    <C.Card style={styles.Article}>
      <C.Image source={{ uri: imageUrl }} />
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
  SocialBar: {
    backgroundColor: 'white',
  },
  SocialBarWrap: {
    marginHorizontal: 10,
    marginVertical: 10,
  },
});
