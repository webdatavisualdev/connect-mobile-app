import * as React from 'react';

// : Hooks
import H, { Routes } from './../../../../Hooks';

// : Components
import C from './../../../../Components';

// : Misc
import M, { iArticle, iEvent } from './../../../../Misc';
import { ISiteUserInfo } from '@pnp/sp/site-users/types';
import { Alert } from 'react-native';

export interface iParams {
  data: iArticle | iEvent;
}

export const PostShare: React.FC = () => {
  const [debug, log, warn, errorLog, tags, titles, legacyLog] = H.Logs.useLog({ source: 'postShare.tsx' });
  const logPress = H.Logs.useLog_userPress({ source: 'postShare.tsx' });
  const userProfile = H.Queries.useQuery_UserProfile();
  const nav = H.NPM.navigation.useNavigation();
  const Route = H.NPM.navigation.useRoute();
  const params = Route.params as iParams;
  const [selectedUser, setSelectedUser] = React.useState<ISiteUserInfo | undefined>();
  const [message, setMessage] = React.useState('');
  // const [shareFeed, cache] = H.Queries.useQuery_ShareFeedCard({ To: selectedUser?.Email || '', Message: message, Post: params.data });
  const [mutation, { status, data, error }] = H.Queries.useMutation_ShareFeedCard();

  React.useEffect(() => {
    if (status === 'loading') {
      // TODO Thinking Screen
      C.Toast.show({ text: 'Processing; need to place thinking overlay to indicate this' });
    }

    if (status === 'success') {
      C.Toast.show({ text: 'Success Sharing Post!', position: 'bottom', type: 'success', duration: 1000 * 10 });
      nav.goBack();
    }

    if (error) {
      Alert.alert('Error', `There was an error while processing your request. Please share the error below with an Administrator ${error}`);
    }
  }, [status, data, error]);

  const handle_Share = () => {
    logPress(`Sharinging_Post_${params.data.ID}`, '1612799324', 'btn', [tags.button]);
    mutation({
      From: userProfile.data?.Email as string,
      To: selectedUser?.Email as string,
      Message: message,
      Post: params.data,
    });
  };

  const handle_Cancel = () => {
    logPress(`Canceling_Share_${params.data.ID}`, '1612799229', 'btn', [tags.button]);
    nav.goBack();
  };

  const ShareCard = () => {
    return (
      <C.Card style={{ paddingTop: 0, borderRadius: 5, overflow: 'hidden' }}>
        <C.PeoplePicker setState={setSelectedUser} />

        <C.CardItem>
          <C.Textarea
            onChange={(e) => setMessage(e.nativeEvent.text)}
            value={message}
            style={{ flex: 1 }}
            rowSpan={5}
            bordered={true}
            underline={true}
            placeholder="Comment (Optional)"
          />
        </C.CardItem>

        <C.CardItem style={{ justifyContent: 'space-around' }}>
          <C.Button onPress={handle_Share} style={{ padding: 15 }} disabled={selectedUser ? false : true} block>
            <C.Text>Share</C.Text>
          </C.Button>

          <C.Button onPress={handle_Cancel} style={{ padding: 15 }} block>
            <C.Text>Cancel</C.Text>
          </C.Button>
        </C.CardItem>
      </C.Card>
    );
  };

  return (
    <C.ScrollView style={{ backgroundColor: '#f6f6f6', padding: 15 }}>
      {ShareCard()}

      <C.FlatList
        scrollEnabled={false}
        contentContainerStyle={{}}
        data={[params.data]}
        keyExtractor={(itm) => itm.ID + itm.Title}
        renderItem={(itm) => <C.FeedCard feed={itm} />}
        ListFooterComponent={() => <C.View style={{ minHeight: 30 }}></C.View>}
      />
    </C.ScrollView>
  );
};
