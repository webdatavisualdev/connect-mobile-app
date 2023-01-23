import React from 'react';
import { ListRenderItemInfo, StyleSheet } from 'react-native';

// : Hooks
import H, { iReduxState } from '../../../Hooks';

// : Components
import C from '../..';

// : Misc
import M, { iLog } from '../../../Misc';

const styles = StyleSheet.create({
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  center: {
    flex: 1,
    justifyContent: 'flex-start',
    alignContent: 'center',
    alignItems: 'center',
  },
});

export interface iParams {
  visible: boolean;
}

export const Overlay: React.FC<iParams> = (props) => {
  const [opacity, setOpacity] = React.useState(0.3);

  // : Data
  const session = H.NPM.redux.useSelector((s: iReduxState) => s.Auth.activeSession);
  const userProfile = H.Queries.useQuery_UserProfile();
  const feed = H.Queries.useQuery_Feed();
  const logs = H.NPM.redux.useSelector((s: iReduxState) => s.Dev.logs);

  const RenderLog = (i: ListRenderItemInfo<iLog>) => {
    const { type } = i.item;

    let colors = 'black';
    switch (type) {
      case 'debug':
        colors = 'grey';
        break;
      case 'error':
        colors = 'red';
        break;
      case 'log':
        colors = 'black';
        break;
      case 'warn':
        colors = 'gold';
        break;
    }

    return (
      <C.View style={{ borderWidth: 1, borderColor: colors, margin: 5, padding: 5, backgroundColor: M.Colors.white, opacity }}>
        <C.Text style={{ color: colors, fontWeight: 'bold' }}>{typeof i.item.title === 'string' ? i.item.title : 'Not a String'}</C.Text>
        <C.Text style={{ color: colors, fontSize: 12 }}>{typeof i.item.message === 'string' ? i.item.message : 'Not a String'}</C.Text>
      </C.View>
    );
  };

  if (!props.visible) return <></>;
  return (
    <>
      <C.View style={[styles.absolute, { backgroundColor: 'white', opacity }]} pointerEvents="none" />
      <C.SafeAreaView style={[styles.absolute, { width: '100%', padding: 10 }]} pointerEvents="none">
        <C.View style={{ width: '100%' }}>
          <C.Text>{`Session=${session ? 'TRUE' : 'FALSE'}`}</C.Text>
          <C.Text>{`QUERY:UserProfile=${userProfile.status}`}</C.Text>
          <C.Text>{`QUERY:Feed=${feed.status}`}</C.Text>
        </C.View>
        <C.FlatList data={logs ? logs : []} keyExtractor={(item, index) => `Key(${index})`} renderItem={RenderLog} />
      </C.SafeAreaView>
    </>
  );
};
