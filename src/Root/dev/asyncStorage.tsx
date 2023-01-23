import * as React from 'react';
import asyncStorage from '@react-native-community/async-storage';

// : Components
import C from './../../Components';

// : Misc
import M from './../../Misc';

export const AsyncStorage: React.FC = () => {
  const [asyncKeys, setAsyncKeys] = React.useState<string[]>([]);
  const [forceUpdate, setForceUpdate] = React.useState(Date.now());
  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {
    setRefreshing(true);
    getAllKeys();
  }, []);

  const getAllKeys = async () => {
    const keys = await asyncStorage.getAllKeys();
    setAsyncKeys(keys ? keys : []);
    setRefreshing(false);
  };

  return (
    <C.Container>
      <C.FlatList
        style={{ flex: 1 }}
        onRefresh={() => {
          setForceUpdate(Date.now());
        }}
        refreshing={refreshing}
        keyExtractor={(i) => i}
        contentContainerStyle={{ margin: 15 }}
        renderItem={(itm) => (
          <C.Card key={itm.item} style={{ padding: 5 }}>
            <C.Text>{itm.item}</C.Text>
          </C.Card>
        )}
        data={asyncKeys.sort()}
        ListHeaderComponent={
          <>
            <C.Button style={{}} onPress={() => M.Tools.ClearAsyncStorage()} block>
              <C.Text>Clear Cache</C.Text>
            </C.Button>
          </>
        }
      />
    </C.Container>
  );
};
