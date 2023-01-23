import * as React from 'react';
import { ListRenderItemInfo } from 'react-native';

// : Hooks
import H from './../../Hooks';

// : Components
import C from './../../Components';

export const FCMManager: React.FC = () => {
  const [FCM, TopicsManager] = H.Firebase.useFirebaseCloudMessaging();
  const [ForceUpdate, setForceUpdate] = React.useState(Date.now());
  const [inputTopic, setInputTopic] = React.useState<string>('');
  const [topics, setTopics] = React.useState<string[]>([]);

  const hardCodedChannels = ['dev_Test', 'dev_Releases', 'dev_Demo'];

  React.useEffect(() => {
    setTopics(TopicsManager.allSubscribedTopics().map((t) => t.value));
  }, [ForceUpdate]);

  const handle_Subscribe = (topic?: string) => {
    if (topic) {
      TopicsManager.subscribeToTopic(topic);
    } else {
      TopicsManager.subscribeToTopic(inputTopic);
      setInputTopic('');
    }
    setForceUpdate(Date.now());
  };

  const handle_unSubscribe = (topics: string | string[]) => {
    if (typeof topics === 'string') {
      // Single Item
      TopicsManager.unsubscribeToTopic(topics);
    } else {
      // Array Detected
      topics.forEach((t) => TopicsManager.unsubscribeToTopic(t));
    }
    setForceUpdate(Date.now());
  };

  const HeaderComponent = (
    <>
      <C.View style={{ padding: 15 }}>
        <C.Form>
          <C.Item stackedLabel>
            <C.Label>Subscribe to Topic</C.Label>
            <C.Input onChange={(t) => setInputTopic(t.nativeEvent.text)} value={inputTopic} />
          </C.Item>
          <C.Button onPress={handle_Subscribe} style={{ marginTop: 15, marginHorizontal: 15 }} transparent bordered primary block>
            <C.Icon name="add" />
          </C.Button>

          <C.View style={{ flexDirection: 'row', margin: 15 }}>
            {hardCodedChannels.map((i) => {
              return (
                <>
                  <C.Button
                    style={{ margin: 5 }}
                    small
                    key={`HardCodedChannelButton:${i}`}
                    onPress={() => {
                      handle_Subscribe(i);
                    }}>
                    <C.Text>{i}</C.Text>
                  </C.Button>
                </>
              );
            })}
          </C.View>

          <C.Button
            disabled
            block
          >
            <C.Text>Unsubscribe from Everything</C.Text>
          </C.Button>
        </C.Form>
      </C.View>
    </>
  );

  const RenderItem = (i: ListRenderItemInfo<string>) => {
    return (
      <>
        <C.View style={{ display: 'flex', flexDirection: 'row', padding: 15 }}>
          <C.Text style={{ flex: 2 }}>{i.item}</C.Text>
          <C.Button onPress={() => handle_unSubscribe(i.item)} icon small transparent bordered danger block>
            <C.Text style={{ color: 'red' }}>Delete</C.Text>
          </C.Button>
        </C.View>
      </>
    );
  };

  return (
    <C.Container>
      <C.Content>
        <C.FlatList ListHeaderComponent={HeaderComponent} keyExtractor={(i) => i} renderItem={RenderItem} data={topics} />
      </C.Content>
    </C.Container>
  );
};
