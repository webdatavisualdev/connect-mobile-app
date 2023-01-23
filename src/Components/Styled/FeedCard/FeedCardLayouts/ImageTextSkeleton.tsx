import * as React from 'react';
import { StyleSheet } from 'react-native';

// : Components
import C from './../../../../Components';

export interface iProps {}

export const ImageTextSkeleton = () => {
  return (
    <C.Card style={styles.Article}>
      <C.SkeletonContent
        isLoading={true}
        containerStyle={{ justifyContent: 'flex-start' }}
        layout={[
          { key: 'video', width: '100%', height: 200 },
          {
            key: 'socialBar',
            width: '100%',
            height: 30,
            padding: 5,
            flexDirection: 'row',
            justifyContent: 'space-around',
            children: [
              { key: 'like', width: 30, height: 20, marginHorizontal: 5 },
              { key: 'spacer', flex: 3, opacity: 0, width: 20, height: 20 },
              { key: 'flag', width: 30, height: 20, marginHorizontal: 5 },
              { key: 'share', width: 30, height: 20, marginHorizontal: 5 },
              { key: 'info', width: 30, height: 20, marginHorizontal: 5 },
            ],
          },
          { key: 'title', width: '25%', height: 30, margin: 5 },
          { key: 'teaser', width: '90%', height: 20, margin: 5 },
          { key: 'teaserTwo', width: '70%', height: 20, margin: 5 },
          { key: 'button', width: '50%', height: 40, margin: 5 },
        ]}
      />
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
