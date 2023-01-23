import * as React from 'react';
import Moment from 'moment';

// : Hooks
import H, { Routes, iReduxState } from './../../../../Hooks';

// : Components
import C from './../../../../Components';

// : Misc
import M, { iArticle, iEvent } from './../../../../Misc';
import { InteractionManager } from 'react-native';

export interface iProps {}

export interface iParams {
  data: iArticle | iEvent;
}

export const PostInfo: React.FC = (props: iProps) => {
  const [debug, log, warn, error, tags, titles, legacyLog] = H.Logs.useLog({ source: 'postInfo.tsx' });
  const Route = H.NPM.navigation.useRoute();
  const params = Route.params as iParams;
  const visualDebugging = H.NPM.redux.useSelector((s: iReduxState) => s.Dev.visualDebugging);
  const nav = H.NPM.navigation.useNavigation();
  const [Analytics] = H.Firebase.useAnalytics();
  const isFocused = H.Misc.useScreenMount(Routes.feedPostInfo, { title: 'Post Info' });
  const [renderPlaceHolder, setRenderPlaceHolder] = H.NPM.react.useState(true);

  React.useEffect(() => {
    const CancelIM = InteractionManager.runAfterInteractions(() => {
      log('Interactions Manager', 'RunAfterInteractions', { id: '1635398854', special: true });
      setRenderPlaceHolder(false);
    });
    return () => {
      CancelIM.cancel();
    };
  }, []);

  if (renderPlaceHolder) {
    return (
      <C.Container style={{ backgroundColor: '#f6f6f6' }}>
        <C.Content style={{ padding: 15 }}></C.Content>
      </C.Container>
    );
  }

  return (
    <C.Container style={{ backgroundColor: '#f6f6f6' }}>
      <C.Content style={{ padding: 15 }}>
        <C.Card style={{ backgroundColor: 'white', borderRadius: 5, overflow: 'hidden' }}>
          <C.CardItem style={{ borderBottomWidth: 1, borderBottomColor: 'lightgrey' }}>
            <C.Title>{params.data.Title}</C.Title>
          </C.CardItem>

          <DataItem label="Posted By:" value={params.data.ContactPerson} />
          <DataItem label="Topic:" value={params.data.PublishToTopic} isArray />
          <DataItem label="Department:" value={params.data.PublishToDepartment} isArray />
          <DataItem label="Facility:" value={params.data.PublishToLocation} isArray />
          <DataItem label="Expiring:" value={params.data.ExpirationDate} isDate />

          <C.CardItem style={{ display: visualDebugging ? 'flex' : 'none' }}>
            <C.Text>Card Type: {params.data.PostType}</C.Text>
          </C.CardItem>

          <C.CardItem style={{ overflow: 'scroll', display: visualDebugging ? 'flex' : 'none' }}>
            <C.JSONTree data={params.data} />
          </C.CardItem>
        </C.Card>
      </C.Content>
    </C.Container>
  );
};

const DataItem = (params: { label: string; value: string; isArray?: boolean; isDate?: boolean }) => {
  const cleanParams = { ...params };
  if (params.isDate) {
    const moment = Moment(params.value);
    cleanParams.value = moment.format('MM/DD/YYYY');
  }
  if (params.isArray && params.value) cleanParams.value = params.value.split('|').join(', ');
  if (!params.label) cleanParams.label = 'Label Not Provided';
  if (!params.value) cleanParams.value = 'N/A';

  return (
    <C.CardItem>
      <C.Text style={{ fontWeight: 'bold', flex: 1 }}>{cleanParams.label}</C.Text>
      <C.Text style={{ flex: 2 }}>{cleanParams.value}</C.Text>
    </C.CardItem>
  );
};
