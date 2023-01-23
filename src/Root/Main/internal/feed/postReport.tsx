import * as React from 'react';

// : Hooks
import H, { Routes } from './../../../../Hooks';

// : Components
import C from './../../../../Components';

// : Misc
import { iArticle, iEvent } from './../../../../Misc';
import { Alert } from 'react-native';

export interface iParams {
  data: iArticle | iEvent;
}

export const PostReport: React.FC = () => {
  const [debug, log, warn, errorLog, tags, titles, legacyLog] = H.Logs.useLog({ source: 'postReport.tsx' });
  const logPress = H.Logs.useLog_userPress({ source: 'postReport.tsx' });
  const userProfile = H.Queries.useQuery_UserProfile();
  const nav = H.NPM.navigation.useNavigation();
  const Route = H.NPM.navigation.useRoute();
  const params = Route.params as iParams;
  const [message, setMessage] = React.useState('');
  const [mutation, { status, data, error }] = H.Queries.useMutation_ReportFeedCard();

  React.useEffect(() => {
    if (status === 'loading') {
      C.Toast.show({ text: 'Processing; need to place thinking overlay to indicate this' });
    }

    if (status === 'success') {
      C.Toast.show({ text: 'Success Reporting Post!', position: 'bottom', type: 'success', duration: 1000 * 10 });
      nav.goBack();
    }

    if (error) {
      Alert.alert('Error', `There was an error while processing your request. Please share the error below with an Administrator ${error}`);
    }
  }, [status, data, error]);

  const handle_Report = () => {
    logPress(`Reporting_Post_${params.data.ID}`, '1612798852', 'btn', [tags.button]);
    mutation({
      Title: params.data.Title,
      Comment: message,
      ReportedBy: userProfile.data?.Email as string,
      PostType: params.data.PostType,
      PostFacility: params.data.PublishToLocation,
      PostID: params.data.ID.toString(),
    });
  };

  const handle_Cancel = () => {
    logPress(`Canceling_Report_${params.data.ID}`, '1612799032', 'btn', [tags.button]);
    nav.goBack();
  };

  const ReportDialog = () => {
    return (
      <C.Card style={{ paddingTop: 0, borderRadius: 5, overflow: 'hidden' }}>
        <C.CardItem>
          <C.Text style={{ flex: 1, textAlign: 'center' }}>Please share below why you feel the content in this post is inappropriate.</C.Text>
        </C.CardItem>

        <C.CardItem>
          <C.Textarea
            onChange={(e) => setMessage(e.nativeEvent.text)}
            value={message}
            style={{ flex: 1 }}
            rowSpan={5}
            bordered={true}
            underline={true}
            placeholder="Comment must contain at least 6 characters"
          />
        </C.CardItem>

        <C.CardItem style={{ justifyContent: 'space-around' }}>
          <C.Button onPress={handle_Report} style={{ padding: 15 }} disabled={message.length < 6} block>
            <C.Text>Report</C.Text>
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
      {ReportDialog()}

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
