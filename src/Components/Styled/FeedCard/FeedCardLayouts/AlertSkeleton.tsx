import * as React from 'react';
import { StyleSheet } from 'react-native';

// : Components
import C from './../../../../Components';

export interface iProps {}

export const AlertSkeleton = () => {
  return (
    <C.Card style={styles.Article}>
      <C.SkeletonContent
        isLoading={true}
        containerStyle={{ justifyContent: 'flex-start' }}
        layout={[
          {
            key: 'socialBar',
            width: '100%',
            height: 30,
            padding: 5,
            flexDirection: 'row',
            justifyContent: 'space-around',
            children: [
              { key: 'like', width: 30, height: 20, marginHorizontal: 5 },
              { key: 'spacer', flex: 3, width: 20, height: 20 },
            ],
          },
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
